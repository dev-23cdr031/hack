"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChatbotAI } from "@/lib/chatbot-ai"

const sampleQuestions = [
  "Where is the AI hackathon happening?",
  "When are the upcoming hackathons?",
  "How much can I win?",
  "What is HackConnect?",
  "How do I register?",
  "Tell me about blockchain hackathons",
  "I need motivation",
  "How do I find teammates?",
  "What technologies should I use?",
]

export default function TestChatbotPage() {
  const [message, setMessage] = useState("")
  const [response, setResponse] = useState("")
  const [loading, setLoading] = useState(false)

  const testChatbot = async () => {
    if (!message.trim()) return

    setLoading(true)
    try {
      const result = await ChatbotAI.generateResponse(message)
      setResponse(result.message)
    } catch (error) {
      setResponse(`Error: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black p-8 text-white">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-center text-3xl font-bold text-transparent">
          Chatbot Test Page
        </h1>

        <div className="mb-6 rounded-lg bg-gray-900 p-6">
          <h2 className="mb-4 text-xl font-semibold">Test Questions</h2>
          <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {sampleQuestions.map((question) => (
              <Button
                key={question}
                onClick={() => setMessage(question)}
                className="justify-start bg-blue-900/30 text-left hover:bg-blue-900/50"
              >
                {question}
              </Button>
            ))}
          </div>
          <p className="text-center text-sm text-gray-400">
            Try asking about locations, dates, prizes, teams, technologies, project ideas, motivation, or networking.
          </p>
        </div>

        <div className="rounded-lg bg-gray-900 p-6">
          <div className="mb-4 flex gap-3">
            <Input
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Ask me anything about HackConnect..."
              className="flex-1 border-gray-700 bg-gray-800 text-white"
              onKeyDown={(event) => {
                if (event.key === "Enter") testChatbot()
              }}
            />
            <Button onClick={testChatbot} disabled={loading || !message.trim()} className="bg-blue-600 hover:bg-blue-700">
              {loading ? "..." : "Ask"}
            </Button>
          </div>

          {response && (
            <div className="rounded-lg border border-gray-700 bg-gray-800 p-4">
              <div className="whitespace-pre-wrap text-gray-100">{response}</div>
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <p className="mb-4 text-gray-400">The chatbot appears in the bottom-right corner of all pages.</p>
          <Button asChild className="bg-gradient-to-r from-purple-600 to-blue-600">
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
