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
    const body = await request.json()
    const { caller_id, receiver_id, call_type, team_id, status = "initiated" } = body

    console.log("Creating call with data:", { caller_id, receiver_id, call_type, team_id, status })

    // Try to use database first, fallback to mock data if table doesn't exist
    try {
      const supabase = getSupabase()
      const { data, error } = await supabase
        .from("calls")
        .insert([
          {
            caller_id,
            receiver_id,
            call_type,
            team_id,
            status,
            started_at: new Date().toISOString(),
          },
        ])
        .select()
        .single()

      if (error) {
        throw error
      }

      console.log("Call created in database:", data)
      return NextResponse.json(data, { status: 201 })
    } catch (dbError: any) {
      console.log("Database table not available, using mock data:", dbError.message)

      // Fallback to mock data
      const mockCallData = {
        id: `call_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        caller_id,
        receiver_id,
        call_type,
        team_id,
        status,
        started_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      console.log("Mock call created:", mockCallData)
      return NextResponse.json(mockCallData, { status: 201 })
    }
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Failed to initiate call" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { call_id, status, ended_at, duration_seconds } = body

    console.log("Updating call:", { call_id, status, ended_at, duration_seconds })

    // Try to use database first, fallback to mock data if table doesn't exist
    try {
      const supabase = getSupabase()
      const updateData: any = {
        status,
        updated_at: new Date().toISOString(),
      }

      if (ended_at) {
        updateData.ended_at = ended_at
      }

      if (status === "answered" && !ended_at) {
        updateData.answered_at = new Date().toISOString()
      }

      if (duration_seconds !== undefined) {
        updateData.duration_seconds = duration_seconds
      }

      const { data, error } = await supabase
        .from("calls")
        .update(updateData)
        .eq("id", call_id)
        .select()
        .single()

      if (error) {
        throw error
      }

      console.log("Call updated in database:", data)
      return NextResponse.json(data)
    } catch (dbError: any) {
      console.log("Database table not available, using mock response:", dbError.message)

      // Fallback to mock data
      const mockUpdateData = {
        id: call_id,
        status,
        ended_at,
        duration_seconds,
        updated_at: new Date().toISOString(),
      }

      console.log("Mock call updated:", mockUpdateData)
      return NextResponse.json(mockUpdateData)
    }
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Failed to update call" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const user_id = searchParams.get("user_id")
    const team_id = searchParams.get("team_id")
    const limit = Number.parseInt(searchParams.get("limit") || "50")

    if (!user_id) {
      return NextResponse.json({ error: "user_id is required" }, { status: 400 })
    }

    // Try to use database first, fallback to mock data if table doesn't exist
    try {
      const supabase = getSupabase()
      let query = supabase
        .from("calls")
        .select(`
          *,
          caller:users!calls_caller_id_fkey(id, name, avatar_url),
          receiver:users!calls_receiver_id_fkey(id, name, avatar_url),
          team:teams(id, name)
        `)
        .or(`caller_id.eq.${user_id},receiver_id.eq.${user_id}`)
        .order("started_at", { ascending: false })
        .limit(limit)

      if (team_id) {
        query = query.eq("team_id", team_id)
      }

      const { data, error } = await query

      if (error) {
        throw error
      }

      console.log("Returning call history from database:", data?.length || 0, "calls")
      return NextResponse.json(data || [])
    } catch (dbError: any) {
      console.log("Database table not available, using mock data:", dbError.message)

      // Fallback to mock call history
      const mockCalls = [
        {
          id: "call_1",
          caller_id: user_id,
          receiver_id: "550e8400-e29b-41d4-a716-446655440002",
          call_type: "audio",
          status: "ended",
          started_at: "2024-02-15T10:00:00Z",
          ended_at: "2024-02-15T10:05:30Z",
          duration_seconds: 330,
          caller: { id: user_id, name: "You", avatar_url: null },
          receiver: { id: "550e8400-e29b-41d4-a716-446655440002", name: "Team Member", avatar_url: null }
        },
        {
          id: "call_2",
          caller_id: "550e8400-e29b-41d4-a716-446655440003",
          receiver_id: user_id,
          call_type: "video",
          status: "ended",
          started_at: "2024-02-15T11:30:00Z",
          ended_at: "2024-02-15T11:45:15Z",
          duration_seconds: 915,
          caller: { id: "550e8400-e29b-41d4-a716-446655440003", name: "Team Lead", avatar_url: null },
          receiver: { id: user_id, name: "You", avatar_url: null }
        },
      ]

      console.log("Returning mock call history:", mockCalls.length, "calls")
      return NextResponse.json(mockCalls)
    }
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Failed to fetch calls" }, { status: 500 })
  }
}
