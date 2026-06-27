import type { TeamJoinRequest } from './types'

// Mock join requests data
export const mockJoinRequests: TeamJoinRequest[] = [
  {
    id: 'req1',
    team_id: 'conv_1', // AI Innovators Team
    user_id: 'user_new_1',
    user: {
      id: 'user_new_1',
      name: 'Dev Dharrshan',
      email: 'devdharrshan@hackconnect.dev',
      avatar_url: '/placeholder.svg?height=64&width=64',
      title: 'Full-Stack Developer',
      skills: ['React', 'Node.js', 'Python', 'TensorFlow', 'AWS', 'Docker'],
      created_at: '2024-10-01T00:00:00Z',
      updated_at: '2024-10-01T00:00:00Z'
    },
    message: 'Hi! I\'m a full-stack developer with 3 years of experience in React and Node.js. I\'ve won 2 hackathons and would love to contribute to your AI project. I have experience with machine learning and can help with both frontend and backend development.',
    status: 'pending',
    created_at: '2024-10-11T10:30:00Z',
    updated_at: '2024-10-11T10:30:00Z'
  },
  {
    id: 'req2',
    team_id: 'conv_1', // AI Innovators Team
    user_id: 'user_new_2',
    user: {
      id: 'user_new_2',
      name: 'Hemapriya',
      email: 'hemapriya@hackconnect.dev',
      avatar_url: '/placeholder.svg?height=64&width=64',
      title: 'UI/UX Designer & Frontend Developer',
      skills: ['UI/UX', 'React', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Adobe Creative Suite'],
      created_at: '2024-10-01T00:00:00Z',
      updated_at: '2024-10-01T00:00:00Z'
    },
    message: 'Hello team! I\'m a UI/UX designer with strong frontend skills. I specialize in creating beautiful, user-friendly interfaces and have experience working with development teams. I think I can add great value to your project with my design and coding skills.',
    status: 'pending',
    created_at: '2024-10-11T09:15:00Z',
    updated_at: '2024-10-11T09:15:00Z'
  },
  {
    id: 'req3',
    team_id: 'conv_1', // AI Innovators Team
    user_id: 'user_new_3',
    user: {
      id: 'user_new_3',
      name: 'Bharani',
      email: 'bharani@hackconnect.dev',
      avatar_url: '/placeholder.svg?height=64&width=64',
      title: 'Data Scientist & ML Engineer',
      skills: ['Python', 'TensorFlow', 'PyTorch', 'Scikit-learn', 'Pandas', 'SQL', 'AWS'],
      created_at: '2024-10-01T00:00:00Z',
      updated_at: '2024-10-01T00:00:00Z'
    },
    message: 'Hey! I\'m a data scientist with expertise in machine learning and deep learning. I have experience with large datasets and building ML models for production. I\'d love to help with the AI aspects of your project.',
    status: 'pending',
    created_at: '2024-10-11T08:45:00Z',
    updated_at: '2024-10-11T08:45:00Z'
  },
  {
    id: 'req4',
    team_id: 'conv_2', // Dev Dharrshan (if he has a team)
    user_id: 'user_new_4',
    user: {
      id: 'user_new_4',
      name: 'Anusree',
      email: 'anusree@hackconnect.dev',
      avatar_url: '/placeholder.svg?height=64&width=64',
      title: 'Backend Developer',
      skills: ['Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'Docker', 'Kubernetes'],
      created_at: '2024-10-01T00:00:00Z',
      updated_at: '2024-10-01T00:00:00Z'
    },
    message: 'I\'m a backend developer with 4 years of experience. I specialize in building scalable APIs and microservices. Would love to join your team!',
    status: 'approved',
    created_at: '2024-10-10T14:00:00Z',
    updated_at: '2024-10-10T16:00:00Z',
    reviewed_at: '2024-10-10T16:00:00Z',
    reviewed_by: 'user_7'
  }
]

// Auto-incrementing ID counter
let nextRequestId = mockJoinRequests.length + 1

export function generateRequestId(): string {
  return `req${nextRequestId++}`
}

export function addJoinRequest(request: Omit<TeamJoinRequest, 'id' | 'created_at' | 'updated_at'>): TeamJoinRequest {
  const newRequest: TeamJoinRequest = {
    ...request,
    id: generateRequestId(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
  
  mockJoinRequests.push(newRequest)
  return newRequest
}

export function updateJoinRequest(id: string, updates: Partial<TeamJoinRequest>): TeamJoinRequest | null {
  const index = mockJoinRequests.findIndex(req => req.id === id)
  if (index === -1) return null
  
  mockJoinRequests[index] = {
    ...mockJoinRequests[index],
    ...updates,
    updated_at: new Date().toISOString()
  }
  
  return mockJoinRequests[index]
}

export function getJoinRequestsByTeam(teamId: string): TeamJoinRequest[] {
  return mockJoinRequests.filter(req => req.team_id === teamId)
}

export function getJoinRequestsByUser(userId: string): TeamJoinRequest[] {
  return mockJoinRequests.filter(req => req.user_id === userId)
}
