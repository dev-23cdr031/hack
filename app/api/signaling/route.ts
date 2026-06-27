import { NextRequest, NextResponse } from 'next/server'

// This API route provides information about the signaling server
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    
    // For now, we'll just return a mock response
    // In a real implementation, you would need to handle the signaling server differently
    // possibly using a WebSocket service or a separate process
    
    if (action === 'start') {
      return NextResponse.json({ 
        status: 'success', 
        message: 'Signaling server information',
        port: 3006,
        mode: 'direct-connection'
      })
    }
    
    if (action === 'status') {
      return NextResponse.json({ 
        status: 'success', 
        running: false,
        mode: 'direct-connection',
        port: null
      })
    }
    
    return NextResponse.json({ 
      status: 'success',
      message: 'Signaling server information',
      mode: 'direct-connection'
    })
  } catch (error) {
    console.error('Error in signaling API route:', error)
    return NextResponse.json({ 
      status: 'error', 
      message: 'Failed to process request',
      mode: 'direct-connection'
    }, { status: 500 })
  }
}