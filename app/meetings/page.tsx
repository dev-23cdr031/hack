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
  Share2,
  Play,
  Star,
  Globe,
  Lock,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Target,
  Award
} from "lucide-react"

// Mock data for meetings
const mockMeetings = [
  {
    id: '1',
    title: 'HackConnect Team Standup',
    description: 'Daily standup meeting to discuss progress and blockers',
    roomId: 'room-standup-001',
    host: { name: 'Dev Dharrshan', avatar: 'DH' },
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
    title: 'UI/UX Design Review',
    description: 'Review latest design mockups and user interface improvements',
    roomId: 'room-design-002',
    host: { name: 'Divyadharshini', avatar: 'DD' },
    participants: 12,
    maxParticipants: 25,
    status: 'live',
    startTime: '2024-10-05T11:00:00Z',
    duration: 60,
    type: 'presentation',
    isRecording: false,
    isPublic: true
  },
  {
    id: '3',
    title: 'Backend Architecture Discussion',
    description: 'Technical discussion on database optimization and API design',
    roomId: 'room-backend-003',
    host: { name: 'Divakar', avatar: 'DV' },
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
    title: 'Project Demo & Review',
    description: 'Showcase latest project developments and gather feedback',
    roomId: 'room-demo-004',
    host: { name: 'Anusree', avatar: 'AN' },
    participants: 15,
    maxParticipants: 25,
    status: 'scheduled',
    startTime: '2024-10-05T14:00:00Z',
    duration: 60,
    type: 'presentation',
    isRecording: false,
    isPublic: true
  },
  {
    id: '5',
    title: 'Team Collaboration Session',
    description: 'Cross-functional team meeting with Dev Dharrshan, Divyadharshini, and Divakar',
    roomId: 'room-collab-005',
    host: { name: 'Dev Dharrshan', avatar: 'DH' },
    participants: 9,
    maxParticipants: 12,
    status: 'scheduled',
    startTime: '2024-10-05T15:00:00Z',
    duration: 45,
    type: 'standup',
    isRecording: true,
    isPublic: false
  },
  {
    id: '6',
    title: 'Code Review Workshop',
    description: 'Interactive session on best practices for code review led by Divakar',
    roomId: 'room-workshop-006',
    host: { name: 'Divakar', avatar: 'DV' },
    participants: 7,
    maxParticipants: 20,
    status: 'scheduled',
    startTime: '2024-10-06T10:00:00Z',
    duration: 120,
    type: 'workshop',
    isRecording: true,
    isPublic: true
  },
  {
    id: '7',
    title: 'Design System Planning',
    description: 'Planning session for new design system components and guidelines',
    roomId: 'room-design-sys-007',
    host: { name: 'Divyadharshini', avatar: 'DD' },
    participants: 4,
    maxParticipants: 8,
    status: 'scheduled',
    startTime: '2024-10-06T14:00:00Z',
    duration: 75,
    type: 'planning',
    isRecording: false,
    isPublic: false
  },
  {
    id: '8',
    title: 'Quality Assurance Review',
    description: 'Testing strategies and bug review session with the QA team',
    roomId: 'room-qa-008',
    host: { name: 'Anusree', avatar: 'AN' },
    participants: 6,
    maxParticipants: 12,
    status: 'live',
    startTime: '2024-10-05T11:30:00Z',
    duration: 60,
    type: 'workshop',
    isRecording: true,
    isPublic: true
  },
  {
    id: '9',
    title: 'Project Management Sync',
    description: 'Sprint planning and project timeline discussion',
    roomId: 'room-pm-009',
    host: { name: 'Hemapriya', avatar: 'HP' },
    participants: 10,
    maxParticipants: 15,
    status: 'live',
    startTime: '2024-10-05T10:45:00Z',
    duration: 45,
    type: 'standup',
    isRecording: false,
    isPublic: false
  },
  {
    id: '10',
    title: 'DevOps & Deployment Strategy',
    description: 'Infrastructure planning and CI/CD pipeline optimization',
    roomId: 'room-devops-010',
    host: { name: 'Bharani', avatar: 'BH' },
    participants: 5,
    maxParticipants: 10,
    status: 'scheduled',
    startTime: '2024-10-05T17:00:00Z',
    duration: 90,
    type: 'planning',
    isRecording: true,
    isPublic: false
  },
  {
    id: '11',
    title: 'Cross-Team Integration Meeting',
    description: 'Collaborative session with Anusree, Hemapriya, and Bharani',
    roomId: 'room-integration-011',
    host: { name: 'Anusree', avatar: 'AN' },
    participants: 12,
    maxParticipants: 18,
    status: 'scheduled',
    startTime: '2024-10-05T15:30:00Z',
    duration: 75,
    type: 'presentation',
    isRecording: true,
    isPublic: true
  },
  {
    id: '12',
    title: 'Agile Methodology Workshop',
    description: 'Training session on agile practices and scrum methodologies',
    roomId: 'room-agile-012',
    host: { name: 'Hemapriya', avatar: 'HP' },
    participants: 8,
    maxParticipants: 20,
    status: 'scheduled',
    startTime: '2024-10-06T09:00:00Z',
    duration: 120,
    type: 'workshop',
    isRecording: true,
    isPublic: true
  },
  {
    id: '13',
    title: 'Infrastructure Security Review',
    description: 'Security audit and infrastructure hardening discussion',
    roomId: 'room-security-013',
    host: { name: 'Bharani', avatar: 'BH' },
    participants: 4,
    maxParticipants: 8,
    status: 'scheduled',
    startTime: '2024-10-06T16:00:00Z',
    duration: 60,
    type: 'planning',
    isRecording: false,
    isPublic: false
  }
]

export default function MeetingsPage() {
  const [meetings, setMeetings] = useState(mockMeetings)
  const [filteredMeetings, setFilteredMeetings] = useState(mockMeetings)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  
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

        {/* Meetings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMeetings.map((meeting) => (
            <Card key={meeting.id} className="bg-gray-800/50 border-gray-700 backdrop-blur-sm hover:bg-gray-800/70 transition-all duration-300 group">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(meeting.type)}
                    <h3 className="font-semibold text-lg text-white group-hover:text-blue-400 transition-colors">
                      {meeting.title}
                    </h3>
                  </div>
                  {getStatusBadge(meeting.status)}
                </div>
                <p className="text-gray-300 text-sm line-clamp-2">{meeting.description}</p>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Host Info */}
                <div className="flex items-center gap-3">
                  <Avatar className="w-8 h-8 border-2 border-blue-500/20">
                    <AvatarFallback className="bg-blue-600 text-white text-sm">
                      {meeting.host.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-white">{meeting.host.name}</p>
                    <p className="text-xs text-gray-400">Host</p>
                  </div>
                </div>

                {/* Meeting Details */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <Clock className="w-4 h-4" />
                    <span>{formatDate(meeting.startTime)} at {formatTime(meeting.startTime)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <Users className="w-4 h-4" />
                    <span>{meeting.participants}/{meeting.maxParticipants} participants</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <Monitor className="w-4 h-4" />
                    <span>{meeting.duration} minutes</span>
                  </div>
                </div>

                {/* Features */}
                <div className="flex items-center gap-2">
                  {meeting.isRecording && (
                    <Badge variant="secondary" className="bg-red-900/30 text-red-300 text-xs">
                      <div className="w-2 h-2 bg-red-500 rounded-full mr-1 animate-pulse"></div>
                      Recording
                    </Badge>
                  )}
                  {meeting.isPublic ? (
                    <Badge variant="secondary" className="bg-green-900/30 text-green-300 text-xs">
                      <Globe className="w-3 h-3 mr-1" />
                      Public
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-gray-700 text-gray-300 text-xs">
                      <Lock className="w-3 h-3 mr-1" />
                      Private
                    </Badge>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  {meeting.status === 'live' ? (
                    <Button 
                      onClick={() => handleJoinMeeting(meeting.roomId)}
                      className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Join Live
                    </Button>
                  ) : (
                    <Button 
                      onClick={() => handleJoinMeeting(meeting.roomId)}
                      variant="outline"
                      className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                    >
                      <Video className="w-4 h-4 mr-2" />
                      Join Meeting
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredMeetings.length === 0 && (
          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm text-center p-12">
            <div className="flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mb-4">
                <Video className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No meetings found</h3>
              <p className="text-gray-400 mb-6 max-w-md">
                {searchQuery || statusFilter !== "all" 
                  ? "Try adjusting your search or filters to find meetings" 
                  : "Start your first meeting to connect with your team"}
              </p>
              <Button 
                onClick={handleCreateMeeting}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Start New Meeting
              </Button>
            </div>
          </Card>
        )}

        {/* Quick Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-900/50 to-blue-800/50 border-blue-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-300 text-sm font-medium">Total Meetings</p>
                  <p className="text-2xl font-bold text-white">{meetings.length}</p>
                </div>
                <Video className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-900/50 to-green-800/50 border-green-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-300 text-sm font-medium">Live Now</p>
                  <p className="text-2xl font-bold text-white">
                    {meetings.filter(m => m.status === 'live').length}
                  </p>
                </div>
                <Play className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-900/50 to-purple-800/50 border-purple-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-300 text-sm font-medium">Scheduled</p>
                  <p className="text-2xl font-bold text-white">
                    {meetings.filter(m => m.status === 'scheduled').length}
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-orange-900/50 to-orange-800/50 border-orange-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-300 text-sm font-medium">Participants</p>
                  <p className="text-2xl font-bold text-white">
                    {meetings.reduce((sum, m) => sum + m.participants, 0)}
                  </p>
                </div>
                <Users className="w-8 h-8 text-orange-400" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
