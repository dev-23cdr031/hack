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
  Brain,
  Database,
  Star,
  Code,
  Phone,
  Moon,
  Sun,
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
  Zap,
  Trophy,
  Heart,
  Briefcase,
  Rocket,
} from "lucide-react"
import Link from "next/link"

export default function AnusreeDPortfolio() {
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
    window.open("/resume/anusree-d", "_blank")
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const toggleTheme = () => {
    setIsDark(!isDark)
  }

  const skills = [
    { name: "Python", level: 96, color: "from-blue-400 to-cyan-500" },
    { name: "Machine Learning", level: 94, color: "from-cyan-400 to-teal-500" },
    { name: "TensorFlow", level: 92, color: "from-teal-400 to-blue-500" },
    { name: "PyTorch", level: 90, color: "from-blue-500 to-cyan-600" },
    { name: "Deep Learning", level: 93, color: "from-cyan-500 to-teal-600" },
    { name: "Computer Vision", level: 89, color: "from-teal-500 to-blue-600" },
    { name: "NLP", level: 87, color: "from-blue-400 to-cyan-400" },
    { name: "Data Science", level: 95, color: "from-cyan-400 to-teal-400" },
    { name: "AWS", level: 85, color: "from-teal-400 to-blue-400" },
    { name: "Docker", level: 88, color: "from-blue-500 to-cyan-500" },
    { name: "Kubernetes", level: 82, color: "from-cyan-500 to-teal-500" },
    { name: "MLOps", level: 91, color: "from-teal-500 to-blue-500" },
  ]

  const hobbies = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: "AI Research & Paper Reading",
      description:
        "Staying updated with latest AI research papers and contributing to open-source ML projects. Active in AI research communities.",
      achievements: "📚 200+ research papers read • 📝 5 research contributions • 🏆 AI research award winner",
    },
    {
      icon: <Camera className="w-6 h-6" />,
      title: "Computer Vision Photography",
      description:
        "Combining photography passion with CV skills. Creating datasets and experimenting with image processing algorithms.",
      achievements: "📸 10k+ labeled images • 🤖 3 CV models trained • 📱 Photography app with AI features",
    },
    {
      icon: <Brush className="w-6 h-6" />,
      title: "Generative AI Art",
      description:
        "Creating digital art using GANs and diffusion models. Exploring the intersection of creativity and artificial intelligence.",
      achievements: "🎨 500+ AI artworks • 🖼️ NFT collection • 🏆 Digital art competition winner",
    },
    {
      icon: <Coffee className="w-6 h-6" />,
      title: "Data Science Blogging",
      description:
        "Writing technical blogs about ML algorithms, sharing insights and tutorials for the data science community.",
      achievements: "📝 50+ technical blogs • 👥 10k+ monthly readers • 🏆 Top ML blogger award",
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "AI Ethics & Philosophy",
      description: "Studying the ethical implications of AI and contributing to responsible AI development practices.",
      achievements: "📚 Ethics certification • 🎓 Philosophy of AI course • 📊 Bias detection research",
    },
    {
      icon: <Gamepad2 className="w-6 h-6" />,
      title: "Reinforcement Learning Gaming",
      description:
        "Building RL agents for games and exploring game AI. Creating intelligent NPCs and game balancing algorithms.",
      achievements: "🎮 5 game AI agents • 🏆 RL competition winner • 🤖 Game AI framework creator",
    },
    {
      icon: <Music className="w-6 h-6" />,
      title: "Audio ML & Music Generation",
      description:
        "Working with audio processing and music generation using deep learning. Creating AI-powered music tools.",
      achievements: "🎵 Music generation model • 🎧 Audio classification system • 🎼 AI music album",
    },
    {
      icon: <Plane className="w-6 h-6" />,
      title: "Tech Conference Speaking",
      description:
        "Speaking at AI/ML conferences worldwide, sharing knowledge and connecting with the global AI community.",
      achievements: "✈️ 15+ conferences • 🎤 50+ talks delivered • 🌍 Global AI community leader",
    },
    {
      icon: <Dumbbell className="w-6 h-6" />,
      title: "Fitness Data Analytics",
      description:
        "Applying ML to personal fitness data, creating predictive models for health and performance optimization.",
      achievements: "💪 Personal fitness AI • 📊 Health prediction models • 🏃‍♀️ Marathon performance optimizer",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "AI Teammateship & Teaching",
      description: "Guideing aspiring data scientists and teaching ML concepts through workshops and online courses.",
      achievements: "👥 100+ students guideed • 🎓 ML course creator • 🏆 Best guide award",
    },
  ]

  const projects = [
    {
      title: "Advanced Medical Imaging AI",
      description:
        "Deep learning system for medical image analysis with 95% accuracy in disease detection. Deployed in 20+ hospitals worldwide, helping doctors make faster and more accurate diagnoses.",
      image: <Brain className="w-16 h-16 text-white" />,
      gradient: "from-blue-600 to-cyan-600",
      technologies: ["Python", "TensorFlow", "OpenCV", "DICOM", "Flask", "Docker"],
      metrics: {
        users: "20+ hospitals",
        impact: "95% accuracy achieved",
        data: "1M+ medical images processed",
        duration: "18 months",
        team: "8 medical AI specialists",
        role: "Lead AI Engineer",
      },
      features: [
        "Multi-modal medical imaging",
        "Real-time disease detection",
        "HIPAA compliant deployment",
        "Explainable AI diagnostics",
        "Integration with hospital systems",
      ],
    },
    {
      title: "Natural Language Processing Engine",
      description:
        "Comprehensive NLP platform supporting 15+ languages with sentiment analysis, entity recognition, and text generation capabilities. Processes 10M+ documents daily for enterprise clients.",
      image: <Code className="w-16 h-16 text-white" />,
      gradient: "from-cyan-600 to-teal-600",
      technologies: ["Python", "PyTorch", "Transformers", "spaCy", "FastAPI", "Redis"],
      metrics: {
        users: "50+ enterprise clients",
        impact: "10M+ documents/day",
        data: "15 languages supported",
        duration: "14 months",
        team: "6 NLP engineers",
        role: "Senior NLP Engineer",
      },
      features: [
        "Multi-language support",
        "Real-time text processing",
        "Custom model training",
        "API-first architecture",
        "Scalable cloud deployment",
      ],
    },
    {
      title: "Computer Vision Healthcare System",
      description:
        "AI-powered diagnostic system using computer vision for medical imaging analysis. Achieved 92% accuracy in early disease detection and deployed across 15+ healthcare facilities.",
      image: <Camera className="w-16 h-16 text-white" />,
      gradient: "from-teal-600 to-blue-600",
      technologies: ["Python", "PyTorch", "OpenCV", "CUDA", "FastAPI", "PostgreSQL"],
      metrics: {
        users: "15+ healthcare facilities",
        impact: "92% diagnostic accuracy",
        data: "500k+ medical scans analyzed",
        duration: "16 months",
        team: "10 healthcare & AI experts",
        role: "Computer Vision Lead",
      },
      features: [
        "Medical image segmentation",
        "Automated report generation",
        "Real-time processing pipeline",
        "FDA compliance standards",
        "Radiologist workflow integration",
      ],
    },
    {
      title: "AI-Powered Trading Algorithm",
      description:
        "Sophisticated trading system using deep reinforcement learning and sentiment analysis. Achieved 23% annual returns with risk management and real-time market analysis capabilities.",
      image: <Database className="w-16 h-16 text-white" />,
      gradient: "from-blue-600 to-indigo-600",
      technologies: ["Python", "TensorFlow", "Pandas", "NumPy", "Apache Kafka", "TimescaleDB"],
      metrics: {
        users: "5 hedge funds",
        impact: "23% annual returns",
        data: "1TB+ market data daily",
        duration: "20 months",
        team: "12 quant & AI engineers",
        role: "Quantitative AI Developer",
      },
      features: [
        "Deep reinforcement learning",
        "Multi-asset portfolio optimization",
        "Real-time sentiment analysis",
        "Risk management algorithms",
        "High-frequency trading support",
      ],
    },
  ]

  const testimonials = [
    {
      name: "Divakar",
      role: "Chief Medical Officer",
      company: "MedTech Innovations",
      rating: 5,
      text: "Anusree's medical imaging AI system has revolutionized our diagnostic process. The 95% accuracy rate and seamless integration with our existing systems has improved patient outcomes significantly. Her expertise in both AI and healthcare is remarkable.",
      project: "Advanced Medical Imaging AI",
    },
    {
      name: "Divyadharshini",
      role: "VP of Engineering",
      company: "GlobalTech Solutions",
      rating: 5,
      text: "Working with Anusree on our NLP platform was exceptional. Her deep understanding of transformer models and ability to scale to 10M+ documents daily while maintaining accuracy is impressive. She's a true AI expert.",
      project: "Natural Language Processing Engine",
    },
    {
      name: "Bharani",
      role: "Portfolio Manager",
      company: "Quantum Capital",
      rating: 5,
      text: "Anusree's AI trading algorithm delivered 23% annual returns while maintaining excellent risk management. Her combination of deep learning expertise and financial market understanding is unparalleled in the industry.",
      project: "AI-Powered Trading Algorithm",
    },
  ]

  return (
    <div
      className={`min-h-screen transition-all duration-500 ${
        isDark
          ? "bg-gradient-to-br from-blue-900 via-cyan-900 to-teal-900 text-white"
          : "bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 text-gray-900"
      }`}
    >
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl transition-all duration-1000"
          style={{
            left: mousePosition.x - 192,
            top: mousePosition.y - 192,
          }}
        />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/5 rounded-full blur-2xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-teal-500/5 rounded-full blur-2xl animate-pulse delay-1000" />
      </div>

      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-black/10 z-50">
        <div
          className="h-full bg-gradient-to-r from-blue-400 to-cyan-500 transition-all duration-150"
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

      {/* Navigation */}
      <nav
        className={`flex justify-between items-center p-6 md:px-12 ${
          isDark ? "bg-black/20" : "bg-white/20"
        } backdrop-blur-sm sticky top-0 z-40`}
      >
        <Link
          href="/about"
          className={`flex items-center gap-2 ${
            isDark ? "text-white hover:text-cyan-300" : "text-gray-900 hover:text-cyan-600"
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
            <div className="w-56 h-56 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 p-1 mx-auto shadow-2xl shadow-cyan-500/30">
              <div
                className={`w-full h-full rounded-full ${
                  isDark ? "bg-gray-800" : "bg-white"
                } flex items-center justify-center overflow-hidden`}
              >
                <img
                  src="/team/anusree.jpg"
                  alt="Anusree D"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
            </div>
            <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-green-500 rounded-full border-4 border-white flex items-center justify-center animate-bounce">
              <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
            <Sparkles className="absolute -top-4 -left-4 w-8 h-8 text-blue-400 animate-spin" />
            <Sparkles className="absolute -bottom-4 -right-8 w-6 h-6 text-cyan-400 animate-ping" />
          </div>

          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Anusree D
          </h1>
          <p className={`text-2xl mb-6 ${isDark ? "text-blue-200" : "text-blue-700"}`}>
            AI Solutions Engineer & Software Developer
          </p>
          <p className={`text-lg max-w-3xl mx-auto leading-relaxed mb-8 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
            Passionate about artificial intelligence and machine learning solutions that solve real-world problems. I
            specialize in deep learning, computer vision, and NLP to create intelligent systems that make a difference.
            🤖 Building the future with AI.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className={`flex items-center gap-2 ${isDark ? "text-blue-300" : "text-blue-600"}`}>
              <MapPin className="w-4 h-4" />
              <span>Tiruppur,India</span>
            </div>
            <div className={`flex items-center gap-2 ${isDark ? "text-blue-300" : "text-blue-600"}`}>
              <Calendar className="w-4 h-4" />
              <span>Available for Projects</span>
            </div>
            <div className={`flex items-center gap-2 ${isDark ? "text-blue-300" : "text-blue-600"}`}>
              <Award className="w-4 h-4" />
              <span>4+ Years Experience</span>
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
            AI & ML Expertise
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills.map((skill, index) => (
              <Card
                key={skill.name}
                className={`${
                  isDark ? "bg-white/10 border-blue-500/30" : "bg-white/80 border-blue-300/50"
                } backdrop-blur-sm hover:scale-105 transition-all duration-300`}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}>{skill.name}</span>
                    <span className={`text-sm ${isDark ? "text-blue-300" : "text-blue-600"}`}>{skill.level}%</span>
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
          <h2 className="text-3xl font-bold mb-8 text-center flex items-center justify-center gap-3">
            <Heart className="w-8 h-8 text-red-400" />
            Hobbies & Interests 🌟
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {hobbies.map((hobby, index) => (
              <Card
                key={index}
                className={`${
                  isDark ? "bg-white/10 border-blue-500/30" : "bg-white/80 border-blue-300/50"
                } backdrop-blur-sm hover:scale-105 transition-all duration-300 group`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div
                      className={`p-3 rounded-full ${
                        isDark ? "bg-blue-500/20 text-blue-300" : "bg-blue-100 text-blue-600"
                      } group-hover:scale-110 transition-transform duration-300`}
                    >
                      {hobby.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-semibold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>{hobby.title}</h3>
                      <p className={`text-sm mb-3 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                        {hobby.description}
                      </p>
                      <p className={`text-xs ${isDark ? "text-blue-300" : "text-blue-600"}`}>{hobby.achievements}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Projects Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center flex items-center justify-center gap-3">
            <Rocket className="w-8 h-8 text-orange-400" />
            Featured Projects 🚀
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <Card
                key={index}
                className={`${
                  isDark ? "bg-white/10 border-blue-500/30" : "bg-white/80 border-blue-300/50"
                } backdrop-blur-sm hover:scale-105 transition-all duration-300 group overflow-hidden`}
              >
                <CardHeader>
                  <div
                    className={`w-full h-48 bg-gradient-to-br ${project.gradient} rounded-lg mb-4 flex items-center justify-center group-hover:scale-105 transition-transform duration-300`}
                  >
                    {project.image}
                  </div>
                  <CardTitle className={`${isDark ? "text-blue-300" : "text-blue-700"}`}>{project.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className={`mb-4 ${isDark ? "text-gray-300" : "text-gray-600"}`}>{project.description}</p>

                  <div className="mb-4">
                    <h4 className={`font-semibold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>Key Metrics:</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className={isDark ? "text-blue-300" : "text-blue-600"}>👥 {project.metrics.users}</div>
                      <div className={isDark ? "text-blue-300" : "text-blue-600"}>📈 {project.metrics.impact}</div>
                      <div className={isDark ? "text-blue-300" : "text-blue-600"}>💾 {project.metrics.data}</div>
                      <div className={isDark ? "text-blue-300" : "text-blue-600"}>⏱️ {project.metrics.duration}</div>
                      <div className={isDark ? "text-blue-300" : "text-blue-600"}>👨‍💻 {project.metrics.team}</div>
                      <div className={isDark ? "text-blue-300" : "text-blue-600"}>🎯 {project.metrics.role}</div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className={`font-semibold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>Key Features:</h4>
                    <ul className={`text-sm space-y-1 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                      {project.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech) => (
                      <Badge
                        key={tech}
                        className={`${isDark ? "bg-blue-500/20 text-blue-200" : "bg-blue-100 text-blue-700"} text-xs`}
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
          <h2 className="text-3xl font-bold mb-8 text-center flex items-center justify-center gap-3">
            <Users className="w-8 h-8 text-green-400" />
            Client Testimonials 💬
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className={`${
                  isDark ? "bg-white/10 border-blue-500/30" : "bg-white/80 border-blue-300/50"
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
                    <p className={`text-sm ${isDark ? "text-blue-300" : "text-blue-600"}`}>{testimonial.role}</p>
                    <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>{testimonial.company}</p>
                    <p className={`text-xs mt-1 ${isDark ? "text-blue-400" : "text-blue-700"}`}>
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
          <h2 className="text-3xl font-bold mb-8 text-center flex items-center justify-center gap-3">
            <Trophy className="w-8 h-8 text-yellow-400" />
            Experience & Achievements 🏆
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card
              className={`${
                isDark ? "bg-white/10 border-blue-500/30" : "bg-white/80 border-blue-300/50"
              } backdrop-blur-sm hover:scale-105 transition-all duration-300`}
            >
              <CardHeader>
                <CardTitle className={`${isDark ? "text-blue-300" : "text-blue-700"} flex items-center gap-2`}>
                  <Briefcase className="w-5 h-5" />
                  Professional Experience
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border-l-2 border-blue-500 pl-4 relative">
                  <div className="absolute -left-2 top-0 w-4 h-4 bg-blue-500 rounded-full"></div>
                  <h4 className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>Senior AI Engineer</h4>
                  <p className={`${isDark ? "text-blue-200" : "text-blue-600"} text-sm`}>
                    TechAI Solutions • 2022-Present
                  </p>
                  <p className={`${isDark ? "text-gray-300" : "text-gray-600"} text-sm mt-2`}>
                    Leading AI initiatives for healthcare and fintech clients. Developed ML models serving 1M+ users
                    with 95% accuracy.
                  </p>
                </div>
                <div className="border-l-2 border-cyan-500 pl-4 relative">
                  <div className="absolute -left-2 top-0 w-4 h-4 bg-cyan-500 rounded-full"></div>
                  <h4 className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>ML Engineer</h4>
                  <p className={`${isDark ? "text-cyan-200" : "text-cyan-600"} text-sm`}>
                    DataCorp Analytics • 2021-2022
                  </p>
                  <p className={`${isDark ? "text-gray-300" : "text-gray-600"} text-sm mt-2`}>
                    Built computer vision and NLP solutions. Implemented MLOps pipelines processing 10M+ data points
                    daily.
                  </p>
                </div>
                <div className="border-l-2 border-teal-500 pl-4 relative">
                  <div className="absolute -left-2 top-0 w-4 h-4 bg-teal-500 rounded-full"></div>
                  <h4 className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>Data Scientist</h4>
                  <p className={`${isDark ? "text-teal-200" : "text-teal-600"} text-sm`}>
                    AI Innovations Lab • 2020-2021
                  </p>
                  <p className={`${isDark ? "text-gray-300" : "text-gray-600"} text-sm mt-2`}>
                    Developed predictive models and data analytics solutions. Specialized in deep learning and
                    statistical modeling.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card
              className={`${
                isDark ? "bg-white/10 border-cyan-500/30" : "bg-white/80 border-cyan-300/50"
              } backdrop-blur-sm hover:scale-105 transition-all duration-300`}
            >
              <CardHeader>
                <CardTitle className={`${isDark ? "text-cyan-300" : "text-cyan-700"} flex items-center gap-2`}>
                  <Award className="w-5 h-5" />
                  Achievements & Certifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Star className="w-5 h-5 text-yellow-400 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                      KEC Cloud Professional ML Engineer
                    </h4>
                    <p className={`${isDark ? "text-gray-300" : "text-gray-600"} text-sm`}>
                      Advanced ML engineering certification - 2023
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Star className="w-5 h-5 text-yellow-400 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                      AWS Certified Machine Learning Specialty
                    </h4>
                    <p className={`${isDark ? "text-gray-300" : "text-gray-600"} text-sm`}>
                      Cloud ML deployment expertise - 2023
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Star className="w-5 h-5 text-yellow-400 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                      AI Research Paper Publication
                    </h4>
                    <p className={`${isDark ? "text-gray-300" : "text-gray-600"} text-sm`}>
                      Published in IEEE AI Conference 2022
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Star className="w-5 h-5 text-yellow-400 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                      Kaggle Competitions Master
                    </h4>
                    <p className={`${isDark ? "text-gray-300" : "text-gray-600"} text-sm`}>
                      Top 1% in 5+ ML competitions
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Star className="w-5 h-5 text-yellow-400 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>AI Community Leader</h4>
                    <p className={`${isDark ? "text-gray-300" : "text-gray-600"} text-sm`}>
                      Organized 10+ AI workshops, guideed 50+ developers
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
              ? "bg-gradient-to-r from-blue-900/50 to-cyan-900/50"
              : "bg-gradient-to-r from-blue-100/50 to-cyan-100/50"
          } backdrop-blur-sm`}
        >
          <h2 className={`text-3xl font-bold mb-8 ${isDark ? "text-white" : "text-gray-900"}`}>
            Let's Build Intelligent Solutions 🤖
          </h2>
          <p className={`mb-8 max-w-2xl mx-auto ${isDark ? "text-gray-300" : "text-gray-600"}`}>
            Ready to harness the power of AI and machine learning for your next project? Let's collaborate and create
            intelligent solutions that make a real impact.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <a
              href="mailto:anusree.d@hackconnect.com"
              className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 hover:scale-105 ${
                isDark ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              <Mail className="w-5 h-5" />
              <span>anusreed.23csd@kongu.edu</span>
            </a>
            <a
              href="tel:+919876543214"
              className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 hover:scale-105 ${
                isDark ? "bg-cyan-600 hover:bg-cyan-700 text-white" : "bg-cyan-600 hover:bg-cyan-700 text-white"
              }`}
            >
              <Phone className="w-5 h-5" />
              <span>+91 90806 20644</span>
            </a>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-all duration-300 hover:scale-110"
        >
          <ArrowLeft className="w-5 h-5 rotate-90" />
        </button>
      )}
    </div>
  )
}
