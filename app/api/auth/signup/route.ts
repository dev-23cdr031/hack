import { type NextRequest, NextResponse } from "next/server"
import { mockUsers } from "@/app/api/users/mockData"

const avatarPool = [
  "/team/dev-dharrshan.jpg",
  "/team/divya-dharshini.jpg",
  "/team/anusree.jpg",
  "/team/divakar.jpg",
  "/team/hemapriya.jpg",
  "/team/bharani.jpg",
]

function buildMockSignupUser(body: {
  name: string
  email: string
  bio?: string
  experienceLevel?: string
}) {
  const slug = body.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
  const avatarIndex = Math.abs(body.email.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0)) % avatarPool.length

  return {
    id: slug || body.email.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
    name: body.name.trim(),
    email: body.email.toLowerCase(),
    bio: body.bio || "New HackConnect user",
    title: body.experienceLevel ? `${body.experienceLevel.charAt(0).toUpperCase()}${body.experienceLevel.slice(1)} Developer` : "Developer",
    skills: ["JavaScript", "React"],
    avatar_url: avatarPool[avatarIndex],
    github_url: "",
    linkedin_url: "",
    portfolio_url: "",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password } = body

    // Basic validation
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email and password are required" }, { status: 400 })
    }

    if (mockUsers.some((user) => user.email.toLowerCase() === email.toLowerCase())) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 409 })
    }

    return NextResponse.json({
      success: true,
      user: buildMockSignupUser(body),
      message: "Account created successfully",
    })
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
