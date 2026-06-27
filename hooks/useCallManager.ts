// Call Manager Hook for HackConnect
// Manages call state, incoming calls, and WebRTC connections

import { useState, useEffect, useRef, useCallback } from 'react'
import { WebRTCService, CallOptions } from '@/lib/webrtc-compat'

export interface CallParticipant {
  id: string
  name: string
  avatar_url?: string
}

export interface CallState {
  isOpen: boolean
  callType: 'audio' | 'video'
  participant: CallParticipant | null
  callId: string | null
  isIncoming: boolean
  status: 'ringing' | 'connecting' | 'connected' | 'ended' | 'failed'
}

export interface UseCallManagerReturn {
  callState: CallState
  startCall: (participant: CallParticipant, type: 'audio' | 'video') => Promise<void>
  answerCall: () => Promise<void>
  declineCall: () => Promise<void>
  endCall: () => Promise<void>
  closeCallModal: () => void
}

export function useCallManager(): UseCallManagerReturn {
  const [callState, setCallState] = useState<CallState>({
    isOpen: false,
    callType: 'audio',
    participant: null,
    callId: null,
    isIncoming: false,
    status: 'ringing'
  })

  const webrtcServiceRef = useRef<WebRTCService | null>(null)
  const signalingSocketRef = useRef<WebSocket | null>(null)
  const currentUserRef = useRef<any>(null)

  const handleSignalingMessage = useCallback((message: any) => {
    switch (message.type) {
      case 'incoming-call':
        handleIncomingCall(message)
        break
      case 'call-accepted':
        handleCallAccepted(message)
        break
      case 'call-rejected':
        handleCallRejected(message)
        break
      case 'call-ended':
        handleCallEnded(message)
        break
      case 'call-failed':
        handleCallFailed(message)
        break
      default:
        // Forward other messages to WebRTC service
        if (webrtcServiceRef.current) {
          webrtcServiceRef.current.handleSignalingMessage?.(message)
        } else {
          console.log('Unknown signaling message:', message.type)
        }
    }
  }, [])

  const handleIncomingCall = useCallback((message: any) => {
    const { from, callId, data } = message
    
    // Create participant object
    const participant: CallParticipant = {
      id: from,
      name: data.participant?.name || 'Unknown User',
      avatar_url: data.participant?.avatar_url
    }

    setCallState({
      isOpen: true,
      callType: data.options?.video ? 'video' : 'audio',
      participant,
      callId,
      isIncoming: true,
      status: 'ringing'
    })
  }, [])

  const handleCallAccepted = useCallback((message: any) => {
    setCallState(prev => ({ ...prev, status: 'connecting' }))
    
    // Start WebRTC connection
    if (webrtcServiceRef.current && callState.participant) {
      const options: CallOptions = {
        audio: true,
        video: callState.callType === 'video'
      }
      
      webrtcServiceRef.current.startCall(callState.participant, options)
        .then(callId => {
          console.log('WebRTC call started:', callId)
        })
        .catch(error => {
          console.error('Failed to start WebRTC call:', error)
          setCallState(prev => ({ ...prev, status: 'failed' }))
        })
    }
  }, [callState.participant, callState.callType])

  const handleCallRejected = useCallback((message: any) => {
    setCallState(prev => ({ ...prev, status: 'ended' }))
    setTimeout(() => {
      setCallState(prev => ({ ...prev, isOpen: false }))
    }, 2000)
  }, [])

  const handleCallEnded = useCallback((message: any) => {
    // End WebRTC call
    if (webrtcServiceRef.current) {
      webrtcServiceRef.current.endCall()
    }
    
    setCallState(prev => ({ ...prev, status: 'ended' }))
    setTimeout(() => {
      setCallState(prev => ({ ...prev, isOpen: false }))
    }, 2000)
  }, [])

  const handleCallFailed = useCallback((message: any) => {
    setCallState(prev => ({ ...prev, status: 'failed' }))
    setTimeout(() => {
      setCallState(prev => ({ ...prev, isOpen: false }))
    }, 3000)
  }, [])

  const initializeSignaling = useCallback(() => {
    if (!currentUserRef.current || typeof window === 'undefined') return

    // Disable signaling by default in dev to avoid console errors
    if (process.env.NEXT_PUBLIC_ENABLE_SIGNALING !== 'true') {
      return
    }

    try {
      const wsUrl = process.env.NEXT_PUBLIC_SIGNALING_URL
        || (process.env.NODE_ENV === 'production' ? 'wss://your-signaling-server.com' : 'ws://localhost:3006')

      signalingSocketRef.current = new WebSocket(wsUrl)
      
      signalingSocketRef.current.onopen = () => {
        console.log('Signaling connected')
        // Register with signaling server
        signalingSocketRef.current?.send(JSON.stringify({
          type: 'register',
          userId: currentUserRef.current.id
        }))
      }

      signalingSocketRef.current.onmessage = (event) => {
        const message = JSON.parse(event.data)
        handleSignalingMessage(message)
      }

      signalingSocketRef.current.onerror = (error) => {
        console.error('Signaling error:', error)
      }

      signalingSocketRef.current.onclose = () => {
        console.log('Signaling disconnected')
        // Attempt to reconnect after 5 seconds only if enabled
        if (process.env.NEXT_PUBLIC_ENABLE_SIGNALING !== 'false') {
          setTimeout(() => {
            if (currentUserRef.current) {
              initializeSignaling()
            }
          }, 5000)
        }
      }
    } catch (error) {
      console.error('Failed to initialize signaling:', error)
    }
  }, [handleSignalingMessage])
  
  // Initialize call manager
  useEffect(() => {
    // Skip initialization during SSR
    if (typeof window === 'undefined') {
      return
    }
    
    // Get current user
    try {
      const userData = localStorage.getItem('user')
      if (userData) {
        currentUserRef.current = JSON.parse(userData)
      }
    } catch (error) {
      console.error('Error accessing localStorage:', error)
    }

    // Initialize WebRTC service
    try {
      webrtcServiceRef.current = new WebRTCService()
      
      // Set up event handlers
      if (webrtcServiceRef.current) {
        webrtcServiceRef.current.onLocalStream = (stream) => {
          console.log('Local stream received in hook', stream.id)
          
          // Dispatch custom event for call-modal component
          window.dispatchEvent(new CustomEvent('webrtc-local-stream', { 
            detail: stream 
          }))
        }
        
        webrtcServiceRef.current.onRemoteStream = (stream) => {
          console.log('Remote stream received in hook', stream.id)
          setCallState(prev => ({ ...prev, status: 'connected' }))
          
          // Dispatch custom event for call-modal component
          window.dispatchEvent(new CustomEvent('webrtc-remote-stream', { 
            detail: stream 
          }))
        }
          
          webrtcServiceRef.current.onCallEnd = () => {
            console.log('Call ended by WebRTC service')
            setCallState(prev => ({ ...prev, status: 'ended' }))
            setTimeout(() => {
              setCallState(prev => ({ ...prev, isOpen: false }))
            }, 2000)
            
            // Dispatch custom event for call-modal component
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new CustomEvent('webrtc-call-ended'))
            }
          }
          
          webrtcServiceRef.current.onError = (error) => {
            console.error('WebRTC error:', error)
            setCallState(prev => ({ ...prev, status: 'failed' }))
            
            // Dispatch custom event for call-modal component
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new CustomEvent('webrtc-call-failed', {
                detail: error
              }))
            }
          }
        }
      } catch (error) {
        console.error('Failed to initialize WebRTC service:', error)
      }

    // Initialize signaling
    initializeSignaling()

    return () => {
      // Cleanup
      if (signalingSocketRef.current) {
        signalingSocketRef.current.close()
      }
      
      if (webrtcServiceRef.current) {
        webrtcServiceRef.current.endCall()
      }
    }
  }, [initializeSignaling])

  const startCall = useCallback(async (participant: CallParticipant, type: 'audio' | 'video') => {
    if (!currentUserRef.current) {
      throw new Error('User not logged in')
    }

    try {
      // Create call record in database
      const response = await fetch('/api/calls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caller_id: currentUserRef.current.id,
          receiver_id: participant.id,
          call_type: type,
          status: 'initiated'
        })
      })

      if (!response.ok) {
        // For demo purposes, create a mock call ID if API fails
        const mockCallId = `call_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        
        setCallState({
          isOpen: true,
          callType: type,
          participant,
          callId: mockCallId,
          isIncoming: false,
          status: 'connecting'
        })
        
        // Initialize WebRTC call
        if (webrtcServiceRef.current) {
          const options: CallOptions = {
            audio: true,
            video: type === 'video'
          }
          
          webrtcServiceRef.current.startCall(participant, options)
            .then(callId => {
              console.log('WebRTC call started:', callId)
            })
            .catch(error => {
              console.error('Failed to start WebRTC call:', error)
              setCallState(prev => ({ ...prev, status: 'failed' }))
            })
        }
        
        return
      }

      const callData = await response.json()

      setCallState({
        isOpen: true,
        callType: type,
        participant,
        callId: callData.id,
        isIncoming: false,
        status: 'connecting'
      })
      
      // Initialize WebRTC call
      if (webrtcServiceRef.current) {
        const options: CallOptions = {
          audio: true,
          video: type === 'video'
        }
        
        webrtcServiceRef.current.startCall(participant, options)
          .then(callId => {
            console.log('WebRTC call started:', callId)
          })
          .catch(error => {
            console.error('Failed to start WebRTC call:', error)
            setCallState(prev => ({ ...prev, status: 'failed' }))
          })
      }

    } catch (error) {
      console.error('Failed to start call:', error)
      setCallState(prev => ({ ...prev, status: 'failed' }))
      throw error
    }
  }, [])

  const answerCall = useCallback(async () => {
    if (!callState.callId || !callState.participant) {
      throw new Error('Cannot answer call')
    }

    try {
      setCallState(prev => ({ ...prev, status: 'connecting' }))

      // Update call status in database
      await fetch('/api/calls', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          call_id: callState.callId,
          status: 'answered'
        })
      }).catch(error => {
        console.error('Failed to update call status:', error)
        // Continue anyway for demo purposes
      })
      
      // Answer WebRTC call
      if (webrtcServiceRef.current) {
        const options: CallOptions = {
          audio: true,
          video: callState.callType === 'video'
        }
        
        webrtcServiceRef.current.answerCall(callState.callId, options)
          .then(() => {
            console.log('WebRTC call answered')
          })
          .catch(error => {
            console.error('Failed to answer WebRTC call:', error)
            setCallState(prev => ({ ...prev, status: 'failed' }))
          })
      }

    } catch (error) {
      console.error('Failed to answer call:', error)
      setCallState(prev => ({ ...prev, status: 'failed' }))
      throw error
    }
  }, [callState.callId, callState.participant, callState.callType])

  const declineCall = useCallback(async () => {
    if (!callState.callId) {
      return
    }

    try {
      // Update call status in database
      await fetch('/api/calls', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          call_id: callState.callId,
          status: 'declined'
        })
      }).catch(error => {
        console.error('Failed to update call status:', error)
        // Continue anyway for demo purposes
      })
      
      // Reject WebRTC call
      if (webrtcServiceRef.current) {
        webrtcServiceRef.current.rejectCall(callState.callId)
          .catch(error => {
            console.error('Failed to reject WebRTC call:', error)
          })
      }

      setCallState(prev => ({ ...prev, isOpen: false }))
    } catch (error) {
      console.error('Failed to decline call:', error)
      setCallState(prev => ({ ...prev, isOpen: false }))
    }
  }, [callState.callId])

  const endCall = useCallback(async () => {
    try {
      // Update call status in database
      if (callState.callId) {
        await fetch('/api/calls', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            call_id: callState.callId,
            status: 'ended',
            ended_at: new Date().toISOString()
          })
        }).catch(error => {
          console.error('Failed to update call status:', error)
          // Continue anyway for demo purposes
        })
      }
      
      // End WebRTC call
      if (webrtcServiceRef.current) {
        webrtcServiceRef.current.endCall()
          .catch(error => {
            console.error('Failed to end WebRTC call:', error)
          })
      }

      setCallState(prev => ({ ...prev, status: 'ended' }))
      setTimeout(() => {
        setCallState(prev => ({ ...prev, isOpen: false }))
      }, 2000)
    } catch (error) {
      console.error('Failed to end call:', error)
      setCallState(prev => ({ ...prev, isOpen: false }))
    }
  }, [callState.callId])

  const closeCallModal = useCallback(() => {
    // End any active call
    if (callState.status === 'connected' || callState.status === 'connecting') {
      endCall()
    } else {
      setCallState(prev => ({ ...prev, isOpen: false }))
    }
  }, [callState.status, endCall])

  return {
    callState,
    startCall,
    answerCall,
    declineCall,
    endCall,
    closeCallModal
  }
}
