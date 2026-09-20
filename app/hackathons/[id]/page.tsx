'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  ArrowLeft, 
  Loader2, 
  Trophy,
  Award,
  BookOpen,
  HelpCircle,
  Link as LinkIcon,
  ExternalLink,
  User,
  Edit,
  Trash2
} from "lucide-react"
import type { Hackathon } from "@/lib/types"
import { HackathonRegistrationForm, RegistrationFormData } from "@/components/hackathon-registration-form"

interface Registration {
  id: string
  hackathon_id: string
  user_id: string
  joined_at: string
  full_name?: string
  email?: string
  phone?: string
  city?: string
  state?: string
  country?: string
  occupation?: string
  organization?: string
  users?: { id: string; name: string; email: string; avatar_url?: string }
}

export default function HackathonDetailsPage() {
  const params = useParams() as { id?: string }
  const router = useRouter()
  const id = params?.id as string

  const [hackathon, setHackathon] = useState<Hackathon | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [joining, setJoining] = useState(false)
  const [registered, setRegistered] = useState(false)
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false)
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [showRegistrations, setShowRegistrations] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [isCreator, setIsCreator] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (!id) return
    let ignore = false
    ;(async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch(`/api/hackathons/${id}`)
        const data = await res.json()
        if (!res.ok) throw new Error(data?.error || 'Failed to load hackathon')
        if (!ignore) setHackathon(data.hackathon)
      } catch (e: any) {
        setError(e?.message || 'Failed to load hackathon')
      } finally {
        if (!ignore) setLoading(false)
      }
    })()
    return () => { ignore = true }
  }, [id])

  // Get current user and check if they're the creator
  useEffect(() => {
    try {
      const raw = localStorage.getItem('user')
      const user = raw ? JSON.parse(raw) : null
      const userId = user?.id || localStorage.getItem('userId')
      setCurrentUserId(userId)
    } catch {}
  }, [])

  useEffect(() => {
    if (hackathon && currentUserId) {
      setIsCreator(hackathon.created_by === currentUserId)
    }
  }, [hackathon, currentUserId])

  // Fetch registrations for this hackathon
  useEffect(() => {
    if (!id) return
    let ignore = false
    ;(async () => {
      try {
        const res = await fetch(`/api/hackathons/registrations?hackathon_id=${id}`)
        const data = await res.json()
        if (!ignore && data.registrations) {
          setRegistrations(data.registrations)
        }
      } catch (e) {
        console.error('Error fetching registrations:', e)
      }
    })()
    return () => { ignore = true }
  }, [id])

  const handleOpenRegistration = () => {
    setIsRegistrationOpen(true)
  }
  
  const handleCloseRegistration = () => {
    setIsRegistrationOpen(false)
  }
  
  const handleSubmitRegistration = async (formData: RegistrationFormData) => {
    if (!id) return
    try {
      setJoining(true)
      console.log("Registration form data:", formData)

      // Try to read local user; backend can auto-provision if missing
      let userId: string | null = null
      try {
        const raw = localStorage.getItem('user')
        const user = raw ? JSON.parse(raw) : null
        userId = user?.id || null
      } catch {}

      const res = await fetch(`/api/hackathons/${id}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId,
          hackathonTitle: hackathon?.title,
          hackathonDescription: hackathon?.description,
          hackathonStartDate: hackathon?.start_date,
          hackathonEndDate: hackathon?.end_date,
          hackathonLocation: hackathon?.location,
          hackathonType: hackathon?.type,
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          location: {
            city: formData.city,
            state: formData.state,
            country: formData.country
          },
          professional: {
            occupation: formData.occupation,
            organization: formData.organization,
            experience: formData.experience,
            skills: formData.skills
          },
          preferences: {
            interests: formData.interests,
            dietaryRestrictions: formData.dietaryRestrictions,
            tshirtSize: formData.tshirtSize,
            howDidYouHear: formData.howDidYouHear
          }
        })
      })
      const data = await res.json()
      
      if (!res.ok) throw new Error(data?.error || 'Registration failed')

      // Save resolved/created auth user id if provided
      try {
        if (data?.authUserId && (!userId || userId !== data.authUserId)) {
          localStorage.setItem('user', JSON.stringify({ id: data.authUserId }))
        }
      } catch {}

      // Registration saved to Supabase, will appear on admin dashboard automatically

      // Update the UI to reflect registration
      if (hackathon) {
        setHackathon({
          ...hackathon,
          current_participants: hackathon.current_participants + 1
        })
      }
      
      // Mark as registered
      setRegistered(true)
      
      // Close the registration form
      setIsRegistrationOpen(false)
      
      // Show success message
      alert(data?.message || 'Registered successfully!')
    } catch (e: any) {
      console.error('Registration error:', e)
      alert(e?.message || 'Registration failed')
    } finally {
      setJoining(false)
    }
  }
  
  const handleRegister = () => {
    handleOpenRegistration()
  }

  const handleDelete = async () => {
    if (!hackathon || !currentUserId) return
    if (!confirm(`Are you sure you want to delete "${hackathon.title}"? This action cannot be undone.`)) return
    
    try {
      setDeleting(true)
      const res = await fetch(`/api/hackathons/${hackathon.id}?requester_id=${currentUserId}`, {
        method: 'DELETE'
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Failed to delete hackathon')
      alert('Hackathon deleted successfully')
      router.push('/hackathons')
    } catch (e: any) {
      alert(e?.message || 'Failed to delete hackathon')
      console.error('Error deleting hackathon:', e)
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="max-w-7xl mx-auto p-6">
          <Button variant="ghost" className="text-gray-300" asChild>
            <Link href="/hackathons"><ArrowLeft className="w-4 h-4 mr-2"/> Back</Link>
          </Button>
          <div className="py-20 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-400"/>
            <p className="text-gray-400">Loading hackathon details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !hackathon) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="max-w-7xl mx-auto p-6">
          <Button variant="ghost" className="text-gray-300" asChild>
            <Link href="/hackathons"><ArrowLeft className="w-4 h-4 mr-2"/> Back</Link>
          </Button>
          <div className="py-20 text-center">
            <p className="text-red-400">{error || 'Hackathon not found'}</p>
          </div>
        </div>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch {
      return dateString
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section with Gradient Background */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-purple-900/20 z-0"></div>
        
        {/* Navigation Bar */}
        <div className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-sm border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <Link href="/hackathons" className="text-gray-300 hover:text-white flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Hackathons</span>
            </Link>
            
            <Link href="/" className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              HackConnect
            </Link>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Image and Basic Info */}
            <div className="lg:col-span-1">
              <div className="bg-gray-900 rounded-xl overflow-hidden shadow-xl border border-gray-800">
                <div className="aspect-video relative">
                  <Image
                    src={hackathon.image_url || '/placeholder-logo.svg'}
                    alt={hackathon.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <div className="bg-blue-900/30 p-1.5 rounded-md">
                      <Calendar className="w-4 h-4 text-blue-400" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-gray-400 text-xs">Dates</span>
                      <span>
                        {formatDate(hackathon.start_date)} - {formatDate(hackathon.end_date)}
                      </span>
                    </div>
                  </div>
                  
                  {hackathon.location && (
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <div className="bg-green-900/30 p-1.5 rounded-md">
                        <MapPin className="w-4 h-4 text-green-400" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-gray-400 text-xs">Location</span>
                        <span>{hackathon.location}</span>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <div className="bg-amber-900/30 p-1.5 rounded-md">
                      <Users className="w-4 h-4 text-amber-400" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-gray-400 text-xs">Participants</span>
                      <span>
                        {hackathon.current_participants} registered
                        {hackathon.max_participants ? ` / ${hackathon.max_participants} max` : ''}
                      </span>
                    </div>
                  </div>
                  
                  {hackathon.prize_amount && (
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <div className="bg-yellow-900/30 p-1.5 rounded-md">
                        <Trophy className="w-4 h-4 text-yellow-400" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-gray-400 text-xs">Prize Pool</span>
                        <span className="font-semibold text-yellow-300">
                          ${typeof hackathon.prize_amount === 'number' 
                            ? hackathon.prize_amount.toLocaleString() 
                            : hackathon.prize_amount}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  <div className="pt-4 space-y-3">
                    <Button 
                      className={`w-full ${registered 
                        ? 'bg-green-600 hover:bg-green-700' 
                        : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                      }`}
                      onClick={handleRegister}
                      disabled={joining || hackathon.status === 'past' || registered}
                    >
                      {joining ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Registering...
                        </>
                      ) : registered ? (
                        <>
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                          Registered
                        </>
                      ) : (
                        'Register Now'
                      )}
                    </Button>
                    
                    {/* View Registrations Button */}
                    <Button
                      variant="outline"
                      className="w-full border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                      onClick={() => setShowRegistrations(!showRegistrations)}
                    >
                      <Users className="w-4 h-4 mr-2" />
                      {showRegistrations ? 'Hide Registrations' : `View Registrations (${registrations.length})`}
                    </Button>
                    
                    {/* Registration Form Modal */}
                    <HackathonRegistrationForm
                      isOpen={isRegistrationOpen}
                      onClose={handleCloseRegistration}
                      onSubmit={handleSubmitRegistration}
                      hackathonId={hackathon.id}
                      hackathonTitle={hackathon.title}
                    />
                  </div>
                  
                  {/* Registrations List */}
                  {showRegistrations && (
                    <div className="mt-4 bg-gray-800/50 rounded-lg border border-gray-700 p-4">
                      <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                        <Users className="w-4 h-4 text-blue-400" />
                        Registered Participants ({registrations.length})
                      </h3>
                      {registrations.length === 0 ? (
                        <p className="text-gray-400 text-sm">No registrations yet. Be the first to register!</p>
                      ) : (
                        <div className="space-y-2 max-h-[300px] overflow-y-auto">
                          {registrations.map((reg) => (
                            <div key={reg.id} className="flex items-center gap-3 p-2 bg-gray-900/50 rounded-md">
                              <div className="w-8 h-8 rounded-full bg-blue-900/50 flex items-center justify-center flex-shrink-0">
                                <User className="w-4 h-4 text-blue-400" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">
                                  {reg.full_name || reg.users?.name || 'Anonymous'}
                                </p>
                                <p className="text-xs text-gray-400 truncate">
                                  {reg.email || reg.users?.email || ''}
                                  {reg.occupation ? ` • ${reg.occupation}` : ''}
                                </p>
                              </div>
                              <span className="text-xs text-gray-500 flex-shrink-0">
                                {new Date(reg.joined_at).toLocaleDateString()}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Right Column - Details */}
            <div className="lg:col-span-2">
              <div className="bg-gray-900 rounded-xl p-8 border border-gray-800 shadow-xl">
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge 
                      className={`
                        ${hackathon.status === 'upcoming' ? 'bg-blue-900/50 text-blue-300 border-blue-700/50' : ''}
                        ${hackathon.status === 'ongoing' ? 'bg-green-900/50 text-green-300 border-green-700/50' : ''}
                        ${hackathon.status === 'past' ? 'bg-gray-800/50 text-gray-300 border-gray-700/50' : ''}
                      `}
                    >
                      {hackathon.status === 'upcoming' && 'Upcoming'}
                      {hackathon.status === 'ongoing' && 'Ongoing'}
                      {hackathon.status === 'past' && 'Past'}
                    </Badge>
                    
                    {hackathon.type && (
                      <Badge className="bg-blue-900/70 text-blue-200 border-blue-700/50 font-medium">
                        {hackathon.type === 'online' && '🌐 Online'}
                        {hackathon.type === 'in-person' && '🏛️ In-Person'}
                        {hackathon.type === 'hybrid' && '🔄 Hybrid'}
                      </Badge>
                    )}
                    
                    {hackathon.format && (
                      <Badge className="bg-indigo-900/70 text-indigo-200 border-indigo-700/50 font-medium">
                        {hackathon.format === 'competitive' && '🏆 Competitive'}
                        {hackathon.format === 'learning' && '📚 Learning'}
                        {hackathon.format === 'community' && '👥 Community'}
                        {hackathon.format === 'corporate' && '🏢 Corporate'}
                      </Badge>
                    )}
                  </div>
                  
                  <h1 className="text-3xl md:text-4xl font-bold mb-4">{hackathon.title}</h1>
                  
                  {/* Creator Info */}
                  {hackathon.creator && (
                    <div className="flex items-center gap-2 mb-4 bg-gray-800/50 rounded-lg p-3 border border-gray-700/50 w-fit">
                      <div className="w-8 h-8 rounded-full bg-blue-900/50 flex items-center justify-center overflow-hidden">
                        {hackathon.creator.avatar_url && hackathon.creator.avatar_url !== '/placeholder-user.jpg' ? (
                          <img src={hackathon.creator.avatar_url} alt={hackathon.creator.name} className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-4 h-4 text-blue-400" />
                        )}
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Hosted by</p>
                        <p className="text-sm font-medium text-blue-400">{hackathon.creator.name}</p>
                      </div>
                    </div>
                  )}
                  
                  <p className="text-gray-300 leading-relaxed mb-6">
                    {hackathon.description}
                  </p>
                  
                  {/* Creator Actions */}
                  {isCreator && (
                    <div className="flex gap-3 mb-6">
                      <Button
                        variant="outline"
                        className="border-blue-600 text-blue-400 hover:bg-blue-900/20"
                        onClick={() => window.location.href = `/admin`}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit in Admin
                      </Button>
                      <Button 
                        variant="outline" 
                        className="border-red-600 text-red-400 hover:bg-red-900/20"
                        onClick={handleDelete}
                        disabled={deleting}
                      >
                        {deleting ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4 mr-2" />
                        )}
                        Delete
                      </Button>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {hackathon.skill_level && (
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400">Skill Level:</span>
                        <span className="bg-green-900/70 px-2 py-1 rounded text-sm text-green-200 border border-green-700/50 font-medium">
                          {hackathon.skill_level === 'beginner' && '👶 Beginner'}
                          {hackathon.skill_level === 'intermediate' && '👨‍💻 Intermediate'}
                          {hackathon.skill_level === 'advanced' && '🧙‍♂️ Advanced'}
                          {hackathon.skill_level === 'all-levels' && '👥 All Levels'}
                        </span>
                      </div>
                    )}
                    
                    {hackathon.eligibility && (
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400">Eligibility:</span>
                        <span className="bg-purple-900/70 px-2 py-1 rounded text-sm text-purple-200 border border-purple-700/50 font-medium">
                          {hackathon.eligibility}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {hackathon.themes && hackathon.themes.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-medium mb-3 text-gray-200">Themes</h3>
                      <div className="flex flex-wrap gap-2">
                        {hackathon.themes.map((theme, index) => (
                          <Badge 
                            key={index} 
                            variant="secondary" 
                            className="text-sm bg-indigo-900/70 text-indigo-200 hover:bg-indigo-800 border border-indigo-700/50 transition-colors"
                          >
                            {theme}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <Tabs defaultValue="rules" className="w-full">
                  <TabsList className="grid grid-cols-4 mb-6 bg-gray-800/50">
                    <TabsTrigger value="rules">Rules</TabsTrigger>
                    <TabsTrigger value="schedule">Schedule</TabsTrigger>
                    <TabsTrigger value="judges">Judges</TabsTrigger>
                    <TabsTrigger value="faq">FAQ</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="rules" className="space-y-4">
                    <Card className="bg-gray-800/30 border-gray-700">
                      <CardHeader>
                        <CardTitle className="text-xl text-white flex items-center gap-2">
                          <BookOpen className="w-5 h-5 text-blue-400" />
                          Hackathon Rules
                        </CardTitle>
                        <CardDescription>
                          Please review all rules carefully before participating
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {hackathon.rules && hackathon.rules.length > 0 ? (
                          <ul className="space-y-3">
                            {hackathon.rules.map((rule, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <span className="text-blue-400 font-bold mt-0.5">•</span>
                                <span className="text-gray-300">{rule}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-gray-400">No specific rules have been provided for this hackathon.</p>
                        )}
                      </CardContent>
                    </Card>
                    
                    {hackathon.resources && hackathon.resources.length > 0 && (
                      <Card className="bg-gray-800/30 border-gray-700">
                        <CardHeader>
                          <CardTitle className="text-xl text-white flex items-center gap-2">
                            <LinkIcon className="w-5 h-5 text-blue-400" />
                            Resources
                          </CardTitle>
                          <CardDescription>
                            Helpful resources for participants
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-3">
                            {hackathon.resources.map((resource, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <span className="text-blue-400 font-bold mt-0.5">•</span>
                                <a 
                                  href={resource.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-blue-400 hover:text-blue-300 flex items-center gap-1"
                                >
                                  {resource.title}
                                  <ExternalLink className="w-3 h-3 inline" />
                                  <span className="text-gray-500 text-sm ml-1">({resource.type})</span>
                                </a>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="schedule" className="space-y-4">
                    <Card className="bg-gray-800/30 border-gray-700">
                      <CardHeader>
                        <CardTitle className="text-xl text-white flex items-center gap-2">
                          <Calendar className="w-5 h-5 text-blue-400" />
                          Event Schedule
                        </CardTitle>
                        <CardDescription>
                          Timeline of activities during the hackathon
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {hackathon.schedule && hackathon.schedule.length > 0 ? (
                          <div className="relative">
                            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-700"></div>
                            <ul className="space-y-6">
                              {hackathon.schedule.map((item, index) => (
                                <li key={index} className="flex items-start gap-2 sm:gap-4 relative">
                                  <div className="absolute left-4 top-2 w-2 h-2 rounded-full bg-blue-500 -translate-x-[5px]"></div>
                                  <div className="min-w-[90px] sm:min-w-[140px] text-xs sm:text-sm text-gray-400 pt-0.5 pl-6 sm:pl-8">
                                    {item.time}
                                  </div>
                                  <div className="flex-1 min-w-0 bg-gray-800/50 p-2 sm:p-3 rounded-md border border-gray-700/50">
                                    {item.activity}
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : (
                          <p className="text-gray-400">No schedule has been provided for this hackathon.</p>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="judges" className="space-y-4">
                    <Card className="bg-gray-800/30 border-gray-700">
                      <CardHeader>
                        <CardTitle className="text-xl text-white flex items-center gap-2">
                          <Award className="w-5 h-5 text-blue-400" />
                          Judges
                        </CardTitle>
                        <CardDescription>
                          Meet our panel of expert judges
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {hackathon.judges && hackathon.judges.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {hackathon.judges.map((judge, index) => (
                              <div key={index} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                                <div className="flex items-center gap-3 mb-3">
                                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-700 flex-shrink-0">
                                    {judge.image_url ? (
                                      <Image 
                                        src={judge.image_url} 
                                        alt={judge.name} 
                                        width={48} 
                                        height={48} 
                                        className="object-cover w-full h-full"
                                      />
                                    ) : (
                                      <User className="w-6 h-6 m-3 text-gray-400" />
                                    )}
                                  </div>
                                  <div>
                                    <h4 className="font-medium text-white">{judge.name}</h4>
                                    <p className="text-sm text-gray-400">{judge.title}</p>
                                  </div>
                                </div>
                                <p className="text-sm text-gray-300">{judge.organization}</p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-400">No judges have been announced for this hackathon yet.</p>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="faq" className="space-y-4">
                    <Card className="bg-gray-800/30 border-gray-700">
                      <CardHeader>
                        <CardTitle className="text-xl text-white flex items-center gap-2">
                          <HelpCircle className="w-5 h-5 text-blue-400" />
                          Frequently Asked Questions
                        </CardTitle>
                        <CardDescription>
                          Common questions about this hackathon
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {hackathon.faq && hackathon.faq.length > 0 ? (
                          <Accordion type="single" collapsible className="w-full">
                            {hackathon.faq.map((item, index) => (
                              <AccordionItem key={index} value={`item-${index}`} className="border-gray-700">
                                <AccordionTrigger className="text-gray-200 hover:text-white">
                                  {item.question}
                                </AccordionTrigger>
                                <AccordionContent className="text-gray-300">
                                  {item.answer}
                                </AccordionContent>
                              </AccordionItem>
                            ))}
                          </Accordion>
                        ) : (
                          <p className="text-gray-400">No FAQ has been provided for this hackathon.</p>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}