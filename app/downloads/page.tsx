"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Download,
  File,
  FileText,
  FileImage,
  FileVideo,
  FileAudio,
  FileCode,
  Archive,
  Trash2,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Share2,
  FolderOpen,
  Calendar,
  Clock,
  HardDrive,
  CloudDownload,
  CheckCircle,
  XCircle,
  AlertCircle,
  Pause,
  Play,
  RotateCcw,
  ArrowLeft,
  Grid3X3,
  List,
  SortAsc,
  SortDesc,
  Folder,
  Star,
  Heart,
  ExternalLink,
  Copy,
  Check,
  Zap,
  Smartphone,
  Monitor,
  Globe,
  Users,
  Code,
  Palette,
  Settings,
  BookOpen,
  Video,
  Mic,
  Camera,
  Package,
} from "lucide-react"
import Link from "next/link"

interface DownloadItem {
  id: string
  name: string
  type: 'document' | 'image' | 'video' | 'audio' | 'code' | 'archive' | 'other'
  size: number
  downloadedAt: string
  source: string
  status: 'completed' | 'downloading' | 'paused' | 'failed'
  progress?: number
  url?: string
  category: string
  tags: string[]
  isFavorite: boolean
}

interface DownloadCategory {
  id: string
  name: string
  icon: any
  count: number
  color: string
}

export default function DownloadsPage() {
  const [downloads, setDownloads] = useState<DownloadItem[]>([])
  const [filteredDownloads, setFilteredDownloads] = useState<DownloadItem[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [selectedItems, setSelectedItems] = useState<string[]>([])

  const mockDownloads: DownloadItem[] = [
    {
      id: "1",
      name: "HackConnect_API_Documentation.pdf",
      type: "document",
      size: 2457600, // 2.4 MB
      downloadedAt: "2024-10-05T18:30:00Z",
      source: "Documentation",
      status: "completed",
      category: "Documentation",
      tags: ["api", "docs", "reference"],
      isFavorite: true
    },
    {
      id: "2",
      name: "Team_Meeting_Recording_Oct5.mp4",
      type: "video",
      size: 157286400, // 150 MB
      downloadedAt: "2024-10-05T17:45:00Z",
      source: "Video Calls",
      status: "completed",
      category: "Meetings",
      tags: ["meeting", "recording", "team"],
      isFavorite: false
    },
    {
      id: "3",
      name: "Project_Screenshots.zip",
      type: "archive",
      size: 15728640, // 15 MB
      downloadedAt: "2024-10-05T16:20:00Z",
      source: "File Sharing",
      status: "completed",
      category: "Projects",
      tags: ["screenshots", "ui", "design"],
      isFavorite: true
    },
    {
      id: "4",
      name: "hackathon_submission.zip",
      type: "archive",
      size: 52428800, // 50 MB
      downloadedAt: "2024-10-05T15:10:00Z",
      source: "Hackathons",
      status: "downloading",
      progress: 75,
      category: "Projects",
      tags: ["hackathon", "code", "submission"],
      isFavorite: false
    },
    {
      id: "5",
      name: "Profile_Avatar.png",
      type: "image",
      size: 524288, // 512 KB
      downloadedAt: "2024-10-05T14:30:00Z",
      source: "Profile",
      status: "completed",
      category: "Images",
      tags: ["avatar", "profile", "image"],
      isFavorite: false
    },
    {
      id: "6",
      name: "React_Components_Library.zip",
      type: "code",
      size: 10485760, // 10 MB
      downloadedAt: "2024-10-05T13:45:00Z",
      source: "Code Hub",
      status: "completed",
      category: "Development",
      tags: ["react", "components", "library"],
      isFavorite: true
    },
    {
      id: "7",
      name: "Presentation_Slides.pptx",
      type: "document",
      size: 8388608, // 8 MB
      downloadedAt: "2024-10-05T12:20:00Z",
      source: "Meetings",
      status: "failed",
      category: "Documents",
      tags: ["presentation", "slides", "meeting"],
      isFavorite: false
    },
    {
      id: "8",
      name: "Background_Music.mp3",
      type: "audio",
      size: 4194304, // 4 MB
      downloadedAt: "2024-10-05T11:15:00Z",
      source: "Media",
      status: "completed",
      category: "Audio",
      tags: ["music", "background", "audio"],
      isFavorite: false
    }
  ]

  const categories: DownloadCategory[] = [
    {
      id: "all",
      name: "All Downloads",
      icon: Download,
      count: mockDownloads.length,
      color: "from-purple-500 to-blue-500"
    },
    {
      id: "documents",
      name: "Documents",
      icon: FileText,
      count: mockDownloads.filter(d => d.type === 'document').length,
      color: "from-blue-500 to-cyan-500"
    },
    {
      id: "images",
      name: "Images",
      icon: FileImage,
      count: mockDownloads.filter(d => d.type === 'image').length,
      color: "from-green-500 to-teal-500"
    },
    {
      id: "videos",
      name: "Videos",
      icon: FileVideo,
      count: mockDownloads.filter(d => d.type === 'video').length,
      color: "from-red-500 to-pink-500"
    },
    {
      id: "audio",
      name: "Audio",
      icon: FileAudio,
      count: mockDownloads.filter(d => d.type === 'audio').length,
      color: "from-yellow-500 to-orange-500"
    },
    {
      id: "code",
      name: "Code",
      icon: FileCode,
      count: mockDownloads.filter(d => d.type === 'code').length,
      color: "from-indigo-500 to-purple-500"
    },
    {
      id: "archives",
      name: "Archives",
      icon: Archive,
      count: mockDownloads.filter(d => d.type === 'archive').length,
      color: "from-gray-500 to-slate-500"
    }
  ]

  useEffect(() => {
    setDownloads(mockDownloads)
  }, [])

  useEffect(() => {
    let filtered = downloads

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(download =>
        download.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        download.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        download.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Apply category filter
    if (selectedCategory !== "all") {
      const categoryMap: { [key: string]: string } = {
        documents: 'document',
        images: 'image',
        videos: 'video',
        audio: 'audio',
        code: 'code',
        archives: 'archive'
      }
      filtered = filtered.filter(download => download.type === categoryMap[selectedCategory])
    }

    // Apply status filter
    if (selectedStatus !== "all") {
      filtered = filtered.filter(download => download.status === selectedStatus)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name)
          break
        case 'date':
          comparison = new Date(a.downloadedAt).getTime() - new Date(b.downloadedAt).getTime()
          break
        case 'size':
          comparison = a.size - b.size
          break
      }
      return sortOrder === 'asc' ? comparison : -comparison
    })

    setFilteredDownloads(filtered)
  }, [downloads, searchTerm, selectedCategory, selectedStatus, sortBy, sortOrder])

  const getFileIcon = (type: string, status: string) => {
    const iconClass = `w-5 h-5 ${
      status === 'failed' ? 'text-red-400' :
      status === 'downloading' ? 'text-blue-400' :
      status === 'paused' ? 'text-yellow-400' : 'text-gray-400'
    }`

    switch (type) {
      case 'document': return <FileText className={iconClass} />
      case 'image': return <FileImage className={iconClass} />
      case 'video': return <FileVideo className={iconClass} />
      case 'audio': return <FileAudio className={iconClass} />
      case 'code': return <FileCode className={iconClass} />
      case 'archive': return <Archive className={iconClass} />
      default: return <File className={iconClass} />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Completed</Badge>
      case 'downloading':
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Downloading</Badge>
      case 'paused':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Paused</Badge>
      case 'failed':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Failed</Badge>
      default:
        return null
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }
  }

  const toggleFavorite = (id: string) => {
    setDownloads(prev =>
      prev.map(download =>
        download.id === id ? { ...download, isFavorite: !download.isFavorite } : download
      )
    )
  }

  const deleteDownload = (id: string) => {
    setDownloads(prev => prev.filter(download => download.id !== id))
  }

  const retryDownload = (id: string) => {
    setDownloads(prev =>
      prev.map(download =>
        download.id === id ? { ...download, status: 'downloading', progress: 0 } : download
      )
    )
  }

  const toggleItemSelection = (id: string) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    )
  }

  const deleteSelected = () => {
    setDownloads(prev => prev.filter(download => !selectedItems.includes(download.id)))
    setSelectedItems([])
  }

  const totalSize = downloads.reduce((sum, download) => sum + download.size, 0)
  const completedCount = downloads.filter(d => d.status === 'completed').length
  const downloadingCount = downloads.filter(d => d.status === 'downloading').length
  const failedCount = downloads.filter(d => d.status === 'failed').length

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Header */}
      <div className="sticky top-0 z-40 backdrop-blur-xl bg-black/20 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="flex items-center gap-3">
                <Download className="w-8 h-8 text-purple-400" />
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
                    Downloads
                  </h1>
                  <p className="text-sm text-gray-400">Manage your downloaded files and media</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {selectedItems.length > 0 && (
                <Button
                  onClick={deleteSelected}
                  variant="ghost"
                  size="sm"
                  className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete ({selectedItems.length})
                </Button>
              )}
              <Button
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white hover:bg-white/10"
              >
                {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid3X3 className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search downloads..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm"
                />
              </div>

              {/* Stats */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                  <HardDrive className="w-4 h-4" />
                  Storage Stats
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Total Size</span>
                    <span className="text-sm font-medium text-white">{formatFileSize(totalSize)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Files</span>
                    <span className="text-sm font-medium text-white">{downloads.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Completed</span>
                    <span className="text-sm font-medium text-green-400">{completedCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Downloading</span>
                    <span className="text-sm font-medium text-blue-400">{downloadingCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Failed</span>
                    <span className="text-sm font-medium text-red-400">{failedCount}</span>
                  </div>
                </div>
              </div>

              {/* Categories */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                  <Folder className="w-4 h-4" />
                  Categories
                </h3>
                <div className="space-y-1">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full flex items-center justify-between p-2 rounded-lg text-sm transition-all duration-200 ${
                        selectedCategory === category.id
                          ? "bg-purple-600/30 text-purple-200 border border-purple-500/30"
                          : "text-gray-300 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <category.icon className="w-4 h-4" />
                        <span>{category.name}</span>
                      </div>
                      <Badge variant="secondary" className="bg-gray-700/50 text-gray-300 text-xs">
                        {category.count}
                      </Badge>
                    </button>
                  ))}
                </div>
              </div>

              {/* Status Filter */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Status
                </h3>
                <div className="space-y-1">
                  {['all', 'completed', 'downloading', 'paused', 'failed'].map((status) => (
                    <button
                      key={status}
                      onClick={() => setSelectedStatus(status)}
                      className={`w-full text-left p-2 rounded-lg text-sm transition-all duration-200 ${
                        selectedStatus === status
                          ? "bg-purple-600/30 text-purple-200 border border-purple-500/30"
                          : "text-gray-300 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Controls */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-bold text-white">
                  {selectedCategory === "all" ? "All Downloads" : categories.find(c => c.id === selectedCategory)?.name}
                </h2>
                <span className="text-sm text-gray-400">({filteredDownloads.length} items)</span>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="date" className="bg-gray-800">Date</option>
                  <option value="name" className="bg-gray-800">Name</option>
                  <option value="size" className="bg-gray-800">Size</option>
                </select>
                <Button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white hover:bg-white/10"
                >
                  {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            {/* Downloads List/Grid */}
            {filteredDownloads.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Download className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-300 mb-2">No downloads found</h3>
                <p className="text-gray-500">
                  {searchTerm || selectedCategory !== "all" || selectedStatus !== "all"
                    ? "Try adjusting your search or filters"
                    : "Your downloads will appear here"}
                </p>
              </div>
            ) : (
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4' : 'space-y-3'}>
                {filteredDownloads.map((download) => (
                  <div
                    key={download.id}
                    className={`bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl transition-all duration-300 hover:bg-white/10 hover:border-white/20 ${
                      selectedItems.includes(download.id) ? 'ring-1 ring-purple-500/50 bg-purple-500/10' : ''
                    } ${viewMode === 'grid' ? 'p-4' : 'p-3'}`}
                  >
                    <div className={`flex ${viewMode === 'grid' ? 'flex-col' : 'items-center'} gap-3`}>
                      {/* File Icon & Selection */}
                      <div className={`flex items-center gap-3 ${viewMode === 'grid' ? 'mb-2' : ''}`}>
                        <button
                          onClick={() => toggleItemSelection(download.id)}
                          className={`w-5 h-5 rounded border-2 transition-colors ${
                            selectedItems.includes(download.id)
                              ? 'bg-purple-500 border-purple-500'
                              : 'border-gray-500 hover:border-gray-400'
                          }`}
                        >
                          {selectedItems.includes(download.id) && (
                            <Check className="w-3 h-3 text-white mx-auto" />
                          )}
                        </button>
                        <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
                          {getFileIcon(download.type, download.status)}
                        </div>
                        {viewMode === 'list' && (
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-white truncate">{download.name}</h3>
                            <div className="flex items-center gap-2 text-xs text-gray-400">
                              <span>{formatFileSize(download.size)}</span>
                              <span>•</span>
                              <span>{formatDate(download.downloadedAt)}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {viewMode === 'grid' && (
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-white truncate mb-1">{download.name}</h3>
                          <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                            <span>{formatFileSize(download.size)}</span>
                            <span>•</span>
                            <span>{formatDate(download.downloadedAt)}</span>
                          </div>
                        </div>
                      )}

                      {/* Progress Bar (for downloading items) */}
                      {download.status === 'downloading' && download.progress !== undefined && (
                        <div className="w-full">
                          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                            <span>Downloading...</span>
                            <span>{download.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${download.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      )}

                      {/* Status & Actions */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getStatusBadge(download.status)}
                          {download.isFavorite && <Star className="w-4 h-4 text-yellow-400 fill-current" />}
                        </div>

                        <div className="flex items-center gap-1">
                          <Button
                            onClick={() => toggleFavorite(download.id)}
                            variant="ghost"
                            size="sm"
                            className={`h-8 w-8 p-0 ${download.isFavorite ? 'text-yellow-400' : 'text-gray-400 hover:text-yellow-400'}`}
                          >
                            <Star className={`w-4 h-4 ${download.isFavorite ? 'fill-current' : ''}`} />
                          </Button>
                          
                          {download.status === 'failed' && (
                            <Button
                              onClick={() => retryDownload(download.id)}
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-gray-400 hover:text-blue-400"
                            >
                              <RotateCcw className="w-4 h-4" />
                            </Button>
                          )}

                          <Button
                            onClick={() => deleteDownload(download.id)}
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-gray-400 hover:text-red-400"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Tags */}
                      {viewMode === 'grid' && (
                        <div className="flex flex-wrap gap-1">
                          {download.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="secondary" className="bg-gray-700/50 text-gray-300 text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {download.tags.length > 3 && (
                            <Badge variant="secondary" className="bg-gray-700/50 text-gray-300 text-xs">
                              +{download.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
