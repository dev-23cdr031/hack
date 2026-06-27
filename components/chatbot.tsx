"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send, Bot, User, Minimize2, Settings, Volume2, VolumeX } from "lucide-react"
import { getChatService, Message } from "@/lib/chat-service"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
interface ChatbotProps {
  onClose: () => void
}

export function Chatbot({ onClose }: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hi! I'm HackBot, your AI assistant.Try saying 'hi' or 'hello' for personalized greetings. I can help you with finding teams, discovering hackathons, or answering questions about our platform. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [apiKey, setApiKey] = useState("hackconnect-demo-key")
  const [userId, setUserId] = useState(`user-${Date.now()}`)
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatService = useRef(getChatService({ apiKey, userId }))
  const speechSynthesis = useRef<SpeechSynthesis | null>(null)
  const currentUtterance = useRef<SpeechSynthesisUtterance | null>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    // Initialize speech synthesis
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      speechSynthesis.current = window.speechSynthesis
    }
    
    // Initialize chat service
    chatService.current = getChatService({ apiKey, userId })
    
    // Load conversation history
    const loadHistory = async () => {
      const history = await chatService.current.getConversationHistory()
      if (history.length > 0) {
        setMessages(history)
      }
    }
    
    loadHistory()
    
    // Subscribe to new messages
    const unsubscribe = chatService.current.onNewMessage((newMessage) => {
      if (newMessage.sender === 'bot') {
        setIsTyping(false)
        setMessages((prev) => [...prev, newMessage])
        
        // Speak the bot message if voice is enabled
        if (voiceEnabled && newMessage.content) {
          speakMessage(newMessage.content)
        }
      }
    })
    
    return () => {
      unsubscribe()
      // Stop any ongoing speech
      if (speechSynthesis.current) {
        speechSynthesis.current.cancel()
      }
    }
  }, [apiKey, userId, voiceEnabled])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsTyping(true)

    // Send message to API
    await chatService.current.sendMessage(inputMessage)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleApiKeyChange = (newApiKey: string) => {
    setApiKey(newApiKey)
    chatService.current.setApiKey(newApiKey)
  }

  const speakMessage = (text: string) => {
    if (!speechSynthesis.current || !voiceEnabled) return
    
    // Stop any current speech
    speechSynthesis.current.cancel()
    
    // Clean the text for better speech (remove markdown and emojis)
    const cleanText = text
      .replace(/[#*_`]/g, '') // Remove markdown
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold markdown
      .replace(/\n/g, '. ') // Replace newlines with pauses
      .replace(/[🎯🚀💻🤖🔗📱🌐🎨🔒🌱🏥📚💰✨🤝💡📍📅💪🌟⚡🔥🎪🌈🎉🏆🌊🎭🎸🎲🎵🤠🌮🦞🎓⚾🍀☕🌲🏔️☔🏙️🍕🎬☀️🏄🏖️🌺🚤🏔️⛷️🌄🍺📊🎯💎🎁📈💳☁️📱🔧🧠👁️💬🎨⚖️🌐💰🎨🏠💼🚨🎮📱🌍🛒💪🌟🚲🏢]/g, '') // Remove emojis
      .replace(/\s+/g, ' ') // Clean up extra spaces
      .trim()
    
    if (!cleanText) return
    
    const utterance = new SpeechSynthesisUtterance(cleanText)
    currentUtterance.current = utterance
    
    // Configure voice settings for female voice
    const voices = speechSynthesis.current.getVoices()
    const femaleVoice = voices.find(voice => 
      voice.name.toLowerCase().includes('female') ||
      voice.name.toLowerCase().includes('woman') ||
      voice.name.toLowerCase().includes('samantha') ||
      voice.name.toLowerCase().includes('susan') ||
      voice.name.toLowerCase().includes('karen') ||
      voice.name.toLowerCase().includes('moira') ||
      voice.name.toLowerCase().includes('tessa') ||
      voice.name.toLowerCase().includes('veena') ||
      voice.name.toLowerCase().includes('rishi') ||
      (voice.name.toLowerCase().includes('google') && voice.name.toLowerCase().includes('us'))
    )
    
    if (femaleVoice) {
      utterance.voice = femaleVoice
    }
    
    // Voice settings
    utterance.rate = 0.9 // Slightly slower for clarity
    utterance.pitch = 1.1 // Higher pitch for feminine voice
    utterance.volume = 0.8
    
    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => {
      setIsSpeaking(false)
      currentUtterance.current = null
    }
    utterance.onerror = () => {
      setIsSpeaking(false)
      currentUtterance.current = null
    }
    
    speechSynthesis.current.speak(utterance)
  }
  
  const toggleVoice = () => {
    if (isSpeaking && speechSynthesis.current) {
      speechSynthesis.current.cancel()
      setIsSpeaking(false)
    }
    setVoiceEnabled(!voiceEnabled)
  }
  
  const stopSpeaking = () => {
    if (speechSynthesis.current) {
      speechSynthesis.current.cancel()
      setIsSpeaking(false)
    }
  }

  return (
    <Card className="w-96 h-[500px] bg-gray-900 border-gray-800 shadow-2xl">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="flex items-center space-x-3">
          <Avatar className="w-8 h-8">
            <AvatarImage src="/hackbot-avatar.png" />
            <AvatarFallback className="bg-white text-purple-600">
              <Bot className="w-4 h-4" />
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-white text-sm">HackBot</CardTitle>
            <p className="text-xs text-purple-100">AI Assistant</p>
          </div>
        </div>
        <div className="flex space-x-1">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleVoice}
            className={`text-white hover:bg-white/20 h-8 w-8 p-0 ${isSpeaking ? 'animate-pulse' : ''}`}
            title={voiceEnabled ? 'Voice On' : 'Voice Off'}
          >
            {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 h-8 w-8 p-0">
                <Settings className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 text-white border-gray-800">
              <DialogHeader>
                <DialogTitle>Chatbot Settings</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="api-key">API Key</Label>
                  <Input
                    id="api-key"
                    value={apiKey}
                    onChange={(e) => handleApiKeyChange(e.target.value)}
                    placeholder="Enter your API key"
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                  <p className="text-xs text-gray-400">
                    Default demo key: hackconnect-demo-key
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="user-id">User ID</Label>
                  <Input
                    id="user-id"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    placeholder="Enter your user ID"
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Conversation ID</Label>
                  <p className="text-sm text-gray-400">{chatService.current.getConversationId()}</p>
                </div>
                <div className="space-y-2">
                  <Label>Voice Settings</Label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="voice-enabled"
                      checked={voiceEnabled}
                      onChange={toggleVoice}
                      className="rounded"
                    />
                    <Label htmlFor="voice-enabled" className="text-sm">
                      Enable female voice responses
                    </Label>
                  </div>
                  {isSpeaking && (
                    <Button
                      onClick={stopSpeaking}
                      size="sm"
                      variant="outline"
                      className="w-full"
                    >
                      Stop Speaking
                    </Button>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20 h-8 w-8 p-0">
            <Minimize2 className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0 flex flex-col h-[calc(500px-80px)]">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`flex items-start space-x-2 max-w-[80%] ${message.sender === "user" ? "flex-row-reverse space-x-reverse" : ""}`}
              >
                <Avatar className="w-6 h-6">
                  {message.sender === "bot" ? (
                    <>
                      <AvatarImage src="/hackbot-avatar.png" />
                      <AvatarFallback className="bg-purple-600 text-white">
                        <Bot className="w-3 h-3" />
                      </AvatarFallback>
                    </>
                  ) : (
                    <AvatarFallback className="bg-blue-600 text-white">
                      <User className="w-3 h-3" />
                    </AvatarFallback>
                  )}
                </Avatar>

                <div
                  className={`rounded-lg p-3 text-sm ${
                    message.sender === "user" ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-100"
                  }`}
                >
                  <p className="leading-relaxed">{message.content}</p>
                  <p className={`text-xs mt-1 ${message.sender === "user" ? "text-blue-200" : "text-gray-400"}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-2">
                <Avatar className="w-6 h-6">
                  <AvatarImage src="/hackbot-avatar.png" />
                  <AvatarFallback className="bg-purple-600 text-white">
                    <Bot className="w-3 h-3" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-gray-800 rounded-lg p-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-800">
          <div className="flex space-x-2">
            <Input
              placeholder="Ask me anything..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 bg-gray-800 border-gray-700 text-white placeholder-gray-400 text-sm"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white px-3"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
