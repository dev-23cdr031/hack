import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { isAdminEmail } from "@/lib/admin"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Basic validation
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({ error: "Supabase is not configured" }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    // Sign in with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.toLowerCase().trim(),
      password,
    })

    if (error) {
      return NextResponse.json({ error: error.message || "Invalid credentials" }, { status: 401 })
    }

    const user = data.user
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 401 })
    }

    const accountEmail = (user.email ?? email)?.trim().toLowerCase()
    if (!accountEmail) {
      return NextResponse.json({ error: "A valid email is required for this account" }, { status: 400 })
    }

    // Check if user is admin
    const isAdmin = isAdminEmail(accountEmail)

    // Get or create user profile
    let profile = null
    const { data: existingProfile, error: profileError } = await supabase
      .from("users")
      .select("*")
      .eq("email", accountEmail)
      .single()

    if (!profileError && existingProfile) {
      profile = existingProfile
    } else {
      // Create profile if it doesn't exist
      const { data: newProfile, error: createError } = await supabase
        .from("users")
        .insert({
          id: user.id,
          email: accountEmail,
          name: user.user_metadata?.full_name || accountEmail.split("@")[0] || "User",
          bio: "New HackConnect user",
          title: "Developer",
          skills: ["JavaScript", "React"],
          avatar_url: "/placeholder-user.jpg",
        })
        .select()
        .single()

      if (!createError && newProfile) {
        profile = newProfile
      }
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: accountEmail,
        name: profile?.name || user.user_metadata?.full_name || accountEmail.split("@")[0] || "User",
        bio: profile?.bio || "New HackConnect user",
        title: profile?.title || "Developer",
        skills: profile?.skills || ["JavaScript", "React"],
        avatar_url: profile?.avatar_url || "/placeholder-user.jpg",
        isAdmin,
      },
      isAdmin,
      message: "Login successful",
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}