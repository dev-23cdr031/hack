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
import type { User as UserType, Project as ProjectType } from "@/lib/types"
import {
  Settings,
  Edit,
  Plus,
  Github,
  Linkedin,
  ExternalLink,
  MapPin,
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
  Target,
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
  MapPinIcon,
  BadgeCheck,
  Flame,
  Sparkles,
  Rocket,
  Crown,
  Medal,
  ArrowLeft
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
  
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [showAddSkill, setShowAddSkill] = useState(false)
  const [showAddProject, setShowAddProject] = useState(false)
  const [showAddEducation, setShowAddEducation] = useState(false)
  const [showAddExperience, setShowAddExperience] = useState(false)
  const [showAddAchievement, setShowAddAchievement] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [skillFilter, setSkillFilter] = useState('all')
  const [projectFilter, setProjectFilter] = useState('all')

  // Get current user from localStorage (from login)
  useEffect(() => {
    try {
      console.log('Checking localStorage for user data...')
      const storedUserId = localStorage.getItem('userId')
      const userData = localStorage.getItem('user')
      console.log('Raw user ID from localStorage:', storedUserId)
      console.log('Raw user data from localStorage:', userData)

      if (storedUserId) {
        // If we have the dedicated userId key, prefer it as the source of truth
        console.log('Found stored userId:', storedUserId)
        fetchUserProfile(storedUserId)
        return
      }

      if (userData) {
        const currentUser = JSON.parse(userData)
        console.log('Parsed user data:', currentUser)

        if (currentUser && currentUser.id) {
          fetchUserProfile(currentUser.id)
          return
        }

        console.error('No user ID found in stored user data')
        setError('Invalid user data. Please log in again.')
        setLoading(false)
        return
      }

      console.log('No user data in localStorage')
      setError('Please log in to view your profile')
      setLoading(false)
    } catch (err) {
      console.error('Error parsing user data from localStorage:', err)
      setError('Invalid user data. Please log in again.')
      setLoading(false)
    }
  }, [])

  const fetchUserProfile = async (userId: string) => {
    try {
      setLoading(true)
      setError(null)
      console.log('Fetching profile for user ID:', userId)

      // Fetch user data
      console.log('Fetching user data...')
      const userResponse = await fetch(`/api/users/${userId}`)
      console.log('User API response status:', userResponse.status)

      if (!userResponse.ok) {
        // If user not found with the provided ID, try using a valid mock user ID
        if (userResponse.status === 404) {
          const localUserData = localStorage.getItem('user')
          const localUser = localUserData ? JSON.parse(localUserData) : null

          if (localUser?.id === userId) {
            console.log('Using locally stored profile for user ID:', userId)
            const sanitizedLocalUser = sanitizeCurrentUserProfile(localUser)
            localStorage.setItem('user', JSON.stringify(sanitizedLocalUser))
            setUser(sanitizedLocalUser)
            if (localUser.skills && Array.isArray(localUser.skills)) {
              setSkills(localUser.skills.map((skill: string, index: number) => ({
                id: `skill-${index}`,
                name: skill,
                level: Math.floor(Math.random() * 30) + 70,
                category: getSkillCategory(skill),
                yearsOfExperience: Math.floor(Math.random() * 5) + 1,
                endorsed: Math.random() > 0.5
              })))
            }
            loadMockEducation()
            loadMockExperience()
            loadMockAchievements()
            loadMockStats()
            setProjects([])
            return
          }

          console.log('User not found with ID:', userId)
        }
        
        const errorText = await userResponse.text()
        console.error('User API error response:', errorText)
        throw new Error(`Failed to fetch user profile: ${userResponse.status} ${errorText}`)
      }

      const userData = await userResponse.json()
      console.log('User data received:', userData)
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
          level: Math.floor(Math.random() * 30) + 70, // Random level between 70-100
          category: getSkillCategory(skill),
          yearsOfExperience: Math.floor(Math.random() * 5) + 1,
          endorsed: Math.random() > 0.5
        }))
        setSkills(skillsWithLevels)
        console.log('Skills loaded:', skillsWithLevels.length)
      } else {
        setSkills([])
        console.log('No skills found')
      }
      
      // Load mock data for enhanced profile sections
      loadMockEducation()
      loadMockExperience()
      loadMockAchievements()
      loadMockStats()

      // Fetch user projects
      console.log('Fetching user projects...')
      const projectsResponse = await fetch(`/api/projects?user_id=${userId}`)
      console.log('Projects API response status:', projectsResponse.status)

      if (projectsResponse.ok) {
        const projectsData = await projectsResponse.json()
        console.log('Projects data received:', projectsData.length, 'projects')
        setProjects(projectsData)
      } else {
        console.log('Failed to fetch projects, but continuing...')
        setProjects([])
      }

      console.log('Profile loading completed successfully')

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load profile'
      console.error('Error fetching profile:', err)
      setError(errorMessage)
    } finally {
      setLoading(false)
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
  
  const loadMockEducation = () => {
    const mockEducation: Education[] = [
      {
        id: 'edu-1',
        institution: 'Stanford University',
        degree: 'Bachelor of Science',
        field: 'Computer Science',
        startYear: 2020,
        endYear: 2024,
        grade: '3.8 GPA',
        description: 'Specialized in AI/ML and Software Engineering. Active member of the Computer Science Society.'
      },
      {
        id: 'edu-2',
        institution: 'KEC Online',
        degree: 'Certificate',
        field: 'Full Stack Development',
        startYear: 2023,
        endYear: 2023,
        grade: 'Distinction',
        description: 'Comprehensive program covering modern web technologies and best practices.'
      }
    ]
    setEducation(mockEducation)
  }
  
  const loadMockExperience = () => {
    const mockExperience: Experience[] = [
      {
        id: 'exp-1',
        company: 'TechCorp Inc.',
        position: 'Software Engineering Intern',
        startDate: '2023-06',
        endDate: '2023-08',
        description: 'Developed and maintained web applications using React and Node.js. Collaborated with senior developers on feature implementation.',
        technologies: ['React', 'Node.js', 'MongoDB', 'AWS'],
        achievements: [
          'Improved application performance by 25%',
          'Implemented new user authentication system',
          'Guideed 2 junior interns'
        ]
      },
      {
        id: 'exp-2',
        company: 'StartupXYZ',
        position: 'Frontend Developer',
        startDate: '2023-09',
        description: 'Currently working on building responsive web applications and improving user experience.',
        technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Next.js'],
        achievements: [
          'Led UI/UX redesign project',
          'Reduced page load time by 40%',
          'Implemented accessibility features'
        ]
      }
    ]
    setExperience(mockExperience)
  }
  
  const loadMockAchievements = () => {
    const mockAchievements: Achievement[] = [
      {
        id: 'ach-1',
        title: 'HackConnect 2024 Winner',
        description: 'First place in the AI/ML category for developing an innovative healthcare solution.',
        date: '2024-03-15',
        type: 'hackathon',
        organization: 'HackConnect',
        url: 'https://hackconnect.com/winners/2024'
      },
      {
        id: 'ach-2',
        title: 'AWS Certified Developer',
        description: 'Associate level certification demonstrating proficiency in AWS services.',
        date: '2024-01-20',
        type: 'certification',
        organization: 'Amazon Web Services'
      },
      {
        id: 'ach-3',
        title: 'Best Innovation Award',
        description: 'Recognized for outstanding innovation in sustainable technology solutions.',
        date: '2023-11-10',
        type: 'award',
        organization: 'Tech Innovation Summit'
      }
    ]
    setAchievements(mockAchievements)
  }
  
  const loadMockStats = () => {
    const mockStats: ProfileStats = {
      profileViews: Math.floor(Math.random() * 1000) + 500,
      projectViews: Math.floor(Math.random() * 2000) + 1000,
      skillEndorsements: Math.floor(Math.random() * 50) + 25,
      hackathonsParticipated: Math.floor(Math.random() * 10) + 5,
      teamsJoined: Math.floor(Math.random() * 15) + 8,
      projectsCompleted: Math.floor(Math.random() * 20) + 10
    }
    setProfileStats(mockStats)
  }

  const handleUpdateProfile = async (updatedData: Partial<UserType>) => {
    if (!user) return

    try {
      console.log('Updating profile with data:', updatedData)

      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      })

      console.log('Update response status:', response.status)

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Update failed:', errorData)
        throw new Error(errorData.error || 'Failed to update profile')
      }

      const updatedUser = await response.json()
      console.log('Profile updated successfully:', updatedUser.name)

      setUser(updatedUser)

      // Update localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser))
      localStorage.setItem('userId', updatedUser.id)

      setShowEditProfile(false)

      // Show success message
      alert('Profile updated successfully!')

    } catch (err) {
      console.error('Error updating profile:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to update profile'
      alert(`Failed to update profile: ${errorMessage}`)
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
        yearsOfExperience: Math.floor(level / 20) + 1, // Rough estimate based on level
        endorsed: false
      }
      setSkills((prev) => [...prev, newSkill])
      setShowAddSkill(false)
      
      // Show success message
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
      // Clean data mapping for API
      const apiData = {
        title: projectData.title,
        description: projectData.description,
        technologies: projectData.technologies,
        github_url: projectData.githubUrl || '',
        demo_url: projectData.liveUrl || '',
        user_id: user.id
      }

      console.log('Creating project with data:', apiData)

      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apiData)
      })

      console.log('Project creation response status:', response.status)

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Project creation failed:', errorData)
        throw new Error(errorData.error || 'Failed to create project')
      }

      const newProject = await response.json()
      console.log('Project created successfully:', newProject.title)

      setProjects((prev) => [...prev, newProject])
      setShowAddProject(false)

      // Show success message
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

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB. Please choose a smaller image.')
      return
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      alert('Only image files (JPEG, PNG, GIF, WebP) are allowed.')
      return
    }

    try {
      setUploading(true)
      console.log('Starting avatar upload for user:', user.id)

      const formData = new FormData()
      formData.append('file', file)
      formData.append('userId', user.id)

      console.log('Uploading file:', file.name, 'Size:', file.size, 'Type:', file.type)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      console.log('Upload response status:', response.status)

      const data = await response.json()
      console.log('Upload response data:', data)

      if (!response.ok && !data.success) {
        throw new Error(data.error || 'Failed to upload image')
      }

      // Update user with new avatar URL
      setUser(prev => prev ? { ...prev, avatar_url: data.url } : null)

      // Update localStorage
      const updatedUser = { ...user, avatar_url: data.url }
      localStorage.setItem('user', JSON.stringify(updatedUser))

      // Show success message with appropriate context
      if (data.placeholder) {
        alert('Upload service is currently unavailable. A placeholder avatar has been assigned.')
      } else if (data.fallback) {
        alert('Profile photo uploaded successfully! (Saved locally)')
      } else if (data.error) {
        alert('Upload encountered an issue, but a default avatar has been assigned.')
      } else {
        alert('Profile photo uploaded successfully!')
      }

      console.log('Avatar upload completed successfully')

    } catch (err) {
      console.error('Error uploading avatar:', err)
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      
      // Provide more helpful error messages
      if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
        alert('Network error occurred. Please check your internet connection and try again.')
      } else if (errorMessage.includes('size')) {
        alert('File is too large. Please choose an image smaller than 5MB.')
      } else if (errorMessage.includes('type') || errorMessage.includes('format')) {
        alert('Invalid file format. Please choose a JPEG, PNG, GIF, or WebP image.')
      } else {
        alert(`Failed to upload image: ${errorMessage}. Please try again.`)
      }
    } finally {
      setUploading(false)
      // Clear the input so the same file can be selected again if needed
      event.target.value = ''
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center">
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center">
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
            <Button
              onClick={() => {
                // Create test user for debugging - using a valid mock user ID
                const testUser = {
                  id: 'dev-dharrshan',
                  name: 'Dev Dharrshan',
                  email: 'devdharrshan@hackconnect.dev',
                  avatar_url: '/team/dev-dharrshan.jpg'
                }
                localStorage.setItem('user', JSON.stringify(testUser))
                localStorage.setItem('userId', testUser.id)
                window.location.reload()
              }}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent w-full"
            >
              Use Demo Account
            </Button>
            <p className="text-xs text-gray-500 mt-4">
              Note: If you're seeing a "User not found" error, your account may not be properly set up.
              Click "Use Demo Account" to view a sample profile.
            </p>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
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
              <Eye className="w-4 h-4" />
              {profileStats.profileViews} profile views this month
              <Sparkles className="w-4 h-4 text-yellow-400 ml-2" />
              <span className="text-yellow-400">Premium Member</span>
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
              <Download className="w-4 h-4 mr-2" />
              Export CV
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
            { id: 'experience', label: 'Experience', icon: Building },
            { id: 'education', label: 'Education', icon: GraduationCap },
            { id: 'achievements', label: 'Achievements', icon: Trophy },
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

                <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-6">
                  <div className="flex items-center gap-2 text-gray-300">
                    <Mail className="w-4 h-4" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <Calendar className="w-4 h-4" />
                    <span>Available for Projects</span>
                  </div>
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
                  <div className="text-2xl font-bold text-yellow-400">4.8</div>
                  <div className="text-sm text-gray-400">Rating</div>
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

        {/* Experience Tab */}
        {activeTab === 'experience' && (
          <div className="space-y-6">
            {experience.map((exp) => (
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
                    <Building className="w-8 h-8 text-gray-600" />
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
            ))}
          </div>
        )}

        {/* Education Tab */}
        {activeTab === 'education' && (
          <div className="space-y-6">
            {education.map((edu) => (
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
                    <GraduationCap className="w-8 h-8 text-gray-600" />
                  </div>
                  
                  {edu.description && (
                    <p className="text-gray-300">{edu.description}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Achievements Tab */}
        {activeTab === 'achievements' && (
          <div className="space-y-6">
            {achievements.map((achievement) => {
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
                          <span className="text-xs text-gray-400">{achievement.date}</span>
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
            })}
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
                      <p className="text-blue-300 text-sm font-medium">Profile Views</p>
                      <p className="text-2xl font-bold text-white">{profileStats.profileViews}</p>
                      <p className="text-xs text-blue-200">+12% from last month</p>
                    </div>
                    <Eye className="w-8 h-8 text-blue-400" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-purple-900/50 to-purple-800/50 border-purple-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-300 text-sm font-medium">Project Views</p>
                      <p className="text-2xl font-bold text-white">{profileStats.projectViews}</p>
                      <p className="text-xs text-purple-200">+8% from last month</p>
                    </div>
                    <BarChart3 className="w-8 h-8 text-purple-400" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-green-900/50 to-green-800/50 border-green-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-300 text-sm font-medium">Skill Endorsements</p>
                      <p className="text-2xl font-bold text-white">{profileStats.skillEndorsements}</p>
                      <p className="text-xs text-green-200">+15% from last month</p>
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
                    <div className="text-xl font-bold text-green-400">{profileStats.projectsCompleted}</div>
                    <div className="text-sm text-gray-400">Projects Done</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-900/20 rounded-lg">
                    <Crown className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                    <div className="text-xl font-bold text-yellow-400">4.8</div>
                    <div className="text-sm text-gray-400">Avg Rating</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

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
