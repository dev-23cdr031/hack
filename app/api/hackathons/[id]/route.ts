import { NextRequest, NextResponse } from "next/server"
import { mockHackathons } from "@/lib/mock-hackathons"
import type { Hackathon } from "@/lib/types"

let createdHackathons: Hackathon[] = []

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const hackathon = [...mockHackathons, ...createdHackathons].find((event) => event.id === params.id)

    if (!hackathon) {
      return NextResponse.json({ error: "Hackathon not found" }, { status: 404 })
    }

    return NextResponse.json({ hackathon })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Failed to fetch hackathon" }, { status: 500 })
  }
}
