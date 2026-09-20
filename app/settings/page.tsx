"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Settings,
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Volume2,
  Monitor,
  Smartphone,
  Mail,
  MessageCircle,
  Video,
  Mic,
  Camera,
  Download,
  Upload,
  Trash2,
  Key,
  Lock,
  Eye,
  EyeOff,
  Moon,
  Sun,
  Zap,
  Code,
  Database,
  Wifi,
  Bluetooth,
  HardDrive,
  Clock,
  Calendar,
  MapPin,
  Languages,
  Accessibility,
  HelpCircle,
  Info,
  ArrowLeft,
  Save,
  RotateCcw,
  Check,
  X,
  Plus,
  Minus,
  Edit,
  ChevronRight,
  ChevronDown,
  ToggleLeft,
  ToggleRight,
} from "lucide-react"
import Link from "next/link"

interface SettingsSection {
  id: string
  title: string
  description: string
  icon: any
  settings: SettingSetting[]
}

interface SettingSetting {
  id: string
  type: 'toggle' | 'select' | 'input' | 'range' | 'button' | 'color' | 'file'
  label: string
  description?: string
  value: any
  options?: { value: string; label: string }[]
  min?: number
  max?: number
  step?: number
  placeholder?: string
  accept?: string
}

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("profile")
  const [settings, setSettings] = useState<{ [key: string]: any }>({})
  const [hasChanges, setHasChanges] = useState(false)
  const [loading, setLoading] = useState(false)

  // Initialize settings
  useEffect(() => {
    const defaultSettings = {
      // Profile Settings
      displayName: "Your Name",
      email: "your.email@example.com",
      bio: "Passionate developer and hackathon enthusiast",
      location: "KEC, Erode Tamilnadu",
      website: "https://yourwebsite.com",
      github: "yourusername",
      linkedin: "yourprofile",
      twitter: "yourusername",
      profileVisibility: "public",
      showEmail: false,
      showLocation: true,
      
      // Notification Settings
      pushNotifications: true,
      emailNotifications: true,
      desktopNotifications: true,
      soundEnabled: true,
      notificationSound: "default",
      messageNotifications: true,
      teamNotifications: true,
      hackathonNotifications: true,
      achievementNotifications: true,
      meetingReminders: true,
      codeReviewNotifications: true,
      quietHours: false,
      quietStart: "22:00",
      quietEnd: "08:00",
      
      // Privacy & Security
      twoFactorAuth: false,
      loginNotifications: true,
      sessionTimeout: "30",
      dataSharing: false,
      analyticsTracking: true,
      profileIndexing: true,
      activityStatus: true,
      lastSeen: true,
      readReceipts: true,
      
      // Appearance
      theme: "dark",
      accentColor: "#8b5cf6",
      fontSize: "medium",
      compactMode: false,
      animations: true,
      highContrast: false,
      reducedMotion: false,
      
      // Audio & Video
      microphoneDevice: "default",
      cameraDevice: "default",
      speakerDevice: "default",
      microphoneVolume: 80,
      speakerVolume: 80,
      noiseCancellation: true,
      echoCancellation: true,
      autoGainControl: true,
      videoQuality: "hd",
      virtualBackground: false,
      
      // Language & Region
      language: "en",
      timezone: "America/Los_Angeles",
      dateFormat: "MM/DD/YYYY",
      timeFormat: "12h",
      numberFormat: "US",
      
      // Advanced
      developerMode: false,
      debugMode: false,
      experimentalFeatures: false,
      dataBackup: true,
      autoSave: true,
      cacheSize: "500",
      
      // Integrations
      githubIntegration: false,
      slackIntegration: false,
      discordIntegration: false,
      figmaIntegration: false,
      notionIntegration: false,
    }
    
    setSettings(defaultSettings)
  }, [])

  const settingsSections: SettingsSection[] = [
    {
      id: "profile",
      title: "Profile",
      description: "Manage your personal information and public profile",
      icon: User,
      settings: [
        { id: "displayName", type: "input", label: "Display Name", value: settings.displayName, placeholder: "Enter your display name" },
        { id: "email", type: "input", label: "Email Address", value: settings.email, placeholder: "your.email@example.com" },
        { id: "bio", type: "input", label: "Bio", value: settings.bio, placeholder: "Tell others about yourself" },
        { id: "location", type: "input", label: "Location", value: settings.location, placeholder: "City, Country" },
        { id: "website", type: "input", label: "Website", value: settings.website, placeholder: "https://yourwebsite.com" },
        { id: "github", type: "input", label: "GitHub Username", value: settings.github, placeholder: "yourusername" },
        { id: "linkedin", type: "input", label: "LinkedIn Profile", value: settings.linkedin, placeholder: "yourprofile" },
        { id: "twitter", type: "input", label: "Twitter Handle", value: settings.twitter, placeholder: "@yourusername" },
        { id: "profileVisibility", type: "select", label: "Profile Visibility", value: settings.profileVisibility, options: [
          { value: "public", label: "Public" },
          { value: "private", label: "Private" },
          { value: "team", label: "Team Only" }
        ]},
        { id: "showEmail", type: "toggle", label: "Show Email Publicly", value: settings.showEmail },
        { id: "showLocation", type: "toggle", label: "Show Location", value: settings.showLocation },
      ]
    },
    {
      id: "notifications",
      title: "Notifications",
      description: "Control how and when you receive notifications",
      icon: Bell,
      settings: [
        { id: "pushNotifications", type: "toggle", label: "Push Notifications", description: "Receive notifications on your devices", value: settings.pushNotifications },
        { id: "emailNotifications", type: "toggle", label: "Email Notifications", description: "Receive notifications via email", value: settings.emailNotifications },
        { id: "desktopNotifications", type: "toggle", label: "Desktop Notifications", description: "Show notifications on your desktop", value: settings.desktopNotifications },
        { id: "soundEnabled", type: "toggle", label: "Notification Sounds", description: "Play sounds for notifications", value: settings.soundEnabled },
        { id: "notificationSound", type: "select", label: "Notification Sound", value: settings.notificationSound, options: [
          { value: "default", label: "Default" },
          { value: "chime", label: "Chime" },
          { value: "bell", label: "Bell" },
          { value: "ping", label: "Ping" }
        ]},
        { id: "messageNotifications", type: "toggle", label: "Message Notifications", value: settings.messageNotifications },
        { id: "teamNotifications", type: "toggle", label: "Team Notifications", value: settings.teamNotifications },
        { id: "hackathonNotifications", type: "toggle", label: "Hackathon Updates", value: settings.hackathonNotifications },
        { id: "achievementNotifications", type: "toggle", label: "Achievement Notifications", value: settings.achievementNotifications },
        { id: "meetingReminders", type: "toggle", label: "Meeting Reminders", value: settings.meetingReminders },
        { id: "codeReviewNotifications", type: "toggle", label: "Code Review Notifications", value: settings.codeReviewNotifications },
        { id: "quietHours", type: "toggle", label: "Quiet Hours", description: "Disable notifications during specified hours", value: settings.quietHours },
      ]
    },
    {
      id: "privacy",
      title: "Privacy & Security",
      description: "Manage your privacy settings and account security",
      icon: Shield,
      settings: [
        { id: "twoFactorAuth", type: "toggle", label: "Two-Factor Authentication", description: "Add an extra layer of security", value: settings.twoFactorAuth },
        { id: "loginNotifications", type: "toggle", label: "Login Notifications", description: "Get notified of new logins", value: settings.loginNotifications },
        { id: "sessionTimeout", type: "select", label: "Session Timeout", value: settings.sessionTimeout, options: [
          { value: "15", label: "15 minutes" },
          { value: "30", label: "30 minutes" },
          { value: "60", label: "1 hour" },
          { value: "240", label: "4 hours" },
          { value: "never", label: "Never" }
        ]},
        { id: "dataSharing", type: "toggle", label: "Data Sharing", description: "Share anonymized data for platform improvement", value: settings.dataSharing },
        { id: "analyticsTracking", type: "toggle", label: "Analytics Tracking", description: "Help improve the platform with usage analytics", value: settings.analyticsTracking },
        { id: "profileIndexing", type: "toggle", label: "Search Engine Indexing", description: "Allow search engines to index your profile", value: settings.profileIndexing },
        { id: "activityStatus", type: "toggle", label: "Show Activity Status", description: "Let others see when you're online", value: settings.activityStatus },
        { id: "lastSeen", type: "toggle", label: "Show Last Seen", description: "Display when you were last active", value: settings.lastSeen },
        { id: "readReceipts", type: "toggle", label: "Read Receipts", description: "Show when you've read messages", value: settings.readReceipts },
      ]
    },
    {
      id: "appearance",
      title: "Appearance",
      description: "Customize the look and feel of the platform",
      icon: Palette,
      settings: [
        { id: "theme", type: "select", label: "Theme", value: settings.theme, options: [
          { value: "dark", label: "Dark" },
          { value: "light", label: "Light" },
          { value: "auto", label: "Auto" }
        ]},
        { id: "accentColor", type: "color", label: "Accent Color", value: settings.accentColor },
        { id: "fontSize", type: "select", label: "Font Size", value: settings.fontSize, options: [
          { value: "small", label: "Small" },
          { value: "medium", label: "Medium" },
          { value: "large", label: "Large" },
          { value: "xlarge", label: "Extra Large" }
        ]},
        { id: "compactMode", type: "toggle", label: "Compact Mode", description: "Use less spacing for a denser layout", value: settings.compactMode },
        { id: "animations", type: "toggle", label: "Animations", description: "Enable smooth animations and transitions", value: settings.animations },
        { id: "highContrast", type: "toggle", label: "High Contrast", description: "Increase contrast for better visibility", value: settings.highContrast },
        { id: "reducedMotion", type: "toggle", label: "Reduced Motion", description: "Minimize animations for accessibility", value: settings.reducedMotion },
      ]
    },
    {
      id: "audio-video",
      title: "Audio & Video",
      description: "Configure your audio and video settings for calls",
      icon: Video,
      settings: [
        { id: "microphoneDevice", type: "select", label: "Microphone", value: settings.microphoneDevice, options: [
          { value: "default", label: "Default Microphone" },
          { value: "built-in", label: "Built-in Microphone" }
        ]},
        { id: "cameraDevice", type: "select", label: "Camera", value: settings.cameraDevice, options: [
          { value: "default", label: "Default Camera" },
          { value: "built-in", label: "Built-in Camera" }
        ]},
        { id: "speakerDevice", type: "select", label: "Speaker", value: settings.speakerDevice, options: [
          { value: "default", label: "Default Speaker" },
          { value: "built-in", label: "Built-in Speaker" }
        ]},
        { id: "microphoneVolume", type: "range", label: "Microphone Volume", value: settings.microphoneVolume, min: 0, max: 100, step: 5 },
        { id: "speakerVolume", type: "range", label: "Speaker Volume", value: settings.speakerVolume, min: 0, max: 100, step: 5 },
        { id: "noiseCancellation", type: "toggle", label: "Noise Cancellation", description: "Reduce background noise", value: settings.noiseCancellation },
        { id: "echoCancellation", type: "toggle", label: "Echo Cancellation", description: "Prevent audio feedback", value: settings.echoCancellation },
        { id: "autoGainControl", type: "toggle", label: "Auto Gain Control", description: "Automatically adjust microphone levels", value: settings.autoGainControl },
        { id: "videoQuality", type: "select", label: "Video Quality", value: settings.videoQuality, options: [
          { value: "low", label: "Low (480p)" },
          { value: "medium", label: "Medium (720p)" },
          { value: "hd", label: "HD (1080p)" },
          { value: "4k", label: "4K (2160p)" }
        ]},
        { id: "virtualBackground", type: "toggle", label: "Virtual Background", description: "Enable virtual background support", value: settings.virtualBackground },
      ]
    },
    {
      id: "language",
      title: "Language & Region",
      description: "Set your language, timezone, and regional preferences",
      icon: Globe,
      settings: [
        { id: "language", type: "select", label: "Language", value: settings.language, options: [
          { value: "en", label: "English" },
          { value: "es", label: "Spanish" },
          { value: "fr", label: "French" },
          { value: "de", label: "German" },
          { value: "ja", label: "Japanese" },
          { value: "zh", label: "Chinese" }
        ]},
        { id: "timezone", type: "select", label: "Timezone", value: settings.timezone, options: [
          { value: "America/Los_Angeles", label: "Pacific Time" },
          { value: "America/New_York", label: "Eastern Time" },
          { value: "Europe/London", label: "GMT" },
          { value: "Europe/Paris", label: "Central European Time" },
          { value: "Asia/Tokyo", label: "Japan Standard Time" },
          { value: "Asia/Shanghai", label: "China Standard Time" }
        ]},
        { id: "dateFormat", type: "select", label: "Date Format", value: settings.dateFormat, options: [
          { value: "MM/DD/YYYY", label: "MM/DD/YYYY" },
          { value: "DD/MM/YYYY", label: "DD/MM/YYYY" },
          { value: "YYYY-MM-DD", label: "YYYY-MM-DD" }
        ]},
        { id: "timeFormat", type: "select", label: "Time Format", value: settings.timeFormat, options: [
          { value: "12h", label: "12 Hour" },
          { value: "24h", label: "24 Hour" }
        ]},
        { id: "numberFormat", type: "select", label: "Number Format", value: settings.numberFormat, options: [
          { value: "US", label: "1,234.56" },
          { value: "EU", label: "1.234,56" },
          { value: "IN", label: "1,23,456.78" }
        ]},
      ]
    },
    {
      id: "advanced",
      title: "Advanced",
      description: "Advanced settings for power users and developers",
      icon: Code,
      settings: [
        { id: "developerMode", type: "toggle", label: "Developer Mode", description: "Enable developer tools and features", value: settings.developerMode },
        { id: "debugMode", type: "toggle", label: "Debug Mode", description: "Show debug information and logs", value: settings.debugMode },
        { id: "experimentalFeatures", type: "toggle", label: "Experimental Features", description: "Access beta features (may be unstable)", value: settings.experimentalFeatures },
        { id: "dataBackup", type: "toggle", label: "Automatic Data Backup", description: "Automatically backup your data", value: settings.dataBackup },
        { id: "autoSave", type: "toggle", label: "Auto Save", description: "Automatically save your work", value: settings.autoSave },
        { id: "cacheSize", type: "select", label: "Cache Size", value: settings.cacheSize, options: [
          { value: "100", label: "100 MB" },
          { value: "250", label: "250 MB" },
          { value: "500", label: "500 MB" },
          { value: "1000", label: "1 GB" }
        ]},
      ]
    }
  ]

  const updateSetting = (settingId: string, value: any) => {
    setSettings(prev => ({ ...prev, [settingId]: value }))
    setHasChanges(true)
  }

  const saveSettings = async () => {
    setLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    setHasChanges(false)
    setLoading(false)
    // Show success message
    alert("Settings saved successfully!")
  }

  const resetSettings = () => {
    if (confirm("Are you sure you want to reset all settings to default?")) {
      window.location.reload()
    }
  }

  const renderSetting = (setting: SettingSetting) => {
    switch (setting.type) {
      case 'toggle':
        return (
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-white">{setting.label}</label>
              {setting.description && (
                <p className="text-xs text-gray-400 mt-1">{setting.description}</p>
              )}
            </div>
            <Button
              onClick={() => updateSetting(setting.id, !setting.value)}
              variant="ghost"
              size="sm"
              className={`p-1 ${setting.value ? 'text-green-400' : 'text-gray-400'}`}
            >
              {setting.value ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
            </Button>
          </div>
        )

      case 'select':
        return (
          <div>
            <label className="text-sm font-medium text-white block mb-2">{setting.label}</label>
            <select
              value={setting.value}
              onChange={(e) => updateSetting(setting.id, e.target.value)}
              className="w-full p-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {setting.options?.map(option => (
                <option key={option.value} value={option.value} className="bg-gray-800">
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )

      case 'input':
        return (
          <div>
            <label className="text-sm font-medium text-white block mb-2">{setting.label}</label>
            <input
              type="text"
              value={setting.value}
              onChange={(e) => updateSetting(setting.id, e.target.value)}
              placeholder={setting.placeholder}
              className="w-full p-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        )

      case 'range':
        return (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-white">{setting.label}</label>
              <span className="text-sm text-gray-400">{setting.value}%</span>
            </div>
            <input
              type="range"
              min={setting.min}
              max={setting.max}
              step={setting.step}
              value={setting.value}
              onChange={(e) => updateSetting(setting.id, parseInt(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
        )

      case 'color':
        return (
          <div>
            <label className="text-sm font-medium text-white block mb-2">{setting.label}</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={setting.value}
                onChange={(e) => updateSetting(setting.id, e.target.value)}
                className="w-12 h-8 rounded border border-white/10 cursor-pointer"
              />
              <span className="text-sm text-gray-400">{setting.value}</span>
            </div>
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
                <Settings className="w-7 h-7 sm:w-8 sm:h-8 text-purple-400 flex-shrink-0" />
                <div className="min-w-0">
                  <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent truncate">
                    Settings
                  </h1>
                  <p className="hidden sm:block text-sm text-gray-400">Customize your HackConnect experience</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              {hasChanges && (
                <>
                  <Button
                    onClick={resetSettings}
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-white hover:bg-white/10 px-2"
                  >
                    <RotateCcw className="w-4 h-4 sm:mr-2" />
                    <span className="hidden sm:inline">Reset</span>
                  </Button>
                  <Button
                    onClick={saveSettings}
                    disabled={loading}
                    size="sm"
                    className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-2 sm:px-4"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    ) : (
                      <Save className="w-4 h-4 sm:mr-2" />
                    )}
                    <span className="hidden sm:inline">Save Changes</span>
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
            <div className="sticky top-24 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-gray-300 mb-4">Settings Categories</h3>
              <div className="space-y-1">
                {settingsSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all duration-200 ${
                      activeSection === section.id
                        ? "bg-purple-600/30 text-purple-200 border border-purple-500/30"
                        : "text-gray-300 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <section.icon className="w-4 h-4" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">{section.title}</div>
                    </div>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {settingsSections.map((section) => (
              activeSection === section.id && (
                <div key={section.id} className="space-y-6">
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <section.icon className="w-6 h-6 text-purple-400" />
                      <div>
                        <h2 className="text-xl font-bold text-white">{section.title}</h2>
                        <p className="text-sm text-gray-400">{section.description}</p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {section.settings.map((setting) => (
                        <div key={setting.id} className="p-4 bg-white/5 rounded-lg border border-white/10">
                          {renderSetting(setting)}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )
            ))}
          </div>
        </div>
      </div>

      {/* Save Changes Banner */}
      {hasChanges && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 border border-purple-500/30 rounded-xl p-4 shadow-2xl backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <Info className="w-5 h-5 text-white" />
              <span className="text-white font-medium">You have unsaved changes</span>
              <div className="flex gap-2">
                <Button
                  onClick={resetSettings}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20"
                >
                  Discard
                </Button>
                <Button
                  onClick={saveSettings}
                  disabled={loading}
                  size="sm"
                  className="bg-white text-purple-600 hover:bg-gray-100"
                >
                  {loading ? "Saving..." : "Save"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
