"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Bell,
  BellRing,
  Check,
  CheckCheck,
  Trash2,
  Settings,
  Filter,
  Search,
  Users,
  MessageCircle,
  Calendar,
  Trophy,
  Code,
  Heart,
  Star,
  Zap,
  Clock,
  Eye,
  EyeOff,
  Volume2,
  VolumeX,
  Smartphone,
  Mail,
  Globe,
  Shield,
  ChevronDown,
  ChevronRight,
  MoreHorizontal,
  Archive,
  Pin,
  PinOff,
  Flame,
  Gift,
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
  ArrowLeft,
} from "lucide-react"
import Link from "next/link"

interface Notification {
  id: string
  type: 'message' | 'team' | 'hackathon' | 'achievement' | 'system' | 'meeting' | 'code' | 'social'
  title: string
  description: string
  timestamp: string
  isRead: boolean
  isPinned: boolean
  priority: 'low' | 'medium' | 'high' | 'urgent'
  category: string
  avatar?: string
  actionUrl?: string
  metadata?: {
    sender?: string
    teamName?: string
    hackathonName?: string
    achievementType?: string
    codeRepo?: string
    meetingId?: string
  }
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFilter, setSelectedFilter] = useState<string>("all")
  const [showSettings, setShowSettings] = useState(false)
  const [loading, setLoading] = useState(true)

  // Mock notification data
  const mockNotifications: Notification[] = [
    {
      id: "1",
      type: "message",
      title: "New message from Dev Dharrshan",
      description: "🚀 Just pushed the new React components! The performance improvements are incredible - 40% faster rendering!",
      timestamp: "2024-10-05T18:15:00Z",
      isRead: false,
      isPinned: true,
      priority: "high",
      category: "Messages",
      avatar: "/placeholder.svg?height=40&width=40",
      actionUrl: "/messages",
      metadata: { sender: "Dev Dharrshan" }
    },
    {
      id: "2",
      type: "team",
      title: "Team invitation received",
      description: "Divyadharshini invited you to join 'UI/UX Design Masters' team for the upcoming hackathon",
      timestamp: "2024-10-05T17:45:00Z",
      isRead: false,
      isPinned: false,
      priority: "high",
      category: "Teams",
      avatar: "/placeholder.svg?height=40&width=40",
      actionUrl: "/teams",
      metadata: { sender: "Divyadharshini", teamName: "UI/UX Design Masters" }
    },
    {
      id: "3",
      type: "hackathon",
      title: "Hackathon registration confirmed",
      description: "You're all set for 'Green Tech Sustainability Hack 2024'! Event starts in 2 days.",
      timestamp: "2024-10-05T16:30:00Z",
      isRead: true,
      isPinned: false,
      priority: "medium",
      category: "Hackathons",
      actionUrl: "/hackathons",
      metadata: { hackathonName: "Green Tech Sustainability Hack 2024" }
    },
    {
      id: "4",
      type: "achievement",
      title: "New achievement unlocked! 🏆",
      description: "Congratulations! You've earned the 'Code Ninja' badge for 50+ commits this week",
      timestamp: "2024-10-05T15:20:00Z",
      isRead: false,
      isPinned: false,
      priority: "medium",
      category: "Achievements",
      actionUrl: "/achievements",
      metadata: { achievementType: "Code Ninja" }
    },
    {
      id: "5",
      type: "meeting",
      title: "Meeting reminder",
      description: "Daily standup with your team starts in 15 minutes. Join the video call now!",
      timestamp: "2024-10-05T14:45:00Z",
      isRead: true,
      isPinned: false,
      priority: "urgent",
      category: "Meetings",
      actionUrl: "/meetings",
      metadata: { meetingId: "standup-daily" }
    },
    {
      id: "6",
      type: "code",
      title: "Code review requested",
      description: "Bharani requested a review for the CI/CD pipeline implementation in the main repository",
      timestamp: "2024-10-05T13:30:00Z",
      isRead: true,
      isPinned: false,
      priority: "medium",
      category: "Code Reviews",
      avatar: "/placeholder.svg?height=40&width=40",
      actionUrl: "/code-hub",
      metadata: { sender: "Bharani", codeRepo: "hackconnect-platform" }
    },
    {
      id: "7",
      type: "social",
      title: "Anusree liked your project",
      description: "Your 'Real-time Chat Application' project received a like and positive feedback",
      timestamp: "2024-10-05T12:15:00Z",
      isRead: true,
      isPinned: false,
      priority: "low",
      category: "Social",
      avatar: "/placeholder.svg?height=40&width=40",
      actionUrl: "/profile",
      metadata: { sender: "Anusree" }
    },
    {
      id: "8",
      type: "system",
      title: "System maintenance scheduled",
      description: "Planned maintenance on Oct 6, 2024 from 2:00 AM to 4:00 AM UTC. Some features may be unavailable.",
      timestamp: "2024-10-05T10:00:00Z",
      isRead: false,
      isPinned: false,
      priority: "low",
      category: "System",
      actionUrl: "/help"
    },
    {
      id: "9",
      type: "message",
      title: "New message from Hemapriya",
      description: "📚 Updated all project docs with API references and deployment guides. Everything is well-documented now!",
      timestamp: "2024-10-05T09:30:00Z",
      isRead: true,
      isPinned: false,
      priority: "medium",
      category: "Messages",
      avatar: "/placeholder.svg?height=40&width=40",
      actionUrl: "/messages",
      metadata: { sender: "Hemapriya" }
    },
    {
      id: "10",
      type: "hackathon",
      title: "Submission deadline approaching",
      description: "Only 6 hours left to submit your project for 'AI Innovation Challenge'. Don't miss out!",
      timestamp: "2024-10-05T08:00:00Z",
      isRead: false,
      isPinned: true,
      priority: "urgent",
      category: "Hackathons",
      actionUrl: "/hackathons",
      metadata: { hackathonName: "AI Innovation Challenge" }
    }
  ]

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setNotifications(mockNotifications)
      setFilteredNotifications(mockNotifications)
      setLoading(false)
    }, 1000)
  }, [])

  useEffect(() => {
    let filtered = notifications

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (notification) =>
          notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          notification.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          notification.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply type filter
    if (selectedFilter !== "all") {
      if (selectedFilter === "unread") {
        filtered = filtered.filter((notification) => !notification.isRead)
      } else if (selectedFilter === "pinned") {
        filtered = filtered.filter((notification) => notification.isPinned)
      } else {
        filtered = filtered.filter((notification) => notification.type === selectedFilter)
      }
    }

    // Sort by pinned first, then by timestamp
    filtered.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1
      if (!a.isPinned && b.isPinned) return 1
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    })

    setFilteredNotifications(filtered)
  }, [notifications, searchTerm, selectedFilter])

  const getNotificationIcon = (type: string, priority: string) => {
    const iconClass = `w-5 h-5 ${
      priority === 'urgent' ? 'text-red-400' :
      priority === 'high' ? 'text-orange-400' :
      priority === 'medium' ? 'text-blue-400' : 'text-gray-400'
    }`

    switch (type) {
      case 'message': return <MessageCircle className={iconClass} />
      case 'team': return <Users className={iconClass} />
      case 'hackathon': return <Trophy className={iconClass} />
      case 'achievement': return <Star className={iconClass} />
      case 'meeting': return <Calendar className={iconClass} />
      case 'code': return <Code className={iconClass} />
      case 'social': return <Heart className={iconClass} />
      case 'system': return <Settings className={iconClass} />
      default: return <Bell className={iconClass} />
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Urgent</Badge>
      case 'high':
        return <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">High</Badge>
      case 'medium':
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Medium</Badge>
      case 'low':
        return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">Low</Badge>
      default:
        return null
    }
  }

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, isRead: true } : notification
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, isRead: true }))
    )
  }

  const togglePin = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, isPinned: !notification.isPinned } : notification
      )
    )
  }

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id))
  }

  const unreadCount = notifications.filter(n => !n.isRead).length
  const pinnedCount = notifications.filter(n => n.isPinned).length

  const filterOptions = [
    { value: "all", label: "All", count: notifications.length },
    { value: "unread", label: "Unread", count: unreadCount },
    { value: "pinned", label: "Pinned", count: pinnedCount },
    { value: "message", label: "Messages", count: notifications.filter(n => n.type === 'message').length },
    { value: "team", label: "Teams", count: notifications.filter(n => n.type === 'team').length },
    { value: "hackathon", label: "Hackathons", count: notifications.filter(n => n.type === 'hackathon').length },
    { value: "achievement", label: "Achievements", count: notifications.filter(n => n.type === 'achievement').length },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading notifications...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Header */}
      <div className="sticky top-0 z-40 backdrop-blur-xl bg-black/20 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0">
              <Link href="/" className="text-gray-400 hover:text-white transition-colors flex-shrink-0">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <div className="relative flex-shrink-0">
                  <Bell className="w-7 h-7 sm:w-8 sm:h-8 text-purple-400" />
                  {unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-white">{unreadCount}</span>
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent truncate">
                    Notifications
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-400 truncate">
                    {notifications.length} total • {unreadCount} unread
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              {unreadCount > 0 && (
                <Button
                  onClick={markAllAsRead}
                  size="sm"
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-2 sm:px-3"
                >
                  <CheckCheck className="w-4 h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Mark all read</span>
                </Button>
              )}
              <Button
                onClick={() => setShowSettings(!showSettings)}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white hover:bg-white/10"
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search notifications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm"
                />
              </div>

              {/* Filters */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filters
                </h3>
                <div className="space-y-1">
                  {filterOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setSelectedFilter(option.value)}
                      className={`w-full flex items-center justify-between p-2 rounded-lg text-sm transition-all duration-200 ${
                        selectedFilter === option.value
                          ? "bg-purple-600/30 text-purple-200 border border-purple-500/30"
                          : "text-gray-300 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <span>{option.label}</span>
                      <Badge variant="secondary" className="bg-gray-700/50 text-gray-300 text-xs">
                        {option.count}
                      </Badge>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-gray-300 mb-3">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Today</span>
                    <span className="text-sm font-medium text-white">
                      {notifications.filter(n => {
                        const today = new Date().toDateString()
                        return new Date(n.timestamp).toDateString() === today
                      }).length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">This week</span>
                    <span className="text-sm font-medium text-white">{notifications.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Urgent</span>
                    <span className="text-sm font-medium text-red-400">
                      {notifications.filter(n => n.priority === 'urgent').length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bell className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-300 mb-2">No notifications found</h3>
                <p className="text-gray-500">
                  {searchTerm || selectedFilter !== "all"
                    ? "Try adjusting your search or filters"
                    : "You're all caught up! Check back later for new updates."}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 transition-all duration-300 hover:bg-white/10 hover:border-white/20 ${
                      !notification.isRead ? "ring-1 ring-purple-500/30 bg-purple-500/5" : ""
                    }`}
                  >
                    {/* Pin indicator */}
                    {notification.isPinned && (
                      <div className="absolute top-2 right-2">
                        <Pin className="w-4 h-4 text-yellow-400" />
                      </div>
                    )}

                    <div className="flex items-start gap-4">
                      {/* Avatar or Icon */}
                      <div className="flex-shrink-0">
                        {notification.avatar ? (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                            <span className="text-sm font-bold text-white">
                              {notification.metadata?.sender?.charAt(0) || "U"}
                            </span>
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
                            {getNotificationIcon(notification.type, notification.priority)}
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className="text-sm font-semibold text-white group-hover:text-purple-200 transition-colors">
                            {notification.title}
                          </h4>
                          <div className="flex items-center gap-2">
                            {getPriorityBadge(notification.priority)}
                            <span className="text-xs text-gray-500 whitespace-nowrap">
                              {formatTimeAgo(notification.timestamp)}
                            </span>
                          </div>
                        </div>

                        <p className="text-sm text-gray-300 mb-2 line-clamp-2">
                          {notification.description}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="bg-gray-700/50 text-gray-300 text-xs">
                              {notification.category}
                            </Badge>
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {!notification.isRead && (
                              <Button
                                onClick={() => markAsRead(notification.id)}
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-gray-400 hover:text-green-400 hover:bg-green-400/10"
                              >
                                <Check className="w-4 h-4" />
                              </Button>
                            )}
                            <Button
                              onClick={() => togglePin(notification.id)}
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-gray-400 hover:text-yellow-400 hover:bg-yellow-400/10"
                            >
                              {notification.isPinned ? <PinOff className="w-4 h-4" /> : <Pin className="w-4 h-4" />}
                            </Button>
                            <Button
                              onClick={() => deleteNotification(notification.id)}
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-gray-400 hover:text-red-400 hover:bg-red-400/10"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Action button */}
                        {notification.actionUrl && (
                          <div className="mt-3">
                            <Link href={notification.actionUrl}>
                              <Button
                                size="sm"
                                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-xs"
                              >
                                View Details
                              </Button>
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Notification Settings</h3>
              <Button
                onClick={() => setShowSettings(false)}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white"
              >
                ✕
              </Button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Push notifications</span>
                <Button variant="ghost" size="sm" className="text-green-400">
                  <Volume2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Email notifications</span>
                <Button variant="ghost" size="sm" className="text-blue-400">
                  <Mail className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Desktop notifications</span>
                <Button variant="ghost" size="sm" className="text-purple-400">
                  <Smartphone className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-700">
              <Button
                onClick={() => setShowSettings(false)}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
              >
                Save Settings
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
