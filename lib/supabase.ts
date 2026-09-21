import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://demo.supabase.co"
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "demo-key"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const createServerSupabaseClient = () => {
  const serverUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://demo.supabase.co"
  const serverKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "demo-service-key"

  return createClient(serverUrl, serverKey)
}

/**
 * Returns the current access token for the active Supabase session.
 * Used to attach to API requests so server-side routes can verify the caller.
 */
export async function getSupabaseAccessToken(): Promise<string | null> {
  try {
    const { data } = await supabase.auth.getSession()
    return data?.session?.access_token || null
  } catch (err) {
    console.error("Failed to read Supabase session:", err)
    return null
  }
}

/** Build an Authorization header from the current session token (or null). */
export async function getAuthHeaders(): Promise<Record<string, string>> {
  const token = await getSupabaseAccessToken()
  const headers: Record<string, string> = { "Content-Type": "application/json" }
  if (token) headers["Authorization"] = `Bearer ${token}`
  return headers
}
