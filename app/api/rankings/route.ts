import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'
import { mockUsers } from '../users/mockData'

// Advanced ranking algorithm that considers multiple factors
function calculateRankingScore(user: any): number {
  const {
    hackathons_won = 0,
    hackathons_participated = 0,
    total_projects = 0,
    skill_endorsements = 0,
    years_experience = 0,
    github_contributions = 0,
    skills = []
  } = user

  // Weighted scoring system
  const weights = {
    hackathons_won: 100,        // Most important factor
    win_rate: 50,               // Win percentage
    hackathons_participated: 20, // Participation shows engagement
    total_projects: 15,         // Project portfolio
    skill_endorsements: 10,     // Community validation
    years_experience: 25,       // Experience matters
    github_contributions: 0.05, // GitHub activity (scaled down)
    skill_diversity: 30         // Number of different skills
  }

  // Calculate win rate (avoid division by zero)
  const win_rate = hackathons_participated > 0 ? (hackathons_won / hackathons_participated) : 0
  
  // Calculate skill diversity bonus
  const skill_diversity = skills.length

  // Calculate total score
  const score = 
    (hackathons_won * weights.hackathons_won) +
    (win_rate * weights.win_rate) +
    (hackathons_participated * weights.hackathons_participated) +
    (total_projects * weights.total_projects) +
    (skill_endorsements * weights.skill_endorsements) +
    (years_experience * weights.years_experience) +
    (github_contributions * weights.github_contributions) +
    (skill_diversity * weights.skill_diversity)

  return Math.round(score * 100) / 100 // Round to 2 decimal places
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const limit = parseInt(searchParams.get('limit') || '50')
  const category = searchParams.get('category') || 'overall'

  try {
    // For demo purposes, use mock data with calculated rankings
    console.log('Calculating rankings with advanced algorithm')
    
    // Calculate scores and add ranking data
    const usersWithScores = mockUsers.map(user => ({
      ...user,
      ranking_score: calculateRankingScore(user)
    }))

    // Sort by ranking score (highest first)
    const sortedUsers = usersWithScores.sort((a, b) => b.ranking_score - a.ranking_score)

    // Add rank positions
    const rankedUsers = sortedUsers.map((user, index) => ({
      ...user,
      rank: index + 1,
      rank_change: Math.floor(Math.random() * 5) - 2, // Random rank change for demo
      previous_rank: index + 1 + (Math.floor(Math.random() * 5) - 2)
    }))

    // Apply category filtering if needed
    let filteredUsers = rankedUsers
    if (category !== 'overall') {
      switch (category) {
        case 'hackathon_winners':
          filteredUsers = rankedUsers.filter(user => user.hackathons_won > 0)
          break
        case 'active_participants':
          filteredUsers = rankedUsers.filter(user => user.hackathons_participated >= 5)
          break
        case 'experienced':
          filteredUsers = rankedUsers.filter(user => user.years_experience >= 3)
          break
        case 'rising_stars':
          filteredUsers = rankedUsers.filter(user => user.years_experience <= 3 && user.hackathons_won > 0)
          break
      }
    }

    // Apply limit
    const limitedUsers = filteredUsers.slice(0, limit)

    // Calculate statistics
    const stats = {
      total_users: rankedUsers.length,
      total_hackathon_wins: rankedUsers.reduce((sum, user) => sum + user.hackathons_won, 0),
      total_projects: rankedUsers.reduce((sum, user) => sum + user.total_projects, 0),
      average_experience: Math.round(rankedUsers.reduce((sum, user) => sum + user.years_experience, 0) / rankedUsers.length * 10) / 10,
      top_performer: rankedUsers[0]?.name || 'N/A'
    }

    return NextResponse.json({
      rankings: limitedUsers,
      stats,
      category,
      algorithm_info: {
        description: 'Advanced multi-factor ranking algorithm',
        factors: [
          'Hackathons Won (100 pts each)',
          'Win Rate (50 pts per %)',
          'Participation (20 pts each)',
          'Projects (15 pts each)',
          'Skill Endorsements (10 pts each)',
          'Experience (25 pts per year)',
          'GitHub Activity (0.05 pts per contribution)',
          'Skill Diversity (30 pts per skill)'
        ]
      }
    })

  } catch (error) {
    console.error('Rankings API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch rankings' },
      { status: 500 }
    )
  }
}

// Get individual user ranking
export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json()
    
    // Calculate all rankings first
    const usersWithScores = mockUsers.map(user => ({
      ...user,
      ranking_score: calculateRankingScore(user)
    }))

    const sortedUsers = usersWithScores.sort((a, b) => b.ranking_score - a.ranking_score)
    
    // Find specific user
    const userRank = sortedUsers.findIndex(user => user.id === userId)
    
    if (userRank === -1) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const userRanking = {
      ...sortedUsers[userRank],
      rank: userRank + 1,
      percentile: Math.round((1 - userRank / sortedUsers.length) * 100),
      users_above: userRank,
      users_below: sortedUsers.length - userRank - 1
    }

    return NextResponse.json(userRanking)
    
  } catch (error) {
    console.error('User ranking API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user ranking' },
      { status: 500 }
    )
  }
}
