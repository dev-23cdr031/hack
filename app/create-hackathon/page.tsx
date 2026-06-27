"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { 
  Calendar, 
  MapPin, 
  Users, 
  Trophy, 
  Plus, 
  X, 
  ArrowLeft,
  Loader2,
  CheckCircle,
  Upload,
  Globe,
  Building,
  Clock,
  DollarSign,
  Target,
  BookOpen,
  HelpCircle
} from "lucide-react"
import Link from "next/link"
import { HamburgerMenu } from "@/components/hamburger-menu"

interface Judge {
  name: string
  title: string
  organization: string
  bio: string
}

interface Sponsor {
  name: string
  tier: string
}

interface FAQ {
  question: string
  answer: string
}

interface Resource {
  title: string
  url: string
  type: string
}

interface ScheduleItem {
  time: string
  activity: string
}

export default function CreateHackathonPage() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  
  // Basic Information
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [location, setLocation] = useState("")
  const [type, setType] = useState<"online" | "in-person" | "hybrid">("online")
  const [format, setFormat] = useState<"competitive" | "learning" | "community" | "corporate">("competitive")
  
  // Details
  const [maxParticipants, setMaxParticipants] = useState("")
  const [prizeAmount, setPrizeAmount] = useState("")
  const [skillLevel, setSkillLevel] = useState<"beginner" | "intermediate" | "advanced" | "all-levels">("all-levels")
  const [eligibility, setEligibility] = useState("")
  
  // Themes
  const [themes, setThemes] = useState<string[]>([])
  const [newTheme, setNewTheme] = useState("")
  
  // Rules
  const [rules, setRules] = useState<string[]>([])
  const [newRule, setNewRule] = useState("")
  
  // Schedule
  const [schedule, setSchedule] = useState<ScheduleItem[]>([])
  const [newScheduleTime, setNewScheduleTime] = useState("")
  const [newScheduleActivity, setNewScheduleActivity] = useState("")
  
  // Judges
  const [judges, setJudges] = useState<Judge[]>([])
  const [newJudge, setNewJudge] = useState<Judge>({ name: "", title: "", organization: "", bio: "" })
  
  // Sponsors
  const [sponsors, setSponsors] = useState<Sponsor[]>([])
  const [newSponsor, setNewSponsor] = useState<Sponsor>({ name: "", tier: "" })
  
  // FAQ
  const [faq, setFaq] = useState<FAQ[]>([])
  const [newFaq, setNewFaq] = useState<FAQ>({ question: "", answer: "" })
  
  // Resources
  const [resources, setResources] = useState<Resource[]>([])
  const [newResource, setNewResource] = useState<Resource>({ title: "", url: "", type: "" })

  const addTheme = () => {
    if (newTheme.trim() && !themes.includes(newTheme.trim())) {
      setThemes([...themes, newTheme.trim()])
      setNewTheme("")
    }
  }

  const removeTheme = (theme: string) => {
    setThemes(themes.filter(t => t !== theme))
  }

  const addRule = () => {
    if (newRule.trim()) {
      setRules([...rules, newRule.trim()])
      setNewRule("")
    }
  }

  const removeRule = (index: number) => {
    setRules(rules.filter((_, i) => i !== index))
  }

  const addScheduleItem = () => {
    if (newScheduleTime.trim() && newScheduleActivity.trim()) {
      setSchedule([...schedule, { time: newScheduleTime.trim(), activity: newScheduleActivity.trim() }])
      setNewScheduleTime("")
      setNewScheduleActivity("")
    }
  }

  const removeScheduleItem = (index: number) => {
    setSchedule(schedule.filter((_, i) => i !== index))
  }

  const addJudge = () => {
    if (newJudge.name.trim() && newJudge.title.trim() && newJudge.organization.trim()) {
      setJudges([...judges, { ...newJudge }])
      setNewJudge({ name: "", title: "", organization: "", bio: "" })
    }
  }

  const removeJudge = (index: number) => {
    setJudges(judges.filter((_, i) => i !== index))
  }

  const addSponsor = () => {
    if (newSponsor.name.trim() && newSponsor.tier.trim()) {
      setSponsors([...sponsors, { ...newSponsor }])
      setNewSponsor({ name: "", tier: "" })
    }
  }

  const removeSponsor = (index: number) => {
    setSponsors(sponsors.filter((_, i) => i !== index))
  }

  const addFaq = () => {
    if (newFaq.question.trim() && newFaq.answer.trim()) {
      setFaq([...faq, { ...newFaq }])
      setNewFaq({ question: "", answer: "" })
    }
  }

  const removeFaq = (index: number) => {
    setFaq(faq.filter((_, i) => i !== index))
  }

  const addResource = () => {
    if (newResource.title.trim() && newResource.url.trim() && newResource.type.trim()) {
      setResources([...resources, { ...newResource }])
      setNewResource({ title: "", url: "", type: "" })
    }
  }

  const removeResource = (index: number) => {
    setResources(resources.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const hackathonData = {
        title,
        description,
        start_date: startDate,
        end_date: endDate,
        location,
        type,
        format,
        themes,
        max_participants: maxParticipants ? parseInt(maxParticipants) : undefined,
        prize_amount: prizeAmount ? parseInt(prizeAmount) : undefined,
        skill_level: skillLevel,
        eligibility,
        rules,
        schedule,
        judges,
        sponsors,
        faq,
        resources,
        status: "upcoming" as const,
        current_participants: 0
      }

      const response = await fetch('/api/hackathons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(hackathonData),
      })

      if (!response.ok) {
        throw new Error('Failed to create hackathon')
      }

      setSuccess(true)
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setSuccess(false)
        // Reset all form fields
        setTitle("")
        setDescription("")
        setStartDate("")
        setEndDate("")
        setLocation("")
        setType("online")
        setFormat("competitive")
        setMaxParticipants("")
        setPrizeAmount("")
        setSkillLevel("all-levels")
        setEligibility("")
        setThemes([])
        setRules([])
        setSchedule([])
        setJudges([])
        setSponsors([])
        setFaq([])
        setResources([])
      }, 3000)

    } catch (error) {
      console.error('Error creating hackathon:', error)
      alert('Failed to create hackathon. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Hackathon Created Successfully!</h1>
          <p className="text-gray-400 mb-6">Your hackathon has been created and is now live.</p>
          <Link href="/hackathons">
            <Button className="bg-blue-600 hover:bg-blue-700">
              View All Hackathons
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-6 md:px-12 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <HamburgerMenu />
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
            >
              HackConnect
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/hackathons">
            <Button variant="outline" className="bg-gray-800/50 border-gray-700 text-gray-200 hover:bg-gray-700">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Hackathons
            </Button>
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Plus className="w-8 h-8 text-blue-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Create Hackathon
            </h1>
          </div>
          <p className="text-gray-400 text-lg">
            Host your own hackathon and bring developers together to build amazing projects
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <BookOpen className="w-5 h-5 text-blue-400" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-white">Hackathon Title *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter hackathon title"
                    className="bg-gray-800/50 border-gray-700 text-white"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-white">Location</Label>
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g., KEC, Erode Tamilnadu or Virtual"
                    className="bg-gray-800/50 border-gray-700 text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-white">Description *</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your hackathon, its goals, and what participants can expect"
                  className="bg-gray-800/50 border-gray-700 text-white min-h-[120px]"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="startDate" className="text-white">Start Date *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="bg-gray-800/50 border-gray-700 text-white"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate" className="text-white">End Date *</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="bg-gray-800/50 border-gray-700 text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-white">Event Type *</Label>
                  <Select value={type} onValueChange={(value: "online" | "in-person" | "hybrid") => setType(value)}>
                    <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="online">Online</SelectItem>
                      <SelectItem value="in-person">In-Person</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Format</Label>
                  <Select value={format} onValueChange={(value: "competitive" | "learning" | "community" | "corporate") => setFormat(value)}>
                    <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="competitive">Competitive</SelectItem>
                      <SelectItem value="learning">Learning</SelectItem>
                      <SelectItem value="community">Community</SelectItem>
                      <SelectItem value="corporate">Corporate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Event Details */}
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Target className="w-5 h-5 text-blue-400" />
                Event Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="maxParticipants" className="text-white">Max Participants</Label>
                  <Input
                    id="maxParticipants"
                    type="number"
                    value={maxParticipants}
                    onChange={(e) => setMaxParticipants(e.target.value)}
                    placeholder="e.g., 500"
                    className="bg-gray-800/50 border-gray-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prizeAmount" className="text-white">Prize Amount ($)</Label>
                  <Input
                    id="prizeAmount"
                    type="number"
                    value={prizeAmount}
                    onChange={(e) => setPrizeAmount(e.target.value)}
                    placeholder="e.g., 10000"
                    className="bg-gray-800/50 border-gray-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Skill Level</Label>
                  <Select value={skillLevel} onValueChange={(value: "beginner" | "intermediate" | "advanced" | "all-levels") => setSkillLevel(value)}>
                    <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                      <SelectItem value="all-levels">All Levels</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="eligibility" className="text-white">Eligibility Requirements</Label>
                <Input
                  id="eligibility"
                  value={eligibility}
                  onChange={(e) => setEligibility(e.target.value)}
                  placeholder="e.g., Open to all developers 18+"
                  className="bg-gray-800/50 border-gray-700 text-white"
                />
              </div>
            </CardContent>
          </Card>

          {/* Themes */}
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Globe className="w-5 h-5 text-blue-400" />
                Themes & Topics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newTheme}
                  onChange={(e) => setNewTheme(e.target.value)}
                  placeholder="Add a theme (e.g., AI, Blockchain, Web3)"
                  className="bg-gray-800/50 border-gray-700 text-white"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTheme())}
                />
                <Button type="button" onClick={addTheme} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {themes.map((theme, index) => (
                  <Badge key={index} variant="secondary" className="bg-blue-900/50 text-blue-200 hover:bg-blue-800">
                    {theme}
                    <button
                      type="button"
                      onClick={() => removeTheme(theme)}
                      className="ml-2 hover:text-red-400"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Rules */}
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <BookOpen className="w-5 h-5 text-blue-400" />
                Rules & Guidelines
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newRule}
                  onChange={(e) => setNewRule(e.target.value)}
                  placeholder="Add a rule or guideline"
                  className="bg-gray-800/50 border-gray-700 text-white"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRule())}
                />
                <Button type="button" onClick={addRule} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-2">
                {rules.map((rule, index) => (
                  <div key={index} className="flex items-center gap-2 p-3 bg-gray-800/30 rounded-lg">
                    <span className="flex-1 text-gray-200">{rule}</span>
                    <button
                      type="button"
                      onClick={() => removeRule(index)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Link href="/hackathons">
              <Button type="button" variant="outline" className="bg-gray-800/50 border-gray-700 text-gray-200 hover:bg-gray-700">
                Cancel
              </Button>
            </Link>
            <Button 
              type="submit" 
              disabled={loading || !title || !description || !startDate || !endDate}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Hackathon
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
