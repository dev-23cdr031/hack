"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, MessageCircle } from "lucide-react"
import type { Team } from "@/lib/types"

interface TeamCardProps {
  team: Team
  onJoin: (teamId: string) => void
  onMessage: (teamId: string) => void
  onView?: (teamId: string) => void
  currentUserId?: string
  userRequestStatus?: 'pending' | 'approved' | 'rejected' | null
}

export function TeamCard({ team, onJoin, onMessage, onView, currentUserId, userRequestStatus }: TeamCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "forming":
        return "bg-yellow-500/20 text-yellow-400"
      case "active":
        return "bg-green-500/20 text-green-400"
      case "completed":
        return "bg-gray-500/20 text-gray-400"
      default:
        return "bg-yellow-500/20 text-yellow-400"
    }
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-blue-500 transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-white">{team.name}</h3>
        <Badge className={getStatusColor(team.status)}>{team.status}</Badge>
      </div>

      {team.hackathon && (
        <div className="mb-4">
          <p className="text-blue-400 text-sm mb-1">Hackathon:</p>
          <p className="text-white font-medium">{team.hackathon.title}</p>
          <p className="text-xs text-gray-400 mt-1">
            {new Date(team.hackathon.start_date).toLocaleDateString()} - {new Date(team.hackathon.end_date).toLocaleDateString()}
          </p>
        </div>
      )}

      {team.description && (
        <div className="mb-4">
          <p className="text-gray-400 text-sm mb-1">Description:</p>
          <p className="text-gray-300 text-sm">{team.description}</p>
        </div>
      )}

      {team.project_idea && (
        <div className="mb-4">
          <p className="text-gray-400 text-sm mb-1">Project Idea:</p>
          <p className="text-gray-300 text-sm">{team.project_idea}</p>
        </div>
      )}

      <div className="mb-4">
        <p className="text-sm text-gray-400 mb-2">
          Team Members ({team.current_members}/{team.max_members})
        </p>
        <div className="flex flex-wrap gap-3 mb-2">
          {team.members?.slice(0, 4).map((member) => (
            <div key={member.id} className="flex items-center gap-2">
              <Avatar className="w-8 h-8">
                <AvatarImage src={member.avatar_url || "/placeholder.svg"} />
                <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm text-gray-300">{member.name}</p>
                {member.title && <p className="text-xs text-gray-500">{member.title}</p>}
              </div>
            </div>
          ))}
        </div>
        {team.members && team.members.length > 4 && (
          <p className="text-xs text-gray-500">+{team.members.length - 4} more members</p>
        )}
      </div>

      {team.roles_needed && team.roles_needed.length > 0 && (
        <div className="mb-4">
          <p className="text-sm text-gray-400 mb-2">Roles Needed:</p>
          <div className="flex flex-wrap gap-2">
            {team.roles_needed.map((role, index) => (
              <Badge key={index} variant="outline" className="text-xs bg-blue-900/30 text-blue-300 border-blue-800">
                {role}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {team.skills_needed && team.skills_needed.length > 0 && (
        <div className="mb-4">
          <p className="text-sm text-gray-400 mb-2">Skills Needed:</p>
          <div className="flex flex-wrap gap-2">
            {team.skills_needed.map((skill, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {team.communication_platform && (
        <div className="mb-4">
          <p className="text-sm text-gray-400 mb-1">Communication:</p>
          <p className="text-sm text-gray-300">{team.communication_platform}</p>
        </div>
      )}

      {team.meeting_schedule && (
        <div className="mb-4">
          <p className="text-sm text-gray-400 mb-1">Meeting Schedule:</p>
          <p className="text-sm text-gray-300">{team.meeting_schedule}</p>
        </div>
      )}

      <div className="flex justify-between items-center pt-4 border-t border-gray-800">
        <div className="text-sm text-blue-400">
          {team.max_members - team.current_members > 0
            ? `Looking for ${team.max_members - team.current_members} more member${team.max_members - team.current_members > 1 ? "s" : ""}`
            : "Team is full"}
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onMessage(team.id)}
            className="bg-gray-800 border-gray-600 text-gray-200 hover:bg-gray-700"
          >
            <MessageCircle className="w-4 h-4 mr-1" />
            Message
          </Button>
          {team.max_members - team.current_members > 0 && (
            <>
              {/* Check if user is already a member */}
              {currentUserId && team.members?.some(member => member.id === currentUserId) ? (
                <Badge className="bg-green-500/20 text-green-400 hidden md:inline-block">
                  Member
                </Badge>
              ) : currentUserId && team.leader_id === currentUserId ? (
                <Badge className="bg-purple-500/20 text-purple-400 hidden md:inline-block">
                  Team Leader
                </Badge>
              ) : userRequestStatus === 'pending' ? (
                <Button 
                  size="sm" 
                  disabled
                  className="bg-yellow-600/50 text-yellow-300 cursor-not-allowed hidden md:inline-block"
                >
                  <Users className="w-4 h-4 mr-1" />
                  Request Pending
                </Button>
              ) : userRequestStatus === 'rejected' ? (
                <Button 
                  size="sm" 
                  disabled
                  className="bg-red-600/50 text-red-300 cursor-not-allowed hidden md:inline-block"
                >
                  <Users className="w-4 h-4 mr-1" />
                  Request Rejected
                </Button>
              ) : (
                <Button 
                  size="sm" 
                  onClick={() => onJoin(team.id)}
                  className="bg-blue-600 hover:bg-blue-700 text-white hidden md:inline-block"
                >
                  <Users className="w-4 h-4 mr-1" />
                  Request to Join
                </Button>
              )}
              {onView && (
                <Button
                  size="sm"
                  onClick={() => onView(team.id)}
                  className="bg-blue-600 hover:bg-blue-700 text-white md:hidden"
                >
                  <Users className="w-4 h-4 mr-1" />
                  View
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )}
