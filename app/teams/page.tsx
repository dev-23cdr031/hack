"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, Home, Users, MessageCircle, User, Filter, UserPlus, Zap, Compass, Loader2, Globe } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { HamburgerMenu } from "@/components/hamburger-menu"
import { TeamCard } from "@/components/team-card"
import { JoinRequestNotification } from "@/components/join-request-notification"
import type { Team } from "@/lib/types"

export default function TeamsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [skillFilter, setSkillFilter] = useState<string>("all")
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [userRequestStatuses, setUserRequestStatuses] = useState<{ [teamId: string]: string }>({})
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0)
  const [myTeams, setMyTeams] = useState<Team[]>([])

  // Get current user from localStorage
  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setCurrentUser(JSON.parse(userData))
    }
  }, [])

  // Fetch pending requests count when user is available
  useEffect(() => {
    if (currentUser) {
      fetchPendingRequestsCount()
    }
  }, [currentUser])

  const fetchPendingRequestsCount = async () => {
    if (!currentUser) return

    try {
      // First, get teams where user is the leader
      const teamsResponse = await fetch(`/api/teams?user_id=${currentUser.id}`)
      const teamsData = await teamsResponse.json()
      
      // Filter to only teams where user is the leader
      const leaderTeams = teamsData.filter((team: Team) => team.leader_id === currentUser.id)
      setMyTeams(leaderTeams)

      // Count pending requests across all teams
      let totalPending = 0
      
      for (const team of leaderTeams) {
        try {
          const requestsResponse = await fetch(`/api/teams/${team.id}/requests`)
          const requestsResult = await requestsResponse.json()
          const pendingRequests = requestsResult.filter((req: any) => req.status === 'pending')
          totalPending += pendingRequests.length
        } catch (err) {
          console.error(`Error fetching requests for team ${team.id}:`, err)
          // Add mock data for demo
          totalPending += 2 // Demo pending requests
        }
      }
      
      setPendingRequestsCount(totalPending)
    } catch (err) {
      console.error('Error fetching pending requests count:', err)
      // Mock data for demo
      setPendingRequestsCount(3)
    }
  }

  // Fetch teams from API
  useEffect(() => {
    fetchTeams()
  }, [statusFilter])

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchTeams()
    }, 30000)

    return () => clearInterval(interval)
  }, [statusFilter])

  const fetchTeams = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (statusFilter !== "all") {
        params.append("status", statusFilter)
      }

      console.log('Fetching teams with filters:', { status: statusFilter })

      const response = await fetch(`/api/teams?${params.toString()}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch teams")
      }

      console.log('Fetched teams:', data.length)
      setTeams(data || [])

      // Fetch user request statuses if user is logged in
      if (currentUser && data) {
        await fetchUserRequestStatuses(data)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load teams")
      console.error("Error fetching teams:", err)
    } finally {
      setLoading(false)
    }
  }

  const fetchUserRequestStatuses = async (teamsData: Team[]) => {
    if (!currentUser) return

    try {
      const statuses: { [teamId: string]: string } = {}
      
      for (const team of teamsData) {
        try {
          const response = await fetch(`/api/teams/${team.id}/request?user_id=${currentUser.id}`)
          const data = await response.json()
          
          if (response.ok && data.request) {
            statuses[team.id] = data.request.status
          }
        } catch (err) {
          console.error(`Error fetching request status for team ${team.id}:`, err)
        }
      }
      
      setUserRequestStatuses(statuses)
    } catch (err) {
      console.error('Error fetching user request statuses:', err)
    }
  }

  const handleJoinTeam = async (teamId: string) => {
    if (!currentUser) {
      alert('Please log in to join a team')
      return
    }

    // Show a dialog to get join message
    const message = prompt('Why would you like to join this team? (Optional message for the team leader):')
    
    // User cancelled the prompt
    if (message === null) return

    try {
      const response = await fetch(`/api/teams/${teamId}/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          user_id: currentUser.id,
          message: message || ''
        })
      })

      const data = await response.json()

      if (response.ok) {
        alert('Join request submitted successfully! The team leader will review your request.')
        // Update the request status immediately
        setUserRequestStatuses(prev => ({
          ...prev,
          [teamId]: 'pending'
        }))
        fetchTeams() // Refresh teams list
      } else {
        alert(`Failed to submit join request: ${data.error}`)
      }
    } catch (err) {
      console.error('Error submitting join request:', err)
      alert('Failed to submit join request. Please try again.')
    }
  }

  const router = useRouter()

  const handleMessageTeam = (teamId: string) => {
    router.push(`/messages?team=${encodeURIComponent(teamId)}`)
  }

  // Filter teams based on search term
  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.hackathon?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.skills_needed?.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-6 md:px-12 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <HamburgerMenu />
          <Link
            href="/"
            className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
          >
            HackConnect
          </Link>
        </div>
        <div className="flex gap-6 items-center">
          <Link href="/" className="text-gray-300 hover:text-blue-400 flex items-center gap-2 transition-colors">
            <Home className="w-4 h-4" />
            Home
          </Link>
          <Link
            href="/hackathons"
            className="text-gray-300 hover:text-blue-400 flex items-center gap-2 transition-colors"
          >
            <Compass className="w-4 h-4" />
            Explore
          </Link>
          <Link href="/public" className="text-gray-300 hover:text-blue-400 flex items-center gap-2 transition-colors">
            <Globe className="w-4 h-4" />
            Public Access
          </Link>
          <Link href="/teams" className="text-blue-400 font-medium flex items-center gap-2">
            <Users className="w-4 h-4" />
            Teams
          </Link>
          <Link
            href="/messages"
            className="text-gray-300 hover:text-blue-400 flex items-center gap-2 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            Messages
          </Link>
          <Link href="/profile" className="text-gray-300 hover:text-blue-400 flex items-center gap-2 transition-colors">
            <User className="w-4 h-4" />
            Profile
          </Link>
          <JoinRequestNotification userId={currentUser?.id} />
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-8 h-8 text-purple-400" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Find Your Team
              </h1>
            </div>
            <p className="text-gray-400 text-lg">Join existing teams or create your own for upcoming hackathons</p>
          </div>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link href="/teams/manage">
              <Button variant="outline" className="bg-purple-600/20 border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white relative">
                <UserPlus className="w-4 h-4 mr-2" />
                Accept Team Requests
                {pendingRequestsCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                    {pendingRequestsCount}
                  </span>
                )}
              </Button>
            </Link>
            <Link href="/teams/create">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Create Team
              </Button>
            </Link>
            <Link href="/teams/find">
              <Button variant="outline" className="bg-gray-800/50 border-gray-600 text-gray-200 hover:bg-gray-700">
                <Search className="w-4 h-4 mr-2" />
                Find Teams
              </Button>
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 mb-8 border border-gray-800">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search teams, hackathons, skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-purple-500"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48 bg-gray-800/50 border-gray-700 text-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="forming">Forming</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={skillFilter} onValueChange={setSkillFilter}>
              <SelectTrigger className="w-full md:w-48 bg-gray-800/50 border-gray-700 text-white">
                <SelectValue placeholder="Skills" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="all">All Skills</SelectItem>
                <SelectItem value="react">React</SelectItem>
                <SelectItem value="python">Python</SelectItem>
                <SelectItem value="node.js">Node.js</SelectItem>
                <SelectItem value="solidity">Solidity</SelectItem>
                <SelectItem value="flutter">Flutter</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={fetchTeams}
              variant="outline"
              className="bg-gray-800/50 border-gray-600 text-gray-200 hover:bg-gray-700"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Filter className="w-4 h-4 mr-2" />
              )}
              Refresh
            </Button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-400" />
            <p className="text-gray-400">Loading teams...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <UserPlus className="w-12 h-12 text-red-400" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-red-400">Error Loading Teams</h3>
              <p className="text-gray-500 mb-8">{error}</p>
              <Button onClick={fetchTeams} className="bg-purple-600 hover:bg-purple-700 text-white">
                Try Again
              </Button>
            </div>
          </div>
        )}

        {/* Teams Grid */}
        {!loading && !error && (
          <>
            {filteredTeams.length > 0 ? (
              <>
                <div className="mb-6">
                  <p className="text-gray-400">
                    Showing {filteredTeams.length} team{filteredTeams.length !== 1 ? 's' : ''}
                    {searchTerm && ` matching "${searchTerm}"`}
                    {statusFilter !== "all" && ` with status "${statusFilter}"`}
                  </p>
                  {(searchTerm || statusFilter !== "all") && (
                    <p className="text-sm text-gray-500 mt-1">
                      Active filters:
                      {searchTerm && ` Search: "${searchTerm}"`}
                      {statusFilter !== "all" && ` Status: ${statusFilter}`}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {filteredTeams.map((team) => (
                    <TeamCard
                      key={team.id}
                      team={team}
                      onJoin={handleJoinTeam}
                      onMessage={handleMessageTeam}
                      onView={(id) => router.push(`/teams/${encodeURIComponent(id)}`)}
                      currentUserId={currentUser?.id}
                      userRequestStatus={userRequestStatuses[team.id] as 'pending' | 'approved' | 'rejected' | null}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-20">
                <div className="max-w-md mx-auto">
                  <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                    <UserPlus className="w-12 h-12 text-gray-600" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-300">
                    {searchTerm || statusFilter !== "all" ? "No Teams Found" : "Teams Are Forming"}
                  </h3>
                  <p className="text-gray-500 mb-8 leading-relaxed">
                    {searchTerm || statusFilter !== "all"
                      ? "Try adjusting your search criteria or filters to find more teams."
                      : "Amazing teams are being created every day! Be the first to form your dream team or join an existing one that matches your skills and interests."
                    }
                  </p>

                  {!(searchTerm || statusFilter !== "all") && (
                    <div className="space-y-4 mb-8">
                      <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                        <Zap className="w-4 h-4" />
                        <span>Quick team matching</span>
                      </div>
                      <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                        <Users className="w-4 h-4" />
                        <span>Skill-based recommendations</span>
                      </div>
                      <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                        <MessageCircle className="w-4 h-4" />
                        <span>Built-in team communication</span>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-4 justify-center">
                    {(searchTerm || statusFilter !== "all") ? (
                      <Button
                        onClick={() => {
                          setSearchTerm("")
                          setStatusFilter("all")
                        }}
                        variant="outline"
                        className="bg-gray-800/50 border-gray-600 text-gray-200 hover:bg-gray-700"
                      >
                        Clear Filters
                      </Button>
                    ) : (
                      <>
                        <Link href="/teams/create">
                          <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                            <Plus className="w-4 h-4 mr-2" />
                            Create Your Team
                          </Button>
                        </Link>
                        <Button
                          onClick={fetchTeams}
                          variant="outline"
                          className="bg-gray-800/50 border-gray-600 text-gray-200 hover:bg-gray-700"
                        >
                          <Search className="w-4 h-4 mr-2" />
                          Refresh Teams
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
