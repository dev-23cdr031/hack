"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Video, 
  Plus, 
  Search, 
  Calendar,
  Clock,
  Users,
  Monitor,
  Mic,
  Share2,
  Play,
  Star,
  Globe,
  Lock,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Crown,
  Award,
  Target,
  TrendingUp
} from "lucide-react"

// Mock data for meetings
const mockMeetings = [
  {
    id: '1',
    title: 'HackConnect Team Standup',
    description: 'Daily standup meeting to discuss progress and blockers',
    roomId: 'room-standup-001',
    host: { name: 'Dev Dharrshan', avatar: 'AJ' },
    participants: 8,
    maxParticipants: 15,
    status: 'live',
    startTime: '2024-10-05T09:00:00Z',
    duration: 30,
    type: 'standup',
    isRecording: true,
    isPublic: false
  },
  {
    id: '2',
    title: 'Project Demo & Review',
    description: 'Showcase latest project developments and gather feedback',
    roomId: 'room-demo-002',
    host: { name: 'Dev Dharrshan', avatar: 'SC' },
    participants: 12,
    maxParticipants: 25,
    status: 'scheduled',
    startTime: '2024-10-05T14:00:00Z',
    duration: 60,
    type: 'presentation',
    isRecording: false,
    isPublic: true
  },
  {
    id: '3',
    title: 'Hackathon Planning Session',
    description: 'Strategic planning for upcoming hackathon event',
    roomId: 'room-planning-003',
    host: { name: 'Anusree', avatar: 'MR' },
    participants: 6,
    maxParticipants: 10,
    status: 'scheduled',
    startTime: '2024-10-05T16:30:00Z',
    duration: 90,
    type: 'planning',
    isRecording: true,
    isPublic: false
  },
  {
    id: '4',
    title: 'Code Review Workshop',
    description: 'Interactive session on best practices for code review',
    roomId: 'room-workshop-004',
    host: { name: 'Anusree', avatar: 'ED' },
    participants: 0,
    maxParticipants: 20,
    status: 'scheduled',
    startTime: '2024-10-06T10:00:00Z',
    duration: 120,
    type: 'workshop',
    isRecording: true,
    isPublic: true
  }
]

export default function MeetingsPage() {
  const [meetings, setMeetings] = useState(mockMeetings)
  const [filteredMeetings, setFilteredMeetings] = useState(mockMeetings)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  
  useEffect(() => {
    filterMeetings()
  }, [searchQuery, statusFilter])
  
  const filterMeetings = () => {
    let filtered = [...meetings]
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(meeting => 
        meeting.title.toLowerCase().includes(query) ||
        meeting.description.toLowerCase().includes(query) ||
        meeting.host.name.toLowerCase().includes(query)
      )
    }
    
    if (statusFilter !== "all") {
      filtered = filtered.filter(meeting => meeting.status === statusFilter)
    }
    
    setFilteredMeetings(filtered)
  }
  
  const handleJoinMeeting = (roomId: string) => {
    window.open(`/hack-meet?roomId=${roomId}`, '_blank')
  }
  
  const handleCreateMeeting = () => {
    window.open('/hack-meet', '_blank')
  }
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'live':
        return <Badge className="bg-red-500 hover:bg-red-600 text-white animate-pulse">🔴 Live</Badge>
      case 'scheduled':
        return <Badge className="bg-blue-500 hover:bg-blue-600 text-white">📅 Scheduled</Badge>
      case 'ended':
        return <Badge className="bg-gray-500 hover:bg-gray-600 text-white">⏹️ Ended</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }
  
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'standup': return <Target className="w-4 h-4" />
      case 'presentation': return <Monitor className="w-4 h-4" />
      case 'planning': return <Calendar className="w-4 h-4" />
      case 'workshop': return <Award className="w-4 h-4" />
      default: return <Video className="w-4 h-4" />
    }
  }
  
  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }
  
  const formatDate = (timeString: string) => {
    return new Date(timeString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
              Meeting Hub
            </h1>
            <p className="text-gray-400 flex items-center gap-2">
              <Video className="w-4 h-4" />
              Connect, collaborate, and create together
              <Sparkles className="w-4 h-4 text-yellow-400 ml-2" />
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button 
              onClick={handleCreateMeeting}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Plus className="w-4 h-4 mr-2" />
              Start New Meeting
            </Button>
            <Button 
              variant="outline" 
              className="border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Schedule
            </Button>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search meetings, hosts, or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={statusFilter === "all" ? "default" : "outline"}
              onClick={() => setStatusFilter("all")}
              className={statusFilter === "all" ? "bg-blue-600 hover:bg-blue-700" : "border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent"}
            >
              All
            </Button>
            <Button
              variant={statusFilter === "live" ? "default" : "outline"}
              onClick={() => setStatusFilter("live")}
              className={statusFilter === "live" ? "bg-red-600 hover:bg-red-700" : "border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent"}
            >
              Live
            </Button>
            <Button
              variant={statusFilter === "scheduled" ? "default" : "outline"}
              onClick={() => setStatusFilter("scheduled")}
              className={statusFilter === "scheduled" ? "bg-blue-600 hover:bg-blue-700" : "border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent"}
            >
              Scheduled
            </Button>
          </div>
        </div>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search meetings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="w-full md:w-48">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <div className="flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by status" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Meetings</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Tabs defaultValue="all">
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Meetings</TabsTrigger>
          <TabsTrigger value="my">My Meetings</TabsTrigger>
          <TabsTrigger value="team">Team Meetings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mt-2 animate-pulse"></div>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                        <div className="space-y-1">
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse"></div>
                          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
                        </div>
                      </div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : filteredMeetings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMeetings.map((meeting) => (
                <MeetingCard 
                  key={meeting.id} 
                  meeting={meeting} 
                  onJoin={handleJoinMeeting}
                />
              ))}
            </div>
          ) : (
            <Card className="text-center p-8">
              <div className="flex flex-col items-center justify-center">
                <Video className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">No meetings found</h3>
                <p className="text-gray-500 mb-6">
                  {searchQuery || statusFilter !== "all" 
                    ? "Try adjusting your filters or search query" 
                    : "Create your first meeting to get started"}
                </p>
                <Button onClick={handleCreateMeeting}>
                  <Plus className="mr-2 h-4 w-4" />
                  New Meeting
                </Button>
              </div>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="my">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mt-2 animate-pulse"></div>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                        <div className="space-y-1">
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse"></div>
                          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
                        </div>
                      </div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMeetings
                .filter(meeting => meeting.host_id === user?.id)
                .map((meeting) => (
                  <MeetingCard 
                    key={meeting.id} 
                    meeting={meeting} 
                    onJoin={handleJoinMeeting}
                  />
                ))}
              
              {filteredMeetings.filter(meeting => meeting.host_id === user?.id).length === 0 && (
                <Card className="text-center p-8 col-span-full">
                  <div className="flex flex-col items-center justify-center">
                    <Video className="h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium mb-2">No meetings hosted by you</h3>
                    <p className="text-gray-500 mb-6">
                      Create your first meeting to get started
                    </p>
                    <Button onClick={handleCreateMeeting}>
                      <Plus className="mr-2 h-4 w-4" />
                      New Meeting
                    </Button>
                  </div>
                </Card>
              )}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="team">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mt-2 animate-pulse"></div>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                        <div className="space-y-1">
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse"></div>
                          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
                        </div>
                      </div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMeetings
                .filter(meeting => meeting.team_id !== null)
                .map((meeting) => (
                  <MeetingCard 
                    key={meeting.id} 
                    meeting={meeting} 
                    onJoin={handleJoinMeeting}
                  />
                ))}
              
              {filteredMeetings.filter(meeting => meeting.team_id !== null).length === 0 && (
                <Card className="text-center p-8 col-span-full">
                  <div className="flex flex-col items-center justify-center">
                    <Video className="h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium mb-2">No team meetings found</h3>
                    <p className="text-gray-500 mb-6">
                      Create a team meeting to collaborate with your team
                    </p>
                    <Button onClick={handleCreateMeeting}>
                      <Plus className="mr-2 h-4 w-4" />
                      New Team Meeting
                    </Button>
                  </div>
                </Card>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}