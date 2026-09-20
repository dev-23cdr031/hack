"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Search,
  Send,
  MoreVertical,
  Phone,
  Video,
  VideoOff,
  Info,
  Home,
  Users,
  MessageCircle,
  User,
  Plus,
  Mail,
  BellOff,
  Bell,
  Shield,
  Flag,
  Smile,
  Camera,
  FileText,
  ArrowLeft,
  Check,
  CheckCheck,
  Lock,
  Star,
  Archive,
  Settings,
  Crown,
  ShieldCheck,
  Sparkles,
  X,
  Zap,
  Compass,
  Menu,
  Mic,
  MicOff,
  QrCode,
  ScreenShare,
  Zap as Lightning,
  Pin,
  Download,
  Palette,
  MapPin,
  Image,
  Film,
  MoreHorizontal,
  Forward,
  Reply,
  Paperclip,
  Calendar,
  Clock,
  Signal,
  PlayCircle,
  Verified,
} from "lucide-react"
import Link from "next/link"

interface Message {
  id: string
  sender_id: string
  sender_name: string
  sender_avatar?: string
  content: string
  timestamp: string
  type?: string
  reactions?: {
    emoji: string
    count: number
    users: string[]
  }[]
  duration?: number
  edited?: boolean
  delivered?: boolean
  file_size?: number
  file_name?: string
  reply_to?: string
  verified?: boolean
  encrypted?: boolean
}

interface Conversation {
  id: string
  name: string
  type: "direct" | "group" | "team" | "hackathon"
  avatar_url?: string
  last_message?: string
  last_message_time?: string
  unread_count: number
  participants: {
    id: string
    name: string
    avatar_url?: string
    bio?: string
    title?: string
    status: "online" | "offline" | "away"
  }[]
}

interface TypingIndicator {
  user_id: string
  user_name: string
  conversation_id: string
}

interface VoiceRecording {
  isRecording: boolean
  duration: number
}

export default function MessagesPage() {
  // Core state
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [mobileView, setMobileView] = useState<'list' | 'chat'>('list')
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [sendingMessage, setSendingMessage] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // New chat / user directory
  const [showNewChat, setShowNewChat] = useState(false)
  const [userDirectory, setUserDirectory] = useState<any[]>([])
  const [directorySearch, setDirectorySearch] = useState("")
  
  // Essential features
  const [encryptionEnabled, setEncryptionEnabled] = useState(true)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [voiceRecording, setVoiceRecording] = useState<VoiceRecording>({ isRecording: false, duration: 0 })
  const [replyingTo, setReplyingTo] = useState<Message | null>(null)
  const [typingUsers, setTypingUsers] = useState<TypingIndicator[]>([])
  const [smartReplies, setSmartReplies] = useState<string[]>([])
  const [customEmojis] = useState<string[]>(['🚀', '💎', '⚡', '🔥', '💯', '🎯', '🏆', '✨'])
  const [callState, setCallState] = useState<{
    isOpen: boolean
    callType: 'audio' | 'video'
    participant: any
    callId: string
    isIncoming: boolean
    isConnected: boolean
    isConnecting: boolean
    duration: number
    isMuted: boolean
    isVideoOn: boolean
    isRecording: boolean
    isScreenSharing: boolean
    virtualBackground: string
    callQuality: 'excellent' | 'good' | 'poor'
  }>({
    isOpen: false,
    callType: 'audio',
    participant: null,
    callId: '',
    isIncoming: false,
    isConnected: false,
    isConnecting: false,
    duration: 0,
    isMuted: false,
    isVideoOn: true,
    isRecording: false,
    isScreenSharing: false,
    virtualBackground: 'none',
    callQuality: 'excellent'
  })
  const [messageFilter, setMessageFilter] = useState<'all' | 'unread' | 'groups' | 'archived'>('all')
  
  // WebRTC refs
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null)
  const localStreamRef = useRef<MediaStream | null>(null)
  const callTimerRef = useRef<NodeJS.Timeout | null>(null)
  const screenStreamRef = useRef<MediaStream | null>(null)
  const recordingRef = useRef<MediaRecorder | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // If navigated with ?team=<id>, auto-select that team conversation when data loads
  useEffect(() => {
    const teamId = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('team') : null
    if (!teamId || selectedConversation) return

    const match = conversations.find(c => c.id === teamId)
    if (match) {
      setSelectedConversation(match)
      fetchMessages(match.id)
      return
    }

    // If not found in conversations, try to fetch team info and create a temporary conversation
    ;(async () => {
      try {
        const res = await fetch(`/api/teams/${encodeURIComponent(teamId)}`)
        const data = await res.json()
        const tempConv: Conversation = {
          id: teamId,
          name: data?.team?.name || `Team ${teamId}`,
          type: 'team',
          avatar_url: data?.team?.leader?.avatar_url || '',
          last_message: '',
          last_message_time: new Date().toISOString(),
          unread_count: 0,
          participants: (data?.team?.members || []).map((m: any) => ({ id: m.id, name: m.name, avatar_url: m.avatar_url, status: 'online' }))
        }
        setSelectedConversation(tempConv)
        fetchMessages(teamId)
      } catch {
        const tempConv: Conversation = {
          id: teamId,
          name: `Team ${teamId}`,
          type: 'team',
          avatar_url: '',
          last_message: '',
          last_message_time: new Date().toISOString(),
          unread_count: 0,
          participants: []
        }
        setSelectedConversation(tempConv)
        fetchMessages(teamId)
      }
    })()
  }, [conversations, selectedConversation])

  // Real WebRTC calling functions with Supabase signaling
  const initializePeerConnection = () => {
    const configuration = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    }
    
    const peerConnection = new RTCPeerConnection(configuration)
    
    peerConnection.onicecandidate = (event) => {
      if (event.candidate && currentUser && callState.participant) {
        // Send ICE candidate to the other peer via Supabase signaling
        console.log('ICE candidate:', event.candidate)
        // In production, you would save this to your signaling database
        fetch('/api/calls/signal', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'ice-candidate',
            target: callState.participant.id,
            sender: currentUser.id,
            candidate: event.candidate
          })
        }).catch(err => console.error('Error sending ICE candidate:', err))
      }
    }
    
    peerConnection.ontrack = (event) => {
      console.log('Received remote stream:', event.streams[0])
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0]
        console.log('Remote video stream attached successfully')
      }
      // Also handle audio if it's an audio-only call
      if (callState.callType === 'audio' && audioRef.current) {
        audioRef.current.srcObject = event.streams[0]
        audioRef.current.play().catch(err => console.error('Error playing remote audio:', err))
      }
    }
    
    peerConnection.onconnectionstatechange = () => {
      console.log('Connection state:', peerConnection.connectionState)
      if (peerConnection.connectionState === 'connected') {
        setCallState(prev => ({ ...prev, isConnected: true, isConnecting: false }))
        startCallTimer()
        console.log('Call connected successfully!')
      } else if (peerConnection.connectionState === 'disconnected' || peerConnection.connectionState === 'failed') {
        console.log('Call disconnected')
        endCall()
      }
    }
    
    return peerConnection
  }

  const startCall = async (participant: { id: string; name: string; avatar_url?: string }, type: 'audio' | 'video') => {
    try {
      console.log(`🎬 Starting ${type} call with ${participant.name}`)
      
      // Get user media
      console.log("📹 Requesting camera/microphone access...")
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: type === 'video'
      })
      
      console.log("✅ Media access granted:", {
        audioTracks: stream.getAudioTracks().length,
        videoTracks: stream.getVideoTracks().length
      })
      
      localStreamRef.current = stream
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream
        console.log("📺 Local video stream attached")
      }
      
      // Initialize peer connection
      console.log("🔗 Initializing peer connection...")
      const peerConnection = initializePeerConnection()
      peerConnectionRef.current = peerConnection
      
      // Add local stream to peer connection
      stream.getTracks().forEach(track => {
        peerConnection.addTrack(track, stream)
        console.log(`➕ Added ${track.kind} track to peer connection`)
      })
      
      // Update call state
      setCallState({
        isOpen: true,
        callType: type,
        participant,
        callId: `call_${Date.now()}`,
        isIncoming: false,
        isConnected: false,
        isConnecting: true,
        duration: 0,
        isMuted: false,
        isVideoOn: type === 'video',
        isRecording: false,
        isScreenSharing: false,
        virtualBackground: 'none',
        callQuality: 'excellent'
      })
      
      // Create offer
      const offer = await peerConnection.createOffer()
      await peerConnection.setLocalDescription(offer)
      
      // Send offer to the other peer via signaling server
      console.log('Call offer created:', offer)
      
      try {
        await fetch('/api/calls/signal', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'offer',
            target: participant.id,
            sender: currentUser.id,
            sdp: peerConnection.localDescription,
            callType: type,
            participant: {
              id: currentUser.id,
              name: currentUser.name,
              avatar_url: currentUser.avatar_url
            }
          })
        })
        console.log('Offer sent to signaling server')
      } catch (error) {
        console.error('Error sending offer:', error)
        // Fallback to simulated connection for demo purposes if signaling fails
        setTimeout(() => {
          setCallState(prev => ({ 
            ...prev, 
            isConnected: true, 
            isConnecting: false,
            callQuality: 'excellent'
          }))
          startCallTimer()
        }, 3000)
      }
      
    } catch (error) {
      console.error('Error starting call:', error)
      alert('Failed to start call. Please check your camera/microphone permissions.')
    }
  }

  const startCallTimer = () => {
    callTimerRef.current = setInterval(() => {
      setCallState(prev => ({ ...prev, duration: prev.duration + 1 }))
    }, 1000)
  }

  const formatCallDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled
        setCallState(prev => ({ ...prev, isMuted: !audioTrack.enabled }))
      }
    }
  }

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled
        setCallState(prev => ({ ...prev, isVideoOn: videoTrack.enabled }))
      }
    }
  }

  const endCall = () => {
    // Stop call timer
    if (callTimerRef.current) {
      clearInterval(callTimerRef.current)
      callTimerRef.current = null
    }

    // Stop recording if active
    if (recordingRef.current && callState.isRecording) {
      recordingRef.current.stop()
      recordingRef.current = null
    }

    // Stop screen sharing if active
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach(track => track.stop())
      screenStreamRef.current = null
    }

    // Stop local stream
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop())
      localStreamRef.current = null
    }

    // Stop ringtone
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }

    // Close peer connection
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close()
      peerConnectionRef.current = null
    }

    // Reset call state
    setCallState({
      isOpen: false,
      callType: 'audio',
      participant: null,
      callId: '',
      isIncoming: false,
      isConnected: false,
      isConnecting: false,
      duration: 0,
      isMuted: false,
      isVideoOn: true,
      isRecording: false,
      isScreenSharing: false,
      virtualBackground: 'none',
      callQuality: 'excellent'
    })
  }

  const answerCall = async () => {
    try {
      console.log('Answering call')
      
      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: callState.callType === 'video'
      })
      
      localStreamRef.current = stream
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream
      }
      
      // Initialize peer connection
      const peerConnection = initializePeerConnection()
      peerConnectionRef.current = peerConnection
      
      // Add local stream to peer connection
      stream.getTracks().forEach(track => {
        peerConnection.addTrack(track, stream)
      })
      
      setCallState(prev => ({ 
        ...prev, 
        isConnecting: true,
        isIncoming: false 
      }))
      
      // Simulate call connection
      setTimeout(() => {
        setCallState(prev => ({ ...prev, isConnected: true, isConnecting: false }))
        startCallTimer()
      }, 2000)
      
    } catch (error) {
      console.error('Error answering call:', error)
      alert('Failed to answer call. Please check your camera/microphone permissions.')
    }
  }

  const declineCall = () => {
    console.log('Declining call')
    // Stop ringtone
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
    endCall()
  }

  // Screen sharing functionality
  const toggleScreenShare = async () => {
    try {
      if (!callState.isScreenSharing) {
        // Start screen sharing
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true
        })
        
        screenStreamRef.current = screenStream
        
        // Replace video track in peer connection
        if (peerConnectionRef.current && localStreamRef.current) {
          const videoTrack = screenStream.getVideoTracks()[0]
          const sender = peerConnectionRef.current.getSenders().find(s => 
            s.track && s.track.kind === 'video'
          )
          
          if (sender) {
            await sender.replaceTrack(videoTrack)
          }
        }
        
        // Update local video display
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = screenStream
        }
        
        setCallState(prev => ({ ...prev, isScreenSharing: true }))
        
        // Listen for screen share end
        screenStream.getVideoTracks()[0].addEventListener('ended', () => {
          stopScreenShare()
        })
        
      } else {
        stopScreenShare()
      }
    } catch (error) {
      console.error('Error toggling screen share:', error)
      alert('Failed to start screen sharing. Please try again.')
    }
  }

  const stopScreenShare = async () => {
    try {
      // Stop screen stream
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach(track => track.stop())
        screenStreamRef.current = null
      }
      
      // Get camera stream back
      if (callState.callType === 'video') {
        const cameraStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        })
        
        localStreamRef.current = cameraStream
        
        // Replace video track back to camera
        if (peerConnectionRef.current) {
          const videoTrack = cameraStream.getVideoTracks()[0]
          const sender = peerConnectionRef.current.getSenders().find(s => 
            s.track && s.track.kind === 'video'
          )
          
          if (sender) {
            await sender.replaceTrack(videoTrack)
          }
        }
        
        // Update local video display
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = cameraStream
        }
      }
      
      setCallState(prev => ({ ...prev, isScreenSharing: false }))
    } catch (error) {
      console.error('Error stopping screen share:', error)
    }
  }

  // Call recording functionality
  const toggleRecording = () => {
    try {
      if (!callState.isRecording) {
        // Start recording
        if (localStreamRef.current) {
          const mediaRecorder = new MediaRecorder(localStreamRef.current)
          const chunks: BlobPart[] = []
          
          mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
              chunks.push(event.data)
            }
          }
          
          mediaRecorder.onstop = () => {
            const blob = new Blob(chunks, { type: 'video/webm' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `call-recording-${Date.now()}.webm`
            a.click()
            URL.revokeObjectURL(url)
          }
          
          mediaRecorder.start()
          recordingRef.current = mediaRecorder
          setCallState(prev => ({ ...prev, isRecording: true }))
        }
      } else {
        // Stop recording
        if (recordingRef.current) {
          recordingRef.current.stop()
          recordingRef.current = null
          setCallState(prev => ({ ...prev, isRecording: false }))
        }
      }
    } catch (error) {
      console.error('Error toggling recording:', error)
      alert('Failed to toggle recording. Please try again.')
    }
  }

  // Virtual background functionality
  const changeVirtualBackground = (background: string) => {
    setCallState(prev => ({ ...prev, virtualBackground: background }))
    // In a real implementation, this would apply the background using canvas or WebGL
    console.log('Virtual background changed to:', background)
  }

  // Play ringtone for incoming calls
  const playRingtone = () => {
    try {
      // Create audio context for ringtone
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
      
      oscillator.start()
      oscillator.stop(audioContext.currentTime + 0.5)
      
      // Repeat ringtone
      const ringtoneInterval = setInterval(() => {
        if (callState.isIncoming && !callState.isConnected) {
          const newOscillator = audioContext.createOscillator()
          const newGainNode = audioContext.createGain()
          
          newOscillator.connect(newGainNode)
          newGainNode.connect(audioContext.destination)
          
          newOscillator.frequency.setValueAtTime(800, audioContext.currentTime)
          newGainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
          
          newOscillator.start()
          newOscillator.stop(audioContext.currentTime + 0.5)
        } else {
          clearInterval(ringtoneInterval)
        }
      }, 2000)
      
    } catch (error) {
      console.error('Error playing ringtone:', error)
    }
  }

  // Simulate incoming call (for demo)
  const simulateIncomingCall = (participant: any, callType: 'audio' | 'video') => {
    setCallState({
      isOpen: true,
      callType,
      participant,
      callId: `incoming_${Date.now()}`,
      isIncoming: true,
      isConnected: false,
      isConnecting: false,
      duration: 0,
      isMuted: false,
      isVideoOn: callType === 'video',
      isRecording: false,
      isScreenSharing: false,
      virtualBackground: 'none',
      callQuality: 'excellent'
    })
    
    playRingtone()
  }

  // Get current user from localStorage
  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      const user = JSON.parse(userData)
      setCurrentUser(user)
      fetchConversations(user.id)

      // Open a direct conversation with a specific user (e.g. from the public profile page)
      const urlParams = new URLSearchParams(window.location.search)
      const targetUserId = urlParams.get('user')
      if (targetUserId && targetUserId !== user.id) {
        openDirectChat(user.id, targetUserId)
      }

      // Load the user directory so people can start new chats
      ;(async () => {
        try {
          const res = await fetch('/api/users?limit=200')
          const data = await res.json()
          setUserDirectory(Array.isArray(data) ? data : [])
        } catch (err) {
          console.error('Error loading user directory:', err)
        }
      })()
    } else {
      // Redirect to login if not authenticated
      window.location.href = '/auth/login'
    }
  }, [])

  // Auto-refresh conversations every 30 seconds
  useEffect(() => {
    if (!currentUser) return

    const interval = setInterval(() => {
      fetchConversations(currentUser.id)
    }, 30000)

    return () => clearInterval(interval)
  }, [currentUser])

  // Auto-refresh messages every 10 seconds when a conversation is selected
  useEffect(() => {
    if (!selectedConversation) return

    const interval = setInterval(() => {
      fetchMessages(selectedConversation.id)
    }, 10000)

    return () => clearInterval(interval)
  }, [selectedConversation])


  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      // Clean up call timer
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current)
      }
      
      // Stop local stream
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop())
      }
      
      // Close peer connection
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close()
      }
    }
  }, [])

  // Fetch conversations for the current user
  const fetchConversations = async (userId: string) => {
    try {
      const response = await fetch(`/api/conversations?user_id=${userId}`)

      if (!response.ok) {
        setConversations([])
        setError(null)
        setLoading(false)
        return
      }

      const data = await response.json()
      setConversations(Array.isArray(data) ? data : [])
      setError(null)
    } catch (err) {
      console.error('Error fetching conversations:', err)
      setConversations([])
      setError(null)
    } finally {
      setLoading(false)
    }
  }

  // Fetch messages for a specific conversation
  const fetchMessages = async (conversationId: string, userId?: string) => {
    try {
      const activeUserId = userId || currentUser?.id || ''
      const response = await fetch(`/api/messages?conversation_id=${conversationId}${activeUserId ? `&user_id=${activeUserId}` : ''}`)

      if (!response.ok) {
        setMessages([])
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
        }, 100)
        return
      }

      const data = await response.json()

      if (data.length === 0) {
        setMessages([])
      } else {
        // Transform the data to match our Message interface
        const transformedMessages: Message[] = data.map((msg: any) => ({
          id: msg.id,
          sender_id: msg.sender_id,
          sender_name: msg.sender?.name || 'Unknown',
          sender_avatar: msg.sender?.avatar_url || '',
          content: msg.content,
          timestamp: msg.created_at,
          type: msg.message_type || 'text'
        }))

        setMessages(transformedMessages)

        // Mark messages as read
        if (currentUser) {
          markAsRead(conversationId, currentUser.id)
        }
      }

      // Scroll to bottom
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    } catch (err) {
      console.error('Error fetching messages:', err)
      setMessages([])
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    }
  }

  // Send a new message
  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || !currentUser || sendingMessage) {
      return
    }

    setSendingMessage(true)

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversation_id: selectedConversation.id,
          sender_id: currentUser.id,
          content: newMessage.trim(),
          message_type: 'text'
        })
      })

      let newMsg: Message

      if (!response.ok) {
        // Show the error message from the API (e.g., server error)
        const errorData = await response.json().catch(() => null)
        alert(errorData?.error || 'Failed to send message. Please try again.')
        return
      } else {
        const sentMessage = await response.json()
        console.log('Message sent:', sentMessage.id)

        // Add the message to the local state immediately
        newMsg = {
          id: sentMessage.id,
          sender_id: sentMessage.sender_id,
          sender_name: sentMessage.sender?.name || currentUser.name,
          sender_avatar: sentMessage.sender?.avatar_url || currentUser.avatar_url || '',
          content: sentMessage.content,
          timestamp: sentMessage.created_at,
          type: sentMessage.message_type || 'text'
        }
      }

      setMessages(prev => [...prev, newMsg])
      setNewMessage('')

      // Update the conversation's last message
      setConversations(prev => prev.map(conv =>
        conv.id === selectedConversation.id
          ? { ...conv, last_message: newMsg.content, last_message_time: newMsg.timestamp }
          : conv
      ))

      // Scroll to bottom
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 100)

    } catch (err) {
      console.error('Error sending message:', err)
      alert('Failed to send message. Please try again.')
    } finally {
      setSendingMessage(false)
    }
  }

  // Mark messages as read
  const markAsRead = async (conversationId: string, userId: string) => {
    try {
      await fetch('/api/conversations', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversation_id: conversationId,
          user_id: userId
        })
      })
    } catch (err) {
      console.error('Error marking messages as read:', err)
    }
  }

  // Handle conversation selection
  const handleConversationSelect = (conversation: Conversation) => {
    setSelectedConversation(conversation)
    setMobileView('chat')
    fetchMessages(conversation.id)
  }

  // Open (or create) a direct conversation with a specific user
  const openDirectChat = async (currentUserId: string, targetUserId: string) => {
    try {
      const res = await fetch(`/api/users/${targetUserId}`)
      if (!res.ok) return
      const targetUser = await res.json()
      if (!targetUser?.id) return

      const conv: Conversation = {
        id: `direct-${targetUser.id}`,
        name: targetUser.name || 'User',
        type: 'direct',
        avatar_url: targetUser.avatar_url || '',
        last_message: '',
        last_message_time: '',
        unread_count: 0,
        participants: [{
          id: targetUser.id,
          name: targetUser.name || 'User',
          avatar_url: targetUser.avatar_url || '',
          bio: targetUser.bio,
          title: targetUser.title,
          status: 'online'
        }]
      }

      setConversations(prev => prev.some(c => c.id === conv.id) ? prev : [conv, ...prev])
      setSelectedConversation(conv)
      setMobileView('chat')
      fetchMessages(conv.id, currentUserId)
    } catch (err) {
      console.error('Error opening direct chat:', err)
    }
  }

  // Dropdown menu handlers
  const handleSearch = () => {
    console.log('Search in conversation')
    // TODO: Implement search functionality
  }

  const handleViewContact = () => {
    console.log('View contact info')
    // TODO: Implement view contact functionality
  }

  const handleViewMedia = () => {
    console.log('View media')
    // TODO: Implement view media functionality
  }

  const handleMuteNotifications = () => {
    console.log('Mute notifications')
    // TODO: Implement mute notifications functionality
  }

  const handleBlock = () => {
    console.log('Block user/conversation')
    // TODO: Implement block functionality
  }

  const handleReport = () => {
    console.log('Report user/conversation')
    // TODO: Implement report functionality
  }

  // Demo data removed - using real API data only

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = () => {
    sendMessage()
  }

  // Initialize WebRTC when the page loads
  useEffect(() => {
    // Skip during SSR
    if (typeof window === 'undefined') {
      return
    }
    
    console.log('WebRTC initialized in direct connection mode')
  }, [])

  const handleCall = async (callType: "audio" | "video") => {
    // Skip during SSR
    if (typeof window === 'undefined') {
      console.log("Skipping call - SSR environment")
      return
    }
    
    console.log(`🎥 Video call button clicked! Call type: ${callType}`)
    
    if (!selectedConversation) {
      console.log("❌ No conversation selected")
      alert("Please select a conversation first to start a call.")
      return
    }

    if (!currentUser) {
      console.log("❌ No current user")
      alert("Please log in to start a call.")
      return
    }

    try {
      // For team conversations, we'll call the first other participant
      const otherParticipants = selectedConversation.participants.filter(
        p => p.id !== currentUser.id
      )

      console.log(`👥 Found ${otherParticipants.length} other participants:`, otherParticipants)

      if (otherParticipants.length === 0) {
        console.log("❌ No other participants to call")
        alert("No other participants available to call in this conversation.")
        return
      }

      const participant = otherParticipants[0]
      
      console.log(`🚀 Initiating ${callType} call with:`, participant)

      // Show immediate feedback
      if (typeof window !== 'undefined') {
        console.log("✅ Starting call setup...")
      }

      await startCall({
        id: participant.id,
        name: participant.name,
        avatar_url: participant.avatar_url
      }, callType)

      console.log("✅ Call initiated successfully!")

    } catch (error) {
      console.error("❌ Error initiating call:", error)
      if (typeof window !== 'undefined') {
        alert(`Failed to start ${callType} call. Please check your camera/microphone permissions and try again.`)
      }
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    }
  }

  const getConversationIcon = (type: string) => {
    switch (type) {
      case "team":
        return "👥"
      case "hackathon":
        return "🏆"
      default:
        return ""
    }
  }

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.last_message?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p>Loading messages...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 animate-pulse"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]"></div>
      
      {/* Revolutionary Navigation */}
      <nav className="flex justify-between items-center gap-2 p-3 md:px-8 bg-black/20 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50 shadow-2xl">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <Link href="/" className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent truncate">
            HackConnect
          </Link>
        </div>
        
        {/* Status Indicators (hidden on very small screens) */}
        <div className="hidden lg:flex items-center gap-4">
          <div className="flex items-center gap-2 bg-green-500/20 px-3 py-1 rounded-full">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-400">Online</span>
          </div>
          <div className="flex items-center gap-2 bg-blue-500/20 px-3 py-1 rounded-full">
            <ShieldCheck className="w-3 h-3 text-blue-400" />
            <span className="text-xs text-blue-400">Encrypted</span>
          </div>
          <div className="flex items-center gap-2 bg-purple-500/20 px-3 py-1 rounded-full">
            <Zap className="w-3 h-3 text-purple-400" />
            <span className="text-xs text-purple-400">AI Powered</span>
          </div>
        </div>

        {/* Advanced Navigation */}
        <div className="hidden md:flex gap-4">
          <Link href="/" className="text-gray-300 hover:text-blue-400 flex items-center gap-2 transition-all duration-300 hover:scale-110">
            <Home className="w-4 h-4" />
            <span className="hidden xl:block">Home</span>
          </Link>
          <Link href="/hackathons" className="text-gray-300 hover:text-purple-400 flex items-center gap-2 transition-all duration-300 hover:scale-110">
            <Compass className="w-4 h-4" />
            <span className="hidden xl:block">Explore</span>
          </Link>
          <Link href="/teams" className="text-gray-300 hover:text-green-400 flex items-center gap-2 transition-all duration-300 hover:scale-110">
            <Users className="w-4 h-4" />
            <span className="hidden xl:block">Teams</span>
          </Link>
          <Link href="/messages" className="text-blue-400 font-medium flex items-center gap-2 bg-blue-500/20 px-3 py-2 rounded-lg backdrop-blur-sm">
            <MessageCircle className="w-4 h-4" />
            <span className="hidden xl:block">Messages</span>
            <Badge className="bg-red-500 text-white text-xs px-2 py-1 animate-pulse">3</Badge>
          </Link>
          <Link href="/profile" className="text-gray-300 hover:text-pink-400 flex items-center gap-2 transition-all duration-300 hover:scale-110">
            <User className="w-4 h-4" />
            <span className="hidden xl:block">Profile</span>
          </Link>
        </div>

        {/* Mobile nav */}
        <div className="md:hidden flex items-center gap-1">
          <Link href="/" className="text-gray-300 hover:text-blue-400 p-2">
            <Home className="w-5 h-5" />
          </Link>
          <Link href="/messages" aria-label="Messages" className="text-blue-400 bg-blue-500/20 p-2 rounded-lg relative">
            <MessageCircle className="w-5 h-5" />
            <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 min-w-[1rem]">3</Badge>
          </Link>
          <Link href="/profile" className="text-gray-300 hover:text-pink-400 p-2">
            <User className="w-5 h-5" />
          </Link>
        </div>
      </nav>

      <div className="flex h-[calc(100vh-64px)] md:h-[calc(100vh-80px)] relative">
        {/* Revolutionary Conversations Sidebar */}
        <div className={`w-full md:w-80 lg:w-96 bg-black/30 backdrop-blur-xl border-r border-white/10 flex-col shadow-2xl ${mobileView === 'chat' ? 'hidden md:flex' : 'flex'}`}>
          {/* Advanced Search & Controls */}
          <div className="p-6 border-b border-white/10 bg-gradient-to-r from-purple-500/10 to-blue-500/10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-xl bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Messages</h2>
                  <p className="text-xs text-gray-400">✅ Updated - Alex & Maya Removed</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="ghost" className="text-purple-400 hover:bg-purple-500/20 p-2">
                  <Settings className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost" className="text-blue-400 hover:bg-blue-500/20 p-2">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            {/* Smart Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-4 h-4" />
              <Input
                placeholder="Search with AI..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-12 bg-white/5 border-white/20 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 rounded-xl"
              />
              <Button size="sm" variant="ghost" className="absolute right-2 top-1/2 transform -translate-y-1/2 text-purple-400 hover:bg-purple-500/20 p-1">
                <Mic className="w-3 h-3" />
              </Button>
            </div>
            
            {/* Filter Tabs */}
            <div className="flex gap-2 mb-4">
              {['All', 'Unread', 'Groups', 'Archived'].map((filter) => (
                <Button
                  key={filter}
                  size="sm"
                  variant={messageFilter === filter.toLowerCase() ? "default" : "ghost"}
                  className={`text-xs px-3 py-1 rounded-full transition-all duration-300 ${
                    messageFilter === filter.toLowerCase()
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                  onClick={() => setMessageFilter(filter.toLowerCase() as any)}
                >
                  {filter}
                </Button>
              ))}
            </div>
            
            {/* Quick Actions */}
            <div className="flex gap-2">
              <Button size="sm" onClick={() => setShowNewChat(true)} className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl">
                <Lightning className="w-3 h-3 mr-1" />
                New Chat
              </Button>
              <Button size="sm" variant="ghost" className="text-blue-400 hover:bg-blue-500/20 px-3 rounded-xl">
                <QrCode className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Conversations List */}
          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-gray-400">Loading conversations...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <p className="text-red-400 mb-2">{error}</p>
                <button
                  onClick={() => currentUser && fetchConversations(currentUser.id)}
                  className="text-blue-400 hover:text-blue-300"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : filteredConversations.length > 0 ? (
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.map((conversation, index) => (
                <div
                  key={conversation.id}
                  onClick={() => handleConversationSelect(conversation)}
                  className={`group relative p-4 border-b border-white/5 cursor-pointer transition-all duration-300 hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-blue-500/10 hover:scale-[1.02] hover:shadow-lg ${
                    selectedConversation?.id === conversation.id 
                      ? "bg-gradient-to-r from-purple-500/20 to-blue-500/20 border-l-4 border-l-purple-500" 
                      : ""
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Conversation Item */}
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Avatar className="w-14 h-14 ring-2 ring-white/10 group-hover:ring-purple-500/50 transition-all duration-300">
                        <AvatarImage src={conversation.avatar_url || "/placeholder.svg"} />
                        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white font-bold">
                          {conversation.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      
                      {/* Status Indicator */}
                      <div className="absolute -bottom-1 -right-1">
                        {conversation.type !== "direct" ? (
                          <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black text-xs px-1.5 py-0.5 rounded-full font-bold">
                            {getConversationIcon(conversation.type)}
                          </div>
                        ) : (
                          <div className={`w-4 h-4 rounded-full border-2 border-black ${
                            conversation.participants[0]?.status === "online"
                              ? "bg-green-400 animate-pulse"
                              : conversation.participants[0]?.status === "away"
                                ? "bg-yellow-400"
                                : "bg-gray-400"
                          }`} />
                        )}
                      </div>
                      
                      {/* AI Badge */}
                      {conversation.id === "1" && (
                        <div className="absolute -top-1 -left-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs px-1 py-0.5 rounded-full">
                          <Sparkles className="w-2 h-2" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-white truncate group-hover:text-purple-300 transition-colors">
                            {conversation.name}
                          </h3>
                          {encryptionEnabled && (
                            <Lock className="w-3 h-3 text-green-400" />
                          )}
                          {conversation.unread_count > 0 && (
                            <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-2 py-1 animate-pulse">
                              {conversation.unread_count}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          {conversation.last_message_time && (
                            <span className="text-xs text-gray-400 group-hover:text-gray-300">
                              {formatTime(conversation.last_message_time)}
                            </span>
                          )}
                          <CheckCheck className="w-3 h-3 text-blue-400" />
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-2">
                        <p className="text-sm text-gray-400 truncate group-hover:text-gray-300 flex-1">
                          {conversation.last_message}
                        </p>
                        {typingUsers.some(user => user.user_id !== currentUser?.id) && (
                          <div className="flex gap-1">
                            <div className="w-1 h-1 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <div className="w-1 h-1 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <div className="w-1 h-1 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                          </div>
                        )}
                      </div>
                      
                      {/* Participant Status & Features */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          {conversation.participants.slice(0, 4).map((participant, i) => (
                            <div
                              key={participant.id}
                              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                participant.status === "online"
                                  ? "bg-green-400 animate-pulse"
                                  : participant.status === "away"
                                    ? "bg-yellow-400"
                                    : "bg-gray-400"
                              }`}
                              style={{ animationDelay: `${i * 200}ms` }}
                            />
                          ))}
                          {conversation.participants.length > 4 && (
                            <span className="text-xs text-gray-500 ml-1">+{conversation.participants.length - 4}</span>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button size="sm" variant="ghost" className="text-green-400 hover:bg-green-500/20 p-1">
                            <Phone className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="ghost" className="text-blue-400 hover:bg-blue-500/20 p-1">
                            <Video className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="ghost" className="text-purple-400 hover:bg-purple-500/20 p-1">
                            <MoreVertical className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Hover Effects */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-gray-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-300">No conversations yet</h3>
                <p className="text-gray-500 text-sm mb-4">
                  Start messaging when you join teams or connect with other developers
                </p>
                <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Start Chat
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Revolutionary Chat Area */}
        <div className={`flex-col bg-black/20 backdrop-blur-xl relative ${mobileView === 'chat' ? 'flex md:flex' : 'hidden md:flex'} flex-1`}>
          {selectedConversation ? (
            <>
              {/* Advanced Chat Header */}
              <div className="p-4 bg-gradient-to-r from-black/40 to-purple-900/20 backdrop-blur-xl border-b border-white/10 flex items-center justify-between shadow-xl">
                <div className="flex items-center gap-2 sm:gap-4 min-w-0">
                  {/* Back to conversation list (mobile) */}
                  <Button variant="ghost" size="sm" className="md:hidden text-gray-300 p-1 flex-shrink-0" onClick={() => { setMobileView('list'); setSelectedConversation(null) }} aria-label="Back to conversations">
                    <ArrowLeft className="w-5 h-5" />
                  </Button>
                  <div className="relative flex-shrink-0">
                    <Avatar className="w-12 h-12 ring-2 ring-purple-500/50 shadow-lg">
                      <AvatarImage src={selectedConversation.avatar_url || "/placeholder.svg"} />
                      <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white font-bold">
                        {selectedConversation.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-black animate-pulse"></div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-bold text-xl bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent">
                        {selectedConversation.name}
                      </h2>
                      {encryptionEnabled && (
                        <div className="flex items-center gap-1 bg-green-500/20 px-2 py-1 rounded-full">
                          <ShieldCheck className="w-3 h-3 text-green-400" />
                          <span className="text-xs text-green-400">E2E</span>
                        </div>
                      )}
                      <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs px-2 py-1">
                        <Crown className="w-3 h-3 mr-1" />
                        PREMIUM
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      {selectedConversation.type === 'direct' && selectedConversation.participants[0]?.title ? (
                        <>
                          <span className="text-gray-300">{selectedConversation.participants[0].title}</span>
                          {selectedConversation.participants[0]?.bio && (
                            <span className="text-gray-500 italic hidden lg:inline max-w-[220px] truncate">
                              {selectedConversation.participants[0].bio}
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="text-gray-300">
                          {selectedConversation.participants.length} participant{selectedConversation.participants.length !== 1 ? "s" : ""}
                        </span>
                      )}
                      <span className="text-gray-500">•</span>
                      <span className="text-green-400 animate-pulse">Online</span>
                      <span className="text-gray-500">•</span>
                      <span className="text-purple-400">AI Enhanced</span>
                    </div>
                  </div>
                </div>
                
                {/* Advanced Action Buttons */}
                <div className="flex items-center gap-2">
                  {/* View Profile (direct conversations) */}
                  {selectedConversation?.type === 'direct' && selectedConversation.participants[0] && (
                    <Link href={`/public/profile/${selectedConversation.participants[0].id}`}>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-blue-400 hover:text-white hover:bg-blue-600/20 transition-all duration-300 relative group"
                      >
                        <User className="w-4 h-4" />
                        <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">View Profile</span>
                      </Button>
                    </Link>
                  )}

                  {/* Search */}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-purple-400 hover:text-white hover:bg-purple-600/20 transition-all duration-300 relative group"
                    onClick={handleSearch}
                  >
                    <Search className="w-4 h-4" />
                    <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">Smart Search</span>
                  </Button>
                  
                  {/* Audio Call */}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-green-400 hover:text-white hover:bg-green-600/20 transition-all duration-300 relative group"
                    onClick={() => handleCall("audio")}
                  >
                    <Phone className="w-4 h-4" />
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">HD Audio Call</span>
                  </Button>
                  
                  {/* Video Call */}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-blue-400 hover:text-white hover:bg-blue-600/20 transition-all duration-300 relative group"
                    onClick={() => handleCall("video")}
                  >
                    <Video className="w-4 h-4" />
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                    <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">4K Video Call</span>
                  </Button>
                  
                  {/* Screen Share */}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-orange-400 hover:text-white hover:bg-orange-600/20 transition-all duration-300 relative group"
                    onClick={toggleScreenShare}
                  >
                    <ScreenShare className="w-4 h-4" />
                    <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">Screen Share</span>
                  </Button>
                  
                  
                  {/* Demo Incoming Call Button */}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-pink-400 hover:text-white hover:bg-pink-600/20 transition-all duration-300 relative group"
                    onClick={() => {
                      if (selectedConversation?.participants[0]) {
                        simulateIncomingCall(selectedConversation.participants[0], 'video')
                      }
                    }}
                  >
                    <Bell className="w-4 h-4" />
                    <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">Test Incoming Call</span>
                  </Button>
                  
                  {/* Info */}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-gray-400 hover:text-white hover:bg-gray-600/20 transition-all duration-300"
                    onClick={handleViewContact}
                  >
                    <Info className="w-4 h-4" />
                  </Button>
                  
                  {/* Advanced Menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white hover:bg-gray-600/20">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 bg-black/90 backdrop-blur-xl border-white/10 shadow-2xl">
                      <DropdownMenuItem className="text-gray-300 hover:bg-purple-500/20 hover:text-white">
                        <Pin className="w-4 h-4 mr-2" />
                        Pin Conversation
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-gray-300 hover:bg-blue-500/20 hover:text-white">
                        <Archive className="w-4 h-4 mr-2" />
                        Archive Chat
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-gray-300 hover:bg-green-500/20 hover:text-white">
                        <Download className="w-4 h-4 mr-2" />
                        Export Chat
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-white/10" />
                      <DropdownMenuItem className="text-gray-300 hover:bg-yellow-500/20 hover:text-white">
                        <BellOff className="w-4 h-4 mr-2" />
                        Mute Notifications
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-gray-300 hover:bg-pink-500/20 hover:text-white">
                        <Palette className="w-4 h-4 mr-2" />
                        Change Theme
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-white/10" />
                      <DropdownMenuItem className="text-red-400 hover:bg-red-600/20 hover:text-white">
                        <Shield className="w-4 h-4 mr-2" />
                        Block User
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-400 hover:bg-red-600/20 hover:text-white">
                        <Flag className="w-4 h-4 mr-2" />
                        Report
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Revolutionary Messages Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-transparent to-black/10">
                {messages.map((message, index) => {
                  const isCurrentUser = message.sender_id === currentUser?.id || message.sender_id === "current_user"
                  return (
                    <div
                      key={message.id}
                      className={`group flex gap-4 ${isCurrentUser ? "justify-end" : ""} animate-fadeIn`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {!isCurrentUser && (
                        <div className="relative">
                          <Avatar className="w-10 h-10 ring-2 ring-white/10 group-hover:ring-purple-500/50 transition-all duration-300">
                            <AvatarImage src={message.sender_avatar || "/placeholder.svg"} />
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-bold">
                              {message.sender_name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border border-black"></div>
                        </div>
                      )}
                      
                      <div className={`relative max-w-xs lg:max-w-md ${isCurrentUser ? "order-first" : ""}`}>
                        {/* Message Bubble */}
                        <div
                          className={`relative px-4 py-3 rounded-2xl backdrop-blur-sm transition-all duration-300 group-hover:scale-[1.02] ${
                            isCurrentUser 
                              ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25" 
                              : "bg-white/10 text-white border border-white/20 shadow-lg"
                          }`}
                        >
                          {/* Sender Name */}
                          {!isCurrentUser && (
                            <div className="flex items-center gap-2 mb-2">
                              <p className="text-xs font-semibold text-purple-300">{message.sender_name}</p>
                              {message.encrypted && (
                                <Lock className="w-3 h-3 text-green-400" />
                              )}
                              {message.verified && (
                                <Verified className="w-3 h-3 text-blue-400" />
                              )}
                            </div>
                          )}
                          
                          {/* Message Content */}
                          <div className="space-y-2">
                            {/* Reply Reference */}
                            {message.reply_to && (
                              <div className="bg-black/20 p-2 rounded-lg border-l-2 border-purple-400">
                                <p className="text-xs text-gray-300">Replying to message</p>
                              </div>
                            )}
                            
                            {/* Main Content */}
                            <p className="text-sm leading-relaxed">{message.content}</p>
                            
                            {/* File Attachments */}
                            {message.type === "file" && (
                              <div className="bg-black/20 p-3 rounded-lg flex items-center gap-3">
                                <FileText className="w-6 h-6 text-blue-400" />
                                <div>
                                  <p className="text-sm font-medium">{message.file_name}</p>
                                  <p className="text-xs text-gray-400">{message.file_size} bytes</p>
                                </div>
                                <Button size="sm" variant="ghost" className="text-blue-400 hover:bg-blue-500/20">
                                  <Download className="w-4 h-4" />
                                </Button>
                              </div>
                            )}
                            
                            {/* Voice Message */}
                            {message.type === "voice" && (
                              <div className="bg-black/20 p-3 rounded-lg flex items-center gap-3">
                                <Button size="sm" variant="ghost" className="text-green-400 hover:bg-green-500/20">
                                  <PlayCircle className="w-6 h-6" />
                                </Button>
                                <div className="flex-1">
                                  <div className="w-full bg-white/20 h-2 rounded-full">
                                    <div className="bg-green-400 h-2 rounded-full w-1/3"></div>
                                  </div>
                                  <p className="text-xs text-gray-400 mt-1">{message.duration}s</p>
                                </div>
                                <span className="text-xs text-gray-400">1.5x</span>
                              </div>
                            )}
                          </div>
                          
                          {/* Message Footer */}
                          <div className={`flex items-center justify-between mt-2 ${isCurrentUser ? "flex-row-reverse" : ""}`}>
                            <div className="flex items-center gap-1">
                              <span className="text-xs text-gray-300">{formatTime(message.timestamp)}</span>
                              {message.edited && (
                                <span className="text-xs text-gray-400">(edited)</span>
                              )}
                            </div>
                            
                            {isCurrentUser && (
                              <div className="flex items-center gap-1">
                                {message.delivered ? (
                                  <CheckCheck className="w-3 h-3 text-blue-400" />
                                ) : (
                                  <Check className="w-3 h-3 text-gray-400" />
                                )}
                              </div>
                            )}
                          </div>
                          
                          {/* Message Reactions */}
                          {message.reactions && message.reactions.length > 0 && (
                            <div className="flex gap-1 mt-2">
                              {message.reactions.map((reaction, i) => (
                                <div
                                  key={i}
                                  className="bg-black/30 px-2 py-1 rounded-full flex items-center gap-1 text-xs hover:bg-black/50 cursor-pointer transition-colors"
                                >
                                  <span>{reaction.emoji}</span>
                                  <span className="text-gray-300">{reaction.count}</span>
                                </div>
                              ))}
                            </div>
                          )}
                          
                          {/* Message Tail */}
                          <div className={`absolute top-3 ${
                            isCurrentUser 
                              ? "-right-2 border-l-8 border-l-blue-600 border-t-4 border-b-4 border-t-transparent border-b-transparent" 
                              : "-left-2 border-r-8 border-r-white/10 border-t-4 border-b-4 border-t-transparent border-b-transparent"
                          }`}></div>
                        </div>
                        
                        {/* Quick Actions */}
                        <div className={`absolute top-0 ${isCurrentUser ? "left-0" : "right-0"} opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-1 bg-black/50 backdrop-blur-sm rounded-lg p-1 -translate-y-2`}>
                          <Button size="sm" variant="ghost" className="text-gray-300 hover:text-yellow-400 p-1">
                            <Smile className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="ghost" className="text-gray-300 hover:text-blue-400 p-1">
                            <Reply className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="ghost" className="text-gray-300 hover:text-green-400 p-1">
                            <Forward className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="ghost" className="text-gray-300 hover:text-purple-400 p-1">
                            <MoreHorizontal className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      
                      {isCurrentUser && (
                        <div className="relative">
                          <Avatar className="w-10 h-10 ring-2 ring-blue-500/50 shadow-lg">
                            <AvatarImage src={currentUser?.avatar_url || "/placeholder.svg"} />
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-bold">
                              {currentUser?.name?.charAt(0) || "Y"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-400 rounded-full border border-black"></div>
                        </div>
                      )}
                    </div>
                  )
                })}
                
                {/* Typing Indicator */}
                {typingUsers.length > 0 && (
                  <div className="flex gap-4 animate-fadeIn">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-gradient-to-br from-gray-500 to-gray-600 text-white">
                        {typingUsers[0].user_name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-white/10 backdrop-blur-sm px-4 py-3 rounded-2xl border border-white/20">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-300">{typingUsers[0].user_name} is typing</span>
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Revolutionary Message Input */}
              <div className="p-6 bg-gradient-to-r from-black/40 to-purple-900/20 backdrop-blur-xl border-t border-white/10">
                {/* Reply Preview */}
                {replyingTo && (
                  <div className="mb-4 p-3 bg-purple-500/20 rounded-lg border-l-4 border-purple-500 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-purple-300">Replying to {replyingTo.sender_name}</p>
                      <p className="text-sm text-gray-300 truncate">{replyingTo.content}</p>
                    </div>
                    <Button size="sm" variant="ghost" onClick={() => setReplyingTo(null)} className="text-gray-400 hover:text-white">
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
                
                {/* Smart Suggestions */}
                {smartReplies.length > 0 && (
                  <div className="mb-4 flex gap-2 flex-wrap">
                    {smartReplies.slice(0, 3).map((reply, index) => (
                      <Button
                        key={index}
                        size="sm"
                        variant="ghost"
                        className="bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white rounded-full px-3 py-1 text-xs"
                        onClick={() => setNewMessage(reply)}
                      >
                        <Sparkles className="w-3 h-3 mr-1" />
                        {reply}
                      </Button>
                    ))}
                  </div>
                )}
                
                {/* Main Input Area */}
                <div className="relative">
                  <div className="flex items-end gap-3">
                    {/* Attachment Menu */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="ghost" className="text-purple-400 hover:bg-purple-500/20 p-2 rounded-full">
                          <Plus className="w-5 h-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent side="top" className="w-48 bg-black/90 backdrop-blur-xl border-white/10 shadow-2xl">
                        <DropdownMenuItem className="text-gray-300 hover:bg-blue-500/20 hover:text-white">
                          <Camera className="w-4 h-4 mr-2" />
                          Photo/Video
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-gray-300 hover:bg-green-500/20 hover:text-white">
                          <FileText className="w-4 h-4 mr-2" />
                          Document
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-gray-300 hover:bg-purple-500/20 hover:text-white">
                          <MapPin className="w-4 h-4 mr-2" />
                          Location
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-gray-300 hover:bg-yellow-500/20 hover:text-white">
                          <User className="w-4 h-4 mr-2" />
                          Contact
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-gray-300 hover:bg-pink-500/20 hover:text-white">
                          <Film className="w-4 h-4 mr-2" />
                          GIF
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    
                    {/* Message Input */}
                    <div className="flex-1 relative">
                      <Input
                        placeholder="Type a message... (AI-powered)"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
                        className="w-full bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 rounded-2xl px-4 py-3 pr-32 resize-none"
                        style={{ minHeight: '48px' }}
                      />
                      
                      {/* Input Actions */}
                      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                        {/* Emoji Picker */}
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-yellow-400 hover:bg-yellow-500/20 p-1.5 rounded-full"
                          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        >
                          <Smile className="w-4 h-4" />
                        </Button>
                        
                        {/* Voice Message */}
                        <Button
                          size="sm"
                          variant="ghost"
                          className={`p-1.5 rounded-full transition-all duration-300 ${
                            voiceRecording.isRecording 
                              ? 'text-red-400 bg-red-500/20 animate-pulse' 
                              : 'text-green-400 hover:bg-green-500/20'
                          }`}
                          onMouseDown={() => setVoiceRecording({ isRecording: true, duration: 0 })}
                          onMouseUp={() => setVoiceRecording({ isRecording: false, duration: 0 })}
                        >
                          {voiceRecording.isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                        </Button>
                        
                        {/* AI Assistant */}
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-purple-400 hover:bg-purple-500/20 p-1.5 rounded-full"
                        >
                          <Sparkles className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Send Button */}
                    <Button
                      onClick={handleSendMessage}
                      disabled={sendingMessage || !newMessage.trim()}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white disabled:opacity-50 disabled:cursor-not-allowed rounded-full p-3 shadow-lg shadow-blue-500/25 transition-all duration-300 hover:scale-110"
                    >
                      {sendingMessage ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Send className="w-5 h-5" />
                      )}
                    </Button>
                  </div>
                  
                  {/* Voice Recording Indicator */}
                  {voiceRecording.isRecording && (
                    <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-red-500/90 backdrop-blur-sm text-white px-4 py-2 rounded-full flex items-center gap-2 animate-pulse">
                      <div className="w-3 h-3 bg-white rounded-full animate-ping"></div>
                      <span className="text-sm font-medium">Recording... {voiceRecording.duration}s</span>
                    </div>
                  )}
                  
                  {/* Emoji Picker */}
                  {showEmojiPicker && (
                    <div className="absolute bottom-full mb-2 right-0 bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl">
                      <div className="grid grid-cols-8 gap-2 max-w-xs">
                        {customEmojis.map((emoji, index) => (
                          <Button
                            key={index}
                            size="sm"
                            variant="ghost"
                            className="text-2xl hover:bg-white/20 rounded-lg p-2"
                            onClick={() => {
                              setNewMessage(prev => prev + emoji)
                              setShowEmojiPicker(false)
                            }}
                          >
                            {emoji}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Status Bar */}
                <div className="flex items-center justify-between mt-3 text-xs text-gray-400">
                  <div className="flex items-center gap-4">
                    {encryptionEnabled && (
                      <div className="flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-green-400" />
                        <span>End-to-end encrypted</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Zap className="w-3 h-3 text-purple-400" />
                      <span>AI-enhanced</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Signal className="w-3 h-3 text-blue-400" />
                      <span>Connected</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span>Press Enter to send, Shift+Enter for new line</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center max-w-md">
                <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MessageCircle className="w-12 h-12 text-gray-600" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-300">Your Messages Await</h3>
                <p className="text-gray-500 mb-8 leading-relaxed">
                  Connect with your team members, share ideas, and collaborate in real-time. Your conversations will
                  appear here once you start messaging.
                </p>

                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                    <Zap className="w-4 h-4" />
                    <span>Real-time messaging</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                    <Users className="w-4 h-4" />
                    <span>Team group chats</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                    <Bell className="w-4 h-4" />
                    <span>Smart notifications</span>
                  </div>
                </div>

                <div className="mt-8 flex gap-4 justify-center">
                  <Link href="/teams">
                    <Button className="bg-green-600 hover:bg-green-700 text-white">
                      <Users className="w-4 h-4 mr-2" />
                      Join a Team
                    </Button>
                  </Link>
                  <Button variant="outline" onClick={() => setShowNewChat(true)} className="bg-gray-800/50 border-gray-600 text-gray-200 hover:bg-gray-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Start New Chat
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* New Chat Modal */}
      {showNewChat && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setShowNewChat(false)}
        >
          <div
            className="w-full max-w-md bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-green-400" />
                Start New Chat
              </h3>
              <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white" onClick={() => setShowNewChat(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="p-4">
              <div className="relative mb-4">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <Input
                  value={directorySearch}
                  onChange={e => setDirectorySearch(e.target.value)}
                  placeholder="Search users by name or email..."
                  className="bg-gray-800/60 border-gray-700 text-white pl-10"
                />
              </div>
              <div className="max-h-80 overflow-y-auto space-y-2">
                {(() => {
                  const others = (userDirectory || []).filter((u: any) => u.id !== currentUser?.id)
                  const q = directorySearch.trim().toLowerCase()
                  const matching = q
                    ? others.filter((u: any) =>
                        (u.name || '').toLowerCase().includes(q) ||
                        (u.email || '').toLowerCase().includes(q)
                      )
                    : others

                  if (others.length === 0) {
                    return (
                      <p className="text-gray-400 text-center py-8">
                        No other users yet. Invite someone to join HackConnect!
                      </p>
                    )
                  }
                  if (matching.length === 0) {
                    return (
                      <p className="text-gray-400 text-center py-8">No users match your search.</p>
                    )
                  }
                  return matching.map((u: any) => (
                    <button
                      key={u.id}
                      className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-left"
                      onClick={() => {
                        if (currentUser) {
                          openDirectChat(currentUser.id, u.id)
                        }
                        setShowNewChat(false)
                        setDirectorySearch("")
                      }}
                    >
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={u.avatar_url || "/placeholder.svg"} />
                        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white font-bold">
                          {(u.name || 'U').charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="text-white font-medium truncate">{u.name || 'User'}</p>
                        <p className="text-xs text-gray-400 truncate">{u.title || u.email || ''}</p>
                      </div>
                      <MessageCircle className="w-4 h-4 text-green-400 shrink-0" />
                    </button>
                  ))
                })()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Call Modal */}
      {callState.participant && (
        <CallModal
          isOpen={callState.isOpen}
          callType={callState.callType}
          participant={callState.participant}
          callId={callState.callId}
          isIncoming={callState.isIncoming}
          isConnected={callState.isConnected}
          isConnecting={callState.isConnecting}
          duration={callState.duration}
          isMuted={callState.isMuted}
          isVideoOn={callState.isVideoOn}
          isRecording={callState.isRecording}
          isScreenSharing={callState.isScreenSharing}
          virtualBackground={callState.virtualBackground}
          callQuality={callState.callQuality}
          localVideoRef={localVideoRef}
          remoteVideoRef={remoteVideoRef}
          onAnswer={answerCall}
          onDecline={declineCall}
          onToggleMute={toggleMute}
          onToggleVideo={toggleVideo}
          onToggleRecording={toggleRecording}
          onToggleScreenShare={toggleScreenShare}
          onChangeVirtualBackground={changeVirtualBackground}
          onEndCall={endCall}
        />
      )}
    </div>
  )
}

// Real-time CallModal component with WebRTC
function CallModal({
  isOpen,
  callType,
  participant,
  callId,
  isIncoming,
  isConnected,
  isConnecting,
  duration,
  isMuted,
  isVideoOn,
  isRecording,
  isScreenSharing,
  virtualBackground,
  callQuality,
  localVideoRef,
  remoteVideoRef,
  onAnswer,
  onDecline,
  onToggleMute,
  onToggleVideo,
  onToggleRecording,
  onToggleScreenShare,
  onChangeVirtualBackground,
  onEndCall
}: {
  isOpen: boolean
  callType: 'audio' | 'video'
  participant: any
  callId: string
  isIncoming: boolean
  isConnected: boolean
  isConnecting: boolean
  duration: number
  isMuted: boolean
  isVideoOn: boolean
  isRecording: boolean
  isScreenSharing: boolean
  virtualBackground: string
  callQuality: 'excellent' | 'good' | 'poor'
  localVideoRef: React.RefObject<HTMLVideoElement>
  remoteVideoRef: React.RefObject<HTMLVideoElement>
  onAnswer: () => void
  onDecline: () => void
  onToggleMute: () => void
  onToggleVideo: () => void
  onToggleRecording: () => void
  onToggleScreenShare: () => void
  onChangeVirtualBackground: (bg: string) => void
  onEndCall: () => void
}) {
  if (!isOpen) return null

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
      <div className="w-full h-full max-w-4xl max-h-full bg-gray-900 relative">
        
        {/* Enhanced Call Status Header */}
        <div className="absolute top-4 left-4 right-4 z-10">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : isConnecting ? 'bg-yellow-500 animate-pulse' : 'bg-red-500'}`}></div>
              <span className="text-white font-medium">
                {isConnected ? `Call Duration: ${formatDuration(duration)}` : 
                 isConnecting ? 'Connecting...' : 
                 isIncoming ? 'Incoming Call' : 'Calling...'}
              </span>
              {isRecording && (
                <div className="flex items-center gap-1 bg-red-600/20 px-2 py-1 rounded-full">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-red-300 text-xs font-medium">REC</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              {/* Call Quality Indicator */}
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                callQuality === 'excellent' ? 'bg-green-500/20 text-green-300' :
                callQuality === 'good' ? 'bg-yellow-500/20 text-yellow-300' :
                'bg-red-500/20 text-red-300'
              }`}>
                <Signal className="w-3 h-3" />
                <span className="capitalize">{callQuality}</span>
              </div>
              <Badge className="bg-blue-500/20 text-blue-300">
                {isScreenSharing ? 'Screen Sharing' : callType === 'video' ? 'Video Call' : 'Audio Call'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Video Area */}
        {callType === 'video' && (
          <div className="relative w-full h-full">
            {/* Remote Video (Main) */}
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover bg-gray-800"
            />
            
            {/* Local Video (Picture-in-Picture) */}
            <div className="absolute top-20 right-4 w-48 h-36 bg-gray-800 rounded-lg overflow-hidden border-2 border-white/20 shadow-2xl">
              {isVideoOn ? (
                <video
                  ref={localVideoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                  style={{
                    filter: virtualBackground !== 'none' ? 'blur(0px)' : 'none'
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-700">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={participant?.avatar_url} alt="You" />
                    <AvatarFallback>You</AvatarFallback>
                  </Avatar>
                </div>
              )}
              
              {/* Video Status Overlays */}
              <div className="absolute bottom-2 left-2 flex gap-1">
                {!isVideoOn && (
                  <div className="bg-red-600/80 p-1 rounded">
                    <VideoOff className="w-3 h-3 text-white" />
                  </div>
                )}
                {isMuted && (
                  <div className="bg-red-600/80 p-1 rounded">
                    <MicOff className="w-3 h-3 text-white" />
                  </div>
                )}
                {isScreenSharing && (
                  <div className="bg-blue-600/80 p-1 rounded">
                    <ScreenShare className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
            </div>
            
            {/* Virtual Background Selector */}
            {callType === 'video' && isConnected && (
              <div className="absolute top-20 left-4 bg-black/50 backdrop-blur-md rounded-lg p-3">
                <p className="text-white text-xs mb-2 font-medium">Virtual Backgrounds</p>
                <div className="grid grid-cols-3 gap-2">
                  {['none', 'blur', 'office', 'space', 'nature', 'abstract'].map((bg) => (
                    <button
                      key={bg}
                      onClick={() => onChangeVirtualBackground(bg)}
                      className={`w-12 h-8 rounded text-xs capitalize transition-all ${
                        virtualBackground === bg 
                          ? 'ring-2 ring-blue-400 bg-blue-600/50' 
                          : 'bg-gray-600/50 hover:bg-gray-500/50'
                      }`}
                    >
                      {bg === 'none' ? 'Off' : bg}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Participant Info Overlay (when no remote video) */}
            {!isConnected && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/80">
                <Avatar className="w-32 h-32 mb-6">
                  <AvatarImage src={participant?.avatar_url} alt={participant?.name} />
                  <AvatarFallback className="text-2xl">{participant?.name?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
                <h3 className="text-2xl font-semibold text-white mb-2">{participant?.name}</h3>
                <p className="text-gray-300">
                  {isConnecting ? 'Connecting...' : isIncoming ? 'Incoming call' : 'Calling...'}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Audio Call Interface */}
        {callType === 'audio' && (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
            <Avatar className="w-40 h-40 mb-8">
              <AvatarImage src={participant?.avatar_url} alt={participant?.name} />
              <AvatarFallback className="text-3xl">{participant?.name?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
            <h3 className="text-3xl font-semibold text-white mb-4">{participant?.name}</h3>
            <p className="text-xl text-gray-300 mb-8">
              {isConnected ? `Call Duration: ${formatDuration(duration)}` : 
               isConnecting ? 'Connecting...' : 
               isIncoming ? 'Incoming audio call' : 'Calling...'}
            </p>
            
            {/* Audio Visualizer */}
            {isConnected && (
              <div className="flex items-center gap-1 mb-8">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-1 bg-green-500 rounded-full animate-pulse`}
                    style={{
                      height: `${Math.random() * 20 + 10}px`,
                      animationDelay: `${i * 0.1}s`
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Call Controls */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="flex items-center gap-4 bg-black/50 backdrop-blur-md rounded-full px-6 py-4">
            
            {/* Incoming Call Controls */}
            {isIncoming && !isConnected && (
              <>
                <Button
                  onClick={onAnswer}
                  className="w-16 h-16 rounded-full bg-green-600 hover:bg-green-700 transition-all duration-300 hover:scale-110 shadow-lg shadow-green-500/25"
                  title="Answer call"
                >
                  <Phone className="w-7 h-7" />
                </Button>
                <Button
                  onClick={onDecline}
                  className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 transition-all duration-300 hover:scale-110 shadow-lg shadow-red-500/25"
                  title="Decline call"
                >
                  <X className="w-7 h-7" />
                </Button>
              </>
            )}

            {/* Enhanced Active Call Controls */}
            {(isConnected || (!isIncoming && isConnecting)) && (
              <>
                {/* Mute Button */}
                <Button
                  onClick={onToggleMute}
                  className={`w-12 h-12 rounded-full transition-all duration-300 ${isMuted ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-600 hover:bg-gray-700'}`}
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </Button>

                {/* Video Toggle */}
                {callType === 'video' && (
                  <Button
                    onClick={onToggleVideo}
                    className={`w-12 h-12 rounded-full transition-all duration-300 ${!isVideoOn ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-600 hover:bg-gray-700'}`}
                    title={isVideoOn ? 'Turn off camera' : 'Turn on camera'}
                  >
                    {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                  </Button>
                )}

                {/* Screen Share Button */}
                {callType === 'video' && (
                  <Button
                    onClick={onToggleScreenShare}
                    className={`w-12 h-12 rounded-full transition-all duration-300 ${isScreenSharing ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-600 hover:bg-gray-700'}`}
                    title={isScreenSharing ? 'Stop sharing' : 'Share screen'}
                  >
                    <ScreenShare className="w-5 h-5" />
                  </Button>
                )}

                {/* Recording Button */}
                <Button
                  onClick={onToggleRecording}
                  className={`w-12 h-12 rounded-full transition-all duration-300 ${isRecording ? 'bg-red-600 hover:bg-red-700 animate-pulse' : 'bg-gray-600 hover:bg-gray-700'}`}
                  title={isRecording ? 'Stop recording' : 'Start recording'}
                >
                  <div className="relative">
                    <div className={`w-3 h-3 rounded-full ${isRecording ? 'bg-white' : 'bg-red-500'}`}></div>
                    {isRecording && (
                      <div className="absolute inset-0 w-3 h-3 rounded-full bg-white animate-ping"></div>
                    )}
                  </div>
                </Button>

                {/* End Call Button */}
                <Button
                  onClick={onEndCall}
                  className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-700 transition-all duration-300 hover:scale-110"
                  title="End call"
                >
                  <X className="w-6 h-6" />
                </Button>
              </>
            )}

            {/* Outgoing Call Controls */}
            {!isIncoming && !isConnected && !isConnecting && (
              <Button
                onClick={onEndCall}
                className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-700"
              >
                <X className="w-6 h-6" />
              </Button>
            )}
          </div>
        </div>
      </div>

    </div>
  )
}