import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

export async function POST() {
  try {
    const supabase = createServerSupabaseClient()
    
    // Insert sample users first
    const { data: users, error: usersError } = await supabase
      .from('users')
      .upsert([
        {
          id: '550e8400-e29b-41d4-a716-446655440001',
          email: 'dev.dharrshan@example.com',
          name: 'Dev Dharrshan',
          title: 'Full Stack Developer',
          bio: 'Passionate about building innovative solutions through code.',
          skills: ['JavaScript', 'React', 'Node.js', 'Python'],
          avatar_url: 'https://xsgames.co/randomusers/avatar.php?g=male&id=dev'
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440002',
          email: 'divya.dharshini@example.com',
          name: 'Divya Dharshini',
          title: 'UI/UX Designer & Frontend Developer',
          bio: 'Creating beautiful and functional user experiences.',
          skills: ['React', 'TypeScript', 'UI/UX', 'CSS'],
          avatar_url: 'https://xsgames.co/randomusers/avatar.php?g=female&id=divya'
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440003',
          email: 'divakar@example.com',
          name: 'Divakar',
          title: 'Backend Developer & DevOps',
          bio: 'Building scalable systems and infrastructure.',
          skills: ['Python', 'Docker', 'AWS', 'PostgreSQL'],
          avatar_url: 'https://xsgames.co/randomusers/avatar.php?g=male&id=divakar'
        }
      ], { onConflict: 'id' })
      .select()

    if (usersError) {
      return NextResponse.json({
        status: 'error',
        message: 'Failed to insert users',
        error: usersError.message
      }, { status: 500 })
    }

    // Insert sample hackathons
    const { data: hackathons, error: hackathonsError } = await supabase
      .from('hackathons')
      .upsert([
        {
          id: '660e8400-e29b-41d4-a716-446655440001',
          title: 'Global AI Challenge',
          description: 'Build innovative AI solutions that can change the world. Focus on machine learning, computer vision, and natural language processing.',
          image_url: '/ai-hackathon.png',
          start_date: '2024-03-15T09:00:00Z',
          end_date: '2024-03-17T18:00:00Z',
          location: 'Online',
          type: 'online',
          themes: ['Artificial Intelligence', 'Machine Learning', 'Computer Vision'],
          max_participants: 500,
          current_participants: 124,
          status: 'upcoming'
        },
        {
          id: '660e8400-e29b-41d4-a716-446655440002',
          title: 'Web3 Buildathon',
          description: 'Create the next generation of decentralized applications. Build on blockchain, explore DeFi, and innovate with smart contracts.',
          image_url: '/blockchain-hackathon.png',
          start_date: '2024-04-05T10:00:00Z',
          end_date: '2024-04-07T20:00:00Z',
          location: 'KEC, Erode Tamilnadu',
          type: 'in-person',
          themes: ['Blockchain', 'Smart Contracts', 'DeFi'],
          max_participants: 200,
          current_participants: 89,
          status: 'upcoming'
        },
        {
          id: '660e8400-e29b-41d4-a716-446655440003',
          title: 'CodeFest 2024',
          description: 'The ultimate coding competition. Build web apps, mobile apps, and showcase your development skills.',
          image_url: '/coding-hackathon.png',
          start_date: '2024-05-10T08:00:00Z',
          end_date: '2024-05-12T22:00:00Z',
          location: 'KEC, Erode Tamilnadu + Online',
          type: 'hybrid',
          themes: ['Web Development', 'Mobile Apps', 'Cloud'],
          max_participants: 300,
          current_participants: 156,
          status: 'upcoming'
        }
      ], { onConflict: 'id' })
      .select()

    if (hackathonsError) {
      return NextResponse.json({
        status: 'error',
        message: 'Failed to insert hackathons',
        error: hackathonsError.message
      }, { status: 500 })
    }

    return NextResponse.json({
      status: 'success',
      message: 'Sample data inserted successfully',
      inserted: {
        users: users?.length || 0,
        hackathons: hackathons?.length || 0
      }
    })
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'Seeding failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
