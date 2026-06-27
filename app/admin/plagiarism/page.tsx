'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { 
  Shield, 
  Search, 
  Users, 
  TrendingUp, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Download,
  RefreshCw,
  Filter,
  BarChart3,
  FileText,
  Eye,
  ExternalLink
} from 'lucide-react'

interface BatchResult {
  projectId: string
  projectTitle: string
  author: string
  result: {
    similarity: number
    status: 'ORIGINAL' | 'SUSPICIOUS' | 'PLAGIARIZED'
    matches: any[]
    overallScore: number
    recommendations: string[]
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

export default function AdminPlagiarismPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [batchResults, setBatchResults] = useState<BatchResult[]>([])
  const [batchSummary, setBatchSummary] = useState<BatchSummary | null>(null)
  const [isRunningBatch, setIsRunningBatch] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')

  // Filtered results based on status and search
  const filteredResults = batchResults.filter(result => {
    const matchesStatus = filterStatus === 'all' || result.result.status.toLowerCase() === filterStatus.toLowerCase()
    const matchesSearch = result.projectTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         result.author.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const runBatchAnalysis = async () => {
    setIsRunningBatch(true)
    setError(null)
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
        throw new Error(data.error || 'Failed to run batch analysis')
      }

      if (data.success) {
        setBatchResults(data.results || [])
        setBatchSummary(data.summary)
        setActiveTab('results')
      } else {
        throw new Error('Invalid response format')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      console.error('Batch analysis error:', err)
    } finally {
      setIsRunningBatch(false)
    }
  }

  const exportResults = () => {
    if (batchResults.length === 0) return

    const csvContent = [
      ['Project Title', 'Author', 'Similarity %', 'Status', 'Matches', 'Processing Time (ms)'],
      ...batchResults.map(result => [
        result.projectTitle,
        result.author,
        result.result.similarity,
        result.result.status,
        result.result.matches.length,
        result.processingTime
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `plagiarism-analysis-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ORIGINAL':
        return 'text-green-500'
      case 'SUSPICIOUS':
        return 'text-yellow-500'
      case 'PLAGIARIZED':
        return 'text-red-500'
      default:
        return 'text-gray-500'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Admin Plagiarism Dashboard
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Monitor and analyze plagiarism across all project submissions
          </p>
        </div>

        {/* Quick Stats */}
        {batchSummary && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-white">{batchSummary.totalProjects}</p>
                    <p className="text-sm text-gray-300">Total Projects</p>
                  </div>
                  <FileText className="h-8 w-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-green-400">{batchSummary.originalProjects}</p>
                    <p className="text-sm text-gray-300">Original</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-yellow-400">{batchSummary.suspiciousProjects}</p>
                    <p className="text-sm text-gray-300">Suspicious</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-yellow-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-red-400">{batchSummary.plagiarizedProjects}</p>
                    <p className="text-sm text-gray-300">Plagiarized</p>
                  </div>
                  <XCircle className="h-8 w-8 text-red-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-purple-400">{batchSummary.averageScore}%</p>
                    <p className="text-sm text-gray-300">Avg Similarity</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-purple-400" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white/10 backdrop-blur-md">
            <TabsTrigger value="overview" className="data-[state=active]:bg-white/20">
              Overview
            </TabsTrigger>
            <TabsTrigger value="results" className="data-[state=active]:bg-white/20">
              Analysis Results
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-white/20">
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Shield className="h-6 w-6" />
                  <span>Plagiarism Analysis Control</span>
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Run comprehensive plagiarism analysis across all project submissions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={runBatchAnalysis} 
                  disabled={isRunningBatch}
                  size="lg"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {isRunningBatch ? (
                    <>
                      <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                      Running Analysis...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-5 w-5" />
                      Run Batch Analysis
                    </>
                  )}
                </Button>

                {error && (
                  <Alert variant="destructive">
                    <XCircle className="h-4 w-4" />
                    <AlertTitle>Analysis Failed</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <Card className="bg-white/5">
                    <CardHeader>
                      <CardTitle className="text-white text-lg">Analysis Features</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                        <span className="text-gray-300">Multi-algorithm detection</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                        <span className="text-gray-300">Real-time similarity scoring</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                        <span className="text-gray-300">Detailed match analysis</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                        <span className="text-gray-300">Comprehensive reporting</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/5">
                    <CardHeader>
                      <CardTitle className="text-white text-lg">Detection Algorithms</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">Cosine Similarity</Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">Jaccard Similarity</Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">Levenshtein Distance</Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">N-gram Analysis</Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">Technology Stack Matching</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Results Tab */}
          <TabsContent value="results" className="space-y-6">
            {batchResults.length > 0 && (
              <>
                {/* Filters and Search */}
                <Card className="bg-white/10 backdrop-blur-md border-white/20">
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <Filter className="h-4 w-4 text-gray-300" />
                          <Label className="text-white">Filter by Status:</Label>
                        </div>
                        <select 
                          value={filterStatus} 
                          onChange={(e) => setFilterStatus(e.target.value)}
                          className="bg-gray-800 border-gray-700 text-white rounded px-3 py-1"
                        >
                          <option value="all">All</option>
                          <option value="original">Original</option>
                          <option value="suspicious">Suspicious</option>
                          <option value="plagiarized">Plagiarized</option>
                        </select>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <Search className="h-4 w-4 text-gray-300" />
                          <Input
                            placeholder="Search projects or authors..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-gray-800 border-gray-700 text-white w-64"
                          />
                        </div>
                        <Button onClick={exportResults} variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Export CSV
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Results List */}
                <div className="space-y-4">
                  {filteredResults.map((result, index) => (
                    <Card key={index} className="bg-white/10 backdrop-blur-md border-white/20">
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              {getStatusIcon(result.result.status)}
                              <h3 className="text-lg font-semibold text-white">{result.projectTitle}</h3>
                              <Badge variant={getStatusBadgeVariant(result.result.status)}>
                                {result.result.status}
                              </Badge>
                            </div>
                            <p className="text-gray-300 mb-2">by {result.author}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-400">
                              <span>Similarity: {result.result.similarity}%</span>
                              <span>Matches: {result.result.matches.length}</span>
                              <span>Processing: {result.processingTime}ms</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <div className="w-32">
                                <Progress 
                                  value={result.result.similarity} 
                                  className="mb-1"
                                />
                                <p className={`text-sm font-bold ${getStatusColor(result.result.status)}`}>
                                  {result.result.similarity}%
                                </p>
                              </div>
                            </div>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Button>
                          </div>
                        </div>

                        {result.result.matches.length > 0 && (
                          <div className="mt-4 p-3 bg-white/5 rounded-lg">
                            <h4 className="text-sm font-medium text-white mb-2">Top Matches:</h4>
                            <div className="space-y-1">
                              {result.result.matches.slice(0, 2).map((match, matchIndex) => (
                                <div key={matchIndex} className="text-xs text-gray-400">
                                  <span className="font-medium">{match.sourceProject?.title}</span> 
                                  <span className="ml-2">({match.similarity}% similar)</span>
                                </div>
                              ))}
                              {result.result.matches.length > 2 && (
                                <p className="text-xs text-gray-500">
                                  +{result.result.matches.length - 2} more matches
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {filteredResults.length === 0 && (
                  <Card className="bg-white/10 backdrop-blur-md border-white/20">
                    <CardContent className="pt-6 text-center">
                      <Search className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-white mb-2">No Results Found</h3>
                      <p className="text-gray-300">
                        No projects match your current filter criteria.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </>
            )}

            {batchResults.length === 0 && !isRunningBatch && (
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardContent className="pt-6 text-center">
                  <BarChart3 className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">No Analysis Results</h3>
                  <p className="text-gray-300 mb-4">
                    Run a batch analysis to see plagiarism detection results.
                  </p>
                  <Button onClick={() => setActiveTab('overview')}>
                    Go to Overview
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Plagiarism Analytics</CardTitle>
                <CardDescription className="text-gray-300">
                  Detailed insights and trends from plagiarism analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                {batchSummary ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-white">Distribution</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300">Original Projects</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-24 bg-gray-700 rounded-full h-2">
                              <div 
                                className="bg-green-500 h-2 rounded-full" 
                                style={{ width: `${(batchSummary.originalProjects / batchSummary.totalProjects) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-white text-sm">{batchSummary.originalProjects}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300">Suspicious Projects</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-24 bg-gray-700 rounded-full h-2">
                              <div 
                                className="bg-yellow-500 h-2 rounded-full" 
                                style={{ width: `${(batchSummary.suspiciousProjects / batchSummary.totalProjects) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-white text-sm">{batchSummary.suspiciousProjects}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300">Plagiarized Projects</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-24 bg-gray-700 rounded-full h-2">
                              <div 
                                className="bg-red-500 h-2 rounded-full" 
                                style={{ width: `${(batchSummary.plagiarizedProjects / batchSummary.totalProjects) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-white text-sm">{batchSummary.plagiarizedProjects}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-white">Performance Metrics</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-300">Average Similarity Score</span>
                          <span className="text-white font-semibold">{batchSummary.averageScore}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Total Processing Time</span>
                          <span className="text-white font-semibold">{batchSummary.processingTime}ms</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Average Time per Project</span>
                          <span className="text-white font-semibold">
                            {Math.round(batchSummary.processingTime / batchSummary.totalProjects)}ms
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Originality Rate</span>
                          <span className="text-white font-semibold">
                            {Math.round((batchSummary.originalProjects / batchSummary.totalProjects) * 100)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <TrendingUp className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">No Analytics Data</h3>
                    <p className="text-gray-300">
                      Run a batch analysis to generate analytics insights.
                    </p>
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
