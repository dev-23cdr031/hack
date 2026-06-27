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
  Leaf,
  BarChart3,
  Brain,
  Star,
  Code,
  Phone,
  Moon,
  Sun,
  ArrowUp,
  Sparkles,
  Mountain,
  Coffee,
  BookOpen,
  Gamepad2,
  Music,
  Plane,
  Dumbbell,
  Users,
  Target,
} from "lucide-react"
import Link from "next/link"

export default function DhivakarPortfolio() {
  const [isDark, setIsDark] = useState(true)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
      const scroll = `${totalScroll / windowHeight}`
      setScrollProgress(Number.parseFloat(scroll) * 100)
      setShowScrollTop(totalScroll > 500)
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
    window.open("/resume/dhivakar", "_blank")
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const toggleTheme = () => {
    setIsDark(!isDark)
  }

  const skills = [
    { name: "Python", level: 95, color: "from-green-400 to-emerald-500" },
    { name: "JavaScript", level: 88, color: "from-emerald-400 to-teal-500" },
    { name: "React", level: 85, color: "from-teal-400 to-cyan-500" },
    { name: "Django", level: 92, color: "from-green-500 to-emerald-600" },
    { name: "FastAPI", level: 90, color: "from-emerald-500 to-teal-600" },
    { name: "PostgreSQL", level: 87, color: "from-teal-500 to-cyan-600" },
    { name: "TensorFlow", level: 83, color: "from-green-400 to-emerald-400" },
    { name: "Docker", level: 89, color: "from-emerald-400 to-teal-400" },
    { name: "AWS", level: 86, color: "from-teal-400 to-cyan-400" },
    { name: "Machine Learning", level: 91, color: "from-green-500 to-emerald-500" },
    { name: "Data Analysis", level: 94, color: "from-emerald-500 to-teal-500" },
    { name: "IoT Development", level: 88, color: "from-teal-500 to-cyan-500" },
  ]

  const hobbies = [
    {
      icon: <Leaf className="w-6 h-6" />,
      title: "Environmental Photography",
      description: "Capturing nature's beauty and climate change impacts. Featured in National Geographic contest.",
      achievements: "📸 500+ nature photos • 🏆 3 photography awards • 🌍 Climate documentation project",
    },
    {
      icon: <Mountain className="w-6 h-6" />,
      title: "Sustainable Hiking & Trekking",
      description: "Exploring eco-trails and promoting Leave No Trace principles. Completed 40+ mountain trails.",
      achievements: "🥾 40+ trails completed • 🌱 Eco-guide certified • 🏔️ Himalayan expedition leader",
    },
    {
      icon: <Coffee className="w-6 h-6" />,
      title: "Organic Coffee Farming",
      description: "Growing and processing organic coffee beans using sustainable farming methods.",
      achievements: "☕ 200+ coffee plants • 🌱 Organic certification • 🏆 Best sustainable farm award",
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Climate Science Research",
      description: "Reading and contributing to climate change research papers and environmental studies.",
      achievements: "📚 50+ research papers • 📝 3 published articles • 🎓 Climate science certification",
    },
    {
      icon: <Gamepad2 className="w-6 h-6" />,
      title: "Eco-Gaming & Green Tech",
      description: "Developing environmental awareness games and promoting green gaming practices.",
      achievements: "🎮 2 eco-games developed • 🌍 10k+ players educated • 🏆 Green game jam winner",
    },
    {
      icon: <Music className="w-6 h-6" />,
      title: "Nature Sound Recording",
      description: "Recording natural soundscapes for meditation apps and environmental awareness projects.",
      achievements: "🎵 100+ nature recordings • 🧘 Meditation app featured • 🎧 5k+ downloads",
    },
    {
      icon: <Plane className="w-6 h-6" />,
      title: "Carbon-Neutral Travel",
      description: "Exploring sustainable tourism and documenting eco-friendly travel destinations.",
      achievements: "✈️ 12 countries visited • 🌱 100% carbon offset • 📝 Eco-travel blog (2k followers)",
    },
    {
      icon: <Dumbbell className="w-6 h-6" />,
      title: "Green Fitness & Yoga",
      description: "Practicing outdoor yoga and promoting eco-friendly fitness routines in nature.",
      achievements: "🧘 500-hour yoga certification • 🌳 Outdoor fitness instructor • 💪 Marathon runner",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Environmental Volunteering",
      description: "Leading community clean-up drives and tree plantation initiatives.",
      achievements: "🌳 1000+ trees planted • 👥 50+ volunteers led • 🏆 Community service award",
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Renewable Energy Projects",
      description: "Building DIY solar panels and wind turbines for sustainable energy solutions.",
      achievements: "⚡ 5 solar projects • 🌪️ 2 wind turbines built • 🔋 Energy independence achieved",
    },
  ]

  const projects = [
    {
      title: "Smart City Carbon Tracker",
      description:
        "AI-powered platform that monitors and predicts carbon emissions across urban areas using IoT sensors and satellite data. Helps cities reduce their carbon footprint by 35% through data-driven insights.",
      image: <Leaf className="w-16 h-16 text-white" />,
      gradient: "from-green-600 to-emerald-600",
      technologies: ["Python", "TensorFlow", "IoT", "React", "PostgreSQL", "AWS"],
      metrics: {
        users: "50+ cities",
        impact: "35% carbon reduction",
        data: "1M+ data points/day",
        duration: "18 months",
        team: "8 developers",
        role: "Lead Data Engineer",
      },
      features: [
        "Real-time emission monitoring",
        "Predictive analytics dashboard",
        "IoT sensor network integration",
        "Satellite data processing",
        "City-wide reporting system",
      ],
    },
    {
      title: "Renewable Energy Optimizer",
      description:
        "Machine learning system that optimizes renewable energy distribution across smart grids, increasing efficiency by 40% and reducing energy waste through predictive load balancing.",
      image: <BarChart3 className="w-16 h-16 text-white" />,
      gradient: "from-emerald-600 to-teal-600",
      technologies: ["Python", "Scikit-learn", "FastAPI", "Redis", "Docker", "Kubernetes"],
      metrics: {
        users: "25 energy companies",
        impact: "40% efficiency increase",
        data: "500GB processed daily",
        duration: "12 months",
        team: "6 engineers",
        role: "ML Engineer",
      },
      features: [
        "Smart grid optimization",
        "Load prediction algorithms",
        "Energy storage management",
        "Real-time monitoring",
        "Automated load balancing",
      ],
    },
    {
      title: "EcoLife Sustainability App",
      description:
        "Mobile application that gamifies sustainable living by tracking personal carbon footprint, suggesting eco-friendly alternatives, and connecting users with local environmental initiatives.",
      image: <Brain className="w-16 h-16 text-white" />,
      gradient: "from-teal-600 to-cyan-600",
      technologies: ["React Native", "Node.js", "MongoDB", "Firebase", "TensorFlow Lite"],
      metrics: {
        users: "100k+ downloads",
        impact: "25% lifestyle change",
        data: "Personal tracking for 50k users",
        duration: "15 months",
        team: "5 developers",
        role: "Full-Stack Developer",
      },
      features: [
        "Carbon footprint calculator",
        "Sustainable challenges",
        "Local eco-events finder",
        "Progress gamification",
        "Community leaderboards",
      ],
    },
    {
      title: "Climate Data Analytics Platform",
      description:
        "Comprehensive platform for processing and analyzing global climate data from multiple sources, providing insights for researchers and policymakers to make informed environmental decisions.",
      image: <Code className="w-16 h-16 text-white" />,
      gradient: "from-cyan-600 to-blue-600",
      technologies: ["Python", "Pandas", "Django", "PostgreSQL", "Apache Kafka", "Elasticsearch"],
      metrics: {
        users: "200+ researchers",
        impact: "15 research papers published",
        data: "10TB climate data processed",
        duration: "24 months",
        team: "10 scientists & engineers",
        role: "Data Platform Architect",
      },
      features: [
        "Multi-source data integration",
        "Advanced analytics dashboard",
        "Research collaboration tools",
        "Data visualization suite",
        "API for external researchers",
      ],
    },
  ]

  const testimonials = [
    {
      name: "Dr. Dev Dharrshan",
      role: "Climate Research Director",
      company: "Global Environmental Institute",
      rating: 5,
      text: "Dhivakar's work on our climate data platform has been exceptional. His ability to process complex environmental data and create meaningful insights has accelerated our research by months. The platform he built is now used by researchers worldwide.",
      project: "Climate Data Analytics Platform",
    },
    {
      name: "Bharani",
      role: "Smart City Manager",
      company: "Barcelona City Council",
      rating: 5,
      text: "The carbon tracking system Dhivakar developed has transformed how we approach sustainability in our city. We've seen a 35% reduction in emissions since implementation. His technical expertise combined with environmental passion is remarkable.",
      project: "Smart City Carbon Tracker",
    },
    {
      name: "Hemapriya",
      role: "Sustainability Director",
      company: "GreenTech Solutions",
      rating: 5,
      text: "Working with Dhivakar on our renewable energy optimization project was incredible. His machine learning models increased our grid efficiency by 40%. He's not just a great developer, but a true environmental advocate.",
      project: "Renewable Energy Optimizer",
    },
  ]

  return (
    <div
      className={`min-h-screen transition-all duration-500 ${
        isDark
          ? "bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900 text-white"
          : "bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 text-gray-900"
      }`}
    >
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-96 h-96 bg-green-500/10 rounded-full blur-3xl transition-all duration-1000"
          style={{
            left: mousePosition.x - 192,
            top: mousePosition.y - 192,
          }}
        />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-500/5 rounded-full blur-2xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-teal-500/5 rounded-full blur-2xl animate-pulse delay-1000" />
      </div>

      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-black/10 z-50">
        <div
          className="h-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className={`fixed top-6 right-6 z-50 p-3 rounded-full transition-all duration-300 ${
          isDark ? "bg-white/10 hover:bg-white/20" : "bg-black/10 hover:bg-black/20"
        } backdrop-blur-sm`}
      >
        {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 p-3 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg transition-all duration-300 hover:scale-110"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

      {/* Navigation */}
      <nav
        className={`flex justify-between items-center p-6 md:px-12 ${
          isDark ? "bg-black/20" : "bg-white/20"
        } backdrop-blur-sm sticky top-0 z-40`}
      >
        <Link
          href="/about"
          className={`flex items-center gap-2 ${
            isDark ? "text-white hover:text-green-300" : "text-gray-900 hover:text-green-600"
          } transition-colors`}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Team
        </Link>
        <div className="flex-1 flex justify-center">
          <Link
            href="/"
            className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent"
          >
            HackConnect
          </Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-12 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="relative inline-block mb-8">
            <div className="w-56 h-56 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 p-1 mx-auto shadow-2xl shadow-emerald-500/30">
              <div
                className={`w-full h-full rounded-full ${
                  isDark ? "bg-gray-800" : "bg-white"
                } flex items-center justify-center overflow-hidden`}
              >
                <img
                  src="/team/divakar.jpg"
                  alt="Dhivakar"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
            </div>
            <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-green-500 rounded-full border-4 border-white flex items-center justify-center animate-bounce">
              <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
            <Sparkles className="absolute -top-4 -left-4 w-8 h-8 text-green-400 animate-spin" />
            <Sparkles className="absolute -bottom-4 -right-8 w-6 h-6 text-emerald-400 animate-ping" />
          </div>

          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
            Dhivakar
          </h1>
          <p className={`text-2xl mb-6 ${isDark ? "text-green-200" : "text-green-700"}`}>
            Software Developer & Data Engineer
          </p>
          <p className={`text-lg max-w-3xl mx-auto leading-relaxed mb-8 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
            Passionate about sustainable technology and data-driven solutions. I specialize in building eco-friendly
            applications and leveraging machine learning to solve environmental challenges. 🌱 Building a greener future
            through code.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className={`flex items-center gap-2 ${isDark ? "text-green-300" : "text-green-600"}`}>
              <MapPin className="w-4 h-4" />
              <span>erode,India</span>
            </div>
            <div className={`flex items-center gap-2 ${isDark ? "text-green-300" : "text-green-600"}`}>
              <Calendar className="w-4 h-4" />
              <span>Available for Projects</span>
            </div>
            <div className={`flex items-center gap-2 ${isDark ? "text-green-300" : "text-green-600"}`}>
              <Award className="w-4 h-4" />
              <span>3+ Years Experience</span>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <Button
              onClick={downloadResume}
              className="bg-green-600 hover:bg-green-700 text-white transform hover:scale-105 transition-all duration-300"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Resume
            </Button>
          </div>
        </div>

        {/* Skills Section */}
        <div className="mb-16">
          <h2 className={`text-3xl font-bold mb-8 text-center ${isDark ? "text-white" : "text-gray-900"}`}>
            Technical Expertise
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills.map((skill, index) => (
              <Card
                key={skill.name}
                className={`${
                  isDark ? "bg-white/10 border-green-500/30" : "bg-white/80 border-green-300/50"
                } backdrop-blur-sm hover:scale-105 transition-all duration-300`}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}>{skill.name}</span>
                    <span className={`text-sm ${isDark ? "text-green-300" : "text-green-600"}`}>{skill.level}%</span>
                  </div>
                  <div className={`w-full ${isDark ? "bg-gray-700" : "bg-gray-200"} rounded-full h-2`}>
                    <div
                      className={`bg-gradient-to-r ${skill.color} h-2 rounded-full transition-all duration-1000 ease-out`}
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Hobbies Section */}
        <div className="mb-16">
          <h2 className={`text-3xl font-bold mb-8 text-center ${isDark ? "text-white" : "text-gray-900"}`}>
            Hobbies & Interests 🌟
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {hobbies.map((hobby, index) => (
              <Card
                key={index}
                className={`${
                  isDark ? "bg-white/10 border-green-500/30" : "bg-white/80 border-green-300/50"
                } backdrop-blur-sm hover:scale-105 transition-all duration-300 group`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div
                      className={`p-3 rounded-full ${
                        isDark ? "bg-green-500/20 text-green-300" : "bg-green-100 text-green-600"
                      } group-hover:scale-110 transition-transform duration-300`}
                    >
                      {hobby.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-semibold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>{hobby.title}</h3>
                      <p className={`text-sm mb-3 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                        {hobby.description}
                      </p>
                      <p className={`text-xs ${isDark ? "text-green-300" : "text-green-600"}`}>{hobby.achievements}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Projects Section */}
        <div className="mb-16">
          <h2 className={`text-3xl font-bold mb-8 text-center ${isDark ? "text-white" : "text-gray-900"}`}>
            Featured Projects 🚀
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <Card
                key={index}
                className={`${
                  isDark ? "bg-white/10 border-green-500/30" : "bg-white/80 border-green-300/50"
                } backdrop-blur-sm hover:scale-105 transition-all duration-300 group overflow-hidden`}
              >
                <CardHeader>
                  <div
                    className={`w-full h-48 bg-gradient-to-br ${project.gradient} rounded-lg mb-4 flex items-center justify-center group-hover:scale-105 transition-transform duration-300`}
                  >
                    {project.image}
                  </div>
                  <CardTitle className={`${isDark ? "text-green-300" : "text-green-700"}`}>{project.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className={`mb-4 ${isDark ? "text-gray-300" : "text-gray-600"}`}>{project.description}</p>

                  <div className="mb-4">
                    <h4 className={`font-semibold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>Key Metrics:</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className={isDark ? "text-green-300" : "text-green-600"}>👥 {project.metrics.users}</div>
                      <div className={isDark ? "text-green-300" : "text-green-600"}>📈 {project.metrics.impact}</div>
                      <div className={isDark ? "text-green-300" : "text-green-600"}>💾 {project.metrics.data}</div>
                      <div className={isDark ? "text-green-300" : "text-green-600"}>⏱️ {project.metrics.duration}</div>
                      <div className={isDark ? "text-green-300" : "text-green-600"}>👨‍💻 {project.metrics.team}</div>
                      <div className={isDark ? "text-green-300" : "text-green-600"}>🎯 {project.metrics.role}</div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className={`font-semibold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>Key Features:</h4>
                    <ul className={`text-sm space-y-1 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                      {project.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech) => (
                      <Badge
                        key={tech}
                        className={`${
                          isDark ? "bg-green-500/20 text-green-200" : "bg-green-100 text-green-700"
                        } text-xs`}
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="mb-16">
          <h2 className={`text-3xl font-bold mb-8 text-center ${isDark ? "text-white" : "text-gray-900"}`}>
            Client Testimonials 💬
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className={`${
                  isDark ? "bg-white/10 border-green-500/30" : "bg-white/80 border-green-300/50"
                } backdrop-blur-sm hover:scale-105 transition-all duration-300`}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className={`text-sm mb-4 italic ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                    "{testimonial.text}"
                  </p>
                  <div className="border-t pt-4">
                    <p className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>{testimonial.name}</p>
                    <p className={`text-sm ${isDark ? "text-green-300" : "text-green-600"}`}>{testimonial.role}</p>
                    <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>{testimonial.company}</p>
                    <p className={`text-xs mt-1 ${isDark ? "text-green-400" : "text-green-700"}`}>
                      Project: {testimonial.project}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Experience & Achievements */}
        <div className="mb-16">
          <h2 className={`text-3xl font-bold mb-8 text-center ${isDark ? "text-white" : "text-gray-900"}`}>
            Experience & Achievements 🏆
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card
              className={`${
                isDark ? "bg-white/10 border-green-500/30" : "bg-white/80 border-green-300/50"
              } backdrop-blur-sm hover:scale-105 transition-all duration-300`}
            >
              <CardHeader>
                <CardTitle className={isDark ? "text-green-300" : "text-green-700"}>Professional Experience</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-l-2 border-green-500 pl-4">
                  <h4 className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>Senior Data Engineer</h4>
                  <p className={isDark ? "text-green-200" : "text-green-600"}>EcoTech Solutions • 2022-Present</p>
                  <p className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                    Developed ML models for environmental monitoring and sustainability analytics
                  </p>
                </div>
                <div className="border-l-2 border-emerald-500 pl-4">
                  <h4 className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>Software Developer</h4>
                  <p className={isDark ? "text-emerald-200" : "text-emerald-600"}>GreenTech Innovations • 2021-2022</p>
                  <p className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                    Built IoT applications for smart city infrastructure
                  </p>
                </div>
                <div className="border-l-2 border-teal-500 pl-4">
                  <h4 className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>Junior Developer</h4>
                  <p className={isDark ? "text-teal-200" : "text-teal-600"}>ClimateData Corp • 2020-2021</p>
                  <p className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                    Developed data processing pipelines for climate research
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card
              className={`${
                isDark ? "bg-white/10 border-emerald-500/30" : "bg-white/80 border-emerald-300/50"
              } backdrop-blur-sm hover:scale-105 transition-all duration-300`}
            >
              <CardHeader>
                <CardTitle className={isDark ? "text-emerald-300" : "text-emerald-700"}>Achievements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Star className="w-5 h-5 text-yellow-400 mt-1" />
                  <div>
                    <h4 className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                      Sustainability Hackathon Winner
                    </h4>
                    <p className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                      Climate Tech Challenge 2023
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Star className="w-5 h-5 text-yellow-400 mt-1" />
                  <div>
                    <h4 className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>Research Publication</h4>
                    <p className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                      IEEE Conference on Smart Cities 2022
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Star className="w-5 h-5 text-yellow-400 mt-1" />
                  <div>
                    <h4 className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>Green Tech Advocate</h4>
                    <p className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                      Speaker at 5+ sustainability conferences
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Star className="w-5 h-5 text-yellow-400 mt-1" />
                  <div>
                    <h4 className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                      AWS Certified Solutions Architect
                    </h4>
                    <p className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                      Professional level certification
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Star className="w-5 h-5 text-yellow-400 mt-1" />
                  <div>
                    <h4 className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                      Open Source Contributor
                    </h4>
                    <p className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                      500+ contributions to environmental projects
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Contact Section */}
        <div
          className={`text-center p-8 rounded-2xl ${
            isDark
              ? "bg-gradient-to-r from-green-900/50 to-emerald-900/50"
              : "bg-gradient-to-r from-green-100/50 to-emerald-100/50"
          } backdrop-blur-sm`}
        >
          <h2 className={`text-3xl font-bold mb-8 ${isDark ? "text-white" : "text-gray-900"}`}>
            Let's Build a Sustainable Future 🌱
          </h2>
          <p className={`mb-8 max-w-2xl mx-auto ${isDark ? "text-gray-300" : "text-gray-600"}`}>
            Passionate about using technology to create positive environmental impact. Let's collaborate on projects
            that make a difference for our planet.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <a
              href="mailto:dhivakar@hackconnect.com"
              className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 hover:scale-105 ${
                isDark ? "bg-green-600 hover:bg-green-700 text-white" : "bg-green-600 hover:bg-green-700 text-white"
              }`}
            >
              <Mail className="w-5 h-5" />
              <span>dhivakarv.23csd@kongu.edu</span>
            </a>
            <a
              href="tel:+919876543212"
              className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 hover:scale-105 ${
                isDark
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                  : "bg-emerald-600 hover:bg-emerald-700 text-white"
              }`}
            >
              <Phone className="w-5 h-5" />
              <span>+91 86755 57324</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
