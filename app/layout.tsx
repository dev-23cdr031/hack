import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ChatbotWrapper } from "@/chatbot/chatbot-wrapper"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "HackConnect - Where Coders Collaborate",
  description: "The ultimate platform for hackathon discovery, team formation, and collaboration.",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-[#020817] text-white antialiased`}>
        <div className="min-h-screen w-full bg-[#020817] text-white">
          {children}
        </div>
        <ChatbotWrapper />
      </body>
    </html>
  )
}
