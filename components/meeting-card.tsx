"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Video, Users, Calendar, Clock } from "lucide-react"
import { Meeting } from "@/lib/types"
import { formatDistanceToNow } from "date-fns"

interface MeetingCardProps {
  meeting: Meeting
  onJoin?: (meeting: Meeting) => void
}

export function MeetingCard({ meeting, onJoin }: MeetingCardProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  
  const handleJoin = () => {
    setIsLoading(true)
    
    if (onJoin) {
      onJoin(meeting)
    } else {
      router.push(`/hack-meet?roomId=${meeting.room_id}`)
    }
  }
  
  const getStatusColor = (status: Meeting["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "scheduled":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "completed":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return ""
    }
  }
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A"
    
    const date = new Date(dateString)
    return date.toLocaleString()
  }
  
  const getTimeAgo = (dateString?: string) => {
    if (!dateString) return ""
    
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true })
    } catch (error) {
      return ""
    }
  }
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{meeting.title || "Untitled Meeting"}</CardTitle>
          <Badge className={getStatusColor(meeting.status)}>
            {meeting.status.charAt(0).toUpperCase() + meeting.status.slice(1)}
          </Badge>
        </div>
        <CardDescription>
          {meeting.description || "No description provided"}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="flex flex-col space-y-3">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={meeting.host?.avatar_url || ""} alt={meeting.host?.name || "Host"} />
              <AvatarFallback>{meeting.host?.name?.charAt(0) || "H"}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{meeting.host?.name || "Unknown Host"}</p>
              <p className="text-xs text-gray-500">Host</p>
            </div>
          </div>
          
          {meeting.team && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Users className="h-4 w-4" />
              <span>Team: {meeting.team.name}</span>
            </div>
          )}
          
          {meeting.hackathon && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Video className="h-4 w-4" />
              <span>Hackathon: {meeting.hackathon.title}</span>
            </div>
          )}
          
          {meeting.scheduled_start && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="h-4 w-4" />
              <span>Scheduled: {formatDate(meeting.scheduled_start)}</span>
            </div>
          )}
          
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="h-4 w-4" />
            <span>Created {getTimeAgo(meeting.created_at)}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <Badge variant="outline" className="text-xs font-mono">
              {meeting.room_id}
            </Badge>
            <span className="text-xs text-gray-500">Room ID</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        {meeting.status === "active" && (
          <Button 
            className="w-full" 
            onClick={handleJoin}
            disabled={isLoading}
          >
            {isLoading ? "Joining..." : "Join Meeting"}
          </Button>
        )}
        
        {meeting.status === "scheduled" && (
          <Button 
            className="w-full" 
            variant="outline"
            onClick={handleJoin}
            disabled={isLoading}
          >
            {isLoading ? "Starting..." : "Start Meeting"}
          </Button>
        )}
        
        {meeting.status === "completed" && (
          <Button 
            className="w-full" 
            variant="outline"
            disabled
          >
            Meeting Ended
          </Button>
        )}
        
        {meeting.status === "cancelled" && (
          <Button 
            className="w-full" 
            variant="outline"
            disabled
          >
            Meeting Cancelled
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}