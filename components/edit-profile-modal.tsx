'use client'

import { useState } from 'react'
import { User } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { X } from 'lucide-react'

interface EditProfileModalProps {
  user: User
  onClose: () => void
  onSave: (data: Partial<User>) => void
}

export function EditProfileModal({ user, onClose, onSave }: EditProfileModalProps) {
  const [formData, setFormData] = useState({
    name: user.name,
    title: user.title || '',
    bio: user.bio || '',
    avatar_url: user.avatar_url || '',
    github_url: user.github_url || '',
    linkedin_url: user.linkedin_url || '',
    portfolio_url: user.portfolio_url || '',
    location: user.location || '',
    experience_level: user.experience_level || 'beginner',
    role: user.role || 'student',
    skills: user.skills?.join(', ') || ''
  })

  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const skillsArray = formData.skills
        .split(',')
        .map(s => s.trim())
        .filter(Boolean)
      
      await onSave({
        name: formData.name,
        title: formData.title,
        bio: formData.bio,
        avatar_url: formData.avatar_url,
        github_url: formData.github_url,
        linkedin_url: formData.linkedin_url,
        portfolio_url: formData.portfolio_url,
        location: formData.location,
        experience_level: formData.experience_level,
        role: formData.role,
        skills: skillsArray
      })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSelectChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="bg-gray-900 border-gray-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto text-white">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white">Edit Profile</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-400 hover:text-white hover:bg-gray-800">
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className="text-gray-200">Full Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="title" className="text-gray-200">Job Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Full Stack Developer"
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="bio" className="text-gray-200">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell us about yourself..."
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 min-h-[100px]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="location" className="text-gray-200">Location</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="City, College, Country"
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
                />
              </div>

              <div>
                <Label htmlFor="experience_level" className="text-gray-200">Experience Level</Label>
                <Select value={formData.experience_level} onValueChange={(value) => handleSelectChange("experience_level", value)}>
                  <SelectTrigger id="experience_level" className="bg-gray-800 border-gray-700 text-white w-full">
                    <SelectValue placeholder="Select experience level" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="beginner" className="text-white">Beginner</SelectItem>
                    <SelectItem value="intermediate" className="text-white">Intermediate</SelectItem>
                    <SelectItem value="advanced" className="text-white">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="role" className="text-gray-200">Role / User Type</Label>
              <Select value={formData.role} onValueChange={(value) => handleSelectChange("role", value)}>
                <SelectTrigger id="role" className="bg-gray-800 border-gray-700 text-white w-full">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="student" className="text-white">Student</SelectItem>
                  <SelectItem value="mentor" className="text-white">Mentor</SelectItem>
                  <SelectItem value="organizer" className="text-white">Organizer</SelectItem>
                  <SelectItem value="admin" className="text-white">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="skills" className="text-gray-200">Skills (comma separated)</Label>
              <Input
                id="skills"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="e.g. JavaScript, React, Node.js"
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
              />
            </div>

            <div>
              <Label htmlFor="avatar_url" className="text-gray-200">Avatar URL</Label>
              <Input
                id="avatar_url"
                name="avatar_url"
                value={formData.avatar_url}
                onChange={handleChange}
                placeholder="https://example.com/avatar.jpg"
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="github_url" className="text-gray-200">GitHub URL</Label>
                <Input
                  id="github_url"
                  name="github_url"
                  value={formData.github_url}
                  onChange={handleChange}
                  placeholder="https://github.com/username"
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
                />
              </div>
              
              <div>
                <Label htmlFor="linkedin_url" className="text-gray-200">LinkedIn URL</Label>
                <Input
                  id="linkedin_url"
                  name="linkedin_url"
                  value={formData.linkedin_url}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/username"
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
                />
              </div>
              
              <div>
                <Label htmlFor="portfolio_url" className="text-gray-200">Portfolio URL</Label>
                <Input
                  id="portfolio_url"
                  name="portfolio_url"
                  value={formData.portfolio_url}
                  onChange={handleChange}
                  placeholder="https://yourportfolio.com"
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button 
                type="submit" 
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                className="border-gray-600 text-gray-300 hover:text-white hover:bg-gray-800 bg-transparent"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}