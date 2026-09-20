"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  MessageCircle,
  Mail,
  Phone,
  Clock,
  Users,
  Settings,
  Shield,
  Code,
  Trophy,
  ChevronRight,
  ExternalLink,
  Calendar,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { HamburgerMenu } from "@/components/hamburger-menu"

export default function HelpPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const helpCategories = [
    {
      icon: <Code className="w-8 h-8 text-blue-400" />,
      title: "Getting Started",
      description: "Learn the basics of using HackConnect",
      articles: 12,
      color: "bg-blue-500/10 border-blue-500/20",
    },
    {
      icon: <Users className="w-8 h-8 text-purple-400" />,
      title: "Teams & Collaboration",
      description: "How to form and manage teams effectively",
      articles: 8,
      color: "bg-purple-500/10 border-purple-500/20",
    },
    {
      icon: <Trophy className="w-8 h-8 text-yellow-400" />,
      title: "Hackathons",
      description: "Everything about joining and hosting hackathons",
      articles: 15,
      color: "bg-yellow-500/10 border-yellow-500/20",
    },
    {
      icon: <Settings className="w-8 h-8 text-green-400" />,
      title: "Account Settings",
      description: "Manage your profile and preferences",
      articles: 6,
      color: "bg-green-500/10 border-green-500/20",
    },
    {
      icon: <Shield className="w-8 h-8 text-red-400" />,
      title: "Safety & Security",
      description: "Keep your account and data secure",
      articles: 9,
      color: "bg-red-500/10 border-red-500/20",
    },
    {
      icon: <MessageCircle className="w-8 h-8 text-indigo-400" />,
      title: "Technical Support",
      description: "Troubleshooting and technical issues",
      articles: 11,
      color: "bg-indigo-500/10 border-indigo-500/20",
    },
  ]

  const popularArticles = [
    {
      title: "How to create your first team",
      category: "Teams",
      views: "2.3k views",
      readTime: "3 min read",
    },
    {
      title: "Finding the right hackathon for you",
      category: "Hackathons",
      views: "1.8k views",
      readTime: "5 min read",
    },
    {
      title: "Setting up your developer profile",
      category: "Getting Started",
      views: "1.5k views",
      readTime: "4 min read",
    },
    {
      title: "Best practices for team communication",
      category: "Teams",
      views: "1.2k views",
      readTime: "6 min read",
    },
    {
      title: "Understanding hackathon judging criteria",
      category: "Hackathons",
      views: "980 views",
      readTime: "4 min read",
    },
  ]

  const supportOptions = [
    {
      icon: <MessageCircle className="w-6 h-6 text-blue-400" />,
      title: "Live Chat",
      description: "Get instant help from our support team",
      availability: "Available 24/7",
      action: "Start Chat",
      primary: true,
    },
    {
      icon: <Mail className="w-6 h-6 text-green-400" />,
      title: "Email Support",
      description: "Send us a detailed message",
      availability: "Response within 2 hours",
      action: "Send Email",
      primary: false,
    },
    {
      icon: <Phone className="w-6 h-6 text-purple-400" />,
      title: "Phone Support",
      description: "Talk to our experts directly",
      availability: "Mon-Fri, 9AM-6PM EST",
      action: "Schedule Call",
      primary: false,
    },
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-6 md:px-12 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-800/50">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/hackconnect-logo.png" alt="HackConnect Logo" width={40} height={40} className="rounded-lg" />
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            HackConnect
          </div>
        </Link>
        <div className="flex gap-6">
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
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-6 bg-blue-500/20 text-blue-400 border-blue-500/30">
            <Clock className="w-4 h-4 mr-2" />
            24/7 Support Available
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Help Center
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
            Find answers to your questions, learn how to use HackConnect effectively, and get the support you need.
          </p>

          {/* Search */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search for help articles, guides, and FAQs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-4 text-lg bg-gray-900/50 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500 rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Support Options */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center">Get Immediate Help</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {supportOptions.map((option, index) => (
              <Card
                key={index}
                className={`bg-gray-900/50 border-gray-800 hover:border-blue-500/50 transition-all ${
                  option.primary ? "ring-2 ring-blue-500/20" : ""
                }`}
              >
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-3 bg-gray-800/50 rounded-full w-fit">{option.icon}</div>
                  <CardTitle className="text-white text-xl">{option.title}</CardTitle>
                  <CardDescription className="text-gray-400">{option.description}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-sm text-gray-500 mb-4">{option.availability}</p>
                  <Button
                    className={
                      option.primary
                        ? "bg-blue-600 hover:bg-blue-700 text-white w-full"
                        : "bg-gray-800 hover:bg-gray-700 text-white w-full"
                    }
                  >
                    {option.action}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Help Categories */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Browse Help Topics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {helpCategories.map((category, index) => (
              <Card
                key={index}
                className={`${category.color} border hover:border-blue-500/50 transition-all cursor-pointer group`}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="p-3 bg-gray-800/30 rounded-lg w-fit">{category.icon}</div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors" />
                  </div>
                  <CardTitle className="text-white text-xl">{category.title}</CardTitle>
                  <CardDescription className="text-gray-400">{category.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">{category.articles} articles</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Popular Articles */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Popular Articles</h2>
          <div className="max-w-4xl mx-auto">
            <Card className="bg-gray-900/50 border-gray-800">
              <CardContent className="p-0">
                {popularArticles.map((article, index) => (
                  <div
                    key={index}
                    className="p-6 border-b border-gray-800 last:border-b-0 hover:bg-gray-800/30 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                          {article.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <Badge variant="outline" className="text-xs">
                            {article.category}
                          </Badge>
                          <span>{article.views}</span>
                          <span>{article.readTime}</span>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gray-900/50 border-gray-800 hover:border-blue-500/50 transition-all cursor-pointer group">
              <CardContent className="p-6 text-center">
                <Users className="w-8 h-8 text-blue-400 mx-auto mb-4" />
                <h3 className="font-semibold text-white mb-2">Join a Team</h3>
                <p className="text-sm text-gray-400 mb-4">Find and join existing teams</p>
                <Button size="sm" variant="outline" className="w-full bg-transparent">
                  Browse Teams
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-800 hover:border-purple-500/50 transition-all cursor-pointer group">
              <CardContent className="p-6 text-center">
                <Trophy className="w-8 h-8 text-purple-400 mx-auto mb-4" />
                <h3 className="font-semibold text-white mb-2">Find Hackathons</h3>
                <p className="text-sm text-gray-400 mb-4">Discover upcoming events</p>
                <Button size="sm" variant="outline" className="w-full bg-transparent">
                  Explore Events
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-800 hover:border-green-500/50 transition-all cursor-pointer group">
              <CardContent className="p-6 text-center">
                <Settings className="w-8 h-8 text-green-400 mx-auto mb-4" />
                <h3 className="font-semibold text-white mb-2">Account Settings</h3>
                <p className="text-sm text-gray-400 mb-4">Manage your profile</p>
                <Button size="sm" variant="outline" className="w-full bg-transparent">
                  Edit Profile
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-800 hover:border-yellow-500/50 transition-all cursor-pointer group">
              <CardContent className="p-6 text-center">
                <Calendar className="w-8 h-8 text-yellow-400 mx-auto mb-4" />
                <h3 className="font-semibold text-white mb-2">Schedule Demo</h3>
                <p className="text-sm text-gray-400 mb-4">Get a personalized walkthrough</p>
                <Button size="sm" variant="outline" className="w-full bg-transparent">
                  Book Demo
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="text-center bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-2xl p-12 border border-gray-800/50">
          <h2 className="text-3xl font-bold mb-4">Still Need Help?</h2>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Can't find what you're looking for? Our support team is here to help you succeed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <MessageCircle className="w-4 h-4 mr-2" />
              Contact Support
            </Button>
            <Button variant="outline" className="bg-transparent border-gray-600 text-white hover:bg-gray-800">
              <ExternalLink className="w-4 h-4 mr-2" />
              Community Forum
            </Button>
          </div>
        </section>
      </div>
    </div>
  )
}
