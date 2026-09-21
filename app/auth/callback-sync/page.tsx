"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { supabase } from "@/lib/supabase"
import { syncUserProfile, buildLocalUser } from "@/lib/profile"

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState("Completing sign-in...")
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let active = true

    const run = async () => {
      try {
        const client = createClientComponentClient()
        const {
          data: { session },
          error,
        } = await client.auth.getSession()

        if (!active) return

        if (error || !session) {
          setStatus("Sign-in could not be completed. Please try again.")
          setFailed(true)
          return
        }

        // Sync the localStorage session so the rest of the app sees it.
        await supabase.auth.setSession({
          access_token: session.access_token,
          refresh_token: session.refresh_token,
        })

        // Ensure a profile row exists (covers Google users + legacy accounts).
        // Falls back to core columns when optional SQL columns are missing.
        const authUser = {
          id: session.user.id,
          email: session.user.email || "",
          user_metadata: session.user.user_metadata || {},
        }

        const { profile } = await syncUserProfile(authUser)

        // Store the user in localStorage (used across the app).
        const user = buildLocalUser(authUser, profile)
        localStorage.setItem("user", JSON.stringify(user))
        localStorage.setItem("userId", user.id)
        localStorage.setItem("isAuthenticated", "true")

        const next = searchParams.get("next") || "/"
        if (active) router.replace(next)
      } catch (err) {
        console.error("Auth callback error:", err)
        if (active) {
          setStatus("Something went wrong while signing you in.")
          setFailed(true)
        }
      }
    }

    run()

    return () => {
      active = false
    }
  }, [router, searchParams])

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 max-w-md w-full text-center">
        <div className="w-12 h-12 border-4 border-t-blue-500 border-r-transparent border-b-purple-500 border-l-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <h1 className="text-xl font-bold mb-2">HackConnect</h1>
        <p className="text-gray-400">{status}</p>
        {failed && (
          <button
            onClick={() => (window.location.href = "/auth/login")}
            className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium"
          >
            Back to Sign In
          </button>
        )}
      </div>
    </div>
  )
}
