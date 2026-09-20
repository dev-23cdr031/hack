"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { HamburgerMenu } from "@/components/hamburger-menu"
import {
  Heart,
  Star,
  Trophy,
  Users,
  Calendar,
  Filter,
  Search,
  Grid,
  List,
  Bookmark,
  Share2,
  ExternalLink,
  TrendingUp,
  Code,
  Sparkles,
} from "lucide-react"

const favoriteItems = [
  {
    id: 1,
    type: "hackathon",
    title: "AI Innovation Challenge 2024",
    description: "Build the next generation of AI-powered applications that solve real-world problems.",
    image: "/ai-hackathon.png",
    prize: "$100,000",
    participants: 2500,
    deadline: "2024-02-15",
    location: "KEC, Erode Tamilnadu",
    tags: ["AI", "Machine Learning", "Innovation"],
    difficulty: "Advanced",
    rating: 4.9,
    savedDate: "2024-01-10",
    status: "upcoming",
    teamLead: "TechCorp",
  },
  {
    id: 2,
    type: "team",
    title: "CodeCrafters Elite",
    description: "A passionate team of full-stack developers specializing in modern web technologies.",
    image: "/team-collaboration.png",
    members: 5,
    skills: ["React", "Node.js", "Python", "AWS"],
    projects: 12,
    rating: 4.8,
    savedDate: "2024-01-08",
    status: "active",
    location: "Remote",
  },
  {
    id: 3,
    type: "project",
    title: "EcoTrack - Sustainability Dashboard",
    description: "A comprehensive platform for tracking and reducing carbon footprint in organizations.",
    image: "/sustainability-dashboard.png",
    tech: ["React", "D3.js", "Node.js", "MongoDB"],
    stars: 1250,
    forks: 340,
    contributors: 8,
    savedDate: "2024-01-05",
    status: "active",
    category: "Environment",
  },
  {
    id: 4,
    type: "hackathon",
    title: "Blockchain Revolution Hackathon",
    description: "Create decentralized applications that will shape the future of finance and technology.",
    image: "/blockchain-hackathon.png",
    prize: "$75,000",
    participants: 1800,
    deadline: "2024-03-01",
    location: "KEC, Erode Tamilnadu",
    tags: ["Blockchain", "DeFi", "Web3"],
    difficulty: "Intermediate",
    rating: 4.7,
    savedDate: "2024-01-12",
    status: "registration-open",
    teamLead: "CryptoInnovate",
  },
  {
    id: 5,
    type: "guide",
    title: "Dev Dharrshan",
    description: "Senior Software Engineer at KEC with 10+ years of experience in AI and machine learning.",
    image: "/placeholder-3lzdi.png",
    expertise: ["AI/ML", "Python", "TensorFlow", "System Design"],
    rating: 4.9,
    sessions: 150,
    savedDate: "2024-01-07",
    status: "available",
    company: "KEC",
  },
  {
    id: 6,
    type: "resource",
    title: "Complete Guide to System Design",
    description: "Comprehensive resource covering scalable system architecture and design patterns.",
    image: "/placeholder-46h8b.png",
    type_detail: "Course",
    duration: "40 hours",
    rating: 4.8,
    students: 25000,
    savedDate: "2024-01-09",
    status: "available",
    author: "Tech Academy",
  },
]

export default function FavoritesPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [filterType, setFilterType] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("recent")

  const filteredItems = filterType === "all" ? favoriteItems : favoriteItems.filter((item) => item.type === filterType)

  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case "recent":
        return new Date(b.savedDate).getTime() - new Date(a.savedDate).getTime()
      case "rating":
        return (b.rating || 0) - (a.rating || 0)
      case "name":
        return a.title.localeCompare(b.title)
      default:
        return 0
    }
  })

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "hackathon":
        return Trophy
      case "team":
        return Users
      case "project":
        return Code
      case "guide":
        return Star
      case "resource":
        return Bookmark
      default:
        return Heart
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-600"
      case "active":
        return "bg-green-600"
      case "registration-open":
        return "bg-purple-600"
      case "available":
        return "bg-emerald-600"
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
                <div className="p-2 bg-pink-600 rounded-lg">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Favorites</h1>
                  <p className="text-sm text-gray-400">Your saved items and bookmarks</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 bg-transparent px-2 sm:px-3">
                <Search className="w-4 h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Search</span>
              </Button>
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
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats */}
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Total Favorites</span>
                  <span className="text-2xl font-bold text-pink-400">{favoriteItems.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">This Week</span>
                  <span className="text-lg font-semibold text-white">3</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Categories</span>
                  <span className="text-lg font-semibold text-white">6</span>
                </div>
              </CardContent>
            </Card>

            {/* Filters */}
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-white flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Categories
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { value: "all", label: "All Items", count: favoriteItems.length, icon: Heart },
                  {
                    value: "hackathon",
                    label: "Hackathons",
                    count: favoriteItems.filter((i) => i.type === "hackathon").length,
                    icon: Trophy,
                  },
                  {
                    value: "team",
                    label: "Teams",
                    count: favoriteItems.filter((i) => i.type === "team").length,
                    icon: Users,
                  },
                  {
                    value: "project",
                    label: "Projects",
                    count: favoriteItems.filter((i) => i.type === "project").length,
                    icon: Code,
                  },
                  {
                    value: "guide",
                    label: "Teammates",
                    count: favoriteItems.filter((i) => i.type === "guide").length,
                    icon: Star,
                  },
                  {
                    value: "resource",
                    label: "Resources",
                    count: favoriteItems.filter((i) => i.type === "resource").length,
                    icon: Bookmark,
                  },
                ].map((filter) => {
                  const Icon = filter.icon
                  return (
                    <button
                      key={filter.value}
                      onClick={() => setFilterType(filter.value)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                        filterType === filter.value
                          ? "bg-pink-600 text-white"
                          : "bg-gray-700/50 text-gray-300 hover:bg-gray-700"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        <span>{filter.label}</span>
                      </div>
                      <Badge variant="secondary" className="bg-gray-600 text-white">
                        {filter.count}
                      </Badge>
                    </button>
                  )
                })}
              </CardContent>
            </Card>

            {/* Sort Options */}
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Sort By
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  { value: "recent", label: "Recently Added" },
                  { value: "rating", label: "Highest Rated" },
                  { value: "name", label: "Name (A-Z)" },
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
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {filterType === "all"
                    ? "All Favorites"
                    : `${filterType.charAt(0).toUpperCase() + filterType.slice(1)}s`}
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
                          src={item.image || "/placeholder.svg"}
                          alt={item.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-3 left-3">
                          <Badge className={`${getStatusColor(item.status)} text-white`}>
                            {item.status.replace("-", " ")}
                          </Badge>
                        </div>
                        <div className="absolute top-3 right-3">
                          <div className="p-2 bg-black/50 rounded-full backdrop-blur-sm">
                            <TypeIcon className="w-4 h-4 text-white" />
                          </div>
                        </div>
                        <div className="absolute bottom-3 right-3">
                          <Button size="sm" variant="secondary" className="bg-black/50 backdrop-blur-sm border-0">
                            <Heart className="w-4 h-4 text-pink-400 fill-pink-400" />
                          </Button>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-400 mb-3 line-clamp-2">{item.description}</p>

                        {item.type === "hackathon" && (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-gray-300">
                              <Trophy className="w-4 h-4 text-yellow-400" />
                              {item.prize}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-300">
                              <Users className="w-4 h-4" />
                              {item.participants} participants
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-300">
                              <Calendar className="w-4 h-4" />
                              Deadline: {new Date(item.deadline).toLocaleDateString()}
                            </div>
                          </div>
                        )}

                        {item.type === "team" && (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-gray-300">
                              <Users className="w-4 h-4" />
                              {item.members} members
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {item.skills?.slice(0, 3).map((skill, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {item.type === "project" && (
                          <div className="space-y-2">
                            <div className="flex items-center gap-4 text-sm text-gray-300">
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 text-yellow-400" />
                                {item.stars}
                              </div>
                              <div className="flex items-center gap-1">
                                <Code className="w-4 h-4" />
                                {item.forks}
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {item.tech?.slice(0, 3).map((tech, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  {tech}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-700">
                          <div className="flex items-center gap-2">
                            {item.rating && (
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                <span className="text-sm text-gray-300">{item.rating}</span>
                              </div>
                            )}
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
                            src={item.image || "/placeholder.svg"}
                            alt={item.title}
                            className="w-20 h-20 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-3">
                                <TypeIcon className="w-5 h-5 text-gray-400" />
                                <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                                  {item.title}
                                </h3>
                                <Badge className={`${getStatusColor(item.status)} text-white`}>
                                  {item.status.replace("-", " ")}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                                  <Share2 className="w-4 h-4" />
                                </Button>
                                <Button size="sm" variant="ghost" className="text-pink-400 hover:text-pink-300">
                                  <Heart className="w-4 h-4 fill-pink-400" />
                                </Button>
                              </div>
                            </div>
                            <p className="text-gray-400 mb-3">{item.description}</p>
                            <div className="flex items-center gap-6 text-sm text-gray-300">
                              {item.rating && (
                                <div className="flex items-center gap-1">
                                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                  <span>{item.rating}</span>
                                </div>
                              )}
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>Saved {new Date(item.savedDate).toLocaleDateString()}</span>
                              </div>
                              {item.type === "hackathon" && (
                                <div className="flex items-center gap-1">
                                  <Trophy className="w-4 h-4 text-yellow-400" />
                                  <span>{item.prize}</span>
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
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
