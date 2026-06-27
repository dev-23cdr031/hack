"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, Eye, Lock, Users, Database, Mail, Download, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
            <h1 className="text-4xl font-bold text-white mb-2">Privacy Policy</h1>
            <p className="text-slate-300 text-lg">Your privacy is our priority. Learn how we protect your data.</p>
            <Badge className="mt-2 bg-green-600 text-white">Last Updated: January 2024</Badge>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <Link href="/privacy/contact">
              <Card className="bg-slate-800 border-slate-700 hover:bg-slate-750 transition-colors cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-600 p-3 rounded-lg">
                      <Mail className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">Contact Privacy Team</h3>
                      <p className="text-slate-400 text-sm">Get help with privacy concerns</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/privacy/data-request">
              <Card className="bg-slate-800 border-slate-700 hover:bg-slate-750 transition-colors cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="bg-purple-600 p-3 rounded-lg">
                      <Download className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">Data Request Form</h3>
                      <p className="text-slate-400 text-sm">Access, correct, or delete your data</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Privacy Overview */}
          <Card className="bg-slate-800 border-slate-700 mb-8">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Shield className="h-5 w-5 mr-2 text-blue-400" />
                Privacy at a Glance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="bg-blue-600 p-3 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                    <Eye className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-white mb-2">Transparency</h3>
                  <p className="text-slate-400 text-sm">Clear information about data collection and usage</p>
                </div>
                <div className="text-center">
                  <div className="bg-green-600 p-3 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                    <Lock className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-white mb-2">Security</h3>
                  <p className="text-slate-400 text-sm">Industry-standard encryption and protection</p>
                </div>
                <div className="text-center">
                  <div className="bg-purple-600 p-3 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-white mb-2">Control</h3>
                  <p className="text-slate-400 text-sm">You decide how your data is used</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Content */}
          <div className="space-y-8">
            {/* Information We Collect */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Database className="h-5 w-5 mr-2 text-green-400" />
                  Information We Collect
                </CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300 space-y-4">
                <div>
                  <h4 className="font-semibold text-white mb-2">Personal Information</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Name, email address, and contact information</li>
                    <li>Profile information and preferences</li>
                    <li>Account credentials and authentication data</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">Usage Information</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>How you interact with our platform</li>
                    <li>Features you use and content you create</li>
                    <li>Device information and technical data</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">Communication Data</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Messages and communications within the platform</li>
                    <li>Support tickets and feedback</li>
                    <li>Survey responses and user research participation</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* How We Use Your Information */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">How We Use Your Information</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300 space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-white mb-2">Platform Services</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Provide and maintain our services</li>
                      <li>Process transactions and payments</li>
                      <li>Enable communication between users</li>
                      <li>Customize your experience</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Improvement & Analytics</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Analyze usage patterns and trends</li>
                      <li>Improve platform functionality</li>
                      <li>Develop new features and services</li>
                      <li>Ensure security and prevent fraud</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Sharing */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Data Sharing and Disclosure</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300 space-y-4">
                <p className="text-sm">
                  We do not sell your personal information. We may share your data in these limited circumstances:
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-white mb-2">With Your Consent</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>When you explicitly agree to sharing</li>
                      <li>For features that require data sharing</li>
                      <li>With third-party integrations you enable</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Legal Requirements</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>To comply with legal obligations</li>
                      <li>To protect rights and safety</li>
                      <li>In response to valid legal requests</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Your Rights */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Your Privacy Rights</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300 space-y-4">
                <p className="text-sm">
                  Under applicable privacy laws (GDPR, CCPA, etc.), you have the following rights:
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div>
                        <h4 className="font-semibold text-white">Right to Access</h4>
                        <p className="text-sm">Request a copy of your personal data</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <div>
                        <h4 className="font-semibold text-white">Right to Correction</h4>
                        <p className="text-sm">Update inaccurate or incomplete data</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                      <div>
                        <h4 className="font-semibold text-white">Right to Deletion</h4>
                        <p className="text-sm">Request deletion of your personal data</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                      <div>
                        <h4 className="font-semibold text-white">Right to Portability</h4>
                        <p className="text-sm">Receive your data in a portable format</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Lock className="h-5 w-5 mr-2 text-green-400" />
                  Data Security
                </CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300 space-y-4">
                <p className="text-sm">We implement comprehensive security measures to protect your data:</p>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-slate-700 p-4 rounded-lg">
                    <h4 className="font-semibold text-white mb-2">Encryption</h4>
                    <p className="text-sm">End-to-end encryption for data in transit and at rest</p>
                  </div>
                  <div className="bg-slate-700 p-4 rounded-lg">
                    <h4 className="font-semibold text-white mb-2">Access Controls</h4>
                    <p className="text-sm">Strict access controls and authentication requirements</p>
                  </div>
                  <div className="bg-slate-700 p-4 rounded-lg">
                    <h4 className="font-semibold text-white mb-2">Monitoring</h4>
                    <p className="text-sm">Continuous monitoring for security threats and breaches</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Contact Us</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300">
                <p className="text-sm mb-4">
                  If you have questions about this Privacy Policy or want to exercise your privacy rights, contact us:
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-white mb-2">Privacy Team</h4>
                    <p className="text-sm">Email: privacy@hackconnect.com</p>
                    <p className="text-sm">Phone: +1 (555) 123-PRIV</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Mailing Address</h4>
                    <p className="text-sm">
                      HackConnect Privacy Team
                      <br />
                      123 Tech Street, Suite 456
                      <br />
                      KEC, Erode Tamilnadu 94105
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
            <Link href="/privacy/contact">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 w-full sm:w-auto">
                <Mail className="h-4 w-4 mr-2" />
                Contact Privacy Team
              </Button>
            </Link>
            <Link href="/privacy/data-request">
              <Button
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-700 w-full sm:w-auto bg-transparent"
              >
                <Download className="h-4 w-4 mr-2" />
                Data Request Form
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
