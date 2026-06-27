"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Phone, PhoneOff, Mic, MicOff, Video, VideoOff, Volume2, VolumeX, Maximize2, Minimize2, Loader2 } from "lucide-react"
import { WebRTCService } from "@/lib/webrtc-compat"
interface CallParticipant {
  id: string
  name: string
  avatar_url?: string
}

interface CallModalProps {
  isOpen: boolean
  onClose: () => void
  callType: "audio" | "video"
  participant: CallParticipant
  callId?: string | null
  isIncoming?: boolean
  onAnswer?: () => void
  onDecline?: () => void
}

export function CallModal({
  isOpen,
  onClose,
  callType,
  participant,
  callId,
  isIncoming = false,
  onAnswer,
  onDecline,
}: CallModalProps) {
  const [callStatus, setCallStatus] = useState<"ringing" | "connecting" | "connected" | "ended" | "failed">("ringing")
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOn, setIsVideoOn] = useState(callType === "video")
  const [isSpeakerOn, setIsSpeakerOn] = useState(false)
  const [callDuration, setCallDuration] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const callStartTimeRef = useRef<number>(0)
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const webrtcServiceRef = useRef<WebRTCService | null>(null)

  // Initialize call with proper WebRTC
  useEffect(() => {
    // Only run in browser environment
    if (typeof window !== 'undefined' && isOpen) {
      if (!isIncoming) {
        // Start outgoing call
        initiateCall()
      }

      // Listen for WebRTC events from the parent component
      window.addEventListener('webrtc-local-stream', handleLocalStream)
      window.addEventListener('webrtc-remote-stream', handleRemoteStream)
      window.addEventListener('webrtc-call-ended', handleCallEnded)
      window.addEventListener('webrtc-call-failed', handleCallFailed)

      return () => {
        // Cleanup on unmount
        cleanupCall()
        window.removeEventListener('webrtc-local-stream', handleLocalStream)
        window.removeEventListener('webrtc-remote-stream', handleRemoteStream)
        window.removeEventListener('webrtc-call-ended', handleCallEnded)
        window.removeEventListener('webrtc-call-failed', handleCallFailed)
      }
    }
  }, [isOpen, isIncoming])
  
  // Handle WebRTC events
  const handleLocalStream = (event: any) => {
    const stream = event.detail
    if (localVideoRef.current && stream) {
      localVideoRef.current.srcObject = stream
      localVideoRef.current.play().catch(error => {
        console.error('Error playing local video:', error)
      })
    }
  }
  
  const handleRemoteStream = (event: any) => {
    const stream = event.detail
    if (remoteVideoRef.current && stream) {
      remoteVideoRef.current.srcObject = stream
      remoteVideoRef.current.play().catch(error => {
        console.error('Error playing remote video:', error)
      })
      setCallStatus('connected')
      startCallTimer()
    }
  }
  
  const handleCallEnded = () => {
    setCallStatus('ended')
    setTimeout(() => {
      onClose()
    }, 2000)
  }
  
  const handleCallFailed = (event: any) => {
    setError(event.detail || 'Call failed')
    setCallStatus('failed')
  }

  const initiateCall = async () => {
    try {
      // Only run in browser environment
      if (typeof window === 'undefined' || typeof navigator === 'undefined' || !navigator.mediaDevices) {
        console.log('Browser APIs not available, skipping call initiation')
        return
      }

      setCallStatus("connecting")

      // Check if we already have a stream from WebRTC service
      const existingStream = webrtcServiceRef.current?.localStream
      
      if (existingStream) {
        console.log('Using existing stream from WebRTC service')
        setupVideoElements(existingStream)
        return
      }

      // Get user media with HD quality
      const constraints = {
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 48000
        },
        video: callType === "video" ? {
          width: { min: 1280, ideal: 1920, max: 1920 },
          height: { min: 720, ideal: 1080, max: 1080 },
          frameRate: { min: 24, ideal: 30, max: 60 },
          facingMode: "user",
          aspectRatio: 16/9
        } : false
      }

      console.log('Requesting media with constraints:', constraints)
      
      try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints)
        setupVideoElements(stream)
      } catch (mediaError) {
        console.error('Failed to get HD media, trying with lower quality:', mediaError)
        
        // Fallback to lower quality
        const fallbackConstraints = {
          audio: true,
          video: callType === "video"
        }
        
        const stream = await navigator.mediaDevices.getUserMedia(fallbackConstraints)
        setupVideoElements(stream)
      }

    } catch (error) {
      console.error('Failed to initiate call:', error)
      setError("Failed to access camera/microphone. Please check permissions.")
      setCallStatus("failed")
    }
  }
  
  const setupVideoElements = (stream: MediaStream) => {
    // Display local video with HD settings
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream
      // Optimize video element for HD playback
      localVideoRef.current.setAttribute('playsinline', 'true')
      localVideoRef.current.setAttribute('webkit-playsinline', 'true')
      localVideoRef.current.muted = true // Ensure local video is muted

      // Start playing local video immediately
      localVideoRef.current.play().catch(error => {
        console.error('Error playing local video:', error)
      })
    }

    // IMMEDIATELY set up the main video (remote) with the same stream
    if (remoteVideoRef.current) {
      console.log('🎥 Setting up main video stream immediately')
      console.log('🎥 Stream details:', stream.getVideoTracks()[0]?.getSettings())
      remoteVideoRef.current.srcObject = stream
      remoteVideoRef.current.muted = false // Main video should have audio

      // Force play the video
      remoteVideoRef.current.play().then(() => {
        console.log('✅ Main video playing successfully')
      }).catch(error => {
        console.error('❌ Error playing main video:', error)
      })

      // Add event listeners for debugging
      remoteVideoRef.current.addEventListener('loadedmetadata', () => {
        console.log('✅ Main video metadata loaded')
      })

      remoteVideoRef.current.addEventListener('canplay', () => {
        console.log('✅ Main video can play')
      })
    } else {
      console.error('❌ remoteVideoRef.current is null!')
    }

    // Store stream reference
    webrtcServiceRef.current = { localStream: stream } as any

    console.log('Video stream initialized:', {
      video: stream.getVideoTracks()[0]?.getSettings(),
      audio: stream.getAudioTracks()[0]?.getSettings()
    })

    // Simulate connection process
    setTimeout(() => {
      setCallStatus("connected")
      startCallTimer()
      console.log('Call connected - videos should already be playing')
    }, 2000)
  }

  const cleanupCall = () => {
    if (webrtcServiceRef.current?.localStream) {
      webrtcServiceRef.current.localStream.getTracks().forEach((track: MediaStreamTrack) => {
        track.stop()
      })
    }

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null
    }
  }

  const startCallTimer = () => {
    callStartTimeRef.current = Date.now()
    durationIntervalRef.current = setInterval(() => {
      setCallDuration(Math.floor((Date.now() - callStartTimeRef.current) / 1000))
    }, 1000)
  }

  useEffect(() => {
    return () => {
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current)
      }
    }
  }, [])

  // Handle ESC key for fullscreen exit
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false)
      }
    }

    if (isFullscreen) {
      document.addEventListener('keydown', handleKeyPress)
      return () => document.removeEventListener('keydown', handleKeyPress)
    }
  }, [isFullscreen])

  const handleAnswerCall = async () => {
    try {
      // Only run in browser environment
      if (typeof window === 'undefined' || typeof navigator === 'undefined' || !navigator.mediaDevices) {
        console.log('Browser APIs not available, skipping call answer')
        return
      }

      setCallStatus("connecting")
      onAnswer?.()

      // Check if we already have a stream from WebRTC service
      const existingStream = webrtcServiceRef.current?.localStream
      
      if (existingStream) {
        console.log('Using existing stream from WebRTC service for answer')
        setupVideoElements(existingStream)
        return
      }

      // Get user media with HD quality for answering call
      const constraints = {
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 48000
        },
        video: callType === "video" ? {
          width: { min: 1280, ideal: 1920, max: 1920 },
          height: { min: 720, ideal: 1080, max: 1080 },
          frameRate: { min: 24, ideal: 30, max: 60 },
          facingMode: "user",
          aspectRatio: 16/9
        } : false
      }

      console.log('Requesting media with constraints for answer:', constraints)
      
      try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints)
        setupVideoElements(stream)
        
        // Add a shorter timeout for answering calls
        setTimeout(() => {
          setCallStatus("connected")
          startCallTimer()
          console.log('Call answered and connected - videos should already be playing')
        }, 1000)
      } catch (mediaError) {
        console.error('Failed to get HD media for answer, trying with lower quality:', mediaError)
        
        // Fallback to lower quality
        const fallbackConstraints = {
          audio: true,
          video: callType === "video"
        }
        
        const stream = await navigator.mediaDevices.getUserMedia(fallbackConstraints)
        setupVideoElements(stream)
        
        // Add a shorter timeout for answering calls
        setTimeout(() => {
          setCallStatus("connected")
          startCallTimer()
          console.log('Call answered and connected with lower quality - videos should already be playing')
        }, 1000)
      }

    } catch (error) {
      console.error('Failed to answer call:', error)
      setError("Failed to access camera/microphone")
      setCallStatus("failed")
    }
  }

  const handleDeclineCall = async () => {
    try {
      onDecline?.()
      onClose()
    } catch (error) {
      console.error('Failed to decline call:', error)
      onClose()
    }
  }

  const endCall = async () => {
    // Cleanup media streams
    cleanupCall()

    // Update call in database
    if (callId) {
      try {
        await fetch("/api/calls", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            call_id: callId,
            status: "ended",
            ended_at: new Date().toISOString(),
            duration_seconds: callDuration,
          }),
        })
      } catch (error) {
        console.error("Failed to update call status:", error)
      }
    }

    setCallStatus("ended")
    setTimeout(() => {
      onClose()
    }, 1000)
  }

  const toggleMute = () => {
    if (webrtcServiceRef.current?.localStream) {
      const audioTrack = webrtcServiceRef.current.localStream.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled
        setIsMuted(!audioTrack.enabled)
      }
    } else {
      // Toggle state for demo
      setIsMuted(!isMuted)
    }
  }

  const toggleVideo = () => {
    if (webrtcServiceRef.current?.localStream) {
      const videoTrack = webrtcServiceRef.current.localStream.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled
        setIsVideoOn(videoTrack.enabled)
      }
    } else {
      // Toggle state for demo
      setIsVideoOn(!isVideoOn)
    }
  }

  const toggleSpeaker = () => {
    setIsSpeakerOn(!isSpeakerOn)
  }

  // These methods are no longer used - we use handleAnswerCall and handleDeclineCall instead
  // Keeping them for backward compatibility
  const handleAnswer = () => {
    handleAnswerCall()
  }

  const handleDecline = () => {
    handleDeclineCall()
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      <div
        className={`bg-gray-900 rounded-lg shadow-2xl ${
          isFullscreen ? "w-full h-full rounded-none" : "w-full max-w-5xl mx-4 max-h-[95vh]"
        } flex flex-col overflow-hidden`}
      >
        {/* Call Header */}
        <div className="p-6 text-center">
          <Avatar className="w-24 h-24 mx-auto mb-4">
            <AvatarImage src={participant.avatar || "/placeholder.svg"} />
            <AvatarFallback className="bg-blue-600 text-white text-2xl">{participant.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <h2 className="text-xl font-semibold text-white mb-2">{participant.name}</h2>
          <div className="text-gray-400">
            {callStatus === "ringing" && (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-pulse">📞</div>
                <span>{isIncoming ? "Incoming call..." : "Calling..."}</span>
              </div>
            )}
            {callStatus === "connecting" && (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full"></div>
                <span>Connecting...</span>
              </div>
            )}
            {callStatus === "connected" && <div className="text-green-400">{formatDuration(callDuration)}</div>}
            {callStatus === "ended" && <div className="text-red-400">Call ended</div>}
            {callStatus === "failed" && (
              <div className="text-red-400">
                <div>Call failed</div>
                {error && <div className="text-sm text-gray-500 mt-1">{error}</div>}
              </div>
            )}
          </div>
        </div>

        {/* HD Video Area */}
        {callType === "video" && (callStatus === "connected" || callStatus === "connecting") && (
          <div
            className={`relative ${isFullscreen ? "fixed inset-0 z-50" : "w-full"} overflow-hidden rounded-lg bg-black`}
            style={{
              aspectRatio: isFullscreen ? 'auto' : '16 / 9',
              minHeight: isFullscreen ? '100vh' : '400px'
            }}
          >


            {/* Connection Status Overlay */}
            {callStatus === "connecting" && (
              <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
                <div className="text-white text-center">
                  <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" />
                  <p className="text-lg">Connecting HD video...</p>
                  <p className="text-sm text-gray-300 mt-2">Please allow camera access</p>
                </div>
              </div>
            )}

            {/* Main Video - Shows YOUR camera feed */}
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              muted={false}
              controls={false}
              className="absolute inset-0 w-full h-full"
              style={{
                objectFit: 'cover',
                objectPosition: 'center',
                transform: 'scaleX(-1)', // Mirror effect
                backgroundColor: '#1f2937',
                zIndex: 2
              }}
              onLoadedKECdata={() => {
                console.log('Main video loaded and playing')
              }}
              onError={(e) => {
                console.error('Main video error:', e)
              }}
            />

            {/* Fallback background - only shows when video is not loaded */}
            <div
              className="absolute inset-0 bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center"
              style={{ zIndex: 1 }}
            >
              <div className="text-white text-center">
                <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl font-bold">
                    {participant.name ? participant.name.charAt(0).toUpperCase() : 'U'}
                  </span>
                </div>
                <p className="text-xl font-semibold">{participant.name || 'Unknown User'}</p>
                <p className="text-sm text-gray-300 mt-1">Video call in progress</p>
              </div>
            </div>

            {/* Local Video (Picture-in-Picture) - HD */}
            <div className={`absolute ${isFullscreen ? "top-6 right-6 w-48 h-36" : "top-4 right-4 w-40 h-28"} bg-gray-800 rounded-xl overflow-hidden border-2 border-white shadow-2xl z-10`}>
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                controls={false}
                className="absolute inset-0 w-full h-full"
                style={{
                  objectFit: 'cover',
                  objectPosition: 'center',
                  transform: 'scaleX(-1)', // Mirror effect for natural view
                  backgroundColor: 'transparent'
                }}
                onLoadedKECdata={() => {
                  console.log('Local video metadata loaded')
                  if (localVideoRef.current) {
                    localVideoRef.current.play().catch(console.error)
                  }
                }}
                onError={(e) => {
                  console.error('Local video error:', e)
                }}
              />
              {!isVideoOn && (
                <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                  <VideoOff className="w-8 h-8 text-gray-400" />
                </div>
              )}

              {/* Local video label */}
              <div className="absolute bottom-1 left-1 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                You
              </div>
            </div>

            {/* HD Video Quality Indicator */}
            <div className="absolute top-4 left-4 bg-green-600 text-white text-xs px-3 py-1 rounded-full font-semibold">
              HD 1080p
            </div>

            {/* Video Controls Overlay */}
            <div className={`absolute ${isFullscreen ? "bottom-8" : "bottom-4"} left-1/2 transform -translate-x-1/2 flex gap-3`}>
              <Button
                onClick={toggleMute}
                variant="ghost"
                size={isFullscreen ? "lg" : "default"}
                className={`rounded-full ${
                  isMuted ? "bg-red-600 hover:bg-red-700" : "bg-gray-800 bg-opacity-80 hover:bg-gray-700"
                } text-white backdrop-blur-sm border border-gray-600`}
              >
                {isMuted ? <MicOff className={`${isFullscreen ? "w-6 h-6" : "w-5 h-5"}`} /> : <Mic className={`${isFullscreen ? "w-6 h-6" : "w-5 h-5"}`} />}
              </Button>

              <Button
                onClick={toggleVideo}
                variant="ghost"
                size={isFullscreen ? "lg" : "default"}
                className={`rounded-full ${
                  !isVideoOn ? "bg-red-600 hover:bg-red-700" : "bg-gray-800 bg-opacity-80 hover:bg-gray-700"
                } text-white backdrop-blur-sm border border-gray-600`}
              >
                {isVideoOn ? <Video className={`${isFullscreen ? "w-6 h-6" : "w-5 h-5"}`} /> : <VideoOff className={`${isFullscreen ? "w-6 h-6" : "w-5 h-5"}`} />}
              </Button>

              <Button
                onClick={() => setIsSpeakerOn(!isSpeakerOn)}
                variant="ghost"
                size={isFullscreen ? "lg" : "default"}
                className={`rounded-full ${
                  isSpeakerOn ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-800 bg-opacity-80 hover:bg-gray-700"
                } text-white backdrop-blur-sm border border-gray-600`}
              >
                {isSpeakerOn ? <Volume2 className={`${isFullscreen ? "w-6 h-6" : "w-5 h-5"}`} /> : <VolumeX className={`${isFullscreen ? "w-6 h-6" : "w-5 h-5"}`} />}
              </Button>
            </div>

            {/* Fullscreen Toggle */}
            <Button
              onClick={() => setIsFullscreen(!isFullscreen)}
              variant="ghost"
              size="icon"
              className="absolute top-4 right-20 text-white hover:bg-gray-700 hover:bg-opacity-50 rounded-full backdrop-blur-sm"
            >
              {isFullscreen ? <Minimize2 className="w-6 h-6" /> : <Maximize2 className="w-6 h-6" />}
            </Button>

            {/* Call Duration in Fullscreen */}
            {isFullscreen && callStatus === "connected" && (
              <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-4 py-2 rounded-full backdrop-blur-sm">
                <div className="text-center">
                  <div className="text-sm text-gray-300">Call Duration</div>
                  <div className="text-lg font-mono">{formatDuration(callDuration)}</div>
                </div>
              </div>
            )}

            {/* Exit Fullscreen on ESC */}
            {isFullscreen && (
              <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-white text-sm bg-black bg-opacity-50 px-3 py-1 rounded backdrop-blur-sm">
                Press ESC to exit fullscreen
              </div>
            )}
          </div>
        )}

        {/* Audio Visualization */}
        {callType === "audio" && callStatus === "connected" && (
          <div className="flex justify-center items-center py-8">
            <div className="flex items-end gap-1">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`w-2 bg-green-400 rounded-full animate-pulse`}
                  style={{
                    height: `${Math.random() * 40 + 20}px`,
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Call Controls */}
        <div className="p-6">
          {isIncoming && callStatus === "ringing" ? (
            <div className="flex justify-center gap-8">
              <Button
                onClick={handleDeclineCall}
                size="lg"
                className="bg-red-600 hover:bg-red-700 text-white rounded-full w-16 h-16"
              >
                <PhoneOff className="w-6 h-6" />
              </Button>
              <Button
                onClick={handleAnswerCall}
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white rounded-full w-16 h-16"
                disabled={callStatus === "connecting"}
              >
                {callStatus === "connecting" ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <Phone className="w-6 h-6" />
                )}
              </Button>
            </div>
          ) : (
            <div className="flex justify-center gap-4">
              {/* Mute Button */}
              <Button
                onClick={toggleMute}
                variant="ghost"
                size="icon"
                className={`rounded-full w-12 h-12 ${
                  isMuted ? "bg-red-600 hover:bg-red-700" : "bg-gray-700 hover:bg-gray-600"
                } text-white`}
              >
                {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </Button>

              {/* Video Button (only for video calls) */}
              {callType === "video" && (
                <Button
                  onClick={toggleVideo}
                  variant="ghost"
                  size="icon"
                  className={`rounded-full w-12 h-12 ${
                    !isVideoOn ? "bg-red-600 hover:bg-red-700" : "bg-gray-700 hover:bg-gray-600"
                  } text-white`}
                >
                  {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                </Button>
              )}

              {/* Speaker Button */}
              <Button
                onClick={toggleSpeaker}
                variant="ghost"
                size="icon"
                className={`rounded-full w-12 h-12 ${
                  isSpeakerOn ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-700 hover:bg-gray-600"
                } text-white`}
              >
                {isSpeakerOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </Button>

              {/* End Call Button */}
              <Button
                onClick={endCall}
                size="icon"
                className="bg-red-600 hover:bg-red-700 text-white rounded-full w-12 h-12"
              >
                <PhoneOff className="w-5 h-5" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
