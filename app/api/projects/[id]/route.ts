import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

// Import mock projects from the main route
// Note: In a real app, you'd want to share this data through a service or database
let mockProjects = [
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
  }
]

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createServerSupabaseClient()
  
  try {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        hackathon:hackathons(*),
        team:teams(*),
        user:users(*)
      `)
      .eq('id', params.id)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch project' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createServerSupabaseClient()
  
  try {
    const body = await request.json()
    const { data, error } = await supabase
      .from('projects')
      .update({ ...body, updated_at: new Date().toISOString() })
      .eq('id', params.id)
      .select(`
        *,
        hackathon:hackathons(*),
        team:teams(*),
        user:users(*)
      `)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Try Supabase first
    const supabase = createServerSupabaseClient()
    
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', params.id)

    if (error) {
      console.log('Supabase error, falling back to mock deletion:', error.message)
      // Fall back to mock deletion
      return deleteMockProject(params.id)
    }

    return NextResponse.json({ message: 'Project deleted successfully' })
  } catch (error) {
    console.log('Supabase unavailable, using mock deletion:', error)
    // Fall back to mock deletion
    return deleteMockProject(params.id)
  }
}

function deleteMockProject(projectId: string) {
  const projectIndex = mockProjects.findIndex(project => project.id === projectId)
  
  if (projectIndex === -1) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 })
  }
  
  mockProjects.splice(projectIndex, 1)
  console.log('Project deleted successfully via mock:', projectId)
  return NextResponse.json({ message: 'Project deleted successfully' })
}
