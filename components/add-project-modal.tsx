"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { PlagiarismChecker } from "@/components/plagiarism-checker"
import { X, Plus, Shield, AlertTriangle, CheckCircle } from "lucide-react"

interface Project {
  title: string
  description: string
  technologies: string[]
  githubUrl?: string
  liveUrl?: string
}

interface PlagiarismResult {
  similarity: number
  status: 'ORIGINAL' | 'SUSPICIOUS' | 'PLAGIARIZED'
  matches: any[]
  overallScore: number
  recommendations: string[]
}

interface AddProjectModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (project: Project) => void
}

export function AddProjectModal({ isOpen, onClose, onAdd }: AddProjectModalProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [technologies, setTechnologies] = useState<string[]>([])
  const [githubUrl, setGithubUrl] = useState("")
  const [liveUrl, setLiveUrl] = useState("")
  const [customTech, setCustomTech] = useState("")
  const [activeTab, setActiveTab] = useState("details")
  const [plagiarismResult, setPlagiarismResult] = useState<PlagiarismResult | null>(null)
  const [showPlagiarismWarning, setShowPlagiarismWarning] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCheckingPlagiarism, setIsCheckingPlagiarism] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  const commonTechnologies = [
    "React",
    "Next.js",
    "TypeScript",
    "JavaScript",
    "Python",
    "Node.js",
    "Express",
    "MongoDB",
    "PostgreSQL",
    "Tailwind CSS",
    "HTML",
    "CSS",
    "Vue.js",
    "Angular",
    "Django",
    "Flask",
    "AWS",
    "Docker",
    "Git",
  ]

  // Real-time plagiarism check with debouncing
  const checkPlagiarismRealTime = useCallback(async () => {
    if (!title || !description || title.length < 3 || description.length < 10) {
      setPlagiarismResult(null)
      setShowSuccessMessage(false)
      return
    }

    setIsCheckingPlagiarism(true)
    setShowSuccessMessage(false)

    try {
      const response = await fetch('/api/plagiarism/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          project: {
            id: 'new',
            title,
            description,
            technologies,
            author: 'Current User',
            github_url: githubUrl,
            demo_url: liveUrl,
          },
        }),
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success && data.result) {
          setPlagiarismResult(data.result)
          setShowPlagiarismWarning(data.result.status === 'PLAGIARIZED')
          setShowSuccessMessage(data.result.status === 'ORIGINAL')
        }
      }
    } catch (error) {
      console.log('Plagiarism check failed, continuing without check')
      setPlagiarismResult(null)
    } finally {
      setIsCheckingPlagiarism(false)
    }
  }, [title, description, technologies, githubUrl, liveUrl])

  // Auto-check plagiarism when title or description changes
  useEffect(() => {
    const timer = setTimeout(() => {
      checkPlagiarismRealTime()
    }, 1000) // Debounce for 1 second

    return () => clearTimeout(timer)
  }, [checkPlagiarismRealTime])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (title && description) {
      setIsSubmitting(true)
      
      // Check if plagiarism check was performed and if there are concerns
      if (plagiarismResult) {
        if (plagiarismResult.status === 'PLAGIARIZED') {
          setShowPlagiarismWarning(true)
          setIsSubmitting(false)
          return
        }
      }
      
      try {
        await onAdd({
          title,
          description,
          technologies,
          githubUrl: githubUrl || undefined,
          liveUrl: liveUrl || undefined,
        })
        
        // Reset form
        resetForm()
        onClose()
      } catch (error) {
        console.error('Error adding project:', error)
      } finally {
        setIsSubmitting(false)
      }
    }
  }
  
  const resetForm = () => {
    setTitle("")
    setDescription("")
    setTechnologies([])
    setGithubUrl("")
    setLiveUrl("")
    setCustomTech("")
    setPlagiarismResult(null)
    setShowPlagiarismWarning(false)
    setShowSuccessMessage(false)
    setActiveTab("details")
  }
  
  const handlePlagiarismCheck = (result: PlagiarismResult) => {
    setPlagiarismResult(result)
    setShowPlagiarismWarning(false)
    
    // Auto-switch to plagiarism tab if issues found
    if (result.status !== 'ORIGINAL') {
      setActiveTab("plagiarism")
    }
  }
  
  const proceedWithSubmission = () => {
    setShowPlagiarismWarning(false)
    // Force submit even with plagiarism concerns
    onAdd({
      title,
      description,
      technologies,
      githubUrl: githubUrl || undefined,
      liveUrl: liveUrl || undefined,
    })
    resetForm()
    onClose()
  }
  
  const getPlagiarismStatusIcon = () => {
    if (!plagiarismResult) return null
    
    switch (plagiarismResult.status) {
      case 'ORIGINAL':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'SUSPICIOUS':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'PLAGIARIZED':
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      default:
        return <Shield className="h-4 w-4 text-gray-500" />
    }
  }

  const addTechnology = (tech: string) => {
    if (tech && !technologies.includes(tech)) {
      setTechnologies([...technologies, tech])
    }
  }

  const removeTechnology = (tech: string) => {
    setTechnologies(technologies.filter((t) => t !== tech))
  }

  const handleAddCustomTech = () => {
    if (customTech.trim()) {
      addTechnology(customTech.trim())
      setCustomTech("")
    }
  }

  const handleCustomTechKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddCustomTech()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-3">
            <h2 className="text-2xl font-bold text-white">Add New Project</h2>
            {isCheckingPlagiarism && (
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                <span>Checking originality...</span>
              </div>
            )}
            {!isCheckingPlagiarism && getPlagiarismStatusIcon()}
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-4 h-4" />
          </Button>
        </div>

        {showSuccessMessage && plagiarismResult?.status === 'ORIGINAL' && (
          <Alert className="mb-4 border-green-500 bg-green-900/20 backdrop-blur-sm">
            <CheckCircle className="h-5 w-5 text-green-400" />
            <AlertTitle className="text-green-300 text-lg font-bold">🎉 Congratulations!</AlertTitle>
            <AlertDescription className="text-green-200">
              Your project is unique and original! Similarity score: {plagiarismResult?.similarity}%
              <br />
              <span className="text-green-300 font-semibold">Keep up the great innovative work!</span>
            </AlertDescription>
          </Alert>
        )}

        {plagiarismResult?.status === 'SUSPICIOUS' && (
          <Alert className="mb-4 border-yellow-500 bg-yellow-900/20 backdrop-blur-sm">
            <AlertTriangle className="h-5 w-5 text-yellow-400" />
            <AlertTitle className="text-yellow-300">Moderate Similarity Detected</AlertTitle>
            <AlertDescription className="text-yellow-200">
              This project shows some similarity to existing submissions ({plagiarismResult?.similarity}% similar).
              <br />
              Consider adding more unique features to improve originality.
            </AlertDescription>
          </Alert>
        )}

        {showPlagiarismWarning && plagiarismResult?.status === 'PLAGIARIZED' && (
          <Alert className="mb-4 border-red-500 bg-red-900/20 backdrop-blur-sm">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            <AlertTitle className="text-red-300 text-lg font-bold">⚠️ High Plagiarism Detected</AlertTitle>
            <AlertDescription className="text-red-200">
              This project shows significant similarity to existing submissions ({plagiarismResult?.similarity}% similar).
              {plagiarismResult?.matches && plagiarismResult.matches.length > 0 && (
                <div className="mt-2">
                  <strong>Similar to:</strong> {plagiarismResult.matches[0].sourceProject.title}
                </div>
              )}
              <br />
              <span className="text-red-300 font-semibold">Please make your project more unique before submitting.</span>
            </AlertDescription>
            <div className="flex space-x-2 mt-3">
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => setActiveTab("plagiarism")}
                className="border-red-400 text-red-300 hover:bg-red-800 bg-transparent"
              >
                Review Details
              </Button>
              <Button 
                size="sm" 
                onClick={proceedWithSubmission}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Submit Anyway
              </Button>
            </div>
          </Alert>
        )}
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 bg-gray-800">
            <TabsTrigger value="details" className="data-[state=active]:bg-gray-700">
              Project Details
            </TabsTrigger>
            <TabsTrigger value="plagiarism" className="data-[state=active]:bg-gray-700 flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>Plagiarism Check</span>
              {getPlagiarismStatusIcon()}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="details">
            <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title" className="text-white">
              Project Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white"
              placeholder="Enter project title"
              required
            />
          </div>

          <div>
            <Label htmlFor="description" className="text-white">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white"
              placeholder="Describe your project"
              rows={4}
              required
            />
          </div>

          <div>
            <Label className="text-white">Technologies</Label>
            <div className="flex gap-2 mb-3">
              <Input
                value={customTech}
                onChange={(e) => setCustomTech(e.target.value)}
                onKeyPress={handleCustomTechKeyPress}
                className="bg-gray-800 border-gray-700 text-white flex-1"
                placeholder="Add custom technology"
              />
              <Button type="button" onClick={handleAddCustomTech} size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 mb-3">
              {commonTechnologies.map((tech) => (
                <Button
                  key={tech}
                  type="button"
                  variant={technologies.includes(tech) ? "default" : "outline"}
                  size="sm"
                  onClick={() => (technologies.includes(tech) ? removeTechnology(tech) : addTechnology(tech))}
                  className={
                    technologies.includes(tech)
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "border-gray-600 text-gray-300 hover:bg-gray-800"
                  }
                >
                  {tech}
                </Button>
              ))}
            </div>

            {technologies.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {technologies.map((tech) => (
                  <Badge key={tech} className="bg-blue-600 text-white flex items-center gap-1">
                    {tech}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeTechnology(tech)}
                      className="h-auto p-0 text-white hover:bg-blue-700"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="githubUrl" className="text-white">
              GitHub URL (Optional)
            </Label>
            <Input
              id="githubUrl"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white"
              placeholder="https://github.com/username/project"
            />
          </div>

          <div>
            <Label htmlFor="liveUrl" className="text-white">
              Live Demo URL (Optional)
            </Label>
            <Input
              id="liveUrl"
              value={liveUrl}
              onChange={(e) => setLiveUrl(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white"
              placeholder="https://your-project.com"
            />
          </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700 text-white flex-1"
                >
                  {isSubmitting ? 'Adding...' : 'Add Project'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="border-gray-600 text-gray-300 hover:bg-gray-800 flex-1 bg-transparent"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </TabsContent>
          
          <TabsContent value="plagiarism">
            <div className="space-y-4">
              {title && description ? (
                <PlagiarismChecker
                  project={{
                    title,
                    description,
                    technologies,
                    author: 'Current User',
                    github_url: githubUrl,
                    demo_url: liveUrl
                  }}
                  onCheck={handlePlagiarismCheck}
                  showFullInterface={false}
                />
              ) : (
                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertTitle>Project Details Required</AlertTitle>
                  <AlertDescription>
                    Please fill in the project title and description in the "Project Details" tab before running the plagiarism check.
                  </AlertDescription>
                </Alert>
              )}
              
              {plagiarismResult && (
                <div className="mt-4">
                  <Alert className={`border-l-4 ${
                    plagiarismResult.status === 'PLAGIARIZED' ? 'border-red-500 bg-red-50' :
                    plagiarismResult.status === 'SUSPICIOUS' ? 'border-yellow-500 bg-yellow-50' :
                    'border-green-500 bg-green-50'
                  }`}>
                    {getPlagiarismStatusIcon()}
                    <AlertTitle>
                      {plagiarismResult.status === 'PLAGIARIZED' ? 'High Similarity Detected' :
                       plagiarismResult.status === 'SUSPICIOUS' ? 'Moderate Similarity Found' :
                       'Original Content Confirmed'}
                    </AlertTitle>
                    <AlertDescription>
                      Similarity Score: {plagiarismResult.similarity}% | 
                      Matches Found: {plagiarismResult.matches.length}
                      <br />
                      {plagiarismResult.recommendations[0]}
                    </AlertDescription>
                  </Alert>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
