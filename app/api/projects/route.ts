import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

// Mock projects data for fallback
const mockProjects = [
  {
    id: '1',
    title: 'AI Healthcare Assistant',
    description: 'An AI-powered healthcare assistant that helps patients manage their medications and appointments.',
    technologies: ['React', 'Node.js', 'OpenAI', 'MongoDB'],
    github_url: 'https://github.com/user/ai-healthcare',
    demo_url: 'https://ai-healthcare-demo.com',
    user_id: '1',
    hackathon_id: null,
    team_id: null,
    created_at: '2024-03-15T10:00:00Z',
    updated_at: '2024-03-15T10:00:00Z'
  },
  {
    id: '2',
    title: 'Sustainable Energy Tracker',
    description: 'A web application that tracks and optimizes energy consumption for households.',
    technologies: ['Vue.js', 'Python', 'Flask', 'PostgreSQL'],
    github_url: 'https://github.com/user/energy-tracker',
    demo_url: 'https://energy-tracker-demo.com',
    user_id: '1',
    hackathon_id: null,
    team_id: null,
    created_at: '2024-02-20T14:30:00Z',
    updated_at: '2024-02-20T14:30:00Z'
  },
  {
    id: '3',
    title: 'Team Collaboration Hub',
    description: 'A real-time collaboration platform for remote teams with video chat and project management.',
    technologies: ['React', 'TypeScript', 'Socket.io', 'Express'],
    github_url: 'https://github.com/user/collab-hub',
    demo_url: 'https://collab-hub-demo.com',
    user_id: '1',
    hackathon_id: null,
    team_id: null,
    created_at: '2024-01-10T09:15:00Z',
    updated_at: '2024-01-10T09:15:00Z'
  },
  {
    id: '4',
    title: 'Swiggy',
    description: 'A food delivery app that connects customers with restaurants. Order your favorite food online and get it delivered to your doorstep quickly.',
    technologies: ['React Native', 'Node.js', 'MongoDB', 'KEC Maps API'],
    github_url: 'https://github.com/user/swiggy-clone',
    demo_url: 'https://swiggy-demo.com',
    user_id: '2',
    hackathon_id: null,
    team_id: null,
    created_at: '2024-01-05T08:30:00Z',
    updated_at: '2024-01-05T08:30:00Z'
  },
  {
    id: '5',
    title: 'Zomato',
    description: 'A comprehensive food delivery platform that allows users to browse restaurants, order meals, and track deliveries in real-time.',
    technologies: ['Flutter', 'Express', 'PostgreSQL', 'Redis'],
    github_url: 'https://github.com/user/zomato-clone',
    demo_url: 'https://zomato-demo.com',
    user_id: '3',
    hackathon_id: null,
    team_id: null,
    created_at: '2023-12-28T14:20:00Z',
    updated_at: '2023-12-28T14:20:00Z'
  },
  {
    id: '6',
    title: 'FoodPanda',
    description: 'An online food ordering and delivery service connecting hungry customers with local restaurants.',
    technologies: ['Vue.js', 'Django', 'MySQL', 'Stripe'],
    github_url: 'https://github.com/user/foodpanda-clone',
    demo_url: 'https://foodpanda-demo.com',
    user_id: '4',
    hackathon_id: null,
    team_id: null,
    created_at: '2023-11-15T16:45:00Z',
    updated_at: '2023-11-15T16:45:00Z'
  }
]

let projectIdCounter = 7

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  
  const user_id = searchParams.get('user_id')
  const hackathon_id = searchParams.get('hackathon_id')
  const team_id = searchParams.get('team_id')

  try {
    // Try Supabase first
    const supabase = createServerSupabaseClient()
    
    let query = supabase
      .from('projects')
      .select(`
        *,
        hackathon:hackathons(*),
        team:teams(*),
        user:users(*)
      `)
      .order('created_at', { ascending: false })

    if (user_id) {
      query = query.eq('user_id', user_id)
    }

    if (hackathon_id) {
      query = query.eq('hackathon_id', hackathon_id)
    }

    if (team_id) {
      query = query.eq('team_id', team_id)
    }

    const { data, error } = await query

    if (error) {
      console.log('Supabase error, falling back to mock data:', error.message)
      // Fall back to mock data
      return getMockProjects(user_id, hackathon_id, team_id)
    }

    return NextResponse.json(data)
  } catch (error) {
    console.log('Supabase unavailable, using mock data:', error)
    // Fall back to mock data
    return getMockProjects(user_id, hackathon_id, team_id)
  }
}

function getMockProjects(user_id?: string | null, hackathon_id?: string | null, team_id?: string | null) {
  let filteredProjects = [...mockProjects]

  if (user_id) {
    filteredProjects = filteredProjects.filter(project => project.user_id === user_id)
  }

  if (hackathon_id) {
    filteredProjects = filteredProjects.filter(project => project.hackathon_id === hackathon_id)
  }

  if (team_id) {
    filteredProjects = filteredProjects.filter(project => project.team_id === team_id)
  }

  return NextResponse.json(filteredProjects)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Creating project with data:', body)

    try {
      // Try Supabase first
      const supabase = createServerSupabaseClient()
      
      const { data, error } = await supabase
        .from('projects')
        .insert([body])
        .select(`
          *,
          hackathon:hackathons(*),
          team:teams(*),
          user:users(*)
        `)
        .single()

      if (error) {
        console.log('Supabase error, falling back to mock creation:', error.message)
        // Fall back to mock creation
        return createMockProject(body)
      }

      console.log('Project created successfully via Supabase:', data.title)
      return NextResponse.json(data, { status: 201 })
    } catch (supabaseError) {
      console.log('Supabase unavailable, using mock creation:', supabaseError)
      // Fall back to mock creation
      return createMockProject(body)
    }
  } catch (error) {
    console.error('Project creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create project: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    )
  }
}

function createMockProject(projectData: any) {
  const newProject = {
    id: projectIdCounter.toString(),
    title: projectData.title,
    description: projectData.description,
    technologies: projectData.technologies || [],
    github_url: projectData.github_url || '',
    demo_url: projectData.demo_url || '',
    user_id: projectData.user_id,
    hackathon_id: projectData.hackathon_id || null,
    team_id: projectData.team_id || null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }

  // Add to mock projects array
  mockProjects.push(newProject)
  projectIdCounter++

  console.log('Project created successfully via mock:', newProject.title)
  return NextResponse.json(newProject, { status: 201 })
}
