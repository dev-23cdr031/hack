"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Users, 
  MessageCircle, 
  User, 
  Home, 
  Compass, 
  Globe,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  UserPlus,
  Loader2,
  Mail,
  Calendar
} from "lucide-react"
import Link from "next/link"
import { HamburgerMenu } from "@/components/hamburger-menu"
import { TeamJoinRequestsModal } from "@/components/team-join-requests-modal"
import type { Team, TeamJoinRequest } from "@/lib/types"

export default function ManageTeamsPage() {
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [myTeams, setMyTeams] = useState<Team[]>([])
  const [joinRequests, setJoinRequests] = useState<{ [teamId: string]: TeamJoinRequest[] }>({})
  const [loading, setLoading] = useState(true)
  const [processingRequest, setProcessingRequest] = useState<string | null>(null)
  const [selectedTeamForRequests, setSelectedTeamForRequests] = useState<string | null>(null)

  // Get current user from localStorage
  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setCurrentUser(JSON.parse(userData))
    }
  }, [])

  // Fetch user's teams and join requests
  useEffect(() => {
    if (currentUser) {
      fetchMyTeamsAndRequests()
    }
  }, [currentUser])

  const fetchMyTeamsAndRequests = async () => {
    if (!currentUser) return

    try {
      setLoading(true)

      // Fetch teams where user is the leader
      const teamsResponse = await fetch(`/api/teams?user_id=${currentUser.id}`)
      const teamsData = await teamsResponse.json()
      
      // Filter to only teams where user is the leader
      const leaderTeams = teamsData.filter((team: Team) => team.leader_id === currentUser.id)
      setMyTeams(leaderTeams)

      // Fetch join requests for each team
      const requestsData: { [teamId: string]: TeamJoinRequest[] } = {}
      
      for (const team of leaderTeams) {
        try {
          const requestsResponse = await fetch(`/api/teams/${team.id}/requests`)
          const requestsResult = await requestsResponse.json()
          requestsData[team.id] = requestsResult.requests || []
        } catch (err) {
          console.error(`Error fetching requests for team ${team.id}:`, err)
          requestsData[team.id] = []
        }
      }
      
      setJoinRequests(requestsData)
    } catch (err) {
      console.error('Error fetching teams and requests:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleRequestAction = async (teamId: string, requestId: string, action: 'approve' | 'reject') => {
    if (!currentUser) return

    try {
      setProcessingRequest(requestId)

      const response = await fetch(`/api/teams/${teamId}/requests`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          request_id: requestId,
          action: action,
          reviewer_id: currentUser.id
        })
      })

      const data = await response.json()

      if (response.ok) {
        alert(`Request ${action}d successfully!`)
        // Refresh the data
        fetchMyTeamsAndRequests()
      } else {
        alert(`Failed to ${action} request: ${data.error}`)
      }
    } catch (err) {
      console.error(`Error ${action}ing request:`, err)
      alert(`Failed to ${action} request. Please try again.`)
    } finally {
      setProcessingRequest(null)
    }
  }

  const getRequestStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400'
      case 'approved':
        return 'bg-green-500/20 text-green-400'
      case 'rejected':
        return 'bg-red-500/20 text-red-400'
      default:
        return 'bg-gray-500/20 text-gray-400'
    }
  }

  const totalPendingRequests = Object.values(joinRequests).reduce(
    (total, requests) => total + requests.filter(req => req.status === 'pending').length,
    0
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
        <div className="hidden lg:flex gap-4 xl:gap-6">
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
          <Link href="/teams" className="text-gray-300 hover:text-blue-400 flex items-center gap-2 transition-colors">
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
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <UserPlus className="w-8 h-8 text-purple-400" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Manage Teams
              </h1>
            </div>
            <p className="text-gray-400 text-lg">Review join requests and manage your teams</p>
          </div>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link href="/teams">
              <Button variant="outline" className="bg-gray-800/50 border-gray-600 text-gray-200 hover:bg-gray-700">
                <Users className="w-4 h-4 mr-2" />
                Browse Teams
              </Button>
            </Link>
            <Link href="/teams/create">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <UserPlus className="w-4 h-4 mr-2" />
                Create Team
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-blue-400" />
              <div>
                <p className="text-2xl font-bold text-white">{myTeams.length}</p>
                <p className="text-gray-400 text-sm">Teams Leading</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-yellow-400" />
              <div>
                <p className="text-2xl font-bold text-white">{totalPendingRequests}</p>
                <p className="text-gray-400 text-sm">Pending Requests</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-400" />
              <div>
                <p className="text-2xl font-bold text-white">
                  {Object.values(joinRequests).reduce(
                    (total, requests) => total + requests.filter(req => req.status === 'approved').length,
                    0
                  )}
                </p>
                <p className="text-gray-400 text-sm">Approved</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800">
            <div className="flex items-center gap-3">
              <XCircle className="w-8 h-8 text-red-400" />
              <div>
                <p className="text-2xl font-bold text-white">
                  {Object.values(joinRequests).reduce(
                    (total, requests) => total + requests.filter(req => req.status === 'rejected').length,
                    0
                  )}
                </p>
                <p className="text-gray-400 text-sm">Rejected</p>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-400" />
            <p className="text-gray-400">Loading your teams...</p>
          </div>
        )}

        {/* Teams and Requests */}
        {!loading && (
          <>
            {myTeams.length > 0 ? (
              <div className="space-y-8">
                {myTeams.map((team) => {
                  const teamRequests = joinRequests[team.id] || []
                  const pendingRequests = teamRequests.filter(req => req.status === 'pending')
                  
                  return (
                    <div key={team.id} className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800">
                      {/* Team Header */}
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <h3 className="text-2xl font-bold text-white mb-2">{team.name}</h3>
                          <p className="text-gray-400 mb-2">{team.description}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>{team.current_members}/{team.max_members} members</span>
                            <Badge className={getRequestStatusColor(team.status)}>{team.status}</Badge>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Link href={`/teams/${team.id}`}>
                            <Button size="sm" variant="outline" className="bg-gray-800/50 border-gray-600 text-gray-200 hover:bg-gray-700">
                              View Team
                            </Button>
                          </Link>
                          {pendingRequests.length > 0 && (
                            <Button 
                              size="sm" 
                              onClick={() => setSelectedTeamForRequests(team.id)}
                              className="bg-purple-600 hover:bg-purple-700 text-white relative"
                            >
                              <UserPlus className="w-4 h-4 mr-2" />
                              Review Requests
                              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                                {pendingRequests.length}
                              </span>
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Join Requests */}
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <Mail className="w-5 h-5 text-blue-400" />
                          <h4 className="text-lg font-semibold text-white">
                            Join Requests ({teamRequests.length})
                          </h4>
                          {pendingRequests.length > 0 && (
                            <Badge className="bg-yellow-500/20 text-yellow-400">
                              {pendingRequests.length} pending
                            </Badge>
                          )}
                        </div>

                        {teamRequests.length > 0 ? (
                          <div className="space-y-4">
                            {teamRequests.map((request) => (
                              <div key={request.id} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                                <div className="flex justify-between items-start">
                                  <div className="flex items-start gap-3 flex-1">
                                    <Avatar className="w-10 h-10">
                                      <AvatarImage src={request.user?.avatar_url || "/placeholder.svg"} />
                                      <AvatarFallback>{request.user?.name?.charAt(0) || 'U'}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-1">
                                        <h5 className="font-semibold text-white">{request.user?.name || 'Unknown User'}</h5>
                                        <Badge className={getRequestStatusColor(request.status)}>
                                          {request.status}
                                        </Badge>
                                      </div>
                                      <p className="text-sm text-gray-400 mb-2">{request.user?.title || 'Developer'}</p>
                                      {request.message && (
                                        <p className="text-sm text-gray-300 bg-gray-700/50 rounded p-2 mb-2">
                                          "{request.message}"
                                        </p>
                                      )}
                                      <div className="flex items-center gap-4 text-xs text-gray-500">
                                        <div className="flex items-center gap-1">
                                          <Calendar className="w-3 h-3" />
                                          <span>Requested {new Date(request.created_at).toLocaleDateString()}</span>
                                        </div>
                                        {request.reviewed_at && (
                                          <div className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            <span>Reviewed {new Date(request.reviewed_at).toLocaleDateString()}</span>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  
                                  {request.status === 'pending' && (
                                    <div className="flex gap-2 ml-4">
                                      <Button
                                        size="sm"
                                        onClick={() => handleRequestAction(team.id, request.id, 'approve')}
                                        disabled={processingRequest === request.id}
                                        className="bg-green-600 hover:bg-green-700 text-white"
                                      >
                                        {processingRequest === request.id ? (
                                          <Loader2 className="w-3 h-3 animate-spin" />
                                        ) : (
                                          <CheckCircle className="w-3 h-3" />
                                        )}
                                      </Button>
                                      <Button
                                        size="sm"
                                        onClick={() => handleRequestAction(team.id, request.id, 'reject')}
                                        disabled={processingRequest === request.id}
                                        variant="outline"
                                        className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                                      >
                                        {processingRequest === request.id ? (
                                          <Loader2 className="w-3 h-3 animate-spin" />
                                        ) : (
                                          <XCircle className="w-3 h-3" />
                                        )}
                                      </Button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <AlertCircle className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                            <p className="text-gray-400">No join requests yet</p>
                            <p className="text-sm text-gray-500">People will see your team and can request to join</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="max-w-md mx-auto">
                  <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Users className="w-12 h-12 text-gray-600" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-300">No Teams to Manage</h3>
                  <p className="text-gray-500 mb-8 leading-relaxed">
                    You're not currently leading any teams. Create a team to start building your project and collaborate with others!
                  </p>
                  <Link href="/teams/create">
                    <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                      <UserPlus className="w-4 h-4 mr-2" />
                      Create Your First Team
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Team Join Requests Modal */}
      <TeamJoinRequestsModal
        isOpen={selectedTeamForRequests !== null}
        onClose={() => {
          setSelectedTeamForRequests(null)
          // Refresh data after closing modal
          fetchMyTeamsAndRequests()
        }}
        teamId={selectedTeamForRequests || undefined}
        currentUser={currentUser}
      />
    </div>
  )
}
