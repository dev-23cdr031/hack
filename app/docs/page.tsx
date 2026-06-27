"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  BookOpen,
  Search,
  Code,
  Zap,
  Users,
  MessageCircle,
  Video,
  Settings,
  Shield,
  Globe,
  Smartphone,
  Database,
  Cloud,
  Terminal,
  FileText,
  Download,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  Copy,
  Check,
  Star,
  Heart,
  ArrowLeft,
  Menu,
  Filter,
  Tag,
  Clock,
  User,
  Lightbulb,
  AlertCircle,
  CheckCircle,
  Info,
  Play,
  Bookmark,
  Share2,
  Eye,
  ThumbsUp,
  GitBranch,
  Package,
  Layers,
  Cpu,
  Monitor,
  Wifi,
} from "lucide-react"
import Link from "next/link"

interface DocSection {
  id: string
  title: string
  description: string
  icon: any
  articles: DocArticle[]
  color: string
}

interface DocArticle {
  id: string
  title: string
  description: string
  content: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  readTime: number
  lastUpdated: string
  tags: string[]
  popular: boolean
}

export default function DocsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSection, setSelectedSection] = useState<string | null>(null)
  const [selectedArticle, setSelectedArticle] = useState<DocArticle | null>(null)
  const [filteredSections, setFilteredSections] = useState<DocSection[]>([])
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all")
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  const docSections: DocSection[] = [
    {
      id: "getting-started",
      title: "Getting Started",
      description: "Quick start guides and basic setup",
      icon: Zap,
      color: "from-green-500 to-emerald-600",
      articles: [
        {
          id: "welcome",
          title: "Welcome to HackConnect",
          description: "Learn the basics of our platform and get started quickly",
          content: `# Welcome to HackConnect

HackConnect is the ultimate platform for hackathon enthusiasts, developers, and innovators. Our platform provides everything you need to participate in hackathons, collaborate with teams, and build amazing projects.

## Key Features

- **Team Formation**: Find teammates with complementary skills
- **Real-time Communication**: Built-in messaging and video calls
- **Project Management**: Organize your hackathon projects
- **Skill Matching**: AI-powered team recommendations
- **Live Events**: Join hackathons worldwide

## Getting Started

1. Create your profile and showcase your skills
2. Browse available hackathons
3. Join or create a team
4. Start building amazing projects!`,
          difficulty: "beginner",
          readTime: 3,
          lastUpdated: "2024-10-05",
          tags: ["introduction", "basics", "overview"],
          popular: true
        },
        {
          id: "account-setup",
          title: "Setting Up Your Account",
          description: "Complete guide to profile creation and customization",
          content: `# Setting Up Your Account

Your profile is your digital identity on HackConnect. A well-crafted profile helps you find the right teammates and opportunities.

## Profile Essentials

### Basic Information
- **Display Name**: Choose a professional name
- **Bio**: Describe your skills and interests
- **Location**: Help teammates find you
- **Skills**: Tag your technical abilities

### Social Links
- GitHub profile for code samples
- LinkedIn for professional networking
- Portfolio website to showcase projects

## Privacy Settings

Control who can see your information and how you appear in searches.`,
          difficulty: "beginner",
          readTime: 5,
          lastUpdated: "2024-10-05",
          tags: ["profile", "setup", "privacy"],
          popular: false
        }
      ]
    },
    {
      id: "teams",
      title: "Teams & Collaboration",
      description: "Working with teams and managing projects",
      icon: Users,
      color: "from-blue-500 to-cyan-600",
      articles: [
        {
          id: "creating-teams",
          title: "Creating and Managing Teams",
          description: "Learn how to form teams and manage members effectively",
          content: `# Creating and Managing Teams

Teams are the heart of successful hackathons. Learn how to build and lead effective teams.

## Creating a Team

1. Navigate to the Teams section
2. Click "Create Team"
3. Set team name and description
4. Define required skills
5. Set team size limits

## Team Management

- **Invite Members**: Send invitations via email or username
- **Set Roles**: Assign team lead, developers, designers
- **Manage Permissions**: Control who can invite new members
- **Team Chat**: Use built-in messaging for coordination

## Best Practices

- Clearly define project goals
- Establish communication protocols
- Set regular check-in meetings
- Use project management tools`,
          difficulty: "intermediate",
          readTime: 7,
          lastUpdated: "2024-10-05",
          tags: ["teams", "management", "collaboration"],
          popular: true
        }
      ]
    },
    {
      id: "communication",
      title: "Communication",
      description: "Messaging, video calls, and collaboration tools",
      icon: MessageCircle,
      color: "from-purple-500 to-pink-600",
      articles: [
        {
          id: "messaging",
          title: "Real-time Messaging",
          description: "Master the messaging system for effective team communication",
          content: `# Real-time Messaging

Our messaging system provides instant communication with your team members and the broader community.

## Features

- **Direct Messages**: One-on-one conversations
- **Team Channels**: Group discussions
- **File Sharing**: Share code, designs, and documents
- **Message Search**: Find past conversations quickly
- **Notifications**: Stay updated on important messages

## Message Types

- Text messages with rich formatting
- Code snippets with syntax highlighting
- File attachments (images, documents, code)
- Voice messages for quick updates

## Best Practices

- Use @mentions for important messages
- Organize conversations by topic
- Keep messages clear and concise
- Use emojis for quick reactions`,
          difficulty: "beginner",
          readTime: 4,
          lastUpdated: "2024-10-05",
          tags: ["messaging", "communication", "chat"],
          popular: true
        },
        {
          id: "video-calls",
          title: "Video Calling & Screen Sharing",
          description: "Use our advanced video calling features for team collaboration",
          content: `# Video Calling & Screen Sharing

Our video calling system provides professional-grade communication tools for your team.

## Starting a Call

1. Open any conversation
2. Click the video or audio call button
3. Allow camera/microphone permissions
4. Wait for team members to join

## Advanced Features

- **Screen Sharing**: Share your entire screen or specific applications
- **Virtual Backgrounds**: Professional backgrounds for calls
- **Call Recording**: Record important meetings
- **Noise Cancellation**: AI-powered audio enhancement
- **Call Quality Monitoring**: Real-time connection indicators

## Call Controls

- Mute/unmute microphone
- Turn camera on/off
- Share screen
- Start/stop recording
- End call

## Tips for Better Calls

- Use headphones to prevent echo
- Ensure good lighting for video
- Test audio/video before important calls
- Use screen sharing for code reviews`,
          difficulty: "intermediate",
          readTime: 6,
          lastUpdated: "2024-10-05",
          tags: ["video", "calls", "screen-sharing", "webrtc"],
          popular: true
        }
      ]
    },
    {
      id: "api",
      title: "API Reference",
      description: "Complete API documentation for developers",
      icon: Code,
      color: "from-orange-500 to-red-600",
      articles: [
        {
          id: "authentication",
          title: "Authentication",
          description: "Learn how to authenticate with the HackConnect API",
          content: `# Authentication

The HackConnect API uses JWT (JSON Web Tokens) for authentication.

## Getting Started

1. Obtain your API key from the developer dashboard
2. Include the token in the Authorization header
3. Make authenticated requests to protected endpoints

## Example Request

\`\`\`javascript
const response = await fetch('/api/user/profile', {
  headers: {
    'Authorization': 'Bearer YOUR_JWT_TOKEN',
    'Content-Type': 'application/json'
  }
});
\`\`\`

## Token Refresh

Tokens expire after 24 hours. Use the refresh endpoint to get a new token:

\`\`\`javascript
const refreshResponse = await fetch('/api/auth/refresh', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_REFRESH_TOKEN'
  }
});
\`\`\``,
          difficulty: "advanced",
          readTime: 8,
          lastUpdated: "2024-10-05",
          tags: ["api", "authentication", "jwt", "security"],
          popular: false
        }
      ]
    },
    {
      id: "integrations",
      title: "Integrations",
      description: "Connect with external tools and services",
      icon: Globe,
      color: "from-teal-500 to-blue-600",
      articles: [
        {
          id: "github-integration",
          title: "GitHub Integration",
          description: "Connect your GitHub account for seamless code collaboration",
          content: `# GitHub Integration

Connect your GitHub account to showcase your projects and collaborate on code.

## Setup

1. Go to Settings > Integrations
2. Click "Connect GitHub"
3. Authorize HackConnect to access your repositories
4. Select which repositories to sync

## Features

- **Repository Sync**: Display your projects on your profile
- **Commit Activity**: Show your coding activity
- **Code Sharing**: Share repository links in messages
- **Team Repositories**: Collaborate on shared projects

## Permissions

We only request the minimum permissions needed:
- Read access to public repositories
- Read access to profile information
- No write access to your code`,
          difficulty: "intermediate",
          readTime: 5,
          lastUpdated: "2024-10-05",
          tags: ["github", "integration", "git", "repositories"],
          popular: true
        }
      ]
    },
    {
      id: "troubleshooting",
      title: "Troubleshooting",
      description: "Common issues and solutions",
      icon: AlertCircle,
      color: "from-yellow-500 to-orange-600",
      articles: [
        {
          id: "common-issues",
          title: "Common Issues & Solutions",
          description: "Quick fixes for the most common problems",
          content: `# Common Issues & Solutions

Here are solutions to the most frequently reported issues.

## Video Call Issues

### Camera Not Working
1. Check browser permissions
2. Ensure camera is not used by another app
3. Try refreshing the page
4. Update your browser

### Audio Problems
1. Check microphone permissions
2. Test audio in browser settings
3. Use headphones to prevent echo
4. Check system audio levels

## Connection Issues

### Slow Loading
1. Check your internet connection
2. Clear browser cache
3. Disable browser extensions
4. Try incognito mode

### Login Problems
1. Verify email and password
2. Check for caps lock
3. Try password reset
4. Clear cookies and cache

## Getting Help

If these solutions don't work:
1. Check our status page
2. Contact support
3. Join our community forum
4. Report bugs on GitHub`,
          difficulty: "beginner",
          readTime: 4,
          lastUpdated: "2024-10-05",
          tags: ["troubleshooting", "issues", "support", "help"],
          popular: true
        }
      ]
    }
  ]

  useEffect(() => {
    let filtered = docSections

    if (searchTerm) {
      filtered = docSections.map(section => ({
        ...section,
        articles: section.articles.filter(article =>
          article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          article.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
        )
      })).filter(section => section.articles.length > 0)
    }

    if (selectedDifficulty !== "all") {
      filtered = filtered.map(section => ({
        ...section,
        articles: section.articles.filter(article => article.difficulty === selectedDifficulty)
      })).filter(section => section.articles.length > 0)
    }

    setFilteredSections(filtered)
  }, [searchTerm, selectedDifficulty])

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Beginner</Badge>
      case 'intermediate':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Intermediate</Badge>
      case 'advanced':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Advanced</Badge>
      default:
        return null
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (selectedArticle) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
        {/* Article Header */}
        <div className="sticky top-0 z-40 backdrop-blur-xl bg-black/20 border-b border-white/10">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  onClick={() => setSelectedArticle(null)}
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Docs
                </Button>
                <div>
                  <h1 className="text-xl font-bold text-white">{selectedArticle.title}</h1>
                  <div className="flex items-center gap-3 text-sm text-gray-400">
                    <span>{selectedArticle.readTime} min read</span>
                    <span>•</span>
                    <span>Updated {formatDate(selectedArticle.lastUpdated)}</span>
                    <span>•</span>
                    {getDifficultyBadge(selectedArticle.difficulty)}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  <Bookmark className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Article Content */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8">
            <div className="prose prose-invert max-w-none">
              <div className="whitespace-pre-wrap text-gray-200 leading-relaxed">
                {selectedArticle.content}
              </div>
            </div>
            
            {/* Tags */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <div className="flex items-center gap-2 mb-4">
                <Tag className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-400">Tags:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedArticle.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="bg-gray-700/50 text-gray-300">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Header */}
      <div className="sticky top-0 z-40 backdrop-blur-xl bg-black/20 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="flex items-center gap-3">
                <BookOpen className="w-8 h-8 text-purple-400" />
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
                    Documentation
                  </h1>
                  <p className="text-sm text-gray-400">Everything you need to know about HackConnect</p>
                </div>
              </div>
            </div>
            <Button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              variant="ghost"
              size="sm"
              className="lg:hidden text-gray-400 hover:text-white"
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className={`lg:col-span-1 ${showMobileMenu ? 'block' : 'hidden lg:block'}`}>
            <div className="sticky top-24 space-y-6">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search documentation..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm"
                />
              </div>

              {/* Filters */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Difficulty Level
                </h3>
                <div className="space-y-1">
                  {['all', 'beginner', 'intermediate', 'advanced'].map((level) => (
                    <button
                      key={level}
                      onClick={() => setSelectedDifficulty(level)}
                      className={`w-full text-left p-2 rounded-lg text-sm transition-all duration-200 ${
                        selectedDifficulty === level
                          ? "bg-purple-600/30 text-purple-200 border border-purple-500/30"
                          : "text-gray-300 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Links */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-gray-300 mb-3">Quick Links</h3>
                <div className="space-y-2">
                  <Link href="/api" className="block text-sm text-gray-400 hover:text-purple-400 transition-colors">
                    API Reference
                  </Link>
                  <Link href="/changelog" className="block text-sm text-gray-400 hover:text-purple-400 transition-colors">
                    Changelog
                  </Link>
                  <Link href="/support" className="block text-sm text-gray-400 hover:text-purple-400 transition-colors">
                    Support Center
                  </Link>
                  <Link href="/community" className="block text-sm text-gray-400 hover:text-purple-400 transition-colors">
                    Community Forum
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {!selectedSection ? (
              <div className="space-y-8">
                {/* Hero Section */}
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <BookOpen className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-4">
                    Welcome to HackConnect Docs
                  </h2>
                  <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                    Comprehensive guides, tutorials, and API documentation to help you make the most of our platform
                  </p>
                </div>

                {/* Popular Articles */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-400" />
                    Popular Articles
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {docSections.flatMap(section => 
                      section.articles.filter(article => article.popular)
                    ).map(article => (
                      <div
                        key={article.id}
                        onClick={() => setSelectedArticle(article)}
                        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:bg-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer group"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-white group-hover:text-purple-200 transition-colors">
                            {article.title}
                          </h4>
                          <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                        </div>
                        <p className="text-sm text-gray-400 mb-3">{article.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {getDifficultyBadge(article.difficulty)}
                            <span className="text-xs text-gray-500">{article.readTime} min read</span>
                          </div>
                          <div className="flex items-center gap-1 text-yellow-400">
                            <Star className="w-3 h-3 fill-current" />
                            <span className="text-xs">Popular</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Documentation Sections */}
                <div className="space-y-6">
                  {filteredSections.map((section) => (
                    <div key={section.id} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className={`w-12 h-12 bg-gradient-to-br ${section.color} rounded-xl flex items-center justify-center`}>
                          <section.icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white">{section.title}</h3>
                          <p className="text-gray-400">{section.description}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {section.articles.map((article) => (
                          <div
                            key={article.id}
                            onClick={() => setSelectedArticle(article)}
                            className="p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer group"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-medium text-white group-hover:text-purple-200 transition-colors">
                                {article.title}
                              </h4>
                              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors flex-shrink-0 ml-2" />
                            </div>
                            <p className="text-sm text-gray-400 mb-3 line-clamp-2">{article.description}</p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                {getDifficultyBadge(article.difficulty)}
                                <span className="text-xs text-gray-500">{article.readTime} min</span>
                              </div>
                              {article.popular && (
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {filteredSections.length === 0 && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-300 mb-2">No results found</h3>
                    <p className="text-gray-500">Try adjusting your search terms or filters</p>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
