"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { HamburgerMenu } from "@/components/hamburger-menu"
import {
  Activity,
  Trophy,
  Users,
  Code,
  MessageCircle,
  Star,
  GitBranch,
  Clock,
  TrendingUp,
  Award,
  Zap,
  BookOpen,
  Share2,
  Eye,
  Download,
  Plus,
  Filter,
  BarChart3,
  PieChart,
} from "lucide-react"

const activities = [
  {
    id: 1,
    type: "hackathon_join",
    title: "Joined AI Innovation Challenge 2024",
    description: "Registered for the hackathon focusing on machine learning solutions",
    timestamp: "2024-01-15T10:30:00Z",
    icon: Trophy,
    color: "text-yellow-400",
    bgColor: "bg-yellow-400/10",
    metadata: {
      hackathon: "AI Innovation Challenge 2024",
      participants: 2500,
      prize: "$100,000",
    },
  },
  {
    id: 2,
    type: "team_create",
    title: "Created team 'Neural Networks'",
    description: "Formed a new team for the upcoming hackathon with 4 members",
    timestamp: "2024-01-14T16:45:00Z",
    icon: Users,
    color: "text-blue-400",
    bgColor: "bg-blue-400/10",
    metadata: {
      team: "Neural Networks",
      members: 4,
      skills: ["Python", "TensorFlow", "React"],
    },
  },
  {
    id: 3,
    type: "project_star",
    title: "Starred 'EcoTrack Dashboard'",
    description: "Added sustainability tracking project to favorites",
    timestamp: "2024-01-14T14:20:00Z",
    icon: Star,
    color: "text-pink-400",
    bgColor: "bg-pink-400/10",
    metadata: {
      project: "EcoTrack Dashboard",
      stars: 1250,
      language: "React",
    },
  },
  {
    id: 4,
    type: "code_commit",
    title: "Pushed code to 'hackconnect-platform'",
    description: "Added new authentication middleware and user management features",
    timestamp: "2024-01-14T11:15:00Z",
    icon: GitBranch,
    color: "text-green-400",
    bgColor: "bg-green-400/10",
    metadata: {
      repository: "hackconnect-platform",
      commits: 3,
      additions: 245,
      deletions: 67,
    },
  },
  {
    id: 5,
    type: "message_send",
    title: "Sent message in 'CodeCrafters Elite'",
    description: "Discussed project architecture and technology stack choices",
    timestamp: "2024-01-13T20:30:00Z",
    icon: MessageCircle,
    color: "text-purple-400",
    bgColor: "bg-purple-400/10",
    metadata: {
      team: "CodeCrafters Elite",
      messages: 15,
      topic: "Project Planning",
    },
  },
  {
    id: 6,
    type: "achievement_unlock",
    title: "Unlocked 'Team Player' achievement",
    description: "Successfully collaborated with 10+ different team members",
    timestamp: "2024-01-13T18:45:00Z",
    icon: Award,
    color: "text-orange-400",
    bgColor: "bg-orange-400/10",
    metadata: {
      achievement: "Team Player",
      points: 500,
      rarity: "Rare",
    },
  },
  {
    id: 7,
    type: "profile_update",
    title: "Updated profile information",
    description: "Added new skills and updated project portfolio",
    timestamp: "2024-01-12T15:20:00Z",
    icon: Users,
    color: "text-cyan-400",
    bgColor: "bg-cyan-400/10",
    metadata: {
      skills_added: ["Docker", "Kubernetes"],
      projects_updated: 2,
    },
  },
  {
    id: 8,
    type: "resource_save",
    title: "Saved 'Advanced React Patterns'",
    description: "Bookmarked article about scalable React application architecture",
    timestamp: "2024-01-12T09:10:00Z",
    icon: BookOpen,
    color: "text-indigo-400",
    bgColor: "bg-indigo-400/10",
    metadata: {
      resource: "Advanced React Patterns",
      author: "John Smith",
      read_time: "12 min",
    },
  },
]

const stats = [
  {
    label: "Total Activities",
    value: "247",
    change: "+12%",
    trend: "up",
    icon: Activity,
    color: "text-blue-400",
  },
  {
    label: "Hackathons Joined",
    value: "8",
    change: "+2",
    trend: "up",
    icon: Trophy,
    color: "text-yellow-400",
  },
  {
    label: "Teams Created",
    value: "3",
    change: "+1",
    trend: "up",
    icon: Users,
    color: "text-green-400",
  },
  {
    label: "Code Commits",
    value: "156",
    change: "+23",
    trend: "up",
    icon: Code,
    color: "text-purple-400",
  },
]

export default function ActivityPage() {
  const [filterType, setFilterType] = useState("all")
  const [timeRange, setTimeRange] = useState("week")

  const filteredActivities =
    filterType === "all" ? activities : activities.filter((activity) => activity.type.includes(filterType))

  const getRelativeTime = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    return time.toLocaleDateString()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <div className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <HamburgerMenu />
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-600 rounded-lg">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Activity Feed</h1>
                  <p className="text-sm text-gray-400">Track your progress and engagement</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 bg-transparent px-2 sm:px-3">
                <Download className="w-4 h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Export</span>
              </Button>
              <Button size="sm" className="bg-green-600 hover:bg-green-700 px-2 sm:px-4">
                <BarChart3 className="w-4 h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Analytics</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card
                key={index}
                className="bg-gray-800/50 border-gray-700 backdrop-blur-sm hover:border-gray-600 transition-all duration-300"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">{stat.label}</p>
                      <p className="text-2xl font-bold text-white">{stat.value}</p>
                      <div className="flex items-center gap-1 mt-2">
                        <TrendingUp className="w-4 h-4 text-green-400" />
                        <span className="text-sm text-green-400">{stat.change}</span>
                        <span className="text-sm text-gray-500">this week</span>
                      </div>
                    </div>
                    <div className={`p-3 rounded-lg bg-gray-700/50`}>
                      <Icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Filters */}
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-white flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Activity Types
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { value: "all", label: "All Activities", count: activities.length, icon: Activity },
                  {
                    value: "hackathon",
                    label: "Hackathons",
                    count: activities.filter((a) => a.type.includes("hackathon")).length,
                    icon: Trophy,
                  },
                  {
                    value: "team",
                    label: "Teams",
                    count: activities.filter((a) => a.type.includes("team")).length,
                    icon: Users,
                  },
                  {
                    value: "code",
                    label: "Code",
                    count: activities.filter((a) => a.type.includes("code")).length,
                    icon: Code,
                  },
                  {
                    value: "message",
                    label: "Messages",
                    count: activities.filter((a) => a.type.includes("message")).length,
                    icon: MessageCircle,
                  },
                  {
                    value: "achievement",
                    label: "Achievements",
                    count: activities.filter((a) => a.type.includes("achievement")).length,
                    icon: Award,
                  },
                ].map((filter) => {
                  const Icon = filter.icon
                  return (
                    <button
                      key={filter.value}
                      onClick={() => setFilterType(filter.value)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                        filterType === filter.value
                          ? "bg-green-600 text-white"
                          : "bg-gray-700/50 text-gray-300 hover:bg-gray-700"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        <span>{filter.label}</span>
                      </div>
                      <Badge variant="secondary" className="bg-gray-600 text-white">
                        {filter.count}
                      </Badge>
                    </button>
                  )
                })}
              </CardContent>
            </Card>

            {/* Time Range */}
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-white flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Time Range
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  { value: "today", label: "Today" },
                  { value: "week", label: "This Week" },
                  { value: "month", label: "This Month" },
                  { value: "all", label: "All Time" },
                ].map((range) => (
                  <button
                    key={range.value}
                    onClick={() => setTimeRange(range.value)}
                    className={`w-full text-left p-2 rounded-lg transition-all duration-200 ${
                      timeRange === range.value ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-700/50"
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Activity Summary */}
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-white flex items-center gap-2">
                  <PieChart className="w-4 h-4" />
                  This Week
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Most Active Day</span>
                    <span className="text-white font-medium">Monday</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Streak</span>
                    <span className="text-green-400 font-medium">7 days</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Points Earned</span>
                    <span className="text-yellow-400 font-medium">1,250</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Activity Feed */}
          <div className="lg:col-span-3">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Recent Activity</h2>
                <p className="text-gray-400 mt-1">{filteredActivities.length} activities found</p>
              </div>
            </div>

            <div className="space-y-4">
              {filteredActivities.map((activity, index) => {
                const Icon = activity.icon
                return (
                  <Card
                    key={activity.id}
                    className="bg-gray-800/50 border-gray-700 backdrop-blur-sm hover:border-gray-600 transition-all duration-300 group"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div
                          className={`p-3 rounded-lg ${activity.bgColor} group-hover:scale-110 transition-transform duration-200`}
                        >
                          <Icon className={`w-5 h-5 ${activity.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                                {activity.title}
                              </h3>
                              <p className="text-gray-400 mt-1">{activity.description}</p>
                            </div>
                            <div className="text-sm text-gray-500 whitespace-nowrap ml-4">
                              {getRelativeTime(activity.timestamp)}
                            </div>
                          </div>

                          {/* Activity KECdata */}
                          <div className="mt-4 p-3 bg-gray-700/30 rounded-lg">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                              {activity.type === "hackathon_join" && (
                                <>
                                  <div className="flex items-center gap-2">
                                    <Trophy className="w-4 h-4 text-yellow-400" />
                                    <span className="text-gray-300">Prize: {activity.metadata.prize}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4 text-blue-400" />
                                    <span className="text-gray-300">{activity.metadata.participants} participants</span>
                                  </div>
                                </>
                              )}

                              {activity.type === "team_create" && (
                                <>
                                  <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4 text-blue-400" />
                                    <span className="text-gray-300">{activity.metadata.members} members</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Code className="w-4 h-4 text-green-400" />
                                    <span className="text-gray-300">{activity.metadata.skills?.join(", ")}</span>
                                  </div>
                                </>
                              )}

                              {activity.type === "code_commit" && (
                                <>
                                  <div className="flex items-center gap-2">
                                    <Plus className="w-4 h-4 text-green-400" />
                                    <span className="text-gray-300">+{activity.metadata.additions} lines</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <GitBranch className="w-4 h-4 text-purple-400" />
                                    <span className="text-gray-300">{activity.metadata.commits} commits</span>
                                  </div>
                                </>
                              )}

                              {activity.type === "achievement_unlock" && (
                                <>
                                  <div className="flex items-center gap-2">
                                    <Zap className="w-4 h-4 text-yellow-400" />
                                    <span className="text-gray-300">{activity.metadata.points} points</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Star className="w-4 h-4 text-pink-400" />
                                    <span className="text-gray-300">{activity.metadata.rarity}</span>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-3 mt-4">
                            <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </Button>
                            <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                              <Share2 className="w-4 h-4 mr-2" />
                              Share
                            </Button>
                            {activity.type.includes("hackathon") && (
                              <Button size="sm" variant="ghost" className="text-blue-400 hover:text-blue-300">
                                <Trophy className="w-4 h-4 mr-2" />
                                View Hackathon
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Load More */}
            <div className="mt-8 text-center">
              <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent">
                Load More Activities
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
