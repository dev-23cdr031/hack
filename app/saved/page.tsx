"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { HamburgerMenu } from "@/components/hamburger-menu"
import {
  Bookmark,
  FileText,
  Video,
  Link,
  ImageIcon,
  Code,
  BookOpen,
  Download,
  Share2,
  ExternalLink,
  Search,
  Filter,
  Grid,
  List,
  Clock,
  Folder,
  Star,
  Archive,
  Trash2,
  Plus,
  Eye,
  Heart,
} from "lucide-react"

const savedItems = [
  {
    id: 1,
    type: "article",
    title: "Advanced React Patterns for Scalable Applications",
    description:
      "Learn about compound components, render props, and custom hooks to build maintainable React applications.",
    url: "https://example.com/react-patterns",
    thumbnail: "/react-code-patterns.png",
    author: "John Smith",
    source: "Dev.to",
    savedDate: "2024-01-15",
    readTime: "12 min read",
    tags: ["React", "JavaScript", "Patterns", "Frontend"],
    category: "Development",
    isRead: false,
    isFavorite: true,
  },
  {
    id: 2,
    type: "video",
    title: "System Design Interview: Designing Instagram",
    description:
      "Complete walkthrough of designing a photo-sharing application like Instagram with scalability considerations.",
    url: "https://youtube.com/watch?v=example",
    thumbnail: "/system-design-instagram.png",
    author: "Tech Interview Pro",
    source: "YouTube",
    savedDate: "2024-01-14",
    duration: "45 min",
    tags: ["System Design", "Interview", "Scalability", "Architecture"],
    category: "Career",
    isRead: false,
    isFavorite: false,
  },
  {
    id: 3,
    type: "code",
    title: "Authentication Middleware for Express.js",
    description: "Reusable JWT authentication middleware with role-based access control for Node.js applications.",
    url: "https://github.com/example/auth-middleware",
    thumbnail: "/nodejs-authentication-code.png",
    author: "DevCommunity",
    source: "GitHub",
    savedDate: "2024-01-13",
    language: "JavaScript",
    stars: 1250,
    tags: ["Node.js", "Authentication", "JWT", "Middleware"],
    category: "Code Snippets",
    isRead: true,
    isFavorite: false,
  },
  {
    id: 4,
    type: "resource",
    title: "Complete Guide to Docker for Developers",
    description: "Comprehensive resource covering Docker fundamentals, best practices, and deployment strategies.",
    url: "https://docker-guide.dev",
    thumbnail: "/docker-containers-guide.png",
    author: "Container Academy",
    source: "Docker Guide",
    savedDate: "2024-01-12",
    pages: 150,
    tags: ["Docker", "DevOps", "Containers", "Deployment"],
    category: "DevOps",
    isRead: false,
    isFavorite: true,
  },
  {
    id: 5,
    type: "link",
    title: "AI Tools for Developers in 2024",
    description: "Curated list of the best AI-powered tools that can boost developer productivity and code quality.",
    url: "https://ai-dev-tools.com",
    thumbnail: "/ai-development-tools.png",
    author: "AI Weekly",
    source: "AI Weekly",
    savedDate: "2024-01-11",
    tags: ["AI", "Tools", "Productivity", "Development"],
    category: "Tools",
    isRead: true,
    isFavorite: false,
  },
  {
    id: 6,
    type: "image",
    title: "Database Schema Design Patterns",
    description: "Visual guide to common database design patterns and when to use them in your applications.",
    url: "https://example.com/db-patterns.png",
    thumbnail: "/placeholder-rm6lq.png",
    author: "DB Expert",
    source: "Database Weekly",
    savedDate: "2024-01-10",
    tags: ["Database", "Schema", "Design", "Patterns"],
    category: "Database",
    isRead: false,
    isFavorite: true,
  },
]

const categories = [
  { name: "All", count: savedItems.length, color: "bg-blue-600" },
  {
    name: "Development",
    count: savedItems.filter((item) => item.category === "Development").length,
    color: "bg-green-600",
  },
  { name: "Career", count: savedItems.filter((item) => item.category === "Career").length, color: "bg-purple-600" },
  {
    name: "Code Snippets",
    count: savedItems.filter((item) => item.category === "Code Snippets").length,
    color: "bg-orange-600",
  },
  { name: "DevOps", count: savedItems.filter((item) => item.category === "DevOps").length, color: "bg-red-600" },
  { name: "Tools", count: savedItems.filter((item) => item.category === "Tools").length, color: "bg-yellow-600" },
  { name: "Database", count: savedItems.filter((item) => item.category === "Database").length, color: "bg-indigo-600" },
]

export default function SavedPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [sortBy, setSortBy] = useState("recent")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredItems = savedItems.filter((item) => {
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case "recent":
        return new Date(b.savedDate).getTime() - new Date(a.savedDate).getTime()
      case "oldest":
        return new Date(a.savedDate).getTime() - new Date(b.savedDate).getTime()
      case "name":
        return a.title.localeCompare(b.title)
      case "favorites":
        return b.isFavorite ? 1 : -1
      default:
        return 0
    }
  })

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "article":
        return FileText
      case "video":
        return Video
      case "code":
        return Code
      case "resource":
        return BookOpen
      case "link":
        return Link
      case "image":
        return ImageIcon
      default:
        return Bookmark
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "article":
        return "bg-blue-600"
      case "video":
        return "bg-red-600"
      case "code":
        return "bg-green-600"
      case "resource":
        return "bg-purple-600"
      case "link":
        return "bg-orange-600"
      case "image":
        return "bg-pink-600"
      default:
        return "bg-gray-600"
    }
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
                <div className="p-2 bg-blue-600 rounded-lg">
                  <Bookmark className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Saved Items</h1>
                  <p className="text-sm text-gray-400">Your bookmarked content and resources</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="relative hidden sm:block">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search saved items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 w-40 lg:w-60"
                />
              </div>
              <div className="flex items-center gap-1 bg-gray-800 rounded-lg p-1">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className={viewMode === "grid" ? "bg-blue-600" : "text-gray-300"}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className={viewMode === "list" ? "bg-blue-600" : "text-gray-300"}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 px-2 sm:px-4">
                <Plus className="w-4 h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Add Item</span>
                <span className="sm:hidden">Add</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-white flex items-center gap-2">
                  <Archive className="w-4 h-4" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Total Saved</span>
                  <span className="text-2xl font-bold text-blue-400">{savedItems.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Unread</span>
                  <span className="text-lg font-semibold text-orange-400">
                    {savedItems.filter((item) => !item.isRead).length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Favorites</span>
                  <span className="text-lg font-semibold text-pink-400">
                    {savedItems.filter((item) => item.isFavorite).length}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Categories */}
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-white flex items-center gap-2">
                  <Folder className="w-4 h-4" />
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

            {/* Sort Options */}
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-white flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Sort By
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  { value: "recent", label: "Most Recent" },
                  { value: "oldest", label: "Oldest First" },
                  { value: "name", label: "Name (A-Z)" },
                  { value: "favorites", label: "Favorites First" },
                ].map((sort) => (
                  <button
                    key={sort.value}
                    onClick={() => setSortBy(sort.value)}
                    className={`w-full text-left p-2 rounded-lg transition-all duration-200 ${
                      sortBy === sort.value ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-700/50"
                    }`}
                  >
                    {sort.label}
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white">
                  <Eye className="w-4 h-4 mr-2" />
                  Mark All as Read
                </Button>
                <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white">
                  <Download className="w-4 h-4 mr-2" />
                  Export Saved Items
                </Button>
                <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear Read Items
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {selectedCategory === "All" ? "All Saved Items" : selectedCategory}
                </h2>
                <p className="text-gray-400 mt-1">{sortedItems.length} items found</p>
              </div>
            </div>

            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {sortedItems.map((item) => {
                  const TypeIcon = getTypeIcon(item.type)
                  return (
                    <Card
                      key={item.id}
                      className="bg-gray-800/50 border-gray-700 backdrop-blur-sm hover:border-gray-600 transition-all duration-300 group cursor-pointer overflow-hidden"
                    >
                      <div className="relative">
                        <img
                          src={item.thumbnail || "/placeholder.svg"}
                          alt={item.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-3 left-3">
                          <Badge className={`${getTypeColor(item.type)} text-white`}>{item.type}</Badge>
                        </div>
                        <div className="absolute top-3 right-3 flex gap-2">
                          {item.isFavorite && (
                            <div className="p-1 bg-black/50 rounded-full backdrop-blur-sm">
                              <Heart className="w-4 h-4 text-pink-400 fill-pink-400" />
                            </div>
                          )}
                          {!item.isRead && <div className="w-3 h-3 bg-orange-400 rounded-full"></div>}
                        </div>
                        <div className="absolute bottom-3 right-3">
                          <Button size="sm" variant="secondary" className="bg-black/50 backdrop-blur-sm border-0">
                            <TypeIcon className="w-4 h-4 text-white" />
                          </Button>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors line-clamp-2">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-400 mb-3 line-clamp-2">{item.description}</p>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-sm text-gray-300">
                            <span className="font-medium">{item.author}</span>
                            <span className="text-gray-500">•</span>
                            <span>{item.source}</span>
                          </div>

                          {item.readTime && (
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                              <Clock className="w-3 h-3" />
                              {item.readTime}
                            </div>
                          )}

                          {item.duration && (
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                              <Video className="w-3 h-3" />
                              {item.duration}
                            </div>
                          )}

                          {item.stars && (
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                              <Star className="w-3 h-3 text-yellow-400" />
                              {item.stars} stars
                            </div>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-1 mb-4">
                          {item.tags.slice(0, 3).map((tag, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs bg-gray-700 text-gray-300">
                              {tag}
                            </Badge>
                          ))}
                          {item.tags.length > 3 && (
                            <Badge variant="secondary" className="text-xs bg-gray-700 text-gray-300">
                              +{item.tags.length - 3}
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-gray-700">
                          <div className="text-xs text-gray-500">
                            Saved {new Date(item.savedDate).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                              <Share2 className="w-4 h-4" />
                            </Button>
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
            ) : (
              <div className="space-y-4">
                {sortedItems.map((item) => {
                  const TypeIcon = getTypeIcon(item.type)
                  return (
                    <Card
                      key={item.id}
                      className="bg-gray-800/50 border-gray-700 backdrop-blur-sm hover:border-gray-600 transition-all duration-300 group cursor-pointer"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <img
                            src={item.thumbnail || "/placeholder.svg"}
                            alt={item.title}
                            className="w-24 h-24 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-3">
                                <TypeIcon className="w-5 h-5 text-gray-400" />
                                <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                                  {item.title}
                                </h3>
                                <Badge className={`${getTypeColor(item.type)} text-white`}>{item.type}</Badge>
                                {item.isFavorite && <Heart className="w-4 h-4 text-pink-400 fill-pink-400" />}
                                {!item.isRead && <div className="w-2 h-2 bg-orange-400 rounded-full"></div>}
                              </div>
                              <div className="flex items-center gap-2">
                                <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                                  <Share2 className="w-4 h-4" />
                                </Button>
                                <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                                  <ExternalLink className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                            <p className="text-gray-400 mb-3">{item.description}</p>
                            <div className="flex items-center gap-6 text-sm text-gray-300 mb-3">
                              <span>
                                {item.author} • {item.source}
                              </span>
                              {item.readTime && (
                                <div className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {item.readTime}
                                </div>
                              )}
                              {item.duration && (
                                <div className="flex items-center gap-1">
                                  <Video className="w-3 h-3" />
                                  {item.duration}
                                </div>
                              )}
                              {item.stars && (
                                <div className="flex items-center gap-1">
                                  <Star className="w-3 h-3 text-yellow-400" />
                                  {item.stars} stars
                                </div>
                              )}
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span>Saved {new Date(item.savedDate).toLocaleDateString()}</span>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {item.tags.map((tag, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs bg-gray-700 text-gray-300">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
