// WebRTC Service for HackConnect (Next.js 14.2.17 compatible version)
// Handles peer-to-peer audio/video communication

export interface CallParticipant {
  id: string
  name: string
  avatar_url?: string
  avatar?: string
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
  public localStream: MediaStream | null = null
  private remoteStream: MediaStream | null = null
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
    this.initializePeerConnection()
  }

  private initializePeerConnection() {
    try {
      // Check if we're in browser environment
      if (typeof window === 'undefined') {
        console.log('Server-side rendering, skipping initialization')
        return
      }
      
      // Check if RTCPeerConnection is available
      if (typeof RTCPeerConnection === 'undefined') {
        console.log('WebRTC not supported in this browser')
        return
      }

      // Create peer connection
      this.peerConnection = new RTCPeerConnection({
        iceServers: this.iceServers
      })

      // Set up event handlers
      this.peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          console.log('ICE candidate generated:', event.candidate)
          // In a real app, you would send this to the remote peer via signaling server
        }
      }

      this.peerConnection.ontrack = (event) => {
        console.log('Remote track received:', event.track.kind)
        
        if (!this.remoteStream) {
          this.remoteStream = new MediaStream()
        }
        
        this.remoteStream.addTrack(event.track)
        this.onRemoteStream?.(this.remoteStream)
      }

      this.peerConnection.onconnectionstatechange = () => {
        console.log('Connection state changed:', this.peerConnection?.connectionState)
        this.onConnectionStateChange?.(this.peerConnection?.connectionState as RTCPeerConnectionState)
        
        if (this.peerConnection?.connectionState === 'disconnected' || 
            this.peerConnection?.connectionState === 'failed' ||
            this.peerConnection?.connectionState === 'closed') {
          this.endCall()
        }
      }

      console.log('Peer connection initialized')
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

      // In a real app, you would implement a signaling mechanism here
      // For now, we'll just simulate a successful connection
      setTimeout(() => {
        // Simulate remote stream by using local stream
        if (this.localStream) {
          this.onRemoteStream?.(this.localStream)
        }
      }, 2000)

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

      // In a real app, you would implement a signaling mechanism here
      // For now, we'll just simulate a successful connection
      setTimeout(() => {
        // Simulate remote stream by using local stream
        if (this.localStream) {
          this.onRemoteStream?.(this.localStream)
        }
      }, 2000)

    } catch (error) {
      console.error('Failed to answer call:', error)
      this.onError?.('Failed to answer call')
      throw error
    }
  }

  async rejectCall(callId: string): Promise<void> {
    try {
      // Notify that the call has ended
      this.onCallEnd?.()
    } catch (error) {
      console.error('Error rejecting call:', error)
    }
  }

  async endCall(): Promise<void> {
    try {
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
      if (typeof navigator === 'undefined' || !navigator.mediaDevices) {
        throw new Error('Media devices not available')
      }

      // Get user media
      const constraints = {
        audio: options.audio,
        video: options.video
      }

      this.localStream = await navigator.mediaDevices.getUserMedia(constraints)
      console.log('Got local stream:', this.localStream.id)
      
      // Notify about local stream
      this.onLocalStream?.(this.localStream)
    } catch (error) {
      console.error('Failed to get user media:', error)
      this.onError?.('Failed to access camera/microphone')
      throw error
    }
  }

  private getCurrentUserId(): string {
    // In a real app, you would get this from your auth system
    return 'current-user-id'
  }

  private getRemoteUserId(): string {
    // In a real app, you would get this from the call state
    return 'remote-user-id'
  }

  // For handling incoming signaling messages
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
    
    try {
      await this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer))
      const answer = await this.peerConnection.createAnswer()
      await this.peerConnection.setLocalDescription(answer)
      
      // In a real app, you would send this answer to the remote peer via signaling server
      console.log('Created answer:', answer)
    } catch (error) {
      console.error('Error handling offer:', error)
    }
  }

  private async handleAnswer(answer: RTCSessionDescriptionInit) {
    if (!this.peerConnection) return
    
    try {
      await this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer))
    } catch (error) {
      console.error('Error handling answer:', error)
    }
  }

  private async handleIceCandidate(candidate: RTCIceCandidateInit) {
    if (!this.peerConnection) return
    
    try {
      await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
    } catch (error) {
      console.error('Error handling ICE candidate:', error)
    }
  }
}