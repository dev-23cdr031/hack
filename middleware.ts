// Global page on/off control.
// The admin can disable a page inside /admin → "Page Access".
// Disabled pages get redirected to /blocked (their settings live in Supabase `page_access`).
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Fail-open by default is critical: if the table doesn't exist or Supabase is down,
// every page stays accessible so the site never breaks.
const CACHE_TTL_MS = 30_000
let cachedDisabledPaths: string[] | null = null
let cachedAt = 0

// Paths that can never be blocked
const ALWAYS_ALLOWED_RESULT = NextResponse.next()

function isAlwaysAllowed(pathname: string): boolean {
  return (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/blocked") ||
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico"
  )
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (isAlwaysAllowed(pathname)) {
    return ALWAYS_ALLOWED_RESULT
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.next()
  }

  try {
    if (!cachedDisabledPaths || Date.now() - cachedAt > CACHE_TTL_MS) {
      const supabase = createClient(supabaseUrl, supabaseAnonKey, {
        auth: { persistSession: false },
      })
      const { data, error } = await supabase
        .from("page_access")
        .select("page_path")
        .eq("is_enabled", false)

      if (error) {
        // Table missing / not configured yet → treat as "no page disabled"
        cachedDisabledPaths = []
      } else {
        cachedDisabledPaths = (data || []).map((row: any) => row.page_path ?? "/")
      }
      cachedAt = Date.now()
    }

    const isBlocked = cachedDisabledPaths.some((pagePath) => {
      if (!pagePath) return false
      if (pagePath === "/") return pathname === "/"
      if (pathname === pagePath) return true
      // Prefix match blocks dynamic child routes, e.g. /teams/find when /teams is OFF
      return pathname.startsWith(pagePath.endsWith("/") ? pagePath : pagePath + "/")
    })

    if (isBlocked) {
      const blockedUrl = new URL("/blocked", request.url)
      blockedUrl.searchParams.set("page", pathname)
      return NextResponse.redirect(blockedUrl)
    }
  } catch (err) {
    console.error("[page-access] middleware error (failing open):", err)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
