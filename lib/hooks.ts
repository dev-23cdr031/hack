"use client"

import { useState, useEffect } from "react"
import { User } from "@/lib/types"

// Mock user data for development
const MOCK_USER: User = {
  id: "user-123",
  name: "Demo User",
  email: "demo@example.com",
  avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=demo",
  skills: ["React", "TypeScript", "Next.js"],
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
}

// Hook for accessing the current authenticated user
export function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading user data
    const loadUser = async () => {
      try {
        setIsLoading(true)
        
        // In a real app, this would fetch from an auth service
        // For now, we'll just use mock data
        setTimeout(() => {
          setUser(MOCK_USER)
          setIsLoading(false)
        }, 500)
      } catch (error) {
        console.error('Error in useUser hook:', error)
        setUser(null)
        setIsLoading(false)
      }
    }

    loadUser()
  }, [])

  return { user, isLoading }
}

// Hook for managing meeting state
export function useMeeting(roomId?: string) {
  const [meeting, setMeeting] = useState<any | null>(null)
  const [participants, setParticipants] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    if (!roomId) {
      setIsLoading(false)
      return
    }
    
    // Simulate loading meeting data
    const loadMeeting = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        // In a real app, this would fetch from a database
        // For now, we'll just use mock data
        setTimeout(() => {
          setMeeting({
            id: "meeting-" + Math.random().toString(36).substring(2, 9),
            room_id: roomId,
            title: "Demo Meeting",
            status: "active",
            host_id: MOCK_USER.id,
            host: MOCK_USER,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          
          setParticipants([
            {
              id: "participant-" + Math.random().toString(36).substring(2, 9),
              meeting_id: "meeting-123",
              user_id: MOCK_USER.id,
              user: MOCK_USER,
              join_time: new Date().toISOString(),
              audio_enabled: true,
              video_enabled: true
            }
          ])
          
          setIsLoading(false)
        }, 800)
      } catch (error: any) {
        console.error('Error fetching meeting:', error)
        setError(error.message || 'Failed to load meeting')
        setMeeting(null)
        setParticipants([])
        setIsLoading(false)
      }
    }
    
    loadMeeting()
  }, [roomId])
  
  return { meeting, participants, isLoading, error }
}

// Hook for managing real-time presence
export function usePresence(roomId?: string) {
  const [onlineUsers, setOnlineUsers] = useState<Record<string, any>>({})
  const { user } = useUser()
  
  useEffect(() => {
    if (!roomId || !user) return
    
    // Simulate presence
    const interval = setInterval(() => {
      setOnlineUsers({
        [user.id]: [{
          user_id: user.id,
          name: user.name,
          avatar_url: user.avatar_url,
          online_at: new Date().toISOString(),
        }]
      })
    }, 5000)
    
    return () => {
      clearInterval(interval)
    }
  }, [roomId, user])
  
  return { onlineUsers }
}