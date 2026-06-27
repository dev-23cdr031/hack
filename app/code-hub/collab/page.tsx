"use client"

import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { FileCode, FolderOpen, Link2, Download, ArrowLeft, RefreshCw } from "lucide-react"

interface RemoteItem {
  path: string
  name: string
  size: number
  type: "file" | "folder"
}

export default function CollabPage() {
  const params = useSearchParams()
  const path = params.get("path") || ""
  const type = (params.get("type") as "file" | "folder") || "file"
  const name = params.get("name") || "item"
  const userId = params.get("userId") || ""

  const [signedUrl, setSignedUrl] = useState<string>("")
  const [content, setContent] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>("")
  const [children, setChildren] = useState<RemoteItem[]>([])

  const title = useMemo(() => (type === "folder" ? `Collaborate on folder` : `Collaborate on file`), [type])

  function relPrefixFromPath(full: string) {
    if (!userId) return full
    const base = `codehub/${userId}/`
    return full.startsWith(base) ? full.slice(base.length) : full
  }

  async function fetchSignedUrl() {
    if (!path) return
    setError("")
    setLoading(true)
    try {
      const res = await fetch("/api/codehub/sign-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || "Failed to get access URL")
      setSignedUrl(data.url)
    } catch (e: any) {
      setError(e?.message || "Failed to get access URL")
    } finally {
      setLoading(false)
    }
  }

  async function loadFilePreview() {
    if (!signedUrl || type !== "file") return
    try {
      const res = await fetch(signedUrl)
      const text = await res.text()
      setContent(text)
    } catch {}
  }

  async function loadFolderChildren() {
    if (type !== "folder") return
    const prefix = relPrefixFromPath(path)
    try {
      const query = new URLSearchParams()
      query.set('prefix', prefix)
      if (userId) query.set('userId', userId)
      const res = await fetch(`/api/codehub/list?${query.toString()}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Failed to list folder')
      setChildren(data.items || [])
    } catch (e: any) {
      setError(e?.message || 'Failed to list folder')
    }
  }

  useEffect(() => {
    if (path) fetchSignedUrl()
    loadFolderChildren()
  }, [path])

  useEffect(() => {
    loadFilePreview()
  }, [signedUrl])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/code-hub"><Button variant="ghost" className="text-gray-300"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button></Link>
          <h1 className="text-xl font-bold">{title}</h1>
          <Badge className="bg-gray-700 ml-2">{name}</Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="border-gray-600 text-gray-300" onClick={() => { fetchSignedUrl(); loadFolderChildren(); }}><RefreshCw className="w-4 h-4 mr-2"/> Refresh</Button>
          {signedUrl && (
            <a href={signedUrl} target="_blank" rel="noreferrer">
              <Button variant="secondary" className="text-gray-900"><Link2 className="w-4 h-4 mr-1"/> Open</Button>
            </a>
          )}
          {signedUrl && type === "file" && (
            <a href={signedUrl} download>
              <Button variant="default"><Download className="w-4 h-4 mr-1"/> Download</Button>
            </a>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pb-10 space-y-6">
        {error && (
          <div className="text-sm text-red-300 bg-red-900/20 border border-red-800 p-3 rounded">{error}</div>
        )}

        <Card className="bg-gray-800/40 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded bg-gray-700/60 flex items-center justify-center text-blue-300">
                {type === "folder" ? <FolderOpen className="w-5 h-5"/> : <FileCode className="w-5 h-5"/>}
              </div>
              <div className="min-w-0">
                <div className="font-semibold truncate">{name}</div>
                <div className="text-xs text-gray-400 truncate">{path}</div>
              </div>
            </div>

            {type === "file" ? (
              <div className="space-y-2">
                <div className="text-xs text-gray-400">Preview (read-only). Use Open for full access.</div>
                <Textarea className="h-[60vh] font-mono text-sm" value={content} readOnly/>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="text-xs text-gray-400">Folder contents</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {children.map((child) => (
                    <div key={child.path} className="flex items-center justify-between p-2 rounded border border-gray-700 bg-gray-900/40">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-7 h-7 rounded bg-gray-700/60 flex items-center justify-center ${child.type === 'folder' ? 'text-purple-300' : 'text-blue-300'}`}>
                          {child.type === 'folder' ? <FolderOpen className="w-4 h-4"/> : <FileCode className="w-4 h-4"/>}
                        </div>
                        <div className="min-w-0">
                          <div className="text-white truncate">{child.name}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {child.type === 'file' && (
                          <Button size="sm" onClick={async () => {
                            const res = await fetch('/api/codehub/sign-url', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ path: child.path }) })
                            const data = await res.json()
                            if (res.ok && data.url) window.open(data.url, '_blank')
                          }}>Open</Button>
                        )}
                      </div>
                    </div>
                  ))}
                  {children.length === 0 && (
                    <div className="text-sm text-gray-400">This folder is empty.</div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}