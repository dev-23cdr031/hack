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
  Palette,
  Monitor,
  Star,
  PenTool,
  Smartphone,
  Phone,
  Moon,
  Sun,
  ArrowUp,
  Sparkles,
  Camera,
  Brush,
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

export default function HemapriyaPortfolio() {
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
    window.open("/resume/hemapriya", "_blank")
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const toggleTheme = () => {
    setIsDark(!isDark)
  }

  const skills = [
    { name: "UI/UX Design", level: 96, color: "from-purple-400 to-pink-500" },
    { name: "UI/UX", level: 94, color: "from-pink-400 to-rose-500" },
    { name: "React", level: 89, color: "from-rose-400 to-purple-500" },
    { name: "TypeScript", level: 85, color: "from-purple-500 to-pink-600" },
    { name: "Next.js", level: 87, color: "from-pink-500 to-rose-600" },
    { name: "Tailwind CSS", level: 92, color: "from-rose-500 to-purple-600" },
    { name: "Adobe Creative Suite", level: 91, color: "from-purple-400 to-pink-400" },
    { name: "Framer Motion", level: 83, color: "from-pink-400 to-rose-400" },
    { name: "User Research", level: 88, color: "from-rose-400 to-purple-400" },
    { name: "Prototyping", level: 93, color: "from-purple-500 to-pink-500" },
    { name: "Design Systems", level: 90, color: "from-pink-500 to-rose-500" },
    { name: "Accessibility", level: 86, color: "from-rose-500 to-purple-500" },
  ]

  const hobbies = [
    {
      icon: <Camera className="w-6 h-6" />,
      title: "Fashion & Portrait Photography",
      description:
        "Capturing beauty in people and fashion through creative photography. Specializing in natural light portraits.",
      achievements: "📸 1000+ portraits shot • 🏆 5 photography awards • 📱 Instagram: 15k followers",
    },
    {
      icon: <Brush className="w-6 h-6" />,
      title: "Digital Art & Illustration",
      description:
        "Creating stunning digital artwork and illustrations for brands and personal projects using Procreate and Adobe.",
      achievements: "🎨 200+ digital artworks • 💰 50+ commissioned pieces • 🖼️ Gallery exhibitions",
    },
    {
      icon: <Coffee className="w-6 h-6" />,
      title: "Latte Art & Coffee Culture",
      description: "Mastering the art of coffee making and latte art. Exploring coffee cultures from around the world.",
      achievements: "☕ Barista certified • 🏆 Latte art competition winner • 📝 Coffee blog (3k readers)",
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Design Psychology & UX Research",
      description: "Studying human psychology and behavior to create more intuitive and user-friendly designs.",
      achievements: "📚 25+ UX books read • 🎓 Psychology certification • 📊 10+ user research studies",
    },
    {
      icon: <Gamepad2 className="w-6 h-6" />,
      title: "UI Design for Gaming",
      description: "Designing user interfaces for mobile and web games, focusing on engaging and intuitive game UX.",
      achievements: "🎮 15 game UIs designed • 👥 2M+ players reached • 🏆 Game design award winner",
    },
    {
      icon: <Music className="w-6 h-6" />,
      title: "Music Production & Sound Design",
      description: "Creating ambient music and sound effects for apps and websites to enhance user experience.",
      achievements: "🎵 50+ tracks produced • 🎧 App soundtracks created • 🎼 Spotify playlist curator",
    },
    {
      icon: <Plane className="w-6 h-6" />,
      title: "Travel & Cultural Design",
      description: "Exploring different cultures and incorporating diverse design elements into my work.",
      achievements: "✈️ 20+ countries visited • 🎨 Cultural design collection • 📝 Travel design blog",
    },
    {
      icon: <Dumbbell className="w-6 h-6" />,
      title: "Yoga & Mindful Design",
      description: "Practicing yoga and meditation to bring mindfulness and balance into design thinking.",
      achievements: "🧘 200-hour yoga certification • 🎯 Mindful design workshops • 💆 Wellness app UI designer",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Design Community Building",
      description: "Building and guideing design communities, organizing workshops and design challenges.",
      achievements: "👥 500+ designers guideed • 🏆 Community leader award • 📚 Design workshop team lead",
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Brand Identity & Logo Design",
      description: "Creating memorable brand identities and logos for startups and established businesses.",
      achievements: "🎯 100+ logos designed • 💼 50+ brand identities • 🏢 Fortune 500 client work",
    },
  ]

  const projects = [
    {
      title: "E-commerce Fashion App Redesign",
      description:
        "Complete UX overhaul of a fashion e-commerce platform, improving user engagement by 60% and conversion rates by 45% through user-centered design and streamlined shopping experience.",
      image: <PenTool className="w-16 h-16 text-white" />,
      gradient: "from-purple-600 to-pink-600",
      technologies: ["UI/UX", "User Research", "Prototyping", "A/B Testing", "React", "Framer Motion"],
      metrics: {
        users: "500k+ active users",
        impact: "60% engagement increase",
        data: "45% conversion improvement",
        duration: "8 months",
        team: "6 designers & developers",
        role: "Lead UX Designer",
      },
      features: [
        "Personalized shopping experience",
        "Advanced filtering system",
        "AR try-on feature",
        "Social shopping integration",
        "One-click checkout process",
      ],
    },
    {
      title: "FinTech Mobile Banking App",
      description:
        "Designed a comprehensive mobile banking application with focus on security, accessibility, and user trust. The app serves 200k+ users with 99.9% uptime and exceptional user satisfaction.",
      image: <Monitor className="w-16 h-16 text-white" />,
      gradient: "from-pink-600 to-rose-600",
      technologies: ["UI/UX", "React Native", "TypeScript", "Biometric Auth", "Accessibility"],
      metrics: {
        users: "200k+ banking users",
        impact: "99.9% uptime achieved",
        data: "4.8/5 user satisfaction",
        duration: "12 months",
        team: "8 cross-functional members",
        role: "Senior UX Designer",
      },
      features: [
        "Biometric authentication",
        "Real-time transaction tracking",
        "Budget management tools",
        "Investment portfolio view",
        "24/7 customer support chat",
      ],
    },
    {
      title: "Healthcare Patient Portal",
      description:
        "Designed an intuitive patient portal for healthcare providers, improving patient engagement by 70% and reducing administrative workload through thoughtful UX design and accessibility features.",
      image: <Smartphone className="w-16 h-16 text-white" />,
      gradient: "from-rose-600 to-purple-600",
      technologies: ["Adobe XD", "React", "WCAG 2.1", "User Testing", "Healthcare Compliance"],
      metrics: {
        users: "100k+ patients",
        impact: "70% engagement boost",
        data: "50% admin workload reduction",
        duration: "10 months",
        team: "12 healthcare & tech experts",
        role: "Healthcare UX Specialist",
      },
      features: [
        "Appointment scheduling",
        "Medical records access",
        "Prescription management",
        "Telemedicine integration",
        "Accessibility compliance",
      ],
    },
    {
      title: "EdTech Learning Management System",
      description:
        "Created an engaging learning platform with gamification elements, adaptive UI, and personalized learning paths. The platform serves 50k+ students with 85% course completion rates.",
      image: <Palette className="w-16 h-16 text-white" />,
      gradient: "from-purple-600 to-indigo-600",
      technologies: ["UI/UX", "React", "D3.js", "Gamification", "Learning Analytics"],
      metrics: {
        users: "50k+ students",
        impact: "85% completion rate",
        data: "40% learning improvement",
        duration: "14 months",
        team: "10 education & tech specialists",
        role: "EdTech UX Designer",
      },
      features: [
        "Adaptive learning paths",
        "Progress gamification",
        "Peer collaboration tools",
        "Real-time analytics",
        "Multi-device synchronization",
      ],
    },
  ]

  const testimonials = [
    {
      name: "Divyadharshini",
      role: "Product Manager",
      company: "FashionForward Inc.",
      rating: 5,
      text: "Hemapriya's redesign of our e-commerce platform was transformational. Her attention to user psychology and beautiful visual design increased our conversion rates by 45%. She's incredibly talented and professional.",
      project: "E-commerce Fashion App Redesign",
    },
    {
      name: "Divakar",
      role: "CTO",
      company: "SecureBank Digital",
      rating: 5,
      text: "Working with Hemapriya on our mobile banking app was exceptional. She balanced complex financial features with intuitive design perfectly. Our users love the interface, and security never felt so approachable.",
      project: "FinTech Mobile Banking App",
    },
    {
      name: "Hemapriya",
      role: "Chief Medical Officer",
      company: "HealthTech Solutions",
      rating: 5,
      text: "Hemapriya understood the unique challenges of healthcare UX immediately. Her patient portal design improved our patient engagement by 70%. She's a true expert in accessible and empathetic design.",
      project: "Healthcare Patient Portal",
    },
  ]

  return (
    <div
      className={`min-h-screen transition-all duration-500 ${
        isDark
          ? "bg-gradient-to-br from-purple-900 via-pink-900 to-rose-900 text-white"
          : "bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 text-gray-900"
      }`}
    >
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-96 h-96 bg-purple-500/10 rounded-full blur-3xl transition-all duration-1000"
          style={{
            left: mousePosition.x - 192,
            top: mousePosition.y - 192,
          }}
        />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-pink-500/5 rounded-full blur-2xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-rose-500/5 rounded-full blur-2xl animate-pulse delay-1000" />
      </div>

      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-black/10 z-50">
        <div
          className="h-full bg-gradient-to-r from-purple-400 to-pink-500 transition-all duration-150"
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
          className="fixed bottom-8 right-8 z-50 p-3 bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-lg transition-all duration-300 hover:scale-110"
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
            isDark ? "text-white hover:text-pink-300" : "text-gray-900 hover:text-pink-600"
          } transition-colors`}
        >
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

      <div className="max-w-6xl mx-auto px-6 py-12 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="relative inline-block mb-8">
            <div className="w-56 h-56 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 p-1 mx-auto shadow-2xl shadow-pink-500/30">
              <div
                className={`w-full h-full rounded-full ${
                  isDark ? "bg-gray-800" : "bg-white"
                } flex items-center justify-center overflow-hidden`}
              >
                <img
                  src="/team/hemapriya.jpg"
                  alt="Hemapriya"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
            </div>
            <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-green-500 rounded-full border-4 border-white flex items-center justify-center animate-bounce">
              <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
            <Sparkles className="absolute -top-4 -left-4 w-8 h-8 text-purple-400 animate-spin" />
            <Sparkles className="absolute -bottom-4 -right-8 w-6 h-6 text-pink-400 animate-ping" />
          </div>

          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Hemapriya
          </h1>
          <p className={`text-2xl mb-6 ${isDark ? "text-purple-200" : "text-purple-700"}`}>
            UI/UX Designer & Front-End Developer
          </p>
          <p className={`text-lg max-w-3xl mx-auto leading-relaxed mb-8 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
            Creating delightful user experiences through thoughtful design and seamless interactions. I blend creativity
            with functionality to build interfaces that users love and businesses need. ✨ Designing the future, one
            pixel at a time.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className={`flex items-center gap-2 ${isDark ? "text-purple-300" : "text-purple-600"}`}>
              <MapPin className="w-4 h-4" />
              <span>Dharmapuri,India</span>
            </div>
            <div className={`flex items-center gap-2 ${isDark ? "text-purple-300" : "text-purple-600"}`}>
              <Calendar className="w-4 h-4" />
              <span>Available for Projects</span>
            </div>
            <div className={`flex items-center gap-2 ${isDark ? "text-purple-300" : "text-purple-600"}`}>
              <Award className="w-4 h-4" />
              <span>4+ Years Experience</span>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <Button
              onClick={downloadResume}
              className="bg-purple-600 hover:bg-purple-700 text-white transform hover:scale-105 transition-all duration-300"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Resume
            </Button>
          </div>
        </div>

        {/* Skills Section */}
        <div className="mb-16">
          <h2 className={`text-3xl font-bold mb-8 text-center ${isDark ? "text-white" : "text-gray-900"}`}>
            Design & Development Skills
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills.map((skill, index) => (
              <Card
                key={skill.name}
                className={`${
                  isDark ? "bg-white/10 border-purple-500/30" : "bg-white/80 border-purple-300/50"
                } backdrop-blur-sm hover:scale-105 transition-all duration-300`}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}>{skill.name}</span>
                    <span className={`text-sm ${isDark ? "text-purple-300" : "text-purple-600"}`}>{skill.level}%</span>
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
            Hobbies & Creative Pursuits 🎨
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {hobbies.map((hobby, index) => (
              <Card
                key={index}
                className={`${
                  isDark ? "bg-white/10 border-purple-500/30" : "bg-white/80 border-purple-300/50"
                } backdrop-blur-sm hover:scale-105 transition-all duration-300 group`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div
                      className={`p-3 rounded-full ${
                        isDark ? "bg-purple-500/20 text-purple-300" : "bg-purple-100 text-purple-600"
                      } group-hover:scale-110 transition-transform duration-300`}
                    >
                      {hobby.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-semibold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>{hobby.title}</h3>
                      <p className={`text-sm mb-3 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                        {hobby.description}
                      </p>
                      <p className={`text-xs ${isDark ? "text-purple-300" : "text-purple-600"}`}>
                        {hobby.achievements}
                      </p>
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
                  isDark ? "bg-white/10 border-purple-500/30" : "bg-white/80 border-purple-300/50"
                } backdrop-blur-sm hover:scale-105 transition-all duration-300 group overflow-hidden`}
              >
                <CardHeader>
                  <div
                    className={`w-full h-48 bg-gradient-to-br ${project.gradient} rounded-lg mb-4 flex items-center justify-center group-hover:scale-105 transition-transform duration-300`}
                  >
                    {project.image}
                  </div>
                  <CardTitle className={`${isDark ? "text-purple-300" : "text-purple-700"}`}>{project.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className={`mb-4 ${isDark ? "text-gray-300" : "text-gray-600"}`}>{project.description}</p>

                  <div className="mb-4">
                    <h4 className={`font-semibold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>Key Metrics:</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className={isDark ? "text-purple-300" : "text-purple-600"}>👥 {project.metrics.users}</div>
                      <div className={isDark ? "text-purple-300" : "text-purple-600"}>📈 {project.metrics.impact}</div>
                      <div className={isDark ? "text-purple-300" : "text-purple-600"}>💾 {project.metrics.data}</div>
                      <div className={isDark ? "text-purple-300" : "text-purple-600"}>⏱️ {project.metrics.duration}</div>
                      <div className={isDark ? "text-purple-300" : "text-purple-600"}>👨‍💻 {project.metrics.team}</div>
                      <div className={isDark ? "text-purple-300" : "text-purple-600"}>🎯 {project.metrics.role}</div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className={`font-semibold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>Key Features:</h4>
                    <ul className={`text-sm space-y-1 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                      {project.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
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
                          isDark ? "bg-purple-500/20 text-purple-200" : "bg-purple-100 text-purple-700"
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
                  isDark ? "bg-white/10 border-purple-500/30" : "bg-white/80 border-purple-300/50"
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
                    <p className={`text-sm ${isDark ? "text-purple-300" : "text-purple-600"}`}>{testimonial.role}</p>
                    <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>{testimonial.company}</p>
                    <p className={`text-xs mt-1 ${isDark ? "text-purple-400" : "text-purple-700"}`}>
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
                isDark ? "bg-white/10 border-purple-500/30" : "bg-white/80 border-purple-300/50"
              } backdrop-blur-sm hover:scale-105 transition-all duration-300`}
            >
              <CardHeader>
                <CardTitle className={isDark ? "text-purple-300" : "text-purple-700"}>
                  Professional Experience
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-l-2 border-purple-500 pl-4">
                  <h4 className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>Senior UI/UX Designer</h4>
                  <p className={isDark ? "text-purple-200" : "text-purple-600"}>DesignCraft Studio • 2021-Present</p>
                  <p className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                    Led design for 15+ web and mobile applications, guideing junior designers
                  </p>
                </div>
                <div className="border-l-2 border-pink-500 pl-4">
                  <h4 className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                    Frontend Developer & Designer
                  </h4>
                  <p className={isDark ? "text-pink-200" : "text-pink-600"}>TechFlow Solutions • 2020-2021</p>
                  <p className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                    Developed responsive interfaces and implemented design systems
                  </p>
                </div>
                <div className="border-l-2 border-rose-500 pl-4">
                  <h4 className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>Junior UX Designer</h4>
                  <p className={isDark ? "text-rose-200" : "text-rose-600"}>Creative Digital Agency • 2019-2020</p>
                  <p className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                    Created user interfaces for startups and small businesses
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card
              className={`${
                isDark ? "bg-white/10 border-pink-500/30" : "bg-white/80 border-pink-300/50"
              } backdrop-blur-sm hover:scale-105 transition-all duration-300`}
            >
              <CardHeader>
                <CardTitle className={isDark ? "text-pink-300" : "text-pink-700"}>Achievements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Star className="w-5 h-5 text-yellow-400 mt-1" />
                  <div>
                    <h4 className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                      Design Excellence Award
                    </h4>
                    <p className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>UX India Conference 2023</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Star className="w-5 h-5 text-yellow-400 mt-1" />
                  <div>
                    <h4 className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>Dribbble Top Shot</h4>
                    <p className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                      Featured design with 10k+ likes
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Star className="w-5 h-5 text-yellow-400 mt-1" />
                  <div>
                    <h4 className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                      Design System Creator
                    </h4>
                    <p className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                      Open source component library - 3k+ downloads
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Star className="w-5 h-5 text-yellow-400 mt-1" />
                  <div>
                    <h4 className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                      Adobe Certified Expert
                    </h4>
                    <p className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                      Creative Suite Master certification
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Star className="w-5 h-5 text-yellow-400 mt-1" />
                  <div>
                    <h4 className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                      Design Guide & Speaker
                    </h4>
                    <p className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                      Guideed 100+ designers, spoke at 8 conferences
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
              ? "bg-gradient-to-r from-purple-900/50 to-pink-900/50"
              : "bg-gradient-to-r from-purple-100/50 to-pink-100/50"
          } backdrop-blur-sm`}
        >
          <h2 className={`text-3xl font-bold mb-8 ${isDark ? "text-white" : "text-gray-900"}`}>
            Let's Create Beautiful Experiences ✨
          </h2>
          <p className={`mb-8 max-w-2xl mx-auto ${isDark ? "text-gray-300" : "text-gray-600"}`}>
            Ready to transform ideas into stunning digital experiences. Let's collaborate and bring your vision to life
            with thoughtful design and seamless functionality.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <a
              href="mailto:hemapriya@hackconnect.com"
              className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 hover:scale-105 ${
                isDark ? "bg-purple-600 hover:bg-purple-700 text-white" : "bg-purple-600 hover:bg-purple-700 text-white"
              }`}
            >
              <Mail className="w-5 h-5" />
              <span>hemapriyavs.23csd@kongu.edu</span>
            </a>
            <a
              href="tel:+919876543213"
              className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 hover:scale-105 ${
                isDark ? "bg-pink-600 hover:bg-pink-700 text-white" : "bg-pink-600 hover:bg-pink-700 text-white"
              }`}
            >
              <Phone className="w-5 h-5" />
              <span>+91 72003 00816</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
