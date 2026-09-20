"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Home, Users, MessageCircle, User, Filter, UserPlus, Zap, Compass, Loader2, Globe, X } from "lucide-react"
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
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isCreatingTeam, setIsCreatingTeam] = useState(false)
  const [hackathons, setHackathons] = useState<any[]>([])
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    hackathon_id: "",
    max_members: "4",
    skills_needed: [] as string[],
    project_idea: "",
    communication_platform: "Discord",
    meeting_schedule: "",
    roles_needed: [] as string[],
  })
  const [newSkill, setNewSkill] = useState("")
  const [newRole, setNewRole] = useState("")
  const [requestingMentorship, setRequestingMentorship] = useState<string | null>(null)

  // Get current user from localStorage and fetch hackathons
  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setCurrentUser(JSON.parse(userData))
    }
    fetchHackathons()
  }, [])

  const fetchHackathons = async () => {
    try {
      const response = await fetch('/api/hackathons')
      const data = await response.json()
      if (response.ok) {
        setHackathons(data.hackathons || [])
      }
    } catch (err) {
      console.error('Error fetching hackathons:', err)
    }
  }

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills_needed.includes(newSkill.trim())) {
      setFormData({
        ...formData,
        skills_needed: [...formData.skills_needed, newSkill.trim()],
      })
      setNewSkill("")
    }
  }

  const removeSkill = (skillToRemove: string) => {
    setFormData({
      ...formData,
      skills_needed: formData.skills_needed.filter((skill) => skill !== skillToRemove),
    })
  }
  
  const addRole = () => {
    if (newRole.trim() && !formData.roles_needed.includes(newRole.trim())) {
      setFormData({
        ...formData,
        roles_needed: [...formData.roles_needed, newRole.trim()],
      })
      setNewRole("")
    }
  }

  const removeRole = (roleToRemove: string) => {
    setFormData({
      ...formData,
      roles_needed: formData.roles_needed.filter((role) => role !== roleToRemove),
    })
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      hackathon_id: "",
      max_members: "4",
      skills_needed: [],
      project_idea: "",
      communication_platform: "Discord",
      meeting_schedule: "",
      roles_needed: [],
    })
    setNewSkill("")
    setNewRole("")
  }

  const handleCreateTeam = async () => {
    if (!currentUser) {
      alert('Please log in to create a team')
      return
    }

    if (!formData.name.trim()) {
      alert('Please enter a team name')
      return
    }

    setIsCreatingTeam(true)

    try {
      const teamData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        hackathon_id: formData.hackathon_id === 'none' ? null : formData.hackathon_id || null,
        max_members: parseInt(formData.max_members),
        skills_needed: formData.skills_needed,
        project_idea: formData.project_idea.trim(),
        communication_platform: formData.communication_platform,
        meeting_schedule: formData.meeting_schedule.trim(),
        roles_needed: formData.roles_needed,
        leader_id: currentUser.id,
        status: 'forming',
        current_members: 1
      }

      console.log('Creating team with data:', teamData)

      const response = await fetch('/api/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(teamData)
      })

      const responseData = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(responseData.error || "Failed to create team")
      }

      // Refresh teams list to show the newly created team immediately
      await fetchTeams()
      
      // Close the modal and reset form
      setIsCreateModalOpen(false)
      resetForm()
      alert("Team created successfully! All logged-in users can now see this team.")
    } catch (error) {
      console.error('Error creating team:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to create team'
      alert(`Failed to create team: ${errorMessage}`)
    } finally {
      setIsCreatingTeam(false)
    }
  }

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
      
      // Use only teams fetched from Supabase - no localStorage
      const allTeams = data || []
      setTeams(allTeams)

      // Fetch user request statuses if user is logged in
      if (currentUser && allTeams) {
        await fetchUserRequestStatuses(allTeams)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load teams")
      console.error("Error fetching teams:", err)
      
      // Set empty teams array on error
      setTeams([])
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

  const handleRequestMentor = async (teamId: string) => {
    if (!currentUser) {
      alert('Please log in to request to mentor a team')
      return
    }

    // Check if current user is a mentor
    if (currentUser.role !== 'mentor') {
      alert('Only mentors can offer to mentor teams')
      return
    }

    setRequestingMentorship(teamId)
    
    try {
      const response = await fetch(`/api/teams/${encodeURIComponent(teamId)}/request-mentor`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mentor_id: currentUser.id
        })
      })

      if (!response.ok) {
        throw new Error('Failed to submit mentor request')
      }

      alert('Your mentor request has been submitted! The team leader will review your request.')
      // Refresh teams to update status
      await fetchTeams()
    } catch (error) {
      console.error('Error submitting mentor request:', error)
      alert('Failed to submit mentor request. Please try again.')
    } finally {
      setRequestingMentorship(null)
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
      <nav className="flex justify-between items-center gap-3 p-4 sm:p-6 md:px-12 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <HamburgerMenu />
          <Link
            href="/"
            className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent truncate"
          >
            HackConnect
          </Link>
        </div>
        <div className="hidden lg:flex gap-4 xl:gap-6 items-center">
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
        </div>
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          <JoinRequestNotification userId={currentUser?.id} />
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-8 h-8 text-purple-400" />
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
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
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => {
                if (!currentUser) {
                  alert('Please log in to create a team')
                  return
                }
                setIsCreateModalOpen(true)
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Team
            </Button>
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
                      isMentor={currentUser?.role === 'mentor'}
                      onRequestMentor={handleRequestMentor}
                      isRequestingMentor={requestingMentorship === team.id}
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

      {/* Create Team Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Create New Team
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Start building your dream team for the next hackathon
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-white">
                  Team Name *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your team name"
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-white">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your team's goals and what you're looking to build"
                  rows={4}
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                />
              </div>

              <div>
                <Label htmlFor="hackathon" className="text-white">
                  Hackathon
                </Label>
                <Select
                  value={formData.hackathon_id}
                  onValueChange={(value) => setFormData({ ...formData, hackathon_id: value })}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Select a hackathon (optional)" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="none">No specific hackathon</SelectItem>
                    {hackathons.map((hackathon) => (
                      <SelectItem key={hackathon.id} value={hackathon.id}>
                        {hackathon.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="max_members" className="text-white">
                  Maximum Team Size *
                </Label>
                <Select
                  value={formData.max_members}
                  onValueChange={(value) => setFormData({ ...formData, max_members: value })}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="2">2 members</SelectItem>
                    <SelectItem value="3">3 members</SelectItem>
                    <SelectItem value="4">4 members</SelectItem>
                    <SelectItem value="5">5 members</SelectItem>
                    <SelectItem value="6">6 members</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="project_idea" className="text-white">
                  Project Idea
                </Label>
                <Textarea
                  id="project_idea"
                  value={formData.project_idea}
                  onChange={(e) => setFormData({ ...formData, project_idea: e.target.value })}
                  placeholder="Describe the project you're planning to build"
                  rows={3}
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                />
              </div>

              <div>
                <Label className="text-white">Skills Needed</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Add a skill (e.g., React, Python)"
                    className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  />
                  <Button type="button" onClick={addSkill} className="bg-blue-600 hover:bg-blue-700">
                    Add
                  </Button>
                </div>
                {formData.skills_needed.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {formData.skills_needed.map((skill) => (
                      <Badge key={skill} className="bg-purple-600 text-white flex items-center gap-1">
                        {skill}
                        <X 
                          className="w-3 h-3 cursor-pointer hover:text-red-300" 
                          onClick={() => removeSkill(skill)}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <Label className="text-white">Roles Needed</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    placeholder="Add a role (e.g., Frontend Dev, Designer)"
                    className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRole())}
                  />
                  <Button type="button" onClick={addRole} className="bg-blue-600 hover:bg-blue-700">
                    Add
                  </Button>
                </div>
                {formData.roles_needed.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {formData.roles_needed.map((role) => (
                      <Badge key={role} className="bg-blue-600 text-white flex items-center gap-1">
                        {role}
                        <X 
                          className="w-3 h-3 cursor-pointer hover:text-red-300" 
                          onClick={() => removeRole(role)}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsCreateModalOpen(false)
                resetForm()
              }}
              className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
              disabled={isCreatingTeam}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleCreateTeam}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isCreatingTeam}
            >
              {isCreatingTeam ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Team'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}