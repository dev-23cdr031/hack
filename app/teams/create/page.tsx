"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function CreateTeamPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    hackathon_id: "",
    max_members: "4",
    skills_needed: [] as string[],
    project_idea: "",
    communication_platform: "Discord",
    meeting_schedule: "",
    roles_needed: [] as string[],
  })
  const [newSkill, setNewSkill] = useState("")
  const [newRole, setNewRole] = useState("")
  const [loading, setLoading] = useState(false)
  const [hackathons, setHackathons] = useState<any[]>([])
  const [currentUser, setCurrentUser] = useState<any>(null)

  // Get current user and hackathons on component mount
  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setCurrentUser(JSON.parse(userData))
    } else {
      alert('Please log in to create a team')
      router.push('/auth/login')
      return
    }

    // Fetch available hackathons
    fetchHackathons()
  }, [router])

  const fetchHackathons = async () => {
    try {
      const response = await fetch('/api/hackathons')
      const data = await response.json()
      if (response.ok) {
        setHackathons(data.hackathons || [])
      }
    } catch (err) {
      console.error('Error fetching hackathons:', err)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!currentUser) {
      alert('Please log in to create a team')
      return
    }

    if (!formData.name.trim()) {
      alert('Please enter a team name')
      return
    }

    setLoading(true)

    try {
      const teamData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        hackathon_id: formData.hackathon_id === 'none' ? null : formData.hackathon_id || null,
        max_members: parseInt(formData.max_members),
        skills_needed: formData.skills_needed,
        project_idea: formData.project_idea.trim(),
        communication_platform: formData.communication_platform,
        meeting_schedule: formData.meeting_schedule.trim(),
        roles_needed: formData.roles_needed,
        leader_id: currentUser.id,
        status: 'forming',
        current_members: 1
      }

      console.log('Creating team with data:', teamData)

      const response = await fetch('/api/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(teamData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create team')
      }

      const newTeam = await response.json()
      console.log('Team created successfully:', newTeam)

      alert("Team created successfully!")
      router.push("/teams")
    } catch (error) {
      console.error('Error creating team:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to create team'
      alert(`Failed to create team: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills_needed.includes(newSkill.trim())) {
      setFormData({
        ...formData,
        skills_needed: [...formData.skills_needed, newSkill.trim()],
      })
      setNewSkill("")
    }
  }

  const removeSkill = (skillToRemove: string) => {
    setFormData({
      ...formData,
      skills_needed: formData.skills_needed.filter((skill) => skill !== skillToRemove),
    })
  }
  
  const addRole = () => {
    if (newRole.trim() && !formData.roles_needed.includes(newRole.trim())) {
      setFormData({
        ...formData,
        roles_needed: [...formData.roles_needed, newRole.trim()],
      })
      setNewRole("")
    }
  }

  const removeRole = (roleToRemove: string) => {
    setFormData({
      ...formData,
      roles_needed: formData.roles_needed.filter((role) => role !== roleToRemove),
    })
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-6 md:px-12 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
        <Link
          href="/"
          className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
        >
          HackConnect
        </Link>
        <div className="flex gap-6">
          <Link href="/hackathons" className="text-gray-300 hover:text-blue-400">
            Explore
          </Link>
          <Link href="/teams" className="text-blue-400 font-medium">
            Teams
          </Link>
          <Link href="/profile" className="text-gray-300 hover:text-blue-400">
            Profile
          </Link>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
            Create New Team
          </h1>
          <p className="text-gray-400">Start building your dream team for the next hackathon</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-white">
                  Team Name *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your team name"
                  required
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-white">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your team's goals and what you're looking to build"
                  rows={4}
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                />
              </div>

              <div>
                <Label htmlFor="hackathon" className="text-white">
                  Hackathon
                </Label>
                <Select
                  value={formData.hackathon_id}
                  onValueChange={(value) => setFormData({ ...formData, hackathon_id: value })}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Select a hackathon (optional)" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="none">No specific hackathon</SelectItem>
                    {hackathons.map((hackathon) => (
                      <SelectItem key={hackathon.id} value={hackathon.id}>
                        {hackathon.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="max_members" className="text-white">
                  Maximum Team Size *
                </Label>
                <Select
                  value={formData.max_members}
                  onValueChange={(value) => setFormData({ ...formData, max_members: value })}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="2">2 members</SelectItem>
                    <SelectItem value="3">3 members</SelectItem>
                    <SelectItem value="4">4 members</SelectItem>
                    <SelectItem value="5">5 members</SelectItem>
                    <SelectItem value="6">6 members</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="project_idea" className="text-white">
                  Project Idea
                </Label>
                <Textarea
                  id="project_idea"
                  value={formData.project_idea}
                  onChange={(e) => setFormData({ ...formData, project_idea: e.target.value })}
                  placeholder="Describe the project you're planning to build"
                  rows={3}
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                />
              </div>

              <div>
                <Label htmlFor="communication_platform" className="text-white">
                  Communication Platform
                </Label>
                <Select
                  value={formData.communication_platform}
                  onValueChange={(value) => setFormData({ ...formData, communication_platform: value })}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="Discord">Discord</SelectItem>
                    <SelectItem value="Slack">Slack</SelectItem>
                    <SelectItem value="Microsoft Teams">Microsoft Teams</SelectItem>
                    <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                    <SelectItem value="Zoom">Zoom</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="meeting_schedule" className="text-white">
                  Meeting Schedule
                </Label>
                <Input
                  id="meeting_schedule"
                  value={formData.meeting_schedule}
                  onChange={(e) => setFormData({ ...formData, meeting_schedule: e.target.value })}
                  placeholder="e.g., Daily standups at 10 AM EST, weekly planning on Sundays"
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                />
              </div>

              <div>
                <Label className="text-white">Roles Needed</Label>
                <div className="flex gap-2 mb-3">
                  <Input
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    placeholder="Add a role (e.g., Frontend Developer, UI Designer)"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addRole())}
                    className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                  />
                  <Button
                    type="button"
                    onClick={addRole}
                    variant="outline"
                    className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                  >
                    Add
                  </Button>
                </div>
                {formData.roles_needed.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {formData.roles_needed.map((role) => (
                      <Badge key={role} variant="outline" className="flex items-center gap-1 bg-blue-900/30 text-blue-300 border-blue-800">
                        {role}
                        <button type="button" onClick={() => removeRole(role)} className="ml-1 hover:text-red-400">
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <Label className="text-white">Skills Needed</Label>
                <div className="flex gap-2 mb-3">
                  <Input
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Add a skill (e.g., React, Python, UI/UX)"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                    className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                  />
                  <Button
                    type="button"
                    onClick={addSkill}
                    variant="outline"
                    className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                  >
                    Add
                  </Button>
                </div>
                {formData.skills_needed.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.skills_needed.map((skill) => (
                      <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                        {skill}
                        <button type="button" onClick={() => removeSkill(skill)} className="ml-1 hover:text-red-400">
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={loading || !formData.name}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? "Creating..." : "Create Team"}
            </Button>
            <Link href="/teams">
              <Button
                type="button"
                variant="outline"
                className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
              >
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
