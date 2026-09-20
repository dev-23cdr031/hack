"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Shield, Plus, Pencil, Trash2, Users, Calendar, MapPin, Trophy,
  Loader2, CheckCircle, XCircle, ArrowLeft, Eye, FileText, UserCheck,
  Power, Globe, Lock, Unlock, ShieldCheck
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { isAdminEmail } from "@/lib/admin"

interface Hackathon {
  id: string
  title: string
  description?: string
  start_date: string
  end_date: string
  location?: string
  type: string
  max_participants?: number
  current_participants: number
  status: string
  prize_amount?: number
  skill_level?: string
  eligibility?: string
  created_by?: string
  creator?: { id: string; name: string; email: string }
}

interface Registration {
  id: string
  hackathon_id: string
  user_id: string
  joined_at: string
  hackathons?: { id: string; title: string; created_by: string }
  users?: { id: string; name: string; email: string }
}

interface PageAccess {
  path: string
  name: string
  group: string
  is_enabled: boolean
}

export default function AdminPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  const [hackathons, setHackathons] = useState<Hackathon[]>([])
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isAdmin, setIsAdmin] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)

  const [editingHackathon, setEditingHackathon] = useState<Hackathon | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    start_date: "",
    end_date: "",
    location: "",
    type: "online",
    max_participants: "",
    prize_amount: "",
    skill_level: "all-levels",
    eligibility: "",
    status: "upcoming",
  })

  // Page Access Control state
  const [pageAccess, setPageAccess] = useState<PageAccess[]>([])
  const [pageAccessLoading, setPageAccessLoading] = useState(false)
  const [pageSavingPath, setPageSavingPath] = useState<string | null>(null)
  const [pageSaveMsg, setPageSaveMsg] = useState("")

  const handleDelete = async (hackathonId: string) => {
    if (!confirm("Are you sure you want to delete this hackathon? This action cannot be undone.")) {
      return
    }
    
    setDeleting(hackathonId)
    try {
      const res = await fetch(`/api/hackathons/${hackathonId}`, {
        method: "DELETE",
      })
      
      if (res.ok) {
        // Refresh hackathons list
        fetchHackathons()
      } else {
        const data = await res.json()
        setError(data.error || "Failed to delete hackathon")
      }
    } catch (e) {
      console.error("Delete error:", e)
      setError("Failed to delete hackathon")
    } finally {
      setDeleting(null)
    }
  }

  const handleEdit = (hackathon: Hackathon) => {
    setEditingHackathon(hackathon)
    setFormData({
      title: hackathon.title,
      description: hackathon.description || "",
      start_date: hackathon.start_date?.split('T')[0] || "",
      end_date: hackathon.end_date?.split('T')[0] || "",
      location: hackathon.location || "",
      type: hackathon.type as string || "online",
      max_participants: hackathon.max_participants?.toString() || "",
      prize_amount: hackathon.prize_amount?.toString() || "",
      skill_level: hackathon.skill_level as string || "all-levels",
      eligibility: hackathon.eligibility || "",
      status: hackathon.status as string || "upcoming",
    })
    setShowForm(true)
  }

  const handleSaveEdit = async () => {
    if (!editingHackathon) return
    
    setSaving(true)
    try {
      const user = localStorage.getItem("user")
      const userData = user ? JSON.parse(user) : null
      
      const payload = {
        ...formData,
        max_participants: formData.max_participants ? parseInt(formData.max_participants) : undefined,
        prize_amount: formData.prize_amount ? parseFloat(formData.prize_amount) : undefined,
      }
      delete payload.status

      const res = await fetch(`/api/hackathons/${editingHackathon.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
      
      if (res.ok) {
        setShowForm(false)
        setEditingHackathon(null)
        fetchHackathons()
      } else {
        const data = await res.json()
        setError(data.error || "Failed to update hackathon")
      }
    } catch (e) {
      console.error("Update error:", e)
      setError("Failed to update hackathon")
    } finally {
      setSaving(false)
    }
  }

  useEffect(() => {
    let active = true
    ;(async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        if (active) router.push("/auth/login")
        return
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single()

      if (active) {
        const emailAllowed = isAdminEmail(session.user.email)
        setIsAdmin(emailAllowed)
        setCheckingAuth(false)
      }
    })()
    return () => { active = false }
  }, [router])

  useEffect(() => {
    if (isAdmin) {
      fetchHackathons()
      fetchRegistrations()
      fetchPageAccess()
    }
  }, [isAdmin])

  const fetchHackathons = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/hackathons")
      const data = await res.json()
      const apiHackathons: Hackathon[] = data.hackathons || []
      setHackathons(apiHackathons)
    } catch (e) {
      console.error("Error fetching hackathons:", e)
      setError("Failed to load hackathons")
    } finally {
      setLoading(false)
    }
  }

  const fetchRegistrations = async () => {
    try {
      const res = await fetch("/api/hackathons/registrations")
      const data = await res.json()
      const apiRegistrations: Registration[] = data.registrations || []
      setRegistrations(apiRegistrations)
    } catch (e) {
      console.error("Error fetching registrations:", e)
      setError("Failed to load registrations")
      setRegistrations([])
    }
  }

  // Load the page access list (merged with defaults)
  const fetchPageAccess = async () => {
    try {
      setPageAccessLoading(true)
      setPageSaveMsg("")
      const res = await fetch("/api/page-access")
      const data = await res.json()
      setPageAccess(Array.isArray(data?.pages) ? data.pages : [])
    } catch (e) {
      console.error("Error fetching page access:", e)
      setPageAccess([])
    } finally {
      setPageAccessLoading(false)
    }
  }

  // Toggle a single page on/off and persist to Supabase
  const handleTogglePage = async (page: PageAccess, enabled: boolean) => {
    setPageSavingPath(page.path)
    setPageSaveMsg("")
    try {
      const { error } = await supabase
        .from("page_access")
        .upsert(
          {
            page_path: page.path,
            page_name: page.name,
            is_enabled: enabled,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "page_path" }
        )
      if (error) throw error
      setPageAccess(prev => prev.map(x => (x.path === page.path ? { ...x, is_enabled: enabled } : x)))
      setPageSaveMsg(`${page.name} is now ${enabled ? "ON (accessible)" : "OFF (blocked)"}`)
    } catch (e: any) {
      console.error("Toggle page error:", e)
      setPageSaveMsg(
        `Failed to save "${page.name}". ${e?.message || ""} — did you run the page_access SQL yet?`
      )
    } finally {
      setPageSavingPath(null)
    }
  }

  // Enable / disable all pages at once
  const handleBulkPages = async (enabled: boolean) => {
    setPageSavingPath("bulk")
    setPageSaveMsg("")
    try {
      const rows = pageAccess.map(p => ({
        page_path: p.path,
        page_name: p.name,
        is_enabled: enabled,
        updated_at: new Date().toISOString(),
      }))
      const { error } = await supabase.from("page_access").upsert(rows, { onConflict: "page_path" })
      if (error) throw error
      setPageAccess(prev => prev.map(p => ({ ...p, is_enabled: enabled })))
      setPageSaveMsg(`All pages ${enabled ? "enabled" : "disabled"}`)
    } catch (e: any) {
      console.error("Bulk page error:", e)
      setPageSaveMsg(`Failed to update pages: ${e?.message || "error"}`)
    } finally {
      setPageSavingPath(null)
    }
  }

  const handleCreate = () => {
    setEditingHackathon(null)
    setFormData({ title: "", description: "", start_date: "", end_date: "", location: "", type: "online", max_participants: "", prize_amount: "", skill_level: "all-levels", eligibility: "", status: "upcoming" })
    setShowForm(true)
  }




  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError("")
    try {
      // Get current admin user ID from localStorage
      let adminUserId: string | null = null
      try {
        const userData = localStorage.getItem('user')
        const currentUser = userData ? JSON.parse(userData) : null
        adminUserId = currentUser?.id || null
      } catch {}

      // Convert dates to full ISO strings for the database (needs timestamptz)
      const startDate = formData.start_date ? new Date(formData.start_date).toISOString() : null
      const endDate = formData.end_date ? new Date(formData.end_date).toISOString() : null

      const payload: any = {
        title: formData.title,
        description: formData.description,
        start_date: startDate,
        end_date: endDate,
        location: formData.location,
        type: formData.type,
        max_participants: formData.max_participants ? parseInt(formData.max_participants) : undefined,
        prize_amount: formData.prize_amount ? parseInt(formData.prize_amount) : undefined,
        skill_level: formData.skill_level,
        eligibility: formData.eligibility,
        status: formData.status,
      }
      
      // Set organizer_id/created_by fields only if we have a valid admin user ID (must be a UUID for the database)
      if (!editingHackathon && adminUserId) {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
        if (uuidRegex.test(adminUserId)) {
          payload.organizer_id = adminUserId
          payload.created_by = adminUserId
          payload.created_by_email = currentUser?.email || null
        }
      }
      console.log("Sending payload:", payload)
      let res: Response
      if (editingHackathon) {
        res = await fetch(`/api/hackathons/${editingHackathon.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...payload,
            requester_id: adminUserId,
            is_admin: true,
          }),
        })
      } else {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error("Your session has expired. Please sign in again.")
        const { error: insertError } = await supabase.from("hackathons").insert({
          title: formData.title,
          description: formData.description,
          start_date: startDate,
          end_date: endDate,
          location: formData.location || "Virtual",
          type: formData.type,
          max_participants: formData.max_participants ? parseInt(formData.max_participants) : null,
          status: formData.status,
          organizer_id: user.id,
          created_by: user.id,
          created_by_email: user.email,
        })
        if (insertError) throw insertError
        alert("Hackathon created!")
        setShowForm(false)
        setEditingHackathon(null)
        fetchHackathons()
        return
      }
      const data = await res.json()
      console.log("API response:", data)
      if (!res.ok) throw new Error(data.error || "Failed to save")
      alert(editingHackathon ? "Hackathon updated!" : "Hackathon created!")
      setShowForm(false)
      setEditingHackathon(null)
      fetchHackathons()
    } catch (e: any) {
      setError(e.message || "Failed to save")
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-slate-400 mb-6">Only the admin can access this page.</p>
          <Link href="/auth/login"><Button className="bg-blue-600 hover:bg-blue-700">Go to Login</Button></Link>
        </div>
      </div>
    )
  }

  const formatDate = (d: string) => {
    try { return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) }
    catch { return d }
  }

  // Count registrations per hackathon
  const getRegistrationCount = (hackathonId: string) => {
    return registrations.filter(r => r.hackathon_id === hackathonId).length
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <nav className="flex justify-between items-center gap-3 p-4 sm:p-6 md:px-12 bg-slate-900/90 backdrop-blur-sm sticky top-0 z-50 border-b border-slate-800">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <Shield className="w-6 h-6 text-blue-500 flex-shrink-0" />
          <div className="text-lg sm:text-2xl font-bold text-white truncate">Admin Dashboard</div>
        </div>
        <Link href="/" className="flex-shrink-0">
          <Button variant="outline" size="sm" className="bg-transparent border-slate-600 text-white hover:bg-slate-800 px-2 sm:px-4">
            <ArrowLeft className="w-4 h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Back to Home</span>
            <span className="sm:hidden">Home</span>
          </Button>
        </Link>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-white">Hackathon Management</h1>
          <p className="text-slate-50 text-lg font-semibold">Create, edit, delete hackathons and view registrations.</p>
        </div>

        {error && <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">{error}</div>}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 bg-slate-800 border border-slate-700">
            <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-50 hover:text-white font-medium text-xs sm:text-sm"><FileText className="w-4 h-4 mr-2 hidden sm:inline-block" /><span>Overview</span></TabsTrigger>
            <TabsTrigger value="hackathons" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-50 hover:text-white font-medium text-xs sm:text-sm"><Calendar className="w-4 h-4 mr-2 hidden sm:inline-block" /><span>Hackathons</span></TabsTrigger>
            <TabsTrigger value="registrations" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-50 hover:text-white font-medium text-xs sm:text-sm"><UserCheck className="w-4 h-4 mr-2 hidden sm:inline-block" /><span>Registrations</span></TabsTrigger>
            <TabsTrigger value="access" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-50 hover:text-white font-medium text-xs sm:text-sm"><Power className="w-4 h-4 mr-2 hidden sm:inline-block" /><span>Page Access</span></TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-slate-900 border-slate-700 shadow-lg shadow-slate-950/40">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-3xl font-bold text-white">{hackathons.length}</p>
                      <p className="text-slate-50 font-semibold">Total Hackathons</p>
                    </div>
                    <FileText className="w-10 h-10 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-slate-900 border-slate-700 shadow-lg shadow-slate-950/40">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-3xl font-bold text-white">{hackathons.filter(h => h.status === "upcoming").length}</p>
                      <p className="text-slate-50 font-semibold">Upcoming</p>
                    </div>
                    <Calendar className="w-10 h-10 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-slate-900 border-slate-700 shadow-lg shadow-slate-950/40">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-3xl font-bold text-white">{registrations.length}</p>
                      <p className="text-slate-100 font-semibold">Registrations</p>
                    </div>
                    <Users className="w-10 h-10 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </div>
            <Card className="bg-slate-900 border-slate-700 shadow-lg shadow-slate-950/40">
              <CardHeader><CardTitle className="text-white">Quick Actions</CardTitle></CardHeader>
              <CardContent className="flex flex-wrap gap-4">
                <Button onClick={handleCreate} className="bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-lg shadow-blue-600/20"><Plus className="w-4 h-4 mr-2" />Create Hackathon</Button>
                <Button onClick={() => setActiveTab("hackathons")} variant="outline" className="border-slate-600 text-white hover:bg-slate-700 hover:border-slate-500"><Eye className="w-4 h-4 mr-2" />View Hackathons</Button>
                <Button onClick={() => setActiveTab("registrations")} variant="outline" className="border-slate-600 text-white hover:bg-slate-700 hover:border-slate-500"><Users className="w-4 h-4 mr-2" />View Registrations</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hackathons" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">All Hackathons</h2>
              <Button onClick={handleCreate} className="bg-blue-600 hover:bg-blue-700"><Plus className="w-4 h-4 mr-2" />Create Hackathon</Button>
            </div>
            {loading ? (
              <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>
            ) : (
              <div className="space-y-4">
                {hackathons.map(h => (
                  <Card key={h.id} className="bg-slate-900 border-slate-700 shadow-lg shadow-slate-950/40">
                    <CardContent className="pt-6">
                      <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-white">{h.title}</h3>
                            <Badge className={h.status === "upcoming" ? "bg-blue-900/50 text-blue-200" : h.status === "ongoing" ? "bg-green-900/50 text-green-200" : "bg-slate-700 text-slate-200"}>{h.status}</Badge>
                          </div>
                          <p className="text-slate-100 text-sm mb-3 line-clamp-2 font-medium">{h.description}</p>
                          <div className="flex flex-wrap gap-4 text-sm text-slate-50">
                            <span className="flex items-center gap-1"><Calendar className="w-4 h-4 text-slate-200" />{formatDate(h.start_date)} - {formatDate(h.end_date)}</span>
                            <span className="flex items-center gap-1"><MapPin className="w-4 h-4 text-slate-200" />{h.location || "Virtual"}</span>
                            <span className="flex items-center gap-1"><Users className="w-4 h-4 text-slate-200" />{h.current_participants || 0} registered</span>
                            <span className="flex items-center gap-1 text-purple-200 font-semibold"><UserCheck className="w-4 h-4" />{getRegistrationCount(h.id)} registrations</span>
                            {h.prize_amount && <span className="flex items-center gap-1 text-yellow-300"><Trophy className="w-4 h-4" />${h.prize_amount.toLocaleString()}</span>}
                            {h.creator && <span className="flex items-center gap-1 text-blue-300"><UserCheck className="w-4 h-4" />Created by: {h.creator.name}</span>}
                            {!h.creator && h.created_by && <span className="flex items-center gap-1 text-blue-300"><UserCheck className="w-4 h-4" />Created by user</span>}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Link href={`/hackathons/${h.id}`}><Button variant="outline" size="sm" className="border-slate-600 text-white hover:bg-slate-800"><Eye className="w-4 h-4" /></Button></Link>
                          <Button variant="outline" size="sm" className="border-slate-600 text-white hover:bg-slate-800" onClick={() => handleEdit(h)}><Pencil className="w-4 h-4" /></Button>
                          <Button variant="outline" size="sm" className="border-red-600 text-red-400 hover:bg-red-900/20" onClick={() => handleDelete(h.id)}><Trash2 className="w-4 h-4" /></Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {hackathons.length === 0 && (
                  <Card className="bg-slate-900 border-slate-700 shadow-lg shadow-slate-950/40">
                    <CardContent className="pt-6 text-center py-12">
                      <FileText className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-white mb-2">No Hackathons</h3>
                      <p className="text-slate-100 mb-4 font-medium">Create your first hackathon.</p>
                      <Button onClick={handleCreate} className="bg-blue-600 hover:bg-blue-700"><Plus className="w-4 h-4 mr-2" />Create</Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="registrations" className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Hackathon Registrations</h2>
            {registrations.length === 0 ? (
              <Card className="bg-slate-900 border-slate-700 shadow-lg shadow-slate-950/40">
                <CardContent className="pt-6 text-center py-12">
                  <Users className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">No Registrations Yet</h3>
                  <p className="text-slate-100 font-medium">When users register for hackathons, they will appear here.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {registrations.map(reg => (
                  <Card key={reg.id} className="bg-slate-900 border-slate-700 shadow-lg shadow-slate-950/40">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center"><UserCheck className="w-5 h-5 text-blue-500" /></div>
                          <div>
                            <p className="font-semibold text-white">{reg.users?.name || "Unknown"}</p>
                            <p className="text-sm text-slate-100 font-medium">{reg.users?.email}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-slate-50 font-semibold">{reg.hackathons?.title || "Unknown"}</p>
                          <p className="text-xs text-slate-200 font-medium">{formatDate(reg.joined_at)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="access" className="space-y-6">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Globe className="w-6 h-6 text-green-500" />
                  Page Access Control
                </h2>
                <p className="text-slate-300 text-sm mt-1">
                  Turn any page ON or OFF for the whole app. Disabled pages are redirected to /blocked.
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="border-green-600 text-green-400 hover:bg-green-900/30" disabled={pageSavingPath === "bulk"} onClick={() => handleBulkPages(true)}>
                  <Unlock className="w-4 h-4 mr-2" /> Enable All
                </Button>
                <Button variant="outline" className="border-red-600 text-red-400 hover:bg-red-900/30" disabled={pageSavingPath === "bulk"} onClick={() => handleBulkPages(false)}>
                  <Lock className="w-4 h-4 mr-2" /> Disable All
                </Button>
              </div>
            </div>

            {pageSaveMsg && (
              <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-300 text-sm flex items-center gap-2">
                <CheckCircle className="w-4 h-4" /> {pageSaveMsg}
              </div>
            )}

            {pageAccessLoading ? (
              <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>
            ) : (
              <div className="space-y-8">
                {[...new Set(pageAccess.map(p => p.group))].map(group => (
                  <Card key={group} className="bg-slate-900 border-slate-700 shadow-lg shadow-slate-950/40">
                    <CardHeader className="pb-3 border-b border-slate-800">
                      <CardTitle className="text-lg text-white flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-blue-500" /> {group}
                        <Badge className="ml-auto bg-slate-800 text-slate-200">
                          {pageAccess.filter(p => p.group === group).length} pages
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4 divide-y divide-slate-800/60">
                      {pageAccess.filter(p => p.group === group).map(page => (
                        <div key={page.path} className="flex items-center justify-between py-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${page.is_enabled ? "bg-green-500" : "bg-red-500"}`} />
                            <div className="min-w-0">
                              <p className="font-semibold text-white truncate">{page.name}</p>
                              <code className="text-xs text-slate-400">{page.path}</code>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <Badge className={page.is_enabled ? "bg-green-900/40 text-green-300" : "bg-red-900/40 text-red-300"}>
                              {page.is_enabled ? "ON" : "OFF"}
                            </Badge>
                            <Button
                              size="sm"
                              disabled={pageSavingPath === page.path}
                              className={page.is_enabled
                                ? "bg-red-600 hover:bg-red-700 text-white"
                                : "bg-green-600 hover:bg-green-700 text-white"}
                              onClick={() => handleTogglePage(page, !page.is_enabled)}
                            >
                              {pageSavingPath === page.path ? <Loader2 className="w-4 h-4 animate-spin" /> : <Power className="w-4 h-4" />}
                              {page.is_enabled ? "Turn OFF" : "Turn ON"}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700 text-sm text-slate-300">
              <p className="font-semibold text-white mb-1">How it works</p>
              <p>
                Settings are stored in the <code className="text-blue-400">page_access</code> table in Supabase. When a page is OFF, a
                middleware check redirects visitors to <code className="text-blue-400">/blocked</code>.
                Admin, Login, Auth and API routes can never be disabled.
                Note: page blocks are cached for ~30 seconds after saving.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl w-full max-w-2xl">
            <div className="p-6 border-b border-slate-800">
              <h2 className="text-2xl font-bold text-white">{editingHackathon ? "Edit Hackathon" : "Create Hackathon"}</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div><Label className="text-white font-medium">Title *</Label><Input value={formData.title} onChange={e => handleChange("title", e.target.value)} required className="bg-slate-700 border-slate-600 text-white mt-1 placeholder:text-slate-400" /></div>
              <div><Label className="text-white font-medium">Description *</Label><Textarea value={formData.description} onChange={e => handleChange("description", e.target.value)} required rows={3} className="bg-slate-700 border-slate-600 text-white mt-1 placeholder:text-slate-400" /></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><Label className="text-white font-medium">Start Date *</Label><Input type="date" value={formData.start_date} onChange={e => handleChange("start_date", e.target.value)} required className="bg-slate-700 border-slate-600 text-white mt-1" /></div>
                <div><Label className="text-white font-medium">End Date *</Label><Input type="date" value={formData.end_date} onChange={e => handleChange("end_date", e.target.value)} required className="bg-slate-700 border-slate-600 text-white mt-1" /></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><Label className="text-white font-medium">Location</Label><Input value={formData.location} onChange={e => handleChange("location", e.target.value)} className="bg-slate-700 border-slate-600 text-white mt-1 placeholder:text-slate-400" /></div>
                <div>
                  <Label className="text-white">Type</Label>
                  <Select value={formData.type} onValueChange={v => handleChange("type", v)}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="online" className="text-white">Online</SelectItem>
                      <SelectItem value="in-person" className="text-white">In-Person</SelectItem>
                      <SelectItem value="hybrid" className="text-white">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div><Label className="text-white font-medium">Max Participants</Label><Input type="number" value={formData.max_participants} onChange={e => handleChange("max_participants", e.target.value)} className="bg-slate-700 border-slate-600 text-white mt-1 placeholder:text-slate-400" /></div>
                <div><Label className="text-white font-medium">Prize Pool ($)</Label><Input type="number" value={formData.prize_amount} onChange={e => handleChange("prize_amount", e.target.value)} className="bg-slate-700 border-slate-600 text-white mt-1 placeholder:text-slate-400" /></div>
                <div>
                  <Label className="text-white font-medium">Skill Level</Label>
                  <Select value={formData.skill_level} onValueChange={v => handleChange("skill_level", v)}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="beginner" className="text-white">Beginner</SelectItem>
                      <SelectItem value="intermediate" className="text-white">Intermediate</SelectItem>
                      <SelectItem value="advanced" className="text-white">Advanced</SelectItem>
                      <SelectItem value="all-levels" className="text-white">All Levels</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><Label className="text-white font-medium">Eligibility</Label><Input value={formData.eligibility} onChange={e => handleChange("eligibility", e.target.value)} className="bg-slate-700 border-slate-600 text-white mt-1 placeholder:text-slate-400" /></div>
                <div>
                  <Label className="text-white font-medium">Status</Label>
                  <Select value={formData.status} onValueChange={v => handleChange("status", v)}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="upcoming" className="text-white">Upcoming</SelectItem>
                      <SelectItem value="ongoing" className="text-white">Ongoing</SelectItem>
                      <SelectItem value="past" className="text-white">Past</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-4 pt-4 border-t border-slate-800">
                <Button type="button" variant="outline" className="border-slate-600 text-white hover:bg-slate-800" onClick={() => setShowForm(false)}>Cancel</Button>
                <Button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-700">
                  {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</> : <><CheckCircle className="w-4 h-4 mr-2" />{editingHackathon ? "Update" : "Create"}</>}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}