import type { Team, User } from "@/lib/types"
import { mockHackathons } from "@/lib/mock-data"

const createdAt = "2026-06-01T00:00:00Z"

const mockUsers: User[] = [
  {
    id: "dev-dharrshan",
    name: "Dev Dharrshan",
    email: "devdharrshan@hackconnect.dev",
    avatar_url: "/team/dev-dharrshan.jpg",
    bio: "Backend developer focused on scalable APIs and system architecture.",
    title: "Backend Lead",
    skills: ["Node.js", "TypeScript", "PostgreSQL", "API Design"],
    created_at: createdAt,
    updated_at: createdAt,
  },
  {
    id: "divyadharshini",
    name: "Divyadharshini",
    email: "divyadharshini@hackconnect.dev",
    avatar_url: "/team/divya-dharshini.jpg",
    bio: "Frontend developer focused on responsive and polished product interfaces.",
    title: "Frontend Lead",
    skills: ["React", "Next.js", "Tailwind CSS", "UI Engineering"],
    created_at: createdAt,
    updated_at: createdAt,
  },
  {
    id: "anusree",
    name: "Anusree",
    email: "anusree@hackconnect.dev",
    avatar_url: "/team/anusree.jpg",
    bio: "AI specialist building intelligent features and data-driven applications.",
    title: "AI Specialist",
    skills: ["Python", "Machine Learning", "Data Science", "NLP"],
    created_at: createdAt,
    updated_at: createdAt,
  },
  {
    id: "divakar",
    name: "Divakar",
    email: "divakar@hackconnect.dev",
    avatar_url: "/team/divakar.jpg",
    bio: "Database lead with a focus on reliable data models and queries.",
    title: "Database Lead",
    skills: ["SQL", "Supabase", "PostgreSQL", "Data Modeling"],
    created_at: createdAt,
    updated_at: createdAt,
  },
  {
    id: "hemapriya",
    name: "Hemapriya",
    email: "hemapriya@hackconnect.dev",
    avatar_url: "/team/hemapriya.jpg",
    bio: "UI/UX designer shaping clear, usable, and attractive app experiences.",
    title: "UI/UX Lead",
    skills: ["UI/UX", "UI/UX", "Prototyping", "Design Systems"],
    created_at: createdAt,
    updated_at: createdAt,
  },
  {
    id: "bharani",
    name: "Bharani",
    email: "bharani@hackconnect.dev",
    avatar_url: "/team/bharani.jpg",
    bio: "Cloud developer focused on deployment, monitoring, and infrastructure.",
    title: "Cloud Lead",
    skills: ["Cloud", "Docker", "CI/CD", "DevOps"],
    created_at: createdAt,
    updated_at: createdAt,
  },
]

// Team member sets (for demo)
// Required by task:
// - team1: Dev Dharrshan + Divyadharshini only
// - team2: Dev Dharrshan + Anusree only
// - All teams should use only these 6 members.
const teamSets = [
  // index 0 -> team1 / conv_1
  [0, 1],
  // index 1 -> team2
  [0, 2],
  // index 2 -> team3
  [1, 2],
  // index 3 -> team4
  [0, 3],
  // index 4 -> team5
  [2, 4],
  // index 5 -> team6
  [0, 5],
  // index 6 -> team7
  [2, 3],
  // index 7 -> team8
  [1, 5],
  // index 8 -> team9
  [3, 4],
  
  // NOTE: other teams will still be generated using the member sets above.
]



const teamNames = [
  "AI Innovators",
  "Web3 Builders",
  "Green Tech Crew",
  "Mobile Makers",
  "Cyber Shield",
  "Smart Campus Squad",
  "Game Dev Circle",
  "Cloud Sprint Team",
  "Data Wizards",
]

const descriptions = [
  "Building practical AI tools for campus productivity and learning.",
  "Creating secure blockchain prototypes for trusted records.",
  "Designing sustainable tech for energy and environment tracking.",
  "Developing mobile-first apps for student and community needs.",
  "Creating security dashboards and safe authentication flows.",
  "Prototyping IoT solutions for a smarter KEC campus.",
  "Making a playable game with polished mechanics and visuals.",
  "Automating deployment workflows and cloud monitoring.",
  "Turning datasets into useful dashboards and decisions.",
]

const skills = [
  ["Python", "React", "Machine Learning", "UI/UX"],
  ["Solidity", "React", "Node.js", "Database"],
  ["IoT", "Data Visualization", "React", "Cloud"],
  ["React Native", "UI/UX", "API Integration", "Firebase"],
  ["Cybersecurity", "Node.js", "Testing", "Documentation"],
  ["Embedded Systems", "IoT", "Dashboard", "Cloud"],
  ["Game Development", "TypeScript", "UI Design", "Animation"],
  ["Docker", "CI/CD", "Cloud", "Monitoring"],
  ["SQL", "Python", "Analytics", "Visualization"],
]

export const mockTeams: Team[] = teamNames.map((name, index) => {
  const members = teamSets[index].map((memberIndex) => mockUsers[memberIndex])
  const hackathon = mockHackathons[index % mockHackathons.length]

  return {
    id: index === 0 ? "conv_1" : `team${index + 1}`,
    name,
    description: descriptions[index],
    hackathon_id: hackathon.id,
    hackathon,
    leader_id: members[0].id,
    leader: members[0],
    members,
    max_members: index % 2 === 0 ? 5 : 4,
    current_members: members.length,
    skills_needed: skills[index],
    status: index === 2 || index === 6 ? "active" : "forming",
    project_idea: descriptions[index],
    communication_platform: index % 2 === 0 ? "Discord" : "Microsoft Teams",
    meeting_schedule: "Team sync at KEC, Erode Tamilnadu",
    roles_needed: skills[index].slice(0, 3),
    created_at: createdAt,
    updated_at: createdAt,
  }
})
