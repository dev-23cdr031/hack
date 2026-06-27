import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

function getSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Supabase environment variables are not configured")
  }

  return createClient(supabaseUrl, serviceRoleKey)
}

async function ensurePaymentTablesExist() {
  try {
    const supabase = getSupabase()
    // Try to access payments table
    const { error: paymentsError } = await supabase.from("payments").select("id").limit(1)

    if (paymentsError && paymentsError.message.includes("does not exist")) {
      // Create tables if they don't exist
      const createTablesScript = `
        -- Create payments table
        CREATE TABLE IF NOT EXISTS payments (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          user_id UUID,
          amount DECIMAL(10,2) NOT NULL,
          currency VARCHAR(3) DEFAULT 'USD',
          payment_method VARCHAR(50) NOT NULL,
          payment_gateway VARCHAR(50) NOT NULL,
          transaction_id VARCHAR(255) UNIQUE NOT NULL,
          status VARCHAR(20) DEFAULT 'pending',
          plan_type VARCHAR(50) NOT NULL,
          metadata JSONB DEFAULT '{}',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- Create subscriptions table
        CREATE TABLE IF NOT EXISTS subscriptions (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          user_id UUID,
          payment_id UUID,
          plan_type VARCHAR(50) NOT NULL,
          status VARCHAR(20) DEFAULT 'active',
          start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          end_date TIMESTAMP WITH TIME ZONE,
          auto_renew BOOLEAN DEFAULT true,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- Create indexes
        CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
        CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
        CREATE INDEX IF NOT EXISTS idx_payments_transaction_id ON payments(transaction_id);
        CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
        CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
      `

      // Execute the SQL directly
      const { error: createError } = await supabase.rpc("exec_sql", {
        sql: createTablesScript,
      })

      if (createError) {
        console.error("Failed to create tables:", createError)
        throw new Error("Could not create payment tables")
      }
    }

    return true
  } catch (error) {
    console.error("Error ensuring payment tables exist:", error)
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabase()
    // Ensure tables exist before processing payment
    const tablesReady = await ensurePaymentTablesExist()
    if (!tablesReady) {
      return NextResponse.json(
        {
          error: "Payment system not ready. Please contact support.",
          code: "TABLES_NOT_READY",
        },
        { status: 503 },
      )
    }

    const body = await request.json()
    const { userId, amount, paymentMethod, planType } = body

    // Generate unique transaction ID
    const transactionId = `TXN_${paymentMethod.toUpperCase()}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Mock payment processing (in real app, integrate with actual payment gateways)
    const paymentGateways = {
      gpay: "KEC Pay",
      phonepe: "PhonePe",
      amazonpay: "Amazon Pay",
      paytm: "Paytm",
      card: "Razorpay",
    }

    // Simulate payment processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Create payment record
    const { data: payment, error: paymentError } = await supabase
      .from("payments")
      .insert({
        user_id: userId || "demo-user-id",
        amount: amount,
        currency: "USD",
        payment_method: paymentMethod,
        payment_gateway: paymentGateways[paymentMethod as keyof typeof paymentGateways] || "Unknown",
        transaction_id: transactionId,
        status: "completed",
        plan_type: planType,
        metadata: {
          processed_at: new Date().toISOString(),
          gateway_response: "SUCCESS",
          payment_mode: paymentMethod,
        },
      })
      .select()
      .single()

    if (paymentError) {
      console.error("Payment creation error:", paymentError)
      return NextResponse.json(
        {
          error: "Payment processing failed",
          details: paymentError.message,
        },
        { status: 500 },
      )
    }

    // Calculate subscription end date based on plan type
    const endDate = new Date()
    switch (planType) {
      case "pro_trial":
        endDate.setDate(endDate.getDate() + 7) // 7 days trial
        break
      case "pro_monthly":
        endDate.setMonth(endDate.getMonth() + 1) // 1 month
        break
      case "pro_yearly":
        endDate.setFullYear(endDate.getFullYear() + 1) // 1 year
        break
    }

    // Create subscription record
    const { data: subscription, error: subscriptionError } = await supabase
      .from("subscriptions")
      .insert({
        user_id: userId || "demo-user-id",
        payment_id: payment.id,
        plan_type: planType,
        status: planType === "pro_trial" ? "trial" : "active",
        end_date: endDate.toISOString(),
        auto_renew: planType !== "pro_trial",
      })
      .select()
      .single()

    if (subscriptionError) {
      console.error("Subscription creation error:", subscriptionError)
      return NextResponse.json(
        {
          error: "Subscription creation failed",
          details: subscriptionError.message,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      payment: payment,
      subscription: subscription,
      transactionId: transactionId,
    })
  } catch (error) {
    console.error("Payment API error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabase()
    // Ensure tables exist
    const tablesReady = await ensurePaymentTablesExist()
    if (!tablesReady) {
      return NextResponse.json({
        error: "Payment system not ready",
        payments: [],
        subscriptions: [],
      })
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId") || "demo-user-id"

    // Get user's payment history
    const { data: payments, error: paymentsError } = await supabase
      .from("payments")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (paymentsError) {
      console.error("Payments fetch error:", paymentsError)
    }

    // Get user's subscriptions
    const { data: subscriptions, error: subscriptionsError } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (subscriptionsError) {
      console.error("Subscriptions fetch error:", subscriptionsError)
    }

    return NextResponse.json({
      payments: payments || [],
      subscriptions: subscriptions || [],
    })
  } catch (error) {
    console.error("Payment history API error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        payments: [],
        subscriptions: [],
      },
      { status: 500 },
    )
  }
}
