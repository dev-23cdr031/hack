import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'
import { plagiarismDetector, ProjectData } from '@/lib/plagiarism-detector'

// Mock projects data for fallback (same as projects API)
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
    hackathon_id: null,
    team_id: null,
    created_at: '2024-03-15T10:00:00Z',
    updated_at: '2024-03-15T10:00:00Z'
  },
  {
    id: '2',
    title: 'Sustainable Energy Tracker',
    description: 'A comprehensive web application that tracks and optimizes energy consumption for households. Features include real-time monitoring, cost analysis, and environmental impact calculations.',
    technologies: ['Vue.js', 'Python', 'Flask', 'PostgreSQL'],
    github_url: 'https://github.com/user/energy-tracker',
    demo_url: 'https://energy-tracker-demo.com',
    user_id: '2',
    author: 'Divyadharshini',
    hackathon_id: null,
    team_id: null,
    created_at: '2024-02-20T14:30:00Z',
    updated_at: '2024-02-20T14:30:00Z'
  },
  {
    id: '3',
    title: 'Team Collaboration Hub',
    description: 'A real-time collaboration platform for remote teams with video chat and project management. Includes features like task tracking, file sharing, and integrated communication tools.',
    technologies: ['React', 'TypeScript', 'Socket.io', 'Express'],
    github_url: 'https://github.com/user/collab-hub',
    demo_url: 'https://collab-hub-demo.com',
    user_id: '3',
    author: 'Divakar',
    hackathon_id: null,
    team_id: null,
    created_at: '2024-01-10T09:15:00Z',
    updated_at: '2024-01-10T09:15:00Z'
  },
  {
    id: '4',
    title: 'Smart City Traffic Management',
    description: 'An intelligent traffic management system using IoT sensors and AI algorithms to optimize traffic flow in urban areas. The system provides real-time traffic updates and route optimization.',
    technologies: ['Python', 'TensorFlow', 'IoT', 'React'],
    github_url: 'https://github.com/user/smart-traffic',
    demo_url: 'https://smart-traffic-demo.com',
    user_id: '4',
    author: 'Anusree D',
    hackathon_id: null,
    team_id: null,
    created_at: '2024-01-05T16:20:00Z',
    updated_at: '2024-01-05T16:20:00Z'
  },
  {
    id: '5',
    title: 'E-Learning Platform',
    description: 'A comprehensive e-learning platform with interactive courses, quizzes, and progress tracking. Features include video streaming, discussion forums, and certificate generation.',
    technologies: ['Angular', 'Node.js', 'MySQL', 'AWS'],
    github_url: 'https://github.com/user/elearning',
    demo_url: 'https://elearning-demo.com',
    user_id: '5',
    author: 'Thangarajan Sir',
    hackathon_id: null,
    team_id: null,
    created_at: '2023-12-20T11:45:00Z',
    updated_at: '2023-12-20T11:45:00Z'
  },
  {
    id: '6',
    title: 'Blockchain Voting System',
    description: 'A secure and transparent voting system built on blockchain technology. Ensures vote integrity, anonymity, and real-time result tracking with immutable records.',
    technologies: ['Solidity', 'Web3.js', 'React', 'Ethereum'],
    github_url: 'https://github.com/user/blockchain-voting',
    demo_url: 'https://blockchain-voting-demo.com',
    user_id: '6',
    author: 'Yazlini Mam',
    hackathon_id: null,
    team_id: null,
    created_at: '2023-11-15T13:30:00Z',
    updated_at: '2023-11-15T13:30:00Z'
  },
  {
    id: '7',
    title: 'Swiggy',
    description: 'A food delivery app that connects customers with restaurants. Order your favorite food online and get it delivered to your doorstep quickly.',
    technologies: ['React Native', 'Node.js', 'MongoDB', 'KEC Maps API'],
    github_url: 'https://github.com/user/swiggy-clone',
    demo_url: 'https://swiggy-demo.com',
    user_id: '2',
    author: 'Divyadharshini',
    hackathon_id: null,
    team_id: null,
    created_at: '2024-01-05T08:30:00Z',
    updated_at: '2024-01-05T08:30:00Z'
  },
  {
    id: '8',
    title: 'Zomato',
    description: 'A comprehensive food delivery platform that allows users to browse restaurants, order meals, and track deliveries in real-time.',
    technologies: ['Flutter', 'Express', 'PostgreSQL', 'Redis'],
    github_url: 'https://github.com/user/zomato-clone',
    demo_url: 'https://zomato-demo.com',
    user_id: '3',
    author: 'Divakar',
    hackathon_id: null,
    team_id: null,
    created_at: '2023-12-28T14:20:00Z',
    updated_at: '2023-12-28T14:20:00Z'
  },
  {
    id: '9',
    title: 'FoodPanda',
    description: 'An online food ordering and delivery service connecting hungry customers with local restaurants.',
    technologies: ['Vue.js', 'Django', 'MySQL', 'Stripe'],
    github_url: 'https://github.com/user/foodpanda-clone',
    demo_url: 'https://foodpanda-demo.com',
    user_id: '4',
    author: 'Anusree D',
    hackathon_id: null,
    team_id: null,
    created_at: '2023-11-15T16:45:00Z',
    updated_at: '2023-11-15T16:45:00Z'
  }
]

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { project } = body

    if (!project) {
      return NextResponse.json(
        { error: 'Project data is required' },
        { status: 400 }
      )
    }

    // Validate required fields
    if (!project.title || !project.description) {
      return NextResponse.json(
        { error: 'Project title and description are required' },
        { status: 400 }
      )
    }

    console.log('Starting plagiarism check for project:', project.title)

    // Get existing projects for comparison
    const existingProjects = await getExistingProjects()
    
    // Convert to ProjectData format
    const targetProject: ProjectData = {
      id: project.id || 'new',
      title: project.title,
      description: project.description,
      author: project.author || 'Unknown',
      technologies: project.technologies || [],
      github_url: project.github_url,
      demo_url: project.demo_url,
      created_at: project.created_at || new Date().toISOString()
    }

    const compareProjects: ProjectData[] = existingProjects.map(p => ({
      id: p.id,
      title: p.title,
      description: p.description,
      author: p.author || 'Unknown',
      technologies: p.technologies || [],
      github_url: p.github_url,
      demo_url: p.demo_url,
      created_at: p.created_at
    }))

    // Run plagiarism detection
    const result = await plagiarismDetector.detectPlagiarism(targetProject, compareProjects)

    console.log('Plagiarism check completed:', {
      similarity: result.similarity,
      status: result.status,
      matchCount: result.matches.length
    })

    return NextResponse.json({
      success: true,
      result,
      projectsChecked: compareProjects.length,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Plagiarism check error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to check plagiarism: ' + (error instanceof Error ? error.message : 'Unknown error'),
        success: false
      },
      { status: 500 }
    )
  }
}

async function getExistingProjects() {
  try {
    // Try Supabase first
    const supabase = createServerSupabaseClient()
    
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.log('Supabase error, falling back to mock data:', error.message)
      return mockProjects
    }

    // Add author field if missing
    const projectsWithAuthor = data.map(project => ({
      ...project,
      author: project.author || 'Unknown User'
    }))

    return projectsWithAuthor
  } catch (error) {
    console.log('Supabase unavailable, using mock data:', error)
    return mockProjects
  }
}

// GET endpoint for testing
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')

    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID is required for testing' },
        { status: 400 }
      )
    }

    // Find the project to test
    const existingProjects = await getExistingProjects()
    const targetProject = existingProjects.find(p => p.id === projectId)

    if (!targetProject) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    // Convert to ProjectData format
    const projectData: ProjectData = {
      id: targetProject.id,
      title: targetProject.title,
      description: targetProject.description,
      author: targetProject.author || 'Unknown',
      technologies: targetProject.technologies || [],
      github_url: targetProject.github_url,
      demo_url: targetProject.demo_url,
      created_at: targetProject.created_at
    }

    const compareProjects: ProjectData[] = existingProjects
      .filter(p => p.id !== projectId)
      .map(p => ({
        id: p.id,
        title: p.title,
        description: p.description,
        author: p.author || 'Unknown',
        technologies: p.technologies || [],
        github_url: p.github_url,
        demo_url: p.demo_url,
        created_at: p.created_at
      }))

    // Run plagiarism detection
    const result = await plagiarismDetector.detectPlagiarism(projectData, compareProjects)

    return NextResponse.json({
      success: true,
      result,
      targetProject: projectData,
      projectsChecked: compareProjects.length,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Plagiarism test error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to test plagiarism detection: ' + (error instanceof Error ? error.message : 'Unknown error'),
        success: false
      },
      { status: 500 }
    )
  }
}
