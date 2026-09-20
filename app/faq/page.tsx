"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  Phone,
  Users,
  Settings,
  Shield,
  Code,
  Trophy,
  Home,
  HelpCircle,
} from "lucide-react"
import Link from "next/link"
import { HamburgerMenu } from "@/components/hamburger-menu"

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [openItems, setOpenItems] = useState<number[]>([])

  const toggleItem = (index: number) => {
    setOpenItems((prev) => (prev.includes(index) ? prev.filter((item) => item !== index) : [...prev, index]))
  }

  const faqCategories = [
    {
      title: "Getting Started",
      icon: <Code className="w-5 h-5 text-blue-400" />,
      questions: [
        {
          question: "How do I create an account on HackConnect?",
          answer:
            "You can create an account by clicking the 'Sign Up' button on the homepage and filling out the registration form with your name, email, and password. Once registered, you'll have access to all platform features.",
        },
        {
          question: "What is HackConnect and how does it work?",
          answer:
            "HackConnect is a platform that connects developers, designers, and innovators for hackathons and collaborative projects. You can join teams, participate in hackathons, showcase your projects, and network with like-minded individuals.",
        },
        {
          question: "Is HackConnect free to use?",
          answer:
            "Yes, HackConnect is completely free to use. You can create an account, join teams, participate in hackathons, and access all basic features without any cost.",
        },
        {
          question: "How do I complete my profile?",
          answer:
            "After signing up, go to your profile page and add your skills, bio, portfolio links, and project experience. A complete profile helps you connect with better teams and opportunities.",
        },
      ],
    },
    {
      title: "Teams & Collaboration",
      icon: <Users className="w-5 h-5 text-purple-400" />,
      questions: [
        {
          question: "How do I find and join a team?",
          answer:
            "Navigate to the 'Find Teams' section where you can browse available teams, filter by skills or project type, and send join requests. Team leaders will review and approve your request.",
        },
        {
          question: "Can I create my own team?",
          answer:
            "Go to the 'Create Team' page, fill in your team details, specify the skills you're looking for, and start recruiting members. You can manage team settings and member requests from your team dashboard.",
        },
        {
          question: "What if I want to leave a team?",
          answer:
            "You can leave a team at any time by going to your team page and clicking the 'Leave Team' button. Make sure to communicate with your team members before leaving, especially during active projects.",
        },
        {
          question: "How many team members can I have?",
          answer:
            "Team size limits depend on the specific hackathon or project requirements. Generally, teams can have 2-6 members, but check individual hackathon rules for specific limits.",
        },
      ],
    },
    {
      title: "Hackathons",
      icon: <Trophy className="w-5 h-5 text-yellow-400" />,
      questions: [
        {
          question: "How do I find hackathons to participate in?",
          answer:
            "Visit the 'Hackathons' section to browse upcoming events. You can filter by date, theme, difficulty level, and location. Each hackathon page contains detailed information about rules, prizes, and registration.",
        },
        {
          question: "Can I participate in multiple hackathons simultaneously?",
          answer:
            "Yes, you can register for multiple hackathons, but make sure you can commit the required time and effort to each event. Some hackathons may have overlapping dates.",
        },
        {
          question: "What happens after I submit my project?",
          answer:
            "After submission, your project will be reviewed by judges based on the hackathon criteria. Results are typically announced within a few days to weeks, depending on the event size.",
        },
        {
          question: "Do I need to have a team before joining a hackathon?",
          answer:
            "Not necessarily. You can join a hackathon as an individual and find team members through the platform, or you can form a team beforehand. Many hackathons also have team formation sessions.",
        },
      ],
    },
    {
      title: "Account & Settings",
      icon: <Settings className="w-5 h-5 text-green-400" />,
      questions: [
        {
          question: "How do I change my password?",
          answer:
            "Go to your profile settings, click on 'Security', and select 'Change Password'. You'll need to enter your current password and then your new password twice for confirmation.",
        },
        {
          question: "Can I update my email address?",
          answer:
            "Yes, you can update your email address in the account settings. You'll receive a verification email at your new address to confirm the change.",
        },
        {
          question: "How do I delete my account?",
          answer:
            "If you wish to delete your account, please contact our support team. Account deletion is permanent and cannot be undone, so make sure to download any important data first.",
        },
        {
          question: "Why am I not receiving email notifications?",
          answer:
            "Check your email settings in your profile to ensure notifications are enabled. Also check your spam folder, and make sure to add our domain to your email whitelist.",
        },
      ],
    },
    {
      title: "Safety & Security",
      icon: <Shield className="w-5 h-5 text-red-400" />,
      questions: [
        {
          question: "How do you protect my personal information?",
          answer:
            "We use industry-standard encryption and security measures to protect your data. We never share your personal information with third parties without your consent. Read our Privacy Policy for detailed information.",
        },
        {
          question: "What should I do if I encounter inappropriate behavior?",
          answer:
            "Report any inappropriate behavior immediately using the report button on user profiles or contact our support team. We take all reports seriously and will investigate promptly.",
        },
        {
          question: "Is my project intellectual property protected?",
          answer:
            "You retain all rights to your intellectual property. However, be mindful of what you share publicly on the platform. Consider using private repositories for sensitive code until you're ready to share.",
        },
        {
          question: "How do I report a bug or security issue?",
          answer:
            "For security issues, please contact our security team directly at security@hackconnect.dev. For general bugs, use the feedback form or contact support with detailed information about the issue.",
        },
      ],
    },
    {
      title: "Technical Support",
      icon: <MessageCircle className="w-5 h-5 text-indigo-400" />,
      questions: [
        {
          question: "The website is loading slowly. What can I do?",
          answer:
            "Try clearing your browser cache, disabling browser extensions, or switching to a different browser. If the issue persists, it might be a temporary server issue - please try again later or contact support.",
        },
        {
          question: "I can't upload my project files. What's wrong?",
          answer:
            "Check that your files are within the size limit (usually 10MB per file) and in supported formats. Ensure you have a stable internet connection. If problems continue, try uploading files one at a time.",
        },
        {
          question: "Why can't I see my team members' messages?",
          answer:
            "This could be a browser cache issue or a temporary sync problem. Try refreshing the page, clearing your browser cache, or logging out and back in. Contact support if the issue persists.",
        },
        {
          question: "The mobile app isn't working properly. How do I fix it?",
          answer:
            "Try updating the app to the latest version, restarting your device, or reinstalling the app. Make sure you have a stable internet connection and sufficient storage space on your device.",
        },
      ],
    },
  ]

  const filteredFAQs = faqCategories
    .map((category) => ({
      ...category,
      questions: category.questions.filter(
        (q) =>
          q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          q.answer.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    }))
    .filter((category) => category.questions.length > 0)

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
          <Link href="/help" className="text-gray-300 hover:text-blue-400 flex items-center gap-2">
            <HelpCircle className="w-4 h-4" />
            Help
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
          <Badge className="mb-6 bg-blue-500/20 text-blue-400 border-blue-500/30">
            <HelpCircle className="w-4 h-4 mr-2" />
            Frequently Asked Questions
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            FAQ
          </h1>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            Find quick answers to the most common questions about HackConnect. Can't find what you're looking for?
            Contact our support team.
          </p>

          {/* Search */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search FAQ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-4 text-lg bg-gray-900/50 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500 rounded-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          {filteredFAQs.length === 0 ? (
            <div className="text-center py-12">
              <HelpCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No results found</h3>
              <p className="text-gray-500">Try adjusting your search terms or browse all categories below.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {filteredFAQs.map((category, categoryIndex) => (
                <div key={categoryIndex}>
                  <div className="flex items-center gap-3 mb-6">
                    {category.icon}
                    <h2 className="text-2xl font-bold text-white">{category.title}</h2>
                  </div>

                  <div className="space-y-4">
                    {category.questions.map((faq, faqIndex) => {
                      const itemIndex = categoryIndex * 100 + faqIndex
                      const isOpen = openItems.includes(itemIndex)

                      return (
                        <Card key={faqIndex} className="bg-gray-900 border-gray-800">
                          <CardHeader
                            className="cursor-pointer hover:bg-gray-800/50 transition-colors"
                            onClick={() => toggleItem(itemIndex)}
                          >
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-white text-lg font-medium">{faq.question}</CardTitle>
                              {isOpen ? (
                                <ChevronUp className="w-5 h-5 text-blue-400" />
                              ) : (
                                <ChevronDown className="w-5 h-5 text-gray-400" />
                              )}
                            </div>
                          </CardHeader>
                          {isOpen && (
                            <CardContent className="pt-0">
                              <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                            </CardContent>
                          )}
                        </Card>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-2xl p-12 border border-gray-800/50">
          <h2 className="text-3xl font-bold mb-4">Still have questions?</h2>
          <p className="text-xl text-gray-400 mb-8">
            Can't find the answer you're looking for? Our support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <MessageCircle className="w-4 h-4 mr-2" />
                Contact Support
              </Button>
            </Link>
            <Link href="/help">
              <Button variant="outline" className="bg-transparent border-gray-600 text-white hover:bg-gray-800">
                <HelpCircle className="w-4 h-4 mr-2" />
                Help Center
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 bg-gray-900 text-center">
        <p className="text-gray-400">© 2026 HackConnect. Here to help you succeed.</p>
      </footer>
    </div>
  )
}
