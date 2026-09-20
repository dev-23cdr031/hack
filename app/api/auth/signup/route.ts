import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { isAdminEmail } from "@/lib/admin"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password, bio, location, experienceLevel } = body

    // Basic validation
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email and password are required" }, { status: 400 })
    }

    const normalizedEmail = String(email).trim().toLowerCase()
    if (!normalizedEmail) {
      return NextResponse.json({ error: "A valid email is required" }, { status: 400 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({ error: "Supabase is not configured" }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    // Check if user is admin
    const isAdmin = isAdminEmail(normalizedEmail)

    // Create user in Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
      options: {
        data: {
          full_name: name.trim(),
          bio: bio || "",
          location: location || "",
          experience_level: experienceLevel || "beginner",
        },
      },
    })

    if (error) {
      return NextResponse.json({ error: error.message || "Signup failed" }, { status: 400 })
    }

    if (!data.user) {
      return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
    }

    const authEmail = (data.user.email ?? normalizedEmail)?.trim().toLowerCase()
    if (!authEmail) {
      return NextResponse.json({ error: "A valid email is required to create your profile" }, { status: 400 })
    }

    // Create user profile in the users table
    let profileError = null
    try {
      const { error } = await supabase.from("users").insert({
        id: data.user.id,
        email: authEmail,
        name: name.trim(),
        bio: bio || "New HackConnect user",
        title: experienceLevel ? `${experienceLevel.charAt(0).toUpperCase()}${experienceLevel.slice(1)} Developer` : "Developer",
        skills: ["JavaScript", "React"],
        avatar_url: "/placeholder-user.jpg",
      })
      profileError = error
    } catch (e) {
      console.error("Error creating profile:", e)
    }

    return NextResponse.json({
      success: true,
      user: {
        id: data.user.id,
        email: authEmail,
        name: name.trim(),
        bio: bio || "New HackConnect user",
        title: experienceLevel ? `${experienceLevel.charAt(0).toUpperCase()}${experienceLevel.slice(1)} Developer` : "Developer",
        skills: ["JavaScript", "React"],
        avatar_url: "/placeholder-user.jpg",
        isAdmin,
      },
      message: profileError
        ? "Account created successfully (profile will be set up on first login)"
        : "Account created successfully",
    })
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}