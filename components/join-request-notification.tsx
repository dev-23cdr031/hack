"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bell, UserPlus, X } from "lucide-react"
import Link from "next/link"
import type { TeamJoinRequest } from "@/lib/types"

interface JoinRequestNotificationProps {
  userId?: string
}

export function JoinRequestNotification({ userId }: JoinRequestNotificationProps) {
  const [pendingRequests, setPendingRequests] = useState<TeamJoinRequest[]>([])
  const [showNotification, setShowNotification] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (userId) {
      fetchPendingRequests()
      
      // Check every 30 seconds for new requests
      const interval = setInterval(fetchPendingRequests, 30000)
      return () => clearInterval(interval)
    }
  }, [userId])

  const fetchPendingRequests = async () => {
    if (!userId) return

    try {
      setLoading(true)
      
      // Fetch user's teams first
      const teamsResponse = await fetch(`/api/teams?user_id=${userId}`)
      const teamsData = await teamsResponse.json()
      
      // Filter to only teams where user is the leader
      const leaderTeams = teamsData.filter((team: any) => team.leader_id === userId)
      
      // Fetch pending requests for all teams
      const allRequests: TeamJoinRequest[] = []
      
      for (const team of leaderTeams) {
        try {
          const requestsResponse = await fetch(`/api/teams/${team.id}/requests`)
          const requestsResult = await requestsResponse.json()
          const teamPendingRequests = (requestsResult.requests || []).filter(
            (req: TeamJoinRequest) => req.status === 'pending'
          )
          allRequests.push(...teamPendingRequests)
        } catch (err) {
          console.error(`Error fetching requests for team ${team.id}:`, err)
        }
      }
      
      setPendingRequests(allRequests)
      
      // Show notification if there are new pending requests
      if (allRequests.length > 0) {
        setShowNotification(true)
      }
    } catch (err) {
      console.error('Error fetching pending requests:', err)
    } finally {
      setLoading(false)
    }
  }

  if (!userId || pendingRequests.length === 0) {
    return null
  }

  return (
    <>
      {/* Notification Bell Icon */}
      <div className="relative">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowNotification(!showNotification)}
          className="relative text-gray-300 hover:text-white"
        >
          <Bell className="w-5 h-5" />
          {pendingRequests.length > 0 && (
            <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs min-w-[1.2rem] h-5 flex items-center justify-center rounded-full">
              {pendingRequests.length}
            </Badge>
          )}
        </Button>

        {/* Notification Dropdown */}
        {showNotification && (
          <div className="absolute right-0 top-full mt-2 w-80 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-50">
            <div className="p-4 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-purple-400" />
                  <h3 className="font-semibold text-white">Join Requests</h3>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowNotification(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-sm text-gray-400 mt-1">
                {pendingRequests.length} pending request{pendingRequests.length !== 1 ? 's' : ''}
              </p>
            </div>

            <div className="max-h-64 overflow-y-auto">
              {pendingRequests.slice(0, 5).map((request) => (
                <div key={request.id} className="p-3 border-b border-gray-800 last:border-b-0 hover:bg-gray-800/50">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      {request.user?.name?.charAt(0) || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {request.user?.name || 'Unknown User'}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        wants to join {request.team?.name || 'your team'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(request.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 border-t border-gray-700">
              <Link href="/teams/manage">
                <Button 
                  size="sm" 
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  onClick={() => setShowNotification(false)}
                >
                  Manage All Requests
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Overlay to close notification */}
      {showNotification && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowNotification(false)}
        />
      )}
    </>
  )
}
