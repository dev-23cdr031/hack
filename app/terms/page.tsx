"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  FileText,
  Users,
  Shield,
  AlertTriangle,
  CheckCircle,
  Scale,
  Mail,
  Gavel,
  UserCheck,
  Ban,
  Globe,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function TermsPage() {
  const communityGuidelines = [
    {
      icon: <UserCheck className="w-6 h-6 text-green-400" />,
      title: "Be Respectful",
      description: "Treat all community members with respect and professionalism",
    },
    {
      icon: <Shield className="w-6 h-6 text-blue-400" />,
      title: "Keep It Safe",
      description: "Report inappropriate behavior and maintain a safe environment",
    },
    {
      icon: <CheckCircle className="w-6 h-6 text-purple-400" />,
      title: "Stay Authentic",
      description: "Use your real identity and provide accurate information",
    },
    {
      icon: <Ban className="w-6 h-6 text-red-400" />,
      title: "No Spam",
      description: "Avoid spam, self-promotion, and irrelevant content",
    },
  ]

  const sections = [
    {
      id: "acceptance",
      title: "Acceptance of Terms",
      icon: <CheckCircle className="w-5 h-5" />,
    },
    {
      id: "account-responsibilities",
      title: "Account Responsibilities",
      icon: <UserCheck className="w-5 h-5" />,
    },
    {
      id: "platform-use",
      title: "Platform Use",
      icon: <Globe className="w-5 h-5" />,
    },
    {
      id: "prohibited-activities",
      title: "Prohibited Activities",
      icon: <Ban className="w-5 h-5" />,
    },
    {
      id: "intellectual-property",
      title: "Intellectual Property",
      icon: <FileText className="w-5 h-5" />,
    },
    {
      id: "disclaimers",
      title: "Disclaimers",
      icon: <AlertTriangle className="w-5 h-5" />,
    },
    {
      id: "limitation-liability",
      title: "Limitation of Liability",
      icon: <Scale className="w-5 h-5" />,
    },
    {
      id: "governing-law",
      title: "Governing Law",
      icon: <Gavel className="w-5 h-5" />,
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

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-6 bg-blue-500/20 text-blue-400 border-blue-500/30">
            <Scale className="w-4 h-4 mr-2" />
            Legal Framework
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Terms of Service
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-4">
            These terms govern your use of HackConnect and outline the rights and responsibilities of all users.
          </p>
          <p className="text-sm text-gray-500">Last updated: December 1, 2024 • Effective Date: December 1, 2024</p>
        </div>

        {/* Community Guidelines */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center">Community Guidelines</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {communityGuidelines.map((guideline, index) => (
              <Card key={index} className="bg-gray-900/50 border-gray-800 text-center">
                <CardContent className="p-6">
                  <div className="mb-4 flex justify-center">{guideline.icon}</div>
                  <h3 className="font-semibold text-white mb-2">{guideline.title}</h3>
                  <p className="text-gray-400 text-sm">{guideline.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Quick Navigation */}
        <section className="mb-12">
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Quick Navigation
              </CardTitle>
              <CardDescription>Jump to any section of our terms of service</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {sections.map((section, index) => (
                  <a
                    key={index}
                    href={`#${section.id}`}
                    className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors text-gray-300 hover:text-white"
                  >
                    {section.icon}
                    <span className="text-sm">{section.title}</span>
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Terms Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Table of Contents */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Contents</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {sections.map((section, index) => (
                    <a
                      key={index}
                      href={`#${section.id}`}
                      className="block text-sm text-gray-400 hover:text-blue-400 transition-colors py-1"
                    >
                      {section.title}
                    </a>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-12">
            {/* Acceptance of Terms */}
            <section id="acceptance">
              <h2 className="text-3xl font-bold mb-6 text-white flex items-center gap-3">
                <CheckCircle className="w-8 h-8 text-green-400" />
                Acceptance of Terms
              </h2>
              <div className="space-y-6 text-gray-300 leading-relaxed">
                <p>
                  By accessing or using HackConnect ("the Platform"), you agree to be bound by these Terms of Service
                  ("Terms"). If you do not agree to these Terms, please do not use our Platform.
                </p>
                <div className="bg-blue-900/20 border border-blue-700/50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Important Notice</h3>
                  <p>
                    These Terms constitute a legally binding agreement between you and HackConnect. By creating an
                    account or using our services, you acknowledge that you have read, understood, and agree to be bound
                    by these Terms.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Eligibility</h3>
                  <p>
                    You must be at least 13 years old to use HackConnect. If you are under 18, you must have parental or
                    guardian consent to use our Platform.
                  </p>
                </div>
              </div>
            </section>

            {/* Account Responsibilities */}
            <section id="account-responsibilities">
              <h2 className="text-3xl font-bold mb-6 text-white flex items-center gap-3">
                <UserCheck className="w-8 h-8 text-blue-400" />
                Account Responsibilities
              </h2>
              <div className="space-y-6 text-gray-300 leading-relaxed">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Account Security</h3>
                  <p className="mb-4">You are responsible for:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Maintaining the confidentiality of your account credentials</li>
                    <li>All activities that occur under your account</li>
                    <li>Notifying us immediately of any unauthorized use</li>
                    <li>Using strong, unique passwords and enabling two-factor authentication</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Accurate Information</h3>
                  <p>
                    You agree to provide accurate, current, and complete information when creating your account and to
                    update such information to keep it accurate, current, and complete.
                  </p>
                </div>
                <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <AlertTriangle className="w-6 h-6 text-yellow-400" />
                    <h3 className="text-lg font-semibold text-white">Account Suspension</h3>
                  </div>
                  <p>
                    We reserve the right to suspend or terminate accounts that violate these Terms or engage in harmful
                    activities on our Platform.
                  </p>
                </div>
              </div>
            </section>

            {/* Platform Use */}
            <section id="platform-use">
              <h2 className="text-3xl font-bold mb-6 text-white flex items-center gap-3">
                <Globe className="w-8 h-8 text-purple-400" />
                Platform Use
              </h2>
              <div className="space-y-6 text-gray-300 leading-relaxed">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Permitted Uses</h3>
                  <p className="mb-4">You may use HackConnect to:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Discover and participate in hackathons</li>
                    <li>Form teams and collaborate on projects</li>
                    <li>Share knowledge and learn from the community</li>
                    <li>Network with other developers and professionals</li>
                    <li>Showcase your skills and projects</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">User Content</h3>
                  <p>
                    You retain ownership of content you create and share on HackConnect. By posting content, you grant
                    us a non-exclusive, worldwide, royalty-free license to use, display, and distribute your content on
                    the Platform.
                  </p>
                </div>
              </div>
            </section>

            {/* Prohibited Activities */}
            <section id="prohibited-activities">
              <h2 className="text-3xl font-bold mb-6 text-white flex items-center gap-3">
                <Ban className="w-8 h-8 text-red-400" />
                Prohibited Activities
              </h2>
              <div className="space-y-6 text-gray-300 leading-relaxed">
                <div className="bg-red-900/20 border border-red-700/50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Strictly Prohibited</h3>
                  <p className="mb-4">The following activities are strictly prohibited:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4 text-sm">
                    <li>Harassment, bullying, or discrimination of any kind</li>
                    <li>Posting illegal, harmful, or offensive content</li>
                    <li>Impersonating others or creating fake accounts</li>
                    <li>Spamming or sending unsolicited communications</li>
                    <li>Attempting to hack, disrupt, or compromise the Platform</li>
                    <li>Violating intellectual property rights</li>
                    <li>Sharing malicious code or viruses</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Consequences</h3>
                  <p>
                    Violation of these prohibitions may result in immediate account suspension or termination, removal
                    of content, and potential legal action.
                  </p>
                </div>
              </div>
            </section>

            {/* Intellectual Property */}
            <section id="intellectual-property">
              <h2 className="text-3xl font-bold mb-6 text-white flex items-center gap-3">
                <FileText className="w-8 h-8 text-green-400" />
                Intellectual Property
              </h2>
              <div className="space-y-6 text-gray-300 leading-relaxed">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Platform Rights</h3>
                  <p>
                    HackConnect and its original content, features, and functionality are owned by HackConnect Inc. and
                    are protected by international copyright, trademark, patent, trade secret, and other intellectual
                    property laws.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">User Content Rights</h3>
                  <p className="mb-4">
                    You retain all rights to content you create. However, you are responsible for ensuring that:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>You own or have permission to use all content you post</li>
                    <li>Your content does not infringe on others' intellectual property rights</li>
                    <li>You comply with all applicable laws and regulations</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Disclaimers */}
            <section id="disclaimers">
              <h2 className="text-3xl font-bold mb-6 text-white flex items-center gap-3">
                <AlertTriangle className="w-8 h-8 text-yellow-400" />
                Disclaimers
              </h2>
              <div className="space-y-6 text-gray-300 leading-relaxed">
                <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Service Availability</h3>
                  <p>
                    HackConnect is provided "as is" and "as available." We do not guarantee that the Platform will be
                    available at all times or free from errors, viruses, or other harmful components.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Third-Party Content</h3>
                  <p>
                    We are not responsible for the accuracy, completeness, or reliability of user-generated content or
                    third-party services integrated with our Platform.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Hackathon Outcomes</h3>
                  <p>
                    While we facilitate hackathon discovery and team formation, we are not responsible for hackathon
                    outcomes, prizes, or disputes between participants.
                  </p>
                </div>
              </div>
            </section>

            {/* Limitation of Liability */}
            <section id="limitation-liability">
              <h2 className="text-3xl font-bold mb-6 text-white flex items-center gap-3">
                <Scale className="w-8 h-8 text-purple-400" />
                Limitation of Liability
              </h2>
              <div className="space-y-6 text-gray-300 leading-relaxed">
                <div className="bg-purple-900/20 border border-purple-700/50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Liability Limits</h3>
                  <p>
                    To the maximum extent permitted by law, HackConnect shall not be liable for any indirect,
                    incidental, special, consequential, or punitive damages, including but not limited to loss of
                    profits, data, use, goodwill, or other intangible losses.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Maximum Liability</h3>
                  <p>
                    Our total liability to you for all claims arising from or relating to these Terms or your use of the
                    Platform shall not exceed the amount you paid us in the twelve months preceding the claim.
                  </p>
                </div>
              </div>
            </section>

            {/* Governing Law */}
            <section id="governing-law">
              <h2 className="text-3xl font-bold mb-6 text-white flex items-center gap-3">
                <Gavel className="w-8 h-8 text-blue-400" />
                Governing Law
              </h2>
              <div className="space-y-6 text-gray-300 leading-relaxed">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Jurisdiction</h3>
                  <p>
                    These Terms shall be governed by and construed in accordance with the laws of the State of
                    California, United States, without regard to its conflict of law provisions.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Dispute Resolution</h3>
                  <p className="mb-4">
                    Any disputes arising from these Terms or your use of the Platform shall be resolved through:
                  </p>
                  <ol className="list-decimal list-inside space-y-2 ml-4">
                    <li>Good faith negotiation between the parties</li>
                    <li>Binding arbitration if negotiation fails</li>
                    <li>
                      Courts of competent jurisdiction in KEC, Erode Tamilnadu, California (if arbitration is not applicable)
                    </li>
                  </ol>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Changes to Terms</h3>
                  <p>
                    We reserve the right to modify these Terms at any time. We will notify users of significant changes
                    via email or platform notification. Continued use of the Platform after changes constitutes
                    acceptance of the new Terms.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Contact Legal Team */}
        <section className="mt-16">
          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white mb-4">Questions About These Terms?</h2>
                <p className="text-gray-400">
                  Our legal team is available to help clarify any questions about these Terms of Service.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-white mb-3">Legal Department</h4>
                  <div className="space-y-2 text-sm text-gray-300">
                    <p>Email: legal@hackconnect.com</p>
                    <p>Phone: +1 (555) 123-4567</p>
                    <p>Response time: Within 5 business days</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-3">Mailing Address</h4>
                  <div className="space-y-1 text-sm text-gray-300">
                    <p>HackConnect Legal Department</p>
                    <p>123 Innovation Drive</p>
                    <p>KEC, Erode Tamilnadu 94105</p>
                    <p>United States</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Footer CTA */}
        <section className="mt-16 text-center bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-2xl p-12 border border-gray-800/50">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            By using HackConnect, you agree to these Terms of Service. Join our community of developers today!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Users className="w-4 h-4 mr-2" />
                Create Account
              </Button>
            </Link>
            <Button variant="outline" className="bg-transparent border-gray-600 text-white hover:bg-gray-800">
              <Mail className="w-4 h-4 mr-2" />
              Contact Legal Team
            </Button>
          </div>
        </section>
      </div>
    </div>
  )
}
