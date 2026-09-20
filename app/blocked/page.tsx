"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShieldOff, Home, ArrowLeft, Lock } from "lucide-react"

export default function BlockedPage() {
  const [blockedPath, setBlockedPath] = useState<string>("")

  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get("page")
    if (p) setBlockedPath(p)
  }, [])

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="w-full max-w-lg text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center">
          <ShieldOff className="w-10 h-10 text-red-400" />
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
          This page is disabled
        </h1>
        <p className="text-slate-300 mb-4 text-lg">
          An administrator has turned off this page for now. Please try again later.
        </p>

        {blockedPath && (
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/80 border border-slate-700 rounded-lg text-slate-300 text-sm mb-8">
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <code className="font-mono">{blockedPath}</code>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Go to Home
            </Link>
          </Button>
          <Button asChild variant="outline" className="border-slate-600 text-white hover:bg-slate-800">
            <Link href="/messages">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Messages
            </Link>
          </Button>
        </div>

        <p className="mt-8 text-sm text-slate-500">
          Need help? <Link href="/contact" className="text-blue-400 hover:text-blue-300 underline underline-offset-2">Contact support</Link>
        </p>
      </div>
    </div>
  )
}
