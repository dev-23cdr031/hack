import { NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

// Global hackathon and registration storage (matches main route)
declare global {
  var inMemoryHackathons: any[] | undefined
  var inMemoryRegistrations: any[] | undefined
}

if (!global.inMemoryRegistrations) {
  global.inMemoryRegistrations = []
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const hackathonId = params.id

    if (!hackathonId) {
      return NextResponse.json({ 
        error: "Hackathon ID is required", 
        success: false 
      }, { status: 400 })
    }

    // Parse request body
    let body
    try {
      body = await request.json()
    } catch (e) {
      return NextResponse.json({ 
        error: "Invalid JSON body", 
        success: false 
      }, { status: 400 })
    }

    const { userId, userEmail, userName } = body

    if (!userId) {
      return NextResponse.json({ 
        error: "User ID is required to register", 
        success: false 
      }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()
    let hackathon = null
    let isInMemory = false

    // First try to get hackathon from database
    const { data: dbHackathon, error: dbError } = await supabase
      .from('hackathons')
      .select('*')
      .eq('id', hackathonId)
      .single()

    if (!dbError && dbHackathon) {
      hackathon = dbHackathon
      console.log('Found hackathon in database:', hackathon.title)
    } else {
      // If not in database, check in-memory hackathons
      console.log('Hackathon not in DB, checking in-memory:', hackathonId)
      if (global.inMemoryHackathons) {
        const inMemoryFound = global.inMemoryHackathons.find(h => h.id === hackathonId)
        if (inMemoryFound) {
          hackathon = inMemoryFound
          isInMemory = true
          console.log('Found hackathon in-memory:', hackathon.title)
        }
      }
    }

    // If we still don't have a hackathon, return error
    if (!hackathon) {
      console.error('Hackathon not found anywhere:', hackathonId)
      return NextResponse.json({ 
        error: "Hackathon not found", 
        success: false 
      }, { status: 404 })
    }

    // Check if user is already registered
    const { data: existingRegistration, error: existingError } = await supabase
      .from('hackathon_participants')
      .select('id')
      .eq('hackathon_id', hackathonId)
      .eq('user_id', userId)
      .maybeSingle()

    if (existingRegistration) {
      return NextResponse.json({ 
        error: "You are already registered for this hackathon", 
        success: false 
      }, { status: 409 })
    }

    // Check participant limit if it exists
    if (hackathon.max_participants && (hackathon.current_participants || 0) >= hackathon.max_participants) {
      return NextResponse.json({ 
        error: "This hackathon has reached its maximum number of participants", 
        success: false 
      }, { status: 400 })
    }

    // Store only fields that exist on the live schema. Some deployments have not run the
    // optional registration-details migration yet, so we fall back to the in-memory list.
    const registrationEmail = (userEmail || body.email || 'unknown@example.com').trim().toLowerCase()
    const registrationName = userName || body.fullName || 'Unknown User'

    // Support both the flat form payload and the older nested format
    const locationDetails = body.location && typeof body.location === 'object' ? body.location : {}
    const professional = body.professional && typeof body.professional === 'object' ? body.professional : {}
    const preferences = body.preferences && typeof body.preferences === 'object' ? body.preferences : {}

    const parseSkills = (raw: any): string[] => {
      if (Array.isArray(raw)) return raw.map((s: any) => String(s).trim()).filter(Boolean)
      if (typeof raw === 'string') return raw.split(',').map(s => s.trim()).filter(Boolean)
      return []
    }

    // Save every registration detail to Supabase (hackathon_participants)
    const safeRegistration = {
      hackathon_id: hackathonId,
      user_id: userId,
      full_name: String(registrationName),
      email: registrationEmail,
      phone: body.phone || null,
      city: body.city || locationDetails.city || null,
      state: body.state || locationDetails.state || null,
      country: body.country || locationDetails.country || null,
      date_of_birth: body.dateOfBirth || null,
      gender: body.gender || null,
      occupation: body.occupation || professional.occupation || null,
      organization: body.organization || professional.organization || null,
      experience: body.experience || professional.experience || null,
      skills: parseSkills(body.skills || professional.skills),
      interests: body.interests || preferences.interests || null,
      portfolio: body.portfolio || professional.portfolio || null,
      github: body.github || professional.github || null,
      linkedin: body.linkedin || professional.linkedin || null,
      team_status: body.teamStatus || null,
      team_name: body.teamName || null,
      team_size: body.teamSize ? String(body.teamSize) : null,
      project_idea: body.projectIdea || null,
      motivation: body.motivation || null,
      expectations: body.expectations || null,
      dietary_restrictions: body.dietaryRestrictions || preferences.dietaryRestrictions || null,
      tshirt_size: body.tshirtSize || preferences.tshirtSize || null,
      accommodation_needed: body.accommodationNeeded ?? null,
      special_assistance: body.specialAssistance || null,
      how_did_you_hear: body.howDidYouHear || preferences.howDidYouHear || null,
      previous_hackathons: body.previousHackathons || null,
      agree_to_terms: !!body.agreeToTerms,
      agree_to_code_of_conduct: !!body.agreeToCodeOfConduct,
      agree_to_data_sharing: !!body.agreeToDataSharing,
    }

    // Save the registration to Supabase
    const { error: insertError } = await supabase
      .from('hackathon_participants')
      .insert(safeRegistration)

    // If the full insert fails (e.g. registration-details migration not run yet),
    // retry with just the core columns so the registration is ALWAYS saved to Supabase.
    if (insertError) {
      console.warn('Full registration insert failed, retrying with core fields:', insertError.message)

      const { error: coreError } = await supabase
        .from('hackathon_participants')
        .insert({
          hackathon_id: hackathonId,
          user_id: userId,
          full_name: String(registrationName),
          email: registrationEmail,
        })

      if (coreError) {
        console.error('Core insert also failed:', coreError.message)
        return NextResponse.json({
          error: `Could not save the registration to the database (${coreError.message}). Please run the 'database/20-hackathon-registration.sql' migration in the Supabase SQL editor.`,
          success: false
        }, { status: 500 })
      }
    }

    // Only update database if it's a database hackathon, not in-memory
    if (!isInMemory && dbHackathon) {
      const newParticipantCount = (dbHackathon.current_participants || 0) + 1
      const { error: updateError } = await supabase
        .from('hackathons')
        .update({ current_participants: newParticipantCount })
        .eq('id', hackathonId)

      if (updateError) {
        console.error('Error updating participant count:', updateError)
      }
    } else if (isInMemory) {
      // For in-memory hackathons, update their local participant count
      const inMemoryIndex = global.inMemoryHackathons!.findIndex(h => h.id === hackathonId)
      if (inMemoryIndex !== -1) {
        global.inMemoryHackathons![inMemoryIndex].current_participants = (global.inMemoryHackathons![inMemoryIndex].current_participants || 0) + 1
      }
    }

    // Ensure user is in users table
    if (userId && (userEmail || body.email)) {
      const upsertEmail = String(userEmail || body.email || '').trim().toLowerCase()
      if (upsertEmail) {
        const { error: userUpsertError } = await supabase
          .from('users')
          .upsert({
            id: userId,
            email: upsertEmail,
            name: userName || body.fullName || 'User',
            updated_at: new Date().toISOString()
          }, { onConflict: 'id' })

        if (userUpsertError) {
          console.error('Error upserting user:', userUpsertError)
        }
      }
    }

    // Return success response
    return NextResponse.json({
      success: true,
      message: "Successfully registered for the hackathon",
      hackathon: {
        id: hackathon.id,
        title: hackathon.title,
        current_participants: (hackathon.current_participants || 0) + 1
      }
    }, { status: 200 })

  } catch (e: any) {
    console.error('Unexpected registration error:', e)
    return NextResponse.json({ 
      error: `Server error: ${e.message}`, 
      success: false 
    }, { status: 500 })
  }
}