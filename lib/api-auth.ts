import { NextRequest } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

/**
 * Server-side auth helper for API routes.
 *
 * Verifies the caller's Supabase session. The bearer token is sent by the
 * app's client (see lib/supabase.ts -> getAuthHeaders) and is validated
 * against Supabase Auth. The service-role client is only used to *validate*
 * the token - it is never exposed to the browser.
 */
export async function getApiSessionUser(request: NextRequest) {
  const supabase = createServerSupabaseClient()
  const authHeader = request.headers.get("authorization") || ""

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length).trim()
    : null

  if (!token) {
    return { user: null, error: null }
  }

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token)

    if (error || !user) {
      return { user: null, error: error?.message || "Invalid session" }
    }

    return { user, error: null }
  } catch (err) {
    console.error("getApiSessionUser error:", err)
    return { user: null, error: "Invalid session" }
  }
}

