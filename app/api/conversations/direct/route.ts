import { NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"
import { getApiSessionUser } from "@/lib/api-auth"

/**
 * POST /api/conversations/direct
 * Body: { "user_id": "<other user id>" }
 *
 * Finds the existing 1:1 conversation between the signed-in user and
 * `user_id`, or creates it (plus both participants) if none exists.
 * Only returns/creates ONE direct conversation per user pair.
 */
export async function POST(request: NextRequest) {
  const supabase = createServerSupabaseClient()

  const { user, error } = await getApiSessionUser(request)
  if (!user) {
    return NextResponse.json({ error: error || "Authentication required" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const otherUserId: string | undefined = body?.user_id

    if (!otherUserId) {
      return NextResponse.json({ error: "user_id is required" }, { status: 400 })
    }

    if (otherUserId === user.id) {
      return NextResponse.json({ error: "Cannot start a conversation with yourself" }, { status: 400 })
    }

    // Resolve the other user's profile (must be a registered user).
    const { data: otherUser, error: otherError } = await supabase
      .from("users")
      .select("id, name, email, username, avatar_url, bio, title, skills, college, hackathon_interests, location")
      .eq("id", otherUserId)
      .maybeSingle()

    if (otherError || !otherUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Atomically find-or-create the shared direct conversation.
    const { data: conversationId, error: rpcError } = await supabase.rpc(
      "get_or_create_direct_conversation",
      { p_user_a: user.id, p_user_b: otherUserId }
    )

    if (rpcError || !conversationId) {
      console.error("get_or_create_direct_conversation failed:", rpcError)
      return NextResponse.json({ error: "Failed to open conversation" }, { status: 500 })
    }

    // Latest message preview for the conversation.
    const { data: lastMsg } = await supabase
      .from("messages")
      .select("content, created_at, sender_id")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle()

    return NextResponse.json({
      conversation_id: conversationId,
      conversation: {
        id: conversationId,
        name: otherUser.name || "User",
        type: "direct",
        avatar_url: otherUser.avatar_url || "",
        last_message: lastMsg?.content || "",
        last_message_time: lastMsg?.created_at || "",
        unread_count: 0,
        participants: [
          {
            id: otherUser.id,
            name: otherUser.name || "User",
            avatar_url: otherUser.avatar_url || "",
            bio: otherUser.bio || "",
            title: otherUser.title || "",
            username: otherUser.username || "",
            college: otherUser.college || "",
            status: "offline",
          },
        ],
      },
      other_user: otherUser,
    })
  } catch (err) {
    console.error("Direct conversation API error:", err)
    return NextResponse.json({ error: "Failed to open conversation" }, { status: 500 })
  }
}
