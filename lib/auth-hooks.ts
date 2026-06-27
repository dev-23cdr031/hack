"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { User } from "@/lib/types"

// Hook for accessing the current authenticated user
export function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function getUser() {
      try {
        setIsLoading(true)
        
        // Get the current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
          throw sessionError
        }
        
        if (!session) {
          setUser(null)
          return
        }
        
        // Get the user profile data
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
        
        if (profileError) {
          console.error('Error fetching user profile:', profileError)
          // Still set the basic user from auth
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.full_name || 'User',
            avatar_url: session.user.user_metadata?.avatar_url || '',
            bio: '',
            title: '',
            skills: [],
            github_url: '',
            linkedin_url: '',
            portfolio_url: '',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          return
        }
        
        // Combine auth and profile data
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          name: profile.full_name || session.user.user_metadata?.full_name || 'User',
          avatar_url: profile.avatar_url || session.user.user_metadata?.avatar_url || '',
          bio: profile.bio || '',
          title: profile.title || '',
          skills: profile.skills || [],
          github_url: profile.github_url || '',
          linkedin_url: profile.linkedin_url || '',
          portfolio_url: profile.website_url || '',
          created_at: profile.created_at || new Date().toISOString(),
          updated_at: profile.updated_at || new Date().toISOString(),
        })
      } catch (error) {
        console.error('Error in useUser hook:', error)
        
        // Fallback to demo user when Supabase is not available
        console.log('Using fallback demo user for development')
        setUser({
          id: 'demo-user-1',
          email: 'demo@hackconnect.com',
          name: 'Demo User',
          avatar_url: '',
          bio: 'Demo user for development',
          title: 'Software Developer',
          skills: ['React', 'TypeScript', 'Node.js'],
          github_url: '',
          linkedin_url: '',
          portfolio_url: '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
      } finally {
        setIsLoading(false)
      }
    }

    // Initial fetch
    getUser()

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      getUser()
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  return { user, isLoading }
}