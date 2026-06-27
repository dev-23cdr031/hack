"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ArrowLeft,
  Download,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Calendar,
  Award,
  Code,
  Palette,
  BarChart3,
  Users,
  Star,
  Phone,
  Music,
  Camera,
  Gamepad2,
  Plane,
  Dumbbell,
  Utensils,
  Film,
  Headphones,
  PaintbrushIcon as PaintBrush,
  Mountain,
  Sun,
  Moon,
  Sparkles,
  Zap,
  CheckCircle,
  Settings,
  ChevronUp,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function DivyaDharshiniPortfolio() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTheme, setCurrentTheme] = useState("dark")
  const [activeSection, setActiveSection] = useState("hero")
  const [scrollProgress, setScrollProgress] = useState(0)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)

    const handleScroll = () => {
      const scrolled = window.scrollY
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      const progress = (scrolled / maxScroll) * 100
      setScrollProgress(progress)
    }

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("scroll", handleScroll)
    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  const downloadResume = () => {
    window.open("/resume/divya-dharshini", "_blank")
  }

  const toggleTheme = () => {
    setCurrentTheme(currentTheme === "dark" ? "light" : "dark")
  }

  const skills = {
    frontend: [
      { name: "React.js", level: 95, color: "from-blue-500 to-cyan-500" },
      { name: "TypeScript", level: 90, color: "from-blue-600 to-blue-400" },
      { name: "Next.js", level: 88, color: "from-gray-800 to-gray-600" },
      { name: "Vue.js", level: 85, color: "from-green-500 to-green-400" },
      { name: "Tailwind CSS", level: 92, color: "from-teal-500 to-cyan-500" },
      { name: "SCSS/SASS", level: 87, color: "from-pink-500 to-rose-500" },
      { name: "JavaScript ES6+", level: 93, color: "from-yellow-500 to-orange-500" },
      { name: "HTML5 & CSS3", level: 96, color: "from-orange-500 to-red-500" },
    ],
    design: [
      { name: "UI/UX", level: 96, color: "from-purple-500 to-pink-500" },
      { name: "Adobe XD", level: 85, color: "from-purple-600 to-blue-600" },
      { name: "Sketch", level: 80, color: "from-yellow-500 to-orange-500" },
      { name: "Adobe Photoshop", level: 88, color: "from-blue-600 to-purple-600" },
      { name: "Adobe Illustrator", level: 82, color: "from-orange-500 to-red-500" },
      { name: "Prototyping", level: 92, color: "from-green-500 to-teal-500" },
      { name: "User Research", level: 89, color: "from-indigo-500 to-purple-500" },
      { name: "Design Systems", level: 94, color: "from-pink-500 to-purple-500" },
    ],
    backend: [
      { name: "Python", level: 85, color: "from-blue-500 to-green-500" },
      { name: "Node.js", level: 87, color: "from-green-600 to-green-400" },
      { name: "Django", level: 82, color: "from-green-700 to-green-500" },
      { name: "PostgreSQL", level: 88, color: "from-blue-600 to-indigo-600" },
      { name: "MongoDB", level: 83, color: "from-green-500 to-teal-500" },
      { name: "REST APIs", level: 90, color: "from-purple-500 to-indigo-500" },
      { name: "GraphQL", level: 78, color: "from-pink-500 to-purple-500" },
      { name: "AWS", level: 80, color: "from-orange-500 to-yellow-500" },
    ],
  }

  const hobbies = [
    {
      name: "Photography",
      icon: Camera,
      description: "Capturing moments through landscape and portrait photography",
      level: "Advanced",
      color: "from-purple-500 to-pink-500",
      achievements: ["500+ photos on Instagram", "Featured in local gallery", "Wedding photographer"],
      tools: ["Canon EOS R5", "Adobe Lightroom", "Photoshop"],
    },
    {
      name: "Digital Art",
      icon: PaintBrush,
      description: "Creating digital illustrations and UI animations",
      level: "Intermediate",
      color: "from-pink-500 to-rose-500",
      achievements: ["50+ digital artworks", "NFT collection creator", "Design contest winner"],
      tools: ["Procreate", "Adobe Illustrator", "Blender"],
    },
    {
      name: "Music Production",
      icon: Music,
      description: "Composing electronic music and ambient soundscapes",
      level: "Intermediate",
      color: "from-blue-500 to-purple-500",
      achievements: ["10+ tracks released", "Spotify playlist features", "Local DJ performances"],
      tools: ["Ableton Live", "Logic Pro", "Native Instruments"],
    },
    {
      name: "Gaming",
      icon: Gamepad2,
      description: "Strategy games, indie titles, and game development",
      level: "Expert",
      color: "from-green-500 to-teal-500",
      achievements: ["Top 1% in competitive games", "Game jam participant", "Twitch streamer"],
      tools: ["Unity", "Unreal Engine", "Steam", "Nintendo Switch"],
    },
    {
      name: "Travel & Adventure",
      icon: Plane,
      description: "Exploring new cultures and documenting travel experiences",
      level: "Enthusiast",
      color: "from-orange-500 to-red-500",
      achievements: ["15+ countries visited", "Travel blog with 10k readers", "Adventure photographer"],
      tools: ["Travel planning apps", "GoPro", "Travel journal"],
    },
    {
      name: "Fitness & Yoga",
      icon: Dumbbell,
      description: "Maintaining physical and mental wellness through exercise",
      level: "Regular",
      color: "from-teal-500 to-green-500",
      achievements: ["5+ years yoga practice", "Marathon finisher", "Fitness coach certified"],
      tools: ["Yoga mat", "Fitness tracker", "Meditation apps"],
    },
    {
      name: "Cooking & Baking",
      icon: Utensils,
      description: "Experimenting with international cuisines and desserts",
      level: "Passionate",
      color: "from-yellow-500 to-orange-500",
      achievements: ["100+ recipes mastered", "Food blog contributor", "Baking competition winner"],
      tools: ["Professional kitchen tools", "Recipe apps", "Food photography"],
    },
    {
      name: "Film & Animation",
      icon: Film,
      description: "Creating short films and motion graphics",
      level: "Learning",
      color: "from-indigo-500 to-purple-500",
      achievements: ["5+ short films created", "Animation workshop graduate", "Film festival submission"],
      tools: ["After Effects", "Premiere Pro", "Cinema 4D"],
    },
    {
      name: "Podcasting",
      icon: Headphones,
      description: "Hosting tech talks and design discussions",
      level: "Active",
      color: "from-purple-500 to-blue-500",
      achievements: ["50+ episodes published", "1000+ monthly listeners", "Guest on tech podcasts"],
      tools: ["Audio interface", "Podcast editing software", "Streaming platforms"],
    },
    {
      name: "Hiking & Nature",
      icon: Mountain,
      description: "Exploring trails and connecting with nature",
      level: "Weekend Warrior",
      color: "from-green-600 to-teal-600",
      achievements: ["50+ trails completed", "Nature photography awards", "Environmental volunteer"],
      tools: ["Hiking gear", "Trail apps", "Nature guides"],
    },
  ]

  const projects = [
    {
      title: "EcoTrack - Sustainability Dashboard",
      description:
        "A comprehensive platform for tracking personal and corporate carbon footprints with AI-powered recommendations for reducing environmental impact. Features real-time data visualization, goal setting, and community challenges.",
      image: "/sustainability-dashboard.png",
      technologies: ["React", "TypeScript", "Python", "TensorFlow", "D3.js", "PostgreSQL"],
      features: [
        "AI-powered carbon footprint analysis",
        "Real-time environmental data tracking",
        "Gamified sustainability challenges",
        "Corporate ESG reporting tools",
        "Community leaderboards and social features",
        "Mobile app with offline capabilities",
      ],
      metrics: {
        users: "50k+",
        carbonSaved: "1000 tons",
        rating: "4.8/5",
        downloads: "25k+",
      },
      status: "Live",
      category: "Environmental Tech",
      duration: "8 months",
      team: "5 developers",
      role: "Lead Frontend Developer & UX Designer",
    },
    {
      title: "MindfulSpace - Mental Health Platform",
      description:
        "A holistic mental wellness platform combining meditation, therapy sessions, mood tracking, and AI-powered insights. Designed with accessibility and privacy as core principles.",
      image: "/placeholder-3lzdi.png",
      technologies: ["Next.js", "React Native", "Node.js", "MongoDB", "WebRTC", "TensorFlow.js"],
      features: [
        "Guided meditation with binaural audio",
        "Video therapy sessions with licensed professionals",
        "Mood tracking with pattern analysis",
        "AI chatbot for immediate support",
        "Crisis intervention protocols",
        "HIPAA-compliant data handling",
      ],
      metrics: {
        users: "30k+",
        sessions: "100k+",
        rating: "4.9/5",
        retention: "85%",
      },
      status: "Beta",
      category: "Healthcare",
      duration: "12 months",
      team: "8 developers",
      role: "Full Stack Developer & Product Designer",
    },
    {
      title: "CodeCollab - Developer Community",
      description:
        "A collaborative platform for developers to share code, get reviews, participate in coding challenges, and build projects together. Features real-time collaboration and AI-powered code analysis.",
      image: "/react-code-patterns.png",
      technologies: ["Vue.js", "Express.js", "Socket.io", "Redis", "Docker", "AWS"],
      features: [
        "Real-time collaborative code editing",
        "AI-powered code review and suggestions",
        "Skill-based developer matching",
        "Integrated video calls and screen sharing",
        "Project showcase and portfolio builder",
        "Coding challenge tournaments",
      ],
      metrics: {
        users: "75k+",
        projects: "10k+",
        rating: "4.7/5",
        collaborations: "5k+",
      },
      status: "Live",
      category: "Developer Tools",
      duration: "10 months",
      team: "6 developers",
      role: "Frontend Lead & Community Manager",
    },
    {
      title: "ArtisanMarket - Creative Marketplace",
      description:
        "An e-commerce platform specifically designed for independent artists and craftspeople to sell their work. Features AR try-on, custom commission system, and artist story integration.",
      image: "/placeholder-46h8b.png",
      technologies: ["React", "Shopify API", "Three.js", "Stripe", "Firebase", "AR.js"],
      features: [
        "AR product visualization and try-on",
        "Custom commission request system",
        "Artist story and process documentation",
        "Integrated shipping and inventory management",
        "Social features and artist following",
        "Multi-currency and international shipping",
      ],
      metrics: {
        artists: "2k+",
        sales: "$500k+",
        rating: "4.6/5",
        orders: "15k+",
      },
      status: "Live",
      category: "E-commerce",
      duration: "6 months",
      team: "4 developers",
      role: "Lead Developer & UX Designer",
    },
  ]

  const testimonials = [
    {
      name: "Dev Dharrshan",
      role: "Product Manager at TechCorp",
      company: "TechCorp Solutions",
      image: "/placeholder-rm6lq.png",
      quote:
        "Divya's ability to bridge design and development is exceptional. She delivered a complete redesign that increased our user engagement by 60% and reduced bounce rate by 40%. Her attention to detail and user-centric approach made all the difference.",
      rating: 5,
      project: "E-commerce Platform Redesign",
    },
    {
      name: "Bharani",
      role: "CTO",
      company: "StartupHub",
      image: "/placeholder-rm6lq.png",
      quote:
        "Working with Divya was a game-changer for our startup. She not only built our entire frontend but also helped us establish a design system that scaled with our growth. Her technical skills are matched by her creative vision.",
      rating: 5,
      project: "Healthcare Management System",
    },
    {
      name: "Anusree",
      role: "Design Director",
      company: "Creative Studio",
      image: "/placeholder-rm6lq.png",
      quote:
        "Divya brings a unique perspective to every project. Her background in both design and development allows her to create solutions that are not just beautiful, but also technically sound and user-friendly. She's a true asset to any team.",
      rating: 5,
      project: "Design System Implementation",
    },
  ]

  const achievements = [
    {
      title: "Best UI/UX Design Award",
      organization: "Chennai Design Conference 2023",
      date: "December 2023",
      description: "Recognized for innovative approach to accessibility in web design",
      icon: Award,
      color: "from-yellow-500 to-orange-500",
    },
    {
      title: "Hackathon Winner - Smart City Solutions",
      organization: "Chennai Tech Fest 2022",
      date: "October 2022",
      description: "Led team to victory with sustainable urban planning application",
      icon: Trophy,
      color: "from-green-500 to-teal-500",
    },
    {
      title: "Open Source Contributor of the Year",
      organization: "GitHub India",
      date: "January 2023",
      description: "Contributed to 15+ major open source projects with 500+ commits",
      icon: Github,
      color: "from-purple-500 to-indigo-500",
    },
    {
      title: "Women in Tech Leadership Award",
      organization: "Tech Women Chennai",
      date: "March 2023",
      description: "Recognized for guideing junior developers and promoting diversity",
      icon: Users,
      color: "from-pink-500 to-rose-500",
    },
  ]

  return (
    <div
      className={`min-h-screen transition-all duration-1000 ${
        currentTheme === "dark"
          ? "bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900"
          : "bg-gradient-to-br from-purple-100 via-blue-100 to-indigo-100"
      } text-white relative overflow-hidden`}
    >
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"
          style={{
            left: mousePosition.x - 192,
            top: mousePosition.y - 192,
            transition: "all 0.3s ease-out",
          }}
        />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-pink-500/5 rounded-full blur-2xl animate-bounce" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-2xl animate-pulse" />
      </div>

      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-800/50 z-50">
        <div
          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="fixed top-6 right-6 z-50 p-3 rounded-full transition-all duration-300 bg-black/20 backdrop-blur-sm hover:bg-white/20 text-white hover:text-purple-300"
      >
        {currentTheme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      </button>

      {/* Navigation */}
      <nav className="flex justify-between items-center p-6 md:px-12 bg-black/20 backdrop-blur-sm sticky top-0 z-40">
        <Link href="/about" className="flex items-center gap-2 text-white hover:text-purple-300 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Team
        </Link>
        <div className="flex-1 flex justify-center">
          <Link
            href="/"
            className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
          >
            HackConnect
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        {/* Hero Section */}
        <div
          className={`text-center mb-20 transform transition-all duration-1000 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <div className="relative inline-block mb-8">
            <div className="w-72 h-72 rounded-full bg-gradient-to-br from-purple-400 via-pink-500 to-rose-500 p-2 mx-auto shadow-2xl shadow-pink-500/30">
              <Image
                src="/team/divya-dharshini.jpg"
                alt="Divya Dharshini Profile"
                width={288}
                height={288}
                priority
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-green-500 rounded-full border-4 border-white flex items-center justify-center animate-bounce">
              <div className="w-6 h-6 bg-white rounded-full animate-pulse" />
            </div>
            <div className="absolute -top-4 -left-4 w-12 h-12 bg-yellow-500 rounded-full border-4 border-white flex items-center justify-center animate-spin">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
          </div>

          <h1 className="text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 bg-clip-text text-transparent animate-pulse">
            Divya Dharshini
          </h1>
          <div className="flex justify-center items-center gap-4 mb-6">
            <div className="h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent w-20" />
            <p className="text-3xl text-purple-200 font-light">Full Stack Developer & UI/UX Designer</p>
            <div className="h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent w-20" />
          </div>

          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8 font-light">
            ✨ Passionate about creating beautiful, functional digital experiences that bridge the gap between design
            and development. I specialize in crafting user-centered solutions that not only look stunning but also
            deliver exceptional performance and accessibility. With a keen eye for detail and a love for innovation, I
            transform ideas into reality through code and creativity. 🚀
          </p>

          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <div className="flex items-center gap-2 text-purple-300 bg-white/10 px-6 py-3 rounded-full backdrop-blur-sm hover:bg-white/20 transition-all duration-300 cursor-pointer">
              <MapPin className="w-5 h-5" />
              <span>Namakkal,Tamil Nadu,India</span>
            </div>
            <div className="flex items-center gap-2 text-purple-300 bg-white/10 px-6 py-3 rounded-full backdrop-blur-sm hover:bg-white/20 transition-all duration-300 cursor-pointer">
              <Phone className="w-5 h-5" />
              <span>+91 63699 66349 📱</span>
            </div>
            <div className="flex items-center gap-2 text-purple-300 bg-white/10 px-6 py-3 rounded-full backdrop-blur-sm hover:bg-white/20 transition-all duration-300 cursor-pointer">
              <Calendar className="w-5 h-5" />
              <span>Available for Projects 💼</span>
            </div>
            <div className="flex items-center gap-2 text-purple-300 bg-white/10 px-6 py-3 rounded-full backdrop-blur-sm hover:bg-white/20 transition-all duration-300 cursor-pointer">
              <Award className="w-5 h-5" />
              <span>3+ Years Experience 🏆</span>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Button
              onClick={downloadResume}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <Download className="w-5 h-5 mr-2" />
              Download Resume ⬇️
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
              <div className="text-4xl font-bold text-purple-400 mb-2">50+</div>
              <div className="text-gray-300">Projects Completed 🚀</div>
            </div>
            <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
              <div className="text-4xl font-bold text-pink-400 mb-2">15+</div>
              <div className="text-gray-300">Happy Clients 😊</div>
            </div>
            <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
              <div className="text-4xl font-bold text-blue-400 mb-2">98%</div>
              <div className="text-gray-300">Client Satisfaction ⭐</div>
            </div>
            <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
              <div className="text-4xl font-bold text-green-400 mb-2">24/7</div>
              <div className="text-gray-300">Support Available 🔧</div>
            </div>
          </div>
        </div>

        {/* Technical Skills with Interactive Progress Bars */}
        <div className="mb-20">
          <h2 className="text-5xl font-bold mb-12 text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Technical Expertise 🛠️
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Frontend Skills */}
            <Card className="bg-white/10 backdrop-blur-sm border-purple-500/30 hover:border-purple-400 transition-all duration-300 transform hover:scale-105">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-purple-300 text-2xl">
                  <Code className="w-8 h-8" />
                  Frontend Development 💻
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {skills.frontend.map((skill, index) => (
                  <div key={skill.name} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-medium">{skill.name}</span>
                      <span className="text-purple-300 text-sm">{skill.level}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${skill.color} rounded-full transition-all duration-1000 ease-out`}
                        style={{
                          width: isVisible ? `${skill.level}%` : "0%",
                          transitionDelay: `${index * 100}ms`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Design Skills */}
            <Card className="bg-white/10 backdrop-blur-sm border-pink-500/30 hover:border-pink-400 transition-all duration-300 transform hover:scale-105">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-pink-300 text-2xl">
                  <Palette className="w-8 h-8" />
                  UI/UX Design 🎨
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {skills.design.map((skill, index) => (
                  <div key={skill.name} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-medium">{skill.name}</span>
                      <span className="text-pink-300 text-sm">{skill.level}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${skill.color} rounded-full transition-all duration-1000 ease-out`}
                        style={{
                          width: isVisible ? `${skill.level}%` : "0%",
                          transitionDelay: `${index * 100}ms`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Backend Skills */}
            <Card className="bg-white/10 backdrop-blur-sm border-blue-500/30 hover:border-blue-400 transition-all duration-300 transform hover:scale-105">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-blue-300 text-2xl">
                  <BarChart3 className="w-8 h-8" />
                  Backend & Data 🗄️
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {skills.backend.map((skill, index) => (
                  <div key={skill.name} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-medium">{skill.name}</span>
                      <span className="text-blue-300 text-sm">{skill.level}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${skill.color} rounded-full transition-all duration-1000 ease-out`}
                        style={{
                          width: isVisible ? `${skill.level}%` : "0%",
                          transitionDelay: `${index * 100}ms`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Hobbies & Interests Section */}
        <div className="mb-20">
          <h2 className="text-5xl font-bold mb-12 text-center bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            Hobbies & Passions 🌟
          </h2>
          <p className="text-xl text-gray-300 text-center mb-12 max-w-3xl mx-auto">
            Beyond coding and designing, I'm passionate about various creative and adventurous pursuits that fuel my
            creativity and keep me inspired! 🎯
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {hobbies.map((hobby, index) => (
              <Card
                key={hobby.name}
                className="bg-white/10 backdrop-blur-sm border-gray-500/30 hover:border-purple-400 transition-all duration-300 transform hover:scale-105 hover:rotate-1"
              >
                <CardHeader>
                  <div
                    className={`w-16 h-16 bg-gradient-to-r ${hobby.color} rounded-full flex items-center justify-center mb-4 mx-auto`}
                  >
                    <hobby.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-white text-xl text-center">{hobby.name}</CardTitle>
                  <div className="text-center">
                    <Badge className={`bg-gradient-to-r ${hobby.color} text-white border-none`}>{hobby.level}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-300 text-center leading-relaxed">{hobby.description}</p>

                  <div>
                    <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-yellow-400" />
                      Achievements
                    </h4>
                    <ul className="space-y-1">
                      {hobby.achievements.map((achievement, i) => (
                        <li key={i} className="text-gray-300 text-sm flex items-center gap-2">
                          <CheckCircle className="w-3 h-3 text-green-400" />
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                      <Settings className="w-4 h-4 text-blue-400" />
                      Tools & Equipment
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {hobby.tools.map((tool, i) => (
                        <Badge key={i} className="bg-gray-700 text-gray-300 text-xs border-gray-600">
                          {tool}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Featured Projects with Enhanced Details */}
        <div className="mb-20">
          <h2 className="text-5xl font-bold mb-12 text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Featured Projects 🚀
          </h2>

          <div className="space-y-12">
            {projects.map((project, index) => (
              <Card
                key={project.title}
                className={`bg-white/10 backdrop-blur-sm border-purple-500/30 hover:border-purple-400 transition-all duration-500 transform hover:scale-102 ${
                  index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                }`}
              >
                <div className="lg:flex">
                  <div className="lg:w-1/2 p-8">
                    <div className="flex items-center gap-4 mb-4">
                      <Badge
                        className={`bg-gradient-to-r ${
                          index % 4 === 0
                            ? "from-purple-500 to-pink-500"
                            : index % 4 === 1
                              ? "from-blue-500 to-teal-500"
                              : index % 4 === 2
                                ? "from-green-500 to-blue-500"
                                : "from-orange-500 to-red-500"
                        } text-white border-none`}
                      >
                        {project.status}
                      </Badge>
                      <Badge variant="outline" className="border-gray-500 text-gray-300">
                        {project.category}
                      </Badge>
                    </div>

                    <h3 className="text-3xl font-bold text-white mb-4">{project.title}</h3>
                    <p className="text-gray-300 leading-relaxed mb-6">{project.description}</p>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="text-center bg-white/5 rounded-lg p-3">
                        <div className="text-2xl font-bold text-purple-400">{project.metrics.users}</div>
                        <div className="text-gray-400 text-sm">Users</div>
                      </div>
                      <div className="text-center bg-white/5 rounded-lg p-3">
                        <div className="text-2xl font-bold text-pink-400">{project.metrics.rating}</div>
                        <div className="text-gray-400 text-sm">Rating</div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                        <Zap className="w-4 h-4 text-yellow-400" />
                        Key Features
                      </h4>
                      <ul className="space-y-2">
                        {project.features.slice(0, 4).map((feature, i) => (
                          <li key={i} className="text-gray-300 text-sm flex items-center gap-2">
                            <CheckCircle className="w-3 h-3 text-green-400" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.technologies.map((tech) => (
                        <Badge key={tech} className="bg-purple-500/20 text-purple-200 border-purple-500/30 text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>

                    <div className="mt-4">{/* Buttons removed as requested */}</div>
                  </div>

                  <div className="lg:w-1/2 p-8 flex items-center justify-center">
                    <div className="relative group">
                      <img
                        src={project.image || "/placeholder.svg"}
                        alt={project.title}
                        className="w-full h-80 object-cover rounded-xl shadow-2xl group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="text-white text-sm">
                          <div className="flex justify-between items-center">
                            <span>{project.duration}</span>
                            <span>{project.team}</span>
                          </div>
                          <div className="text-purple-300 text-xs mt-1">{project.role}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="mb-20">
          <h2 className="text-5xl font-bold mb-12 text-center bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
            Client Testimonials 💬
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={testimonial.name}
                className="bg-white/10 backdrop-blur-sm border-gray-500/30 hover:border-purple-400 transition-all duration-300 transform hover:scale-105"
              >
                <CardContent className="p-8">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>

                  <blockquote className="text-gray-300 italic leading-relaxed mb-6">"{testimonial.quote}"</blockquote>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <div className="text-white font-semibold">{testimonial.name}</div>
                      <div className="text-purple-300 text-sm">{testimonial.role}</div>
                      <div className="text-gray-400 text-xs">{testimonial.company}</div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <div className="text-gray-400 text-xs">Project: {testimonial.project}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Contact Section with Enhanced Design */}
        <div className="text-center bg-gradient-to-r from-purple-900/50 to-pink-900/50 backdrop-blur-sm rounded-3xl p-12 border border-purple-500/30">
          <h2 className="text-5xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Let's Create Something Amazing Together! 🌟
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            I'm always excited to collaborate on innovative projects and connect with fellow developers, designers, and
            entrepreneurs. Whether you have a project in mind or just want to chat about technology and design, I'd love
            to hear from you! Let's turn your ideas into reality! 🚀✨
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <a
              href="mailto:divya.dharshini@hackconnect.com"
              className="flex items-center gap-3 text-purple-300 hover:text-purple-200 transition-all duration-300 bg-white/10 p-6 rounded-2xl backdrop-blur-sm hover:bg-white/20 transform hover:scale-105"
            >
              <Mail className="w-8 h-8" />
              <div className="text-left">
                <div className="font-semibold text-lg">Email 📧</div>
                <div className="text-sm">divyadharshinis.23csd@kongu.edu</div>
              </div>
            </a>
            <a
              href="tel:+919876543210"
              className="flex items-center gap-3 text-purple-300 hover:text-purple-200 transition-all duration-300 bg-white/10 p-6 rounded-2xl backdrop-blur-sm hover:bg-white/20 transform hover:scale-105"
            >
              <Phone className="w-8 h-8" />
              <div className="text-left">
                <div className="font-semibold text-lg">Phone 📱</div>
                <div className="text-sm">+91 63699 66349</div>
              </div>
            </a>
          </div>

          <div className="mt-8">{/* Contact buttons removed as requested */}</div>
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <Button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300"
        >
          <ChevronUp className="w-6 h-6" />
        </Button>
      </div>
    </div>
  )
}

// Add Trophy import
function Trophy({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M7 4V2C7 1.45 7.45 1 8 1H16C16.55 1 17 1.45 17 2V4H20.38C20.8 4 21.11 4.42 20.96 4.82L20.76 5.42C20.32 6.87 19.02 8 17.44 8H16.69C16.89 9.28 17 10.62 17 12C17 16.42 13.42 20 9 20H15C18.31 20 21 17.31 21 14V13C21 12.45 20.55 12 20 12S19 12.45 19 13V14C19 16.21 17.21 18 15 18H9C5.69 18 3 15.31 3 12S5.69 6 9 6H15C15.55 6 16 5.55 16 5S15.55 4 15 4H7Z" />
    </svg>
  )
}
