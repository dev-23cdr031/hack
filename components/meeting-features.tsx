"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Sparkles, 
  Brain, 
  Zap, 
  Target, 
  Award, 
  TrendingUp,
  Eye,
  Palette,
  Filter,
  Wand2,
  Bot,
  MessageSquare,
  Lightbulb,
  BarChart3,
  PieChart,
  Activity,
  Mic,
  Volume2,
  Camera,
  Monitor,
  Smile,
  Heart,
  ThumbsUp,
  Star,
  Crown,
  Shield,
  Rocket,
  Globe,
  Headphones,
  Speaker
} from "lucide-react"

interface MeetingFeaturesProps {
  onFeatureToggle: (feature: string, enabled: boolean) => void
}

export function MeetingFeatures({ onFeatureToggle }: MeetingFeaturesProps) {
  const [aiTranscription, setAiTranscription] = useState(true)
  const [smartSummary, setSmartSummary] = useState(true)
  const [noiseReduction, setNoiseReduction] = useState(true)
  const [virtualBackground, setVirtualBackground] = useState(false)
  const [beautifyFilter, setBeautifyFilter] = useState(false)
  const [autoFraming, setAutoFraming] = useState(true)
  const [sentimentAnalysis, setSentimentAnalysis] = useState(false)
  const [livePolls, setLivePolls] = useState(false)

  const toggleFeature = (feature: string, currentState: boolean, setter: (value: boolean) => void) => {
    const newState = !currentState
    setter(newState)
    onFeatureToggle(feature, newState)
  }

  return (
    <div className="space-y-6">
      {/* AI-Powered Features */}
      <Card className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 border-purple-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-300">
            <Brain className="w-5 h-5" />
            AI-Powered Features
            <Badge className="bg-purple-500/20 text-purple-300">Premium</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mic className="w-4 h-4 text-blue-400" />
              <span className="text-sm">Real-time AI Transcription</span>
            </div>
            <Button
              size="sm"
              variant={aiTranscription ? "default" : "outline"}
              onClick={() => toggleFeature('aiTranscription', aiTranscription, setAiTranscription)}
              className={aiTranscription ? "bg-purple-600 hover:bg-purple-700" : ""}
            >
              {aiTranscription ? "ON" : "OFF"}
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-yellow-400" />
              <span className="text-sm">Smart Meeting Summary</span>
            </div>
            <Button
              size="sm"
              variant={smartSummary ? "default" : "outline"}
              onClick={() => toggleFeature('smartSummary', smartSummary, setSmartSummary)}
              className={smartSummary ? "bg-purple-600 hover:bg-purple-700" : ""}
            >
              {smartSummary ? "ON" : "OFF"}
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-green-400" />
              <span className="text-sm">Sentiment Analysis</span>
            </div>
            <Button
              size="sm"
              variant={sentimentAnalysis ? "default" : "outline"}
              onClick={() => toggleFeature('sentimentAnalysis', sentimentAnalysis, setSentimentAnalysis)}
              className={sentimentAnalysis ? "bg-purple-600 hover:bg-purple-700" : ""}
            >
              {sentimentAnalysis ? "ON" : "OFF"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Audio & Video Enhancement */}
      <Card className="bg-gradient-to-br from-green-900/30 to-teal-900/30 border-green-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-300">
            <Zap className="w-5 h-5" />
            Audio & Video Enhancement
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-green-400" />
              <span className="text-sm">AI Noise Reduction</span>
            </div>
            <Button
              size="sm"
              variant={noiseReduction ? "default" : "outline"}
              onClick={() => toggleFeature('noiseReduction', noiseReduction, setNoiseReduction)}
              className={noiseReduction ? "bg-green-600 hover:bg-green-700" : ""}
            >
              {noiseReduction ? "ON" : "OFF"}
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-blue-400" />
              <span className="text-sm">Auto Framing</span>
            </div>
            <Button
              size="sm"
              variant={autoFraming ? "default" : "outline"}
              onClick={() => toggleFeature('autoFraming', autoFraming, setAutoFraming)}
              className={autoFraming ? "bg-green-600 hover:bg-green-700" : ""}
            >
              {autoFraming ? "ON" : "OFF"}
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Smile className="w-4 h-4 text-pink-400" />
              <span className="text-sm">Beauty Filter</span>
            </div>
            <Button
              size="sm"
              variant={beautifyFilter ? "default" : "outline"}
              onClick={() => toggleFeature('beautifyFilter', beautifyFilter, setBeautifyFilter)}
              className={beautifyFilter ? "bg-green-600 hover:bg-green-700" : ""}
            >
              {beautifyFilter ? "ON" : "OFF"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Collaboration Tools */}
      <Card className="bg-gradient-to-br from-orange-900/30 to-red-900/30 border-orange-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-300">
            <Target className="w-5 h-5" />
            Advanced Collaboration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Monitor className="w-4 h-4 text-blue-400" />
              <span className="text-sm">Virtual Backgrounds</span>
            </div>
            <Button
              size="sm"
              variant={virtualBackground ? "default" : "outline"}
              onClick={() => toggleFeature('virtualBackground', virtualBackground, setVirtualBackground)}
              className={virtualBackground ? "bg-orange-600 hover:bg-orange-700" : ""}
            >
              {virtualBackground ? "ON" : "OFF"}
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PieChart className="w-4 h-4 text-purple-400" />
              <span className="text-sm">Live Polls & Reactions</span>
            </div>
            <Button
              size="sm"
              variant={livePolls ? "default" : "outline"}
              onClick={() => toggleFeature('livePolls', livePolls, setLivePolls)}
              className={livePolls ? "bg-orange-600 hover:bg-orange-700" : ""}
            >
              {livePolls ? "ON" : "OFF"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Reactions */}
      <Card className="bg-gradient-to-br from-pink-900/30 to-purple-900/30 border-pink-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-pink-300">
            <Heart className="w-5 h-5" />
            Quick Reactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-2">
            {[
              { icon: ThumbsUp, label: "👍", color: "text-blue-400" },
              { icon: Heart, label: "❤️", color: "text-red-400" },
              { icon: Star, label: "⭐", color: "text-yellow-400" },
              { icon: Rocket, label: "🚀", color: "text-purple-400" },
            ].map((reaction, index) => (
              <Button
                key={index}
                variant="ghost"
                className="h-12 hover:bg-gray-700/50 flex flex-col items-center gap-1"
              >
                <reaction.icon className={`w-4 h-4 ${reaction.color}`} />
                <span className="text-xs">{reaction.label}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Virtual Background Component
export function VirtualBackgrounds() {
  const backgrounds = [
    { id: 'blur', name: 'Blur', preview: 'bg-gradient-to-br from-gray-400 to-gray-600' },
    { id: 'office', name: 'Office', preview: 'bg-gradient-to-br from-blue-400 to-blue-600' },
    { id: 'home', name: 'Home', preview: 'bg-gradient-to-br from-green-400 to-green-600' },
    { id: 'space', name: 'Space', preview: 'bg-gradient-to-br from-purple-400 to-purple-600' },
    { id: 'beach', name: 'Beach', preview: 'bg-gradient-to-br from-cyan-400 to-cyan-600' },
    { id: 'mountain', name: 'Mountain', preview: 'bg-gradient-to-br from-orange-400 to-orange-600' },
  ]

  return (
    <div className="grid grid-cols-3 gap-3">
      {backgrounds.map((bg) => (
        <Button
          key={bg.id}
          variant="ghost"
          className="h-16 p-2 flex flex-col items-center gap-1 hover:bg-gray-700/50"
        >
          <div className={`w-full h-8 rounded ${bg.preview}`}></div>
          <span className="text-xs">{bg.name}</span>
        </Button>
      ))}
    </div>
  )
}

// AI Meeting Insights Component
export function MeetingInsights() {
  const insights = [
    { label: "Speaking Time", value: "45%", color: "text-blue-400" },
    { label: "Engagement", value: "92%", color: "text-green-400" },
    { label: "Questions Asked", value: "12", color: "text-yellow-400" },
    { label: "Action Items", value: "5", color: "text-purple-400" },
  ]

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-300">
          <Activity className="w-5 h-5" />
          Meeting Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {insights.map((insight, index) => (
            <div key={index} className="text-center">
              <div className={`text-2xl font-bold ${insight.color}`}>{insight.value}</div>
              <div className="text-xs text-gray-400">{insight.label}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
