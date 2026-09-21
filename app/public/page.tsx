"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Home, Users, MessageCircle, User, Globe, Heart, Search, GraduationCap, Sparkles } from "lucide-react"
import { HamburgerMenu } from "@/components/hamburger-menu"
import { supabase, getAuthHeaders } from "@/lib/supabase"
import type { User as Profile } from "@/lib/types"

interface UserWithStats extends Profile {
  total_projects?: number
  hackathons_participated?: number
  connections?: number
}

export default function PublicAccessPage() {
  const [users, setUsers] = useState<UserWithStats[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sendingTo, setSendingTo] = useState<string | null>(null)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  // Search & filtering
  const [searchTerm, setSearchTerm] = useState("")
  const [skillsFilter, setSkillsFilter] = useState("")
  const [collegeFilter, setCollegeFilter] = useState("")
  const [interestFilter, setInterestFilter] = useState("")

  // Load discovered users from the real Supabase profiles table
  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError(null)

      const headers = await getAuthHeaders()
      if (!headers.Authorization) {
        // Users must be authenticated to access the Explore / Public page
        window.location.href = "/auth/login"
        return
      }

      const params = new URLSearchParams({ limit: "100" })
      if (searchTerm.trim()) params.set("search", searchTerm.trim())
      if (skillsFilter) params.set("skills", skillsFilter)
      if (collegeFilter) params.set("college", collegeFilter)
      if (interestFilter) params.set("interest", interestFilter)
      if (currentUserId) params.set("exclude_id", currentUserId)

      const res = await fetch(`/api/users?${params.toString()}`, { headers })

      if (res.status === 401) {
        window.location.href = "/auth/login"
        return
      }
      if (!res.ok) throw new Error("Failed to load users")

      const data = await res.json()
      const userList = Array.isArray(data) ? data : []

      // Fetch real-time stats for each user
      const usersWithStats = await Promise.all(userList.map(async (u: any) => {
        let totalProjects = 0
        let totalHackathons = 0
        let totalConnections = 0

        try {
          const projectsRes = await fetch(`/api/projects?user_id=${u.id}`)
          if (projectsRes.ok) {
            const projectsData = await projectsRes.json()
            totalProjects = Array.isArray(projectsData) ? projectsData.length : (projectsData.projects?.length || 0)
          }
        } catch {}

        try {
          const hackRes = await fetch(`/api/hackathons/registrations?user_id=${u.id}`)
          if (hackRes.ok) {
            const hackData = await hackRes.json()
            totalHackathons = Array.isArray(hackData) ? hackData.length : (hackData.registrations?.length || 0)
          }
        } catch {}

        try {
          const [receivedRes, sentRes] = await Promise.all([
            fetch(`/api/requests?receiver_id=${u.id}`),
            fetch(`/api/requests?sender_id=${u.id}`)
          ])
          if (receivedRes.ok) {
            const receivedData = await receivedRes.json()
            const received = Array.isArray(receivedData) ? receivedData : (receivedData.requests || [])
            totalConnections += received.filter((r: any) => r.status === 'accepted').length
          }
          if (sentRes.ok) {
            const sentData = await sentRes.json()
            const sent = Array.isArray(sentData) ? sentData : (sentData.requests || [])
            totalConnections += sent.filter((r: any) => r.status === 'accepted').length
          }
        } catch {}

        return {
          ...u,
          total_projects: totalProjects,
          hackathons_participated: totalHackathons,
          connections: totalConnections
        }
      }))

      setUsers(usersWithStats)
    } catch (e: any) {
      setError(e?.message || "Failed to load users")
    } finally {
      setLoading(false)
    }
  }

  // Auth guard: this page is for registered users only.
  useEffect(() => {
    ;(async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
          window.location.href = "/auth/login"
          return
        }
        setCurrentUserId(session.user.id)
      } catch {
        window.location.href = "/auth/login"
      }
    })()
  }, [])

  // (Debounced) load the users whenever the current user or a filter changes.
  useEffect(() => {
    if (!currentUserId) return
    const timer = setTimeout(() => {
      fetchUsers()
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, 300)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUserId, searchTerm, skillsFilter, collegeFilter, interestFilter])

  // Realtime: every newly registered user appears here automatically - no
  // page rebuild or manual database entry required.
  useEffect(() => {
    if (!currentUserId) return

    const channel = supabase
      .channel("public-profiles-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "users" },
        (payload: any) => {
          const row = payload.new as any
          if (!row || row.id === currentUserId) return
          fetchUsers()
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "users" },
        (payload: any) => {
          const row = payload.new as any
          if (!row || row.id === currentUserId) return
          fetchUsers()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUserId])

  const sendRequest = async (receiverId: string) => {
    try {
      setSendingTo(receiverId)
      // Check if user is logged in
      const raw = localStorage.getItem('user')
      let me = raw ? JSON.parse(raw) : null
      
      if (!me?.id) {
        alert('Please log in first to send connection requests.')
        window.location.href = '/auth/login'
        return
      }
      
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sender_id: me.id, receiver_id: receiverId })
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to send request')
      }
      
      alert('✅ Connection request sent successfully!')
      
    } catch (e: any) {
      console.error('Connection request error:', e)
      alert(`Failed to send connection request: ${e?.message || 'Failed to send connection request'}`)
    } finally {
      setSendingTo(null)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Nav to keep consistent */}
      <nav className="flex justify-between items-center gap-3 p-4 sm:p-6 md:px-12 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <Link
            href="/"
            className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent truncate"
          >
            HackConnect
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <HamburgerMenu />
          <div className="hidden lg:flex gap-4 xl:gap-6">
          <Link href="/" className="text-gray-300 hover:text-blue-400 flex items-center gap-2 transition-colors">
            <Home className="w-4 h-4" />
            Home
          </Link>
          <Link href="/hackathons" className="text-gray-300 hover:text-blue-400 flex items-center gap-2 transition-colors">
            <Globe className="w-4 h-4" />
            Explore
          </Link>
          <Link href="/public" className="text-blue-400 font-medium flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Public Access
          </Link>
          <Link href="/teams" className="text-gray-300 hover:text-blue-400 flex items-center gap-2 transition-colors">
            <Users className="w-4 h-4" />
            Teams
          </Link>
          <Link href="/messages" className="text-gray-300 hover:text-blue-400 flex items-center gap-2 transition-colors">
            <MessageCircle className="w-4 h-4" />
            Messages
          </Link>
          <Link href="/profile" className="text-gray-300 hover:text-blue-400 flex items-center gap-2 transition-colors">
            <User className="w-4 h-4" />
            Profile
          </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center gap-8 mb-4">
            <div className="relative translate-y-[2px]">
              <span className="absolute inset-0 rounded-full bg-pink-500/40 blur-md" aria-hidden="true"></span>
              <span className="absolute inset-0 rounded-full animate-ping ring-2 ring-pink-400/70" aria-hidden="true"></span>
              <span className="pointer-events-none absolute -inset-1 rounded-full overflow-hidden" aria-hidden="true">
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/60 to-transparent opacity-70 shimmer-sweep"></span>
              </span>
              <Link href="/public/requests" className="relative z-10">
                <button
                  aria-label="Open Requests"
                  className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-pink-600 hover:bg-pink-700 text-white shadow-[0_0_12px_rgba(236,72,153,0.65)]"
                  type="button"
                >
                  <Heart className="w-5 h-5" />
                </button>
              </Link>
              <style>{`
                @keyframes shimmerSweep {
                  0% { transform: translateX(-150%); }
                  100% { transform: translateX(150%); }
                }
                .shimmer-sweep {
                  animation: shimmerSweep 2s linear infinite;
                }
              `}</style>
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">Public Profiles</h1>
          <div className="max-w-2xl mx-auto">
            <p className="text-gray-300 text-lg">Browse public user profiles, connect with talented developers, and build your dream hackathon team.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <span className="px-4 py-2 rounded-full bg-blue-900/30 text-blue-300 border border-blue-800/50 text-sm">Web Developers</span>
              <span className="px-4 py-2 rounded-full bg-purple-900/30 text-purple-300 border border-purple-800/50 text-sm">UI/UX Designers</span>
              <span className="px-4 py-2 rounded-full bg-green-900/30 text-green-300 border border-green-800/50 text-sm">Data Scientists</span>
              <span className="px-4 py-2 rounded-full bg-pink-900/30 text-pink-300 border border-pink-800/50 text-sm">Project Managers</span>
              <span className="px-4 py-2 rounded-full bg-yellow-900/30 text-yellow-300 border border-yellow-800/50 text-sm">DevOps Engineers</span>
            </div>
          </div>

          {/* Search & Discovery Filters */}
          <div className="max-w-4xl mx-auto mt-8 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, username, college or email..."
                className="w-full bg-gray-900/70 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
              />
            </div>
            <div className="flex flex-wrap gap-3 justify-center">
              <select
                value={skillsFilter}
                onChange={(e) => setSkillsFilter(e.target.value)}
                className="bg-gray-900/70 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none"
              >
                <option value="">All Skills</option>
                <option value="React">React</option>
                <option value="JavaScript">JavaScript</option>
                <option value="TypeScript">TypeScript</option>
                <option value="Python">Python</option>
                <option value="Node.js">Node.js</option>
                <option value="Machine Learning">Machine Learning</option>
                <option value="Data Science">Data Science</option>
                <option value="UI/UX">UI/UX</option>
                <option value="Cloud">Cloud</option>
                <option value="DevOps">DevOps</option>
                <option value="Mobile">Mobile</option>
              </select>
              <input
                type="text"
                value={collegeFilter}
                onChange={(e) => setCollegeFilter(e.target.value)}
                placeholder="Filter by college / organization..."
                className="bg-gray-900/70 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none w-64"
              />
              <select
                value={interestFilter}
                onChange={(e) => setInterestFilter(e.target.value)}
                className="bg-gray-900/70 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-gray-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none"
              >
                <option value="">All Interests</option>
                <option value="AI/ML">AI / ML</option>
                <option value="Web3">Web3</option>
                <option value="Blockchain">Blockchain</option>
                <option value="Open Source">Open Source</option>
                <option value="FinTech">FinTech</option>
                <option value="Sustainability">Sustainability</option>
                <option value="Cybersecurity">Cybersecurity</option>
                <option value="IoT">IoT</option>
                <option value="Game Dev">Game Dev</option>
                <option value="AR/VR">AR / VR</option>
                <option value="Design">Design</option>
              </select>
            </div>
          </div>
        </div>

        {loading && (
          <div className="text-center py-20">
            <div className="inline-block p-4 bg-gray-800/50 rounded-xl border border-gray-700">
              <div className="w-12 h-12 border-4 border-t-blue-500 border-r-transparent border-b-purple-500 border-l-transparent rounded-full animate-spin mx-auto"></div>
              <p className="mt-4 text-gray-300">Loading talented profiles...</p>
            </div>
          </div>
        )}
        {error && (
          <div className="text-center py-20">
            <div className="inline-block p-6 bg-red-900/20 rounded-xl border border-red-800/50 max-w-md mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-300 font-medium text-lg mb-2">Error Loading Profiles</p>
              <p className="text-red-400">{error}</p>
            </div>
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {users.map((u) => (
              <div key={u.id} className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 border border-gray-700 rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] group">
                {/* Card Header with Gradient Accent */}
                <div className="h-3 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                
                <div className="p-6 space-y-6">
                  {/* Profile Header */}
                  <div className="flex items-center gap-5">
                    <div className="relative">
                      {(() => {
                        const raw = (u.avatar_url || '/placeholder-user.jpg').trim()
                        const isExternal = /^https?:\/\//i.test(raw)
                        const src = isExternal ? raw : raw.startsWith('/') ? raw : `/${raw}`
                        return isExternal ? (
                          <div className="relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-sm opacity-70"></div>
                            <img src={src} alt={u.name} width={80} height={80} className="relative h-20 w-20 rounded-full object-cover border-2 border-white/20" />
                          </div>
                        ) : (
                          <div className="relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-sm opacity-70"></div>
                            <Image src={src} alt={u.name} width={80} height={80} className="relative h-20 w-20 rounded-full object-cover border-2 border-white/20" />
                          </div>
                        )
                      })()}
                      
                      {/* Online Status Indicator */}
                      <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-gray-900 rounded-full"></span>
                    </div>
                    
                    <div>
                      <div className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">{u.name}</div>
                      <div className="text-sm text-gray-400">{u.title || u.email}</div>
                      {u.username && (
                        <div className="text-xs text-purple-400/80 mt-0.5">@{u.username}</div>
                      )}
                      {u.college && (
                        <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                          <GraduationCap className="w-3 h-3 inline" /> {u.college}
                        </div>
                      )}
                      
                      {/* Availability Badge */}
                      <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900/50 text-blue-300 border border-blue-800">
                        <span className="w-2 h-2 bg-blue-400 rounded-full mr-1.5 animate-pulse"></span>
                        Available for Hackathons
                      </div>
                    </div>
                  </div>
                  
                  {/* Bio Section with Better Formatting */}
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                    <h4 className="text-sm font-medium text-gray-300 mb-2 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      About
                    </h4>
                    {u.bio ? (
                      <p className="text-gray-300 text-sm">{u.bio}</p>
                    ) : (
                      <p className="text-gray-500 text-sm italic">No bio provided</p>
                    )}
                  </div>
                  
                  {/* Skills Section with Improved Styling */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      Skills & Expertise
                    </h4>
                    
                    {u.skills?.length ? (
                      <div className="flex flex-wrap gap-2">
                        {u.skills.slice(0, 6).map((s, i) => (
                          <span key={i} className="px-3 py-1.5 bg-gradient-to-r from-purple-900/40 to-blue-900/40 border border-purple-700/30 rounded-full text-xs font-medium text-purple-300 hover:text-white hover:border-purple-500 transition-colors">
                            {s}
                          </span>
                        ))}
                        {u.skills.length > 6 && (
                          <span className="px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-full text-xs text-gray-400">
                            +{u.skills.length - 6} more
                          </span>
                        )}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm italic">No skills listed</p>
                    )}
                  </div>

                  {/* Hackathon Interests */}
                  {Array.isArray(u.hackathon_interests) && u.hackathon_interests.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center">
                        <Sparkles className="w-4 h-4 mr-1 text-pink-400" />
                        Hackathon Interests
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {u.hackathon_interests.slice(0, 5).map((interest: string, i: number) => (
                          <span key={i} className="px-3 py-1.5 bg-pink-900/30 border border-pink-800/50 rounded-full text-xs font-medium text-pink-300">
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Stats Section - Real-time data */}
                  <div className="grid grid-cols-3 gap-4 py-2">
                    <div className="text-center">
                      <div className="text-xl font-bold text-blue-400">{u.total_projects || 0}</div>
                      <div className="text-xs text-gray-400">Projects</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-purple-400">{u.hackathons_participated || 0}</div>
                      <div className="text-xs text-gray-400">Hackathons</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-pink-400">{u.connections || 0}</div>
                      <div className="text-xs text-gray-400">Connections</div>
                    </div>
                  </div>
                  
                  {/* Action Buttons with Improved Styling */}
                  <div className="flex flex-wrap justify-between gap-3 pt-2">
                    <Button asChild className="flex-1 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white border border-purple-700 shadow-md hover:shadow-lg transition-all">
                      <a href={`/messages?user=${u.id}`} className="flex items-center justify-center gap-2">
                        <MessageCircle className="w-4 h-4"/> 
                        Message
                      </a>
                    </Button>
                    <Button asChild className="flex-1 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white border border-blue-700 shadow-md hover:shadow-lg transition-all">
                      <Link href={`/public/profile/${u.id || '1'}`} className="flex items-center justify-center gap-2">
                        <User className="w-4 h-4"/> 
                        View Profile
                      </Link>
                    </Button>
                    <Button
                      onClick={() => sendRequest(u.id)}
                      disabled={sendingTo === u.id}
                      className="flex-1 bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-700 hover:to-red-700 text-white border border-pink-700 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                    >
                      <Heart className={`w-4 h-4 mr-2 ${sendingTo === u.id ? '' : 'animate-pulse'}`}/>
                      {sendingTo === u.id ? 'Sending...' : 'Connect'}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            {users.length === 0 && (
              <div className="col-span-full py-16">
                <div className="max-w-md mx-auto text-center bg-gray-800/50 rounded-xl border border-gray-700 p-8">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <h3 className="text-xl font-bold text-gray-300 mb-2">No Public Profiles Found</h3>
                  <p className="text-gray-400 mb-6">We couldn't find any public profiles at the moment. Check back later or be the first to create one!</p>
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                    Create Your Profile
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}