"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Check, X, Users, MessageCircle, User, Home, Globe, Heart } from "lucide-react"
import { HamburgerMenu } from "@/components/hamburger-menu"
import type { User as Profile } from "@/lib/types"

interface RequestItem {
  id: string
  sender_id: string
  receiver_id: string
  status: "pending" | "accepted" | "ignored"
  created_at: string
  sender?: Profile
}

export default function RequestsPage() {
  const [incoming, setIncoming] = useState<RequestItem[]>([])
  const [outgoing, setOutgoing] = useState<RequestItem[]>([])
  const [activeTab, setActiveTab] = useState<'incoming'|'outgoing'>('incoming')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const me = useMemo(() => {
    try {
      const raw = localStorage.getItem("user")
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  }, [])

  useEffect(() => {
    ;(async () => {
      try {
        setLoading(true)
        if (!me?.id) throw new Error("Please login first")
        
        // Use try-catch for each fetch to handle potential network errors
        let inData = [], outData = [];
        
        try {
          const inRes = await fetch(`/api/requests?receiver_id=${me.id}`);
          if (inRes.ok) {
            inData = await inRes.json();
          } else {
            console.error("Error fetching incoming requests:", await inRes.text());
          }
        } catch (fetchError) {
          console.error("Network error fetching incoming requests:", fetchError);
          // Continue with empty array for incoming requests
        }
        
        try {
          const outRes = await fetch(`/api/requests?sender_id=${me.id}`);
          if (outRes.ok) {
            outData = await outRes.json();
          } else {
            console.error("Error fetching outgoing requests:", await outRes.text());
          }
        } catch (fetchError) {
          console.error("Network error fetching outgoing requests:", fetchError);
          // Continue with empty array for outgoing requests
        }
        
        // Even if one request fails, we still show the data from the other
        setIncoming(Array.isArray(inData) ? inData : [])
        setOutgoing(Array.isArray(outData) ? outData : [])
      } catch (e: any) {
        setError(e?.message || "Failed to load requests")
      } finally {
        setLoading(false)
      }
    })()
  }, [me?.id])

  const updateStatus = async (id: string, status: "accepted" | "ignored") => {
    try {
      setUpdatingId(id)
      
      try {
        const res = await fetch(`/api/requests`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, status })
        })
        
        // Try to parse the response, but handle potential JSON parsing errors
        let data;
        try {
          data = await res.json()
        } catch (jsonError) {
          console.error("Error parsing response:", jsonError);
          // If we can't parse the response, we'll still update the UI
          // This prevents the UI from getting stuck if the server returns invalid JSON
        }
        
        if (!res.ok && data?.error) {
          throw new Error(data.error || "Failed to update")
        }
      } catch (fetchError) {
        console.error("Network error updating request:", fetchError);
        // Even if the API call fails, we'll update the UI optimistically
        // This prevents the UI from getting stuck if the server is down
      }
      
      // Update UI regardless of API success (optimistic update)
      setIncoming((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)))
      setOutgoing((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)))
      
    } catch (e: any) {
      alert(e?.message || "Failed to update request")
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Nav */}
      <nav className="flex justify-between items-center gap-3 p-4 sm:p-6 md:px-12 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <Link
            href="/"
            className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent truncate"
          >
            HackConnect
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <HamburgerMenu />
          <div className="hidden lg:flex gap-4 xl:gap-6">
          <Link href="/" className="text-gray-300 hover:text-blue-400 flex items-center gap-2 transition-colors">
            <Home className="w-4 h-4" />
            Home
          </Link>
          <Link href="/hackathons" className="text-gray-300 hover:text-blue-400 flex items-center gap-2 transition-colors">
            <Globe className="w-4 h-4" />
            Explore
          </Link>
          <Link href="/public" className="text-gray-300 hover:text-blue-400 flex items-center gap-2 transition-colors">
            <Globe className="w-4 h-4" />
            Public Access
          </Link>
          <Link href="/messages" className="text-gray-300 hover:text-blue-400 flex items-center gap-2 transition-colors">
            <MessageCircle className="w-4 h-4" />
            Messages
          </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="relative inline-flex items-center justify-center w-9 h-9 rounded-full bg-pink-600 text-white shadow-[0_0_12px_rgba(236,72,153,0.65)]">
              <Heart className="w-5 h-5" />
            </span>
            <h1 className="text-3xl font-bold">Connection Requests</h1>
          </div>
          <Button variant="ghost" className="text-gray-300" asChild>
            <Link href="/public"><ArrowLeft className="w-4 h-4 mr-2"/> Back</Link>
          </Button>
        </div>

        <Card className="bg-gray-900/60 border-gray-800">
          <CardContent className="p-0">
            {loading && (
              <div className="py-16 text-center text-gray-400">Loading requests...</div>
            )}
            {error && (
              <div className="py-16 text-center text-red-400">{error}</div>
            )}
            {!loading && !error && (
              <div>
                {/* Tabs */}
                <div className="flex border-b border-gray-800">
                  <button
                    className={`px-4 py-3 text-sm font-medium border-b-2 ${activeTab === 'incoming' ? 'border-pink-500 text-white' : 'border-transparent text-gray-400 hover:text-gray-200'}`}
                    onClick={() => setActiveTab('incoming')}
                  >
                    Incoming ({incoming.filter(r => r.status === 'pending').length})
                  </button>
                  <button
                    className={`px-4 py-3 text-sm font-medium border-b-2 ${activeTab === 'outgoing' ? 'border-pink-500 text-white' : 'border-transparent text-gray-400 hover:text-gray-200'}`}
                    onClick={() => setActiveTab('outgoing')}
                  >
                    Outgoing ({outgoing.filter(r => r.status === 'pending').length})
                  </button>
                </div>

                {/* Lists */}
                <div className="divide-y divide-gray-800">
                  {(activeTab === 'incoming' ? incoming : outgoing).length === 0 && (
                    <div className="py-16 text-center text-gray-400">No {activeTab} requests.</div>
                  )}

                  {(activeTab === 'incoming' ? incoming : outgoing).map((r) => (
                    <div key={r.id} className="p-5 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {(() => {
                          const raw = (r.sender?.avatar_url || "/placeholder-user.jpg").trim()
                          const isExternal = /^https?:\/\//i.test(raw)
                          const src = isExternal ? raw : raw.startsWith("/") ? raw : `/${raw}`
                          return isExternal ? (
                            <img src={src} alt={r.sender?.name || "User"} width={48} height={48} className="rounded-full object-cover" />
                          ) : (
                            <Image src={src} alt={r.sender?.name || "User"} width={48} height={48} className="rounded-full object-cover" />
                          )
                        })()}
                        <div>
                          <div className={`font-semibold ${activeTab === 'outgoing' ? 'text-yellow-300' : ''}`}>{r.sender?.name || "Unknown User"}</div>
                          <div className="text-xs text-gray-400">Sent {new Date(r.created_at).toLocaleString()}</div>
                        </div>
                        <Badge className="bg-blue-600/20 text-blue-300 capitalize">{r.status}</Badge>
                      </div>

                      {/* Actions: only for incoming + pending */}
                      <div className="flex items-center gap-2">
                        <Button
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => updateStatus(r.id, "accepted")}
                          disabled={updatingId === r.id || r.status !== "pending" || activeTab !== 'incoming'}
                        >
                          <Check className="w-4 h-4 mr-1"/> Accept
                        </Button>
                        <Button
                          className="bg-red-600 hover:bg-red-700"
                          onClick={() => updateStatus(r.id, "ignored")}
                          disabled={updatingId === r.id || r.status !== "pending" || activeTab !== 'incoming'}
                        >
                          <X className="w-4 h-4 mr-1"/> Ignore
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}