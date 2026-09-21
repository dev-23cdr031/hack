"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { EditProfileModal } from "@/components/edit-profile-modal"
import { AddSkillModal } from "@/components/add-skill-modal"
import { AddProjectModal } from "@/components/add-project-modal"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { supabase, getAuthHeaders } from "@/lib/supabase"
import type { User as UserType, Project as ProjectType } from "@/lib/types"
import {
  Settings,
  Edit,
  Plus,
  Github,
  Linkedin,
  ExternalLink,
  Mail,
  Calendar,
  Award,
  Code,
  Briefcase,
  X,
  Upload,
  Loader2,
  Camera,
  GraduationCap,
  Building,
  Trophy,
  Users,
  Star,
  TrendingUp,
  Activity,
  BookOpen,
  Zap,
  Heart,
  Eye,
  Download,
  Share2,
  MessageSquare,
  Globe,
  Phone,
  Clock,
  CheckCircle,
  AlertCircle,
  Bookmark,
  Filter,
  Search,
  BarChart3,
  PieChart,
  LineChart,
  Calendar as CalendarIcon,
  MapPin,
  MapPinIcon,
  BadgeCheck,
  Flame,
  Sparkles,
  Rocket,
  Crown,
  Medal,
  ArrowLeft,
  Shield
} from "lucide-react"

interface Skill {
  id: string
  name: string
  level: number
  category?: string
  yearsOfExperience?: number
  endorsed?: boolean
}

interface Education {
  id: string
  institution: string
  degree: string
  field: string
  startYear: number
  endYear?: number
  grade?: string
  description?: string
}

interface Experience {
  id: string
  company: string
  position: string
  startDate: string
  endDate?: string
  description: string
  technologies: string[]
  achievements: string[]
}

interface Achievement {
  id: string
  title: string
  description: string
  date: string
  type: 'hackathon' | 'certification' | 'award' | 'publication'
  organization?: string
  url?: string
}

interface ProfileStats {
  profileViews: number
  projectViews: number
  skillEndorsements: number
  hackathonsParticipated: number
  teamsJoined: number
  projectsCompleted: number
}

const isTeamAvatar = (avatarUrl?: string) => Boolean(avatarUrl?.startsWith("/team/"))

const sanitizeCurrentUserProfile = (profile: UserType): UserType => {
  if (isTeamAvatar(profile.avatar_url)) {
    return { ...profile, avatar_url: "/placeholder-user.jpg" }
  }

  return profile
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserType | null>(null)
  const [skills, setSkills] = useState<Skill[]>([])
  const [projects, setProjects] = useState<ProjectType[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [education, setEducation] = useState<Education[]>([])
  const [experience, setExperience] = useState<Experience[]>([])
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [profileStats, setProfileStats] = useState<ProfileStats>({
    profileViews: 0,
    projectViews: 0,
    skillEndorsements: 0,
    hackathonsParticipated: 0,
    teamsJoined: 0,
    projectsCompleted: 0
  })
  
  const [myHackathons, setMyHackathons] = useState<any[]>([])
  const [myRegistrations, setMyRegistrations] = useState<any[]>([])
  const [myHackathonRegistrations, setMyHackathonRegistrations] = useState<any[]>([])
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [showAddSkill, setShowAddSkill] = useState(false)
  const [showAddProject, setShowAddProject] = useState(false)

  // Record (experience / education / achievement) editors
  const [recordModal, setRecordModal] = useState<'experience' | 'education' | 'achievements' | null>(null)
  const emptyRecordForm = {
    company: "", position: "", startDate: "", endDate: "", description: "",
    technologies: "", achievements: "", institution: "", degree: "", field: "",
    startYear: "", endYear: "", grade: "", title: "", date: "", type: "hackathon",
    organization: "", url: "",
  }
  const [recordForm, setRecordForm] = useState(emptyRecordForm)
  const [showAddEducation, setShowAddEducation] = useState(false)
  const [showAddExperience, setShowAddExperience] = useState(false)
  const [showAddAchievement, setShowAddAchievement] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [skillFilter, setSkillFilter] = useState('all')
  const [projectFilter, setProjectFilter] = useState('all')

  // Get current user from localStorage (from login)
  useEffect(() => {
    try {
      const storedUserId = localStorage.getItem('userId')
      const userData = localStorage.getItem('user')

      if (storedUserId) {
        fetchUserProfile(storedUserId)
        return
      }

      if (userData) {
        const currentUser = JSON.parse(userData)

        if (currentUser && currentUser.id) {
          fetchUserProfile(currentUser.id)
          return
        }

        setError('Invalid user data. Please log in again.')
        setLoading(false)
        return
      }

      // No local record → check the real Supabase session (covers cleared localStorage)
      supabase.auth.getSession().then(({ data: { session } }) => {
        const sessionUser = session?.user
        if (sessionUser?.id) {
          const meta = sessionUser.user_metadata || {}
          const sessionProfile = {
            id: sessionUser.id,
            email: sessionUser.email || '',
            name: meta.full_name || sessionUser.email?.split('@')[0] || 'User',
            bio: meta.bio || '',
            title: meta.title || 'Developer',
            skills: Array.isArray(meta.skills) ? meta.skills : [],
            avatar_url: meta.avatar_url || '/placeholder-user.jpg',
            location: meta.location || '',
            experience_level: meta.experience_level || 'beginner',
            role: meta.role || 'student',
          }
          localStorage.setItem('user', JSON.stringify(sessionProfile))
          localStorage.setItem('userId', sessionUser.id)
          localStorage.setItem('isAuthenticated', 'true')
          fetchUserProfile(sessionUser.id)
          return
        }

        setError('Please log in to view your profile')
        setLoading(false)
        // Redirect straight to login instead of just showing an error
        window.location.href = '/auth/login'
      })
    } catch (err) {
      console.error('Error parsing user data from localStorage:', err)
      setError('Invalid user data. Please log in again.')
      setLoading(false)
      window.location.href = '/auth/login'
    }
  }, [])

  const fetchUserProfile = async (userId: string) => {
    try {
      setLoading(true)
      setError(null)

      // Fetch user data
      const { getAuthHeaders } = await import("@/lib/supabase")
      const headers = await getAuthHeaders()
      const userResponse = await fetch(`/api/users/${userId}`, { headers })

      if (!userResponse.ok) {
        if (userResponse.status === 404) {
          const fallbackUser = localStorage.getItem('user')
          const parsedFallbackUser = fallbackUser ? JSON.parse(fallbackUser) : null

          if (parsedFallbackUser && parsedFallbackUser.id === userId) {
            const sanitizedFallbackUser = sanitizeCurrentUserProfile(parsedFallbackUser)
            setUser(sanitizedFallbackUser)
            setSkills(
              Array.isArray(parsedFallbackUser.skills)
                ? parsedFallbackUser.skills.map((skill: string, index: number) => ({
                    id: `skill-${index}`,
                    name: skill,
                    level: 80,
                    category: getSkillCategory(skill),
                    yearsOfExperience: 1,
                    endorsed: false,
                  }))
                : []
            )
            setProjects([])
            setLoading(false)
            return
          }

          setUser({
            id: userId,
            email: '',
            name: 'New User',
            bio: '',
            title: 'Developer',
            skills: [],
            avatar_url: '/placeholder-user.jpg',
            github_url: '',
            linkedin_url: '',
            portfolio_url: '',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          setSkills([])
          setProjects([])
          setLoading(false)
          return
        }

        throw new Error(`Failed to fetch user profile: ${userResponse.status}`)
      }

      const userData = await userResponse.json()
      const sanitizedUserData = sanitizeCurrentUserProfile(userData)
      if (sanitizedUserData.avatar_url !== userData.avatar_url) {
        localStorage.setItem('user', JSON.stringify(sanitizedUserData))
      }
      setUser(sanitizedUserData)

      // Parse skills from user data (stored as JSON array)
      if (userData.skills && Array.isArray(userData.skills)) {
        const skillsWithLevels = userData.skills.map((skill: string, index: number) => ({
          id: `skill-${index}`,
          name: skill,
          level: 80,
          category: getSkillCategory(skill),
          yearsOfExperience: 1,
          endorsed: false
        }))
        setSkills(skillsWithLevels)
      } else {
        setSkills([])
      }

      // Load experience / education / achievements records (stored as JSONB on the user row)
      setExperience(Array.isArray((userData as any).experience) ? (userData as any).experience : [])
      setEducation(Array.isArray((userData as any).education) ? (userData as any).education : [])
      setAchievements(Array.isArray((userData as any).achievements) ? (userData as any).achievements : [])

      // Fetch user projects
      const projectsResponse = await fetch(`/api/projects?user_id=${userId}`)

      if (projectsResponse.ok) {
        const projectsData = await projectsResponse.json()
        setProjects(projectsData)
      } else {
        setProjects([])
      }

      // Fetch hackathons created by this user
      try {
        const myHackRes = await fetch(`/api/hackathons?created_by=${userId}`)
        let apiHackathons: any[] = []
        if (myHackRes.ok) {
          const myHackData = await myHackRes.json()
          apiHackathons = myHackData.hackathons || []
        }
        
        // Also merge local hackathons created by this user
        let localHackathons: any[] = []
        try {
          const allLocal = JSON.parse(localStorage.getItem('localHackathons') || '[]')
          localHackathons = allLocal.filter((h: any) => h.created_by === userId)
        } catch {}
        
        // Combine and deduplicate
        const all = [...localHackathons, ...apiHackathons]
        const seen = new Set()
        const deduped = all.filter((h: any) => {
          if (seen.has(h.id)) return false
          seen.add(h.id)
          return true
        })
        
        setMyHackathons(deduped)
      } catch (e) {
        console.error('Error fetching my hackathons:', e)
      }

      // Fetch registrations for hackathons created by this user
      try {
        const myHackRegRes = await fetch(`/api/hackathons/registrations?created_by=${userId}`)
        if (myHackRegRes.ok) {
          const myHackRegData = await myHackRegRes.json()
          setMyHackathonRegistrations(myHackRegData.registrations || [])
        }
      } catch (e) {
        console.error('Error fetching registrations for my hackathons:', e)
      }

      // Fetch registrations for this user
      try {
        const myRegRes = await fetch(`/api/hackathons/registrations?user_id=${userId}`)
        if (myRegRes.ok) {
          const myRegData = await myRegRes.json()
          setMyRegistrations(myRegData.registrations || [])
        }
      } catch (e) {
        console.error('Error fetching my registrations:', e)
      }

      // Fetch real stats from database
      await fetchRealStats(userId)

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load profile'
      console.error('Error fetching profile:', err)
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const fetchRealStats = async (userId: string) => {
    try {
      // Fetch hackathon registrations
      const hackRes = await fetch(`/api/hackathons/registrations?user_id=${userId}`)
      let hackCount = 0
      if (hackRes.ok) {
        const hackData = await hackRes.json()
        hackCount = Array.isArray(hackData) ? hackData.length : (hackData.registrations?.length || 0)
      }

      // Fetch teams joined
      const teamsRes = await fetch(`/api/teams?user_id=${userId}`)
      let teamCount = 0
      if (teamsRes.ok) {
        const teamsData = await teamsRes.json()
        teamCount = Array.isArray(teamsData) ? teamsData.length : (teamsData.teams?.length || 0)
      }

      setProfileStats({
        profileViews: 0,
        projectViews: 0,
        skillEndorsements: 0,
        hackathonsParticipated: hackCount,
        teamsJoined: teamCount,
        projectsCompleted: projects.length
      })
    } catch (e) {
      console.error('Error fetching stats:', e)
    }
  }
  
  const getSkillCategory = (skill: string): string => {
    const categories: { [key: string]: string[] } = {
      'Frontend': ['React', 'Vue', 'Angular', 'HTML', 'CSS', 'JavaScript', 'TypeScript', 'Tailwind'],
      'Backend': ['Node.js', 'Python', 'Java', 'C#', 'PHP', 'Ruby', 'Go', 'Rust'],
      'Database': ['MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Firebase'],
      'DevOps': ['Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'Jenkins'],
      'Mobile': ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Ionic'],
      'Design': ['UI/UX', 'Adobe XD', 'Photoshop', 'Illustrator', 'Sketch']
    }
    
    for (const [category, skills] of Object.entries(categories)) {
      if (skills.some(s => skill.toLowerCase().includes(s.toLowerCase()))) {
        return category
      }
    }
    return 'Other'
  }

  const handleUpdateProfile = async (updatedData: Partial<UserType>) => {
    if (!user) return

    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: await getAuthHeaders(),
        body: JSON.stringify(updatedData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update profile')
      }

      const updatedUser = await response.json()
      setUser(updatedUser)

      // Update localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser))
      localStorage.setItem('userId', updatedUser.id)

      setShowEditProfile(false)
      alert('Profile updated successfully!')

    } catch (err) {
      console.error('Error updating profile:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to update profile'
      alert(`Failed to update profile: ${errorMessage}`)
    }
  }

  // Save experience / education / achievement arrays to the user row (JSONB columns)
  const persistProfileRecords = async (
    nextExperience: Experience[],
    nextEducation: Education[],
    nextAchievements: Achievement[]
  ) => {
    if (!user) return
    const response = await fetch(`/api/users/${user.id}`, {
      method: 'PUT',
      headers: await getAuthHeaders(),
      body: JSON.stringify({
        experience: nextExperience,
        education: nextEducation,
        achievements: nextAchievements,
      })
    })
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to save records')
    }
    const updatedUser = await response.json()
    setUser(updatedUser)
    localStorage.setItem('user', JSON.stringify(updatedUser))
    localStorage.setItem('userId', updatedUser.id)
  }

  const openRecordModal = (type: 'experience' | 'education' | 'achievements') => {
    setRecordForm({ ...emptyRecordForm })
    setRecordModal(type)
  }

  const addExperienceRecord = async () => {
    if (!user) return
    if (!recordForm.company.trim() || !recordForm.position.trim()) {
      alert('Company and job title are required')
      return
    }
    const newRecord: Experience = {
      id: `exp-${Date.now()}`,
      company: recordForm.company.trim(),
      position: recordForm.position.trim(),
      startDate: recordForm.startDate,
      endDate: recordForm.endDate || undefined,
      description: recordForm.description.trim(),
      technologies: recordForm.technologies.split(',').map(s => s.trim()).filter(Boolean),
      achievements: recordForm.achievements.split('|').map(s => s.trim()).filter(Boolean),
    }
    const next = [...experience, newRecord]
    try {
      await persistProfileRecords(next, education, achievements)
      setExperience(next)
      setRecordModal(null)
      alert('Work experience added to your profile!')
    } catch (err: any) {
      alert(`Failed to save work experience: ${err?.message || 'Please try again'}`)
    }
  }

  const addEducationRecord = async () => {
    if (!user) return
    if (!recordForm.institution.trim() || !recordForm.degree.trim()) {
      alert('Institution and degree are required')
      return
    }
    const newRecord: Education = {
      id: `edu-${Date.now()}`,
      institution: recordForm.institution.trim(),
      degree: recordForm.degree.trim(),
      field: recordForm.field.trim(),
      startYear: recordForm.startYear ? parseInt(recordForm.startYear) : new Date().getFullYear(),
      endYear: recordForm.endYear ? parseInt(recordForm.endYear) : undefined,
      grade: recordForm.grade.trim() || undefined,
      description: recordForm.description.trim() || undefined,
    }
    const next = [...education, newRecord]
    try {
      await persistProfileRecords(experience, next, achievements)
      setEducation(next)
      setRecordModal(null)
      alert('Education added to your profile!')
    } catch (err: any) {
      alert(`Failed to save education: ${err?.message || 'Please try again'}`)
    }
  }

  const addAchievementRecord = async () => {
    if (!user) return
    if (!recordForm.title.trim()) {
      alert('Achievement title is required')
      return
    }
    const newRecord: Achievement = {
      id: `ach-${Date.now()}`,
      title: recordForm.title.trim(),
      description: recordForm.description.trim(),
      date: recordForm.date,
      type: (recordForm.type || 'award') as Achievement['type'],
      organization: recordForm.organization.trim() || undefined,
      url: recordForm.url.trim() || undefined,
    }
    const next = [...achievements, newRecord]
    try {
      await persistProfileRecords(experience, education, next)
      setAchievements(next)
      setRecordModal(null)
      alert('Achievement added to your profile!')
    } catch (err: any) {
      alert(`Failed to save achievement: ${err?.message || 'Please try again'}`)
    }
  }

  const removeExperienceRecord = async (id: string) => {
    const next = experience.filter(e => e.id !== id)
    if (!user) return
    try {
      await persistProfileRecords(next, education, achievements)
      setExperience(next)
      alert('Experience removed')
    } catch (err: any) {
      alert(`Failed to remove: ${err?.message || 'Please try again'}`)
    }
  }

  const removeEducationRecord = async (id: string) => {
    const next = education.filter(e => e.id !== id)
    if (!user) return
    try {
      await persistProfileRecords(experience, next, achievements)
      setEducation(next)
      alert('Education removed')
    } catch (err: any) {
      alert(`Failed to remove: ${err?.message || 'Please try again'}`)
    }
  }

  const removeAchievementRecord = async (id: string) => {
    const next = achievements.filter(a => a.id !== id)
    if (!user) return
    try {
      await persistProfileRecords(experience, education, next)
      setAchievements(next)
      alert('Achievement removed')
    } catch (err: any) {
      alert(`Failed to remove: ${err?.message || 'Please try again'}`)
    }
  }

  const handleAddSkill = async (skillName: string, level: number) => {
    if (!user) return

    try {
      const newSkills = [...(user.skills || []), skillName]
      await handleUpdateProfile({ skills: newSkills })

      const newSkill: Skill = {
        id: `skill-${Date.now()}`,
        name: skillName,
        level: level,
        category: getSkillCategory(skillName),
        yearsOfExperience: 1,
        endorsed: false
      }
      setSkills((prev) => [...prev, newSkill])
      setShowAddSkill(false)
      
      alert(`Added ${skillName} with ${level}% proficiency!`)
    } catch (err) {
      console.error('Error adding skill:', err)
      alert('Failed to add skill. Please try again.')
    }
  }

  const handleAddProject = async (projectData: {
    title: string
    description: string
    technologies: string[]
    githubUrl?: string
    liveUrl?: string
  }) => {
    if (!user) return

    try {
      const apiData = {
        title: projectData.title,
        description: projectData.description,
        technologies: projectData.technologies,
        github_url: projectData.githubUrl || '',
        demo_url: projectData.liveUrl || '',
        user_id: user.id
      }

      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apiData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create project')
      }

      const newProject = await response.json()
      setProjects((prev) => [...prev, newProject])
      setShowAddProject(false)
      alert('Project added successfully!')

    } catch (err) {
      console.error('Error adding project:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to add project'
      alert(`Failed to add project: ${errorMessage}`)
    }
  }

  const removeSkill = async (skillId: string) => {
    if (!user) return

    try {
      const skillToRemove = skills.find(s => s.id === skillId)
      if (!skillToRemove) return

      const newSkills = (user.skills || []).filter(skill => skill !== skillToRemove.name)
      await handleUpdateProfile({ skills: newSkills })

      setSkills((prev) => prev.filter((skill) => skill.id !== skillId))
    } catch (err) {
      console.error('Error removing skill:', err)
      alert('Failed to remove skill. Please try again.')
    }
  }

  const removeProject = async (projectId: string) => {
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete project')
      }

      setProjects((prev) => prev.filter((project) => project.id !== projectId))
    } catch (err) {
      console.error('Error removing project:', err)
      alert('Failed to remove project. Please try again.')
    }
  }

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !user) return

    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB. Please choose a smaller image.')
      return
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      alert('Only image files (JPEG, PNG, GIF, WebP) are allowed.')
      return
    }

    try {
      setUploading(true)

      const formData = new FormData()
      formData.append('file', file)
      formData.append('userId', user.id)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (!response.ok && !data.success) {
        throw new Error(data.error || 'Failed to upload image')
      }

      // Update user with new avatar URL
      setUser(prev => prev ? { ...prev, avatar_url: data.url } : null)

      // Update localStorage
      const updatedUser = { ...user, avatar_url: data.url }
      localStorage.setItem('user', JSON.stringify(updatedUser))

      // Persist the new avatar to Supabase so other users see it too
      try {
        await fetch(`/api/users/${user.id}`, {
          method: 'PUT',
          headers: await getAuthHeaders(),
          body: JSON.stringify({ avatar_url: data.url })
        })
      } catch (err) {
        console.error('Error persisting avatar URL:', err)
      }

      alert('Profile photo uploaded successfully!')

    } catch (err) {
      console.error('Error uploading avatar:', err)
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      alert(`Failed to upload image: ${errorMessage}. Please try again.`)
    } finally {
      setUploading(false)
      event.target.value = ''
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#020817] text-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-400" />
          <p className="text-gray-400">Loading your profile...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-[#020817] text-white flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold mb-4 text-red-400">Error Loading Profile</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <div className="space-y-3">
            <Button onClick={() => window.location.reload()} className="bg-blue-600 hover:bg-blue-700 w-full">
              Try Again
            </Button>
            {error.includes('log in') && (
              <Button
                onClick={() => window.location.href = '/auth/login'}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent w-full"
              >
                Go to Login
              </Button>
            )}
          </div>
        </div>
      </div>
    )
  }

  // No user data
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400">No user data available</p>
        </div>
      </div>
    )
  }

  const filteredSkills = skills.filter(skill => 
    skillFilter === 'all' || skill.category === skillFilter
  )
  
  const filteredProjects = projects.filter(project => {
    if (projectFilter === 'all') return true
    if (projectFilter === 'recent') {
      const projectDate = new Date(project.created_at || '2024-01-01')
      const sixMonthsAgo = new Date()
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
      return projectDate > sixMonthsAgo
    }
    return project.technologies.some(tech => 
      tech.toLowerCase().includes(projectFilter.toLowerCase())
    )
  })
  
  const skillCategories = ['all', ...Array.from(new Set(skills.map(s => s.category)))]

  return (
    <div className="min-h-screen bg-[#020817] text-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            onClick={() => window.history.back()}
            variant="ghost"
            className="text-gray-400 hover:text-white hover:bg-gray-800/50 p-2"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
        </div>

        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
              My Profile
            </h1>
            <p className="text-gray-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span className="text-yellow-400 capitalize">{user.role || "Member"}</span>
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => setShowEditProfile(true)} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
        
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 p-1 bg-gray-800/50 rounded-lg backdrop-blur-sm">
          {[
            { id: 'overview', label: 'Overview', icon: Activity },
            { id: 'projects', label: 'Projects', icon: Briefcase },
            { id: 'hackathons', label: 'My Hackathons', icon: Trophy },
            { id: 'registrations', label: 'My Registrations', icon: Users },
            { id: 'experience', label: 'Experience', icon: Building },
            { id: 'education', label: 'Education', icon: GraduationCap },
            { id: 'achievements', label: 'Achievements', icon: Award },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 }
          ].map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Profile Header */}
        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="relative">
                <Avatar className="w-32 h-32 border-4 border-blue-500/20">
                  <AvatarImage className="object-cover" src={user.avatar_url || "/placeholder-user.jpg"} alt={user.name} />
                  <AvatarFallback className="bg-blue-600 text-white text-2xl">
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>

                {/* Avatar Upload Button */}
                <div className="absolute bottom-0 right-0">
                  <Label htmlFor="avatar-upload" className="cursor-pointer">
                    <div className="w-10 h-10 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center border-2 border-gray-800 transition-colors">
                      {uploading ? (
                        <Loader2 className="w-5 h-5 text-white animate-spin" />
                      ) : (
                        <Camera className="w-5 h-5 text-white" />
                      )}
                    </div>
                  </Label>
                  <Input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </div>
              </div>

              <div className="flex-1 text-center md:text-left">
                <h2 className="text-3xl font-bold mb-2 text-white">{user.name}</h2>
                <p className="text-xl text-blue-400 mb-4">{user.title || 'Developer'}</p>
                <p className="text-gray-300 mb-4 max-w-2xl">{user.bio || 'No bio available'}</p>

                <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-4">
                  <div className="flex items-center gap-2 text-gray-300">
                    <Mail className="w-4 h-4" />
                    <span>{user.email}</span>
                  </div>
                  {user.location && (
                    <div className="flex items-center gap-2 text-gray-300">
                      <MapPin className="w-4 h-4" />
                      <span>{user.location}</span>
                    </div>
                  )}
                  {!user.location && (
                    <div className="flex items-center gap-2 text-gray-300">
                      <Calendar className="w-4 h-4" />
                      <span>Available for Projects</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-4">
                  {user.role && (
                    <Badge className="bg-blue-600/20 text-blue-300 border border-blue-600/30 capitalize">
                      <Users className="w-3.5 h-3.5 mr-1" /> {user.role}
                    </Badge>
                  )}
                  {user.experience_level && (
                    <Badge className="bg-purple-600/20 text-purple-300 border border-purple-600/30 capitalize">
                      <GraduationCap className="w-3.5 h-3.5 mr-1" /> {user.experience_level} level
                    </Badge>
                  )}
                  <Badge className="bg-gray-700/50 text-gray-200 border border-gray-600">
                    <Sparkles className="w-3.5 h-3.5 mr-1 text-yellow-400" /> Member
                  </Badge>
                </div>

                <div className="flex justify-center md:justify-start gap-4">
                  {user.github_url && (
                    <a
                      href={user.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                    >
                      <Github className="w-5 h-5" />
                    </a>
                  )}
                  {user.linkedin_url && (
                    <a
                      href={user.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                  )}
                  {user.portfolio_url && (
                    <a
                      href={user.portfolio_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Skills Section */}
          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2 text-blue-400">
                  <Code className="w-5 h-5" />
                  Skills ({skills.length})
                </CardTitle>
                <Button
                  onClick={() => setShowAddSkill(true)}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Skill
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {skills.map((skill) => (
                <div key={skill.id} className="group">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-white">{skill.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-blue-400">{skill.level}%</span>
                      <Button
                        onClick={() => removeSkill(skill.id)}
                        size="sm"
                        variant="ghost"
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300 hover:bg-red-900/20"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </div>
              ))}
              {skills.length === 0 && (
                <p className="text-gray-400 text-center py-8">No skills added yet. Add your first skill!</p>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-400">
                <Award className="w-5 h-5" />
                Quick Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-blue-400">{skills.length}</div>
                  <div className="text-sm text-gray-400">Skills</div>
                </div>
                <div className="text-center p-4 bg-purple-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-purple-400">{projects.length}</div>
                  <div className="text-sm text-gray-400">Projects</div>
                </div>
                <div className="text-center p-4 bg-green-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-400">
                    {Math.round(skills.reduce((acc, skill) => acc + skill.level, 0) / skills.length) || 0}%
                  </div>
                  <div className="text-sm text-gray-400">Avg Skill Level</div>
                </div>
                <div className="text-center p-4 bg-yellow-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-400">{profileStats.hackathonsParticipated}</div>
                  <div className="text-sm text-gray-400">Hackathons</div>
                </div>
              </div>
            </CardContent>
          </Card>
          </div>
        )}

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            {/* Project Filters */}
            <div className="flex flex-wrap gap-3 items-center">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-400">Filter:</span>
              </div>
              {['all', 'recent', 'react', 'node.js', 'python'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setProjectFilter(filter)}
                  className={`px-3 py-1 rounded-full text-sm transition-all ${
                    projectFilter === filter
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              ))}
            </div>

        {/* Projects Section */}
        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm mt-8">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2 text-green-400">
                <Briefcase className="w-5 h-5" />
                Projects ({projects.length})
              </CardTitle>
              <Button onClick={() => setShowAddProject(true)} className="bg-green-600 hover:bg-green-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add Project
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {projects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <Card
                    key={project.id}
                    className="bg-gray-700/50 border-gray-600 group hover:bg-gray-700/70 transition-all duration-300"
                  >
                    <CardContent className="p-6">
                      {project.image && (
                        <div className="mb-4 rounded-lg overflow-hidden">
                          <img
                            src={project.image || "/placeholder.svg"}
                            alt={project.title}
                            className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}

                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-semibold text-lg">{project.title}</h3>
                        <Button
                          onClick={() => removeProject(project.id)}
                          size="sm"
                          variant="ghost"
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300 hover:bg-red-900/20"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>

                      <p className="text-gray-300 text-sm mb-4">{project.description}</p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.technologies.map((tech, index) => (
                          <Badge key={index} variant="secondary" className="bg-blue-900/30 text-blue-300 text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        {(project.githubUrl || project.github_url) && (
                          <a
                            href={project.githubUrl || project.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded text-sm transition-colors"
                          >
                            <Github className="w-3 h-3" />
                            Code
                          </a>
                        )}
                        {(project.liveUrl || project.demo_url) && (
                          <a
                            href={project.liveUrl || project.demo_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-500 rounded text-sm transition-colors"
                          >
                            <ExternalLink className="w-3 h-3" />
                            Live
                          </a>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Briefcase className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 mb-4">No projects added yet</p>
                <Button onClick={() => setShowAddProject(true)} className="bg-green-600 hover:bg-green-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Project
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
          </div>
        )}

        {/* My Hackathons Tab */}
        {activeTab === 'hackathons' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">My Created Hackathons ({myHackathons.length})</h2>
              <Link href="/admin">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Shield className="w-4 h-4 mr-2" />
                  Admin Dashboard
                </Button>
              </Link>
            </div>
            {myHackathons.length === 0 ? (
              <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                <CardContent className="p-6 text-center py-12">
                  <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 mb-4">You haven't created any hackathons yet</p>
                  <Link href="/admin">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                      <Shield className="w-4 h-4 mr-2" />
                      Open Admin Dashboard
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {myHackathons.map((h) => (
                  <Card key={h.id} className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-white">{h.title}</h3>
                            <Badge className={h.status === "upcoming" ? "bg-blue-900/50 text-blue-300" : h.status === "ongoing" ? "bg-green-900/50 text-green-300" : "bg-gray-800 text-gray-300"}>{h.status}</Badge>
                          </div>
                          <p className="text-gray-300 text-sm mb-3 line-clamp-2">{h.description}</p>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-300">
                            <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{new Date(h.start_date).toLocaleDateString()} - {new Date(h.end_date).toLocaleDateString()}</span>
                            <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{h.location || "Virtual"}</span>
                            <span className="flex items-center gap-1"><Users className="w-4 h-4" />{h.current_participants || 0} registered</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Link href={`/hackathons/${h.id}`}>
                            <Button variant="outline" size="sm" className="border-gray-600 text-white hover:bg-gray-800">
                              <Eye className="w-4 h-4 mr-1" /> View
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-red-600 text-red-400 hover:bg-red-900/20 hover:text-red-300"
                            onClick={async () => {
                              if (!confirm(`Are you sure you want to delete "${h.title}"? This action cannot be undone.`)) return;
                              try {
                                const res = await fetch(`/api/hackathons/${h.id}?requester_id=${user.id}`, {
                                  method: 'DELETE'
                                })
                                const data = await res.json()
                                if (!res.ok) throw new Error(data?.error || 'Failed to delete hackathon')
                                setMyHackathons(prev => prev.filter(x => x.id !== h.id))
                                alert('Hackathon deleted successfully')
                              } catch (err: any) {
                                alert(err?.message || 'Failed to delete hackathon')
                                console.error('Error deleting hackathon:', err)
                              }
                            }}
                          >
                            <X className="w-4 h-4 mr-1" /> Delete
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* My Registrations Tab */}
        {activeTab === 'registrations' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">My Registrations ({myRegistrations.length})</h2>
            {myRegistrations.length === 0 ? (
              <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                <CardContent className="p-6 text-center py-12">
                  <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 mb-4">You haven't registered for any hackathons yet</p>
                  <Link href="/hackathons">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                      Browse Hackathons
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {myRegistrations.map((reg) => (
                  <Card key={reg.id} className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                            <Trophy className="w-5 h-5 text-yellow-400" />
                          </div>
                          <div>
                            <p className="font-semibold text-white">{reg.hackathons?.title || "Unknown Hackathon"}</p>
                            <p className="text-sm text-gray-400">Registered on {new Date(reg.joined_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <Link href={`/hackathons/${reg.hackathon_id}`}>
                          <Button variant="outline" size="sm" className="border-gray-600 text-white hover:bg-gray-800">
                            <Eye className="w-4 h-4 mr-1" /> View
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Experience Tab */}
        {activeTab === 'experience' && (
          <div className="space-y-6">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <h2 className="text-2xl font-bold text-white">Work Experience</h2>
              <Button onClick={() => openRecordModal('experience')} className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="w-4 h-4 mr-2" /> Add Experience
              </Button>
            </div>
            {experience.length === 0 ? (
              <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                <CardContent className="p-6 text-center py-12">
                  <Building className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">No experience added yet</p>
                </CardContent>
              </Card>
            ) : (
              experience.map((exp) => (
                <Card key={exp.id} className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-white">{exp.position}</h3>
                        <p className="text-blue-400 font-medium">{exp.company}</p>
                        <p className="text-sm text-gray-400">
                          {exp.startDate} - {exp.endDate || 'Present'}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Building className="w-8 h-8 text-gray-600" />
                        <Button variant="outline" size="sm" className="border-red-600 text-red-400 hover:bg-red-900/20" onClick={() => removeExperienceRecord(exp.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <p className="text-gray-300 mb-4">{exp.description}</p>
                    
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-400 mb-2">Technologies Used:</h4>
                      <div className="flex flex-wrap gap-2">
                        {exp.technologies.map((tech, index) => (
                          <Badge key={index} variant="secondary" className="bg-blue-900/30 text-blue-300">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-semibold text-gray-400 mb-2">Key Achievements:</h4>
                      <ul className="space-y-1">
                        {exp.achievements.map((achievement, index) => (
                          <li key={index} className="text-sm text-gray-300 flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                            {achievement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}

        {/* Education Tab */}
        {activeTab === 'education' && (
          <div className="space-y-6">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <h2 className="text-2xl font-bold text-white">Education</h2>
              <Button onClick={() => openRecordModal('education')} className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="w-4 h-4 mr-2" /> Add Education
              </Button>
            </div>
            {education.length === 0 ? (
              <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                <CardContent className="p-6 text-center py-12">
                  <GraduationCap className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">No education added yet</p>
                </CardContent>
              </Card>
            ) : (
              education.map((edu) => (
                <Card key={edu.id} className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-white">{edu.degree} in {edu.field}</h3>
                        <p className="text-blue-400 font-medium">{edu.institution}</p>
                        <p className="text-sm text-gray-400">
                          {edu.startYear} - {edu.endYear || 'Present'}
                          {edu.grade && <span className="ml-2">• {edu.grade}</span>}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-8 h-8 text-gray-600" />
                        <Button variant="outline" size="sm" className="border-red-600 text-red-400 hover:bg-red-900/20" onClick={() => removeEducationRecord(edu.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {edu.description && (
                      <p className="text-gray-300">{edu.description}</p>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}

        {/* Achievements Tab */}
        {activeTab === 'achievements' && (
          <div className="space-y-6">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <h2 className="text-2xl font-bold text-white">Achievements</h2>
              <Button onClick={() => openRecordModal('achievements')} className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="w-4 h-4 mr-2" /> Add Achievement
              </Button>
            </div>
            {achievements.length === 0 ? (
              <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                <CardContent className="p-6 text-center py-12">
                  <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">No achievements added yet</p>
                </CardContent>
              </Card>
            ) : (
              achievements.map((achievement) => {
                const getAchievementIcon = (type: string) => {
                  switch (type) {
                    case 'hackathon': return <Rocket className="w-6 h-6 text-orange-400" />
                    case 'certification': return <BadgeCheck className="w-6 h-6 text-blue-400" />
                    case 'award': return <Trophy className="w-6 h-6 text-yellow-400" />
                    case 'publication': return <BookOpen className="w-6 h-6 text-purple-400" />
                    default: return <Star className="w-6 h-6 text-gray-400" />
                  }
                }
                
                return (
                  <Card key={achievement.id} className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-gray-700/50 rounded-full">
                          {getAchievementIcon(achievement.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-lg font-semibold text-white">{achievement.title}</h3>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-400">{achievement.date}</span>
                              <Button variant="outline" size="sm" className="border-red-600 text-red-400 hover:bg-red-900/20" onClick={() => removeAchievementRecord(achievement.id)}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-gray-300 mb-2">{achievement.description}</p>
                          {achievement.organization && (
                            <p className="text-sm text-blue-400">by {achievement.organization}</p>
                          )}
                          {achievement.url && (
                            <a
                              href={achievement.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 mt-2 text-sm text-blue-400 hover:text-blue-300"
                            >
                              <ExternalLink className="w-3 h-3" />
                              View Certificate
                            </a>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            )}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-blue-900/50 to-blue-800/50 border-blue-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-300 text-sm font-medium">Hackathons</p>
                      <p className="text-2xl font-bold text-white">{profileStats.hackathonsParticipated}</p>
                    </div>
                    <Eye className="w-8 h-8 text-blue-400" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-purple-900/50 to-purple-800/50 border-purple-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-300 text-sm font-medium">Teams Joined</p>
                      <p className="text-2xl font-bold text-white">{profileStats.teamsJoined}</p>
                    </div>
                    <BarChart3 className="w-8 h-8 text-purple-400" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-green-900/50 to-green-800/50 border-green-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-300 text-sm font-medium">Projects</p>
                      <p className="text-2xl font-bold text-white">{projects.length}</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-green-400" />
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-400">
                  <Activity className="w-5 h-5" />
                  Activity Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-orange-900/20 rounded-lg">
                    <Flame className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                    <div className="text-xl font-bold text-orange-400">{profileStats.hackathonsParticipated}</div>
                    <div className="text-sm text-gray-400">Hackathons</div>
                  </div>
                  <div className="text-center p-4 bg-blue-900/20 rounded-lg">
                    <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                    <div className="text-xl font-bold text-blue-400">{profileStats.teamsJoined}</div>
                    <div className="text-sm text-gray-400">Teams Joined</div>
                  </div>
                  <div className="text-center p-4 bg-green-900/20 rounded-lg">
                    <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                    <div className="text-xl font-bold text-green-400">{projects.length}</div>
                    <div className="text-sm text-gray-400">Projects Done</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-900/20 rounded-lg">
                    <Crown className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                    <div className="text-xl font-bold text-yellow-400">{skills.length}</div>
                    <div className="text-sm text-gray-400">Skills</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Record Modals (Experience / Education / Achievements) */}
      {recordModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-gray-900 border border-gray-700 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-800 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">
                {recordModal === 'experience' ? 'Add Work Experience' : recordModal === 'education' ? 'Add Education' : 'Add Achievement'}
              </h2>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white" onClick={() => setRecordModal(null)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <form
              className="p-6 space-y-4"
              onSubmit={(e) => {
                e.preventDefault()
                if (recordModal === 'experience') addExperienceRecord()
                else if (recordModal === 'education') addEducationRecord()
                else addAchievementRecord()
              }}
            >
              {recordModal === 'experience' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-white">Company *</Label>
                      <Input value={recordForm.company} onChange={(e) => setRecordForm({ ...recordForm, company: e.target.value })} className="bg-gray-800/50 border-gray-700 text-white" placeholder="Company name" />
                    </div>
                    <div>
                      <Label className="text-white">Job Title *</Label>
                      <Input value={recordForm.position} onChange={(e) => setRecordForm({ ...recordForm, position: e.target.value })} className="bg-gray-800/50 border-gray-700 text-white" placeholder="e.g. Full Stack Developer" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-white">Start Date</Label>
                      <Input type="date" value={recordForm.startDate} onChange={(e) => setRecordForm({ ...recordForm, startDate: e.target.value })} className="bg-gray-800/50 border-gray-700 text-white" />
                    </div>
                    <div>
                      <Label className="text-white">End Date</Label>
                      <Input type="date" value={recordForm.endDate} onChange={(e) => setRecordForm({ ...recordForm, endDate: e.target.value })} className="bg-gray-800/50 border-gray-700 text-white" />
                    </div>
                  </div>
                  <div>
                    <Label className="text-white">Description</Label>
                    <Textarea rows={3} value={recordForm.description} onChange={(e) => setRecordForm({ ...recordForm, description: e.target.value })} className="bg-gray-800/50 border-gray-700 text-white" placeholder="What did you work on?" />
                  </div>
                  <div>
                    <Label className="text-white">Technologies (comma separated)</Label>
                    <Input value={recordForm.technologies} onChange={(e) => setRecordForm({ ...recordForm, technologies: e.target.value })} className="bg-gray-800/50 border-gray-700 text-white" placeholder="React, Node.js, PostgreSQL" />
                  </div>
                  <div>
                    <Label className="text-white">Key Achievements (separate with |)</Label>
                    <Input value={recordForm.achievements} onChange={(e) => setRecordForm({ ...recordForm, achievements: e.target.value })} className="bg-gray-800/50 border-gray-700 text-white" placeholder="Built scalable API | Reduced load time by 40%" />
                  </div>
                </>
              )}
              {recordModal === 'education' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-white">Institution *</Label>
                      <Input value={recordForm.institution} onChange={(e) => setRecordForm({ ...recordForm, institution: e.target.value })} className="bg-gray-800/50 border-gray-700 text-white" placeholder="College / University" />
                    </div>
                    <div>
                      <Label className="text-white">Degree *</Label>
                      <Input value={recordForm.degree} onChange={(e) => setRecordForm({ ...recordForm, degree: e.target.value })} className="bg-gray-800/50 border-gray-700 text-white" placeholder="B.Tech / B.E / B.Sc" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-white">Field of Study</Label>
                      <Input value={recordForm.field} onChange={(e) => setRecordForm({ ...recordForm, field: e.target.value })} className="bg-gray-800/50 border-gray-700 text-white" placeholder="Computer Science" />
                    </div>
                    <div>
                      <Label className="text-white">Grade / CGPA</Label>
                      <Input value={recordForm.grade} onChange={(e) => setRecordForm({ ...recordForm, grade: e.target.value })} className="bg-gray-800/50 border-gray-700 text-white" placeholder="8.5 CGPA" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-white">Start Year</Label>
                      <Input type="number" value={recordForm.startYear} onChange={(e) => setRecordForm({ ...recordForm, startYear: e.target.value })} className="bg-gray-800/50 border-gray-700 text-white" placeholder="2020" />
                    </div>
                    <div>
                      <Label className="text-white">End Year</Label>
                      <Input type="number" value={recordForm.endYear} onChange={(e) => setRecordForm({ ...recordForm, endYear: e.target.value })} className="bg-gray-800/50 border-gray-700 text-white" placeholder="2024" />
                    </div>
                  </div>
                  <div>
                    <Label className="text-white">Description (Optional)</Label>
                    <Textarea rows={3} value={recordForm.description} onChange={(e) => setRecordForm({ ...recordForm, description: e.target.value })} className="bg-gray-800/50 border-gray-700 text-white" placeholder="Clubs, projects, extras..." />
                  </div>
                </>
              )}
              {recordModal === 'achievements' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-white">Title *</Label>
                      <Input value={recordForm.title} onChange={(e) => setRecordForm({ ...recordForm, title: e.target.value })} className="bg-gray-800/50 border-gray-700 text-white" placeholder="e.g. Winner - Hackathon X" />
                    </div>
                    <div>
                      <Label className="text-white">Date</Label>
                      <Input type="date" value={recordForm.date} onChange={(e) => setRecordForm({ ...recordForm, date: e.target.value })} className="bg-gray-800/50 border-gray-700 text-white" />
                    </div>
                  </div>
                  <div>
                    <Label className="text-white">Description</Label>
                    <Textarea rows={3} value={recordForm.description} onChange={(e) => setRecordForm({ ...recordForm, description: e.target.value })} className="bg-gray-800/50 border-gray-700 text-white" placeholder="What did you achieve?" />
                  </div>
                  <div>
                    <Label className="text-white">Type</Label>
                    <Select value={recordForm.type} onValueChange={(value) => setRecordForm({ ...recordForm, type: value })}>
                      <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white w-full"><SelectValue placeholder="Type" /></SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="hackathon" className="text-white">Hackathon</SelectItem>
                        <SelectItem value="certification" className="text-white">Certification</SelectItem>
                        <SelectItem value="award" className="text-white">Award</SelectItem>
                        <SelectItem value="publication" className="text-white">Publication</SelectItem>
                        <SelectItem value="other" className="text-white">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-white">Organization</Label>
                      <Input value={recordForm.organization} onChange={(e) => setRecordForm({ ...recordForm, organization: e.target.value })} className="bg-gray-800/50 border-gray-700 text-white" placeholder="Issued by" />
                    </div>
                    <div>
                      <Label className="text-white">URL</Label>
                      <Input value={recordForm.url} onChange={(e) => setRecordForm({ ...recordForm, url: e.target.value })} className="bg-gray-800/50 border-gray-700 text-white" placeholder="https://..." />
                    </div>
                  </div>
                </>
              )}

              <div className="flex gap-3 pt-4 border-t border-gray-800">
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                  <CheckCircle className="w-4 h-4 mr-2" /> Save
                </Button>
                <Button type="button" variant="outline" onClick={() => setRecordModal(null)} className="border-gray-600 text-gray-300 hover:text-white hover:bg-gray-800 bg-transparent">Cancel</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modals */}
      {showEditProfile && (
        <EditProfileModal user={user} onClose={() => setShowEditProfile(false)} onSave={handleUpdateProfile} />
      )}

      {showAddSkill && (
        <AddSkillModal
          existingSkills={skills.map((skill) => skill.name)}
          onClose={() => setShowAddSkill(false)}
          onAdd={handleAddSkill}
        />
      )}

      {showAddProject && (
        <AddProjectModal isOpen={showAddProject} onClose={() => setShowAddProject(false)} onAdd={handleAddProject} />
      )}
    </div>
  )
}