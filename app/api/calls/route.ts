import { NextResponse } from 'next/server'

// Simple mock API route for calls to prevent build errors
// In production, this would integrate with your database and signaling server

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { caller_id, receiver_id, call_type, status } = body

    // Create a mock call ID
    const callId = `call_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    console.log('Call created:', {
      id: callId,
      caller_id,
      receiver_id,
      call_type,
      status,
      created_at: new Date().toISOString()
    })

    return NextResponse.json({
      id: callId,
      message: 'Call initiated successfully'
    })
  } catch (error) {
    console.error('Error creating call:', error)
    return NextResponse.json(
      { error: 'Failed to create call' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { callId, status } = body

    console.log('Call updated:', { callId, status, updated_at: new Date().toISOString() })

    return NextResponse.json({
      success: true,
      message: 'Call updated successfully'
    })
  } catch (error) {
    console.error('Error updating call:', error)
    return NextResponse.json(
      { error: 'Failed to update call' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const callId = searchParams.get('callId')

    console.log('Call ended:', { callId, ended_at: new Date().toISOString() })

    return NextResponse.json({
      success: true,
      message: 'Call ended successfully'
    })
  } catch (error) {
    console.error('Error ending call:', error)
    return NextResponse.json(
      { error: 'Failed to end call' },
      { status: 500 }
    )
  }
}