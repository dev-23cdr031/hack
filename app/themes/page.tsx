"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Palette,
  Moon,
  Sun,
  Monitor,
  Eye,
  Download,
  Upload,
  Share2,
  Heart,
  Star,
  Check,
  ArrowLeft,
  Sparkles,
  Zap,
  Brush,
  Settings,
  RotateCcw,
  Save,
  Wand2,
  Contrast,
  Accessibility,
  Smartphone,
  Laptop,
  Tablet,
  Code,
  Layers,
  Droplets,
  Circle,
  Square,
  Triangle,
  Hexagon,
  RefreshCw,
  Shuffle,
  Lock,
  Unlock,
  Crown,
  Gift,
} from "lucide-react"
import Link from "next/link"

interface Theme {
  id: string
  name: string
  description: string
  category: 'light' | 'dark' | 'auto' | 'custom'
  isPremium: boolean
  isPopular: boolean
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    surface: string
    text: string
  }
  preview: string
  author?: string
  downloads?: number
  rating?: number
}

interface CustomizationOption {
  id: string
  label: string
  type: 'color' | 'select' | 'range' | 'toggle'
  value: any
  options?: { value: string; label: string }[]
  min?: number
  max?: number
  step?: number
}

export default function ThemesPage() {
  const [selectedTheme, setSelectedTheme] = useState<string>("dark-purple")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [showCustomizer, setShowCustomizer] = useState(false)
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
  const [customizations, setCustomizations] = useState<{ [key: string]: any }>({})
  const [hasChanges, setHasChanges] = useState(false)

  const themes: Theme[] = [
    {
      id: "dark-purple",
      name: "Dark Purple",
      description: "Modern dark theme with purple accents",
      category: "dark",
      isPremium: false,
      isPopular: true,
      colors: {
        primary: "#8b5cf6",
        secondary: "#a855f7",
        accent: "#c084fc",
        background: "#0f172a",
        surface: "#1e293b",
        text: "#f8fafc"
      },
      preview: "from-slate-900 via-purple-900 to-slate-900",
      downloads: 1250,
      rating: 4.9
    },
    {
      id: "light-blue",
      name: "Light Blue",
      description: "Clean light theme with blue accents",
      category: "light",
      isPremium: false,
      isPopular: true,
      colors: {
        primary: "#3b82f6",
        secondary: "#60a5fa",
        accent: "#93c5fd",
        background: "#ffffff",
        surface: "#f8fafc",
        text: "#1e293b"
      },
      preview: "from-blue-50 via-white to-blue-50",
      downloads: 980,
      rating: 4.7
    },
    {
      id: "dark-green",
      name: "Forest Dark",
      description: "Nature-inspired dark theme",
      category: "dark",
      isPremium: true,
      isPopular: false,
      colors: {
        primary: "#10b981",
        secondary: "#34d399",
        accent: "#6ee7b7",
        background: "#064e3b",
        surface: "#065f46",
        text: "#ecfdf5"
      },
      preview: "from-emerald-900 via-green-900 to-emerald-900",
      author: "Nature Studio",
      downloads: 567,
      rating: 4.8
    },
    {
      id: "cyberpunk",
      name: "Cyberpunk Neon",
      description: "Futuristic neon-inspired theme",
      category: "dark",
      isPremium: true,
      isPopular: true,
      colors: {
        primary: "#ff0080",
        secondary: "#00ffff",
        accent: "#ffff00",
        background: "#000011",
        surface: "#1a0033",
        text: "#ffffff"
      },
      preview: "from-black via-purple-900 to-pink-900",
      author: "Cyber Labs",
      downloads: 2100,
      rating: 4.6
    },
    {
      id: "sunset",
      name: "Sunset Gradient",
      description: "Warm sunset colors",
      category: "light",
      isPremium: true,
      isPopular: false,
      colors: {
        primary: "#f97316",
        secondary: "#fb923c",
        accent: "#fdba74",
        background: "#fff7ed",
        surface: "#ffedd5",
        text: "#9a3412"
      },
      preview: "from-orange-200 via-yellow-200 to-red-200",
      author: "Sunset Co.",
      downloads: 423,
      rating: 4.5
    },
    {
      id: "ocean",
      name: "Ocean Depths",
      description: "Deep ocean blue theme",
      category: "dark",
      isPremium: false,
      isPopular: false,
      colors: {
        primary: "#0ea5e9",
        secondary: "#38bdf8",
        accent: "#7dd3fc",
        background: "#0c4a6e",
        surface: "#075985",
        text: "#e0f2fe"
      },
      preview: "from-blue-900 via-cyan-900 to-blue-900",
      downloads: 789,
      rating: 4.4
    }
  ]

  const customizationOptions: CustomizationOption[] = [
    {
      id: "primaryColor",
      label: "Primary Color",
      type: "color",
      value: "#8b5cf6"
    },
    {
      id: "secondaryColor",
      label: "Secondary Color",
      type: "color",
      value: "#a855f7"
    },
    {
      id: "accentColor",
      label: "Accent Color",
      type: "color",
      value: "#c084fc"
    },
    {
      id: "borderRadius",
      label: "Border Radius",
      type: "range",
      value: 8,
      min: 0,
      max: 24,
      step: 2
    },
    {
      id: "fontSize",
      label: "Font Size",
      type: "select",
      value: "medium",
      options: [
        { value: "small", label: "Small" },
        { value: "medium", label: "Medium" },
        { value: "large", label: "Large" },
        { value: "xlarge", label: "Extra Large" }
      ]
    },
    {
      id: "animations",
      label: "Enable Animations",
      type: "toggle",
      value: true
    },
    {
      id: "compactMode",
      label: "Compact Mode",
      type: "toggle",
      value: false
    },
    {
      id: "highContrast",
      label: "High Contrast",
      type: "toggle",
      value: false
    }
  ]

  const categories = [
    { id: "all", label: "All Themes", count: themes.length },
    { id: "light", label: "Light", count: themes.filter(t => t.category === 'light').length },
    { id: "dark", label: "Dark", count: themes.filter(t => t.category === 'dark').length },
    { id: "premium", label: "Premium", count: themes.filter(t => t.isPremium).length },
    { id: "popular", label: "Popular", count: themes.filter(t => t.isPopular).length }
  ]

  const filteredThemes = themes.filter(theme => {
    if (selectedCategory === "all") return true
    if (selectedCategory === "premium") return theme.isPremium
    if (selectedCategory === "popular") return theme.isPopular
    return theme.category === selectedCategory
  })

  const updateCustomization = (optionId: string, value: any) => {
    setCustomizations(prev => ({ ...prev, [optionId]: value }))
    setHasChanges(true)
  }

  const applyTheme = (themeId: string) => {
    setSelectedTheme(themeId)
    setHasChanges(true)
  }

  const saveChanges = () => {
    // Simulate saving
    setHasChanges(false)
    alert("Theme applied successfully!")
  }

  const resetToDefault = () => {
    setSelectedTheme("dark-purple")
    setCustomizations({})
    setHasChanges(false)
  }

  const renderCustomizationOption = (option: CustomizationOption) => {
    const value = customizations[option.id] ?? option.value

    switch (option.type) {
      case 'color':
        return (
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-white">{option.label}</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={value}
                onChange={(e) => updateCustomization(option.id, e.target.value)}
                className="w-8 h-8 rounded border border-white/20 cursor-pointer"
              />
              <span className="text-xs text-gray-400 font-mono">{value}</span>
            </div>
          </div>
        )

      case 'select':
        return (
          <div>
            <label className="text-sm font-medium text-white block mb-2">{option.label}</label>
            <select
              value={value}
              onChange={(e) => updateCustomization(option.id, e.target.value)}
              className="w-full p-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {option.options?.map(opt => (
                <option key={opt.value} value={opt.value} className="bg-gray-800">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        )

      case 'range':
        return (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-white">{option.label}</label>
              <span className="text-sm text-gray-400">{value}px</span>
            </div>
            <input
              type="range"
              min={option.min}
              max={option.max}
              step={option.step}
              value={value}
              onChange={(e) => updateCustomization(option.id, parseInt(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        )

      case 'toggle':
        return (
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-white">{option.label}</label>
            <Button
              onClick={() => updateCustomization(option.id, !value)}
              variant="ghost"
              size="sm"
              className={`p-1 ${value ? 'text-green-400' : 'text-gray-400'}`}
            >
              {value ? <Check className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
            </Button>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Header */}
      <div className="sticky top-0 z-40 backdrop-blur-xl bg-black/20 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0">
              <Link href="/" className="text-gray-400 hover:text-white transition-colors flex-shrink-0">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <Palette className="w-7 h-7 sm:w-8 sm:h-8 text-purple-400 flex-shrink-0" />
                <div className="min-w-0">
                  <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent truncate">
                    Theme Studio
                  </h1>
                  <p className="hidden sm:block text-sm text-gray-400">Customize your HackConnect experience</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              <Button
                onClick={() => setShowCustomizer(!showCustomizer)}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white hover:bg-white/10 px-2"
              >
                <Wand2 className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Customize</span>
              </Button>
              {hasChanges && (
                <>
                  <Button
                    onClick={resetToDefault}
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-white hover:bg-white/10 px-2"
                  >
                    <RotateCcw className="w-4 h-4 sm:mr-2" />
                    <span className="hidden sm:inline">Reset</span>
                  </Button>
                  <Button
                    onClick={saveChanges}
                    size="sm"
                    className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-2 sm:px-4"
                  >
                    <Save className="w-4 h-4 sm:mr-2" />
                    <span className="hidden sm:inline">Apply Theme</span>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Categories */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                  <Layers className="w-4 h-4" />
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
                      <span>{category.label}</span>
                      <Badge variant="secondary" className="bg-gray-700/50 text-gray-300 text-xs">
                        {category.count}
                      </Badge>
                    </button>
                  ))}
                </div>
              </div>

              {/* Preview Mode */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Preview Mode
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'desktop', icon: Monitor, label: 'Desktop' },
                    { id: 'tablet', icon: Tablet, label: 'Tablet' },
                    { id: 'mobile', icon: Smartphone, label: 'Mobile' }
                  ].map((mode) => (
                    <button
                      key={mode.id}
                      onClick={() => setPreviewMode(mode.id as any)}
                      className={`p-2 rounded-lg border transition-all duration-200 ${
                        previewMode === mode.id
                          ? "border-purple-500 bg-purple-500/20 text-purple-200"
                          : "border-white/10 bg-white/5 text-gray-300 hover:border-white/20"
                      }`}
                    >
                      <mode.icon className="w-4 h-4 mx-auto mb-1" />
                      <div className="text-xs">{mode.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-gray-300 mb-3">Quick Actions</h3>
                <div className="space-y-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-gray-400 hover:text-white hover:bg-white/10"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Import Theme
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-gray-400 hover:text-white hover:bg-white/10"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export Theme
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-gray-400 hover:text-white hover:bg-white/10"
                  >
                    <Shuffle className="w-4 h-4 mr-2" />
                    Random Theme
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Current Theme Preview */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-white mb-4">Current Theme</h2>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {themes.find(t => t.id === selectedTheme)?.name}
                    </h3>
                    <p className="text-gray-400">
                      {themes.find(t => t.id === selectedTheme)?.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {themes.find(t => t.id === selectedTheme)?.isPremium && (
                      <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                        <Crown className="w-3 h-3 mr-1" />
                        Premium
                      </Badge>
                    )}
                    {themes.find(t => t.id === selectedTheme)?.isPopular && (
                      <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                        <Star className="w-3 h-3 mr-1" />
                        Popular
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Theme Preview */}
                <div className={`h-48 rounded-lg bg-gradient-to-br ${themes.find(t => t.id === selectedTheme)?.preview} border border-white/20 flex items-center justify-center`}>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3 backdrop-blur-sm">
                      <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="text-white font-semibold">Theme Preview</h4>
                    <p className="text-white/70 text-sm">Your customized experience</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Theme Gallery */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Theme Gallery</h2>
                <div className="text-sm text-gray-400">
                  {filteredThemes.length} themes
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredThemes.map((theme) => (
                  <div
                    key={theme.id}
                    className={`bg-white/5 backdrop-blur-sm border rounded-xl p-4 transition-all duration-300 cursor-pointer hover:bg-white/10 hover:border-white/20 ${
                      selectedTheme === theme.id ? "border-purple-500 ring-1 ring-purple-500/30" : "border-white/10"
                    }`}
                    onClick={() => applyTheme(theme.id)}
                  >
                    {/* Theme Preview */}
                    <div className={`h-24 rounded-lg bg-gradient-to-br ${theme.preview} border border-white/20 mb-3 relative overflow-hidden`}>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-8 h-8 bg-white/20 rounded-lg backdrop-blur-sm"></div>
                      </div>
                      {selectedTheme === theme.id && (
                        <div className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Theme Info */}
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-white text-sm">{theme.name}</h3>
                        <p className="text-xs text-gray-400 line-clamp-2">{theme.description}</p>
                      </div>
                      <div className="flex items-center gap-1 ml-2">
                        {theme.isPremium && <Crown className="w-3 h-3 text-yellow-400" />}
                        {theme.isPopular && <Star className="w-3 h-3 text-orange-400 fill-current" />}
                      </div>
                    </div>

                    {/* Theme Stats */}
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-3">
                        {theme.downloads && (
                          <span className="flex items-center gap-1">
                            <Download className="w-3 h-3" />
                            {theme.downloads}
                          </span>
                        )}
                        {theme.rating && (
                          <span className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-current text-yellow-400" />
                            {theme.rating}
                          </span>
                        )}
                      </div>
                      {theme.author && (
                        <span>by {theme.author}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customizer Panel */}
      {showCustomizer && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-xl max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-gray-900 border-b border-gray-700 p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Brush className="w-5 h-5 text-purple-400" />
                  Theme Customizer
                </h3>
                <Button
                  onClick={() => setShowCustomizer(false)}
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </Button>
              </div>
            </div>

            <div className="p-4 space-y-6">
              {customizationOptions.map((option) => (
                <div key={option.id} className="p-3 bg-white/5 rounded-lg border border-white/10">
                  {renderCustomizationOption(option)}
                </div>
              ))}

              <div className="pt-4 border-t border-gray-700">
                <Button
                  onClick={() => {
                    saveChanges()
                    setShowCustomizer(false)
                  }}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                >
                  Apply Customizations
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Apply Changes Banner */}
      {hasChanges && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 border border-purple-500/30 rounded-xl p-4 shadow-2xl backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <Palette className="w-5 h-5 text-white" />
              <span className="text-white font-medium">Theme changes ready to apply</span>
              <div className="flex gap-2">
                <Button
                  onClick={resetToDefault}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20"
                >
                  Reset
                </Button>
                <Button
                  onClick={saveChanges}
                  size="sm"
                  className="bg-white text-purple-600 hover:bg-gray-100"
                >
                  Apply
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
