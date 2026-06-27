import { NextRequest, NextResponse } from "next/server"
import { mockHackathons } from "@/lib/mock-hackathons"
import type { Hackathon } from "@/lib/types"

let createdHackathons: Hackathon[] = []

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json().catch(() => ({}))
    const hackathon = [...mockHackathons, ...createdHackathons].find((event) => event.id === params.id)

    if (!hackathon) {
      return NextResponse.json({ error: "Hackathon not found" }, { status: 404 })
    }

    const userId = body?.userId || `mock-user-${Date.now()}`

    if (hackathon.current_participants < (hackathon.max_participants || Infinity)) {
      hackathon.current_participants += 1
    }

    return NextResponse.json({
      success: true,
      authUserId: userId,
      message: "Successfully registered for the hackathon",
    })
  } catch (e: any) {
    console.error("Registration error:", e)
    return NextResponse.json({ error: e?.message || "Failed to register" }, { status: 500 })
  }
}

