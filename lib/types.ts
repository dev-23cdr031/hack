export interface User {
  id: string
  name: string
  email: string
  avatar_url?: string
  bio?: string
  title?: string
  skills: string[]
  github_url?: string
  linkedin_url?: string
  portfolio_url?: string
  location?: string
  experience_level?: string
  role?: string
  created_at: string
  updated_at: string
}

export interface Hackathon {
  id: string
  title: string
  description?: string
  image_url?: string
  start_date: string
  end_date: string
  location?: string
  type: "online" | "in-person" | "hybrid"
  format?: "competitive" | "learning" | "community" | "corporate"
  created_by?: string
  creator?: User
  themes: string[]
  max_participants?: number
  current_participants: number
  status: "upcoming" | "ongoing" | "past"
  prize_amount?: number
  skill_level?: "beginner" | "intermediate" | "advanced" | "all-levels"
  eligibility?: string
  rules?: string[]
  schedule?: { time: string; activity: string }[]
  judges?: { name: string; title: string; organization: string; image_url?: string; bio?: string }[]
  sponsors?: { name: string; tier: string; logo_url?: string }[]
  faq?: { question: string; answer: string }[]
  resources?: { title: string; url: string; type: string }[]
  created_at: string
  updated_at: string
}

export interface Team {
  id: string
  name: string
  description?: string
  hackathon_id?: string
  hackathon?: Hackathon
  leader_id: string
  leader?: User
  members?: User[]
  max_members: number
  current_members: number
  skills_needed: string[]
  status: "forming" | "active" | "completed"
  project_idea?: string
  communication_platform?: string
  meeting_schedule?: string
  roles_needed?: string[]
  // Mentor related fields
  mentor_id?: string | null
  mentor_requested_at?: string | null
  mentor_approved_at?: string | null
  mentor_status?: "none" | "requested" | "approved" | "rejected"
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  title: string
  description?: string
  image_url?: string
  image?: string
  github_url?: string
  githubUrl?: string
  demo_url?: string
  liveUrl?: string
  technologies: string[]
  team_id?: string
  team?: Team
  hackathon_id?: string
  hackathon?: Hackathon
  user_id: string
  user?: User
  created_at: string
  updated_at: string
}

export interface Message {
  id: string
  content: string
  sender_id: string
  sender?: User
  team_id?: string
  team?: Team
  hackathon_id?: string
  hackathon?: Hackathon
  created_at: string
  updated_at: string
}

export interface TeamMember {
  id: string
  team_id: string
  user_id: string
  role: "leader" | "member"
  joined_at: string
}

export interface HackathonParticipant {
  id: string
  hackathon_id: string
  user_id: string
  joined_at: string
}

export interface Meeting {
  id: string
  room_id: string
  title?: string
  description?: string
  host_id: string
  host?: User
  team_id?: string
  team?: Team
  hackathon_id?: string
  hackathon?: Hackathon
  status: "scheduled" | "active" | "completed" | "cancelled"
  scheduled_start?: string
  scheduled_end?: string
  actual_start?: string
  actual_end?: string
  participants?: MeetingParticipant[]
  recording_url?: string
  created_at: string
  updated_at: string
}

export interface MeetingParticipant {
  id: string
  meeting_id: string
  user_id: string
  user?: User
  join_time: string
  leave_time?: string
  connection_quality?: "excellent" | "good" | "fair" | "poor"
  audio_enabled: boolean
  video_enabled: boolean
}

export interface TeamJoinRequest {
  id: string
  team_id: string
  user_id: string
  user?: User
  team?: Team
  message?: string
  status: "pending" | "approved" | "rejected"
  created_at: string
  updated_at: string
  reviewed_at?: string
  reviewed_by?: string
}