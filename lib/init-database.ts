import { serverMeetingsService } from './meetings-service'

export async function initializeDatabase() {
  try {
    console.log('Initializing database tables...')
    
    // Ensure meetings tables exist
    const meetingTablesCreated = await serverMeetingsService.ensureMeetingTables()
    console.log('Meetings tables initialized:', meetingTablesCreated)
    
    console.log('Database initialization complete')
    return true
  } catch (error) {
    console.error('Error initializing database:', error)
    return false
  }
}