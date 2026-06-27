"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Mail, Phone, Clock, MapPin, CheckCircle, Shield, FileText, AlertTriangle } from "lucide-react"
import Link from "next/link"

export default function ContactPrivacyTeam() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    priority: "",
    message: "",
    requestType: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [ticketId, setTicketId] = useState("")

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const generatedTicketId = `PRT-${Date.now().toString().slice(-6)}`
    setTicketId(generatedTicketId)
    setIsSubmitted(true)
    setIsSubmitting(false)
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-white mb-2">Request Submitted Successfully</h1>
              <p className="text-slate-300">Your privacy concern has been received and is being processed</p>
            </div>

            <Card className="bg-slate-800 border-slate-700 mb-6">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="bg-slate-700 rounded-lg p-4 mb-4">
                    <p className="text-sm text-slate-400 mb-1">Your Ticket ID</p>
                    <p className="text-2xl font-mono font-bold text-white">{ticketId}</p>
                  </div>
                  <p className="text-slate-300 text-sm">Please save this ticket ID for your records</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                    <span className="text-slate-300">Status</span>
                    <Badge className="bg-yellow-600 text-white">Under Review</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                    <span className="text-slate-300">Priority</span>
                    <Badge variant="outline" className="border-slate-500 text-slate-300">
                      {formData.priority || "Standard"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                    <span className="text-slate-300">Expected Response</span>
                    <span className="text-white">
                      {formData.priority === "urgent"
                        ? "24 hours"
                        : formData.priority === "high"
                          ? "48 hours"
                          : "3-5 business days"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-white mb-2">What Happens Next?</h3>
                  <ul className="space-y-2 text-sm text-slate-300">
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                      Initial review within 24 hours
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                      Investigation and analysis
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                      Response with resolution
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-white mb-2">Need Immediate Help?</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-slate-300">
                      <Phone className="h-4 w-4 mr-2 text-red-400" />
                      <span>Emergency: +1-800-PRIVACY</span>
                    </div>
                    <div className="flex items-center text-slate-300">
                      <Mail className="h-4 w-4 mr-2 text-blue-400" />
                      <span>urgent@hackconnect.com</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="text-center">
              <Link href="/privacy">
                <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Privacy Policy
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/privacy" className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Privacy Policy
            </Link>
            <h1 className="text-4xl font-bold text-white mb-2">Contact Privacy Team</h1>
            <p className="text-slate-300 text-lg">Get help with privacy concerns, data requests, or policy questions</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-blue-400" />
                    Privacy Support Request
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Personal Information */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName" className="text-slate-300">
                          First Name *
                        </Label>
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange("firstName", e.target.value)}
                          className="bg-slate-700 border-slate-600 text-white"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName" className="text-slate-300">
                          Last Name *
                        </Label>
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange("lastName", e.target.value)}
                          className="bg-slate-700 border-slate-600 text-white"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email" className="text-slate-300">
                          Email Address *
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          className="bg-slate-700 border-slate-600 text-white"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone" className="text-slate-300">
                          Phone Number
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          className="bg-slate-700 border-slate-600 text-white"
                        />
                      </div>
                    </div>

                    {/* Request Details */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="requestType" className="text-slate-300">
                          Request Type *
                        </Label>
                        <Select
                          value={formData.requestType}
                          onValueChange={(value) => handleInputChange("requestType", value)}
                        >
                          <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                            <SelectValue placeholder="Select request type" />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-700 border-slate-600">
                            <SelectItem value="data-access">Data Access Request</SelectItem>
                            <SelectItem value="data-deletion">Data Deletion Request</SelectItem>
                            <SelectItem value="data-correction">Data Correction</SelectItem>
                            <SelectItem value="privacy-concern">Privacy Concern</SelectItem>
                            <SelectItem value="policy-question">Policy Question</SelectItem>
                            <SelectItem value="security-incident">Security Incident</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="priority" className="text-slate-300">
                          Priority Level *
                        </Label>
                        <Select
                          value={formData.priority}
                          onValueChange={(value) => handleInputChange("priority", value)}
                        >
                          <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-700 border-slate-600">
                            <SelectItem value="low">Low - General inquiry</SelectItem>
                            <SelectItem value="standard">Standard - Regular request</SelectItem>
                            <SelectItem value="high">High - Important matter</SelectItem>
                            <SelectItem value="urgent">Urgent - Security concern</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="subject" className="text-slate-300">
                        Subject *
                      </Label>
                      <Input
                        id="subject"
                        value={formData.subject}
                        onChange={(e) => handleInputChange("subject", e.target.value)}
                        className="bg-slate-700 border-slate-600 text-white"
                        placeholder="Brief description of your request"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="message" className="text-slate-300">
                        Detailed Message *
                      </Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => handleInputChange("message", e.target.value)}
                        className="bg-slate-700 border-slate-600 text-white min-h-[120px]"
                        placeholder="Please provide detailed information about your privacy request or concern..."
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      {isSubmitting ? "Submitting Request..." : "Submit Privacy Request"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Information & Resources */}
            <div className="space-y-6">
              {/* Contact Information */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Mail className="h-5 w-5 text-blue-400 mt-0.5" />
                    <div>
                      <p className="text-white font-medium">Email</p>
                      <p className="text-slate-300 text-sm">privacy@hackconnect.com</p>
                      <p className="text-slate-400 text-xs">Response within 48 hours</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Phone className="h-5 w-5 text-green-400 mt-0.5" />
                    <div>
                      <p className="text-white font-medium">Phone</p>
                      <p className="text-slate-300 text-sm">+1 (555) 123-PRIV</p>
                      <p className="text-slate-400 text-xs">Mon-Fri, 9 AM - 6 PM EST</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Clock className="h-5 w-5 text-yellow-400 mt-0.5" />
                    <div>
                      <p className="text-white font-medium">Response Time</p>
                      <p className="text-slate-300 text-sm">Standard: 3-5 business days</p>
                      <p className="text-slate-400 text-xs">Urgent: Within 24 hours</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-red-400 mt-0.5" />
                    <div>
                      <p className="text-white font-medium">Mailing Address</p>
                      <p className="text-slate-300 text-sm">
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

              {/* Urgent Hotline */}
              <Card className="bg-gradient-to-r from-red-900/20 to-orange-900/20 border-red-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertTriangle className="h-5 w-5 text-red-400" />
                    <h3 className="font-semibold text-white">Urgent Privacy Hotline</h3>
                  </div>
                  <p className="text-slate-300 text-sm mb-3">For immediate privacy emergencies or security breaches</p>
                  <div className="bg-red-900/30 rounded-lg p-3">
                    <p className="text-red-300 font-mono text-lg">+1-800-PRIVACY</p>
                    <p className="text-red-400 text-xs">Available 24/7</p>
                  </div>
                </CardContent>
              </Card>

              {/* Additional Resources */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Additional Resources</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link href="/privacy" className="flex items-center space-x-2 text-blue-400 hover:text-blue-300">
                    <FileText className="h-4 w-4" />
                    <span>Privacy Policy</span>
                  </Link>
                  <Link
                    href="/privacy/data-request"
                    className="flex items-center space-x-2 text-blue-400 hover:text-blue-300"
                  >
                    <FileText className="h-4 w-4" />
                    <span>Data Request Form</span>
                  </Link>
                  <Link href="/terms" className="flex items-center space-x-2 text-blue-400 hover:text-blue-300">
                    <FileText className="h-4 w-4" />
                    <span>Terms of Service</span>
                  </Link>
                  <Link href="/help" className="flex items-center space-x-2 text-blue-400 hover:text-blue-300">
                    <FileText className="h-4 w-4" />
                    <span>Help Center</span>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
