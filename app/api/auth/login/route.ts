import { type NextRequest, NextResponse } from "next/server"
import { mockUsers } from "@/app/api/users/mockData"

const demoPasswords = new Set(["demo123", "student123", "password123"])
const demoAliases = new Set(["demo@hackconnect.dev", "student@hackconnect.dev", "demo@example.com"])

function getMockLoginUser(email: string) {
  const normalizedEmail = email.toLowerCase().trim()

  return mockUsers.find((user) => user.email.toLowerCase() === normalizedEmail) || null
}

function createLocalUser(email: string) {
  const name = email.split("@")[0].replace(/[._-]+/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())

  return {
    id: email.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "demo-user",
    name,
    email: email.toLowerCase(),
    bio: "New HackConnect user",
    title: "Developer",
    skills: ["JavaScript", "React"],
    avatar_url: "/placeholder-user.jpg",
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
    const { email, password } = body

    // Basic validation
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const normalizedEmail = email.toLowerCase().trim()
    const isDemoAlias = demoAliases.has(normalizedEmail)

    if (isDemoAlias && demoPasswords.has(String(password))) {
      return NextResponse.json({
        success: true,
        user: createLocalUser(normalizedEmail),
        message: "Login successful",
      })
    }

    if (isDemoAlias) {
      return NextResponse.json({ error: "Invalid demo password" }, { status: 401 })
    }

    const demoUser = getMockLoginUser(email)
    if (demoUser && demoPasswords.has(String(password))) {
      return NextResponse.json({
        success: true,
        user: demoUser,
        message: "Login successful",
      })
    }

    if (demoUser) {
      return NextResponse.json({ error: "Invalid demo password" }, { status: 401 })
    }

    return NextResponse.json({
      success: true,
      user: createLocalUser(email),
      message: "Login successful",
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
