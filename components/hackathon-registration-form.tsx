"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Loader2, X } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface HackathonRegistrationFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (formData: RegistrationFormData) => Promise<void>
  hackathonId: string
  hackathonTitle: string
}

export interface RegistrationFormData {
  // Personal Information
  fullName: string
  email: string
  phone: string
  city: string
  state: string
  country: string
  dateOfBirth: string
  gender: string
  
  // Professional Information
  occupation: string
  organization: string
  experience: string
  skills: string[]
  interests: string
  portfolio: string
  github: string
  linkedin: string
  
  // Hackathon Specific
  teamStatus: string
  teamName: string
  teamSize: string
  projectIdea: string
  motivation: string
  expectations: string
  
  // Preferences & Logistics
  dietaryRestrictions: string
  tshirtSize: string
  accommodationNeeded: boolean
  specialAssistance: string
  howDidYouHear: string
  previousHackathons: string
  
  // Terms & Agreements
  agreeToTerms: boolean
  agreeToCodeOfConduct: boolean
  agreeToDataSharing: boolean
}

export function HackathonRegistrationForm({
  isOpen,
  onClose,
  onSubmit,
  hackathonId,
  hackathonTitle
}: HackathonRegistrationFormProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<RegistrationFormData>({
    // Personal Information
    fullName: "",
    email: "",
    phone: "",
    city: "",
    state: "",
    country: "",
    dateOfBirth: "",
    gender: "",
    
    // Professional Information
    occupation: "",
    organization: "",
    experience: "beginner",
    skills: [],
    interests: "",
    portfolio: "",
    github: "",
    linkedin: "",
    
    // Hackathon Specific
    teamStatus: "looking",
    teamName: "",
    teamSize: "",
    projectIdea: "",
    motivation: "",
    expectations: "",
    
    // Preferences & Logistics
    dietaryRestrictions: "",
    tshirtSize: "m",
    accommodationNeeded: false,
    specialAssistance: "",
    howDidYouHear: "",
    previousHackathons: "0",
    
    // Terms & Agreements
    agreeToTerms: false,
    agreeToCodeOfConduct: false,
    agreeToDataSharing: false
  })

  const totalSteps = 5

  const handleChange = (field: keyof RegistrationFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSkillToggle = (skill: string) => {
    setFormData(prev => {
      const currentSkills = [...prev.skills]
      if (currentSkills.includes(skill)) {
        return { ...prev, skills: currentSkills.filter(s => s !== skill) }
      } else {
        return { ...prev, skills: [...currentSkills, skill] }
      }
    })
  }

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)
      await onSubmit(formData)
      onClose()
    } catch (error) {
      console.error("Registration error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const isStepValid = () => {
    if (currentStep === 1) {
      return formData.fullName && formData.email && formData.phone
    } else if (currentStep === 2) {
      return formData.occupation && formData.experience
    } else if (currentStep === 3) {
      return formData.teamStatus && (formData.teamStatus !== "have" || formData.teamName)
    } else if (currentStep === 4) {
      return true // Optional fields
    } else if (currentStep === 5) {
      return formData.agreeToTerms && formData.agreeToCodeOfConduct
    }
    return true
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-gray-900 text-white border border-gray-800 p-0 overflow-hidden">
        <div className="sticky top-0 z-10 bg-gray-900 border-b border-gray-800">
          <DialogHeader className="p-6 pb-4">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-bold text-white">
                Register for {hackathonTitle}
              </DialogTitle>
              <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-400 hover:text-white">
                <X className="h-4 w-4" />
              </Button>
            </div>
            <DialogDescription className="text-gray-400">
              Please fill out the registration form to join this hackathon.
            </DialogDescription>
          </DialogHeader>

          {/* Progress Bar */}
          <div className="px-6 pb-4">
            <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden shadow-inner">
              <div 
                className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 h-full rounded-full transition-all duration-500 ease-out relative"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              >
                <div className="absolute inset-0 bg-white opacity-30 animate-pulse"></div>
                <div className="absolute top-0 right-0 h-full w-2 bg-white opacity-70 animate-shimmer"></div>
              </div>
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <span className={currentStep >= 1 ? "text-blue-400" : ""}>Personal</span>
              <span className={currentStep >= 2 ? "text-blue-400" : ""}>Professional</span>
              <span className={currentStep >= 3 ? "text-blue-400" : ""}>Team</span>
              <span className={currentStep >= 4 ? "text-blue-400" : ""}>Logistics</span>
              <span className={currentStep >= 5 ? "text-blue-400" : ""}>Terms</span>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 max-h-[60vh] overflow-y-auto">
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-fadeIn">
              <h3 className="text-lg font-medium text-white animate-slideInRight">Personal Information</h3>
              
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-gray-300">Full Name <span className="text-red-500">*</span></Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => handleChange("fullName", e.target.value)}
                  placeholder="Enter your full name"
                  className="bg-gray-800 border-gray-700 text-white transition-all duration-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 hover:border-gray-600 animate-slideInUp"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">Email Address <span className="text-red-500">*</span></Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="your.email@example.com"
                  className="bg-gray-800 border-gray-700 text-white"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-gray-300">Phone Number <span className="text-red-500">*</span></Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder="+1 (123) 456-7890"
                  className="bg-gray-800 border-gray-700 text-white"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth" className="text-gray-300">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleChange("dateOfBirth", e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="gender" className="text-gray-300">Gender</Label>
                  <Select value={formData.gender} onValueChange={(value) => handleChange("gender", value)}>
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700 text-white">
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="non-binary">Non-binary</SelectItem>
                      <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-gray-300">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleChange("city", e.target.value)}
                    placeholder="Your city"
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="state" className="text-gray-300">State/Province</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => handleChange("state", e.target.value)}
                    placeholder="Your state"
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="country" className="text-gray-300">Country</Label>
                <Select value={formData.country} onValueChange={(value) => handleChange("country", value)}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Select your country" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-white max-h-[300px]">
                    <SelectItem value="us">United States</SelectItem>
                    <SelectItem value="ca">Canada</SelectItem>
                    <SelectItem value="uk">United Kingdom</SelectItem>
                    <SelectItem value="au">Australia</SelectItem>
                    <SelectItem value="in">India</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Step 2: Professional Information */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-fadeIn">
              <h3 className="text-lg font-medium text-white animate-slideInRight">Professional Information</h3>
              
              <div className="space-y-2">
                <Label htmlFor="occupation" className="text-gray-300">Occupation <span className="text-red-500">*</span></Label>
                <Select value={formData.occupation} onValueChange={(value) => handleChange("occupation", value)}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Select your occupation" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-white">
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="educator">Educator</SelectItem>
                    <SelectItem value="researcher">Researcher</SelectItem>
                    <SelectItem value="entrepreneur">Entrepreneur</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="organization" className="text-gray-300">Organization/School</Label>
                <Input
                  id="organization"
                  value={formData.organization}
                  onChange={(e) => handleChange("organization", e.target.value)}
                  placeholder="Your organization or school"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-gray-300">Experience Level <span className="text-red-500">*</span></Label>
                <RadioGroup 
                  value={formData.experience} 
                  onValueChange={(value) => handleChange("experience", value)}
                  className="flex flex-col space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="beginner" id="beginner" className="text-blue-500 transition-all duration-300 hover:border-blue-400 focus:ring-2 focus:ring-blue-500/30 scale-100 hover:scale-110" />
                    <Label htmlFor="beginner" className="text-gray-300">Beginner (0-1 years)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="intermediate" id="intermediate" className="text-blue-500 transition-all duration-300 hover:border-blue-400 focus:ring-2 focus:ring-blue-500/30 scale-100 hover:scale-110" />
                    <Label htmlFor="intermediate" className="text-gray-300">Intermediate (1-3 years)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="advanced" id="advanced" className="text-blue-500 transition-all duration-300 hover:border-blue-400 focus:ring-2 focus:ring-blue-500/30 scale-100 hover:scale-110" />
                    <Label htmlFor="advanced" className="text-gray-300">Advanced (3+ years)</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="space-y-2">
                <Label className="text-gray-300">Skills (Select all that apply)</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {["Frontend", "Backend", "Mobile", "UI/UX", "DevOps", "AI/ML", "Blockchain", "IoT", "Cloud", "Data Science", "Game Dev", "Cybersecurity", "AR/VR", "Embedded Systems"].map((skill) => (
                    <div key={skill} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`skill-${skill}`} 
                        checked={formData.skills.includes(skill)}
                        onCheckedChange={() => handleSkillToggle(skill)}
                        className="text-blue-500 border-gray-600 transition-all duration-300 hover:border-blue-400 focus:ring-2 focus:ring-blue-500/30 scale-100 hover:scale-110"
                      />
                      <Label htmlFor={`skill-${skill}`} className="text-gray-300">{skill}</Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="interests" className="text-gray-300">Areas of Interest</Label>
                <Textarea
                  id="interests"
                  value={formData.interests}
                  onChange={(e) => handleChange("interests", e.target.value)}
                  placeholder="What technologies or domains are you interested in?"
                  className="bg-gray-800 border-gray-700 text-white min-h-[80px]"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="portfolio" className="text-gray-300">Portfolio URL</Label>
                  <Input
                    id="portfolio"
                    value={formData.portfolio}
                    onChange={(e) => handleChange("portfolio", e.target.value)}
                    placeholder="https://yourportfolio.com"
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="github" className="text-gray-300">GitHub Profile</Label>
                  <Input
                    id="github"
                    value={formData.github}
                    onChange={(e) => handleChange("github", e.target.value)}
                    placeholder="https://github.com/username"
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="linkedin" className="text-gray-300">LinkedIn Profile</Label>
                  <Input
                    id="linkedin"
                    value={formData.linkedin}
                    onChange={(e) => handleChange("linkedin", e.target.value)}
                    placeholder="https://linkedin.com/in/username"
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Team Information */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-fadeIn">
              <h3 className="text-lg font-medium text-white animate-slideInRight">Team Information</h3>
              
              <div className="space-y-2">
                <Label className="text-gray-300">Team Status <span className="text-red-500">*</span></Label>
                <RadioGroup 
                  value={formData.teamStatus} 
                  onValueChange={(value) => handleChange("teamStatus", value)}
                  className="flex flex-col space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="looking" id="looking" className="text-blue-500" />
                    <Label htmlFor="looking" className="text-gray-300">Looking for a team</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="have" id="have" className="text-blue-500" />
                    <Label htmlFor="have" className="text-gray-300">I already have a team</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="forming" id="forming" className="text-blue-500" />
                    <Label htmlFor="forming" className="text-gray-300">Forming a new team</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="solo" id="solo" className="text-blue-500" />
                    <Label htmlFor="solo" className="text-gray-300">Participating solo</Label>
                  </div>
                </RadioGroup>
              </div>
              
              {(formData.teamStatus === "have" || formData.teamStatus === "forming") && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="teamName" className="text-gray-300">Team Name {formData.teamStatus === "have" && <span className="text-red-500">*</span>}</Label>
                    <Input
                      id="teamName"
                      value={formData.teamName}
                      onChange={(e) => handleChange("teamName", e.target.value)}
                      placeholder="Enter your team name"
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="teamSize" className="text-gray-300">Team Size (including you)</Label>
                    <Select value={formData.teamSize} onValueChange={(value) => handleChange("teamSize", value)}>
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                        <SelectValue placeholder="Select team size" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700 text-white">
                        <SelectItem value="2">2 members</SelectItem>
                        <SelectItem value="3">3 members</SelectItem>
                        <SelectItem value="4">4 members</SelectItem>
                        <SelectItem value="5">5 members</SelectItem>
                        <SelectItem value="6+">6+ members</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="projectIdea" className="text-gray-300">Project Idea</Label>
                <Textarea
                  id="projectIdea"
                  value={formData.projectIdea}
                  onChange={(e) => handleChange("projectIdea", e.target.value)}
                  placeholder="Briefly describe your project idea (if you have one)"
                  className="bg-gray-800 border-gray-700 text-white min-h-[80px]"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="motivation" className="text-gray-300">Motivation for Participating</Label>
                <Textarea
                  id="motivation"
                  value={formData.motivation}
                  onChange={(e) => handleChange("motivation", e.target.value)}
                  placeholder="What motivated you to join this hackathon?"
                  className="bg-gray-800 border-gray-700 text-white min-h-[80px]"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="expectations" className="text-gray-300">Expectations</Label>
                <Textarea
                  id="expectations"
                  value={formData.expectations}
                  onChange={(e) => handleChange("expectations", e.target.value)}
                  placeholder="What do you hope to achieve or learn from this hackathon?"
                  className="bg-gray-800 border-gray-700 text-white min-h-[80px]"
                />
              </div>
            </div>
          )}
          
          {/* Step 4: Logistics & Preferences */}
          {currentStep === 4 && (
            <div className="space-y-4 animate-fadeIn">
              <h3 className="text-lg font-medium text-white animate-slideInRight">Logistics & Preferences</h3>
              
              <div className="space-y-2">
                <Label htmlFor="dietaryRestrictions" className="text-gray-300">Dietary Restrictions</Label>
                <Textarea
                  id="dietaryRestrictions"
                  value={formData.dietaryRestrictions}
                  onChange={(e) => handleChange("dietaryRestrictions", e.target.value)}
                  placeholder="Any dietary restrictions or allergies we should know about?"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tshirtSize" className="text-gray-300">T-Shirt Size</Label>
                <Select value={formData.tshirtSize} onValueChange={(value) => handleChange("tshirtSize", value)}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Select your t-shirt size" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-white">
                    <SelectItem value="xs">XS</SelectItem>
                    <SelectItem value="s">S</SelectItem>
                    <SelectItem value="m">M</SelectItem>
                    <SelectItem value="l">L</SelectItem>
                    <SelectItem value="xl">XL</SelectItem>
                    <SelectItem value="xxl">XXL</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2 py-2">
                <Checkbox 
                  id="accommodationNeeded" 
                  checked={formData.accommodationNeeded}
                  onCheckedChange={(checked) => handleChange("accommodationNeeded", checked === true)}
                  className="text-blue-500 border-gray-600"
                />
                <Label htmlFor="accommodationNeeded" className="text-gray-300">I need accommodation assistance</Label>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="specialAssistance" className="text-gray-300">Special Assistance Needs</Label>
                <Textarea
                  id="specialAssistance"
                  value={formData.specialAssistance}
                  onChange={(e) => handleChange("specialAssistance", e.target.value)}
                  placeholder="Any accessibility requirements or special assistance needs?"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="previousHackathons" className="text-gray-300">Previous Hackathons</Label>
                <Select value={formData.previousHackathons} onValueChange={(value) => handleChange("previousHackathons", value)}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Select number of hackathons" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-white">
                    <SelectItem value="0">This is my first hackathon</SelectItem>
                    <SelectItem value="1-2">1-2 hackathons</SelectItem>
                    <SelectItem value="3-5">3-5 hackathons</SelectItem>
                    <SelectItem value="6-10">6-10 hackathons</SelectItem>
                    <SelectItem value="10+">More than 10 hackathons</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="howDidYouHear" className="text-gray-300">How did you hear about this hackathon?</Label>
                <Select value={formData.howDidYouHear} onValueChange={(value) => handleChange("howDidYouHear", value)}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-white">
                    <SelectItem value="social">Social Media</SelectItem>
                    <SelectItem value="friend">Friend/Colleague</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="website">Website</SelectItem>
                    <SelectItem value="school">School/University</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          
          {/* Step 5: Terms & Agreements */}
          {currentStep === 5 && (
            <div className="space-y-4 animate-fadeIn">
              <h3 className="text-lg font-medium text-white animate-slideInRight">Terms & Agreements</h3>
              
              <div className="pt-2 space-y-4">
                <div className="flex items-start space-x-3 mb-4">
                  <Checkbox 
                    id="agreeToTerms" 
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked) => handleChange("agreeToTerms", checked === true)}
                    className="mt-1 text-blue-500 border-gray-600"
                  />
                  <div>
                    <Label htmlFor="agreeToTerms" className="text-gray-300 font-medium">
                      I agree to the terms and conditions <span className="text-red-500">*</span>
                    </Label>
                    <p className="text-gray-500 text-sm mt-1">
                      By registering, you agree to our <a href="#" className="text-blue-400 hover:underline">Terms of Service</a> and <a href="#" className="text-blue-400 hover:underline">Privacy Policy</a>. You also consent to receiving communications about this hackathon.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 mb-4">
                  <Checkbox 
                    id="agreeToCodeOfConduct" 
                    checked={formData.agreeToCodeOfConduct}
                    onCheckedChange={(checked) => handleChange("agreeToCodeOfConduct", checked === true)}
                    className="mt-1 text-blue-500 border-gray-600"
                  />
                  <div>
                    <Label htmlFor="agreeToCodeOfConduct" className="text-gray-300 font-medium">
                      I agree to follow the Code of Conduct <span className="text-red-500">*</span>
                    </Label>
                    <p className="text-gray-500 text-sm mt-1">
                      I will adhere to the <a href="#" className="text-blue-400 hover:underline">Hackathon Code of Conduct</a>, maintaining a respectful and inclusive environment for all participants.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 mb-4">
                  <Checkbox 
                    id="agreeToDataSharing" 
                    checked={formData.agreeToDataSharing}
                    onCheckedChange={(checked) => handleChange("agreeToDataSharing", checked === true)}
                    className="mt-1 text-blue-500 border-gray-600"
                  />
                  <div>
                    <Label htmlFor="agreeToDataSharing" className="text-gray-300 font-medium">
                      I consent to data sharing with sponsors
                    </Label>
                    <p className="text-gray-500 text-sm mt-1">
                      I allow the hackathon team leads to share my registration information with event sponsors for potential recruitment and networking opportunities.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="bg-gray-900 border-t border-gray-800 p-6">
          <div className="flex justify-between w-full">
            {currentStep > 1 ? (
              <Button 
                variant="outline" 
                onClick={prevStep}
                className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700 transition-all duration-300 hover:scale-105 active:scale-95 relative overflow-hidden group"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-gray-700 to-gray-600 opacity-0 group-hover:opacity-20 transition-all duration-300 rounded-md"></span>
                <span className="relative flex items-center">
                  <svg className="w-4 h-4 mr-1.5 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                  </svg>
                  Back
                </span>
              </Button>
            ) : (
              <div></div>
            )}
            
            {currentStep < totalSteps ? (
              <Button 
                onClick={nextStep}
                disabled={!isStepValid()}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 hover:scale-105 active:scale-95 relative overflow-hidden group"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-400 to-indigo-400 opacity-0 group-hover:opacity-30 group-hover:blur-xl transition-all duration-300 rounded-md"></span>
                <span className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-30 group-hover:opacity-50 blur group-hover:blur-md transition-all duration-300 rounded-md"></span>
                <span className="relative flex items-center">
                  Next
                  <svg className="ml-1.5 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </span>
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit}
                disabled={isSubmitting || !isStepValid()}
                className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 hover:scale-105 active:scale-95 relative overflow-hidden group"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 opacity-0 group-hover:opacity-30 group-hover:blur-xl transition-all duration-300 rounded-md"></span>
                <span className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-30 group-hover:opacity-50 blur group-hover:blur-md transition-all duration-300 rounded-md"></span>
                <span className="relative flex items-center">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Complete Registration
                      <svg className="ml-1.5 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </>
                  )}
                </span>
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}