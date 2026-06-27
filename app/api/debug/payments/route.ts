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

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabase()
    console.log("Creating payments and subscriptions tables...")

    // Read and execute the payments table creation script
    const createPaymentsScript = `
      -- Create payments table
      CREATE TABLE IF NOT EXISTS payments (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
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
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        payment_id UUID REFERENCES payments(id) ON DELETE SET NULL,
        plan_type VARCHAR(50) NOT NULL,
        status VARCHAR(20) DEFAULT 'active',
        start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        end_date TIMESTAMP WITH TIME ZONE,
        auto_renew BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- Create indexes for better performance
      CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
      CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
      CREATE INDEX IF NOT EXISTS idx_payments_transaction_id ON payments(transaction_id);
      CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
      CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
    `

    const { error } = await supabase.rpc("exec_sql", { sql: createPaymentsScript })

    if (error) {
      console.error("Error creating payments tables:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Verify tables were created
    const { data: paymentsTable, error: paymentsError } = await supabase.from("payments").select("*").limit(1)

    const { data: subscriptionsTable, error: subscriptionsError } = await supabase
      .from("subscriptions")
      .select("*")
      .limit(1)

    return NextResponse.json({
      success: true,
      message: "Payments and subscriptions tables created successfully",
      tables: {
        payments: paymentsError ? "Error accessing table" : "Table accessible",
        subscriptions: subscriptionsError ? "Error accessing table" : "Table accessible",
      },
    })
  } catch (error) {
    console.error("Database setup error:", error)
    return NextResponse.json(
      {
        error: "Failed to create payments tables",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  try {
    const supabase = getSupabase()
    // Check if payments tables exist
    const { data: payments, error: paymentsError } = await supabase.from("payments").select("count(*)").limit(1)

    const { data: subscriptions, error: subscriptionsError } = await supabase
      .from("subscriptions")
      .select("count(*)")
      .limit(1)

    return NextResponse.json({
      tables: {
        payments: {
          exists: !paymentsError,
          error: paymentsError?.message || null,
          count: payments?.[0]?.count || 0,
        },
        subscriptions: {
          exists: !subscriptionsError,
          error: subscriptionsError?.message || null,
          count: subscriptions?.[0]?.count || 0,
        },
      },
    })
  } catch (error) {
    console.error("Database check error:", error)
    return NextResponse.json(
      {
        error: "Failed to check payments tables",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
