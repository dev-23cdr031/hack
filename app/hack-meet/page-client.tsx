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
import { useUser } from "@/lib/hooks"
import { meetingRTCService } from "@/lib/meeting-rtc-service"
import { Meeting, MeetingParticipant, User } from "@/lib/types"

export default function HackMeetPageClient() {
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
                    disabled={isLoading}
                  >
                    {isLoading ? "Joining..." : "Join Meeting"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      ) : (
        <div>
          {/* Meeting in progress UI */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-3">
              <div className="bg-black rounded-lg overflow-hidden relative aspect-video mb-4">
                {/* Local video */}
                <video 
                  ref={localVideoRef} 
                  autoPlay 
                  muted 
                  playsInline
                  className="w-full h-full object-cover"
                />
                
                {/* Meeting info overlay */}
                <div className="absolute top-4 left-4 bg-black/50 rounded-lg p-2 text-white text-sm">
                  <p className="font-medium">{meeting?.title || "Meeting"}</p>
                  <p className="text-xs opacity-80">Room: {roomId}</p>
                </div>
                
                {/* Controls overlay */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                  <Button 
                    variant={isMicOn ? "outline" : "secondary"}
                    size="icon"
                    onClick={toggleMic}
                    className="bg-black/50 hover:bg-black/70 border-white/20 rounded-full"
                  >
                    {isMicOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                  </Button>
                  
                  <Button 
                    variant={isVideoOn ? "outline" : "secondary"}
                    size="icon"
                    onClick={toggleVideo}
                    className="bg-black/50 hover:bg-black/70 border-white/20 rounded-full"
                  >
                    {isVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                  </Button>
                  
                  <Button 
                    variant="destructive"
                    size="icon"
                    onClick={leaveMeeting}
                    className="rounded-full"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              
              {/* Remote videos */}
              <div 
                ref={remoteVideosRef}
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2"
              >
                {/* Remote videos will be added here dynamically */}
                {participants.length > 0 && (
                  <div className="text-center p-4">
                    <p className="text-sm text-muted-foreground">
                      {participants.length} participant{participants.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <Card className="h-full">
                <CardHeader className="p-4">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">Meeting Controls</CardTitle>
                    <Badge variant="outline">{participants.length} online</Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="flex flex-col gap-4">
                    <Button 
                      variant="outline" 
                      className="justify-start"
                      onClick={() => setShowParticipants(!showParticipants)}
                    >
                      <Users className="mr-2 h-4 w-4" />
                      Participants
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="justify-start"
                      onClick={() => setShowChat(!showChat)}
                    >
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Chat
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="justify-start"
                      onClick={copyRoomId}
                    >
                      <Share2 className="mr-2 h-4 w-4" />
                      Share Invite
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="justify-start"
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Button>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button 
                    variant="destructive" 
                    className="w-full"
                    onClick={leaveMeeting}
                  >
                    Leave Meeting
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
          
          {/* Participants dialog */}
          <Dialog open={showParticipants} onOpenChange={setShowParticipants}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Participants</DialogTitle>
                <DialogDescription>
                  {participants.length} people in this meeting
                </DialogDescription>
              </DialogHeader>
              <ScrollArea className="h-72">
                <div className="space-y-4 p-2">
                  {participants.map((participant) => (
                    <div key={participant.participant.id} className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={participant.participant.user?.avatar_url} />
                        <AvatarFallback>
                          {participant.participant.user?.name?.charAt(0) || '?'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          {participant.participant.user?.name || 'Unknown'}
                          {participant.participant.user_id === meeting?.host_id && (
                            <Badge variant="outline" className="ml-2">Host</Badge>
                          )}
                        </p>
                        <div className="flex gap-2 mt-1">
                          {participant.audioEnabled ? (
                            <Mic className="h-3 w-3 text-green-500" />
                          ) : (
                            <MicOff className="h-3 w-3 text-red-500" />
                          )}
                          {participant.videoEnabled ? (
                            <Video className="h-3 w-3 text-green-500" />
                          ) : (
                            <VideoOff className="h-3 w-3 text-red-500" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </DialogContent>
          </Dialog>
          
          {/* Chat dialog */}
          <Dialog open={showChat} onOpenChange={setShowChat}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Meeting Chat</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col h-96">
                <ScrollArea className="flex-1 pr-4">
                  <div className="space-y-4 p-2">
                    {chatMessages.length === 0 ? (
                      <p className="text-center text-sm text-muted-foreground py-8">
                        No messages yet. Start the conversation!
                      </p>
                    ) : (
                      chatMessages.map((message) => (
                        <div key={message.id} className="flex gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={message.sender?.avatar_url} />
                            <AvatarFallback>
                              {message.sender?.name?.charAt(0) || '?'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-baseline gap-2">
                              <p className="text-sm font-medium">{message.sender?.name || 'Unknown'}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                            <p className="text-sm mt-1">{message.content}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
                <div className="flex gap-2 pt-4">
                  <Textarea 
                    placeholder="Type a message..." 
                    className="flex-1"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        sendChatMessage()
                      }
                    }}
                  />
                  <Button onClick={sendChatMessage}>Send</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  )
}