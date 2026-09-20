"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, LogIn, ArrowLeft, Mail, Lock, AlertCircle, Building2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function OrganizerLoginPage() {
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
      // Call login API
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          userType: "organizer",
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Login failed")
        setLoading(false)
        return
      }

      if (data.success) {
        // Store user data in localStorage
        localStorage.setItem("user", JSON.stringify(data.user))
        localStorage.setItem("isAuthenticated", "true")
        localStorage.setItem("userType", "organizer")

        // Redirect to home page
        router.push("/")
      } else {
        setError(data.error || "Login failed")
      }
    } catch (error: any) {
      console.error("Login error:", error)
      setError(error.message || "Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (error) setError("") // Clear error when user starts typing
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-amber-900/30 to-black flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <div className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent mb-4">
              HackConnect
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-white mb-2">Organizer Login</h1>
          <p className="text-gray-400">Sign in to manage hackathons and events</p>
        </div>

        <Card className="bg-gray-900/80 backdrop-blur-sm border-gray-800 shadow-2xl">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-amber-500/20 rounded-full">
                <Building2 className="w-10 h-10 text-amber-400" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-white text-center">
              Organizer Sign In
            </CardTitle>
            <CardDescription className="text-gray-400 text-center">
              Access your organizer dashboard
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

              {/* Demo credentials info */}
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                <p className="text-amber-400 text-sm font-medium mb-2">Demo Credentials:</p>
                <p className="text-amber-300 text-xs">Email: organizer@hackconnect.dev</p>
                <p className="text-amber-300 text-xs">Password: organizer123</p>
              </div>

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
                  className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-amber-500 focus:ring-amber-500/20"
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
                    className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-amber-500 focus:ring-amber-500/20 pr-10"
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
                    className="w-4 h-4 text-amber-600 bg-gray-800 border-gray-600 rounded focus:ring-amber-500 focus:ring-2"
                  />
                  <Label htmlFor="remember" className="text-sm text-gray-400">
                    Remember me
                  </Label>
                </div>
                <Link href="#" className="text-sm text-amber-400 hover:text-amber-300">
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 text-lg font-medium"
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
                <Link href="/auth/signup" className="text-amber-400 hover:text-amber-300 font-medium">
                  Sign up
                </Link>
              </p>
            </div>

            <div className="mt-6 text-center">
              <Link
                href="/get-started"
                className="text-gray-400 hover:text-amber-400 text-sm flex items-center justify-center gap-2"
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