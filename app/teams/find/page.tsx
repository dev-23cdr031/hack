"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Users, MessageCircle } from "lucide-react"
import Link from "next/link"
import type { Team } from "@/lib/types"
import { mockTeams } from "@/lib/mock-teams"

export default function FindTeamsPage() {
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [skillFilter, setSkillFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setTeams(mockTeams)
      setLoading(false)
    }, 1000)
  }, [])

  const filteredTeams = teams.filter((team) => {
    const matchesSearch =
      team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSkill =
      !skillFilter || team.skills_needed.some((skill) => skill.toLowerCase().includes(skillFilter.toLowerCase()))
    const matchesStatus = statusFilter === "all" || team.status === statusFilter

    return matchesSearch && matchesSkill && matchesStatus
  })

  const handleJoinTeam = (teamId: string) => {
    alert(`Joined team ${teamId}! (Demo)`)
  }

  const handleMessageTeam = (teamId: string) => {
    alert(`Opening messages for team ${teamId}! (Demo)`)
  }

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
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-6 md:px-12 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
        <Link
          href="/"
          className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
        >
          HackConnect
        </Link>
        <div className="flex gap-6">
          <Link href="/hackathons" className="text-gray-300 hover:text-blue-400">
            Explore
          </Link>
          <Link href="/teams" className="text-blue-400 font-medium">
            Teams
          </Link>
          <Link href="/profile" className="text-gray-300 hover:text-blue-400">
            Profile
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
            Find Teams
          </h1>
          <p className="text-gray-400">Discover teams looking for talented members like you</p>
        </div>

        {/* Filters */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search teams..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
              />
            </div>
            <Input
              placeholder="Filter by skill..."
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="forming">Forming</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Teams Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-900 rounded-lg p-6 animate-pulse">
                <div className="h-6 bg-gray-800 rounded mb-4"></div>
                <div className="h-4 bg-gray-800 rounded mb-2"></div>
                <div className="h-4 bg-gray-800 rounded mb-4"></div>
                <div className="h-10 bg-gray-800 rounded"></div>
              </div>
            ))}
          </div>
        ) : filteredTeams.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTeams.map((team) => (
              <div
                key={team.id}
                className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-blue-500 transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-white">{team.name}</h3>
                  <Badge className={getStatusColor(team.status)}>{team.status}</Badge>
                </div>

                {team.hackathon && <p className="text-blue-400 text-sm mb-3">{team.hackathon.title}</p>}

                {team.description && <p className="text-gray-400 text-sm mb-4 line-clamp-2">{team.description}</p>}

                <div className="mb-4">
                  <p className="text-sm text-gray-400 mb-2">
                    Members ({team.current_members}/{team.max_members})
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {team.members?.slice(0, 3).map((member) => (
                      <div key={member.id} className="flex items-center gap-2">
                        <Avatar className="w-6 h-6">
                          <AvatarImage src={member.avatar_url || "/placeholder.svg"} />
                          <AvatarFallback className="text-xs">{member.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-gray-300">{member.name}</span>
                      </div>
                    ))}
                    {team.members && team.members.length > 3 && (
                      <span className="text-xs text-gray-400">+{team.members.length - 3} more</span>
                    )}
                  </div>
                </div>

                {team.skills_needed && team.skills_needed.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-400 mb-2">Looking for</p>
                    <div className="flex flex-wrap gap-2">
                      {team.skills_needed.slice(0, 3).map((skill, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {team.skills_needed.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{team.skills_needed.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center pt-4 border-t border-gray-800">
                  <div className="text-sm text-blue-400">
                    {team.max_members - team.current_members > 0
                      ? `${team.max_members - team.current_members} spot${team.max_members - team.current_members > 1 ? "s" : ""} left`
                      : "Team is full"}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleMessageTeam(team.id)}
                      className="bg-gray-800 border-gray-600 text-gray-200 hover:bg-gray-700"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </Button>
                    {team.max_members - team.current_members > 0 && (
                      <Button
                        size="sm"
                        onClick={() => handleJoinTeam(team.id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <Users className="w-4 h-4 mr-1" />
                        Join
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">No teams found</h3>
            <p className="text-gray-400 mb-6">Try adjusting your search criteria or create your own team.</p>
            <Link href="/teams/create">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">Create New Team</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
