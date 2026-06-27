'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { PlagiarismChecker } from '@/components/plagiarism-checker'
import { 
  Shield, 
  Plus, 
  FileText, 
  Users, 
  TrendingUp, 
  Clock,
  Search,
  Database,
  Zap,
  CheckCircle,
  AlertTriangle,
  XCircle
} from 'lucide-react'

interface Project {
  id?: string
  title: string
  description: string
  technologies: string[]
  author?: string
  github_url?: string
  demo_url?: string
}

interface BatchResult {
  projectId: string
  projectTitle: string
  author: string
  result: {
    similarity: number
    status: 'ORIGINAL' | 'SUSPICIOUS' | 'PLAGIARIZED'
    matches: any[]
  }
  processingTime: number
}

interface BatchSummary {
  totalProjects: number
  originalProjects: number
  suspiciousProjects: number
  plagiarizedProjects: number
  averageScore: number
  processingTime: number
}

export default function PlagiarismPage() {
  const [activeTab, setActiveTab] = useState('single')
  const [project, setProject] = useState<Project>({
    title: '',
    description: '',
    technologies: [],
    author: '',
    github_url: '',
    demo_url: ''
  })
  const [techInput, setTechInput] = useState('')
  const [batchResults, setBatchResults] = useState<BatchResult[]>([])
  const [batchSummary, setBatchSummary] = useState<BatchSummary | null>(null)
  const [isBatchChecking, setIsBatchChecking] = useState(false)
  const [batchError, setBatchError] = useState<string | null>(null)

  // Sample projects for quick testing
  const sampleProjects: Project[] = [
    {
      title: 'AI Healthcare Assistant',
      description: 'An AI-powered healthcare assistant that helps patients manage their medications and appointments. The system uses machine learning algorithms to provide personalized health recommendations and reminders.',
      technologies: ['React', 'Node.js', 'OpenAI', 'MongoDB'],
      author: 'Test User 1',
      github_url: 'https://github.com/user/ai-healthcare'
    },
    {
      title: 'Healthcare AI Assistant',
      description: 'An artificial intelligence healthcare assistant that assists patients in managing medications and scheduling appointments. Uses ML algorithms for personalized health recommendations.',
      technologies: ['React', 'Node.js', 'OpenAI', 'MongoDB'],
      author: 'Test User 2',
      github_url: 'https://github.com/user/healthcare-ai'
    },
    {
      title: 'Blockchain Voting System',
      description: 'A secure and transparent voting system built on blockchain technology. Ensures vote integrity, anonymity, and real-time result tracking with immutable records.',
      technologies: ['Solidity', 'Web3.js', 'React', 'Ethereum'],
      author: 'Test User 3',
      github_url: 'https://github.com/user/blockchain-voting'
    }
  ]

  const addTechnology = () => {
    if (techInput.trim() && !project.technologies.includes(techInput.trim())) {
      setProject(prev => ({
        ...prev,
        technologies: [...prev.technologies, techInput.trim()]
      }))
      setTechInput('')
    }
  }

  const removeTechnology = (tech: string) => {
    setProject(prev => ({
      ...prev,
      technologies: prev.technologies.filter(t => t !== tech)
    }))
  }

  const loadSampleProject = (sampleProject: Project) => {
    setProject(sampleProject)
  }

  const clearProject = () => {
    setProject({
      title: '',
      description: '',
      technologies: [],
      author: '',
      github_url: '',
      demo_url: ''
    })
  }

  const runBatchCheck = async () => {
    setIsBatchChecking(true)
    setBatchError(null)
    setBatchResults([])
    setBatchSummary(null)

    try {
      const response = await fetch('/api/plagiarism/batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          includeAll: true 
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to run batch check')
      }

      if (data.success) {
        setBatchResults(data.results || [])
        setBatchSummary(data.summary)
      } else {
        throw new Error('Invalid response format')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setBatchError(errorMessage)
      console.error('Batch check error:', err)
    } finally {
      setIsBatchChecking(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ORIGINAL':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'SUSPICIOUS':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'PLAGIARIZED':
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Shield className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'ORIGINAL':
        return 'default' as const
      case 'SUSPICIOUS':
        return 'secondary' as const
      case 'PLAGIARIZED':
        return 'destructive' as const
      default:
        return 'outline' as const
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            HackConnect Plagiarism Checker
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Advanced AI-powered plagiarism detection system for project submissions
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-white">5+</p>
                  <p className="text-sm text-gray-300">Algorithms</p>
                </div>
                <Zap className="h-8 w-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-white">99%</p>
                  <p className="text-sm text-gray-300">Accuracy</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-white">&lt;2s</p>
                  <p className="text-sm text-gray-300">Check Time</p>
                </div>
                <Clock className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-white">1000+</p>
                  <p className="text-sm text-gray-300">Projects</p>
                </div>
                <Database className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-white/10 backdrop-blur-md">
            <TabsTrigger value="single" className="data-[state=active]:bg-white/20">
              Single Project Check
            </TabsTrigger>
            <TabsTrigger value="batch" className="data-[state=active]:bg-white/20">
              Batch Analysis
            </TabsTrigger>
          </TabsList>

          {/* Single Project Check */}
          <TabsContent value="single" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Project Input Form */}
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center space-x-2">
                    <FileText className="h-5 w-5" />
                    <span>Project Details</span>
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    Enter project information for plagiarism analysis
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-white">Project Title</Label>
                    <Input
                      id="title"
                      value={project.title}
                      onChange={(e) => setProject(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter project title..."
                      className="bg-white/5 border-white/20 text-white placeholder:text-gray-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="author" className="text-white">Author</Label>
                    <Input
                      id="author"
                      value={project.author}
                      onChange={(e) => setProject(prev => ({ ...prev, author: e.target.value }))}
                      placeholder="Enter author name..."
                      className="bg-white/5 border-white/20 text-white placeholder:text-gray-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-white">Description</Label>
                    <Textarea
                      id="description"
                      value={project.description}
                      onChange={(e) => setProject(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Enter detailed project description..."
                      rows={4}
                      className="bg-white/5 border-white/20 text-white placeholder:text-gray-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">Technologies</Label>
                    <div className="flex space-x-2">
                      <Input
                        value={techInput}
                        onChange={(e) => setTechInput(e.target.value)}
                        placeholder="Add technology..."
                        onKeyPress={(e) => e.key === 'Enter' && addTechnology()}
                        className="bg-white/5 border-white/20 text-white placeholder:text-gray-400"
                      />
                      <Button onClick={addTechnology} size="sm">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {project.technologies.map((tech, index) => (
                        <Badge 
                          key={index} 
                          variant="secondary" 
                          className="cursor-pointer hover:bg-red-500"
                          onClick={() => removeTechnology(tech)}
                        >
                          {tech} ×
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label htmlFor="github" className="text-white">GitHub URL</Label>
                      <Input
                        id="github"
                        value={project.github_url}
                        onChange={(e) => setProject(prev => ({ ...prev, github_url: e.target.value }))}
                        placeholder="https://github.com/..."
                        className="bg-white/5 border-white/20 text-white placeholder:text-gray-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="demo" className="text-white">Demo URL</Label>
                      <Input
                        id="demo"
                        value={project.demo_url}
                        onChange={(e) => setProject(prev => ({ ...prev, demo_url: e.target.value }))}
                        placeholder="https://demo.com/..."
                        className="bg-white/5 border-white/20 text-white placeholder:text-gray-400"
                      />
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button onClick={clearProject} variant="outline" className="flex-1">
                      Clear
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Sample Projects */}
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Sample Projects</CardTitle>
                  <CardDescription className="text-gray-300">
                    Quick test with pre-loaded project data
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {sampleProjects.map((sample, index) => (
                    <div 
                      key={index}
                      className="p-3 bg-white/5 rounded-lg border border-white/10 cursor-pointer hover:bg-white/10 transition-colors"
                      onClick={() => loadSampleProject(sample)}
                    >
                      <h4 className="font-medium text-white">{sample.title}</h4>
                      <p className="text-sm text-gray-300 line-clamp-2">{sample.description}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {sample.technologies.slice(0, 3).map((tech, techIndex) => (
                          <Badge key={techIndex} variant="outline" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                        {sample.technologies.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{sample.technologies.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Plagiarism Checker Component */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardContent className="pt-6">
                <PlagiarismChecker 
                  project={project.title ? project : undefined}
                  showFullInterface={true}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Batch Analysis */}
          <TabsContent value="batch" className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Batch Plagiarism Analysis</span>
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Analyze multiple projects simultaneously for plagiarism detection
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={runBatchCheck} 
                  disabled={isBatchChecking}
                  size="lg"
                  className="w-full"
                >
                  {isBatchChecking ? (
                    <>
                      <Search className="mr-2 h-4 w-4 animate-spin" />
                      Running Batch Analysis...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Run Batch Check
                    </>
                  )}
                </Button>

                {batchError && (
                  <Alert variant="destructive">
                    <XCircle className="h-4 w-4" />
                    <AlertTitle>Batch Check Failed</AlertTitle>
                    <AlertDescription>{batchError}</AlertDescription>
                  </Alert>
                )}

                {batchSummary && (
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <Card className="bg-white/5">
                      <CardContent className="pt-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-white">{batchSummary.totalProjects}</p>
                          <p className="text-xs text-gray-300">Total Projects</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="bg-white/5">
                      <CardContent className="pt-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-green-400">{batchSummary.originalProjects}</p>
                          <p className="text-xs text-gray-300">Original</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="bg-white/5">
                      <CardContent className="pt-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-yellow-400">{batchSummary.suspiciousProjects}</p>
                          <p className="text-xs text-gray-300">Suspicious</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="bg-white/5">
                      <CardContent className="pt-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-red-400">{batchSummary.plagiarizedProjects}</p>
                          <p className="text-xs text-gray-300">Plagiarized</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="bg-white/5">
                      <CardContent className="pt-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-blue-400">{batchSummary.averageScore}%</p>
                          <p className="text-xs text-gray-300">Avg Score</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {batchResults.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-white">Results</h3>
                    {batchResults.map((result, index) => (
                      <Card key={index} className="bg-white/5">
                        <CardContent className="pt-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium text-white">{result.projectTitle}</h4>
                              <p className="text-sm text-gray-300">by {result.author}</p>
                            </div>
                            <div className="flex items-center space-x-3">
                              <div className="text-right">
                                <p className="text-lg font-bold text-white">{result.result.similarity}%</p>
                                <p className="text-xs text-gray-300">{result.result.matches.length} matches</p>
                              </div>
                              <div className="flex items-center space-x-2">
                                {getStatusIcon(result.result.status)}
                                <Badge variant={getStatusBadgeVariant(result.result.status)}>
                                  {result.result.status}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
