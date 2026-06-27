"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Video, Mic, MicOff, VideoOff, Users, MessageSquare, Share2, Settings, X, Copy, CheckCheck } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { useUser } from "@/lib/auth-hooks"
import { meetingRTCService } from "@/lib/meeting-rtc-service"
import { Meeting, MeetingParticipant, User } from "@/lib/types"

export default function HackMeetPage() {
  const { user } = useUser()
  const router = useRouter()
  const { toast } = useToast()
  
  const [isMicOn, setIsMicOn] = useState(true)
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [roomId, setRoomId] = useState("")
  const [isInMeeting, setIsInMeeting] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [meeting, setMeeting] = useState<Meeting | null>(null)
  const [participants, setParticipants] = useState<any[]>([])
  const [chatMessages, setChatMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [showChat, setShowChat] = useState(false)
  const [showParticipants, setShowParticipants] = useState(false)
  
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideosRef = useRef<HTMLDivElement>(null)
  
  // Generate a random room ID when the component mounts
  useEffect(() => {
    const generatedId = Math.random().toString(36).substring(2, 8).toUpperCase()
    setRoomId(generatedId)
    
    // Set up meeting RTC service event handlers
    setupMeetingEventHandlers()
    
    // Clean up when component unmounts
    return () => {
      if (isInMeeting) {
        leaveMeeting()
      }
    }
  }, [])
  
  const setupMeetingEventHandlers = () => {
    // Handle meeting updates
    meetingRTCService.onMeetingUpdated = (updatedMeeting) => {
      setMeeting(updatedMeeting)
      
      // If meeting is completed, leave the meeting
      if (updatedMeeting.status === 'completed') {
        toast({
          title: "Meeting ended",
          description: "The meeting has been ended by the host.",
        })
        setIsInMeeting(false)
      }
    }
    
    // Handle local stream
    meetingRTCService.onLocalStream = (stream) => {
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream
      }
    }
    
    // Handle participant joined
    meetingRTCService.onParticipantJoined = (participant) => {
      setParticipants((prev) => [...prev, participant])
      
      toast({
        title: "Participant joined",
        description: `${participant.participant.user?.name || 'Someone'} joined the meeting.`,
      })
    }
    
    // Handle participant updated
    meetingRTCService.onParticipantUpdated = (participant) => {
      setParticipants((prev) => 
        prev.map((p) => 
          p.participant.id === participant.participant.id ? participant : p
        )
      )
    }
    
    // Handle participant left
    meetingRTCService.onParticipantLeft = (participantId) => {
      setParticipants((prev) => 
        prev.filter((p) => p.participant.id !== participantId)
      )
      
      toast({
        title: "Participant left",
        description: "A participant left the meeting.",
      })
    }
    
    // Handle errors
    meetingRTCService.onError = (error) => {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      })
    }
  }
  
  const toggleMic = () => {
    const newState = meetingRTCService.toggleAudio()
    setIsMicOn(newState)
  }
  
  const toggleVideo = () => {
    const newState = meetingRTCService.toggleVideo()
    setIsVideoOn(newState)
  }
  
  const startMeeting = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to start a meeting.",
        variant: "destructive",
      })
      router.push('/login')
      return
    }
    
    setIsLoading(true)
    
    try {
      const createdMeeting = await meetingRTCService.createMeeting(
        user,
        undefined, // teamId
        undefined, // hackathonId
        `${user.name}'s Meeting`, // title
        "A HackConnect video meeting" // description
      )
      
      if (createdMeeting) {
        setMeeting(createdMeeting)
        setIsInMeeting(true)
        setRoomId(createdMeeting.room_id)
      } else {
        throw new Error("Failed to create meeting")
      }
    } catch (error) {
      console.error("Error starting meeting:", error)
      toast({
        title: "Error",
        description: "Failed to start meeting. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  const joinMeeting = async (id: string) => {
    if (!id) {
      toast({
        title: "Meeting ID required",
        description: "Please enter a valid meeting ID.",
        variant: "destructive",
      })
      return
    }
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to join a meeting.",
        variant: "destructive",
      })
      router.push('/login')
      return
    }
    
    setIsLoading(true)
    
    try {
      const joinedMeeting = await meetingRTCService.joinMeeting(
        id,
        user,
        isMicOn,
        isVideoOn
      )
      
      if (joinedMeeting) {
        setMeeting(joinedMeeting)
        setIsInMeeting(true)
        setRoomId(joinedMeeting.room_id)
      } else {
        throw new Error("Failed to join meeting")
      }
    } catch (error) {
      console.error("Error joining meeting:", error)
      toast({
        title: "Error",
        description: "Failed to join meeting. Please check the meeting ID and try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  const leaveMeeting = async () => {
    try {
      await meetingRTCService.leaveMeeting()
      setIsInMeeting(false)
      setMeeting(null)
      setParticipants([])
      setChatMessages([])
      
      // Generate a new room ID for next meeting
      const generatedId = Math.random().toString(36).substring(2, 8).toUpperCase()
      setRoomId(generatedId)
    } catch (error) {
      console.error("Error leaving meeting:", error)
    }
  }
  
  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId)
    setIsCopied(true)
    
    setTimeout(() => {
      setIsCopied(false)
    }, 2000)
  }
  
  const sendChatMessage = () => {
    if (!newMessage.trim()) return
    
    // In a real implementation, this would send the message to other participants
    const message = {
      id: Date.now().toString(),
      content: newMessage,
      sender: user,
      timestamp: new Date().toISOString()
    }
    
    setChatMessages((prev) => [...prev, message])
    setNewMessage("")
  }
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Hack Meet</h1>
      
      {!isInMeeting ? (
        <div className="max-w-md mx-auto">
          <Tabs defaultValue="create">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="create">Create Meeting</TabsTrigger>
              <TabsTrigger value="join">Join Meeting</TabsTrigger>
            </TabsList>
            
            <TabsContent value="create">
              <Card>
                <CardHeader>
                  <CardTitle>Create a New Meeting</CardTitle>
                  <CardDescription>
                    Start a new video meeting and invite your team members
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-2">Your meeting code:</p>
                    <div className="flex items-center gap-2">
                      <Input value={roomId} readOnly className="font-mono" />
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={copyRoomId}
                      >
                        {isCopied ? <CheckCheck className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center gap-4 my-4">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant={isMicOn ? "outline" : "secondary"}
                            size="icon"
                            onClick={() => setIsMicOn(!isMicOn)}
                            className="rounded-full h-12 w-12"
                          >
                            {isMicOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          {isMicOn ? "Mute microphone" : "Unmute microphone"}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant={isVideoOn ? "outline" : "secondary"}
                            size="icon"
                            onClick={() => setIsVideoOn(!isVideoOn)}
                            className="rounded-full h-12 w-12"
                          >
                            {isVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          {isVideoOn ? "Turn off camera" : "Turn on camera"}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={startMeeting} 
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? "Starting..." : "Start Meeting"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="join">
              <Card>
                <CardHeader>
                  <CardTitle>Join an Existing Meeting</CardTitle>
                  <CardDescription>
                    Enter a meeting code to join your team
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <Input 
                      placeholder="Enter meeting code (e.g., ABC123)" 
                      value={roomId}
                      onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                      className="font-mono"
                    />
                  </div>
                  
                  <div className="flex items-center justify-center gap-4 my-4">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant={isMicOn ? "outline" : "secondary"}
                            size="icon"
                            onClick={() => setIsMicOn(!isMicOn)}
                            className="rounded-full h-12 w-12"
                          >
                            {isMicOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          {isMicOn ? "Mute microphone" : "Unmute microphone"}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant={isVideoOn ? "outline" : "secondary"}
                            size="icon"
                            onClick={() => setIsVideoOn(!isVideoOn)}
                            className="rounded-full h-12 w-12"
                          >
                            {isVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          {isVideoOn ? "Turn off camera" : "Turn on camera"}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={() => joinMeeting(roomId)} 
                    className="w-full"
                    disabled={!roomId || isLoading}
                  >
                    {isLoading ? "Joining..." : "Join Meeting"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <div className="w-full max-w-6xl mb-4">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-sm font-mono">
                  {roomId}
                </Badge>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={copyRoomId}
                  className="h-8 px-2"
                >
                  {isCopied ? <CheckCheck className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <div>
                <Badge variant="outline" className={
                  meeting?.status === 'active' 
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" 
                    : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                }>
                  {meeting?.status === 'active' ? "Active" : "Scheduled"}
                </Badge>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <div className="bg-gray-900 w-full aspect-video rounded-lg overflow-hidden relative">
                  {isVideoOn ? (
                    <video
                      ref={localVideoRef}
                      autoPlay
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-800">
                      <Avatar className="h-24 w-24 mb-4">
                        <AvatarImage src={user?.avatar_url || ""} alt={user?.name || "User"} />
                        <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
                      </Avatar>
                      <p className="text-gray-400">{user?.name || "You"}</p>
                      <p className="text-xs text-gray-500 mt-1">Camera is off</p>
                    </div>
                  )}
                  
                  <div className="absolute bottom-4 left-4 flex items-center gap-2">
                    <Badge variant="secondary" className="bg-black/50 text-white">
                      {isMicOn ? "Mic on" : "Mic off"}
                    </Badge>
                    <Badge variant="secondary" className="bg-black/50 text-white">
                      You (Host)
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div ref={remoteVideosRef} className="grid grid-cols-1 gap-2 max-h-[400px] overflow-y-auto">
                  {participants.length === 0 ? (
                    <div className="bg-gray-800 rounded-lg p-4 text-center">
                      <p className="text-gray-400">No other participants yet</p>
                      <p className="text-xs text-gray-500 mt-1">Share the meeting code to invite others</p>
                    </div>
                  ) : (
                    participants.map((participant) => (
                      <div key={participant.participant.id} className="bg-gray-800 rounded-lg overflow-hidden relative aspect-video">
                        {participant.videoEnabled ? (
                          <video
                            id={`remote-${participant.participant.id}`}
                            autoPlay
                            playsInline
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <Avatar className="h-16 w-16 mb-2">
                              <AvatarImage src={participant.participant.user?.avatar_url || ""} alt={participant.participant.user?.name || "User"} />
                              <AvatarFallback>{participant.participant.user?.name?.charAt(0) || "U"}</AvatarFallback>
                            </Avatar>
                            <p className="text-gray-400 text-sm">{participant.participant.user?.name || "Participant"}</p>
                          </div>
                        )}
                        
                        <div className="absolute bottom-2 left-2 flex items-center gap-1">
                          <Badge variant="secondary" className="bg-black/50 text-white text-xs">
                            {participant.audioEnabled ? "Mic on" : "Mic off"}
                          </Badge>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3 mb-8">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={isMicOn ? "outline" : "secondary"}
                    size="icon"
                    onClick={toggleMic}
                    className="rounded-full h-12 w-12"
                  >
                    {isMicOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {isMicOn ? "Mute microphone" : "Unmute microphone"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={isVideoOn ? "outline" : "secondary"}
                    size="icon"
                    onClick={toggleVideo}
                    className="rounded-full h-12 w-12"
                  >
                    {isVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {isVideoOn ? "Turn off camera" : "Turn on camera"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <Dialog open={showParticipants} onOpenChange={setShowParticipants}>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full h-12 w-12">
                  <Users className="h-5 w-5" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Participants ({participants.length + 1})</DialogTitle>
                </DialogHeader>
                <ScrollArea className="h-[300px] mt-4">
                  <div className="space-y-4">
                    {/* Host (You) */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={user?.avatar_url || ""} alt={user?.name || "You"} />
                          <AvatarFallback>{user?.name?.charAt(0) || "Y"}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user?.name || "You"}</p>
                          <p className="text-xs text-gray-500">You (Host)</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {isMicOn ? <Mic className="h-4 w-4 text-gray-500" /> : <MicOff className="h-4 w-4 text-gray-500" />}
                        {isVideoOn ? <Video className="h-4 w-4 text-gray-500" /> : <VideoOff className="h-4 w-4 text-gray-500" />}
                      </div>
                    </div>
                    
                    {/* Other participants */}
                    {participants.map((participant) => (
                      <div key={participant.participant.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={participant.participant.user?.avatar_url || ""} alt={participant.participant.user?.name || "User"} />
                            <AvatarFallback>{participant.participant.user?.name?.charAt(0) || "U"}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{participant.participant.user?.name || "Participant"}</p>
                            <p className="text-xs text-gray-500">Participant</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {participant.audioEnabled ? <Mic className="h-4 w-4 text-gray-500" /> : <MicOff className="h-4 w-4 text-gray-500" />}
                          {participant.videoEnabled ? <Video className="h-4 w-4 text-gray-500" /> : <VideoOff className="h-4 w-4 text-gray-500" />}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </DialogContent>
            </Dialog>
            
            <Dialog open={showChat} onOpenChange={setShowChat}>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full h-12 w-12">
                  <MessageSquare className="h-5 w-5" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Meeting Chat</DialogTitle>
                </DialogHeader>
                <ScrollArea className="h-[300px] mt-4 mb-4">
                  <div className="space-y-4">
                    {chatMessages.length === 0 ? (
                      <p className="text-center text-gray-500 py-8">No messages yet</p>
                    ) : (
                      chatMessages.map((message) => (
                        <div key={message.id} className="flex gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={message.sender?.avatar_url || ""} alt={message.sender?.name || "User"} />
                            <AvatarFallback>{message.sender?.name?.charAt(0) || "U"}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-sm">{message.sender?.name || "User"}</p>
                              <p className="text-xs text-gray-500">
                                {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                            <p className="text-sm">{message.content}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
                <div className="flex gap-2">
                  <Textarea 
                    placeholder="Type a message..." 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="resize-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        sendChatMessage()
                      }
                    }}
                  />
                  <Button onClick={sendChatMessage} disabled={!newMessage.trim()}>
                    Send
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" className="rounded-full h-12 w-12">
                    <Share2 className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  Share screen (coming soon)
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" className="rounded-full h-12 w-12">
                    <Settings className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  Meeting settings (coming soon)
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="destructive" 
                    size="icon" 
                    onClick={leaveMeeting}
                    className="rounded-full h-12 w-12"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  Leave meeting
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      )}
    </div>
  )
}