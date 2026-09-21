"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import { ArrowLeft, Calendar, Heart, Mail, MessageCircle, MapPin, GraduationCap, Users, Star } from "lucide-react"
import type { User as Profile } from "@/lib/types"

type PublicProfile = Profile & {
  hackathons_participated?: number
  skill_endorsements?: number
  total_projects?: number
}

export default function PublicProfilePage() {
  const params = useParams()
  const userId = params.id as string
  const [user, setUser] = useState<PublicProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sendingRequest, setSendingRequest] = useState(false)
  const [version, setVersion] = useState(0)

  useEffect(() => {
    if (!userId) {
      setError("No user ID provided")
      setLoading(false)
      return
    }

    const loadUser = async () => {
      try {
        setLoading(true)
        const { getAuthHeaders } = await import("@/lib/supabase")
        const headers = await getAuthHeaders()
        const response = await fetch(`/api/users/${userId}`, { headers })

        if (response.status === 401) {
          window.location.href = "/auth/login"
          return
        }

        if (response.ok) {
          const userData = await response.json()

          // Fetch real-time stats from database
          let totalProjects = 0
          let totalHackathons = 0
          let totalEndorsements = 0

          try {
            const projectsRes = await fetch(`/api/projects?user_id=${userId}`)
            if (projectsRes.ok) {
              const projectsData = await projectsRes.json()
              totalProjects = Array.isArray(projectsData) ? projectsData.length : (projectsData.projects?.length || 0)
            }
          } catch {}

          try {
            const hackRes = await fetch(`/api/hackathons/registrations?user_id=${userId}`)
            if (hackRes.ok) {
              const hackData = await hackRes.json()
              totalHackathons = Array.isArray(hackData) ? hackData.length : (hackData.registrations?.length || 0)
            }
          } catch {}

          try {
            // Fetch connections (received + sent requests with accepted status)
            const [receivedRes, sentRes] = await Promise.all([
              fetch(`/api/requests?receiver_id=${userId}`),
              fetch(`/api/requests?sender_id=${userId}`)
            ])
            
            if (receivedRes.ok) {
              const receivedData = await receivedRes.json()
              const received = Array.isArray(receivedData) ? receivedData : (receivedData.requests || [])
              totalEndorsements += received.filter((r: any) => r.status === 'accepted').length
            }
            if (sentRes.ok) {
              const sentData = await sentRes.json()
              const sent = Array.isArray(sentData) ? sentData : (sentData.requests || [])
              totalEndorsements += sent.filter((r: any) => r.status === 'accepted').length
            }
          } catch {}

          setUser({
            ...userData,
            total_projects: totalProjects,
            hackathons_participated: totalHackathons,
            skill_endorsements: totalEndorsements
          })
          setError(null)
          return
        }

        setError("The profile you are looking for does not exist.")
      } catch {
        setError("Unable to load this profile right now.")
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [userId, version])

  // Supabase Realtime: when the viewed user edits their profile, refresh
  // immediately so others always see the latest data.
  useEffect(() => {
    if (!userId) return

    const channel = supabase
      .channel(`public-profile-live-${userId}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "users", filter: `id=eq.${userId}` },
        () => {
          setVersion((v) => v + 1)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId])

  const sendConnectionRequest = async () => {
    if (!user) return

    try {
      setSendingRequest(true)
      const raw = localStorage.getItem('user')
      const me = raw ? JSON.parse(raw) : null
      
      if (!me?.id) {
        alert('Please log in first to send connection requests.')
        window.location.href = '/auth/login'
        return
      }
      
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sender_id: me.id, receiver_id: user.id })
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to send request')
      }
      
      alert("Connection request sent successfully!")
    } catch (e: any) {
      alert(`Failed to send connection request: ${e?.message || 'Failed to send connection request'}`)
    } finally {
      setSendingRequest(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-t-blue-500 border-r-transparent border-b-purple-500 border-l-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-300">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
        <div className="text-center max-w-md mx-auto rounded-xl border border-gray-800 bg-gray-900/80 p-8">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10 text-2xl font-bold text-red-300">
            !
          </div>
          <h1 className="text-2xl font-bold mb-2">Error Loading Profile</h1>
          <p className="text-gray-400 mb-6">{error}</p>
          <div className="flex flex-col gap-3">
            <Button onClick={() => window.location.reload()} className="bg-blue-600 hover:bg-blue-700">
              Try Again
            </Button>
            <Button asChild variant="outline" className="border-gray-600 hover:bg-gray-800">
              <Link href="/public">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Profiles
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="flex justify-between items-center gap-3 p-4 sm:p-6 md:px-12 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
        <Link href="/public" className="flex items-center gap-2 text-gray-300 hover:text-blue-400 transition-colors text-sm sm:text-base">
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Back to Profiles</span>
          <span className="sm:hidden">Profiles</span>
        </Link>
        <Link href="/" className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent truncate">
          HackConnect
        </Link>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <section className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 border border-gray-700 rounded-xl overflow-hidden shadow-xl mb-8">
          <div className="h-3 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />

          <div className="p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              <div className="relative h-36 w-36 flex-shrink-0">
                <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-sm opacity-70" />
                <Image
                  src={user.avatar_url || "/placeholder-user.jpg"}
                  alt={user.name}
                  width={144}
                  height={144}
                  className="relative h-36 w-36 rounded-full object-cover border-4 border-white/20"
                  priority
                />
                <span className="absolute bottom-3 right-3 w-6 h-6 bg-green-500 border-4 border-gray-900 rounded-full" />
              </div>

              <div className="flex-1 text-center md:text-left">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                  {user.name}
                </h1>
                <p className="text-xl text-gray-300 mb-4">{user.title || "Developer"}</p>
                {user.username && (
                  <p className="text-sm text-purple-400/80 mb-2">@{user.username}</p>
                )}

                <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-4">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">{user.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">Joined {new Date(user.created_at).toLocaleDateString()}</span>
                  </div>
                  {user.location && (
                    <div className="flex items-center gap-2 text-gray-400">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{user.location}</span>
                    </div>
                  )}
                </div>

                {(user.role || user.experience_level || user.college) && (
                  <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
                    {user.role && (
                      <span className="px-3 py-1 rounded-full bg-blue-600/20 border border-blue-600/30 text-sm font-medium text-blue-300 capitalize flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" /> {user.role}
                      </span>
                    )}
                    {user.experience_level && (
                      <span className="px-3 py-1 rounded-full bg-purple-600/20 border border-purple-600/30 text-sm font-medium text-purple-300 capitalize flex items-center gap-1">
                        <GraduationCap className="w-3.5 h-3.5" /> {user.experience_level} level
                      </span>
                    )}
                    {user.college && (
                      <span className="px-3 py-1 rounded-full bg-green-600/20 border border-green-600/30 text-sm font-medium text-green-300 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" /> {user.college}
                      </span>
                    )}
                  </div>
                )}

                <div className="flex flex-wrap justify-center md:justify-start gap-3">
                  <Button
                    onClick={sendConnectionRequest}
                    disabled={sendingRequest}
                    className="bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-700 hover:to-red-700 text-white border border-pink-700"
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    {sendingRequest ? "Sending..." : "Connect"}
                  </Button>
                  <Button asChild className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white border border-purple-700">
                    <Link href={`/messages?user=${userId}`}>
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Message
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 border border-gray-700 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                <Star className="w-5 h-5 mr-2 text-blue-400" />
                About
              </h2>
              <p className="text-gray-300 leading-relaxed">{user.bio || "No bio provided yet."}</p>
            </section>

            <section className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 border border-gray-700 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Skills & Expertise</h2>
              {user.skills?.length ? (
                <div className="flex flex-wrap gap-3">
                  {user.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-4 py-2 bg-gradient-to-r from-purple-900/40 to-blue-900/40 border border-purple-700/30 rounded-full text-sm font-medium text-purple-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No skills listed yet.</p>
              )}
            </section>

            {Array.isArray(user.hackathon_interests) && user.hackathon_interests.length > 0 && (
              <section className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 border border-gray-700 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                  <Star className="w-5 h-5 mr-2 text-pink-400" />
                  Hackathon Interests
                </h2>
                <div className="flex flex-wrap gap-3">
                  {user.hackathon_interests.map((interest, idx) => (
                    <span
                      key={idx}
                      className="px-4 py-2 bg-gradient-to-r from-pink-900/40 to-purple-900/40 border border-pink-700/30 rounded-full text-sm font-medium text-pink-300"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>

          <aside className="space-y-6">
            <section className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 border border-gray-700 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Projects</span>
                  <span className="text-blue-400 font-bold">{user.total_projects || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Hackathons</span>
                  <span className="text-purple-400 font-bold">{user.hackathons_participated || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Connections</span>
                  <span className="text-pink-400 font-bold">{user.skill_endorsements || 0}</span>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </main>
    </div>
  )
}