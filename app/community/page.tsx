"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Search,
  Users,
  MessageCircle,
  Calendar,
  Trophy,
  Star,
  MapPin,
  Clock,
  ExternalLink,
  Heart,
  Share2,
  Code,
  Globe,
  Award,
  TrendingUp,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { HamburgerMenu } from "@/components/hamburger-menu"

export default function CommunityPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("overview")

  const communityStats = [
    { number: "15,247", label: "Active Members", icon: <Users className="w-5 h-5" />, color: "text-blue-400" },
    { number: "2,543", label: "Teams Formed", icon: <Users className="w-5 h-5" />, color: "text-purple-400" },
    { number: "847", label: "Projects Built", icon: <Code className="w-5 h-5" />, color: "text-green-400" },
    { number: "156", label: "Countries", icon: <Globe className="w-5 h-5" />, color: "text-yellow-400" },
  ]

  const featuredMembers = [
    {
      name: "Dev Dharrshan",
      role: "Full Stack Developer",
      company: "KEC",
      avatar: "/placeholder.svg?height=80&width=80",
      skills: ["React", "Node.js", "Python", "AI/ML"],
      projects: 12,
      hackathons: 8,
      achievements: ["Winner - AI Hackathon 2024", "Top Contributor"],
      location: "KEC, Erode Tamilnadu",
    },
    {
      name: "Divyadharshini",
      role: "Blockchain Developer",
      company: "KEC",
      avatar: "/placeholder.svg?height=80&width=80",
      skills: ["Solidity", "Web3", "DeFi", "Smart Contracts"],
      projects: 15,
      hackathons: 11,
      achievements: ["DeFi Innovation Award", "Community Leader"],
      location: "KEC, Erode Tamilnadu",
    },
    {
      name: "Anusree",
      role: "Product Designer",
      company: "UI/UX",
      avatar: "/placeholder.svg?height=80&width=80",
      skills: ["UI/UX", "UI/UX", "Prototyping", "Design Systems"],
      projects: 9,
      hackathons: 6,
      achievements: ["Best Design Award", "Guide of the Year"],
      location: "KEC, Erode Tamilnadu",
    },
    {
      name: "Divakar",
      role: "Mobile Developer",
      company: "KEC",
      avatar: "/placeholder.svg?height=80&width=80",
      skills: ["React Native", "Flutter", "iOS", "Android"],
      projects: 18,
      hackathons: 14,
      achievements: ["Mobile Innovation Prize", "Top Performer"],
      location: "KEC, Erode Tamilnadu",
    },
  ]

  const communityGroups = [
    {
      name: "AI & Machine Learning",
      description: "Explore the latest in artificial intelligence and machine learning",
      members: 3247,
      posts: 1543,
      icon: "🤖",
      color: "bg-blue-500/10 border-blue-500/20",
    },
    {
      name: "Web Development",
      description: "Frontend, backend, and full-stack web development discussions",
      members: 5891,
      posts: 2876,
      icon: "🌐",
      color: "bg-green-500/10 border-green-500/20",
    },
    {
      name: "Blockchain & Web3",
      description: "Decentralized applications, DeFi, and blockchain technology",
      members: 2156,
      posts: 987,
      icon: "⛓️",
      color: "bg-purple-500/10 border-purple-500/20",
    },
    {
      name: "Mobile Development",
      description: "iOS, Android, and cross-platform mobile app development",
      members: 1834,
      posts: 756,
      icon: "📱",
      color: "bg-orange-500/10 border-orange-500/20",
    },
    {
      name: "DevOps & Cloud",
      description: "Infrastructure, deployment, and cloud computing solutions",
      members: 1567,
      posts: 623,
      icon: "☁️",
      color: "bg-cyan-500/10 border-cyan-500/20",
    },
    {
      name: "Data Science",
      description: "Data analysis, visualization, and scientific computing",
      members: 2341,
      posts: 1234,
      icon: "📊",
      color: "bg-pink-500/10 border-pink-500/20",
    },
  ]

  const upcomingEvents = [
    {
      title: "AI Innovation Meetup",
      date: "2024-02-20",
      time: "6:00 PM EST",
      type: "Virtual",
      attendees: 234,
      description: "Join us for an evening of AI innovation and networking",
      host: "Dev Dharrshan",
    },
    {
      title: "Web3 Workshop Series",
      date: "2024-02-22",
      time: "2:00 PM PST",
      type: "Hybrid",
      attendees: 156,
      description: "Learn about building decentralized applications",
      host: "Divyadharshini",
    },
    {
      title: "Design Systems Masterclass",
      date: "2024-02-25",
      time: "11:00 AM GMT",
      type: "Virtual",
      attendees: 189,
      description: "Master the art of creating scalable design systems",
      host: "Anusree",
    },
  ]

  const successStories = [
    {
      title: "From Hackathon to Startup: The EcoTrack Journey",
      author: "Team EcoTrack",
      date: "2024-02-10",
      readTime: "5 min read",
      likes: 234,
      comments: 45,
      image: "/placeholder.svg?height=200&width=300",
      excerpt:
        "How our environmental tracking app went from a weekend hackathon project to a funded startup with 10K+ users.",
    },
    {
      title: "Building My First AI Model at HackConnect",
      author: "Jennifer Liu",
      date: "2024-02-08",
      readTime: "3 min read",
      likes: 189,
      comments: 32,
      image: "/placeholder.svg?height=200&width=300",
      excerpt: "A beginner's journey into machine learning through collaborative hackathon projects.",
    },
    {
      title: "How I Found My Co-founder Through Team Matching",
      author: "Michael Torres",
      date: "2024-02-05",
      readTime: "4 min read",
      likes: 156,
      comments: 28,
      image: "/placeholder.svg?height=200&width=300",
      excerpt: "The story of how HackConnect's team matching algorithm helped me find the perfect business partner.",
    },
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="flex justify-between items-center gap-3 p-4 sm:p-6 md:px-12 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-800/50">
        <Link href="/" className="flex items-center gap-2 sm:gap-3 min-w-0">
          <Image src="/hackconnect-logo-new.png" alt="HackConnect Logo" width={32} height={32} className="rounded-lg flex-shrink-0 sm:w-10 sm:h-10" />
          <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent truncate">
            HackConnect
          </div>
        </Link>
        <div className="flex items-center gap-2">
          <HamburgerMenu />
          <div className="hidden md:flex gap-6">
          <Link href="/" className="text-gray-300 hover:text-blue-400 transition-colors">
            Home
          </Link>
          <Link href="/services" className="text-gray-300 hover:text-blue-400 transition-colors">
            Services
          </Link>
          <Link href="/contact" className="text-gray-300 hover:text-blue-400 transition-colors">
            Contact
          </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-6 bg-purple-500/20 text-purple-400 border-purple-500/30">
            <Users className="w-4 h-4 mr-2" />
            Growing Every Day
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Developer Community
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
            Connect with passionate developers, share knowledge, and build amazing projects together. Join our thriving
            global community of innovators.
          </p>

          {/* Search */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search members, groups, events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-4 text-lg bg-gray-900/50 border-gray-700 text-white placeholder-gray-400 focus:border-purple-500 rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Community Stats */}
        <section className="mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {communityStats.map((stat, index) => (
              <Card key={index} className="bg-gray-900/50 border-gray-800 text-center">
                <CardContent className="p-6">
                  <div className={`${stat.color} mb-2 flex justify-center`}>{stat.icon}</div>
                  <div className={`text-3xl font-bold ${stat.color} mb-1`}>{stat.number}</div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-800">
          {[
            { id: "overview", label: "Overview" },
            { id: "members", label: "Featured Members" },
            { id: "groups", label: "Groups" },
            { id: "events", label: "Events" },
            { id: "stories", label: "Success Stories" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-t-lg transition-colors ${
                activeTab === tab.id
                  ? "bg-purple-600 text-white border-b-2 border-purple-400"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Featured Members */}
        {(activeTab === "overview" || activeTab === "members") && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
              <Star className="w-8 h-8 text-yellow-400" />
              Featured Community Members
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredMembers.map((member, index) => (
                <Card key={index} className="bg-gray-900/50 border-gray-800 hover:border-purple-500/50 transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={member.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                        <p className="text-purple-400 font-medium">{member.role}</p>
                        <p className="text-gray-400 text-sm">{member.company}</p>
                        <div className="flex items-center gap-2 mt-2 text-sm text-gray-400">
                          <MapPin className="w-4 h-4" />
                          {member.location}
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2 mb-3">
                        {member.skills.slice(0, 4).map((skill, skillIndex) => (
                          <Badge key={skillIndex} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-400">{member.projects}</div>
                        <div className="text-gray-400">Projects</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-400">{member.hackathons}</div>
                        <div className="text-gray-400">Hackathons</div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-white mb-2">Recent Achievements</h4>
                      {member.achievements.map((achievement, achIndex) => (
                        <div key={achIndex} className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                          <Award className="w-3 h-3 text-yellow-400" />
                          {achievement}
                        </div>
                      ))}
                    </div>

                    <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Connect
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Community Groups */}
        {(activeTab === "overview" || activeTab === "groups") && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
              <Users className="w-8 h-8 text-blue-400" />
              Community Groups
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {communityGroups.map((group, index) => (
                <Card
                  key={index}
                  className={`${group.color} border hover:border-blue-500/50 transition-all cursor-pointer group
                  className={\`${group.color} border hover:border-blue-500/50 transition-all cursor-pointer group`}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-3xl">{group.icon}</div>
                      <Badge variant="outline" className="text-xs">
                        {group.members.toLocaleString()} members
                      </Badge>
                    </div>
                    <CardTitle className="text-white text-lg group-hover:text-blue-400 transition-colors">
                      {group.name}
                    </CardTitle>
                    <CardDescription className="text-gray-400 text-sm">{group.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                      <div className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4" />
                        {group.posts.toLocaleString()} posts
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" />
                        Active
                      </div>
                    </div>
                    <Button size="sm" className="w-full bg-gray-800 hover:bg-gray-700 text-white">
                      Join Group
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Upcoming Events */}
        {(activeTab === "overview" || activeTab === "events") && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
              <Calendar className="w-8 h-8 text-green-400" />
              Upcoming Community Events
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event, index) => (
                <Card key={index} className="bg-gray-900/50 border-gray-800 hover:border-green-500/50 transition-all">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">{event.type}</Badge>
                      <div className="flex items-center gap-1 text-sm text-gray-400">
                        <Users className="w-4 h-4" />
                        {event.attendees}
                      </div>
                    </div>
                    <CardTitle className="text-white text-lg">{event.title}</CardTitle>
                    <CardDescription className="text-gray-400">{event.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4 text-sm">
                      <div className="flex items-center gap-2 text-gray-400">
                        <Calendar className="w-4 h-4" />
                        {new Date(event.date).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <Clock className="w-4 h-4" />
                        {event.time}
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <Users className="w-4 h-4" />
                        Hosted by {event.host}
                      </div>
                    </div>
                    <Button className="w-full bg-green-600 hover:bg-green-700 text-white">RSVP Now</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Success Stories */}
        {(activeTab === "overview" || activeTab === "stories") && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
              <Trophy className="w-8 h-8 text-yellow-400" />
              Community Success Stories
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {successStories.map((story, index) => (
                <Card
                  key={index}
                  className="bg-gray-900/50 border-gray-800 hover:border-yellow-500/50 transition-all cursor-pointer group"
                >
                  <div className="aspect-video bg-gray-800 rounded-t-lg overflow-hidden">
                    <Image
                      src={story.image || "/placeholder.svg"}
                      alt={story.title}
                      width={400}
                      height={200}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors">
                      {story.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-3">{story.excerpt}</p>
                    <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                      <div className="flex items-center gap-2">
                        <Avatar className="w-6 h-6">
                          <AvatarFallback className="text-xs">
                            {story.author
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        {story.author}
                      </div>
                      <span>{story.readTime}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4 text-gray-400">
                        <div className="flex items-center gap-1">
                          <Heart className="w-4 h-4" />
                          {story.likes}
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="w-4 h-4" />
                          {story.comments}
                        </div>
                      </div>
                      <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Join Community CTA */}
        <section className="text-center bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-2xl p-12 border border-gray-800/50">
          <h2 className="text-3xl font-bold mb-4">Ready to Join Our Community?</h2>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Connect with thousands of passionate developers, share your knowledge, and build amazing projects together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                <Users className="w-4 h-4 mr-2" />
                Join Community
              </Button>
            </Link>
            <Button variant="outline" className="bg-transparent border-gray-600 text-white hover:bg-gray-800">
              <ExternalLink className="w-4 h-4 mr-2" />
              Community Guidelines
            </Button>
          </div>
        </section>
      </div>
    </div>
  )
}
