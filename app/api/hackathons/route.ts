import { NextRequest, NextResponse } from 'next/server'
import type { Hackathon } from '@/lib/types'
import { mockHackathons } from '@/lib/mock-hackathons'

// DevPost hackathon scraper
async function scrapeDevPostHackathons(): Promise<Hackathon[]> {
  try {
    return mockHackathons
  } catch (error) {
    console.error('Error scraping DevPost hackathons:', error)
    // Return empty array as fallback
    return []
  }
}

// Store created hackathons in memory (in production, this would be in a database)
let createdHackathons: Hackathon[] = []
let hackathonIdCounter = 4 // Start from 4 since we have devpost-1, devpost-2, devpost-3

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const type = searchParams.get('type')
    const location = searchParams.get('location')
    const country = searchParams.get('country')
    const state = searchParams.get('state')

    // Fetch real hackathon data from DevPost
    let hackathons = await scrapeDevPostHackathons()
    
    // Add created hackathons to the list
    hackathons = [...hackathons, ...createdHackathons]

    // Filter hackathons based on parameters
    if (status && status !== 'all') {
      hackathons = hackathons.filter(h => h.status === status)
    }

    if (type && type !== 'all') {
      hackathons = hackathons.filter(h => h.type === type)
    }

    if (location && location !== 'all') {
      if (location === 'worldwide') {
        hackathons = hackathons.filter(h => h.type === 'online')
      } else {
        hackathons = hackathons.filter(h => h.type !== 'online')
      }
    }

    return NextResponse.json({ hackathons })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Failed to fetch hackathons' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Generate a unique ID for the new hackathon
    const newId = `created-${hackathonIdCounter++}`
    
    // Create the new hackathon object
    const newHackathon: Hackathon = {
      id: newId,
      title: body.title,
      description: body.description || '',
      image_url: '/placeholder-hackathon.jpg',
      start_date: body.start_date,
      end_date: body.end_date,
      location: body.location || 'Virtual',
      type: body.type || 'online',
      format: body.format || 'competitive',
      themes: body.themes || [],
      max_participants: body.max_participants,
      current_participants: body.current_participants || 0,
      status: body.status || 'upcoming',
      prize_amount: body.prize_amount,
      skill_level: body.skill_level || 'all-levels',
      eligibility: body.eligibility || 'Open to all',
      rules: body.rules || [],
      schedule: body.schedule || [],
      judges: body.judges || [],
      sponsors: body.sponsors || [],
      faq: body.faq || [],
      resources: body.resources || [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    // Add to our in-memory store
    createdHackathons.push(newHackathon)
    
    return NextResponse.json({ 
      success: true, 
      hackathon: newHackathon,
      message: 'Hackathon created successfully' 
    }, { status: 201 })
    
  } catch (e: any) {
    console.error('Error creating hackathon:', e)
    return NextResponse.json({ error: e?.message || 'Failed to create hackathon' }, { status: 500 })
  }
}
