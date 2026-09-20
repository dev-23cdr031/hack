import { NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"
import { APP_PAGES } from "@/lib/page-registry"

export async function GET() {
  const defaults = APP_PAGES.map(p => ({ ...p, is_enabled: true }))

  try {
    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase
      .from("page_access")
      .select("page_path, page_name, is_enabled")

    // If the table doesn't exist yet (SQL not run), report everything as enabled
    if (error) {
      console.warn("[page-access] table unavailable:", error.message)
      return NextResponse.json({ pages: defaults })
    }

    const statusMap = new Map((data || []).map((r: any) => [r.page_path, r.is_enabled]))

    return NextResponse.json({
      pages: APP_PAGES.map(p => ({
        ...p,
        is_enabled: statusMap.has(p.path) ? statusMap.get(p.path) === true : true,
      })),
    })
  } catch (e) {
    console.error("[page-access] GET error:", e)
    return NextResponse.json({ pages: defaults })
  }
}
