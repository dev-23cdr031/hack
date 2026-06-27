"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff, 
  Users, 
  MessageSquare, 
  Share2, 
  Settings, 
  Monitor,
  MoreVertical,
  Volume2,
  Camera,
  Hand,
  Send,
  Copy,
  Star,
  Crown,
  Play,
  Globe,
  Lock,
  Signal,
  CheckCircle,
  Clock,
  Calendar
} from "lucide-react"

// Mock participants data
const mockParticipants = [
  { id: '1', name: 'You', avatar: 'YU', isMuted: false, isVideoOn: true, isHost: true, isPresenting: false },
  { id: '2', name: 'Dev Dharrshan', avatar: 'AJ', isMuted: false, isVideoOn: true, isHost: false, isPresenting: false },
  { id: '3', name: 'Dev Dharrshan', avatar: 'SC', isMuted: true, isVideoOn: true, isHost: false, isPresenting: false },
  { id: '4', name: 'Anusree', avatar: 'MR', isMuted: false, isVideoOn: false, isHost: false, isPresenting: false },
  { id: '5', name: 'Anusree', avatar: 'ED', isMuted: false, isVideoOn: true, isHost: false, isPresenting: false },
  { id: '6', name: 'Bharani', avatar: 'DW', isMuted: true, isVideoOn: true, isHost: false, isPresenting: false }
]

// Mock chat messages
const mockMessages = [
  { id: '1', sender: 'Dev Dharrshan', message: 'Great presentation! 👏', time: '10:30 AM', avatar: 'AJ' },
  { id: '2', sender: 'Dev Dharrshan', message: 'Can you share the slides?', time: '10:32 AM', avatar: 'SC' },
  { id: '3', sender: 'Anusree', message: 'The audio quality is excellent!', time: '10:35 AM', avatar: 'MR' },
  { id: '4', sender: 'Anusree', message: 'I have a question about the timeline', time: '10:37 AM', avatar: 'ED' }
]

export default function HackMeetPage() {
  const [isMicOn, setIsMicOn] = useState(true)
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [showParticipants, setShowParticipants] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [participants, setParticipants] = useState(mockParticipants)
  const [messages, setMessages] = useState(mockMessages)
  const [newMessage, setNewMessage] = useState("")
  const [meetingId] = useState("MEET-" + Math.random().toString(36).substring(2, 8).toUpperCase())
  const [isRecording, setIsRecording] = useState(false)
  const [meetingDuration, setMeetingDuration] = useState(0)
  const [viewMode, setViewMode] = useState('gallery') // gallery, speaker, presentation
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [volume, setVolume] = useState(80)
  const [isHandRaised, setIsHandRaised] = useState(false)
  const [connectionQuality, setConnectionQuality] = useState('excellent')
  const [theme, setTheme] = useState('dark')

  const localVideoRef = useRef<HTMLVideoElement>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)

  // Meeting timer
  useEffect(() => {
    const timer = setInterval(() => {
      setMeetingDuration(prev => prev + 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return hours > 0 
      ? `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
      : `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: Date.now().toString(),
        sender: 'You',
        message: newMessage,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        avatar: 'YU'
      }
      setMessages(prev => [...prev, message])
      setNewMessage("")
    }
  }

  const toggleMic = () => setIsMicOn(!isMicOn)
  const toggleVideo = () => setIsVideoOn(!isVideoOn)
  const toggleScreenShare = () => setIsScreenSharing(!isScreenSharing)
  const toggleRecording = () => setIsRecording(!isRecording)
  const toggleHandRaise = () => setIsHandRaised(!isHandRaised)

  const leaveMeeting = () => {
    if (confirm('Are you sure you want to leave the meeting?')) {
      window.close()
    }
  }

  const copyMeetingId = () => {
    navigator.clipboard.writeText(meetingId)
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'} text-white relative overflow-hidden`}>
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent)] pointer-events-none"></div>
      
      {/* Main Meeting Interface */}
      <div className="relative z-10 flex flex-col h-screen">
        
        {/* Top Bar */}
        <div className="flex justify-between items-center p-4 bg-gray-900/80 backdrop-blur-md border-b border-gray-700/50">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Meeting ID: {meetingId}</span>
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={copyMeetingId}
                className="h-6 w-6 p-0 hover:bg-gray-700"
              >
                <Copy className="w-3 h-3" />
              </Button>
            </div>
            <Badge className="bg-red-500/20 text-red-300 border-red-500/30">
              {isRecording && <div className="w-2 h-2 bg-red-500 rounded-full mr-1 animate-pulse"></div>}
              {formatDuration(meetingDuration)}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge className={`${connectionQuality === 'excellent' ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'}`}>
              <Signal className="w-3 h-3 mr-1" />
              {connectionQuality}
            </Badge>
            <Button 
              size="sm" 
              variant="ghost"
              onClick={() => setShowSettings(!showSettings)}
              className="hover:bg-gray-700"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex">
          
          {/* Video Grid */}
          <div className="flex-1 p-4">
            <div className={`grid gap-4 h-full ${
              viewMode === 'gallery' 
                ? participants.length <= 4 ? 'grid-cols-2 grid-rows-2' : 'grid-cols-3 grid-rows-2'
                : 'grid-cols-1'
            }`}>
              {participants.map((participant, index) => (
                <div 
                  key={participant.id} 
                  className={`relative bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700/50 backdrop-blur-sm group hover:border-blue-500/50 transition-all duration-300 ${
                    viewMode === 'speaker' && index === 0 ? 'col-span-full row-span-full' : ''
                  }`}
                >
                  {/* Video Container */}
                  <div className="relative w-full h-full bg-gradient-to-br from-gray-800 to-gray-900">
                    {participant.isVideoOn ? (
                      <div className="w-full h-full bg-gradient-to-br from-blue-900/30 to-purple-900/30 flex items-center justify-center">
                        <div className="text-6xl font-bold text-white/20">{participant.avatar}</div>
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-800">
                        <Avatar className="w-16 h-16 border-2 border-gray-600">
                          <AvatarFallback className="bg-gray-700 text-white text-lg">
                            {participant.avatar}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    )}
                    
                    {/* Participant Info Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{participant.name}</span>
                          {participant.isHost && <Crown className="w-4 h-4 text-yellow-400" />}
                          {participant.isPresenting && <Monitor className="w-4 h-4 text-blue-400" />}
                        </div>
                        <div className="flex items-center gap-1">
                          {!participant.isMuted ? (
                            <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center">
                              <Mic className="w-3 h-3 text-green-400" />
                            </div>
                          ) : (
                            <div className="w-6 h-6 bg-red-500/20 rounded-full flex items-center justify-center">
                              <MicOff className="w-3 h-3 text-red-400" />
                            </div>
                          )}
                          {!participant.isVideoOn && (
                            <div className="w-6 h-6 bg-red-500/20 rounded-full flex items-center justify-center">
                              <VideoOff className="w-3 h-3 text-red-400" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Speaking Indicator */}
                    {!participant.isMuted && (
                      <div className="absolute top-2 left-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Side Panel */}
          {(showChat || showParticipants) && (
            <div className="w-80 bg-gray-900/90 backdrop-blur-md border-l border-gray-700/50 flex flex-col">
              {/* Panel Header */}
              <div className="flex border-b border-gray-700/50">
                <Button
                  variant={showParticipants ? "default" : "ghost"}
                  onClick={() => { setShowParticipants(true); setShowChat(false) }}
                  className="flex-1 rounded-none border-r border-gray-700/50"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Participants ({participants.length})
                </Button>
                <Button
                  variant={showChat ? "default" : "ghost"}
                  onClick={() => { setShowChat(true); setShowParticipants(false) }}
                  className="flex-1 rounded-none"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Chat ({messages.length})
                </Button>
              </div>

              {/* Participants Panel */}
              {showParticipants && (
                <div className="flex-1 p-4 overflow-y-auto">
                  <div className="space-y-3">
                    {participants.map((participant) => (
                      <div key={participant.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800/50 transition-colors">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-gray-700 text-white text-sm">
                            {participant.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{participant.name}</span>
                            {participant.isHost && <Crown className="w-3 h-3 text-yellow-400" />}
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            {participant.isMuted ? (
                              <MicOff className="w-3 h-3 text-red-400" />
                            ) : (
                              <Mic className="w-3 h-3 text-green-400" />
                            )}
                            {participant.isVideoOn ? (
                              <Video className="w-3 h-3 text-green-400" />
                            ) : (
                              <VideoOff className="w-3 h-3 text-red-400" />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Chat Panel */}
              {showChat && (
                <div className="flex-1 flex flex-col">
                  <div className="flex-1 p-4 overflow-y-auto">
                    <div className="space-y-3">
                      {messages.map((msg) => (
                        <div key={msg.id} className="flex gap-3">
                          <Avatar className="w-6 h-6 mt-1">
                            <AvatarFallback className="bg-gray-700 text-white text-xs">
                              {msg.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-medium text-gray-300">{msg.sender}</span>
                              <span className="text-xs text-gray-500">{msg.time}</span>
                            </div>
                            <p className="text-sm text-gray-200">{msg.message}</p>
                          </div>
                        </div>
                      ))}
                      <div ref={chatEndRef} />
                    </div>
                  </div>
                  
                  {/* Chat Input */}
                  <div className="p-4 border-t border-gray-700/50">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400"
                      />
                      <Button 
                        onClick={handleSendMessage}
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom Control Bar */}
        <div className="bg-gray-900/90 backdrop-blur-md border-t border-gray-700/50 p-4">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            
            {/* Left Controls */}
            <div className="flex items-center gap-2">
              <Button
                onClick={toggleMic}
                className={`w-12 h-12 rounded-full ${isMicOn ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'}`}
              >
                {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              </Button>
              
              <Button
                onClick={toggleVideo}
                className={`w-12 h-12 rounded-full ${isVideoOn ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'}`}
              >
                {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
              </Button>

              <Button
                onClick={toggleScreenShare}
                className={`w-12 h-12 rounded-full ${isScreenSharing ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-700 hover:bg-gray-600'}`}
              >
                <Monitor className="w-5 h-5" />
              </Button>

              <Button
                onClick={toggleHandRaise}
                className={`w-12 h-12 rounded-full ${isHandRaised ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-gray-700 hover:bg-gray-600'}`}
              >
                <Hand className="w-5 h-5" />
              </Button>
            </div>

            {/* Center Controls */}
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setShowParticipants(!showParticipants)}
                variant="ghost"
                className="hover:bg-gray-700"
              >
                <Users className="w-5 h-5 mr-2" />
                {participants.length}
              </Button>

              <Button
                onClick={() => setShowChat(!showChat)}
                variant="ghost"
                className="hover:bg-gray-700"
              >
                <MessageSquare className="w-5 h-5 mr-2" />
                Chat
              </Button>

              <Button
                onClick={toggleRecording}
                className={`${isRecording ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-700 hover:bg-gray-600'}`}
              >
                {isRecording && <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>}
                Record
              </Button>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                className="hover:bg-gray-700"
              >
                <Share2 className="w-5 h-5" />
              </Button>

              <Button
                variant="ghost"
                className="hover:bg-gray-700"
              >
                <MoreVertical className="w-5 h-5" />
              </Button>

              <Button
                onClick={leaveMeeting}
                className="bg-red-600 hover:bg-red-700 px-6"
              >
                <PhoneOff className="w-5 h-5 mr-2" />
                Leave
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
