// Shared mock events data for fallback across all event API endpoints
export const mockEvents = [
  {
    id: '1',
    title: 'Team Standup Meeting',
    description: 'Daily standup to discuss progress and blockers',
    date: '2024-10-05',
    time: '09:00',
    type: 'meeting',
    team_id: '1',
    created_by: '1',
    created_at: '2024-10-01T10:00:00Z',
    updated_at: '2024-10-01T10:00:00Z'
  },
  {
    id: '2',
    title: 'HackConnect 2024 Submission Deadline',
    description: 'Final deadline for project submissions',
    date: '2024-10-15',
    time: '23:59',
    type: 'deadline',
    team_id: null,
    created_by: '1',
    created_at: '2024-09-15T10:00:00Z',
    updated_at: '2024-09-15T10:00:00Z'
  },
  {
    id: '3',
    title: 'Code Review Session',
    description: 'Review and discuss the latest code changes',
    date: '2024-10-08',
    time: '14:00',
    type: 'meeting',
    team_id: '1',
    created_by: '1',
    created_at: '2024-10-02T10:00:00Z',
    updated_at: '2024-10-02T10:00:00Z'
  },
  {
    id: '4',
    title: 'Project Demo Preparation',
    description: 'Prepare and practice the final project demonstration',
    date: '2024-10-12',
    time: '16:00',
    type: 'task',
    team_id: '1',
    created_by: '1',
    created_at: '2024-10-03T10:00:00Z',
    updated_at: '2024-10-03T10:00:00Z'
  },
  {
    id: '5',
    title: 'Hackathon Kickoff Event',
    description: 'Opening ceremony and team formation for the hackathon',
    date: '2024-10-20',
    time: '10:00',
    type: 'event',
    team_id: null,
    created_by: '1',
    created_at: '2024-10-01T10:00:00Z',
    updated_at: '2024-10-01T10:00:00Z'
  }
]

let eventIdCounter = 6

export function getNextEventId() {
  return (eventIdCounter++).toString()
}

export function getCurrentEventId() {
  return eventIdCounter
}
