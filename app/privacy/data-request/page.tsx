"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Database, Download, Edit, Trash2, CheckCircle, FileText, Clock, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function DataRequestForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    requestType: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    accountEmail: "",
    verificationMethod: "",
    verificationValue: "",
    dataCategories: [] as string[],
    specificData: "",
    reason: "",
    additionalInfo: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [requestId, setRequestId] = useState("")

  const requestTypes = [
    {
      id: "access",
      title: "Data Access Request",
      description: "Request a copy of all personal data we have about you",
      icon: <Database className="h-8 w-8 text-blue-400" />,
      color: "bg-blue-900/20 border-blue-500/30",
      timeframe: "30 days",
    },
    {
      id: "correction",
      title: "Data Correction Request",
      description: "Request correction of inaccurate or incomplete data",
      icon: <Edit className="h-8 w-8 text-green-400" />,
      color: "bg-green-900/20 border-green-500/30",
      timeframe: "15 days",
    },
    {
      id: "deletion",
      title: "Data Deletion Request",
      description: "Request deletion of your personal data (Right to be Forgotten)",
      icon: <Trash2 className="h-8 w-8 text-red-400" />,
      color: "bg-red-900/20 border-red-500/30",
      timeframe: "30 days",
    },
    {
      id: "portability",
      title: "Data Portability Request",
      description: "Request your data in a structured, machine-readable format",
      icon: <Download className="h-8 w-8 text-purple-400" />,
      color: "bg-purple-900/20 border-purple-500/30",
      timeframe: "30 days",
    },
  ]

  const dataCategories = [
    { id: "profile", label: "Profile Information", description: "Name, email, phone, address" },
    { id: "account", label: "Account Data", description: "Login history, preferences, settings" },
    { id: "activity", label: "Activity Data", description: "Usage patterns, interactions, behavior" },
    { id: "communications", label: "Communications", description: "Messages, emails, support tickets" },
    { id: "technical", label: "Technical Data", description: "IP addresses, device info, cookies" },
    { id: "financial", label: "Financial Data", description: "Payment info, transaction history" },
    { id: "content", label: "User Content", description: "Posts, uploads, created content" },
    { id: "analytics", label: "Analytics Data", description: "Performance metrics, usage statistics" },
  ]

  const verificationMethods = [
    { id: "email", label: "Email Verification", description: "Verify via email confirmation" },
    { id: "phone", label: "Phone Verification", description: "Verify via SMS or phone call" },
    { id: "id", label: "Government ID", description: "Upload government-issued ID" },
    { id: "security", label: "Security Questions", description: "Answer account security questions" },
  ]

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      dataCategories: checked
        ? [...prev.dataCategories, categoryId]
        : prev.dataCategories.filter((id) => id !== categoryId),
    }))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const generatedRequestId = `DR-${Date.now().toString().slice(-8)}`
    setRequestId(generatedRequestId)
    setIsSubmitted(true)
    setIsSubmitting(false)
  }

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1)
  }

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  if (isSubmitted) {
    const selectedRequestType = requestTypes.find((type) => type.id === formData.requestType)

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-white mb-2">Request Submitted Successfully</h1>
              <p className="text-slate-300">Your data request has been received and is being processed</p>
            </div>

            <Card className="bg-slate-800 border-slate-700 mb-6">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="bg-slate-700 rounded-lg p-4 mb-4">
                    <p className="text-sm text-slate-400 mb-1">Request ID</p>
                    <p className="text-2xl font-mono font-bold text-white">{requestId}</p>
                  </div>
                  <p className="text-slate-300 text-sm">Please save this request ID for tracking purposes</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                    <span className="text-slate-300">Request Type</span>
                    <Badge className="bg-blue-600 text-white">{selectedRequestType?.title}</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                    <span className="text-slate-300">Status</span>
                    <Badge className="bg-yellow-600 text-white">Processing</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                    <span className="text-slate-300">Expected Completion</span>
                    <span className="text-white">{selectedRequestType?.timeframe}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-white mb-2">Processing Timeline</h3>
                  <ul className="space-y-2 text-sm text-slate-300">
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Request received and validated
                    </li>
                    <li className="flex items-center">
                      <Clock className="w-4 h-4 text-yellow-500 mr-2" />
                      Identity verification in progress
                    </li>
                    <li className="flex items-center">
                      <div className="w-4 h-4 border-2 border-slate-500 rounded-full mr-2"></div>
                      Data collection and preparation
                    </li>
                    <li className="flex items-center">
                      <div className="w-4 h-4 border-2 border-slate-500 rounded-full mr-2"></div>
                      Final review and delivery
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-white mb-2">Legal Notice</h3>
                  <div className="space-y-2 text-sm text-slate-300">
                    <p>This request is processed under:</p>
                    <ul className="space-y-1 ml-4">
                      <li>• GDPR Article 15 (Right of Access)</li>
                      <li>• CCPA Section 1798.110</li>
                      <li>• Other applicable privacy laws</li>
                    </ul>
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
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/privacy" className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Privacy Policy
            </Link>
            <h1 className="text-4xl font-bold text-white mb-2">Data Request Form</h1>
            <p className="text-slate-300 text-lg">Exercise your data rights under GDPR, CCPA, and other privacy laws</p>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center justify-center mb-8">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step <= currentStep ? "bg-blue-600 text-white" : "bg-slate-700 text-slate-400"
                  }`}
                >
                  {step}
                </div>
                {step < 4 && <div className={`w-16 h-1 mx-2 ${step < currentStep ? "bg-blue-600" : "bg-slate-700"}`} />}
              </div>
            ))}
          </div>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              {/* Step 1: Request Type Selection */}
              {currentStep === 1 && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">Select Request Type</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {requestTypes.map((type) => (
                      <Card
                        key={type.id}
                        className={`cursor-pointer transition-all ${
                          formData.requestType === type.id
                            ? `ring-2 ring-blue-500 ${type.color}`
                            : `${type.color} hover:ring-1 hover:ring-slate-500`
                        }`}
                        onClick={() => handleInputChange("requestType", type.id)}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0">{type.icon}</div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-white mb-2">{type.title}</h3>
                              <p className="text-slate-300 text-sm mb-3">{type.description}</p>
                              <Badge variant="outline" className="border-slate-500 text-slate-300">
                                {type.timeframe} to process
                              </Badge>
                            </div>
                            {formData.requestType === type.id && <CheckCircle className="h-5 w-5 text-blue-500" />}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Personal Information */}
              {currentStep === 2 && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">Personal Information</h2>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email" className="text-slate-300">
                          Your Email Address *
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

                    <div>
                      <Label htmlFor="accountEmail" className="text-slate-300">
                        Account Email (if different) *
                      </Label>
                      <Input
                        id="accountEmail"
                        type="email"
                        value={formData.accountEmail}
                        onChange={(e) => handleInputChange("accountEmail", e.target.value)}
                        className="bg-slate-700 border-slate-600 text-white"
                        placeholder="Email associated with your HackConnect account"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Identity Verification */}
              {currentStep === 3 && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">Identity Verification</h2>
                  <div className="space-y-6">
                    <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <AlertCircle className="h-5 w-5 text-yellow-400" />
                        <h3 className="font-semibold text-white">Identity Verification Required</h3>
                      </div>
                      <p className="text-yellow-200 text-sm">
                        To protect your privacy and comply with data protection laws, we need to verify your identity
                        before processing your request.
                      </p>
                    </div>

                    <div>
                      <Label className="text-slate-300 mb-4 block">Choose Verification Method *</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {verificationMethods.map((method) => (
                          <Card
                            key={method.id}
                            className={`cursor-pointer transition-all ${
                              formData.verificationMethod === method.id
                                ? "ring-2 ring-blue-500 bg-slate-700"
                                : "bg-slate-700 hover:bg-slate-600"
                            } border-slate-600`}
                            onClick={() => handleInputChange("verificationMethod", method.id)}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="font-semibold text-white">{method.label}</h4>
                                  <p className="text-sm text-slate-400">{method.description}</p>
                                </div>
                                {formData.verificationMethod === method.id && (
                                  <CheckCircle className="h-5 w-5 text-blue-500" />
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>

                    {formData.verificationMethod && (
                      <div>
                        <Label htmlFor="verificationValue" className="text-slate-300">
                          {formData.verificationMethod === "email" && "Confirmation Email"}
                          {formData.verificationMethod === "phone" && "Phone Number for SMS"}
                          {formData.verificationMethod === "id" && "ID Document Upload"}
                          {formData.verificationMethod === "security" && "Security Answer"}
                        </Label>
                        {formData.verificationMethod === "id" ? (
                          <div className="border-2 border-dashed border-slate-600 rounded-lg p-6 text-center">
                            <FileText className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                            <p className="text-slate-300 text-sm">Click to upload government-issued ID</p>
                            <p className="text-slate-400 text-xs mt-1">Supported: JPG, PNG, PDF (max 5MB)</p>
                          </div>
                        ) : (
                          <Input
                            id="verificationValue"
                            value={formData.verificationValue}
                            onChange={(e) => handleInputChange("verificationValue", e.target.value)}
                            className="bg-slate-700 border-slate-600 text-white"
                            placeholder={
                              formData.verificationMethod === "email"
                                ? "We'll send a confirmation to your email"
                                : formData.verificationMethod === "phone"
                                  ? "Enter phone number for SMS verification"
                                  : "Answer will be verified against your account"
                            }
                          />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 4: Data Categories & Details */}
              {currentStep === 4 && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">Data Categories & Details</h2>
                  <div className="space-y-6">
                    <div>
                      <Label className="text-slate-300 mb-4 block">Select Data Categories *</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {dataCategories.map((category) => (
                          <div key={category.id} className="flex items-start space-x-3 p-3 bg-slate-700 rounded-lg">
                            <Checkbox
                              id={category.id}
                              checked={formData.dataCategories.includes(category.id)}
                              onCheckedChange={(checked) => handleCategoryChange(category.id, checked as boolean)}
                              className="mt-1"
                            />
                            <div className="flex-1">
                              <Label htmlFor={category.id} className="text-white font-medium cursor-pointer">
                                {category.label}
                              </Label>
                              <p className="text-slate-400 text-sm">{category.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="specificData" className="text-slate-300">
                        Specific Data Details
                      </Label>
                      <Textarea
                        id="specificData"
                        value={formData.specificData}
                        onChange={(e) => handleInputChange("specificData", e.target.value)}
                        className="bg-slate-700 border-slate-600 text-white min-h-[100px]"
                        placeholder="Specify particular data points, date ranges, or additional details about your request..."
                      />
                    </div>

                    <div>
                      <Label htmlFor="reason" className="text-slate-300">
                        Reason for Request
                      </Label>
                      <Select value={formData.reason} onValueChange={(value) => handleInputChange("reason", value)}>
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                          <SelectValue placeholder="Select reason (optional)" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-700 border-slate-600">
                          <SelectItem value="transparency">Transparency and awareness</SelectItem>
                          <SelectItem value="accuracy">Verify data accuracy</SelectItem>
                          <SelectItem value="portability">Data portability</SelectItem>
                          <SelectItem value="deletion">Account closure</SelectItem>
                          <SelectItem value="legal">Legal requirements</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="additionalInfo" className="text-slate-300">
                        Additional Information
                      </Label>
                      <Textarea
                        id="additionalInfo"
                        value={formData.additionalInfo}
                        onChange={(e) => handleInputChange("additionalInfo", e.target.value)}
                        className="bg-slate-700 border-slate-600 text-white min-h-[80px]"
                        placeholder="Any additional context or special instructions..."
                      />
                    </div>

                    <div className="bg-slate-700 rounded-lg p-4">
                      <h3 className="font-semibold text-white mb-2">Legal Notice</h3>
                      <p className="text-slate-300 text-sm">By submitting this request, you acknowledge that:</p>
                      <ul className="text-slate-400 text-sm mt-2 space-y-1">
                        <li>• You are the data subject or authorized representative</li>
                        <li>• The information provided is accurate and complete</li>
                        <li>• False requests may result in legal consequences</li>
                        <li>• Processing may take up to 30 days as per applicable laws</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                <Button
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  variant="outline"
                  className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
                >
                  Previous
                </Button>

                {currentStep < 4 ? (
                  <Button
                    onClick={nextStep}
                    disabled={
                      (currentStep === 1 && !formData.requestType) ||
                      (currentStep === 2 &&
                        (!formData.firstName || !formData.lastName || !formData.email || !formData.accountEmail)) ||
                      (currentStep === 3 && (!formData.verificationMethod || !formData.verificationValue))
                    }
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting || formData.dataCategories.length === 0}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    {isSubmitting ? "Submitting Request..." : "Submit Data Request"}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
