"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { HamburgerMenu } from "@/components/hamburger-menu"
import {
  Zap,
  Search,
  Users,
  Trophy,
  MessageCircle,
  Calendar,
  Bookmark,
  Share2,
  Download,
  Upload,
  Settings,
  Bell,
  Star,
  Heart,
  ExternalLink,
  Terminal,
  Shield,
  Rocket,
  Target,
  Lightbulb,
  Filter,
  Grid,
  List,
  BarChart3,
  TrendingUp,
  Layers,
} from "lucide-react"

const quickActions = [
  {
    id: 1,
    title: "Create New Team",
    description: "Start a new team for your next hackathon project",
    icon: Users,
    category: "Team Management",
    color: "text-blue-400",
    bgColor: "bg-blue-400/10",
    action: "create-team",
    shortcut: "Ctrl+T",
    popular: true,
  },
  {
    id: 2,
    title: "Join Hackathon",
    description: "Browse and register for upcoming hackathons",
    icon: Trophy,
    category: "Competitions",
    color: "text-yellow-400",
    bgColor: "bg-yellow-400/10",
    action: "join-hackathon",
    shortcut: "Ctrl+H",
    popular: true,
  },
  {
    id: 3,
    title: "Quick Message",
    description: "Send a message to your team or teammates",
    icon: MessageCircle,
    category: "Communication",
    color: "text-green-400",
    bgColor: "bg-green-400/10",
    action: "send-message",
    shortcut: "Ctrl+M",
    popular: false,
  },
  {
    id: 4,
    title: "Schedule Meeting",
    description: "Set up a meeting with your team members",
    icon: Calendar,
    category: "Scheduling",
    color: "text-purple-400",
    bgColor: "bg-purple-400/10",
    action: "schedule-meeting",
    shortcut: "Ctrl+S",
    popular: true,
  },
  {
    id: 5,
    title: "Save Resource",
    description: "Bookmark useful articles, tutorials, or tools",
    icon: Bookmark,
    category: "Resources",
    color: "text-pink-400",
    bgColor: "bg-pink-400/10",
    action: "save-resource",
    shortcut: "Ctrl+B",
    popular: false,
  },
  {
    id: 6,
    title: "Share Project",
    description: "Share your project with the community",
    icon: Share2,
    category: "Sharing",
    color: "text-cyan-400",
    bgColor: "bg-cyan-400/10",
    action: "share-project",
    shortcut: "Ctrl+Shift+S",
    popular: true,
  },
  {
    id: 7,
    title: "Upload Code",
    description: "Upload your project code to the repository",
    icon: Upload,
    category: "Development",
    color: "text-orange-400",
    bgColor: "bg-orange-400/10",
    action: "upload-code",
    shortcut: "Ctrl+U",
    popular: false,
  },
  {
    id: 8,
    title: "Download Template",
    description: "Get starter templates for your projects",
    icon: Download,
    category: "Templates",
    color: "text-indigo-400",
    bgColor: "bg-indigo-400/10",
    action: "download-template",
    shortcut: "Ctrl+D",
    popular: true,
  },
  {
    id: 9,
    title: "Quick Settings",
    description: "Access frequently used settings",
    icon: Settings,
    category: "Configuration",
    color: "text-gray-400",
    bgColor: "bg-gray-400/10",
    action: "quick-settings",
    shortcut: "Ctrl+,",
    popular: false,
  },
  {
    id: 10,
    title: "View Notifications",
    description: "Check your latest notifications and updates",
    icon: Bell,
    category: "Notifications",
    color: "text-red-400",
    bgColor: "bg-red-400/10",
    action: "view-notifications",
    shortcut: "Ctrl+N",
    popular: true,
  },
  {
    id: 11,
    title: "Star Project",
    description: "Add projects to your favorites list",
    icon: Star,
    category: "Favorites",
    color: "text-yellow-300",
    bgColor: "bg-yellow-300/10",
    action: "star-project",
    shortcut: "Ctrl+F",
    popular: false,
  },
  {
    id: 12,
    title: "Like Post",
    description: "Show appreciation for community posts",
    icon: Heart,
    category: "Social",
    color: "text-pink-300",
    bgColor: "bg-pink-300/10",
    action: "like-post",
    shortcut: "Ctrl+L",
    popular: false,
  },
  {
    id: 13,
    title: "View Analytics",
    description: "Check your project and team analytics",
    icon: BarChart3,
    category: "Analytics",
    color: "text-emerald-400",
    bgColor: "bg-emerald-400/10",
    action: "view-analytics",
    shortcut: "Ctrl+A",
    popular: true,
  },
  {
    id: 14,
    title: "Deploy Project",
    description: "Deploy your project to the cloud",
    icon: Rocket,
    category: "Deployment",
    color: "text-violet-400",
    bgColor: "bg-violet-400/10",
    action: "deploy-project",
    shortcut: "Ctrl+Shift+D",
    popular: true,
  },
  {
    id: 15,
    title: "Generate API Key",
    description: "Create new API keys for your applications",
    icon: Shield,
    category: "Security",
    color: "text-red-300",
    bgColor: "bg-red-300/10",
    action: "generate-api-key",
    shortcut: "Ctrl+K",
    popular: false,
  },
  {
    id: 16,
    title: "Open Terminal",
    description: "Launch integrated terminal for development",
    icon: Terminal,
    category: "Development",
    color: "text-green-300",
    bgColor: "bg-green-300/10",
    action: "open-terminal",
    shortcut: "Ctrl+`",
    popular: true,
  },
]

const categories = [
  { name: "All", count: quickActions.length, color: "bg-gray-600" },
  {
    name: "Team Management",
    count: quickActions.filter((a) => a.category === "Team Management").length,
    color: "bg-blue-600",
  },
  {
    name: "Competitions",
    count: quickActions.filter((a) => a.category === "Competitions").length,
    color: "bg-yellow-600",
  },
  {
    name: "Communication",
    count: quickActions.filter((a) => a.category === "Communication").length,
    color: "bg-green-600",
  },
  {
    name: "Development",
    count: quickActions.filter((a) => a.category === "Development").length,
    color: "bg-orange-600",
  },
  { name: "Analytics", count: quickActions.filter((a) => a.category === "Analytics").length, color: "bg-emerald-600" },
  { name: "Deployment", count: quickActions.filter((a) => a.category === "Deployment").length, color: "bg-violet-600" },
]

export default function QuickActionsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [showPopularOnly, setShowPopularOnly] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const filteredActions = quickActions.filter((action) => {
    const matchesCategory = selectedCategory === "All" || action.category === selectedCategory
    const matchesSearch =
      action.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      action.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      action.category.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesPopular = !showPopularOnly || action.popular
    return matchesCategory && matchesSearch && matchesPopular
  })

  const handleActionClick = (actionId: string) => {
    console.log(`Executing action: ${actionId}`)
    // Here you would implement the actual action logic
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <div className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <HamburgerMenu />
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-600 rounded-lg">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Quick Actions</h1>
                  <p className="text-sm text-gray-400">Shortcuts and productivity tools</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search actions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                />
              </div>
              <div className="flex items-center gap-1 bg-gray-800 rounded-lg p-1">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className={viewMode === "grid" ? "bg-purple-600" : "text-gray-300"}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className={viewMode === "list" ? "bg-purple-600" : "text-gray-300"}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-purple-600/20 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-200 mb-1">Total Actions</p>
                  <p className="text-3xl font-bold text-purple-400">{quickActions.length}</p>
                </div>
                <div className="p-3 bg-purple-600/20 rounded-lg">
                  <Zap className="w-8 h-8 text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border-blue-600/20 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-200 mb-1">Popular</p>
                  <p className="text-3xl font-bold text-blue-400">{quickActions.filter((a) => a.popular).length}</p>
                </div>
                <div className="p-3 bg-blue-600/20 rounded-lg">
                  <TrendingUp className="w-8 h-8 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 border-green-600/20 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-200 mb-1">Categories</p>
                  <p className="text-3xl font-bold text-green-400">{categories.length - 1}</p>
                </div>
                <div className="p-3 bg-green-600/20 rounded-lg">
                  <Layers className="w-8 h-8 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-600/20 to-red-600/20 border-orange-600/20 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-orange-200 mb-1">Shortcuts</p>
                  <p className="text-3xl font-bold text-orange-400">{quickActions.filter((a) => a.shortcut).length}</p>
                </div>
                <div className="p-3 bg-orange-600/20 rounded-lg">
                  <Target className="w-8 h-8 text-orange-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Categories */}
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-white flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Categories
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.name}
                    onClick={() => setSelectedCategory(category.name)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                      selectedCategory === category.name
                        ? `${category.color} text-white`
                        : "bg-gray-700/50 text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    <span>{category.name}</span>
                    <Badge variant="secondary" className="bg-gray-600 text-white">
                      {category.count}
                    </Badge>
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Filters */}
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-white">Filters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showPopularOnly}
                    onChange={(e) => setShowPopularOnly(e.target.checked)}
                    className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
                  />
                  <span className="text-gray-300">Show popular only</span>
                </label>
              </CardContent>
            </Card>

            {/* Keyboard Shortcuts */}
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-white flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" />
                  Pro Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-gray-300">
                <div className="p-3 bg-gray-700/30 rounded-lg">
                  <p className="font-medium text-white mb-1">Keyboard Shortcuts</p>
                  <p>Use Ctrl + key combinations to quickly execute actions</p>
                </div>
                <div className="p-3 bg-gray-700/30 rounded-lg">
                  <p className="font-medium text-white mb-1">Search</p>
                  <p>Type to search actions by name, description, or category</p>
                </div>
                <div className="p-3 bg-gray-700/30 rounded-lg">
                  <p className="font-medium text-white mb-1">Popular Actions</p>
                  <p>Filter by popular to see most used actions</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {selectedCategory === "All" ? "All Quick Actions" : selectedCategory}
                </h2>
                <p className="text-gray-400 mt-1">{filteredActions.length} actions available</p>
              </div>
            </div>

            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredActions.map((action) => {
                  const Icon = action.icon
                  return (
                    <Card
                      key={action.id}
                      className="bg-gray-800/50 border-gray-700 backdrop-blur-sm hover:border-gray-600 transition-all duration-300 group cursor-pointer overflow-hidden"
                      onClick={() => handleActionClick(action.action)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div
                            className={`p-4 rounded-xl ${action.bgColor} group-hover:scale-110 transition-transform duration-200`}
                          >
                            <Icon className={`w-6 h-6 ${action.color}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                                {action.title}
                              </h3>
                              {action.popular && <Badge className="bg-yellow-600 text-white ml-2">Popular</Badge>}
                            </div>
                            <p className="text-sm text-gray-400 mb-4 line-clamp-2">{action.description}</p>
                            <div className="flex items-center justify-between">
                              <Badge variant="secondary" className="bg-gray-700 text-gray-300">
                                {action.category}
                              </Badge>
                              {action.shortcut && (
                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                  <kbd className="px-2 py-1 bg-gray-700 rounded text-gray-300">{action.shortcut}</kbd>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredActions.map((action) => {
                  const Icon = action.icon
                  return (
                    <Card
                      key={action.id}
                      className="bg-gray-800/50 border-gray-700 backdrop-blur-sm hover:border-gray-600 transition-all duration-300 group cursor-pointer"
                      onClick={() => handleActionClick(action.action)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          <div
                            className={`p-3 rounded-lg ${action.bgColor} group-hover:scale-110 transition-transform duration-200`}
                          >
                            <Icon className={`w-5 h-5 ${action.color}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                                {action.title}
                              </h3>
                              <div className="flex items-center gap-2">
                                {action.popular && <Badge className="bg-yellow-600 text-white">Popular</Badge>}
                                {action.shortcut && (
                                  <kbd className="px-2 py-1 bg-gray-700 rounded text-xs text-gray-300">
                                    {action.shortcut}
                                  </kbd>
                                )}
                              </div>
                            </div>
                            <p className="text-gray-400 mb-2">{action.description}</p>
                            <Badge variant="secondary" className="bg-gray-700 text-gray-300">
                              {action.category}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}

            {filteredActions.length === 0 && (
              <div className="text-center py-12">
                <div className="p-4 bg-gray-800/50 rounded-lg inline-block mb-4">
                  <Search className="w-12 h-12 text-gray-500" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No actions found</h3>
                <p className="text-gray-400 mb-4">
                  Try adjusting your search query or filters to find what you're looking for.
                </p>
                <Button
                  onClick={() => {
                    setSearchQuery("")
                    setSelectedCategory("All")
                    setShowPopularOnly(false)
                  }}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
