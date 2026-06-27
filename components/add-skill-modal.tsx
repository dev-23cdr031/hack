'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { X } from 'lucide-react'

// Custom CSS for the range slider
const sliderStyles = `
  .slider::-webkit-slider-thumb {
    appearance: none;
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background: linear-gradient(135deg, #3b82f6, #8b5cf6);
    cursor: pointer;
    border: 2px solid #1f2937;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }
  
  .slider::-moz-range-thumb {
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background: linear-gradient(135deg, #3b82f6, #8b5cf6);
    cursor: pointer;
    border: 2px solid #1f2937;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }
`

interface AddSkillModalProps {
  existingSkills: string[]
  onClose: () => void
  onAdd: (skill: string, level: number) => void
}

const POPULAR_SKILLS = [
  'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java', 'C++', 'Go',
  'Rust', 'Swift', 'Kotlin', 'Flutter', 'React Native', 'Vue.js', 'Angular',
  'Next.js', 'Express.js', 'Django', 'Flask', 'Spring Boot', 'Laravel',
  'PostgreSQL', 'MongoDB', 'MySQL', 'Redis', 'Docker', 'Kubernetes',
  'AWS', 'Azure', 'GCP', 'Git', 'GraphQL', 'REST API', 'Machine Learning',
  'AI', 'Data Science', 'Blockchain', 'Web3', 'Solidity', 'UI/UX Design',
  'UI/UX', 'Photoshop', 'DevOps', 'CI/CD', 'Testing', 'Agile'
]

export function AddSkillModal({ existingSkills, onClose, onAdd }: AddSkillModalProps) {
  const [customSkill, setCustomSkill] = useState('')
  const [skillLevel, setSkillLevel] = useState(75)
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null)

  const availableSkills = POPULAR_SKILLS.filter(skill => 
    !existingSkills.includes(skill)
  )

  const handleAddCustomSkill = (e: React.FormEvent) => {
    e.preventDefault()
    if (customSkill.trim() && !existingSkills.includes(customSkill.trim())) {
      onAdd(customSkill.trim(), skillLevel)
      setCustomSkill('')
      setSkillLevel(75)
      setSelectedSkill(null)
    }
  }

  const handleAddPopularSkill = (skill: string) => {
    setSelectedSkill(skill)
  }

  const handleConfirmSkill = () => {
    if (selectedSkill) {
      onAdd(selectedSkill, skillLevel)
      setSelectedSkill(null)
      setSkillLevel(75)
    }
  }

  const getLevelLabel = (level: number) => {
    if (level >= 90) return 'Expert'
    if (level >= 75) return 'Advanced'
    if (level >= 50) return 'Intermediate'
    if (level >= 25) return 'Beginner'
    return 'Learning'
  }

  const getLevelColor = (level: number) => {
    if (level >= 90) return 'text-purple-400'
    if (level >= 75) return 'text-blue-400'
    if (level >= 50) return 'text-green-400'
    if (level >= 25) return 'text-yellow-400'
    return 'text-orange-400'
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: sliderStyles }} />
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <Card className="bg-gray-900 border-gray-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto text-white">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white">Add New Skill</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-400 hover:text-white hover:bg-gray-800">
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Skill Level Selector */}
          <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <Label className="text-gray-200 mb-3 block">Skill Level</Label>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={`font-medium ${getLevelColor(skillLevel)}`}>
                  {getLevelLabel(skillLevel)} ({skillLevel}%)
                </span>
                <span className="text-sm text-gray-400">
                  {skillLevel < 25 ? 'Just starting out' : 
                   skillLevel < 50 ? 'Getting comfortable' :
                   skillLevel < 75 ? 'Quite proficient' :
                   skillLevel < 90 ? 'Very experienced' : 'Master level'}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="100"
                value={skillLevel}
                onChange={(e) => setSkillLevel(Number(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #3b82f6 0%, #8b5cf6 ${skillLevel}%, #374151 ${skillLevel}%, #374151 100%)`
                }}
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Learning (1%)</span>
                <span>Beginner (25%)</span>
                <span>Intermediate (50%)</span>
                <span>Advanced (75%)</span>
                <span>Expert (100%)</span>
              </div>
            </div>
          </div>

          {/* Custom Skill Input */}
          <div>
            <Label htmlFor="customSkill" className="text-gray-200">Add Custom Skill</Label>
            <form onSubmit={handleAddCustomSkill} className="flex gap-2 mt-2">
              <Input
                id="customSkill"
                value={customSkill}
                onChange={(e) => setCustomSkill(e.target.value)}
                placeholder="Enter skill name..."
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
              />
              <Button type="submit" disabled={!customSkill.trim()} className="bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-700 disabled:text-gray-400">
                Add
              </Button>
            </form>
          </div>

          {/* Popular Skills */}
          <div>
            <Label className="text-gray-200">Popular Skills</Label>
            <div className="flex flex-wrap gap-2 mt-2 max-h-60 overflow-y-auto">
              {availableSkills.map((skill) => (
                <Badge
                  key={skill}
                  variant="outline"
                  className={`cursor-pointer transition-colors ${
                    selectedSkill === skill
                      ? 'bg-blue-600/30 border-blue-400 text-blue-300'
                      : 'hover:bg-blue-600/20 hover:border-blue-500 border-gray-600 text-gray-200 hover:text-white'
                  }`}
                  onClick={() => handleAddPopularSkill(skill)}
                >
                  {skill}
                </Badge>
              ))}
            </div>
            {availableSkills.length === 0 && (
              <p className="text-gray-400 text-sm mt-2">
                You've added all popular skills! Use the custom input above to add more.
              </p>
            )}
          </div>

          {/* Selected Skill Confirmation */}
          {selectedSkill && (
            <div className="bg-blue-900/20 border border-blue-700 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="text-white font-medium">Selected: {selectedSkill}</h4>
                  <p className="text-sm text-gray-300">
                    Level: <span className={getLevelColor(skillLevel)}>{getLevelLabel(skillLevel)} ({skillLevel}%)</span>
                  </p>
                </div>
                <Button
                  onClick={() => setSelectedSkill(null)}
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleConfirmSkill}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Add Skill
                </Button>
                <Button
                  onClick={() => setSelectedSkill(null)}
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:text-white hover:bg-gray-800 bg-transparent"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="border-gray-600 text-gray-300 hover:text-white hover:bg-gray-800 bg-transparent"
            >
              Done
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
    </>
  )
}
