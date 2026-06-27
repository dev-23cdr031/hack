import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

interface ChatMessage {
  message: string
  context?: string
}

export async function POST(request: NextRequest) {
  try {
    const { message, context }: ChatMessage = await request.json()
    const supabase = createServerSupabaseClient()

    const lowerMessage = message.toLowerCase()
    let response = ""
    let suggestions: string[] = []
    let data: any = null

    // Handle different types of queries
    if (lowerMessage.includes("team") && (lowerMessage.includes("find") || lowerMessage.includes("search"))) {
      // Fetch actual teams from database
      const { data: teams, error } = await supabase
        .from("teams")
        .select(`
          *,
          hackathon:hackathons(title),
          leader:users!teams_leader_id_fkey(name)
        `)
        .eq("status", "forming")
        .limit(3)

      if (!error && teams) {
        response = "Here are some teams currently looking for members:"
        data = teams.map((team) => ({
          id: team.id,
          name: team.name,
          description: team.description,
          hackathon: team.hackathon?.title,
          leader: team.leader?.name,
          spots: team.max_members - team.current_members,
        }))
        suggestions = ["View all teams", "Create my team", "Filter by skills"]
      }
    } else if (lowerMessage.includes("hackathon")) {
      // Fetch actual hackathons
      const { data: hackathons, error } = await supabase
        .from("hackathons")
        .select("*")
        .in("status", ["upcoming", "ongoing"])
        .limit(3)

      if (!error && hackathons) {
        response = "Here are some exciting hackathons you can join:"
        data = hackathons.map((hackathon) => ({
          id: hackathon.id,
          title: hackathon.title,
          description: hackathon.description,
          start_date: hackathon.start_date,
          location: hackathon.location,
          type: hackathon.type,
          participants: hackathon.current_participants,
        }))
        suggestions = ["View all hackathons", "Join hackathon", "Filter hackathons"]
      }
    } else if (lowerMessage.includes("skill")) {
      // Get popular skills from users
      const { data: users, error } = await supabase.from("users").select("skills").limit(50)

      if (!error && users) {
        const allSkills = users.flatMap((user) => user.skills || [])
        const skillCounts = allSkills.reduce((acc: any, skill: string) => {
          acc[skill] = (acc[skill] || 0) + 1
          return acc
        }, {})

        const popularSkills = Object.entries(skillCounts)
          .sort(([, a], [, b]) => (b as number) - (a as number))
          .slice(0, 10)
          .map(([skill]) => skill)

        response = "Here are the most popular skills on HackConnect:"
        data = popularSkills
        suggestions = ["Add skills to profile", "Find teams by skill", "View my skills"]
      }
    } else if (lowerMessage.includes("help") || lowerMessage.includes("what can you do")) {
      response = `I'm HackBot, your AI assistant for HackConnect! Here's what I can help you with:

🔍 **Find Teams** - Discover teams looking for your skills
🏆 **Browse Hackathons** - Find exciting competitions to join  
👥 **Create Teams** - Get guidance on starting your own team
📊 **Platform Stats** - Get insights about the community
💡 **Tips & Advice** - Learn best practices for hackathons
🛠️ **Technical Help** - Get support with platform features

Just ask me anything about hackathons, teams, or the platform!`

      suggestions = ["Find teams", "Browse hackathons", "Create team", "Platform stats"]
    } else if (lowerMessage.includes("stat") || lowerMessage.includes("number")) {
      // Get platform statistics
      const [teamsResult, hackathonsResult, usersResult] = await Promise.all([
        supabase.from("teams").select("id", { count: "exact" }),
        supabase.from("hackathons").select("id", { count: "exact" }),
        supabase.from("users").select("id", { count: "exact" }),
      ])

      response = `Here are some HackConnect platform statistics:

👥 **${usersResult.count || 0}** registered developers
🏆 **${hackathonsResult.count || 0}** hackathons listed  
👨‍💻 **${teamsResult.count || 0}** teams formed
🌍 **50+** countries represented

The community is growing every day!`

      suggestions = ["Join community", "Find teams", "Browse hackathons"]
    } else {
      // Default helpful response
      response = `I'm here to help you with HackConnect! I can assist you with:

• Finding and joining teams
• Discovering hackathons  
• Creating your own team
• Getting platform guidance
• Answering questions about features

What would you like to know more about?`

      suggestions = ["Find teams", "Browse hackathons", "Create team", "Get help"]
    }

    return NextResponse.json({
      response,
      suggestions,
      data,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Chatbot API error:", error)
    return NextResponse.json(
      {
        response:
          "I'm sorry, I'm having trouble right now. Please try again in a moment or contact support if the issue persists.",
        suggestions: ["Try again", "Contact support", "Browse manually"],
        error: true,
      },
      { status: 500 },
    )
  }
}
