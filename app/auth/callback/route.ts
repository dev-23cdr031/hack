import { NextRequest, NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

// OAuth (Google) callback: exchanges the provider code for a Supabase
// session, then hands off to /auth/callback (client page) which syncs the
// app's localStorage client + profile.
export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const code = url.searchParams.get("code")
  const next = url.searchParams.get("next") || "/"

  if (code) {
    const supabase = createRouteHandlerClient({ cookies })
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (error) {
      console.error("OAuth callback error:", error.message)
    }
  }

  const redirectUrl = new URL("/auth/callback-sync", url.origin)
  redirectUrl.searchParams.set("next", next)
  return NextResponse.redirect(redirectUrl.toString())
}
