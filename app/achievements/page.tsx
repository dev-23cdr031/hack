"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { HamburgerMenu } from "@/components/hamburger-menu"
import {
  Award,
  Trophy,
  Star,
  Crown,
  Target,
  Zap,
  Users,
  Code,
  Heart,
  Shield,
  Flame,
  Gem,
  Sparkles,
  TrendingUp,
  Lock,
  CheckCircle,
  Clock,
  Filter,
  Search,
  Share2,
} from "lucide-react"

const achievements = [
  {
    id: 1,
    title: "First Steps",
    description: "Complete your profile and join your first hackathon",
    icon: Target,
    category: "Getting Started",
    rarity: "Common",
    points: 100,
    progress: 100,
    maxProgress: 100,
    unlocked: true,
    unlockedDate: "2024-01-10",
    color: "text-green-400",
    bgColor: "bg-green-400/10",
    borderColor: "border-green-400/20",
  },
  {
    id: 2,
    title: "Team Player",
    description: "Successfully collaborate with 10+ different team members",
    icon: Users,
    category: "Collaboration",
    rarity: "Rare",
    points: 500,
    progress: 100,
    maxProgress: 100,
    unlocked: true,
    unlockedDate: "2024-01-13",
    color: "text-blue-400",
    bgColor: "bg-blue-400/10",
    borderColor: "border-blue-400/20",
  },
  {
    id: 3,
    title: "Code Warrior",
    description: "Make 100+ commits across different repositories",
    icon: Code,
    category: "Development",
    rarity: "Epic",
    points: 1000,
    progress: 87,
    maxProgress: 100,
    unlocked: false,
    color: "text-purple-400",
    bgColor: "bg-purple-400/10",
    borderColor: "border-purple-400/20",
  },
  {
    id: 4,
    title: "Hackathon Hero",
    description: "Win first place in any hackathon competition",
    icon: Trophy,
    category: "Competition",
    rarity: "Legendary",
    points: 2000,
    progress: 0,
    maxProgress: 1,
    unlocked: false,
    color: "text-yellow-400",
    bgColor: "bg-yellow-400/10",
    borderColor: "border-yellow-400/20",
  },
  {
    id: 5,
    title: "Streak Master",
    description: "Maintain a 30-day activity streak",
    icon: Flame,
    category: "Consistency",
    rarity: "Rare",
    points: 750,
    progress: 23,
    maxProgress: 30,
    unlocked: false,
    color: "text-orange-400",
    bgColor: "bg-orange-400/10",
    borderColor: "border-orange-400/20",
  },
  {
    id: 6,
    title: "Guide",
    description: "Help 5+ junior developers in their projects",
    icon: Heart,
    category: "Community",
    rarity: "Epic",
    points: 1200,
    progress: 3,
    maxProgress: 5,
    unlocked: false,
    color: "text-pink-400",
    bgColor: "bg-pink-400/10",
    borderColor: "border-pink-400/20",
  },
  {
    id: 7,
    title: "Innovation Pioneer",
    description: "Create a project that gets 1000+ stars on GitHub",
    icon: Star,
    category: "Innovation",
    rarity: "Legendary",
    points: 2500,
    progress: 0,
    maxProgress: 1000,
    unlocked: false,
    color: "text-cyan-400",
    bgColor: "bg-cyan-400/10",
    borderColor: "border-cyan-400/20",
  },
  {
    id: 8,
    title: "Speed Demon",
    description: "Complete a hackathon project in under 24 hours",
    icon: Zap,
    category: "Speed",
    rarity: "Rare",
    points: 600,
    progress: 100,
    maxProgress: 100,
    unlocked: true,
    unlockedDate: "2024-01-08",
    color: "text-yellow-300",
    bgColor: "bg-yellow-300/10",
    borderColor: "border-yellow-300/20",
  },
  {
    id: 9,
    title: "Guardian",
    description: "Report and help resolve 10+ security vulnerabilities",
    icon: Shield,
    category: "Security",
    rarity: "Epic",
    points: 1500,
    progress: 7,
    maxProgress: 10,
    unlocked: false,
    color: "text-red-400",
    bgColor: "bg-red-400/10",
    borderColor: "border-red-400/20",
  },
  {
    id: 10,
    title: "Diamond Coder",
    description: "Achieve perfect code quality score in 5+ projects",
    icon: Gem,
    category: "Quality",
    rarity: "Legendary",
    points: 3000,
    progress: 2,
    maxProgress: 5,
    unlocked: false,
    color: "text-indigo-400",
    bgColor: "bg-indigo-400/10",
    borderColor: "border-indigo-400/20",
  },
]

const categories = [
  { name: "All", count: achievements.length, color: "bg-gray-600" },
  {
    name: "Getting Started",
    count: achievements.filter((a) => a.category === "Getting Started").length,
    color: "bg-green-600",
  },
  {
    name: "Collaboration",
    count: achievements.filter((a) => a.category === "Collaboration").length,
    color: "bg-blue-600",
  },
  {
    name: "Development",
    count: achievements.filter((a) => a.category === "Development").length,
    color: "bg-purple-600",
  },
  {
    name: "Competition",
    count: achievements.filter((a) => a.category === "Competition").length,
    color: "bg-yellow-600",
  },
  { name: "Community", count: achievements.filter((a) => a.category === "Community").length, color: "bg-pink-600" },
  { name: "Innovation", count: achievements.filter((a) => a.category === "Innovation").length, color: "bg-cyan-600" },
]

const rarityColors = {
  Common: "text-gray-400 border-gray-400/20",
  Rare: "text-blue-400 border-blue-400/20",
  Epic: "text-purple-400 border-purple-400/20",
  Legendary: "text-yellow-400 border-yellow-400/20",
}

export default function AchievementsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [showUnlockedOnly, setShowUnlockedOnly] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredAchievements = achievements.filter((achievement) => {
    const matchesCategory = selectedCategory === "All" || achievement.category === selectedCategory
    const matchesUnlocked = !showUnlockedOnly || achievement.unlocked
    const matchesSearch =
      achievement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      achievement.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesUnlocked && matchesSearch
  })

  const totalPoints = achievements.filter((a) => a.unlocked).reduce((sum, a) => sum + a.points, 0)
  const unlockedCount = achievements.filter((a) => a.unlocked).length
  const completionRate = Math.round((unlockedCount / achievements.length) * 100)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <div className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <HamburgerMenu />
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-600 rounded-lg">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Achievements</h1>
                  <p className="text-sm text-gray-400">Track your progress and unlock rewards</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="relative hidden sm:block">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search achievements..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 w-40 lg:w-60"
                />
              </div>
              <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 bg-transparent px-2 sm:px-3">
                <Share2 className="w-4 h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Share</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border-yellow-600/20 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-yellow-200 mb-1">Total Points</p>
                  <p className="text-3xl font-bold text-yellow-400">{totalPoints.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-yellow-600/20 rounded-lg">
                  <Sparkles className="w-8 h-8 text-yellow-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-blue-600/20 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-200 mb-1">Unlocked</p>
                  <p className="text-3xl font-bold text-blue-400">
                    {unlockedCount}/{achievements.length}
                  </p>
                </div>
                <div className="p-3 bg-blue-600/20 rounded-lg">
                  <CheckCircle className="w-8 h-8 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 border-green-600/20 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-200 mb-1">Completion</p>
                  <p className="text-3xl font-bold text-green-400">{completionRate}%</p>
                </div>
                <div className="p-3 bg-green-600/20 rounded-lg">
                  <TrendingUp className="w-8 h-8 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-purple-600/20 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-200 mb-1">Rank</p>
                  <p className="text-3xl font-bold text-purple-400">Gold</p>
                </div>
                <div className="p-3 bg-purple-600/20 rounded-lg">
                  <Crown className="w-8 h-8 text-purple-400" />
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
                    checked={showUnlockedOnly}
                    onChange={(e) => setShowUnlockedOnly(e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-gray-300">Show unlocked only</span>
                </label>
              </CardContent>
            </Card>

            {/* Progress Overview */}
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-white">Progress Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Overall Progress</span>
                    <span className="text-white">{completionRate}%</span>
                  </div>
                  <Progress value={completionRate} className="h-2" />
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Common</span>
                    <span className="text-gray-300">
                      {achievements.filter((a) => a.rarity === "Common" && a.unlocked).length}/
                      {achievements.filter((a) => a.rarity === "Common").length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Rare</span>
                    <span className="text-blue-300">
                      {achievements.filter((a) => a.rarity === "Rare" && a.unlocked).length}/
                      {achievements.filter((a) => a.rarity === "Rare").length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Epic</span>
                    <span className="text-purple-300">
                      {achievements.filter((a) => a.rarity === "Epic" && a.unlocked).length}/
                      {achievements.filter((a) => a.rarity === "Epic").length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Legendary</span>
                    <span className="text-yellow-300">
                      {achievements.filter((a) => a.rarity === "Legendary" && a.unlocked).length}/
                      {achievements.filter((a) => a.rarity === "Legendary").length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Achievements Grid */}
          <div className="lg:col-span-3">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {selectedCategory === "All" ? "All Achievements" : selectedCategory}
                </h2>
                <p className="text-gray-400 mt-1">{filteredAchievements.length} achievements found</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredAchievements.map((achievement) => {
                const Icon = achievement.icon
                const isLocked = !achievement.unlocked

                return (
                  <Card
                    key={achievement.id}
                    className={`relative overflow-hidden transition-all duration-300 hover:scale-105 ${
                      isLocked
                        ? "bg-gray-800/30 border-gray-700/50"
                        : `${achievement.bgColor} ${achievement.borderColor} border-2`
                    } backdrop-blur-sm group cursor-pointer`}
                  >
                    {isLocked && (
                      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-[1px] z-10 flex items-center justify-center">
                        <Lock className="w-8 h-8 text-gray-500" />
                      </div>
                    )}

                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div
                          className={`p-4 rounded-xl ${achievement.bgColor} group-hover:scale-110 transition-transform duration-200`}
                        >
                          <Icon className={`w-8 h-8 ${achievement.color}`} />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3
                                className={`font-bold text-lg ${isLocked ? "text-gray-500" : "text-white"} group-hover:text-blue-400 transition-colors`}
                              >
                                {achievement.title}
                              </h3>
                              <Badge
                                variant="secondary"
                                className={`mt-1 ${rarityColors[achievement.rarity as keyof typeof rarityColors]} bg-transparent border`}
                              >
                                {achievement.rarity}
                              </Badge>
                            </div>
                            <div className="text-right">
                              <div className={`text-2xl font-bold ${achievement.color}`}>{achievement.points}</div>
                              <div className="text-xs text-gray-400">points</div>
                            </div>
                          </div>

                          <p className={`text-sm mb-4 ${isLocked ? "text-gray-500" : "text-gray-300"}`}>
                            {achievement.description}
                          </p>

                          {/* Progress Bar */}
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className={isLocked ? "text-gray-500" : "text-gray-400"}>Progress</span>
                              <span className={isLocked ? "text-gray-500" : "text-white"}>
                                {achievement.progress}/{achievement.maxProgress}
                              </span>
                            </div>
                            <Progress value={(achievement.progress / achievement.maxProgress) * 100} className="h-2" />
                          </div>

                          {achievement.unlocked && achievement.unlockedDate && (
                            <div className="flex items-center gap-2 mt-4 text-sm text-gray-400">
                              <Clock className="w-4 h-4" />
                              <span>Unlocked on {new Date(achievement.unlockedDate).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
