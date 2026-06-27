'use client'

import { useState } from 'react'
import { User } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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
    portfolio_url: user.portfolio_url || ''
  })

  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      await onSave(formData)
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
