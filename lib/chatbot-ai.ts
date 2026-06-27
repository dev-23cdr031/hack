import { COMPREHENSIVE_HACKATHON_DATA, ADVANCED_KEYWORDS } from './chatbot-knowledge';

interface ChatbotResponse {
  message: string
  suggestions?: string[]
  actions?: Array<{
    label: string
    action: string
    url?: string
  }>
}

// HackConnect Project Knowledge Base
const HACKCONNECT_DATA = {
  platform: {
    name: "HackConnect",
    description: "A comprehensive platform for hackathon enthusiasts to connect, collaborate, and compete",
    features: [
      "Team formation and collaboration",
      "Hackathon discovery and registration",
      "Real-time messaging and video calls",
      "Profile management and skill matching",
      "Project showcasing and networking",
      "AI-powered chatbot assistance"
    ]
  },
  hackathons: [
    {
      name: "AI Innovation Challenge",
      location: "KEC, Erode Tamilnadu",
      dates: "December 15-17, 2023",
      type: "Hybrid (In-person & Virtual)",
      theme: "Artificial Intelligence & Machine Learning",
      prize: "$25,000",
      participants: "342/500",
      skillLevel: "Intermediate",
      status: "Upcoming"
    },
    {
      name: "Blockchain Revolution Hackathon",
      location: "KEC, Erode Tamilnadu",
      dates: "November 10-12, 2023",
      type: "In-person",
      theme: "Blockchain & Web3",
      prize: "$30,000",
      participants: "275/300",
      skillLevel: "Advanced",
      status: "Ongoing"
    },
    {
      name: "Sustainable Tech Solutions",
      location: "KEC, Erode Tamilnadu",
      dates: "October 5-7, 2023",
      type: "Online",
      theme: "Sustainability & Climate Tech",
      prize: "$15,000",
      participants: "750/1000",
      skillLevel: "Beginner",
      status: "Past"
    },
    {
      name: "Mobile App Innovation Challenge",
      location: "KEC, Erode Tamilnadu",
      dates: "January 20-22, 2024",
      type: "Hybrid",
      theme: "Mobile Development & UX/UI",
      prize: "$20,000",
      participants: "120/400",
      skillLevel: "Intermediate",
      status: "Upcoming"
    }
  ],
  locations: {
    "san francisco": "KEC, Erode Tamilnadu - AI Innovation Challenge (Dec 15-17, 2023)",
    "new york": "KEC, Erode Tamilnadu - Blockchain Revolution Hackathon (Nov 10-12, 2023)",
    "austin": "KEC, Erode Tamilnadu - Mobile App Innovation Challenge (Jan 20-22, 2024)",
    "virtual": "KEC, Erode Tamilnadu - Sustainable Tech Solutions (Oct 5-7, 2023)"
  },
  themes: {
    "ai": "AI Innovation Challenge in KEC, Erode Tamilnadu (Dec 15-17, 2023)",
    "artificial intelligence": "AI Innovation Challenge in KEC, Erode Tamilnadu (Dec 15-17, 2023)",
    "blockchain": "Blockchain Revolution Hackathon in KEC, Erode Tamilnadu (Nov 10-12, 2023)",
    "web3": "Blockchain Revolution Hackathon in KEC, Erode Tamilnadu (Nov 10-12, 2023)",
    "sustainability": "Sustainable Tech Solutions - KEC, Erode Tamilnadu (Oct 5-7, 2023)",
    "mobile": "Mobile App Innovation Challenge in KEC, Erode Tamilnadu (Jan 20-22, 2024)",
    "app development": "Mobile App Innovation Challenge in KEC, Erode Tamilnadu (Jan 20-22, 2024)"
  },
  features: {
    "team formation": "Find and create teams with complementary skills through our advanced matching system",
    "messaging": "Real-time chat and video calling features for seamless team collaboration",
    "profile": "Showcase your skills, projects, and connect with like-minded developers",
    "networking": "Connect with developers, teammates, and industry professionals",
    "registration": "Easy hackathon registration with team management tools"
  }
}

export class ChatbotAI {
  private static responses = {
    greetings: COMPREHENSIVE_HACKATHON_DATA.greetings,
    teamHelp: COMPREHENSIVE_HACKATHON_DATA.teamFormation.slice(0, 20),
    hackathonHelp: [
      "There are amazing hackathons happening! What type interests you most?",
      "I can help you discover hackathons by theme, location, or difficulty level!",
      "Ready to compete? Let me find hackathons that match your skills!",
      ...COMPREHENSIVE_HACKATHON_DATA.dates.slice(0, 10)
    ],
    skillsHelp: [
      "Skills are crucial for team matching! What technologies do you work with?",
      "I can help you showcase your skills or find teams that need them!",
      "Tell me about your technical background - I'll help optimize your profile!",
      ...Object.values(COMPREHENSIVE_HACKATHON_DATA.technologies).flat().slice(0, 15)
    ],
    projectHelp: COMPREHENSIVE_HACKATHON_DATA.projectIdeas.slice(0, 20),
    encouragement: COMPREHENSIVE_HACKATHON_DATA.motivation.slice(0, 20),
    tips: COMPREHENSIVE_HACKATHON_DATA.tips.slice(0, 20),
  }

  private static keywords = ADVANCED_KEYWORDS

  static async generateResponse(message: string, context?: any): Promise<ChatbotResponse> {
    const lowerMessage = message.toLowerCase().trim()

    // PRIORITY: Handle exact custom greetings FIRST - bypass all other logic
    if (lowerMessage === 'hi') {
      return {
        message: "Hi Dev Dharrshan, Divyadharshini, Divakar! How are you?",
        suggestions: ["Find teams", "Browse hackathons", "Get tips", "Help with skills"],
        actions: [
          { label: "Find Teams", action: "find_teams", url: "/teams/find" },
          { label: "Browse Hackathons", action: "browse_hackathons", url: "/hackathons" }
        ],
      }
    }
    
    if (lowerMessage === 'hello') {
      return {
        message: "Hi Thangarajan Sir, Yazlini Mam, Loganathan Sir! How are you?",
        suggestions: ["Project ideas", "Registration info", "Get started", "Team formation"],
        actions: [
          { label: "Get Started", action: "get_started", url: "/get-started" },
          { label: "Browse Hackathons", action: "browse_hackathons", url: "/hackathons" }
        ],
      }
    }

    // Detect intent based on keywords for other messages
    const intent = this.detectIntent(lowerMessage)

    // Generate contextual response
    let response: ChatbotResponse

    switch (intent) {
      case "greeting":
        response = this.getGreetingResponse(lowerMessage)
        break
      case "team":
        response = this.getTeamResponse(lowerMessage)
        break
      case "hackathon":
        response = this.getHackathonResponse(lowerMessage)
        break
      case "skills":
        response = this.getSkillsResponse(lowerMessage)
        break
      case "project":
        response = this.getProjectResponse(lowerMessage)
        break
      case "thanks":
        response = this.getThanksResponse()
        break
      case "positive":
        response = this.getPositiveResponse()
        break
      case "negative":
        response = this.getNegativeResponse(lowerMessage)
        break
      case "location":
        response = this.getLocationResponse(lowerMessage)
        break
      case "date":
        response = this.getDateResponse(lowerMessage)
        break
      case "platform":
        response = this.getPlatformResponse(lowerMessage)
        break
      case "prize":
        response = this.getPrizeResponse(lowerMessage)
        break
      case "registration":
        response = this.getRegistrationResponse(lowerMessage)
        break
      case "theme":
        response = this.getThemeResponse(lowerMessage)
        break
      case "technology":
        response = this.getTechnologyResponse(lowerMessage)
        break
      case "motivation":
        response = this.getMotivationResponse(lowerMessage)
        break
      case "networking":
        response = this.getNetworkingResponse(lowerMessage)
        break
      case "learning":
        response = this.getLearningResponse(lowerMessage)
        break
      case "business":
        response = this.getBusinessResponse(lowerMessage)
        break
      case "ai":
        response = this.getAIResponse(lowerMessage)
        break
      case "blockchain":
        response = this.getBlockchainResponse(lowerMessage)
        break
      case "mobile":
        response = this.getMobileResponse(lowerMessage)
        break
      case "web":
        response = this.getWebResponse(lowerMessage)
        break
      case "design":
        response = this.getDesignResponse(lowerMessage)
        break
      case "security":
        response = this.getSecurityResponse(lowerMessage)
        break
      case "sustainability":
        response = this.getSustainabilityResponse(lowerMessage)
        break
      case "health":
        response = this.getHealthResponse(lowerMessage)
        break
      case "education":
        response = this.getEducationResponse(lowerMessage)
        break
      case "fintech":
        response = this.getFintechResponse(lowerMessage)
        break
      default:
        response = this.getDefaultResponse(lowerMessage)
    }

    // Add random tips occasionally
    if (Math.random() < 0.3) {
      response.message += "\n\n" + this.getRandomTip()
    }

    return response
  }

  private static detectIntent(message: string): string {
    const lowerMessage = message.toLowerCase();
    let bestMatch = { intent: "default", score: 0 };
    
    // Advanced keyword matching with scoring
    for (const [intent, keywords] of Object.entries(this.keywords)) {
      let score = 0;
      for (const keyword of keywords) {
        if (lowerMessage.includes(keyword.toLowerCase())) {
          // Exact word match gets higher score
          const wordBoundary = new RegExp(`\\b${keyword.toLowerCase()}\\b`);
          if (wordBoundary.test(lowerMessage)) {
            score += 2;
          } else {
            score += 1;
          }
        }
      }
      
      if (score > bestMatch.score) {
        bestMatch = { intent, score };
      }
    }
    
    return bestMatch.score > 0 ? bestMatch.intent : "default";
  }

  private static getGreetingResponse(message: string): ChatbotResponse {
    // Note: "hi" and "hello" are handled at the top level of generateResponse
    // This method handles other greeting variations like "hey", "good morning", etc.
    
    const randomGreeting = COMPREHENSIVE_HACKATHON_DATA.greetings[Math.floor(Math.random() * COMPREHENSIVE_HACKATHON_DATA.greetings.length)];
    return {
      message: randomGreeting,
      suggestions: ["Find teams", "Browse hackathons", "Get tips", "Help with skills", "Project ideas", "Registration info"],
      actions: [
        { label: "Find Teams", action: "find_teams", url: "/teams/find" },
        { label: "Browse Hackathons", action: "browse_hackathons", url: "/hackathons" },
        { label: "Get Started", action: "get_started", url: "/get-started" }
      ],
    }
  }

  private static getTeamResponse(message: string): ChatbotResponse {
    const responses = [
      "Great! Team collaboration is the heart of successful hackathons. Are you looking to join an existing team or create your own?",
      "Teams make everything better! 👥 What kind of project or hackathon are you interested in?",
      "Perfect! I can help you find teammates with complementary skills. What's your technical background?",
    ]

    let suggestions = ["Find existing teams", "Create new team", "View my skills"]

    if (message.includes("create") || message.includes("start")) {
      suggestions = ["Create team guide", "Team building tips", "Find hackathons"]
    } else if (message.includes("join") || message.includes("find")) {
      suggestions = ["Browse teams", "Filter by skills", "Filter by hackathon"]
    }

    return {
      message: responses[Math.floor(Math.random() * responses.length)],
      suggestions,
      actions: [
        { label: "Find Teams", action: "find_teams", url: "/teams/find" },
        { label: "Create Team", action: "create_team", url: "/teams/create" },
      ],
    }
  }

  private static getHackathonResponse(message: string): ChatbotResponse {
    const responses = [
      "Hackathons are amazing for learning and building! 🏆 What type of challenges interest you most?",
      "There are so many exciting hackathons happening! Are you interested in AI, web development, mobile apps, or something else?",
      "Perfect timing! Hackathons are great for networking and skill building. What's your experience level?",
    ]

    return {
      message: responses[Math.floor(Math.random() * responses.length)],
      suggestions: ["Browse all hackathons", "AI hackathons", "Web development", "Mobile apps", "Beginner friendly"],
      actions: [{ label: "Explore Hackathons", action: "browse_hackathons", url: "/hackathons" }],
    }
  }

  private static getSkillsResponse(message: string): ChatbotResponse {
    const responses = [
      "Skills are your superpower! 💪 What technologies are you most comfortable with?",
      "Great question about skills! Are you looking to learn new ones or showcase existing expertise?",
      "Skills matching is crucial for team success! Tell me about your technical stack.",
    ]

    return {
      message: responses[Math.floor(Math.random() * responses.length)],
      suggestions: ["JavaScript", "Python", "React", "Node.js", "AI/ML", "UI/UX Design", "View all skills"],
      actions: [{ label: "Update Profile", action: "update_profile", url: "/profile" }],
    }
  }

  private static getProjectResponse(message: string): ChatbotResponse {
    const responses = [
      "Project ideas are exciting! 🚀 What problem are you passionate about solving?",
      "Building something new? That's awesome! What domain interests you most?",
      "Great! Projects are how we turn ideas into reality. What's your vision?",
    ]

    return {
      message: responses[Math.floor(Math.random() * responses.length)],
      suggestions: [
        "AI projects",
        "Web apps",
        "Mobile apps",
        "Social impact",
        "Fintech",
        "Healthcare",
        "Get inspiration",
      ],
    }
  }

  private static getThanksResponse(): ChatbotResponse {
    const responses = [
      "You're very welcome! 😊 Happy to help anytime!",
      "My pleasure! 🤖 That's what I'm here for!",
      "Glad I could help! 🌟 Feel free to ask anything else!",
    ]

    return {
      message: responses[Math.floor(Math.random() * responses.length)],
      suggestions: ["Ask another question", "Find teams", "Browse hackathons", "Get more tips"],
    }
  }

  private static getPositiveResponse(): ChatbotResponse {
    return {
      message: this.getRandomResponse("encouragement"),
      suggestions: ["Tell me more", "Get tips", "Find teams", "Browse hackathons"],
    }
  }

  private static getNegativeResponse(message: string): ChatbotResponse {
    const responses = [
      "I understand that can be frustrating. Let me help you work through this! What specific challenge are you facing?",
      "No worries, we all hit roadblocks! 💪 What part is giving you trouble?",
      "That's totally normal in development! Can you tell me more about what's not working?",
    ]

    return {
      message: responses[Math.floor(Math.random() * responses.length)],
      suggestions: ["Get help", "Find teammates", "Join study group", "Browse tutorials"],
      actions: [{ label: "Get Support", action: "get_support", url: "/contact" }],
    }
  }

  private static getDefaultResponse(message: string): ChatbotResponse {
    const responses = [
      "That's interesting! Tell me more about what you're working on.",
      "I'd love to help! Can you give me a bit more context?",
      "Great point! How can I assist you with that on HackConnect?",
      "What specific aspect would you like to explore?",
    ]

    // Try to extract topics from the message
    let suggestions = ["Tell me more", "Get help", "Find teams", "Browse hackathons"]

    if (message.includes("learn") || message.includes("tutorial")) {
      suggestions = ["Learning resources", "Find teammates", "Join study groups", "Practice projects"]
    } else if (message.includes("career") || message.includes("job")) {
      suggestions = ["Career advice", "Portfolio tips", "Networking", "Skill development"]
    }

    return {
      message: responses[Math.floor(Math.random() * responses.length)],
      suggestions,
    }
  }

  private static getRandomResponse(category: keyof typeof this.responses): string {
    const responses = this.responses[category]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  private static getRandomTip(): string {
    return this.getRandomResponse("tips")
  }

  // Advanced response generation with context
  static async generateContextualResponse(
    message: string,
    userProfile?: any,
    teamContext?: any,
    conversationHistory?: string[],
  ): Promise<ChatbotResponse> {
    const baseResponse = await this.generateResponse(message)

    // Enhance response with context
    if (userProfile) {
      if (userProfile.skills && userProfile.skills.length > 0) {
        const skills = userProfile.skills.slice(0, 3).join(", ")
        baseResponse.message += `\n\nI see you have experience with ${skills}. That's valuable for many teams!`
      }
    }

    if (teamContext) {
      baseResponse.message += `\n\nBy the way, your team "${teamContext.name}" is doing great! Keep up the collaboration! 🚀`
    }

    return baseResponse
  }

  // New project-specific response methods
  private static getLocationResponse(message: string): ChatbotResponse {
    // Check for specific location mentions
    for (const [location, info] of Object.entries(HACKCONNECT_DATA.locations)) {
      if (message.includes(location)) {
        return {
          message: `📍 ${info}\n\nThis hackathon offers great networking opportunities and exciting challenges!`,
          suggestions: ["View details", "Register now", "Find teams", "See schedule"],
          actions: [{ label: "Browse Hackathons", action: "browse_hackathons", url: "/hackathons" }]
        }
      }
    }

    // General location response
    const locations = HACKCONNECT_DATA.hackathons.map(h => `• **${h.name}** - ${h.location} (${h.dates})`).join('\n')
    return {
      message: `🌍 **HackConnect Hackathon Locations:**\n\n${locations}\n\nWe host events both in-person and virtually to accommodate participants worldwide!`,
      suggestions: ["KEC, Erode Tamilnadu", "KEC, Erode Tamilnadu", "KEC, Erode Tamilnadu", "Virtual events"],
      actions: [{ label: "Explore All Locations", action: "browse_hackathons", url: "/hackathons" }]
    }
  }

  private static getDateResponse(message: string): ChatbotResponse {
    const upcomingEvents = HACKCONNECT_DATA.hackathons
      .filter(h => h.status === "Upcoming")
      .map(h => `• **${h.name}** - ${h.dates} in ${h.location}`)
      .join('\n')
    
    const ongoingEvents = HACKCONNECT_DATA.hackathons
      .filter(h => h.status === "Ongoing")
      .map(h => `• **${h.name}** - ${h.dates} in ${h.location} (Currently happening!)`)
      .join('\n')

    let response = "📅 **Hackathon Schedule:**\n\n"
    
    if (ongoingEvents) {
      response += "**🔥 Happening Now:**\n" + ongoingEvents + "\n\n"
    }
    
    if (upcomingEvents) {
      response += "**📋 Upcoming Events:**\n" + upcomingEvents
    }
    
    response += "\n\nDon't miss out on these amazing opportunities to learn, build, and network!"

    return {
      message: response,
      suggestions: ["Register now", "Set reminders", "View details", "Find teams"],
      actions: [{ label: "View Calendar", action: "view_calendar", url: "/calendar" }]
    }
  }

  private static getPlatformResponse(message: string): ChatbotResponse {
    const features = HACKCONNECT_DATA.platform.features.map(f => `• ${f}`).join('\n')
    
    return {
      message: `🚀 **Welcome to ${HACKCONNECT_DATA.platform.name}!**\n\n${HACKCONNECT_DATA.platform.description}\n\n**Key Features:**\n${features}\n\nJoin thousands of developers, designers, and innovators building the future together!`,
      suggestions: ["Get started", "Browse hackathons", "Create profile", "Find teams"],
      actions: [
        { label: "Get Started", action: "get_started", url: "/get-started" },
        { label: "Create Profile", action: "create_profile", url: "/profile" }
      ]
    }
  }

  private static getPrizeResponse(message: string): ChatbotResponse {
    const prizes = HACKCONNECT_DATA.hackathons
      .map(h => `• **${h.name}** - ${h.prize} prize pool`)
      .join('\n')
    
    return {
      message: `💰 **Prize Pools Across HackConnect:**\n\n${prizes}\n\nBeyond monetary rewards, you'll gain:\n• Valuable networking opportunities\n• Skill development and learning\n• Portfolio projects\n• Industry recognition\n• Potential job opportunities\n\nThe real prize is the experience and connections you make! 🏆`,
      suggestions: ["View hackathons", "Registration info", "Team up", "Learn more"],
      actions: [{ label: "Browse Prizes", action: "browse_hackathons", url: "/hackathons" }]
    }
  }

  private static getRegistrationResponse(message: string): ChatbotResponse {
    return {
      message: `📝 **Ready to Join a Hackathon?**\n\nHere's how to get started:\n\n1. **Browse Events** - Check out available hackathons\n2. **Create Profile** - Showcase your skills and interests\n3. **Register** - Sign up for your chosen hackathon\n4. **Form/Join Team** - Connect with other participants\n5. **Prepare** - Review rules, schedule, and resources\n\n**Registration is FREE** for all our hackathons! 🎉\n\nMost hackathons allow teams of 2-5 members, and you can join even if you don't have a team yet!`,
      suggestions: ["Browse hackathons", "Create profile", "Find teams", "View requirements"],
      actions: [
        { label: "Browse Hackathons", action: "browse_hackathons", url: "/hackathons" },
        { label: "Create Profile", action: "create_profile", url: "/profile" }
      ]
    }
  }

  private static getThemeResponse(message: string): ChatbotResponse {
    // Check for specific theme mentions
    for (const [theme, info] of Object.entries(HACKCONNECT_DATA.themes)) {
      if (message.includes(theme)) {
        return {
          message: `🎯 **${theme.toUpperCase()} Theme:**\n\n${info}\n\nThis is a fantastic opportunity to dive deep into ${theme} and build innovative solutions!`,
          suggestions: ["View details", "Register", "Find teams", "See resources"],
          actions: [{ label: "Explore Theme", action: "browse_hackathons", url: "/hackathons" }]
        }
      }
    }

    // General theme response
    const themes = HACKCONNECT_DATA.hackathons
      .map(h => `• **${h.theme}** - ${h.name} (${h.dates})`)
      .join('\n')
    
    return {
      message: `🎨 **Hackathon Themes & Focus Areas:**\n\n${themes}\n\nEach theme offers unique challenges and learning opportunities. Choose one that aligns with your interests and career goals!`,
      suggestions: ["AI & ML", "Blockchain", "Sustainability", "Mobile Apps"],
      actions: [{ label: "Explore All Themes", action: "browse_hackathons", url: "/hackathons" }]
    }
  }

  // New comprehensive response methods using the knowledge base
  private static getTechnologyResponse(message: string): ChatbotResponse {
    const techResponses = Object.values(COMPREHENSIVE_HACKATHON_DATA.technologies).flat();
    const randomResponse = techResponses[Math.floor(Math.random() * techResponses.length)];
    
    return {
      message: `💻 **Technology & Development:**\n\n${randomResponse}\n\nOur hackathons support all major technologies and frameworks. What's your tech stack?`,
      suggestions: ["JavaScript", "Python", "React", "AI/ML", "Blockchain", "Mobile"],
      actions: [{ label: "Browse Tech Hackathons", action: "browse_hackathons", url: "/hackathons" }]
    }
  }

  private static getMotivationResponse(message: string): ChatbotResponse {
    const motivationMsg = COMPREHENSIVE_HACKATHON_DATA.motivation[Math.floor(Math.random() * COMPREHENSIVE_HACKATHON_DATA.motivation.length)];
    
    return {
      message: `✨ **Motivation & Inspiration:**\n\n${motivationMsg}\n\nYou have unique talents and perspectives that can make a real difference!`,
      suggestions: ["Get started", "Find inspiration", "Success stories", "Join community"],
      actions: [{ label: "Get Inspired", action: "browse_hackathons", url: "/hackathons" }]
    }
  }

  private static getNetworkingResponse(message: string): ChatbotResponse {
    const networkingMsg = COMPREHENSIVE_HACKATHON_DATA.networking[Math.floor(Math.random() * COMPREHENSIVE_HACKATHON_DATA.networking.length)];
    
    return {
      message: `🤝 **Networking & Community:**\n\n${networkingMsg}\n\nBuilding connections is just as important as building code!`,
      suggestions: ["Join community", "Find teammates", "Connect with peers", "Attend events"],
      actions: [{ label: "Join Community", action: "join_community", url: "/community" }]
    }
  }

  private static getLearningResponse(message: string): ChatbotResponse {
    const tips = COMPREHENSIVE_HACKATHON_DATA.tips.slice(0, 5).map(tip => `• ${tip}`).join('\n');
    
    return {
      message: `📚 **Learning & Skill Development:**\n\n${tips}\n\nHackathons are incredible learning experiences where you grow by doing!`,
      suggestions: ["Beginner tips", "Advanced strategies", "Workshops", "Teammateship"],
      actions: [{ label: "Learning Resources", action: "learning", url: "/resources" }]
    }
  }

  private static getBusinessResponse(message: string): ChatbotResponse {
    return {
      message: `💼 **Business & Entrepreneurship:**\n\nMany successful startups began at hackathons! Consider the business model, market fit, and scalability of your solution.\n\n• Focus on solving real problems\n• Validate your idea with users\n• Think about monetization\n• Consider the competitive landscape\n• Plan for growth and scaling`,
      suggestions: ["Startup advice", "Business models", "Pitch tips", "Funding info"],
      actions: [{ label: "Startup Resources", action: "startup_resources", url: "/resources" }]
    }
  }

  private static getAIResponse(message: string): ChatbotResponse {
    const aiResponse = COMPREHENSIVE_HACKATHON_DATA.technologies.ai[Math.floor(Math.random() * COMPREHENSIVE_HACKATHON_DATA.technologies.ai.length)];
    
    return {
      message: `🤖 **AI & Machine Learning:**\n\n${aiResponse}\n\nOur AI Innovation Challenge in KEC, Erode Tamilnadu offers $25,000 in prizes and world-class teammateship!`,
      suggestions: ["AI hackathons", "ML tutorials", "AI tools", "Join AI teams"],
      actions: [{ label: "AI Hackathon", action: "ai_hackathon", url: "/hackathons/ai" }]
    }
  }

  private static getBlockchainResponse(message: string): ChatbotResponse {
    const blockchainResponse = COMPREHENSIVE_HACKATHON_DATA.technologies.blockchain[Math.floor(Math.random() * COMPREHENSIVE_HACKATHON_DATA.technologies.blockchain.length)];
    
    return {
      message: `🔗 **Blockchain & Web3:**\n\n${blockchainResponse}\n\nJoin our Blockchain Revolution Hackathon in NYC with $30,000 in prizes!`,
      suggestions: ["Blockchain hackathons", "Smart contracts", "DeFi projects", "NFT creation"],
      actions: [{ label: "Blockchain Hackathon", action: "blockchain_hackathon", url: "/hackathons/blockchain" }]
    }
  }

  private static getMobileResponse(message: string): ChatbotResponse {
    const mobileResponse = COMPREHENSIVE_HACKATHON_DATA.technologies.mobile[Math.floor(Math.random() * COMPREHENSIVE_HACKATHON_DATA.technologies.mobile.length)];
    
    return {
      message: `📱 **Mobile Development:**\n\n${mobileResponse}\n\nOur Mobile App Innovation Challenge in KEC, Erode Tamilnadu awaits with $20,000 in prizes!`,
      suggestions: ["Mobile hackathons", "iOS development", "Android apps", "Cross-platform"],
      actions: [{ label: "Mobile Hackathon", action: "mobile_hackathon", url: "/hackathons/mobile" }]
    }
  }

  private static getWebResponse(message: string): ChatbotResponse {
    const webResponse = COMPREHENSIVE_HACKATHON_DATA.technologies.web[Math.floor(Math.random() * COMPREHENSIVE_HACKATHON_DATA.technologies.web.length)];
    
    return {
      message: `🌐 **Web Development:**\n\n${webResponse}\n\nWeb applications are the backbone of most hackathon projects. Full-stack skills are highly valued!`,
      suggestions: ["Frontend frameworks", "Backend APIs", "Full-stack", "Web3"],
      actions: [{ label: "Web Hackathons", action: "web_hackathons", url: "/hackathons" }]
    }
  }

  private static getDesignResponse(message: string): ChatbotResponse {
    return {
      message: `🎨 **Design & User Experience:**\n\nGreat design can make or break a hackathon project! Focus on:\n\n• User-centered design principles\n• Intuitive navigation and flow\n• Visual hierarchy and typography\n• Accessibility and inclusivity\n• Rapid prototyping techniques\n\nDesigners are in high demand for hackathon teams!`,
      suggestions: ["UI/UX tips", "Design tools", "Find design teams", "Prototyping"],
      actions: [{ label: "Design Resources", action: "design_resources", url: "/resources" }]
    }
  }

  private static getSecurityResponse(message: string): ChatbotResponse {
    return {
      message: `🔒 **Security & Privacy:**\n\nSecurity is crucial in hackathon projects, especially for:\n\n• User data protection\n• Authentication and authorization\n• API security\n• Blockchain smart contract security\n• Privacy-preserving technologies\n\nSecurity-focused projects often win special recognition!`,
      suggestions: ["Security best practices", "Privacy tools", "Cybersecurity", "Secure coding"],
      actions: [{ label: "Security Hackathons", action: "security_hackathons", url: "/hackathons" }]
    }
  }

  private static getSustainabilityResponse(message: string): ChatbotResponse {
    return {
      message: `🌱 **Sustainability & Climate Tech:**\n\nOur virtual Sustainable Tech Solutions hackathon focuses on environmental challenges with $15,000 in prizes!\n\n• Climate change solutions\n• Renewable energy optimization\n• Waste reduction technologies\n• Carbon footprint tracking\n• Sustainable supply chains`,
      suggestions: ["Climate hackathons", "Green tech", "Environmental data", "Sustainability"],
      actions: [{ label: "Sustainability Hackathon", action: "sustainability_hackathon", url: "/hackathons/sustainability" }]
    }
  }

  private static getHealthResponse(message: string): ChatbotResponse {
    return {
      message: `🏥 **Healthcare & Medical Tech:**\n\nHealthtech hackathons create life-changing solutions:\n\n• Telemedicine platforms\n• Medical diagnostic tools\n• Mental health applications\n• Fitness and wellness tracking\n• Healthcare accessibility solutions\n\nMany winning projects have been implemented in real healthcare settings!`,
      suggestions: ["Healthcare hackathons", "Medical AI", "Wellness apps", "Accessibility"],
      actions: [{ label: "Health Hackathons", action: "health_hackathons", url: "/hackathons" }]
    }
  }

  private static getEducationResponse(message: string): ChatbotResponse {
    return {
      message: `📚 **Education & Learning Tech:**\n\nEdTech hackathons revolutionize how we learn:\n\n• Adaptive learning platforms\n• Interactive educational games\n• Virtual classroom tools\n• Skill assessment systems\n• Accessibility in education\n\nEducation projects often have the highest social impact!`,
      suggestions: ["EdTech hackathons", "Learning platforms", "Educational games", "Accessibility"],
      actions: [{ label: "Education Hackathons", action: "education_hackathons", url: "/hackathons" }]
    }
  }

  private static getFintechResponse(message: string): ChatbotResponse {
    return {
      message: `💰 **Fintech & Financial Innovation:**\n\nFinancial technology hackathons explore:\n\n• Digital payment solutions\n• Personal finance management\n• Investment and trading platforms\n• Insurance technology\n• Cryptocurrency and DeFi\n\nFintech projects often attract significant investor interest!`,
      suggestions: ["Fintech hackathons", "Payment systems", "Trading apps", "DeFi projects"],
      actions: [{ label: "Fintech Hackathons", action: "fintech_hackathons", url: "/hackathons" }]
    }
  }
}
