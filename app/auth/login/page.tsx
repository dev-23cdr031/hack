"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, LogIn, ArrowLeft, Mail, Lock, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { isAdminEmail } from "@/lib/admin"

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Basic validation
    if (!formData.email.trim() || !formData.password.trim()) {
      setError("Please fill in all fields")
      setLoading(false)
      return
    }

    if (!formData.email.includes("@") || formData.email.length < 5) {
      setError("Please enter a valid email address")
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long")
      setLoading(false)
      return
    }

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      })

      if (signInError) throw signInError
      if (!data.user) throw new Error("Login failed")

      const { data: existingProfile, error: existingProfileError } = await supabase
        .from("users")
        .select("*")
        .eq("id", data.user.id)
        .maybeSingle()

      if (existingProfileError && existingProfileError.code !== "PGRST116") {
        throw existingProfileError
      }

      if (!existingProfile) {
        const { error: upsertError } = await supabase.from("users").insert({
          id: data.user.id,
          email: data.user.email || "",
          name: data.user.user_metadata?.full_name || data.user.email?.split("@")[0] || "User",
          bio: data.user.user_metadata?.bio || "New HackConnect user",
          title: data.user.user_metadata?.title || "Developer",
          skills: Array.isArray(data.user.user_metadata?.skills) ? data.user.user_metadata.skills : ["JavaScript", "React"],
          avatar_url: data.user.user_metadata?.avatar_url || "/placeholder-user.jpg",
          location: data.user.user_metadata?.location || null,
          experience_level: data.user.user_metadata?.experience_level || data.user.user_metadata?.role || "beginner",
          role: data.user.user_metadata?.role || "student",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })

        if (upsertError) {
          console.error("Failed to create user profile row:", upsertError)
        }
      }

      const currentUser = {
        id: data.user.id,
        email: data.user.email || "",
        name: data.user.user_metadata?.full_name || data.user.email?.split("@")[0] || "User",
        bio: data.user.user_metadata?.bio || "",
        title: data.user.user_metadata?.title || "Developer",
        skills: Array.isArray(data.user.user_metadata?.skills) ? data.user.user_metadata.skills : [],
        avatar_url: data.user.user_metadata?.avatar_url || "/placeholder-user.jpg",
        location: data.user.user_metadata?.location || "",
        experience_level: data.user.user_metadata?.experience_level || "beginner",
        role: data.user.user_metadata?.role || "student",
      }

      localStorage.setItem("user", JSON.stringify(currentUser))
      localStorage.setItem("userId", data.user.id)
      localStorage.setItem("isAuthenticated", "true")
      localStorage.setItem("userType", currentUser.role || "student")

      const userIsAdmin = isAdminEmail(data.user.email)
      router.push(userIsAdmin ? "/admin" : "/profile")
    } catch (error: any) {
      console.error("Login error:", error)
      // Show actual Supabase error messages instead of generic network error
      if (error.message.includes("Invalid login credentials")) {
        setError("Invalid email or password. Please check your credentials and try again.")
      } else if (error.message.includes("Email not confirmed")) {
        setError("Please verify your email address before logging in.")
      } else if (error.message.includes("Rate limit")) {
        setError("Too many login attempts. Please try again later.")
      } else {
        setError(error.message || "Login failed. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (error) setError("") // Clear error when user starts typing
  }

  return (
    <div className="min-h-screen bg-[#020817] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
              HackConnect
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-gray-400">Sign in to continue your hackathon journey</p>
        </div>

        <Card className="bg-gray-900/80 backdrop-blur-sm border-gray-800 shadow-2xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-white text-center">
              Sign In
            </CardTitle>
            <CardDescription className="text-gray-400 text-center">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert className="bg-red-500/10 border-red-500/20 text-red-400">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-white flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    id="remember"
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <Label htmlFor="remember" className="text-sm text-gray-400">
                    Remember me
                  </Label>
                </div>
                <Link href="#" className="text-sm text-blue-400 hover:text-blue-300">
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-medium"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <LogIn className="w-5 h-5" />
                    Sign In
                  </div>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-400">
                Don't have an account?{" "}
                <Link href="/auth/signup" className="text-blue-400 hover:text-blue-300 font-medium">
                  Sign up
                </Link>
              </p>
            </div>

            <div className="mt-6 text-center">
              <Link
                href="/get-started"
                className="text-gray-400 hover:text-blue-400 text-sm flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Get Started
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}