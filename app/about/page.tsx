"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, Target, Zap, Heart, Home, Phone, MapPin } from "lucide-react"
import { HamburgerMenu } from "@/components/hamburger-menu"
import Link from "next/link"
import Image from "next/image"

export default function AboutPage() {
  const teamMembers = [
    {
      name: "Divya Dharshini",
      role: "Founder",
      bio: "A passionate and dedicated professional eager to learn, innovate, and contribute to impactful projects.",
      avatar: "/team/divya-dharshini.jpg",
      portfolioUrl: "/portfolio/divya-dharshini",
    },
    {
      name: "Dev Dharrshan",
      role: "Co Founder",
      bio: "Experienced backend developer specializing in scalable systems and API development.",
      avatar: "/team/dev-dharrshan.jpg",
      portfolioUrl: "/portfolio/dev-dharrshan",
    },
    {
      name: "Anusree",
      role: "CEO",
      bio: "A dedicated and innovative professional with expertise in developing intelligent, scalable applications.",
      avatar: "/team/anusree.jpg",
      portfolioUrl: "/portfolio/anusree-d",
    },
    {
      name: "Hemapriya",
      role: "Project Manager & UI/UX Designer",
      bio: "A creative thinker passionate about crafting user-friendly, visually appealing digital experiences.",
      avatar: "/team/hemapriya.jpg",
      portfolioUrl: "/portfolio/hemapriya",
    },
    {
      name: "Divakar",
      role: "Database Manager",
      bio: "A results-driven tech professional passionate about data-driven decision-making and scalable applications.",
      avatar: "/team/divakar.jpg",
      portfolioUrl: "/portfolio/dhivakar",
    },
    {
      name: "Bharani",
      role: "Cloud Solutions Architect",
      bio: "A passionate and versatile developer specializing in building scalable web applications and cloud infrastructure.",
      avatar: "/team/bharani.jpg",
      portfolioUrl: "/portfolio/bharani",
    },
  ]

  const stats = [
    { label: "Active Developers", value: "50K+", icon: Users },
    { label: "Hackathons Hosted", value: "1,200+", icon: Target },
    { label: "Teams Formed", value: "8,500+", icon: Zap },
    { label: "Projects Built", value: "15K+", icon: Heart },
  ]

  const values = [
    {
      title: "Innovation First",
      description: "We believe in pushing the boundaries of what's possible through collaborative innovation.",
      icon: "🚀",
    },
    {
      title: "Inclusive Community",
      description: "Everyone deserves a place in tech. We're building a platform that welcomes all skill levels.",
      icon: "🤝",
    },
    {
      title: "Open Source Spirit",
      description: "We embrace the open source philosophy of sharing knowledge and building together.",
      icon: "💡",
    },
    {
      title: "Global Impact",
      description: "Connecting developers worldwide to solve problems that matter to communities everywhere.",
      icon: "🌍",
    },
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="flex justify-between items-center gap-3 p-4 sm:p-6 md:px-12 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
        <Link
          href="/"
          className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent truncate"
        >
          HackConnect
        </Link>
        <div className="flex items-center gap-2">
          <HamburgerMenu />
          <div className="hidden md:flex gap-6">
          <Link href="/" className="text-gray-300 hover:text-blue-400 flex items-center gap-2">
            <Home className="w-4 h-4" />
            Home
          </Link>
          <Link href="/services" className="text-gray-300 hover:text-blue-400 flex items-center gap-2">
            <Target className="w-4 h-4" />
            Services
          </Link>
          <Link href="/contact" className="text-gray-300 hover:text-blue-400 flex items-center gap-2">
            <Phone className="w-4 h-4" />
            Contact
          </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            About HackConnect
          </h1>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            We're on a mission to democratize innovation by connecting developers, designers, and creators from around
            the world. HackConnect is more than a platform—it's a movement to build the future together.
          </p>
          <div className="mb-8 flex items-center justify-center gap-2 text-blue-300">
            <MapPin className="w-5 h-5" />
            <span>KEC, Erode Tamilnadu</span>
          </div>
          <div className="flex justify-center">
            <Image
              src="/team-collaboration.png"
              alt="Team collaboration"
              width={600}
              height={400}
              className="rounded-lg shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-blue-600/20 rounded-full">
                    <stat.icon className="w-8 h-8 text-blue-400" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Our Story
          </h2>
          <div className="space-y-8 text-lg text-gray-300 leading-relaxed">
            <p>
              HackConnect was born from a simple observation: the best innovations happen when diverse minds come
              together. In 2023, our founders were participating in a global hackathon when they realized how difficult
              it was to find the right teammates and discover exciting events.
            </p>
            <p>
              What started as a weekend project to solve our own problem quickly grew into something bigger. We saw
              developers struggling to connect, amazing hackathons going unnoticed, and brilliant ideas never seeing the
              light of day because the right people couldn't find each other.
            </p>
            <p>
              Today, HackConnect has grown into a thriving community of over 50,000 developers, designers, and
              innovators from 120+ countries. We've facilitated thousands of team formations and helped bring countless
              ideas to life. But we're just getting started.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-6 bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="bg-gray-800 border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="text-4xl">{value.icon}</div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-3">{value.title}</h3>
                      <p className="text-gray-300 leading-relaxed">{value.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Meet Our Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <Link key={index} href={member.portfolioUrl} className="block group">
                <Card className="bg-gray-800 border-gray-700 text-center hover:bg-gray-700 transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl">
                  <CardContent className="p-6">
                    <Avatar className="w-32 h-32 mx-auto mb-5 ring-2 ring-blue-400/40 shadow-xl shadow-blue-500/20">
                      <AvatarImage src={member.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="text-xl font-semibold text-white mb-1 group-hover:text-blue-400 transition-colors">
                      {member.name}
                    </h3>
                    <Badge variant="secondary" className="mb-3">
                      {member.role}
                    </Badge>
                    <p className="text-gray-300 text-sm leading-relaxed">{member.bio}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-blue-900/50 to-purple-900/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 text-white">Ready to Build the Future?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of developers who are already collaborating and innovating on HackConnect.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4">
                Join Our Community
              </Button>
            </Link>
            <Link href="/hackathons">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-black px-8 py-4 bg-transparent"
              >
                Explore Hackathons
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 bg-gray-900 text-center">
        <p className="text-gray-400">© 2026 HackConnect. Built with ❤️ by developers, for developers.</p>
      </footer>
    </div>
  )
}
