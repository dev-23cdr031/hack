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
  Server,
  Database,
  Cloud,
  Users,
  Star,
  Phone,
  Moon,
  Sun,
  ChevronUp,
  Sparkles,
  Code,
  Zap,
  Trophy,
  Heart,
  Coffee,
  Gamepad2,
  Dumbbell,
  Book,
  Headphones,
  Mountain,
  Shield,
  Rocket,
  Brain,
  CheckCircle,
  Briefcase,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function DevDharrshanPortfolio() {
  const [darkMode, setDarkMode] = useState(true)
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
    window.open("/resume/dev-dharrshan", "_blank")
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const toggleTheme = () => {
    setDarkMode(!darkMode)
  }

  const skills = [
    { name: "Node.js", level: 95, color: "from-green-400 to-green-600" },
    { name: "Python", level: 90, color: "from-blue-400 to-blue-600" },
    { name: "Java", level: 85, color: "from-orange-400 to-orange-600" },
    { name: "PostgreSQL", level: 92, color: "from-indigo-400 to-indigo-600" },
    { name: "MongoDB", level: 88, color: "from-green-400 to-green-600" },
    { name: "Redis", level: 85, color: "from-red-400 to-red-600" },
    { name: "Docker", level: 90, color: "from-blue-400 to-blue-600" },
    { name: "Kubernetes", level: 82, color: "from-purple-400 to-purple-600" },
    { name: "AWS", level: 88, color: "from-yellow-400 to-yellow-600" },
    { name: "Microservices", level: 93, color: "from-cyan-400 to-cyan-600" },
    { name: "GraphQL", level: 80, color: "from-pink-400 to-pink-600" },
    { name: "System Design", level: 87, color: "from-teal-400 to-teal-600" },
  ]

  const hobbies = [
    {
      icon: <Code className="w-6 h-6" />,
      title: "Open Source Contributing",
      description:
        "Active contributor to major Node.js and Python projects. Maintained 5+ libraries with 10k+ downloads.",
      achievements: [
        "Core contributor to Express.js",
        "Created popular Redis wrapper library",
        "500+ GitHub contributions",
      ],
    },
    {
      icon: <Server className="w-6 h-6" />,
      title: "System Architecture Design",
      description:
        "Passionate about designing scalable systems. Love creating architecture diagrams and optimizing performance.",
      achievements: ["Designed systems for 1M+ users", "Reduced latency by 60%", "Architecture blog with 50k+ views"],
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Cybersecurity & Ethical Hacking",
      description:
        "Exploring security vulnerabilities and building secure systems. Participate in bug bounty programs.",
      achievements: ["Found 15+ security vulnerabilities", "CEH certified", "Won 3 CTF competitions"],
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: "Machine Learning & AI",
      description:
        "Building ML models for backend optimization and predictive analytics. Love experimenting with neural networks.",
      achievements: ["Built recommendation engine", "ML model deployment expert", "Published 2 research papers"],
    },
    {
      icon: <Gamepad2 className="w-6 h-6" />,
      title: "Game Development",
      description:
        "Creating multiplayer online games with real-time networking. Specialized in backend game architecture.",
      achievements: ["Built MMO server architecture", "Real-time game with 1000+ players", "Unity backend specialist"],
    },
    {
      icon: <Coffee className="w-6 h-6" />,
      title: "Coffee Brewing & Roasting",
      description:
        "Coffee enthusiast who roasts own beans and experiments with brewing methods. Perfect fuel for coding sessions.",
      achievements: ["Home roasting for 3 years", "Won local brewing competition", "Coffee blog with recipes"],
    },
    {
      icon: <Mountain className="w-6 h-6" />,
      title: "Rock Climbing & Bouldering",
      description: "Love the problem-solving aspect of climbing. Great for building mental resilience and focus.",
      achievements: ["Climbed 50+ outdoor routes", "V6 bouldering grade", "Climbing instructor certified"],
    },
    {
      icon: <Headphones className="w-6 h-6" />,
      title: "Tech Podcasting",
      description: "Host a weekly tech podcast discussing backend technologies, system design, and industry trends.",
      achievements: ["100+ episodes published", "5k+ monthly listeners", "Interviewed 20+ tech leaders"],
    },
    {
      icon: <Book className="w-6 h-6" />,
      title: "Technical Writing & Blogging",
      description:
        "Writing in-depth articles about system design, performance optimization, and backend best practices.",
      achievements: ["50+ technical articles", "Featured on HackerNews", "10k+ Medium followers"],
    },
    {
      icon: <Dumbbell className="w-6 h-6" />,
      title: "Powerlifting & Strength Training",
      description:
        "Building physical strength parallels building robust systems. Disciplined training routine for 4+ years.",
      achievements: ["500lb deadlift PR", "Competed in 2 meets", "Certified personal trainer"],
    },
  ]

  const projects = [
    {
      title: "Distributed Task Queue System",
      description:
        "High-performance distributed task processing system handling 1M+ jobs daily with fault tolerance and auto-scaling capabilities.",
      image: "/placeholder.svg?height=300&width=500&text=Distributed+Task+Queue",
      technologies: ["Node.js", "Redis", "PostgreSQL", "Docker", "Kubernetes"],
      features: [
        "Auto-scaling based on queue depth",
        "Dead letter queue handling",
        "Real-time monitoring dashboard",
        "Multi-tenant architecture",
        "99.9% uptime SLA",
      ],
      metrics: {
        performance: "1M+ jobs/day",
        latency: "< 50ms avg",
        uptime: "99.9%",
        scale: "500+ workers",
      },
      duration: "8 months",
      team: "4 developers",
      role: "Lead Backend Architect",
    },
    {
      title: "Real-time Analytics Engine",
      description:
        "Stream processing engine for real-time analytics with complex event processing and machine learning integration.",
      image: "/placeholder.svg?height=300&width=500&text=Analytics+Engine",
      technologies: ["Python", "Apache Kafka", "ClickHouse", "TensorFlow", "Grafana"],
      features: [
        "Real-time stream processing",
        "Complex event pattern matching",
        "ML-powered anomaly detection",
        "Custom query language",
        "Interactive dashboards",
      ],
      metrics: {
        throughput: "100k events/sec",
        latency: "< 10ms",
        accuracy: "98.5%",
        retention: "2 years",
      },
      duration: "10 months",
      team: "6 engineers",
      role: "Senior Backend Developer",
    },
    {
      title: "Microservices API Gateway",
      description:
        "Enterprise-grade API gateway with advanced routing, rate limiting, authentication, and comprehensive monitoring.",
      image: "/placeholder.svg?height=300&width=500&text=API+Gateway",
      technologies: ["Go", "Envoy Proxy", "etcd", "Prometheus", "Jaeger"],
      features: [
        "Dynamic service discovery",
        "Circuit breaker pattern",
        "JWT authentication",
        "Rate limiting & throttling",
        "Distributed tracing",
      ],
      metrics: {
        requests: "10M+ req/day",
        services: "50+ microservices",
        latency: "< 5ms overhead",
        availability: "99.99%",
      },
      duration: "6 months",
      team: "3 developers",
      role: "Technical Lead",
    },
    {
      title: "Blockchain Infrastructure Platform",
      description:
        "Scalable blockchain infrastructure with smart contract deployment, transaction processing, and wallet management.",
      image: "/placeholder.svg?height=300&width=500&text=Blockchain+Platform",
      technologies: ["Rust", "Ethereum", "IPFS", "PostgreSQL", "WebSocket"],
      features: [
        "Smart contract deployment",
        "Multi-chain support",
        "Wallet integration",
        "Transaction monitoring",
        "DeFi protocol support",
      ],
      metrics: {
        transactions: "1M+ tx/month",
        contracts: "10k+ deployed",
        chains: "5 blockchains",
        users: "50k+ wallets",
      },
      duration: "12 months",
      team: "8 developers",
      role: "Blockchain Architect",
    },
  ]

  const testimonials = [
    {
      name: "Dev Dharrshan",
      role: "CTO at FinTech Solutions",
      company: "FinTech Solutions",
      rating: 5,
      text: "Dev's expertise in building scalable backend systems is exceptional. He architected our payment processing system that now handles millions of transactions daily with zero downtime.",
      project: "Payment Processing System",
    },
    {
      name: "Bharani",
      role: "VP Engineering at DataFlow Corp",
      company: "DataFlow Corp",
      rating: 5,
      text: "Working with Dev was a game-changer for our real-time analytics platform. His deep understanding of distributed systems and performance optimization delivered results beyond our expectations.",
      project: "Real-time Analytics Platform",
    },
    {
      name: "Anusree",
      role: "Product Manager at CloudTech",
      company: "CloudTech",
      rating: 5,
      text: "Dev's ability to translate complex business requirements into robust technical solutions is remarkable. He delivered our microservices architecture ahead of schedule and under budget.",
      project: "Microservices Migration",
    },
  ]

  return (
    <div
      className={`min-h-screen transition-all duration-500 ${
        darkMode
          ? "bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white"
          : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 text-gray-900"
      }`}
    >
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"
          style={{
            left: mousePosition.x - 192,
            top: mousePosition.y - 192,
            transition: "all 0.3s ease-out",
          }}
        />
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-2xl animate-bounce" />
        <div className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-indigo-500/10 rounded-full blur-xl animate-pulse" />
      </div>

      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200/20 z-50">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-300"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className={`fixed top-6 right-6 z-50 p-3 rounded-full transition-all duration-300 ${
          darkMode ? "bg-white/10 hover:bg-white/20" : "bg-gray-900/10 hover:bg-gray-900/20"
        } backdrop-blur-sm`}
      >
        {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-all duration-300 hover:scale-110"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      )}

      {/* Navigation */}
      <nav
        className={`flex justify-between items-center p-6 md:px-12 ${
          darkMode ? "bg-black/20" : "bg-white/20"
        } backdrop-blur-sm sticky top-0 z-40`}
      >
        <Link
          href="/about"
          className={`flex items-center gap-2 ${
            darkMode ? "text-white hover:text-blue-300" : "text-gray-900 hover:text-blue-600"
          } transition-colors`}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Team
        </Link>
        <div className="flex-1 flex justify-center">
          <Link
            href="/"
            className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"
          >
            HackConnect
          </Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-12 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="relative inline-block mb-8">
            <div className="w-56 h-56 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 p-1 mx-auto relative overflow-hidden shadow-2xl shadow-blue-500/30">
              <Image
                src="/team/dev-dharrshan.jpg"
                alt="Dev Dharrshan"
                width={224}
                height={224}
                priority
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-green-500 rounded-full border-4 border-white flex items-center justify-center animate-pulse">
              <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
            <div className="absolute -top-4 -left-4 text-yellow-400 animate-spin">
              <Sparkles className="w-8 h-8" />
            </div>
            <div className="absolute -bottom-4 -left-4 text-blue-400 animate-bounce">
              <Sparkles className="w-6 h-6" />
            </div>
          </div>

          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Dev Dharrshan
          </h1>
          <p className={`text-2xl mb-6 ${darkMode ? "text-blue-200" : "text-blue-600"}`}>
            Backend Developer & System Architect
          </p>
          <p
            className={`text-lg max-w-3xl mx-auto leading-relaxed mb-8 ${darkMode ? "text-gray-300" : "text-gray-600"}`}
          >
            Passionate about building scalable, high-performance backend systems that power the next generation of
            applications. I specialize in microservices architecture, distributed systems, and cloud-native solutions
            that handle millions of users seamlessly.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className={`flex items-center gap-2 ${darkMode ? "text-blue-300" : "text-blue-600"}`}>
              <MapPin className="w-4 h-4" />
              <span>Virudhunagar,India</span>
            </div>
            <div className={`flex items-center gap-2 ${darkMode ? "text-blue-300" : "text-blue-600"}`}>
              <Calendar className="w-4 h-4" />
              <span>Available for Projects</span>
            </div>
            <div className={`flex items-center gap-2 ${darkMode ? "text-blue-300" : "text-blue-600"}`}>
              <Award className="w-4 h-4" />
              <span>5+ Years Experience</span>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <Button
              onClick={downloadResume}
              className="bg-blue-600 hover:bg-blue-700 text-white transform hover:scale-105 transition-all duration-300"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Resume
            </Button>
          </div>
        </div>

        {/* Skills Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center flex items-center justify-center gap-3">
            <Zap className="w-8 h-8 text-yellow-400" />
            Technical Expertise
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <Card
              className={`${
                darkMode ? "bg-white/10 border-blue-500/30" : "bg-white/80 border-blue-200"
              } backdrop-blur-sm hover:scale-105 transition-all duration-300`}
            >
              <CardHeader>
                <CardTitle className={`flex items-center gap-2 ${darkMode ? "text-blue-300" : "text-blue-600"}`}>
                  <Server className="w-5 h-5" />
                  Backend Development
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {["Node.js", "Python", "Java", "Express.js", "FastAPI", "Microservices"].map((skill) => (
                    <Badge
                      key={skill}
                      className={`${
                        darkMode
                          ? "bg-blue-500/20 text-blue-200 border-blue-500/30"
                          : "bg-blue-100 text-blue-700 border-blue-200"
                      }`}
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card
              className={`${
                darkMode ? "bg-white/10 border-cyan-500/30" : "bg-white/80 border-cyan-200"
              } backdrop-blur-sm hover:scale-105 transition-all duration-300`}
            >
              <CardHeader>
                <CardTitle className={`flex items-center gap-2 ${darkMode ? "text-cyan-300" : "text-cyan-600"}`}>
                  <Database className="w-5 h-5" />
                  Databases & Storage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {["PostgreSQL", "MongoDB", "Redis", "Elasticsearch", "MySQL", "DynamoDB"].map((skill) => (
                    <Badge
                      key={skill}
                      className={`${
                        darkMode
                          ? "bg-cyan-500/20 text-cyan-200 border-cyan-500/30"
                          : "bg-cyan-100 text-cyan-700 border-cyan-200"
                      }`}
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card
              className={`${
                darkMode ? "bg-white/10 border-indigo-500/30" : "bg-white/80 border-indigo-200"
              } backdrop-blur-sm hover:scale-105 transition-all duration-300`}
            >
              <CardHeader>
                <CardTitle className={`flex items-center gap-2 ${darkMode ? "text-indigo-300" : "text-indigo-600"}`}>
                  <Cloud className="w-5 h-5" />
                  Cloud & DevOps
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {["AWS", "Docker", "Kubernetes", "CI/CD", "Terraform", "Monitoring"].map((skill) => (
                    <Badge
                      key={skill}
                      className={`${
                        darkMode
                          ? "bg-indigo-500/20 text-indigo-200 border-indigo-500/30"
                          : "bg-indigo-100 text-indigo-700 border-indigo-200"
                      }`}
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Animated Skills Progress */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {skills.map((skill, index) => (
              <div key={skill.name} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className={`font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>{skill.name}</span>
                  <span className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>{skill.level}%</span>
                </div>
                <div className={`w-full ${darkMode ? "bg-gray-700" : "bg-gray-200"} rounded-full h-2`}>
                  <div
                    className={`bg-gradient-to-r ${skill.color} h-2 rounded-full transition-all duration-1000 ease-out`}
                    style={{
                      width: `${skill.level}%`,
                      animationDelay: `${index * 100}ms`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hobbies & Interests Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center flex items-center justify-center gap-3">
            <Heart className="w-8 h-8 text-red-400" />
            Hobbies & Interests
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hobbies.map((hobby, index) => (
              <Card
                key={index}
                className={`${
                  darkMode ? "bg-white/10 border-purple-500/30" : "bg-white/80 border-purple-200"
                } backdrop-blur-sm hover:scale-105 transition-all duration-300 group`}
              >
                <CardHeader>
                  <CardTitle
                    className={`flex items-center gap-3 ${
                      darkMode ? "text-purple-300" : "text-purple-600"
                    } group-hover:text-purple-400 transition-colors`}
                  >
                    <div className="p-2 bg-purple-500/20 rounded-lg group-hover:bg-purple-500/30 transition-colors">
                      {hobby.icon}
                    </div>
                    {hobby.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className={`${darkMode ? "text-gray-300" : "text-gray-600"} mb-4 text-sm leading-relaxed`}>
                    {hobby.description}
                  </p>
                  <div className="space-y-2">
                    {hobby.achievements.map((achievement, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{achievement}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Featured Projects Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center flex items-center justify-center gap-3">
            <Rocket className="w-8 h-8 text-orange-400" />
            Featured Projects
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <Card
                key={index}
                className={`${
                  darkMode ? "bg-white/10 border-blue-500/30" : "bg-white/80 border-blue-200"
                } backdrop-blur-sm hover:scale-105 transition-all duration-300 group overflow-hidden`}
              >
                <CardHeader className="p-0">
                  <div className="relative h-48 bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="relative z-10 text-center">
                      <Server className="w-16 h-16 text-white mb-2 mx-auto" />
                      <h3 className="text-white font-bold text-lg">{project.title}</h3>
                    </div>
                    <div className="absolute top-4 right-4 flex gap-2">
                      <Badge className="bg-white/20 text-white border-white/30">{project.duration}</Badge>
                    </div>
                  </div>
                  <div className="p-6">
                    <CardTitle className={`${darkMode ? "text-blue-300" : "text-blue-600"} mb-3`}>
                      {project.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className={`${darkMode ? "text-gray-300" : "text-gray-600"} mb-4 leading-relaxed`}>
                    {project.description}
                  </p>

                  {/* Project Metrics */}
                  <div className="grid grid-cols-2 gap-4 mb-4 p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-lg">
                    {Object.entries(project.metrics).map(([key, value]) => (
                      <div key={key} className="text-center">
                        <div className={`text-lg font-bold ${darkMode ? "text-blue-300" : "text-blue-600"}`}>
                          {value}
                        </div>
                        <div className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"} capitalize`}>
                          {key}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech) => (
                      <Badge
                        key={tech}
                        className={`${
                          darkMode
                            ? "bg-blue-500/20 text-blue-200 border-blue-500/30"
                            : "bg-blue-100 text-blue-700 border-blue-200"
                        } text-xs`}
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>

                  {/* Key Features */}
                  <div className="space-y-2 mb-4">
                    <h4 className={`font-semibold ${darkMode ? "text-white" : "text-gray-900"} text-sm`}>
                      Key Features:
                    </h4>
                    {project.features.slice(0, 3).map((feature, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className={`text-xs ${darkMode ? "text-gray-300" : "text-gray-600"}`}>{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Project Details */}
                  <div className="flex justify-between items-center text-xs">
                    <div className={`${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                      <span className="font-medium">Team:</span> {project.team}
                    </div>
                    <div className={`${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                      <span className="font-medium">Role:</span> {project.role}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Client Testimonials */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center flex items-center justify-center gap-3">
            <Users className="w-8 h-8 text-green-400" />
            Client Testimonials
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className={`${
                  darkMode ? "bg-white/10 border-green-500/30" : "bg-white/80 border-green-200"
                } backdrop-blur-sm hover:scale-105 transition-all duration-300`}
              >
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <h4 className={`font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
                        {testimonial.name}
                      </h4>
                      <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>{testimonial.role}</p>
                    </div>
                  </div>
                  <div className="flex gap-1 mb-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className={`${darkMode ? "text-gray-300" : "text-gray-600"} text-sm leading-relaxed mb-3`}>
                    "{testimonial.text}"
                  </p>
                  <div className="flex justify-between items-center">
                    <Badge
                      className={`${
                        darkMode
                          ? "bg-green-500/20 text-green-200 border-green-500/30"
                          : "bg-green-100 text-green-700 border-green-200"
                      } text-xs`}
                    >
                      {testimonial.project}
                    </Badge>
                    <span className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                      {testimonial.company}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Experience & Achievements */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center flex items-center justify-center gap-3">
            <Trophy className="w-8 h-8 text-yellow-400" />
            Experience & Achievements
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card
              className={`${
                darkMode ? "bg-white/10 border-blue-500/30" : "bg-white/80 border-blue-200"
              } backdrop-blur-sm hover:scale-105 transition-all duration-300`}
            >
              <CardHeader>
                <CardTitle className={`${darkMode ? "text-blue-300" : "text-blue-600"} flex items-center gap-2`}>
                  <Briefcase className="w-5 h-5" />
                  Professional Experience
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border-l-2 border-blue-500 pl-4 relative">
                  <div className="absolute -left-2 top-0 w-4 h-4 bg-blue-500 rounded-full"></div>
                  <h4 className={`font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
                    Senior Backend Architect
                  </h4>
                  <p className={`${darkMode ? "text-blue-200" : "text-blue-600"} text-sm`}>
                    TechFlow Systems • 2022-Present
                  </p>
                  <p className={`${darkMode ? "text-gray-300" : "text-gray-600"} text-sm mt-2`}>
                    Leading backend architecture for fintech platform serving 1M+ users. Designed microservices
                    architecture reducing system latency by 60%.
                  </p>
                </div>
                <div className="border-l-2 border-cyan-500 pl-4 relative">
                  <div className="absolute -left-2 top-0 w-4 h-4 bg-cyan-500 rounded-full"></div>
                  <h4 className={`font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>Backend Team Lead</h4>
                  <p className={`${darkMode ? "text-cyan-200" : "text-cyan-600"} text-sm`}>
                    DataCorp Solutions • 2020-2022
                  </p>
                  <p className={`${darkMode ? "text-gray-300" : "text-gray-600"} text-sm mt-2`}>
                    Led team of 8 developers building data processing pipelines. Implemented real-time analytics system
                    processing 100k events/second.
                  </p>
                </div>
                <div className="border-l-2 border-indigo-500 pl-4 relative">
                  <div className="absolute -left-2 top-0 w-4 h-4 bg-indigo-500 rounded-full"></div>
                  <h4 className={`font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>Software Engineer</h4>
                  <p className={`${darkMode ? "text-indigo-200" : "text-indigo-600"} text-sm`}>
                    StartupTech Inc • 2019-2020
                  </p>
                  <p className={`${darkMode ? "text-gray-300" : "text-gray-600"} text-sm mt-2`}>
                    Developed RESTful APIs and microservices. Built distributed task queue system handling 500k jobs
                    daily.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card
              className={`${
                darkMode ? "bg-white/10 border-yellow-500/30" : "bg-white/80 border-yellow-200"
              } backdrop-blur-sm hover:scale-105 transition-all duration-300`}
            >
              <CardHeader>
                <CardTitle className={`${darkMode ? "text-yellow-300" : "text-yellow-600"} flex items-center gap-2`}>
                  <Award className="w-5 h-5" />
                  Achievements & Certifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Star className="w-5 h-5 text-yellow-400 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className={`font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
                      AWS Certified Solutions Architect Professional
                    </h4>
                    <p className={`${darkMode ? "text-gray-300" : "text-gray-600"} text-sm`}>
                      Advanced cloud architecture certification - 2023
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Star className="w-5 h-5 text-yellow-400 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className={`font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
                      Kubernetes Certified Application Developer
                    </h4>
                    <p className={`${darkMode ? "text-gray-300" : "text-gray-600"} text-sm`}>
                      Container orchestration expertise - 2023
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Star className="w-5 h-5 text-yellow-400 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className={`font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
                      Backend Architecture Hackathon Winner
                    </h4>
                    <p className={`${darkMode ? "text-gray-300" : "text-gray-600"} text-sm`}>
                      Best Scalable System Design - TechCrunch Disrupt 2022
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Star className="w-5 h-5 text-yellow-400 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className={`font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
                      Open Source Maintainer
                    </h4>
                    <p className={`${darkMode ? "text-gray-300" : "text-gray-600"} text-sm`}>
                      Node.js Performance Library - 5k+ GitHub stars
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Star className="w-5 h-5 text-yellow-400 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className={`font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
                      Tech Speaker & Guide
                    </h4>
                    <p className={`${darkMode ? "text-gray-300" : "text-gray-600"} text-sm`}>
                      Spoke at 10+ conferences, guideed 50+ developers
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Contact Section */}
        <div className="text-center">
          <div className="relative p-12 rounded-3xl bg-gradient-to-br from-blue-600/20 to-cyan-600/20 backdrop-blur-sm border border-blue-500/30 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-cyan-600/10 animate-pulse" />
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-3">
                <Rocket className="w-8 h-8 text-blue-400" />
                Let's Build Something Extraordinary
              </h2>
              <p className={`${darkMode ? "text-gray-300" : "text-gray-600"} mb-8 max-w-2xl mx-auto leading-relaxed`}>
                Ready to architect scalable solutions and tackle complex backend challenges? Let's connect and discuss
                how we can build the next generation of applications together.
              </p>
              <div className="flex flex-wrap justify-center gap-6">
                <a
                  href="mailto:dev.dharrshan@hackconnect.com"
                  className={`flex items-center gap-2 px-6 py-3 rounded-full ${
                    darkMode
                      ? "bg-blue-600/20 text-blue-300 hover:bg-blue-600/30"
                      : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                  } transition-all duration-300 hover:scale-105 backdrop-blur-sm border ${
                    darkMode ? "border-blue-500/30" : "border-blue-200"
                  }`}
                >
                  <Mail className="w-5 h-5" />
                  <span>devdharrshans.23csd@kongu.edu</span>
                </a>
                <a
                  href="tel:+919876543211"
                  className={`flex items-center gap-2 px-6 py-3 rounded-full ${
                    darkMode
                      ? "bg-green-600/20 text-green-300 hover:bg-green-600/30"
                      : "bg-green-100 text-green-600 hover:bg-green-200"
                  } transition-all duration-300 hover:scale-105 backdrop-blur-sm border ${
                    darkMode ? "border-green-500/30" : "border-green-200"
                  }`}
                >
                  <Phone className="w-5 h-5" />
                  <span>+91 93635 34589</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
