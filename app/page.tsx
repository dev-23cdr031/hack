import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Trophy, Code, Zap, Globe, ArrowRight, Compass, Shield, Clock, Award } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function HomePage() {

  const features = [
    {
      icon: <Compass className="w-8 h-8 text-blue-400" />,
      title: "Discover Hackathons",
      description: "Find exciting hackathons that match your interests and skill level from around the world",
    },
    {
      icon: <Users className="w-8 h-8 text-purple-400" />,
      title: "Form Dream Teams",
      description: "Connect with talented developers and build amazing projects together",
    },
    {
      icon: <Trophy className="w-8 h-8 text-yellow-400" />,
      title: "Win Big Prizes",
      description: "Compete for amazing prizes, recognition, and career opportunities",
    },
    {
      icon: <Code className="w-8 h-8 text-green-400" />,
      title: "Learn & Grow",
      description: "Enhance your skills and learn cutting-edge technologies through hands-on experience",
    },
  ]

  const benefits = [
    {
      icon: <Shield className="w-6 h-6 text-blue-400" />,
      title: "Secure Platform",
      description: "Your data and projects are protected with enterprise-grade security",
    },
    {
      icon: <Clock className="w-6 h-6 text-green-400" />,
      title: "24/7 Support",
      description: "Get help whenever you need it with our round-the-clock support team",
    },
    {
      icon: <Award className="w-6 h-6 text-purple-400" />,
      title: "Verified Events",
      description: "All hackathons are verified and vetted for quality and legitimacy",
    },
  ]

  const stats = [
    { number: "15K+", label: "Active Developers", color: "text-blue-400" },
    { number: "750+", label: "Hackathons Hosted", color: "text-purple-400" },
    { number: "$3.2M+", label: "Prizes Awarded", color: "text-green-400" },
    { number: "65+", label: "Countries", color: "text-yellow-400" },
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="flex justify-between items-center gap-3 p-4 sm:p-6 md:px-12 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-800/50">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <Image
            src="/hackconnect-logo-new.png"
            alt="HackConnect Logo"
            width={36}
            height={36}
            className="rounded-md shadow-[0_0_20px_rgba(99,102,241,0.35)] flex-shrink-0 sm:w-10 sm:h-10"
            priority
          />
          <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent truncate">
            HackConnect
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          <Link href="/get-started" className="hidden md:block">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transition-all">
              Get Started
            </Button>
          </Link>
          <Link href="/get-started" className="md:hidden">
            <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transition-all">
              Get Started
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-indigo-900/20"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent"></div>

        <div className="relative max-w-7xl mx-auto px-6 py-20 md:py-32">
          <div className="text-center">
            <Badge className="mb-8 bg-blue-500/20 text-blue-400 border-blue-500/30 px-4 py-2 text-sm font-medium">
              <Zap className="w-4 h-4 mr-2" />
              Trusted by 15,000+ Developers Worldwide
            </Badge>

            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent leading-tight">
              Where Innovation
              <br />
              Meets Collaboration
            </h1>

            <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              Join the world's largest hackathon platform. Discover amazing events, form winning teams, and build the
              future with developers from around the globe.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <Link href="/hackathons">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold transition-all transform hover:scale-105"
                >
                  <Compass className="w-5 h-5 mr-2" />
                  Explore Hackathons
                </Button>
              </Link>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 bg-gray-900/30 backdrop-blur-sm rounded-lg p-4 border border-gray-800/50"
                >
                  {benefit.icon}
                  <div className="text-left">
                    <h3 className="font-semibold text-white text-sm">{benefit.title}</h3>
                    <p className="text-gray-400 text-xs">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Hero Image */}
            <div className="relative max-w-5xl mx-auto">
              <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 shadow-2xl">
                <Image
                  src="/team-collaboration.png"
                  alt="HackConnect Platform Preview - Developers collaborating on innovative projects"
                  width={1000}
                  height={600}
                  className="w-full h-auto"
                  sizes="(min-width: 1024px) 80vw, 100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-black/50 backdrop-blur-sm rounded-lg p-4">
                    <p className="text-white text-sm font-medium">Real-time collaboration tools for hackathon teams</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-gray-900/50 to-gray-800/50 border-y border-gray-800/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Trusted by the Global Developer Community</h2>
            <p className="text-gray-400 text-lg">Join thousands of developers who are already building the future</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className={`text-4xl md:text-5xl font-bold ${stat.color} mb-2`}>{stat.number}</div>
                <div className="text-gray-400 text-lg font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Everything You Need to
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {" "}
                Succeed
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              From discovering the perfect hackathon to forming winning teams, HackConnect provides all the tools you
              need to excel.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 hover:border-blue-500/50 transition-all duration-300 transform hover:scale-105"
              >
                <CardHeader className="pb-4">
                  <div className="mb-4 p-3 bg-gray-800/50 rounded-lg w-fit">{feature.icon}</div>
                  <CardTitle className="text-white text-xl font-bold">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-400 text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gradient-to-br from-gray-900/30 to-gray-800/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              How It{" "}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Works</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Get started in minutes and join the global hackathon community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Globe className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">1. Discover</h3>
              <p className="text-gray-400 text-lg leading-relaxed">
                Browse through hundreds of verified hackathons and find ones that match your interests, skills, and
                schedule.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">2. Connect</h3>
              <p className="text-gray-400 text-lg leading-relaxed">
                Join existing teams or create your own. Connect with developers who complement your skills and share
                your vision.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-green-600 to-green-700 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Trophy className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">3. Build & Win</h3>
              <p className="text-gray-400 text-lg leading-relaxed">
                Collaborate using our built-in tools, build amazing projects, and compete for prizes and recognition.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-t border-gray-800/50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Start Your
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {" "}
              Journey?
            </span>
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            Join thousands of developers who are already building the future together. Your next big breakthrough is
            just one hackathon away.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/auth/signup">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold transition-all transform hover:scale-105"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/hackathons">
              <Button
                variant="outline"
                size="lg"
                className="bg-transparent border-gray-600 text-white hover:bg-gray-800 px-8 py-4 text-lg font-semibold transition-all"
              >
                <Compass className="w-5 h-5 mr-2" />
                Explore Hackathons
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Image
                  src="/hackconnect-logo-new.png"
                  alt="HackConnect Logo"
                  width={40}
                  height={40}
                  className="rounded-md shadow-[0_0_20px_rgba(99,102,241,0.35)]"
                />
                <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  HackConnect
                </div>
              </div>
              <p className="text-gray-400 mb-4 leading-relaxed">
                Connecting developers worldwide through hackathons and collaboration.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Platform</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/hackathons" className="hover:text-white transition-colors">
                    Hackathons
                  </Link>
                </li>
                <li>
                  <Link href="/teams" className="hover:text-white transition-colors">
                    Teams
                  </Link>
                </li>
                <li>
                  <Link href="/messages" className="hover:text-white transition-colors">
                    Messages
                  </Link>
                </li>
                <li>
                  <Link href="/profile" className="hover:text-white transition-colors">
                    Profile
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/about" className="hover:text-white transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/services" className="hover:text-white transition-colors">
                    Services
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/help" className="hover:text-white transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/community" className="hover:text-white transition-colors">
                    Community
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2026 HackConnect. All rights reserved. Built with ❤️ for the developer community.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
