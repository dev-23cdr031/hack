"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Users, 
  ArrowLeft, 
  Loader2, 
  MessageCircle, 
  Calendar, 
  Clock, 
  Target, 
  Briefcase,
  UserPlus,
  Shield
} from "lucide-react"
import { JoinTeamModal } from "@/components/teams/join-team-modal"
import type { Team, User, Hackathon } from "@/lib/types"

interface TeamDetails extends Team {
  members: User[]
  hackathon?: Hackathon
}

export default function TeamDetailsPage() {
  const params = useParams() as { id?: string }
  const router = useRouter()
  const id = params?.id as string

  const [team, setTeam] = useState<TeamDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [joining, setJoining] = useState(false)
  const [joinModalOpen, setJoinModalOpen] = useState(false)

  useEffect(() => {
    if (!id) return
    let ignore = false
    
    console.log('Team ID from params:', id)
    
    ;(async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Decode the ID in case it was encoded in the URL
        const decodedId = decodeURIComponent(id)
        console.log('Fetching team with ID:', decodedId)
        
        const res = await fetch(`/api/teams/${decodedId}`)
        console.log('API response status:', res.status)
        
        const data = await res.json()
        console.log('API response data:', data)
        
        if (!res.ok) throw new Error(data?.error || 'Failed to load team')
        if (!ignore) setTeam(data.team)
      } catch (e: any) {
        console.error('Error loading team:', e)
        setError(e?.message || 'Failed to load team')
      } finally {
        if (!ignore) setLoading(false)
      }
    })()
    return () => { ignore = true }
  }, [id])

  const handleJoin = async () => {
    if (!id) return
    try {
      setJoining(true)
      
      // Safely get user data from localStorage
      let user = null
      try {
        const raw = localStorage.getItem('user')
        if (raw) {
          user = JSON.parse(raw)
        }
      } catch (parseError) {
        console.error('Error parsing user data:', parseError)
        // If there's an error parsing, we'll handle it with the check below
      }
      
      // For demo purposes, if no user is found, create a mock user
      if (!user?.id) {
        // In a real app, you would redirect to login
        // For this demo, we'll create a mock user
        user = {
          id: "demo-user-" + Math.random().toString(36).substring(2, 8),
          name: "Demo User",
          email: "demo@example.com"
        }
        
        // Store the mock user in localStorage for future use
        localStorage.setItem('user', JSON.stringify(user))
      }
      
      const res = await fetch(`/api/teams/${id}/join`, { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ user_id: user.id }) 
      })
      
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Join failed')
      
      // Refresh the team data
      const teamRes = await fetch(`/api/teams/${id}`)
      const teamData = await teamRes.json()
      if (teamRes.ok) {
        setTeam(teamData.team)
      }
      
      // Show success message
      alert('Joined team successfully!')
    } catch (e: any) {
      alert(e?.message || 'Join failed')
    } finally {
      setJoining(false)
    }
  }

  function statusColor(status: string) {
    switch (status) {
      case 'forming': return 'bg-yellow-500/20 text-yellow-400'
      case 'active': return 'bg-green-500/20 text-green-400'
      case 'completed': return 'bg-gray-500/20 text-gray-400'
      default: return 'bg-yellow-500/20 text-yellow-400'
    }
  }

  const handleMentorRequest = async () => {
    if (!id || !currentUser) return
    
    try {
      setRequestingMentorship(true)
      
      const res = await fetch(`/api/teams/${id}/request-mentor`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          mentor_id: currentUser.id,
          team_leader_id: team.leader_id,
          message: mentorRequestMessage || "I'd like to mentor this team"
        })
      })
      
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Failed to submit mentor request')
      
      // Refresh team data
      const teamRes = await fetch(`/api/teams/${id}`)
      const teamData = await teamRes.json()
      if (teamRes.ok) {
        setTeam(teamData.team)
      }
      
      alert('Mentor request submitted successfully! The team leader will review your request.')
      setShowMentorRequestModal(false)
    } catch (e: any) {
      alert(e?.message || 'Failed to submit mentor request')
    } finally {
      setRequestingMentorship(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="max-w-5xl mx-auto p-6">
          <Button variant="ghost" className="text-gray-300" asChild>
            <Link href="/teams"><ArrowLeft className="w-4 h-4 mr-2"/> Back</Link>
          </Button>
          <div className="py-20 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-400"/>
            <p className="text-gray-400">Loading team...</p>
          </div>
             {/* Mentor Request Modal */}
        {showMentorRequestModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4 border border-gray-700">
              <h3 className="text-xl font-bold mb-4">Offer to Mentor This Team</h3>
              <p className="text-gray-400 mb-4">
                You're about to submit a request to mentor this team. The team leader will review your request and can approve or decline it.
              </p>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Message to Team Leader</label>
                <textarea
                  value={mentorRequestMessage}
                  onChange={(e) => setMentorRequestMessage(e.target.value)}
                  placeholder="Tell the team why you'd be a good mentor for their project..."
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg resize-none h-32 text-white placeholder-gray-400"
                />
              </div>
              
              <div className="flex gap-3 justify-end">
                <Button
                  variant="ghost"
                  onClick={() => setShowMentorRequestModal(false)}
                  disabled={requestingMentorship}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleMentorRequest}
                  disabled={requestingMentorship}
                >
                  {requestingMentorship ? 'Submitting...' : 'Submit Request'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

  if (error || !team) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="max-w-5xl mx-auto p-6">
          <Button variant="ghost" className="text-gray-300" asChild>
            <Link href="/teams"><ArrowLeft className="w-4 h-4 mr-2"/> Back</Link>
          </Button>
          <div className="py-20 text-center">
            <p className="text-red-400">{error || 'Team not found'}</p>
          </div>
        </div>
      </div>
    )
  }

  const isTeamFull = team.current_members >= team.max_members
  const isTeamCompleted = team.status === 'completed'
  const canJoin = !isTeamFull && !isTeamCompleted
  
  // Check if current user is the team leader
  const isTeamLeader = currentUser?.id === team.leader_id
  // Check if current user is a mentor
  const isMentor = currentUser?.role === 'mentor'
  // Check if team already has a mentor
  const hasMentor = team.mentor_id && team.mentor_status === 'approved'
  // Check if there's a pending mentor request
  const hasPendingMentorRequest = team.mentor_status === 'requested'
  
  const [requestingMentorship, setRequestingMentorship] = useState(false)
  const [mentorRequestMessage, setMentorRequestMessage] = useState("")
  const [showMentorRequestModal, setShowMentorRequestModal] = useState(false)

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        <Button variant="ghost" className="text-gray-300" asChild>
          <Link href="/teams"><ArrowLeft className="w-4 h-4 mr-2"/> Back</Link>
        </Button>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-red-600">{team.name}</h1>
            {team.hackathon?.title && (
              <p className="text-blue-400 mt-1">Hackathon: {team.hackathon.title}</p>
            )}
          </div>
          <div className="flex flex-col sm:items-end gap-2">
            <Badge className={`${statusColor(team.status)} capitalize`}>{team.status}</Badge>
            <div className="text-sm text-gray-400 flex items-center gap-1">
              <Users className="w-4 h-4" /> 
              <span>{team.current_members}/{team.max_members} members</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card className="bg-gray-900/60 border-gray-800">
              <CardContent className="p-6 space-y-4">
                {team.description && (
                  <div>
                    <h2 className="text-xl font-semibold mb-2 text-red-600">About the team</h2>
                    <p className="text-gray-300 leading-relaxed">{team.description}</p>
                  </div>
                )}

                {team.project_idea && (
                  <div>
                    <h2 className="text-xl font-semibold mb-2 text-red-600 flex items-center gap-2">
                      <Target className="w-5 h-5" /> Project Idea
                    </h2>
                    <p className="text-gray-300 leading-relaxed">{team.project_idea}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-gray-900/60 border-gray-800">
              <CardContent className="p-6 space-y-4">
                <h3 className="text-lg font-semibold mb-2 text-blue-400 flex items-center gap-2">
                  <Users className="w-5 h-5" /> Members ({team.current_members}/{team.max_members})
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {team.members?.map((m) => (
                    <div key={m.id} className="flex items-center gap-3 p-3 rounded-md bg-gray-800/30 border border-gray-800">
                      {(() => {
                        const raw = (m.avatar_url || '/placeholder-user.jpg').trim()
                        const isExternal = /^https?:\/\//i.test(raw)
                        const src = isExternal ? raw : raw.startsWith('/') ? raw : `/${raw}`
                        return isExternal ? (
                          <img src={src} alt={m.name} width={48} height={48} className="rounded-full object-cover" />
                        ) : (
                          <Image src={src} alt={m.name} width={48} height={48} className="rounded-full object-cover" />
                        )
                      })()}
                      <div>
                        <div className="text-white font-medium">{m.name}</div>
                        <div className="text-xs text-gray-400">{m.title || m.email}</div>
                        {m.id === team.leader_id && (
                          <Badge variant="outline" className="mt-1 text-xs border-yellow-800 text-yellow-400">Team Leader</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                  {(!team.members || team.members.length === 0) && (
                    <div className="text-blue-400 col-span-2">No members listed yet.</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-gray-900/60 border-gray-800">
              <CardContent className="p-6 space-y-4">
                <h3 className="text-lg font-semibold mb-2 text-blue-400">Team Details</h3>
                
                <div className="space-y-4">
                  {team.meeting_schedule && (
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium text-white">Meeting Schedule</h4>
                        <p className="text-xs text-gray-400 mt-1">{team.meeting_schedule}</p>
                      </div>
                    </div>
                  )}
                  
                  {team.communication_platform && (
                    <div className="flex items-start gap-3">
                      <MessageCircle className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium text-white">Communication</h4>
                        <p className="text-xs text-gray-400 mt-1">{team.communication_platform}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-white">Time Commitment</h4>
                      <p className="text-xs text-gray-400 mt-1">Regular participation expected throughout the hackathon</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-white">Team Rules</h4>
                      <p className="text-xs text-gray-400 mt-1">Professional conduct and regular communication required</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {team.skills_needed && team.skills_needed.length > 0 && (
              <Card className="bg-gray-900/60 border-gray-800">
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-lg font-semibold mb-2 text-blue-400 flex items-center gap-2">
                    <Briefcase className="w-5 h-5" /> Skills Needed
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {team.skills_needed.map((s, i) => (
                      <Badge key={i} variant="secondary" className="bg-blue-900/30 text-blue-400 border-blue-800">
                        {s}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            
            {team.roles_needed && team.roles_needed.length > 0 && (
              <Card className="bg-gray-900/60 border-gray-800">
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-lg font-semibold mb-2 text-blue-400 flex items-center gap-2">
                    <UserPlus className="w-5 h-5" /> Roles Needed
                  </h3>
                  <div className="space-y-2">
                    {team.roles_needed.map((role, i) => (
                      <div key={i} className="p-2 rounded bg-gray-800/50 text-sm text-gray-300">
                        {role}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <div className="sticky bottom-0 bg-black/60 backdrop-blur-md py-4 border-t border-gray-800">
          <div className="flex justify-end gap-2">
            <Button variant="outline" className="border-gray-700 text-gray-300" asChild>
              <Link href={`/messages?team=${team.id}`}><MessageCircle className="w-4 h-4 mr-2"/> Message Team</Link>
            </Button>
            <Button 
              onClick={() => setJoinModalOpen(true)} 
              disabled={joining || !canJoin} 
              className="bg-red-600 hover:bg-red-700"
            >
              {isTeamFull ? (
                'Team Full'
              ) : isTeamCompleted ? (
                'Team Completed'
              ) : (
                'Join Now'
              )}
            </Button>
            {/* Mentor request button - only show to mentors who can offer mentorship */}
            {isMentor && !isMember && !isTeamLeader && !hasMentor && !hasPendingMentorRequest && (
              <Button 
                onClick={() => setShowMentorRequestModal(true)} 
                disabled={requestingMentorship}
                variant="secondary"
              >
                {requestingMentorship ? 'Requesting...' : 'Offer to Mentor This Team'}
              </Button>
            )}
            
            {/* Show mentor status if team already has a mentor */}
            {hasMentor && (
              <Badge variant="secondary" className="bg-green-500/20 text-green-300">
                🧑‍🏫 Team has a mentor
              </Badge>
            )}
            
            {/* Show pending mentor request status */}
            {hasPendingMentorRequest && (
              <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-300">
                ⏳ Mentor request pending
              </Badge>
            )}
          </div>
        </div>
      </div>
      
      {team && (
        <JoinTeamModal
          team={team}
          isOpen={joinModalOpen}
          onClose={() => setJoinModalOpen(false)}
          onJoin={handleJoin}
          joining={joining}
        />
      )}
      
      {/* Mentor Request Modal */}
      {showMentorRequestModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4 border border-gray-700">
            <h3 className="text-xl font-bold mb-4">Offer to Mentor This Team</h3>
            <p className="text-gray-400 mb-4">
              You're about to submit a request to mentor this team. The team leader will review your request and can approve or decline it.
            </p>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Message to Team Leader</label>
              <textarea
                value={mentorRequestMessage}
                onChange={(e) => setMentorRequestMessage(e.target.value)}
                placeholder="Tell the team why you'd be a good mentor for their project..."
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg resize-none h-32 text-white placeholder-gray-400"
              />
            </div>
            
            <div className="flex gap-3 justify-end">
              <Button
                variant="ghost"
                onClick={() => setShowMentorRequestModal(false)}
                disabled={requestingMentorship}
              >
                Cancel
              </Button>
              <Button
                onClick={handleMentorRequest}
                disabled={requestingMentorship}
              >
                {requestingMentorship ? 'Submitting...' : 'Submit Request'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}