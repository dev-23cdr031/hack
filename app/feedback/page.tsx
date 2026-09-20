"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  MessageSquare,
  Star,
  ThumbsUp,
  ThumbsDown,
  Bug,
  Lightbulb,
  Heart,
  Zap,
  Send,
  Upload,
  Image,
  Paperclip,
  X,
  Check,
  ArrowLeft,
  Smile,
  Frown,
  Meh,
  AlertCircle,
  CheckCircle,
  Info,
  Sparkles,
  Target,
  Users,
  Code,
  Palette,
  Settings,
  Shield,
  Globe,
  Smartphone,
  Monitor,
  Camera,
  Mic,
  Video,
  Calendar,
  Clock,
  TrendingUp,
  Award,
  Gift,
} from "lucide-react"
import Link from "next/link"

interface FeedbackCategory {
  id: string
  title: string
  description: string
  icon: any
  color: string
  count: number
}

interface FeedbackItem {
  id: string
  type: string
  title: string
  description: string
  rating: number
  category: string
  status: 'new' | 'reviewing' | 'planned' | 'in-progress' | 'completed' | 'declined'
  votes: number
  userVoted: boolean
  date: string
  user: string
  tags: string[]
}

export default function FeedbackPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [showFeedbackForm, setShowFeedbackForm] = useState(false)
  const [feedbackType, setFeedbackType] = useState<string>("general")
  const [rating, setRating] = useState<number>(0)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [attachments, setAttachments] = useState<File[]>([])
  const [submitted, setSubmitted] = useState(false)

  const categories: FeedbackCategory[] = [
    {
      id: "all",
      title: "All Feedback",
      description: "View all feedback and suggestions",
      icon: MessageSquare,
      color: "from-purple-500 to-blue-500",
      count: 156
    },
    {
      id: "feature",
      title: "Feature Requests",
      description: "Suggest new features and improvements",
      icon: Lightbulb,
      color: "from-yellow-500 to-orange-500",
      count: 42
    },
    {
      id: "bug",
      title: "Bug Reports",
      description: "Report issues and problems",
      icon: Bug,
      color: "from-red-500 to-pink-500",
      count: 18
    },
    {
      id: "ui",
      title: "UI/UX Feedback",
      description: "Design and user experience suggestions",
      icon: Palette,
      color: "from-pink-500 to-purple-500",
      count: 31
    },
    {
      id: "performance",
      title: "Performance",
      description: "Speed and optimization feedback",
      icon: Zap,
      color: "from-green-500 to-teal-500",
      count: 24
    },
    {
      id: "general",
      title: "General",
      description: "General comments and suggestions",
      icon: Heart,
      color: "from-blue-500 to-cyan-500",
      count: 41
    }
  ]

  const feedbackItems: FeedbackItem[] = [
    {
      id: "1",
      type: "feature",
      title: "Add Dark Mode Toggle in Settings",
      description: "Would love to have a quick toggle for dark/light mode in the main settings instead of going through appearance settings.",
      rating: 5,
      category: "UI/UX",
      status: "planned",
      votes: 24,
      userVoted: false,
      date: "2024-10-05",
      user: "Dev Dharrshan",
      tags: ["dark-mode", "ui", "settings"]
    },
    {
      id: "2",
      type: "bug",
      title: "Video Call Audio Echo Issue",
      description: "Experiencing echo during video calls even with headphones. Happens mostly in group calls with 3+ participants.",
      rating: 2,
      category: "Communication",
      status: "in-progress",
      votes: 18,
      userVoted: true,
      date: "2024-10-04",
      user: "Divyadharshini",
      tags: ["video-calls", "audio", "bug"]
    },
    {
      id: "3",
      type: "feature",
      title: "Team Analytics Dashboard",
      description: "Add analytics to track team productivity, code commits, meeting attendance, and project progress over time.",
      rating: 5,
      category: "Teams",
      status: "reviewing",
      votes: 35,
      userVoted: false,
      date: "2024-10-03",
      user: "Bharani",
      tags: ["analytics", "teams", "dashboard"]
    },
    {
      id: "4",
      type: "ui",
      title: "Mobile App Needed",
      description: "The web app works great, but a native mobile app would be amazing for on-the-go team communication.",
      rating: 4,
      category: "Mobile",
      status: "planned",
      votes: 67,
      userVoted: true,
      date: "2024-10-02",
      user: "Anusree D",
      tags: ["mobile", "app", "communication"]
    },
    {
      id: "5",
      type: "feature",
      title: "Code Review Integration",
      description: "Integrate with GitHub/GitLab for seamless code reviews within the platform. Show PR status and allow inline comments.",
      rating: 5,
      category: "Development",
      status: "new",
      votes: 29,
      userVoted: false,
      date: "2024-10-01",
      user: "Hemapriya",
      tags: ["github", "code-review", "integration"]
    }
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">New</Badge>
      case 'reviewing':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Reviewing</Badge>
      case 'planned':
        return <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">Planned</Badge>
      case 'in-progress':
        return <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">In Progress</Badge>
      case 'completed':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Completed</Badge>
      case 'declined':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Declined</Badge>
      default:
        return null
    }
  }

  const getRatingIcon = (rating: number) => {
    if (rating >= 4) return <Smile className="w-5 h-5 text-green-400" />
    if (rating >= 3) return <Meh className="w-5 h-5 text-yellow-400" />
    return <Frown className="w-5 h-5 text-red-400" />
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      setShowFeedbackForm(false)
      setSubmitted(false)
      setTitle("")
      setDescription("")
      setRating(0)
      setAttachments([])
    }, 2000)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(prev => [...prev, ...Array.from(e.target.files!)])
    }
  }

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index))
  }

  const filteredFeedback = selectedCategory === "all" 
    ? feedbackItems 
    : feedbackItems.filter(item => item.type === selectedCategory)

  if (showFeedbackForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
        <div className="sticky top-0 z-40 backdrop-blur-xl bg-black/20 border-b border-white/10">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => setShowFeedbackForm(false)}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-xl font-bold text-white">Share Your Feedback</h1>
                <p className="text-sm text-gray-400">Help us improve HackConnect</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-8">
          <form onSubmit={handleSubmit} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            {submitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Thank You!</h3>
                <p className="text-gray-400">Your feedback has been submitted successfully.</p>
              </div>
            ) : (
              <>
                {/* Feedback Type */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-white mb-3">Feedback Type</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {categories.slice(1).map((category) => (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => setFeedbackType(category.id)}
                        className={`p-3 rounded-lg border transition-all duration-200 ${
                          feedbackType === category.id
                            ? "border-purple-500 bg-purple-500/20 text-purple-200"
                            : "border-white/10 bg-white/5 text-gray-300 hover:border-white/20"
                        }`}
                      >
                        <category.icon className="w-5 h-5 mx-auto mb-1" />
                        <div className="text-xs font-medium">{category.title}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Rating */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-white mb-3">Overall Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className={`p-2 rounded-lg transition-colors ${
                          star <= rating ? "text-yellow-400" : "text-gray-600 hover:text-gray-400"
                        }`}
                      >
                        <Star className={`w-6 h-6 ${star <= rating ? "fill-current" : ""}`} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Title */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-white mb-2">Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Brief summary of your feedback"
                    className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>

                {/* Description */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-white mb-2">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide detailed feedback, steps to reproduce (for bugs), or feature specifications"
                    rows={6}
                    className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    required
                  />
                </div>

                {/* Attachments */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-white mb-2">Attachments (Optional)</label>
                  <div className="border-2 border-dashed border-white/20 rounded-lg p-4">
                    <input
                      type="file"
                      multiple
                      accept="image/*,.pdf,.doc,.docx"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="flex flex-col items-center cursor-pointer"
                    >
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-400">Click to upload files</span>
                      <span className="text-xs text-gray-500">Images, PDFs, or documents</span>
                    </label>
                  </div>

                  {attachments.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {attachments.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Paperclip className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-white">{file.name}</span>
                          </div>
                          <Button
                            type="button"
                            onClick={() => removeAttachment(index)}
                            variant="ghost"
                            size="sm"
                            className="text-gray-400 hover:text-red-400"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3"
                  disabled={!title || !description || rating === 0}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Submit Feedback
                </Button>
              </>
            )}
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Header */}
      <div className="sticky top-0 z-40 backdrop-blur-xl bg-black/20 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0">
              <Link href="/" className="text-gray-400 hover:text-white transition-colors flex-shrink-0">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <MessageSquare className="w-7 h-7 sm:w-8 sm:h-8 text-purple-400 flex-shrink-0" />
                <div className="min-w-0">
                  <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent truncate">
                    Feedback Hub
                  </h1>
                  <p className="hidden sm:block text-sm text-gray-400">Help us improve HackConnect together</p>
                </div>
              </div>
            </div>
            <Button
              onClick={() => setShowFeedbackForm(true)}
              size="sm"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-2 sm:px-4"
            >
              <Sparkles className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Share Feedback</span>
              <span className="sm:hidden">Feedback</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <div className="text-xl font-bold text-white">156</div>
                <div className="text-sm text-gray-400">Total Feedback</div>
              </div>
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <div className="text-xl font-bold text-white">43</div>
                <div className="text-sm text-gray-400">Implemented</div>
              </div>
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <div className="text-xl font-bold text-white">28</div>
                <div className="text-sm text-gray-400">In Progress</div>
              </div>
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <div className="text-xl font-bold text-white">4.8</div>
                <div className="text-sm text-gray-400">Avg Rating</div>
              </div>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Feedback Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`p-4 rounded-xl border transition-all duration-300 text-left ${
                  selectedCategory === category.id
                    ? "border-purple-500 bg-purple-500/20"
                    : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 bg-gradient-to-br ${category.color} rounded-lg flex items-center justify-center`}>
                    <category.icon className="w-5 h-5 text-white" />
                  </div>
                  <Badge variant="secondary" className="bg-gray-700/50 text-gray-300">
                    {category.count}
                  </Badge>
                </div>
                <h3 className="font-semibold text-white mb-1">{category.title}</h3>
                <p className="text-sm text-gray-400">{category.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Feedback List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">
              {selectedCategory === "all" ? "All Feedback" : categories.find(c => c.id === selectedCategory)?.title}
            </h2>
            <div className="text-sm text-gray-400">
              {filteredFeedback.length} items
            </div>
          </div>

          {filteredFeedback.map((item) => (
            <div key={item.id} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-white">{item.title}</h3>
                    {getStatusBadge(item.status)}
                    {getRatingIcon(item.rating)}
                  </div>
                  <p className="text-gray-400 mb-3">{item.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>by {item.user}</span>
                    <span>•</span>
                    <span>{item.date}</span>
                    <span>•</span>
                    <span>{item.category}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="bg-gray-700/50 text-gray-300 text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`text-gray-400 hover:text-white ${item.userVoted ? 'text-purple-400' : ''}`}
                  >
                    <ThumbsUp className="w-4 h-4 mr-1" />
                    {item.votes}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
