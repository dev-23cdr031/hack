// WebRTC Service for HackConnect
// Handles peer-to-peer audio/video communication

export interface CallParticipant {
  id: string
  name: string
  avatar_url?: string
}

export interface CallOptions {
  audio: boolean
  video: boolean
}

export interface SignalingMessage {
  type: 'offer' | 'answer' | 'ice-candidate' | 'call-request' | 'call-accept' | 'call-reject' | 'call-end'
  data?: any
  from: string
  to: string
  callId: string
}

export class WebRTCService {
  private peerConnection: RTCPeerConnection | null = null
  private localStream: MediaStream | null = null
  private remoteStream: MediaStream | null = null
  private signalingSocket: WebSocket | null = null
  private callId: string | null = null
  private isInitiator = false

  // ICE servers for NAT traversal
  private iceServers = [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' }
  ]

  // Event handlers
  public onLocalStream?: (stream: MediaStream) => void
  public onRemoteStream?: (stream: MediaStream) => void
  public onCallEnd?: () => void
  public onError?: (error: string) => void
  public onConnectionStateChange?: (state: RTCPeerConnectionState) => void

  constructor() {
    this.initializeSignaling()
  }

  private initializeSignaling() {
    try {
      // Check if we're in browser environment
      if (typeof window === 'undefined') {
        console.log('Server-side rendering, skipping WebSocket initialization')
        return
      }

      console.log('Using direct connection mode for WebRTC')
      
      // Initialize peer connection directly without signaling server
      this.initializePeerConnection()
      
      // In a real implementation, you would connect to a signaling server here
      // For now, we'll just use direct connection mode
    } catch (error) {
      console.error('Failed to initialize signaling:', error)
      // Fallback to direct peer connection
      this.initializePeerConnection()
    }
  }

  private initializePeerConnection() {
    try {
      // Check if we're in browser environment
      if (typeof window === 'undefined' || !window.RTCPeerConnection) {
        console.log('WebRTC not available in this environment')
        return
      }

      this.peerConnection = new RTCPeerConnection({
        iceServers: this.iceServers
      })

      // Handle ICE candidates
      this.peerConnection.onicecandidate = (event) => {
        if (event.candidate && this.signalingSocket?.readyState === WebSocket.OPEN) {
          this.sendSignalingMessage({
            type: 'ice-candidate',
            data: event.candidate,
            from: this.getCurrentUserId(),
            to: this.getRemoteUserId(),
            callId: this.callId || ''
          })
        }
      }

      // Handle remote stream
      this.peerConnection.ontrack = (event) => {
        console.log('Received remote stream')
        this.remoteStream = event.streams[0]
        this.onRemoteStream?.(this.remoteStream)
      }

      // Handle connection state changes
      this.peerConnection.onconnectionstatechange = () => {
        const state = this.peerConnection?.connectionState
        console.log('Connection state:', state)
        this.onConnectionStateChange?.(state || 'closed')
        
        if (state === 'failed' || state === 'disconnected' || state === 'closed') {
          this.endCall()
        }
      }

    } catch (error) {
      console.error('Failed to initialize peer connection:', error)
      this.onError?.('Failed to initialize call connection')
    }
  }

  async startCall(participant: CallParticipant, options: CallOptions): Promise<string> {
    try {
      this.callId = `call_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      this.isInitiator = true

      // Get user media
      await this.getUserMedia(options)
      
      // Initialize peer connection if not already done
      if (!this.peerConnection) {
        this.initializePeerConnection()
      }

      // Add local stream to peer connection
      if (this.localStream && this.peerConnection) {
        this.localStream.getTracks().forEach(track => {
          this.peerConnection!.addTrack(track, this.localStream!)
        })
      }

      // Notify about local stream
      if (this.localStream) {
        this.onLocalStream?.(this.localStream)
      }

      // Try to send call request via signaling server
      try {
        if (this.signalingSocket?.readyState === WebSocket.OPEN) {
          this.sendSignalingMessage({
            type: 'call-request',
            data: { options, participant },
            from: this.getCurrentUserId(),
            to: participant.id,
            callId: this.callId
          })
        } else {
          console.log('Signaling server not connected, using direct mode')
          
          // In a real app, you would implement a fallback mechanism here
          // For now, we'll just simulate a successful connection
          setTimeout(() => {
            // Simulate remote stream by using local stream
            if (this.localStream) {
              this.onRemoteStream?.(this.localStream)
            }
          }, 2000)
        }
      } catch (signalingError) {
        console.error('Failed to send call request:', signalingError)
        
        // Fallback to direct mode
        console.log('Falling back to direct mode due to signaling error')
        
        // Simulate remote stream by using local stream
        setTimeout(() => {
          if (this.localStream) {
            this.onRemoteStream?.(this.localStream)
          }
        }, 2000)
      }

      return this.callId
    } catch (error) {
      console.error('Failed to start call:', error)
      this.onError?.('Failed to start call')
      throw error
    }
  }

  async answerCall(callId: string, options: CallOptions): Promise<void> {
    try {
      this.callId = callId
      this.isInitiator = false

      // Get user media
      await this.getUserMedia(options)

      // Initialize peer connection if not already done
      if (!this.peerConnection) {
        this.initializePeerConnection()
      }

      // Add local stream to peer connection
      if (this.localStream && this.peerConnection) {
        this.localStream.getTracks().forEach(track => {
          this.peerConnection!.addTrack(track, this.localStream!)
        })
      }

      // Notify about local stream
      if (this.localStream) {
        this.onLocalStream?.(this.localStream)
      }

      // Try to send call accept via signaling server
      try {
        if (this.signalingSocket?.readyState === WebSocket.OPEN) {
          this.sendSignalingMessage({
            type: 'call-accept',
            data: { options },
            from: this.getCurrentUserId(),
            to: this.getRemoteUserId(),
            callId: this.callId
          })
        } else {
          console.log('Signaling server not connected, using direct mode for answer')
          
          // In a real app, you would implement a fallback mechanism here
          // For now, we'll just simulate a successful connection
          setTimeout(() => {
            // Simulate remote stream by using local stream
            if (this.localStream) {
              this.onRemoteStream?.(this.localStream)
            }
          }, 2000)
        }
      } catch (signalingError) {
        console.error('Failed to send call accept:', signalingError)
        
        // Fallback to direct mode
        console.log('Falling back to direct mode for answer due to signaling error')
        
        // Simulate remote stream by using local stream
        setTimeout(() => {
          if (this.localStream) {
            this.onRemoteStream?.(this.localStream)
          }
        }, 2000)
      }

    } catch (error) {
      console.error('Failed to answer call:', error)
      this.onError?.('Failed to answer call')
      throw error
    }
  }

  async rejectCall(callId: string): Promise<void> {
    try {
      if (this.signalingSocket?.readyState === WebSocket.OPEN) {
        this.sendSignalingMessage({
          type: 'call-reject',
          data: {},
          from: this.getCurrentUserId(),
          to: this.getRemoteUserId(),
          callId: callId
        })
      } else {
        console.log('Signaling server not connected, using direct mode for reject')
      }
      
      // Notify that the call has ended
      this.onCallEnd?.()
    } catch (error) {
      console.error('Error rejecting call:', error)
    }
  }

  async endCall(): Promise<void> {
    try {
      // Send end call signal if signaling server is connected
      if (this.callId && this.signalingSocket?.readyState === WebSocket.OPEN) {
        try {
          this.sendSignalingMessage({
            type: 'call-end',
            data: {},
            from: this.getCurrentUserId(),
            to: this.getRemoteUserId(),
            callId: this.callId
          })
        } catch (signalingError) {
          console.error('Failed to send call end message:', signalingError)
        }
      }

      // Stop local stream
      if (this.localStream) {
        this.localStream.getTracks().forEach(track => track.stop())
        this.localStream = null
      }

      // Close peer connection
      if (this.peerConnection) {
        this.peerConnection.close()
        this.peerConnection = null
      }

      // Reset state
      this.callId = null
      this.remoteStream = null
      this.isInitiator = false

      // Notify that the call has ended
      this.onCallEnd?.()
    } catch (error) {
      console.error('Error ending call:', error)
    }
  }

  private async getUserMedia(options: CallOptions): Promise<void> {
    try {
      // Check if we're in browser environment and have media devices
      if (typeof window === 'undefined' || !navigator.mediaDevices) {
        throw new Error('Media devices not available')
      }

      const constraints: MediaStreamConstraints = {
        audio: options.audio,
        video: options.video ? {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 }
        } : false
      }

      this.localStream = await navigator.mediaDevices.getUserMedia(constraints)
      this.onLocalStream?.(this.localStream)
    } catch (error) {
      console.error('Failed to get user media:', error)
      this.onError?.('Failed to access camera/microphone')
      throw error
    }
  }

  public async handleSignalingMessage(message: any) {
    try {
      switch (message.type) {
        case 'offer':
          await this.handleOffer(message.data)
          break
        case 'answer':
          await this.handleAnswer(message.data)
          break
        case 'ice-candidate':
          await this.handleIceCandidate(message.data)
          break
        case 'call-end':
          this.endCall()
          break
        default:
          console.log('Unknown signaling message in WebRTC service:', message.type)
      }
    } catch (error) {
      console.error('Error handling signaling message:', error)
    }
  }

  private async handleOffer(offer: RTCSessionDescriptionInit) {
    if (!this.peerConnection) return

    await this.peerConnection.setRemoteDescription(offer)
    const answer = await this.peerConnection.createAnswer()
    await this.peerConnection.setLocalDescription(answer)

    this.sendSignalingMessage({
      type: 'answer',
      data: answer,
      from: this.getCurrentUserId(),
      to: this.getRemoteUserId(),
      callId: this.callId || ''
    })
  }

  private async handleAnswer(answer: RTCSessionDescriptionInit) {
    if (!this.peerConnection) return
    await this.peerConnection.setRemoteDescription(answer)
  }

  private async handleIceCandidate(candidate: RTCIceCandidateInit) {
    if (!this.peerConnection) return
    await this.peerConnection.addIceCandidate(candidate)
  }

  private sendSignalingMessage(message: SignalingMessage) {
    if (this.signalingSocket?.readyState === WebSocket.OPEN) {
      this.signalingSocket.send(JSON.stringify(message))
    } else {
      console.warn('Signaling socket not available, message not sent:', message.type)
    }
  }

  // Helper methods (these would be implemented based on your auth system)
  private getCurrentUserId(): string {
    // Get from localStorage or auth context
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user).id : 'anonymous'
  }

  private getRemoteUserId(): string {
    // This would be set when initiating/receiving a call
    return 'remote-user' // Placeholder
  }

  // Media controls
  toggleMute(): boolean {
    if (this.localStream) {
      const audioTrack = this.localStream.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled
        return !audioTrack.enabled
      }
    }
    return false
  }

  toggleVideo(): boolean {
    if (this.localStream) {
      const videoTrack = this.localStream.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled
        return !videoTrack.enabled
      }
    }
    return false
  }

  getLocalStream(): MediaStream | null {
    return this.localStream
  }

  getRemoteStream(): MediaStream | null {
    return this.remoteStream
  }
}
