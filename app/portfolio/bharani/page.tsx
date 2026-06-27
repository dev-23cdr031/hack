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
  Cloud,
  Users,
  Star,
  Phone,
  Moon,
  Sun,
  ArrowUp,
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
  CheckCircle,
  Briefcase,
  Monitor,
} from "lucide-react"
import Link from "next/link"

export default function BharaniPortfolio() {
  const [darkMode, setDarkMode] = useState(true)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop
      const windowHeight = document.documentElement.scrollHeight - window.innerHeight
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
    window.open("/resume/bharani", "_blank")
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const toggleTheme = () => {
    setDarkMode(!darkMode)
  }

  const skills = [
    { name: "AWS", level: 95, color: "from-orange-400 to-orange-600" },
    { name: "Azure", level: 90, color: "from-blue-400 to-blue-600" },
    { name: "KEC Cloud", level: 88, color: "from-green-400 to-green-600" },
    { name: "Docker", level: 93, color: "from-blue-500 to-cyan-500" },
    { name: "Kubernetes", level: 91, color: "from-purple-400 to-purple-600" },
    { name: "Terraform", level: 89, color: "from-indigo-400 to-indigo-600" },
    { name: "Jenkins", level: 87, color: "from-red-400 to-red-600" },
    { name: "Python", level: 92, color: "from-yellow-400 to-yellow-600" },
    { name: "Node.js", level: 85, color: "from-green-500 to-green-700" },
    { name: "Linux", level: 94, color: "from-gray-400 to-gray-600" },
    { name: "Monitoring", level: 88, color: "from-pink-400 to-pink-600" },
    { name: "DevOps", level: 96, color: "from-cyan-400 to-cyan-600" },
  ]

  const hobbies = [
    {
      icon: <Cloud className="w-6 h-6" />,
      title: "Cloud Architecture Design",
      description:
        "Passionate about designing scalable cloud architectures. Love experimenting with new cloud services and optimizing costs.",
      achievements: [
        "Designed multi-cloud architectures",
        "Reduced cloud costs by 40%",
        "AWS Solutions Architect certified",
      ],
    },
    {
      icon: <Code className="w-6 h-6" />,
      title: "Infrastructure as Code",
      description:
        "Building automated infrastructure using Terraform and CloudFormation. Creating reusable modules and best practices.",
      achievements: ["100+ Terraform modules", "Infrastructure automation expert", "Open source contributor"],
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "DevSecOps & Security",
      description:
        "Integrating security into DevOps pipelines. Implementing security scanning and compliance automation.",
      achievements: ["Security pipeline automation", "Compliance frameworks", "Vulnerability assessment tools"],
    },
    {
      icon: <Monitor className="w-6 h-6" />,
      title: "Monitoring & Observability",
      description:
        "Building comprehensive monitoring solutions with Prometheus, Grafana, and ELK stack. Creating custom dashboards.",
      achievements: ["Custom monitoring solutions", "SLA/SLO implementation", "Alerting optimization"],
    },
    {
      icon: <Coffee className="w-6 h-6" />,
      title: "DevOps Community",
      description:
        "Active in DevOps communities, sharing knowledge through blogs and meetups. Guideing junior engineers.",
      achievements: ["DevOps meetup team lead", "Technical blog writer", "Community guide"],
    },
    {
      icon: <Gamepad2 className="w-6 h-6" />,
      title: "Gaming & Streaming",
      description:
        "Passionate gamer who streams on Twitch. Building gaming infrastructure and exploring cloud gaming solutions.",
      achievements: ["Twitch streamer", "Gaming infrastructure", "Cloud gaming setup"],
    },
    {
      icon: <Mountain className="w-6 h-6" />,
      title: "Trekking & Adventure",
      description: "Love exploring mountains and nature. Trekking helps me think clearly about complex problems.",
      achievements: ["20+ mountain treks", "Adventure photography", "Outdoor survival skills"],
    },
    {
      icon: <Book className="w-6 h-6" />,
      title: "Technical Reading",
      description:
        "Constantly learning about new technologies, cloud services, and DevOps practices through books and research.",
      achievements: ["50+ technical books", "Research paper reader", "Technology trend analyst"],
    },
    {
      icon: <Dumbbell className="w-6 h-6" />,
      title: "Fitness & Wellness",
      description:
        "Maintaining physical fitness to handle the demands of DevOps work. Regular gym sessions and yoga practice.",
      achievements: ["5+ years fitness routine", "Yoga practitioner", "Wellness advocate"],
    },
    {
      icon: <Headphones className="w-6 h-6" />,
      title: "Tech Podcasting",
      description: "Host a DevOps podcast discussing cloud technologies, automation, and industry best practices.",
      achievements: ["DevOps podcast host", "50+ episodes", "Industry expert interviews"],
    },
  ]

  const projects = [
    {
      title: "Multi-Cloud Infrastructure Platform",
      description:
        "Enterprise-grade multi-cloud platform supporting AWS, Azure, and GCP with automated provisioning, monitoring, and cost optimization. Serves 100+ applications across multiple environments.",
      image: "/placeholder.svg?height=300&width=500&text=Multi-Cloud+Platform",
      technologies: ["Terraform", "AWS", "Azure", "GCP", "Kubernetes", "Prometheus"],
      features: [
        "Multi-cloud resource management",
        "Automated cost optimization",
        "Centralized monitoring",
        "Self-service provisioning",
        "Compliance automation",
      ],
      metrics: {
        applications: "100+ apps deployed",
        cost: "40% cost reduction",
        uptime: "99.9% availability",
        automation: "90% automated",
      },
      duration: "15 months",
      team: "8 cloud engineers",
      role: "Lead Cloud Architect",
    },
    {
      title: "CI/CD Pipeline Automation",
      description:
        "Comprehensive CI/CD platform with automated testing, security scanning, and deployment across multiple environments. Processes 500+ deployments daily with zero-downtime deployments.",
      image: "/placeholder.svg?height=300&width=500&text=CI/CD+Platform",
      technologies: ["Jenkins", "GitLab CI", "Docker", "Kubernetes", "SonarQube", "Vault"],
      features: [
        "Automated testing pipelines",
        "Security vulnerability scanning",
        "Blue-green deployments",
        "Rollback automation",
        "Performance monitoring",
      ],
      metrics: {
        deployments: "500+ daily",
        success: "99.5% success rate",
        time: "80% faster deployments",
        security: "100% scanned",
      },
      duration: "12 months",
      team: "6 DevOps engineers",
      role: "DevOps Lead",
    },
    {
      title: "Container Orchestration Platform",
      description:
        "Kubernetes-based container platform with auto-scaling, service mesh, and comprehensive monitoring. Manages 1000+ containers across multiple clusters with intelligent resource allocation.",
      image: "/placeholder.svg?height=300&width=500&text=K8s+Platform",
      technologies: ["Kubernetes", "Istio", "Helm", "Prometheus", "Grafana", "Fluentd"],
      features: [
        "Auto-scaling workloads",
        "Service mesh integration",
        "Multi-cluster management",
        "Resource optimization",
        "Disaster recovery",
      ],
      metrics: {
        containers: "1000+ containers",
        clusters: "15 clusters",
        efficiency: "60% resource savings",
        recovery: "< 5min RTO",
      },
      duration: "18 months",
      team: "10 platform engineers",
      role: "Platform Architect",
    },
    {
      title: "Infrastructure Monitoring System",
      description:
        "Comprehensive monitoring and alerting system using Prometheus, Grafana, and ELK stack. Provides real-time insights into infrastructure health and performance across 500+ servers.",
      image: "/placeholder.svg?height=300&width=500&text=Monitoring+System",
      technologies: ["Prometheus", "Grafana", "Elasticsearch", "Kibana", "AlertManager", "Telegraf"],
      features: [
        "Real-time metrics collection",
        "Custom dashboard creation",
        "Intelligent alerting",
        "Log aggregation",
        "Performance analytics",
      ],
      metrics: {
        servers: "500+ monitored",
        metrics: "10M+ data points/day",
        alerts: "99% accuracy",
        dashboards: "100+ custom",
      },
      duration: "10 months",
      team: "5 monitoring specialists",
      role: "Monitoring Lead",
    },
  ]

  const testimonials = [
    {
      name: "Divakar",
      role: "VP of Engineering",
      company: "CloudTech Solutions",
      rating: 5,
      text: "Bharani's expertise in cloud architecture and DevOps has transformed our infrastructure. His multi-cloud platform reduced our costs by 40% while improving reliability. His deep understanding of automation is exceptional.",
      project: "Multi-Cloud Infrastructure Platform",
    },
    {
      name: "Hemapriya",
      role: "CTO",
      company: "StartupScale Inc",
      rating: 5,
      text: "Working with Bharani on our CI/CD pipeline was a game-changer. We went from manual deployments to 500+ automated deployments daily with 99.5% success rate. His DevOps expertise is world-class.",
      project: "CI/CD Pipeline Automation",
    },
    {
      name: "Bharani",
      role: "Infrastructure Director",
      company: "Enterprise Systems",
      rating: 5,
      text: "Bharani's container orchestration platform has been instrumental in our digital transformation. Managing 1000+ containers across multiple clusters with 60% resource savings is remarkable. He's a true platform expert.",
      project: "Container Orchestration Platform",
    },
  ]

  return (
    <div
      className={`min-h-screen transition-all duration-500 ${
        darkMode
          ? "bg-gradient-to-br from-slate-900 via-orange-900 to-red-900 text-white"
          : "bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 text-gray-900"
      }`}
    >
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse"
          style={{
            left: mousePosition.x - 192,
            top: mousePosition.y - 192,
            transition: "all 0.3s ease-out",
          }}
        />
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-red-500/10 rounded-full blur-2xl animate-bounce" />
        <div className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-pink-500/10 rounded-full blur-xl animate-pulse" />
      </div>

      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200/20 z-50">
        <div
          className="h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-300"
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
          className="fixed bottom-6 right-6 z-50 p-3 bg-orange-600 hover:bg-orange-700 text-white rounded-full shadow-lg transition-all duration-300 hover:scale-110"
        >
          <ArrowUp className="w-5 h-5" />
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
            darkMode ? "text-white hover:text-orange-300" : "text-gray-900 hover:text-orange-600"
          } transition-colors`}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Team
        </Link>
        <div className="flex-1 flex justify-center">
          <Link
            href="/"
            className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent"
          >
            HackConnect
          </Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-12 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="relative inline-block mb-8">
            <div className="w-56 h-56 rounded-full bg-gradient-to-br from-orange-400 to-red-500 p-1 mx-auto relative overflow-hidden shadow-2xl shadow-orange-500/30">
              <img
                src="/team/bharani.jpg"
                alt="Bharani"
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-green-500 rounded-full border-4 border-white flex items-center justify-center animate-pulse">
              <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
            <div className="absolute -top-4 -left-4 text-yellow-400 animate-spin">
              <Sparkles className="w-8 h-8" />
            </div>
            <div className="absolute -bottom-4 -left-4 text-orange-400 animate-bounce">
              <Sparkles className="w-6 h-6" />
            </div>
          </div>

          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
            Bharani
          </h1>
          <p className={`text-2xl mb-6 ${darkMode ? "text-orange-200" : "text-orange-600"}`}>
            Cloud Solutions Architect & DevOps Engineer
          </p>
          <p
            className={`text-lg max-w-3xl mx-auto leading-relaxed mb-8 ${darkMode ? "text-gray-300" : "text-gray-600"}`}
          >
            Passionate about building scalable cloud infrastructure and automating deployment pipelines. I specialize in
            multi-cloud architectures, containerization, and DevOps practices that enable teams to deliver software
            faster and more reliably.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className={`flex items-center gap-2 ${darkMode ? "text-orange-300" : "text-orange-600"}`}>
              <MapPin className="w-4 h-4" />
              <span>erode,India</span>
            </div>
            <div className={`flex items-center gap-2 ${darkMode ? "text-orange-300" : "text-orange-600"}`}>
              <Calendar className="w-4 h-4" />
              <span>Available for Projects</span>
            </div>
            <div className={`flex items-center gap-2 ${darkMode ? "text-orange-300" : "text-orange-600"}`}>
              <Award className="w-4 h-4" />
              <span>3+ Years Experience</span>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <Button
              onClick={downloadResume}
              className="bg-orange-600 hover:bg-orange-700 text-white transform hover:scale-105 transition-all duration-300"
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
            Cloud & DevOps Expertise
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills.map((skill, index) => (
              <Card
                key={skill.name}
                className={`${
                  darkMode ? "bg-white/10 border-orange-500/30" : "bg-white/80 border-orange-300/50"
                } backdrop-blur-sm hover:scale-105 transition-all duration-300`}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className={`font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>{skill.name}</span>
                    <span className={`text-sm ${darkMode ? "text-orange-300" : "text-orange-600"}`}>
                      {skill.level}%
                    </span>
                  </div>
                  <div className={`w-full ${darkMode ? "bg-gray-700" : "bg-gray-200"} rounded-full h-2`}>
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
                  darkMode ? "bg-white/10 border-orange-500/30" : "bg-white/80 border-orange-200"
                } backdrop-blur-sm hover:scale-105 transition-all duration-300 group overflow-hidden`}
              >
                <CardHeader className="p-0">
                  <div className="relative h-48 bg-gradient-to-br from-orange-600 to-red-600 flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="relative z-10 text-center">
                      <Cloud className="w-16 h-16 text-white mb-2 mx-auto" />
                      <h3 className="text-white font-bold text-lg">{project.title}</h3>
                    </div>
                    <div className="absolute top-4 right-4 flex gap-2">
                      <Badge className="bg-white/20 text-white border-white/30">{project.duration}</Badge>
                    </div>
                  </div>
                  <div className="p-6">
                    <CardTitle className={`${darkMode ? "text-orange-300" : "text-orange-600"} mb-3`}>
                      {project.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className={`${darkMode ? "text-gray-300" : "text-gray-600"} mb-4 leading-relaxed`}>
                    {project.description}
                  </p>

                  {/* Project Metrics */}
                  <div className="grid grid-cols-2 gap-4 mb-4 p-4 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-lg">
                    {Object.entries(project.metrics).map(([key, value]) => (
                      <div key={key} className="text-center">
                        <div className={`text-lg font-bold ${darkMode ? "text-orange-300" : "text-orange-600"}`}>
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
                            ? "bg-orange-500/20 text-orange-200 border-orange-500/30"
                            : "bg-orange-100 text-orange-700 border-orange-200"
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
                darkMode ? "bg-white/10 border-orange-500/30" : "bg-white/80 border-orange-200"
              } backdrop-blur-sm hover:scale-105 transition-all duration-300`}
            >
              <CardHeader>
                <CardTitle className={`${darkMode ? "text-orange-300" : "text-orange-600"} flex items-center gap-2`}>
                  <Briefcase className="w-5 h-5" />
                  Professional Experience
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border-l-2 border-orange-500 pl-4 relative">
                  <div className="absolute -left-2 top-0 w-4 h-4 bg-orange-500 rounded-full"></div>
                  <h4 className={`font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
                    Senior Cloud Architect
                  </h4>
                  <p className={`${darkMode ? "text-orange-200" : "text-orange-600"} text-sm`}>
                    CloudScale Technologies • 2022-Present
                  </p>
                  <p className={`${darkMode ? "text-gray-300" : "text-gray-600"} text-sm mt-2`}>
                    Leading cloud transformation initiatives for enterprise clients. Designed multi-cloud architectures
                    serving 1M+ users with 99.9% uptime.
                  </p>
                </div>
                <div className="border-l-2 border-red-500 pl-4 relative">
                  <div className="absolute -left-2 top-0 w-4 h-4 bg-red-500 rounded-full"></div>
                  <h4 className={`font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>DevOps Team Lead</h4>
                  <p className={`${darkMode ? "text-red-200" : "text-red-600"} text-sm`}>
                    TechFlow Solutions • 2020-2022
                  </p>
                  <p className={`${darkMode ? "text-gray-300" : "text-gray-600"} text-sm mt-2`}>
                    Led team of 10 DevOps engineers building CI/CD pipelines. Implemented infrastructure automation
                    reducing deployment time by 80%.
                  </p>
                </div>
                <div className="border-l-2 border-pink-500 pl-4 relative">
                  <div className="absolute -left-2 top-0 w-4 h-4 bg-pink-500 rounded-full"></div>
                  <h4 className={`font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>Cloud Engineer</h4>
                  <p className={`${darkMode ? "text-pink-200" : "text-pink-600"} text-sm`}>
                    StartupCloud Inc • 2018-2020
                  </p>
                  <p className={`${darkMode ? "text-gray-300" : "text-gray-600"} text-sm mt-2`}>
                    Built scalable cloud infrastructure on AWS and Azure. Implemented monitoring solutions and automated
                    deployment processes.
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
                      Certified Kubernetes Administrator
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
                      DevOps Excellence Award
                    </h4>
                    <p className={`${darkMode ? "text-gray-300" : "text-gray-600"} text-sm`}>
                      Best Infrastructure Automation - CloudTech Summit 2022
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Star className="w-5 h-5 text-yellow-400 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className={`font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
                      Open Source Contributor
                    </h4>
                    <p className={`${darkMode ? "text-gray-300" : "text-gray-600"} text-sm`}>
                      Terraform Provider Maintainer - 3k+ GitHub stars
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Star className="w-5 h-5 text-yellow-400 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className={`font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
                      Tech Community Leader
                    </h4>
                    <p className={`${darkMode ? "text-gray-300" : "text-gray-600"} text-sm`}>
                      DevOps meetup team lead, spoke at 15+ conferences
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Contact Section */}
        <div className="text-center">
          <div className="relative p-12 rounded-3xl bg-gradient-to-br from-orange-600/20 to-red-600/20 backdrop-blur-sm border border-orange-500/30 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-600/10 to-red-600/10 animate-pulse" />
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-3">
                <Rocket className="w-8 h-8 text-orange-400" />
                Let's Build Scalable Infrastructure
              </h2>
              <p className={`${darkMode ? "text-gray-300" : "text-gray-600"} mb-8 max-w-2xl mx-auto leading-relaxed`}>
                Ready to transform your infrastructure with cloud-native solutions and DevOps best practices? Let's
                connect and discuss how we can build scalable, reliable systems together.
              </p>
              <div className="flex flex-wrap justify-center gap-6">
                <a
                  href="mailto:bharani@hackconnect.com"
                  className={`flex items-center gap-2 px-6 py-3 rounded-full ${
                    darkMode
                      ? "bg-orange-600/20 text-orange-300 hover:bg-orange-600/30"
                      : "bg-orange-100 text-orange-600 hover:bg-orange-200"
                  } transition-all duration-300 hover:scale-105 backdrop-blur-sm border ${
                    darkMode ? "border-orange-500/30" : "border-orange-200"
                  }`}
                >
                  <Mail className="w-5 h-5" />
                  <span>bharanin.23csd@kongu.edu</span>
                </a>
                <a
                  href="tel:+919876543215"
                  className={`flex items-center gap-2 px-6 py-3 rounded-full ${
                    darkMode
                      ? "bg-green-600/20 text-green-300 hover:bg-green-600/30"
                      : "bg-green-100 text-green-600 hover:bg-green-200"
                  } transition-all duration-300 hover:scale-105 backdrop-blur-sm border ${
                    darkMode ? "border-green-500/30" : "border-green-200"
                  }`}
                >
                  <Phone className="w-5 h-5" />
                  <span>+91 79045 80284</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
