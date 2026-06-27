"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Upload, FolderOpen, FileCode, RefreshCw, Trash2, CheckCircle2, AlertTriangle, Users } from "lucide-react"

interface RemoteFile {
  path: string
  name: string
  size: number
  updated_at?: string
  type: "file" | "folder"
}

export default function CodeHubPage() {
  const [userId, setUserId] = useState<string>("")
  const [files, setFiles] = useState<RemoteFile[]>([])
  const [currentPrefix, setCurrentPrefix] = useState<string>("")
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem("user")
      const user = raw ? JSON.parse(raw) : null
      if (user?.id) setUserId(user.id)
    } catch {}
  }, [])

  function toRelative(fullPath: string) {
    if (!userId) return fullPath
    const base = `codehub/${userId}/`
    return fullPath.startsWith(base) ? fullPath.slice(base.length) : fullPath
  }

  async function loadFiles(prefix = "") {
    setError(null)
    try {
      const query = new URLSearchParams()
      query.set('prefix', prefix)
      if (userId) query.set('userId', userId)
      const res = await fetch(`/api/codehub/list?${query.toString()}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || "Failed to list files")
      setFiles(data.items || [])
      setCurrentPrefix(prefix)
    } catch (e: any) {
      setError(e?.message || "Failed to list files")
    }
  }

  useEffect(() => {
    loadFiles("")
  }, [])

  function handleFilesSelected(list: FileList | null) {
    if (!list || list.length === 0) return
    uploadItems(Array.from(list), false)
  }

  function handleFolderSelected(list: FileList | null) {
    if (!list || list.length === 0) return
    // Folder upload comes as files with webkitRelativePath
    uploadItems(Array.from(list), true)
  }

  async function uploadItems(items: File[], isFolder: boolean) {
    if (!userId) {
      setError("Please login first")
      return
    }
    setUploading(true)
    setProgress(0)
    setError(null)
    setSuccess(null)

    try {
      let done = 0
      for (const item of items) {
        const form = new FormData()
        form.append("file", item)
        form.append("userId", userId)
        // Preserve folder structure within user's namespace
        const rel = (item as any).webkitRelativePath || item.name
        form.append("relativePath", rel)

        const res = await fetch("/api/codehub/upload", { method: "POST", body: form })
        const data = await res.json()
        if (!res.ok) throw new Error(data?.error || `Failed to upload ${item.name}`)

        done += 1
        setProgress(Math.round((done / items.length) * 100))
      }

      setSuccess(`Uploaded ${items.length} item(s) successfully`)
      await loadFiles(currentPrefix)
    } catch (e: any) {
      setError(e?.message || "Upload failed")
    } finally {
      setUploading(false)
    }
  }

  async function deleteItem(path: string) {
    if (!confirm(`Delete ${path}?`)) return
    setError(null)
    try {
      const res = await fetch("/api/codehub/delete", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ path, userId }) })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || "Delete failed")
      setSuccess(`Deleted ${path}`)
      await loadFiles(currentPrefix)
    } catch (e: any) {
      setError(e?.message || "Delete failed")
    }
  }

  function pathSegments(prefix: string) {
    const parts = prefix.split("/").filter(Boolean)
    const crumbs: { name: string; prefix: string }[] = []
    let acc = ""
    for (const p of parts) {
      acc += p + "/"
      crumbs.push({ name: p, prefix: acc })
    }
    return crumbs
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="border-b border-gray-800 bg-gray-900/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg text-white"><FileCode className="w-5 h-5" /></div>
            <div>
              <h1 className="text-xl font-bold text-white">Code Hub</h1>
              <p className="text-sm text-gray-400">Upload files and folders, manage your workspace</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" className="text-gray-300" onClick={() => loadFiles(currentPrefix)}>
              <RefreshCw className="w-4 h-4 mr-2" /> Refresh
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {error && (
          <div className="flex items-center gap-2 text-red-300 bg-red-900/20 border border-red-800 p-3 rounded">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}
        {success && (
          <div className="flex items-center gap-2 text-green-300 bg-green-900/20 border border-green-800 p-3 rounded">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-sm">{success}</span>
          </div>
        )}

        <Card className="bg-gray-800/40 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Upload</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex items-center justify-between gap-3 p-4 rounded border border-gray-700 hover:border-gray-500 cursor-pointer bg-gray-900/50">
                <div className="flex items-center gap-3">
                  <Upload className="w-5 h-5 text-blue-400" />
                  <div>
                    <div className="text-white font-medium">Select files</div>
                    <div className="text-xs text-gray-400">Choose one or more files to upload</div>
                  </div>
                </div>
                <Input type="file" multiple className="hidden" onChange={(e) => handleFilesSelected(e.target.files)} />
              </label>

              <label className="flex items-center justify-between gap-3 p-4 rounded border border-gray-700 hover:border-gray-500 cursor-pointer bg-gray-900/50">
                <div className="flex items-center gap-3">
                  <FolderOpen className="w-5 h-5 text-purple-400" />
                  <div>
                    <div className="text-white font-medium">Select folder</div>
                    <div className="text-xs text-gray-400">Upload a whole folder (keeps structure)</div>
                  </div>
                </div>
                <Input type="file" webkitdirectory="true" directory="true" className="hidden" onChange={(e) => handleFolderSelected(e.target.files)} />
              </label>
            </div>

            {uploading && (
              <div className="space-y-2">
                <Progress value={progress} />
                <div className="text-xs text-gray-400">Uploading... {progress}%</div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gray-800/40 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              Files <Badge className="bg-gray-700 text-white">{files.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Breadcrumbs */}
            <div className="text-sm text-gray-400 flex items-center gap-2">
              <button className="hover:text-white" onClick={() => loadFiles("")}>root</button>
              {pathSegments(currentPrefix).map((c, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-gray-600">/</span>
                  <button className="hover:text-white" onClick={() => loadFiles(c.prefix)}>{c.name}</button>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {files.map((f) => (
                <div key={f.path} className="p-3 rounded border border-gray-700 bg-gray-900/40 hover:border-gray-500 transition flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-8 h-8 rounded bg-gray-700/60 flex items-center justify-center ${f.type === 'folder' ? 'text-purple-300' : 'text-blue-300'}`}>
                      {f.type === "folder" ? <FolderOpen className="w-4 h-4" /> : <FileCode className="w-4 h-4" />}
                    </div>
                    <div className="min-w-0">
                      <div className="text-white truncate">{f.name}</div>
                      <div className="text-xs text-gray-500 truncate">{f.size} bytes</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {f.type === 'folder' ? (
                      <Button size="sm" variant="outline" className="border-gray-600 text-gray-300" onClick={() => {
                        const rel = toRelative(f.path.endsWith('/') ? f.path : f.path + '/')
                        loadFiles(rel)
                      }}>Open</Button>
                    ) : null}
                    <Link href={`/code-hub/collab?path=${encodeURIComponent(f.path)}&type=${f.type}&name=${encodeURIComponent(f.name)}&userId=${encodeURIComponent(userId)}`}>
                      <Button size="sm" variant="secondary" className="text-gray-900">
                        <Users className="w-4 h-4 mr-1" /> Collaborate
                      </Button>
                    </Link>
                    <Button size="sm" variant="destructive" onClick={() => deleteItem(f.path)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}

              {files.length === 0 && (
                <div className="text-sm text-gray-400">No files here yet. Upload to get started.</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}