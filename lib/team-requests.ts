import { createServerSupabaseClient } from "@/lib/supabase"

/**
 * Shared helper for the team-join-request API routes.
 *
 * Loads all join requests for a team from Supabase and attaches the
 * requester's profile (from the users table) plus basic team info, so the
 * frontend (team manage / accept requests page, notification bell, modal)
 * can render requesters directly.
 */
export async function fetchTeamJoinRequests(
  teamId: string,
  supabase = createServerSupabaseClient()
) {
  const { data: rows } = await supabase
    .from("team_join_requests")
    .select("*")
    .eq("team_id", teamId)
    .order("created_at", { ascending: false })

  if (!rows || rows.length === 0) {
    return []
  }

  // Load requester profiles in one query
  const userIds = Array.from(new Set(rows.map((r: any) => r.user_id).filter(Boolean)))
  const usersMap: Record<string, any> = {}
  if (userIds.length > 0) {
    try {
      const { data: users } = await supabase.from("users").select("*").in("id", userIds)
      for (const u of users || []) usersMap[u.id] = u
    } catch (e) {
      console.error("fetchTeamJoinRequests: users lookup failed", e)
    }
  }

  // Team summary info
  let teamInfo: any = null
  try {
    const { data: team } = await supabase
      .from("teams")
      .select("id, name, description, current_members, max_members, leader_id")
      .eq("id", teamId)
      .maybeSingle()
    if (team) teamInfo = team
  } catch (e) {
    console.error("fetchTeamJoinRequests: team lookup failed", e)
  }

  return rows.map((r: any) => {
    const requester = usersMap[r.user_id]
    return {
      id: r.id,
      team_id: r.team_id,
      user_id: r.user_id,
      message: r.message || "",
      status: r.status,
      created_at: r.created_at,
      updated_at: r.updated_at,
      reviewed_at: r.reviewed_at,
      reviewed_by: r.reviewed_by,
      user: requester || {
        id: r.user_id,
        name: `User ${String(r.user_id || "").substring(0, 6)}`,
        email: "",
        avatar_url: "/placeholder-user.jpg",
        title: "",
        bio: "",
        skills: [],
      },
      team: teamInfo,
    }
  })
}

/** Builds the { requests, count, pending, approved, rejected } payload. */
export function summarizeJoinRequests(requests: any[]) {
  return {
    requests,
    count: requests.length,
    pending: requests.filter((r) => r.status === "pending").length,
    approved: requests.filter((r) => r.status === "approved").length,
    rejected: requests.filter((r) => r.status === "rejected").length,
  }
}
