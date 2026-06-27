import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'
import { plagiarismDetector, ProjectData, PlagiarismResult } from '@/lib/plagiarism-detector'

interface BatchResult {
  projectId: string
  projectTitle: string
  author: string
  result: PlagiarismResult
  processingTime: number
}

interface BatchSummary {
  totalProjects: number
  originalProjects: number
  suspiciousProjects: number
  plagiarizedProjects: number
  averageScore: number
  processingTime: number
}

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    const body = await request.json()
    const { hackathonId, teamId, userId, includeAll = false } = body

    console.log('Starting batch plagiarism check with filters:', {
      hackathonId,
      teamId,
      userId,
      includeAll
    })

    // Get projects to check
    const projects = await getProjectsForBatch(hackathonId, teamId, userId, includeAll)
    
    if (projects.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No projects found for plagiarism checking',
        results: [],
        summary: {
          totalProjects: 0,
          originalProjects: 0,
          suspiciousProjects: 0,
          plagiarizedProjects: 0,
          averageScore: 0,
          processingTime: Date.now() - startTime
        }
      })
    }

    console.log(`Processing ${projects.length} projects for plagiarism detection`)

    // Convert to ProjectData format
    const projectsData: ProjectData[] = projects.map(p => ({
      id: p.id,
      title: p.title,
      description: p.description,
      author: p.author || 'Unknown',
      technologies: p.technologies || [],
      github_url: p.github_url,
      demo_url: p.demo_url,
      created_at: p.created_at
    }))

    // Process each project
    const results: BatchResult[] = []
    
    for (const project of projectsData) {
      const projectStartTime = Date.now()
      
      try {
        // Compare against all other projects
        const compareProjects = projectsData.filter(p => p.id !== project.id)
        const result = await plagiarismDetector.detectPlagiarism(project, compareProjects)
        
        results.push({
          projectId: project.id,
          projectTitle: project.title,
          author: project.author,
          result,
          processingTime: Date.now() - projectStartTime
        })

        console.log(`Processed project "${project.title}": ${result.status} (${result.similarity}%)`)
      } catch (error) {
        console.error(`Error processing project ${project.id}:`, error)
        // Continue with other projects
      }
    }

    // Generate summary
    const summary: BatchSummary = generateBatchSummary(results, startTime)

    console.log('Batch plagiarism check completed:', summary)

    return NextResponse.json({
      success: true,
      results: results.sort((a, b) => b.result.similarity - a.result.similarity),
      summary,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Batch plagiarism check error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to perform batch plagiarism check: ' + (error instanceof Error ? error.message : 'Unknown error'),
        success: false,
        processingTime: Date.now() - startTime
      },
      { status: 500 }
    )
  }
}

async function getProjectsForBatch(
  hackathonId?: string, 
  teamId?: string, 
  userId?: string, 
  includeAll: boolean = false
) {
  try {
    // Try Supabase first
    const supabase = createServerSupabaseClient()
    
    let query = supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })

    // Apply filters if not including all
    if (!includeAll) {
      if (hackathonId) {
        query = query.eq('hackathon_id', hackathonId)
      }
      if (teamId) {
        query = query.eq('team_id', teamId)
      }
      if (userId) {
        query = query.eq('user_id', userId)
      }
    }

    const { data, error } = await query

    if (error) {
      console.log('Supabase error, falling back to mock data:', error.message)
      return getMockProjectsForBatch(hackathonId, teamId, userId, includeAll)
    }

    // Add author field if missing
    const projectsWithAuthor = data.map(project => ({
      ...project,
      author: project.author || 'Unknown User'
    }))

    return projectsWithAuthor
  } catch (error) {
    console.log('Supabase unavailable, using mock data:', error)
    return getMockProjectsForBatch(hackathonId, teamId, userId, includeAll)
  }
}

function getMockProjectsForBatch(
  hackathonId?: string, 
  teamId?: string, 
  userId?: string, 
  includeAll: boolean = false
) {
  // Extended mock data for batch testing
  const mockProjects = [
    {
      id: '1',
      title: 'AI Healthcare Assistant',
      description: 'An AI-powered healthcare assistant that helps patients manage their medications and appointments. The system uses machine learning algorithms to provide personalized health recommendations and reminders.',
      technologies: ['React', 'Node.js', 'OpenAI', 'MongoDB'],
      github_url: 'https://github.com/user/ai-healthcare',
      demo_url: 'https://ai-healthcare-demo.com',
      user_id: '1',
      author: 'Dev Dharrshan',
      hackathon_id: 'hack1',
      team_id: 'team1',
      created_at: '2024-03-15T10:00:00Z'
    },
    {
      id: '2',
      title: 'Healthcare AI Assistant',
      description: 'An artificial intelligence healthcare assistant that assists patients in managing medications and scheduling appointments. Uses ML algorithms for personalized health recommendations.',
      technologies: ['React', 'Node.js', 'OpenAI', 'MongoDB'],
      github_url: 'https://github.com/user/healthcare-ai',
      demo_url: 'https://healthcare-ai-demo.com',
      user_id: '2',
      author: 'Divyadharshini',
      hackathon_id: 'hack1',
      team_id: 'team2',
      created_at: '2024-03-16T10:00:00Z'
    },
    {
      id: '3',
      title: 'Sustainable Energy Tracker',
      description: 'A comprehensive web application that tracks and optimizes energy consumption for households. Features include real-time monitoring, cost analysis, and environmental impact calculations.',
      technologies: ['Vue.js', 'Python', 'Flask', 'PostgreSQL'],
      github_url: 'https://github.com/user/energy-tracker',
      demo_url: 'https://energy-tracker-demo.com',
      user_id: '3',
      author: 'Divakar',
      hackathon_id: 'hack2',
      team_id: 'team3',
      created_at: '2024-02-20T14:30:00Z'
    },
    {
      id: '4',
      title: 'Team Collaboration Hub',
      description: 'A real-time collaboration platform for remote teams with video chat and project management. Includes features like task tracking, file sharing, and integrated communication tools.',
      technologies: ['React', 'TypeScript', 'Socket.io', 'Express'],
      github_url: 'https://github.com/user/collab-hub',
      demo_url: 'https://collab-hub-demo.com',
      user_id: '4',
      author: 'Anusree D',
      hackathon_id: 'hack2',
      team_id: 'team4',
      created_at: '2024-01-10T09:15:00Z'
    },
    {
      id: '5',
      title: 'Smart City Traffic Management',
      description: 'An intelligent traffic management system using IoT sensors and AI algorithms to optimize traffic flow in urban areas. The system provides real-time traffic updates and route optimization.',
      technologies: ['Python', 'TensorFlow', 'IoT', 'React'],
      github_url: 'https://github.com/user/smart-traffic',
      demo_url: 'https://smart-traffic-demo.com',
      user_id: '5',
      author: 'Thangarajan Sir',
      hackathon_id: 'hack3',
      team_id: 'team5',
      created_at: '2024-01-05T16:20:00Z'
    },
    {
      id: '6',
      title: 'E-Learning Platform',
      description: 'A comprehensive e-learning platform with interactive courses, quizzes, and progress tracking. Features include video streaming, discussion forums, and certificate generation.',
      technologies: ['Angular', 'Node.js', 'MySQL', 'AWS'],
      github_url: 'https://github.com/user/elearning',
      demo_url: 'https://elearning-demo.com',
      user_id: '6',
      author: 'Yazlini Mam',
      hackathon_id: 'hack3',
      team_id: 'team6',
      created_at: '2023-12-20T11:45:00Z'
    }
  ]

  if (includeAll) {
    return mockProjects
  }

  let filtered = mockProjects

  if (hackathonId) {
    filtered = filtered.filter(p => p.hackathon_id === hackathonId)
  }
  if (teamId) {
    filtered = filtered.filter(p => p.team_id === teamId)
  }
  if (userId) {
    filtered = filtered.filter(p => p.user_id === userId)
  }

  return filtered
}

function generateBatchSummary(results: BatchResult[], startTime: number): BatchSummary {
  const totalProjects = results.length
  const originalProjects = results.filter(r => r.result.status === 'ORIGINAL').length
  const suspiciousProjects = results.filter(r => r.result.status === 'SUSPICIOUS').length
  const plagiarizedProjects = results.filter(r => r.result.status === 'PLAGIARIZED').length
  
  const averageScore = totalProjects > 0 
    ? Math.round(results.reduce((sum, r) => sum + r.result.similarity, 0) / totalProjects)
    : 0

  return {
    totalProjects,
    originalProjects,
    suspiciousProjects,
    plagiarizedProjects,
    averageScore,
    processingTime: Date.now() - startTime
  }
}

// GET endpoint for getting batch check status/history
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    
    // This would typically fetch from a database of batch check results
    // For now, return a sample response
    return NextResponse.json({
      success: true,
      recentBatches: [
        {
          id: 'batch_1',
          timestamp: new Date().toISOString(),
          summary: {
            totalProjects: 6,
            originalProjects: 4,
            suspiciousProjects: 1,
            plagiarizedProjects: 1,
            averageScore: 25,
            processingTime: 1250
          },
          filters: { includeAll: true }
        }
      ],
      message: 'Batch check history retrieved successfully'
    })
  } catch (error) {
    console.error('Error getting batch history:', error)
    return NextResponse.json(
      { error: 'Failed to get batch history' },
      { status: 500 }
    )
  }
}
