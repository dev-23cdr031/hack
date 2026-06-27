'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Shield, 
  AlertTriangle, 
  XCircle, 
  CheckCircle, 
  Search, 
  Clock, 
  FileText, 
  Users, 
  ExternalLink,
  Lightbulb,
  TrendingUp,
  Eye,
  RefreshCw
} from 'lucide-react'

interface PlagiarismMatch {
  sourceText: string
  matchedText: string
  similarity: number
  sourceProject: {
    id: string
    title: string
    author: string
    url?: string
  }
  startIndex: number
  endIndex: number
  algorithm: string
}

interface PlagiarismResult {
  similarity: number
  status: 'ORIGINAL' | 'SUSPICIOUS' | 'PLAGIARIZED'
  matches: PlagiarismMatch[]
  overallScore: number
  recommendations: string[]
}

interface PlagiarismCheckerProps {
  project?: {
    id?: string
    title: string
    description: string
    technologies: string[]
    author?: string
    github_url?: string
    demo_url?: string
  }
  onCheck?: (result: PlagiarismResult) => void
  showFullInterface?: boolean
}

export function PlagiarismChecker({ 
  project, 
  onCheck, 
  showFullInterface = true 
}: PlagiarismCheckerProps) {
  const [isChecking, setIsChecking] = useState(false)
  const [result, setResult] = useState<PlagiarismResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('overview')

  const checkPlagiarism = async () => {
    if (!project) {
      setError('No project data provided')
      return
    }

    setIsChecking(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch('/api/plagiarism/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ project }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to check plagiarism')
      }

      if (data.success && data.result) {
        setResult(data.result)
        onCheck?.(data.result)
      } else {
        throw new Error('Invalid response format')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      console.error('Plagiarism check error:', err)
    } finally {
      setIsChecking(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ORIGINAL':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'SUSPICIOUS':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case 'PLAGIARIZED':
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <Shield className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ORIGINAL':
        return 'bg-green-500'
      case 'SUSPICIOUS':
        return 'bg-yellow-500'
      case 'PLAGIARIZED':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
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

  if (!showFullInterface) {
    return (
      <div className="space-y-4">
        <Button 
          onClick={checkPlagiarism} 
          disabled={isChecking || !project}
          className="w-full"
        >
          {isChecking ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Checking for Plagiarism...
            </>
          ) : (
            <>
              <Search className="mr-2 h-4 w-4" />
              Check Plagiarism
            </>
          )}
        </Button>

        {error && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {result && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(result.status)}
                  <span className="font-semibold">{result.status}</span>
                </div>
                <Badge variant={getStatusBadgeVariant(result.status)}>
                  {result.similarity}% Similar
                </Badge>
              </div>
              <Progress 
                value={result.similarity} 
                className="mb-2"
              />
              <p className="text-sm text-muted-foreground">
                {result.matches.length} potential matches found
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-6 w-6 text-blue-500" />
            <span>Plagiarism Checker</span>
          </CardTitle>
          <CardDescription>
            Advanced AI-powered plagiarism detection for project submissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="font-medium">{project?.title || 'No project selected'}</p>
              <p className="text-sm text-muted-foreground">
                {project?.author || 'Unknown author'}
              </p>
            </div>
            <Button 
              onClick={checkPlagiarism} 
              disabled={isChecking || !project}
              size="lg"
            >
              {isChecking ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Run Check
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertTitle>Plagiarism Check Failed</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Results */}
      {result && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="matches">Matches</TabsTrigger>
            <TabsTrigger value="recommendations">Tips</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold">{result.similarity}%</p>
                      <p className="text-sm text-muted-foreground">Similarity Score</p>
                    </div>
                    {getStatusIcon(result.status)}
                  </div>
                  <Progress 
                    value={result.similarity} 
                    className={`mt-2 ${getStatusColor(result.status)}`}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold">{result.matches.length}</p>
                      <p className="text-sm text-muted-foreground">Matches Found</p>
                    </div>
                    <FileText className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold">{result.status}</p>
                      <p className="text-sm text-muted-foreground">Status</p>
                    </div>
                    <Badge variant={getStatusBadgeVariant(result.status)} className="text-xs">
                      {result.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Status Alert */}
            <Alert className={`border-l-4 ${
              result.status === 'PLAGIARIZED' ? 'border-red-500 bg-red-50' :
              result.status === 'SUSPICIOUS' ? 'border-yellow-500 bg-yellow-50' :
              'border-green-500 bg-green-50'
            }`}>
              {getStatusIcon(result.status)}
              <AlertTitle>
                {result.status === 'PLAGIARIZED' ? 'High Similarity Detected' :
                 result.status === 'SUSPICIOUS' ? 'Moderate Similarity Found' :
                 'Original Content Confirmed'}
              </AlertTitle>
              <AlertDescription>
                {result.status === 'PLAGIARIZED' 
                  ? 'This project shows significant similarity to existing submissions. Please review and revise.'
                  : result.status === 'SUSPICIOUS'
                  ? 'Some similarities detected. Consider reviewing highlighted sections for originality.'
                  : 'Great! This project appears to be original and unique.'}
              </AlertDescription>
            </Alert>
          </TabsContent>

          {/* Matches Tab */}
          <TabsContent value="matches" className="space-y-4">
            {result.matches.length > 0 ? (
              <div className="space-y-4">
                {result.matches.map((match, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">
                          Match #{index + 1}
                        </CardTitle>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{match.algorithm}</Badge>
                          <Badge variant={
                            match.similarity >= 80 ? 'destructive' :
                            match.similarity >= 60 ? 'secondary' : 'default'
                          }>
                            {match.similarity}%
                          </Badge>
                        </div>
                      </div>
                      <CardDescription>
                        Similar to: <strong>{match.sourceProject.title}</strong> by {match.sourceProject.author}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-sm text-muted-foreground mb-2">Your Text:</h4>
                          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                            <p className="text-sm">{match.sourceText}</p>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium text-sm text-muted-foreground mb-2">Similar Text:</h4>
                          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                            <p className="text-sm">{match.matchedText}</p>
                          </div>
                        </div>
                      </div>
                      {match.sourceProject.url && (
                        <div className="flex items-center space-x-2">
                          <ExternalLink className="h-4 w-4 text-blue-500" />
                          <a 
                            href={match.sourceProject.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline text-sm"
                          >
                            View Source Project
                          </a>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6 text-center">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Matches Found</h3>
                  <p className="text-muted-foreground">
                    Your project appears to be original with no significant similarities detected.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Recommendations Tab */}
          <TabsContent value="recommendations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lightbulb className="h-5 w-5 text-yellow-500" />
                  <span>Recommendations</span>
                </CardTitle>
                <CardDescription>
                  Tips to improve originality and avoid plagiarism
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {result.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-blue-600">{index + 1}</span>
                      </div>
                      <p className="text-sm">{rec}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* General Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  <span>Best Practices</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <Eye className="h-4 w-4 text-blue-500 mt-1" />
                    <div>
                      <p className="font-medium text-sm">Focus on Unique Value</p>
                      <p className="text-xs text-muted-foreground">Highlight what makes your project different from existing solutions</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Users className="h-4 w-4 text-green-500 mt-1" />
                    <div>
                      <p className="font-medium text-sm">Personal Experience</p>
                      <p className="text-xs text-muted-foreground">Include your personal insights and lessons learned</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Clock className="h-4 w-4 text-purple-500 mt-1" />
                    <div>
                      <p className="font-medium text-sm">Implementation Details</p>
                      <p className="text-xs text-muted-foreground">Describe your specific approach and technical decisions</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Details Tab */}
          <TabsContent value="details" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Analysis Details</CardTitle>
                <CardDescription>
                  Technical information about the plagiarism detection process
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Overall Score</p>
                    <p className="text-2xl font-bold">{result.overallScore}%</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Status</p>
                    <Badge variant={getStatusBadgeVariant(result.status)}>
                      {result.status}
                    </Badge>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Algorithms Used</p>
                  <div className="flex flex-wrap gap-2">
                    {Array.from(new Set(result.matches.map(m => m.algorithm))).map((algorithm, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {algorithm}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Project Information</p>
                  <div className="space-y-2 text-sm">
                    <p><strong>Title:</strong> {project?.title}</p>
                    <p><strong>Author:</strong> {project?.author || 'Unknown'}</p>
                    <p><strong>Technologies:</strong> {project?.technologies?.join(', ') || 'None specified'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
