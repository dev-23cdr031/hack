"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { MessageCircle, X } from "lucide-react"

const Chatbot = dynamic(() => import("./chatbot").then((mod) => mod.Chatbot), {
  ssr: false,
  loading: () => (
    <div className="w-96 h-[500px] rounded-lg border border-gray-800 bg-gray-900 shadow-2xl" />
  ),
})

export function ChatbotToggle() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Chatbot Toggle Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg transition-all duration-300 hover:scale-110"
        >
          {isOpen ? <X className="w-6 h-6 text-white" /> : <MessageCircle className="w-6 h-6 text-white" />}
        </Button>
      </div>

      {/* Chatbot Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-40">
          <Chatbot onClose={() => setIsOpen(false)} />
        </div>
      )}
    </>
  )
}
