"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { MessageCircle, X } from "lucide-react"

const Chatbot = dynamic(() => import("./chatbot").then((mod) => mod.Chatbot), {
  ssr: false,
  loading: () => (
    <div className="w-full max-w-96 h-[60vh] sm:h-[500px] rounded-lg border border-gray-800 bg-gray-900 shadow-2xl" />
  ),
})

export function ChatbotToggle() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Chatbot Toggle Button */}
      <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg transition-all duration-300 hover:scale-110"
          aria-label={isOpen ? "Close chatbot" : "Open chatbot"}
        >
          {isOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6 text-white" /> : <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />}
        </Button>
      </div>

      {/* Chatbot Window */}
      {isOpen && (
        <div className="fixed bottom-20 sm:bottom-24 right-4 sm:right-6 z-40 w-[calc(100vw-2rem)] max-w-96">
          <Chatbot onClose={() => setIsOpen(false)} />
        </div>
      )}
    </>
  )
}
