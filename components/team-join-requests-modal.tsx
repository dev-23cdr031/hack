"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Users,
  Check,
  X,
  Clock,
  User,
  Mail,
  Calendar,
  MessageSquare,
  Star,
  Award,
  Code,
  Briefcase,
  MapPin,
  ExternalLink,
  Shield,
  Crown
} from "lucide-react"

interface TeamJoinRequest {
  id: string
  user_id: string
  team_id: string
  message: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  user: {
    id: string
    name: string
    email: string
    avatar_url?: string
    bio?: string
    skills?: string[]
    experience_level?: string
    location?: string
    github_url?: string
    linkedin_url?: string
    portfolio_url?: string
    hackathons_won?: number
    projects_completed?: number
    rating?: number
  }
  team: {
    id: string
    name: string
    description?: string
    current_members: number
    max_members: number
  }
}

interface TeamJoinRequestsModalProps {
  isOpen: boolean
  onClose: () => void
  teamId?: string
  currentUser?: any
}

export function TeamJoinRequestsModal({ 
  isOpen, 
  onClose, 
  teamId,
  currentUser 
}: TeamJoinRequestsModalProps) {
  const [requests, setRequests] = useState<TeamJoinRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [processingRequest, setProcessingRequest] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen && teamId) {
      fetchJoinRequests()
    }
  }, [isOpen, teamId])

  const fetchJoinRequests = async () => {
    if (!teamId) return

    try {
      setLoading(true)
      console.log('Fetching join requests for team:', teamId)
      
      const response = await fetch(`/api/teams/${teamId}/requests`)
      const data = await response.json()

      if (response.ok) {
        console.log('Join requests fetched:', data.length)
        setRequests(data.filter((req: TeamJoinRequest) => req.status === 'pending'))
      } else {
        console.error('Failed to fetch join requests:', data.error)
        // Mock data for demo
        setRequests(mockJoinRequests.filter(req => req.team_id === teamId && req.status === 'pending'))
      }
    } catch (error) {
      console.error('Error fetching join requests:', error)
      // Mock data for demo
      setRequests(mockJoinRequests.filter(req => req.team_id === teamId && req.status === 'pending'))
    } finally {
      setLoading(false)
    }
  }

  const handleRequestAction = async (requestId: string, action: 'approve' | 'reject') => {
    try {
      setProcessingRequest(requestId)
      console.log(`${action}ing request:`, requestId)

      const response = await fetch(`/api/teams/${teamId}/requests`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          request_id: requestId,
          action,
          reviewer_id: currentUser?.id
        })
      })

      const data = await response.json()

      if (response.ok) {
        console.log(`Request ${action}ed successfully`)
        
        // Remove the processed request from the list
        setRequests(prev => prev.filter(req => req.id !== requestId))
        
        // Show success message
        const actionText = action === 'approve' ? 'approved' : 'rejected'
        alert(`Join request ${actionText} successfully!`)
      } else {
        console.error(`Failed to ${action} request:`, data.error)
        alert(`Failed to ${action} request. Please try again.`)
      }
    } catch (error) {
      console.error(`Error ${action}ing request:`, error)
      alert(`Failed to ${action} request. Please try again.`)
    } finally {
      setProcessingRequest(null)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 1) {
      return 'Just now'
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      })
    }
  }

  const getExperienceColor = (level?: string) => {
    switch (level?.toLowerCase()) {
      case 'beginner':
        return 'bg-green-500/20 text-green-400'
      case 'intermediate':
        return 'bg-yellow-500/20 text-yellow-400'
      case 'advanced':
        return 'bg-red-500/20 text-red-400'
      case 'expert':
        return 'bg-purple-500/20 text-purple-400'
      default:
        return 'bg-gray-500/20 text-gray-400'
    }
  }

  const renderStars = (rating?: number) => {
    if (!rating) return null
    
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-3 h-3 ${
              i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'
            }`}
          />
        ))}
        <span className="text-xs text-gray-400 ml-1">({rating}/5)</span>
      </div>
    )
  }

  // Mock data for demo
  const mockJoinRequests: TeamJoinRequest[] = [
    {
      id: 'req_1',
      user_id: 'user_new_1',
      team_id: 'conv_1',
      message: 'Hi! I\'m a full-stack developer with 3 years of experience in React and Node.js. I\'ve won 2 hackathons and would love to contribute to your AI project. I have experience with machine learning and can help with both frontend and backend development.',
      status: 'pending',
      created_at: '2024-10-11T10:30:00Z',
      user: {
        id: 'user_new_1',
        name: 'Dev Dharrshan',
        email: 'devdharrshan@hackconnect.dev',
        avatar_url: '/placeholder.svg?height=64&width=64',
        bio: 'Full-stack developer passionate about AI and machine learning. Love building innovative solutions that make a difference.',
        skills: ['React', 'Node.js', 'Python', 'TensorFlow', 'AWS', 'Docker'],
        experience_level: 'intermediate',
        location: 'KEC, Erode Tamilnadu',
        github_url: 'https://github.com/devdharrshan',
        linkedin_url: 'https://linkedin.com/in/devdharrshan',
        portfolio_url: 'https://devdharrshan.dev',
        hackathons_won: 2,
        projects_completed: 15,
        rating: 4.8
      },
      team: {
        id: 'conv_1',
        name: 'AI Innovators Team',
        description: 'Building the future with AI',
        current_members: 3,
        max_members: 5
      }
    },
    {
      id: 'req_2',
      user_id: 'user_new_2',
      team_id: 'conv_1',
      message: 'Hello team! I\'m a UI/UX designer with strong frontend skills. I specialize in creating beautiful, user-friendly interfaces and have experience working with development teams. I think I can add great value to your project with my design and coding skills.',
      status: 'pending',
      created_at: '2024-10-11T09:15:00Z',
      user: {
        id: 'user_new_2',
        name: 'Hemapriya',
        email: 'hemapriya@hackconnect.dev',
        avatar_url: '/placeholder.svg?height=64&width=64',
        bio: 'UI/UX Designer and Frontend Developer. I create beautiful, functional interfaces that users love.',
        skills: ['UI/UX', 'React', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Adobe Creative Suite'],
        experience_level: 'advanced',
        location: 'KEC, Erode Tamilnadu',
        github_url: 'https://github.com/hemapriya',
        linkedin_url: 'https://linkedin.com/in/hemapriya',
        portfolio_url: 'https://hemapriya.design',
        hackathons_won: 1,
        projects_completed: 25,
        rating: 4.9
      },
      team: {
        id: 'conv_1',
        name: 'AI Innovators Team',
        description: 'Building the future with AI',
        current_members: 3,
        max_members: 5
      }
    },
    {
      id: 'req_3',
      user_id: 'user_new_3',
      team_id: 'conv_1',
      message: 'Hey! I\'m a data scientist with expertise in machine learning and deep learning. I have experience with large datasets and building ML models for production. I\'d love to help with the AI aspects of your project.',
      status: 'pending',
      created_at: '2024-10-11T08:45:00Z',
      user: {
        id: 'user_new_3',
        name: 'Bharani',
        email: 'bharani@hackconnect.dev',
        avatar_url: '/placeholder.svg?height=64&width=64',
        bio: 'Data Scientist specializing in ML/AI. Passionate about turning data into actionable insights.',
        skills: ['Python', 'TensorFlow', 'PyTorch', 'Scikit-learn', 'Pandas', 'SQL', 'AWS'],
        experience_level: 'expert',
        location: 'KEC, Erode Tamilnadu',
        github_url: 'https://github.com/bharani',
        linkedin_url: 'https://linkedin.com/in/bharani',
        hackathons_won: 3,
        projects_completed: 20,
        rating: 4.7
      },
      team: {
        id: 'conv_1',
        name: 'AI Innovators Team',
        description: 'Building the future with AI',
        current_members: 3,
        max_members: 5
      }
    }
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900 border border-purple-500/20">
        <DialogHeader className="border-b border-purple-500/20 pb-4">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent flex items-center gap-2">
            <Users className="w-6 h-6 text-purple-400" />
            Team Join Requests
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            Review and manage join requests for your team. View profiles and decide who to accept.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-2 space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
              <span className="ml-3 text-gray-300">Loading requests...</span>
            </div>
          ) : requests.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-300 mb-2">No Pending Requests</h3>
              <p className="text-gray-500">You don't have any pending join requests at the moment.</p>
            </div>
          ) : (
            requests.map((request) => (
              <Card key={request.id} className="bg-black/40 border border-purple-500/20 backdrop-blur-sm hover:border-purple-400/40 transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-12 h-12 border-2 border-purple-400/30">
                        <AvatarImage src={request.user.avatar_url} alt={request.user.name} />
                        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white font-bold">
                          {request.user.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg text-white flex items-center gap-2">
                          {request.user.name}
                          {request.user.rating && request.user.rating >= 4.5 && (
                            <Crown className="w-4 h-4 text-yellow-400" />
                          )}
                        </CardTitle>
                        <CardDescription className="text-gray-400 flex items-center gap-2">
                          <Mail className="w-3 h-3" />
                          {request.user.email}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                        <Clock className="w-3 h-3 mr-1" />
                        {formatDate(request.created_at)}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* User Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-purple-500/10 rounded-lg p-3 text-center">
                      <Award className="w-5 h-5 text-purple-400 mx-auto mb-1" />
                      <div className="text-sm font-semibold text-white">{request.user.hackathons_won || 0}</div>
                      <div className="text-xs text-gray-400">Hackathons Won</div>
                    </div>
                    <div className="bg-blue-500/10 rounded-lg p-3 text-center">
                      <Code className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                      <div className="text-sm font-semibold text-white">{request.user.projects_completed || 0}</div>
                      <div className="text-xs text-gray-400">Projects</div>
                    </div>
                    <div className="bg-green-500/10 rounded-lg p-3 text-center">
                      <Briefcase className="w-5 h-5 text-green-400 mx-auto mb-1" />
                      <Badge className={`text-xs ${getExperienceColor(request.user.experience_level)}`}>
                        {request.user.experience_level || 'N/A'}
                      </Badge>
                    </div>
                    <div className="bg-yellow-500/10 rounded-lg p-3 text-center">
                      <div className="mb-1">{renderStars(request.user.rating)}</div>
                      <div className="text-xs text-gray-400">Rating</div>
                    </div>
                  </div>

                  {/* Skills */}
                  {request.user.skills && request.user.skills.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
                        <Code className="w-4 h-4" />
                        Skills
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {request.user.skills.map((skill, index) => (
                          <Badge key={index} variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/30 text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Bio */}
                  {request.user.bio && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
                        <User className="w-4 h-4" />
                        About
                      </h4>
                      <p className="text-sm text-gray-400 bg-gray-800/30 rounded-lg p-3">
                        {request.user.bio}
                      </p>
                    </div>
                  )}

                  {/* Join Message */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Join Request Message
                    </h4>
                    <p className="text-sm text-gray-300 bg-purple-500/10 rounded-lg p-3 border border-purple-500/20">
                      {request.message}
                    </p>
                  </div>

                  {/* Location and Links */}
                  <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400">
                    {request.user.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {request.user.location}
                      </div>
                    )}
                    {request.user.github_url && (
                      <a 
                        href={request.user.github_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 hover:text-purple-400 transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                        GitHub
                      </a>
                    )}
                    {request.user.linkedin_url && (
                      <a 
                        href={request.user.linkedin_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 hover:text-purple-400 transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                        LinkedIn
                      </a>
                    )}
                    {request.user.portfolio_url && (
                      <a 
                        href={request.user.portfolio_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 hover:text-purple-400 transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Portfolio
                      </a>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-2">
                    <Button
                      onClick={() => handleRequestAction(request.id, 'approve')}
                      disabled={processingRequest === request.id}
                      className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white border-0"
                    >
                      {processingRequest === request.id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      ) : (
                        <Check className="w-4 h-4 mr-2" />
                      )}
                      Accept
                    </Button>
                    <Button
                      onClick={() => handleRequestAction(request.id, 'reject')}
                      disabled={processingRequest === request.id}
                      variant="outline"
                      className="flex-1 bg-red-600/10 border-red-500/30 text-red-400 hover:bg-red-600/20 hover:border-red-400/50"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Ignore
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
