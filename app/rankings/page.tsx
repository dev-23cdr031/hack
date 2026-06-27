"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Trophy,
  Medal,
  Award,
  TrendingUp,
  TrendingDown,
  Minus,
  Star,
  Users,
  Code,
  GitBranch,
  Calendar,
  Target,
  Crown,
  Zap,
  Filter,
  Search,
  BarChart3,
  Activity,
  Sparkles,
  ChevronUp,
  ChevronDown,
  ExternalLink,
  Github,
  Linkedin,
  Globe
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface User {
  id: string
  name: string
  title: string
  avatar_url: string
  hackathons_won: number
  hackathons_participated: number
  total_projects: number
  skill_endorsements: number
  years_experience: number
  github_contributions: number
  skills: string[]
  ranking_score: number
  rank: number
  rank_change?: number
  previous_rank?: number
  github_url?: string
  linkedin_url?: string
  portfolio_url?: string
}

interface RankingStats {
  total_users: number
  total_hackathon_wins: number
  total_projects: number
  average_experience: number
  top_performer: string
}

interface RankingResponse {
  rankings: User[]
  stats: RankingStats
  category: string
  algorithm_info: {
    description: string
    factors: string[]
  }
}

export default function RankingsPage() {
  const [rankings, setRankings] = useState<User[]>([])
  const [stats, setStats] = useState<RankingStats | null>(null)
  const [algorithmInfo, setAlgorithmInfo] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('overall')
  const [searchTerm, setSearchTerm] = useState('')
  const [showAlgorithm, setShowAlgorithm] = useState(false)

  const categories = [
    { id: 'overall', label: 'Overall Rankings', icon: Trophy, color: 'from-yellow-400 to-orange-500' },
    { id: 'hackathon_winners', label: 'Hackathon Winners', icon: Crown, color: 'from-purple-400 to-pink-500' },
    { id: 'active_participants', label: 'Active Participants', icon: Activity, color: 'from-blue-400 to-cyan-500' },
    { id: 'experienced', label: 'Experienced Developers', icon: Star, color: 'from-green-400 to-emerald-500' },
    { id: 'rising_stars', label: 'Rising Stars', icon: Sparkles, color: 'from-pink-400 to-rose-500' }
  ]

  useEffect(() => {
    fetchRankings()
  }, [category])

  const fetchRankings = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/rankings?category=${category}&limit=50`)
      const data: RankingResponse = await response.json()
      setRankings(data.rankings)
      setStats(data.stats)
      setAlgorithmInfo(data.algorithm_info)
    } catch (error) {
      console.error('Failed to fetch rankings:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredRankings = rankings.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-400" />
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />
      default:
        return <span className="text-lg font-bold text-gray-400">#{rank}</span>
    }
  }

  const getRankChangeIcon = (change?: number) => {
    if (!change || change === 0) return <Minus className="w-4 h-4 text-gray-500" />
    if (change > 0) return <ChevronUp className="w-4 h-4 text-green-500" />
    return <ChevronDown className="w-4 h-4 text-red-500" />
  }

  const getRankBadgeColor = (rank: number) => {
    if (rank === 1) return 'from-yellow-400 to-orange-500'
    if (rank === 2) return 'from-gray-300 to-gray-500'
    if (rank === 3) return 'from-amber-500 to-yellow-600'
    if (rank <= 10) return 'from-purple-400 to-pink-500'
    if (rank <= 25) return 'from-blue-400 to-cyan-500'
    return 'from-gray-400 to-gray-600'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900">
      {/* Header */}
      <div className="bg-gray-900/95 backdrop-blur-sm border-b border-gray-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                HackConnect Rankings
              </h1>
              <p className="text-gray-100 mt-2 font-medium">
                Discover the top performers in our developer community
              </p>
            </div>
            
            {/* Search */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search developers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-500 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent w-64"
                />
              </div>
              
              <Button
                onClick={() => setShowAlgorithm(!showAlgorithm)}
                variant="outline"
                className="border-gray-400 text-white hover:bg-gray-600 hover:text-white font-medium bg-gray-800"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Algorithm
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <div className="bg-gradient-to-br from-blue-600/30 to-cyan-600/30 backdrop-blur-sm border border-blue-400/60 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8 text-blue-400" />
                <div>
                  <p className="text-2xl font-bold text-white">{stats.total_users}</p>
                  <p className="text-sm text-gray-100 font-semibold">Total Users</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-yellow-600/30 to-orange-600/30 backdrop-blur-sm border border-yellow-400/60 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <Trophy className="w-8 h-8 text-yellow-400" />
                <div>
                  <p className="text-2xl font-bold text-white">{stats.total_hackathon_wins}</p>
                  <p className="text-sm text-gray-100 font-semibold">Total Wins</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-green-600/30 to-emerald-600/30 backdrop-blur-sm border border-green-400/60 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <Code className="w-8 h-8 text-green-400" />
                <div>
                  <p className="text-2xl font-bold text-white">{stats.total_projects}</p>
                  <p className="text-sm text-gray-100 font-semibold">Projects</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-600/30 to-pink-600/30 backdrop-blur-sm border border-purple-400/60 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-8 h-8 text-purple-400" />
                <div>
                  <p className="text-2xl font-bold text-white">{stats.average_experience}y</p>
                  <p className="text-sm text-gray-100 font-semibold">Avg Experience</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-pink-600/30 to-rose-600/30 backdrop-blur-sm border border-pink-400/60 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <Crown className="w-8 h-8 text-pink-400" />
                <div>
                  <p className="text-lg font-bold text-white truncate">{stats.top_performer}</p>
                  <p className="text-sm text-gray-100 font-semibold">Top Performer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Category Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex flex-wrap gap-3">
          {categories.map((cat) => {
            const IconComponent = cat.icon
            return (
              <Button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                variant={category === cat.id ? "default" : "outline"}
                className={`${
                  category === cat.id
                    ? `bg-gradient-to-r ${cat.color} text-white border-0`
                    : 'border-gray-400 text-white hover:bg-gray-600 hover:text-white font-medium bg-gray-800'
                } transition-all duration-300`}
              >
                <IconComponent className="w-4 h-4 mr-2" />
                {cat.label}
              </Button>
            )
          })}
        </div>
      </div>

      {/* Algorithm Info */}
      {showAlgorithm && algorithmInfo && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <div className="bg-gray-800 backdrop-blur-sm border border-gray-500 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-400" />
              Ranking Algorithm
            </h3>
            <p className="text-gray-100 mb-4 font-semibold">{algorithmInfo.description}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {algorithmInfo.factors.map((factor: string, index: number) => (
                <div key={index} className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-purple-400" />
                  <span className="text-sm text-gray-100 font-semibold">{factor}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Rankings List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRankings.map((user, index) => (
              <div
                key={user.id}
                className={`bg-gray-800 backdrop-blur-sm border border-gray-500 rounded-xl p-6 hover:border-purple-400 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 hover:bg-gray-750`}
              >
                <div className="flex items-center gap-6">
                  {/* Rank */}
                  <div className="flex-shrink-0 flex items-center gap-3">
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${getRankBadgeColor(user.rank)} flex items-center justify-center`}>
                      {getRankIcon(user.rank)}
                    </div>
                    <div className="text-center">
                      <div className="flex items-center gap-1">
                        {getRankChangeIcon(user.rank_change)}
                        {user.rank_change && user.rank_change !== 0 && (
                          <span className={`text-sm font-medium ${user.rank_change > 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {Math.abs(user.rank_change)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <Image
                          src={user.avatar_url}
                          alt={user.name}
                          width={60}
                          height={60}
                          className="rounded-full border-2 border-gray-600"
                        />
                        <div>
                          <h3 className="text-xl font-semibold text-white">{user.name}</h3>
                          <p className="text-gray-100 font-semibold">{user.title}</p>
                          <div className="flex items-center gap-4 mt-2">
                            {user.github_url && (
                              <Link href={user.github_url} className="text-gray-400 hover:text-white transition-colors">
                                <Github className="w-4 h-4" />
                              </Link>
                            )}
                            {user.linkedin_url && (
                              <Link href={user.linkedin_url} className="text-gray-400 hover:text-white transition-colors">
                                <Linkedin className="w-4 h-4" />
                              </Link>
                            )}
                            {user.portfolio_url && (
                              <Link href={user.portfolio_url} className="text-gray-400 hover:text-white transition-colors">
                                <Globe className="w-4 h-4" />
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Score */}
                      <div className="text-right">
                        <div className="text-2xl font-bold text-white">{user.ranking_score.toLocaleString()}</div>
                        <div className="text-sm text-gray-100 font-semibold">Score</div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mt-4">
                      <div className="bg-yellow-600/40 border border-yellow-400/70 rounded-lg p-3 text-center">
                        <Trophy className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
                        <div className="text-lg font-bold text-white">{user.hackathons_won}</div>
                        <div className="text-xs text-white font-bold">Wins</div>
                      </div>
                      
                      <div className="bg-blue-600/40 border border-blue-400/70 rounded-lg p-3 text-center">
                        <Target className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                        <div className="text-lg font-bold text-white">{user.hackathons_participated}</div>
                        <div className="text-xs text-white font-bold">Events</div>
                      </div>
                      
                      <div className="bg-green-600/40 border border-green-400/70 rounded-lg p-3 text-center">
                        <Code className="w-5 h-5 text-green-400 mx-auto mb-1" />
                        <div className="text-lg font-bold text-white">{user.total_projects}</div>
                        <div className="text-xs text-white font-bold">Projects</div>
                      </div>
                      
                      <div className="bg-purple-600/40 border border-purple-400/70 rounded-lg p-3 text-center">
                        <Star className="w-5 h-5 text-purple-400 mx-auto mb-1" />
                        <div className="text-lg font-bold text-white">{user.skill_endorsements}</div>
                        <div className="text-xs text-white font-bold">Endorsements</div>
                      </div>
                      
                      <div className="bg-orange-600/40 border border-orange-400/70 rounded-lg p-3 text-center">
                        <Calendar className="w-5 h-5 text-orange-400 mx-auto mb-1" />
                        <div className="text-lg font-bold text-white">{user.years_experience}y</div>
                        <div className="text-xs text-white font-bold">Experience</div>
                      </div>
                      
                      <div className="bg-pink-600/40 border border-pink-400/70 rounded-lg p-3 text-center">
                        <GitBranch className="w-5 h-5 text-pink-400 mx-auto mb-1" />
                        <div className="text-lg font-bold text-white">{user.github_contributions}</div>
                        <div className="text-xs text-white font-bold">Commits</div>
                      </div>
                    </div>

                    {/* Skills */}
                    <div className="mt-4">
                      <div className="flex flex-wrap gap-2">
                        {user.skills.slice(0, 8).map((skill, skillIndex) => (
                          <span
                            key={skillIndex}
                            className="px-3 py-1 bg-gray-700 border border-gray-400 rounded-full text-xs text-white font-semibold"
                          >
                            {skill}
                          </span>
                        ))}
                        {user.skills.length > 8 && (
                          <span className="px-3 py-1 bg-gray-700 border border-gray-400 rounded-full text-xs text-white font-semibold">
                            +{user.skills.length - 8} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredRankings.length === 0 && !loading && (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No results found</h3>
            <p className="text-gray-100">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  )
}
