"use client"

import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { HamburgerMenu } from "@/components/hamburger-menu"
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Trophy,
  ChevronLeft,
  ChevronRight,
  Plus,
  Filter,
  Search,
  Bell,
  ExternalLink,
  Pencil,
  Trash2,
  X
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Types matching the DB schema
type EventType = "hackathon" | "meeting" | "conference" | "workshop" | string
interface CalendarEvent {
  id?: string
  team_id?: string | null
  created_by?: string // owner user id
  title: string
  description?: string
  date: string // YYYY-MM-DD
  time?: string
  duration?: string
  location?: string
  type?: EventType
  participants?: number
  prize?: string
  status?: string
  color?: string
}

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

function toYMD(date: Date) {
  const y = date.getFullYear()
  const m = `${date.getMonth() + 1}`.padStart(2, "0")
  const d = `${date.getDate()}`.padStart(2, "0")
  return `${y}-${m}-${d}`
}

function firstDayOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

function lastDayOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0)
}

export default function CalendarPage() {
  const params = useSearchParams()
  const teamId = params.get("team_id")

  const [selectedDate, setSelectedDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<"month" | "week" | "day">("month")
  const [filterType, setFilterType] = useState<string>("all")
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchText, setSearchText] = useState("")

  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Add/Edit dialog state
  const [addOpen, setAddOpen] = useState(false)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [editing, setEditing] = useState<CalendarEvent | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)

  const [form, setForm] = useState<CalendarEvent>({
    title: "",
    description: "",
    date: toYMD(new Date()),
    time: "09:00 AM",
    duration: "1 hour",
    location: "",
    type: "meeting",
    participants: 1,
    prize: "",
    status: "upcoming",
    color: "bg-blue-500",
    team_id: teamId || null,
  })

  const from = firstDayOfMonth(selectedDate)
  const to = lastDayOfMonth(selectedDate)

  async function fetchEvents() {
    setLoading(true)
    setError(null)
    try {
      const q = new URLSearchParams()
      q.set("from", toYMD(from))
      q.set("to", toYMD(to))
      if (teamId) q.set("team_id", teamId)

      const res = await fetch(`/api/events?${q.toString()}`)
      if (!res.ok) throw new Error(`Failed to load events`)
      const data: CalendarEvent[] = await res.json()
      setEvents(data)
    } catch (e: any) {
      setError(e?.message || "Failed to load events")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate, teamId])

  const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  const getFirstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay()

  const filteredEvents = useMemo(() => {
    let list = events
    if (filterType !== "all") list = list.filter((e) => e.type === filterType)
    if (searchText.trim()) {
      const s = searchText.toLowerCase()
      list = list.filter(
        (e) =>
          e.title.toLowerCase().includes(s) ||
          (e.description || "").toLowerCase().includes(s) ||
          (e.location || "").toLowerCase().includes(s)
      )
    }
    // sort by date then time (simple)
    return [...list].sort((a, b) => a.date.localeCompare(b.date))
  }, [events, filterType, searchText])

  const counts = useMemo(() => {
    const types = ["hackathon", "meeting", "conference", "workshop"] as const
    return {
      total: events.length,
      hackathon: events.filter((e) => e.type === "hackathon").length,
      meeting: events.filter((e) => e.type === "meeting").length,
      conference: events.filter((e) => e.type === "conference").length,
      workshop: events.filter((e) => e.type === "workshop").length,
    }
  }, [events])

  function dayEvents(day: number) {
    return filteredEvents.filter((event) => {
      const d = new Date(event.date)
      return (
        d.getDate() === day &&
        d.getMonth() === selectedDate.getMonth() &&
        d.getFullYear() === selectedDate.getFullYear()
      )
    })
  }

  function openAdd(date?: string) {
    setEditing(null)
    setForm({
      title: "",
      description: "",
      date: date || toYMD(new Date()),
      time: "09:00 AM",
      duration: "1 hour",
      location: "",
      type: "meeting",
      participants: 1,
      prize: "",
      status: "upcoming",
      color: "bg-blue-500",
      team_id: teamId || null,
    })
    setAddOpen(true)
  }

  function openEdit(ev: CalendarEvent) {
    setEditing(ev)
    setForm({ ...ev })
    setAddOpen(true)
  }

  async function saveEvent() {
    setError(null)
    const payload: CalendarEvent = { ...form, team_id: teamId || form.team_id || null }
    const isEdit = Boolean(editing?.id)
    const url = isEdit ? `/api/events/${editing!.id}` : `/api/events`
    const method = isEdit ? "PUT" : "POST"

    // Attach creator on create (from localStorage user)
    if (!isEdit) {
      try {
        const raw = typeof window !== 'undefined' ? localStorage.getItem('user') : null
        const user = raw ? JSON.parse(raw) : null
        if (user?.id) (payload as any).created_by = user.id
      } catch {}
    }

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        // Try to extract detailed error from API
        let message = isEdit ? "Failed to update event" : "Failed to create event"
        try {
          const data = await res.json()
          if (data?.error) message = `${message}: ${data.error}`
        } catch {
          // fallback to status text if body isn't JSON
          if (res.statusText) message = `${message}: ${res.statusText}`
        }
        setError(message)
        return
      }

      await fetchEvents()
      setAddOpen(false)
      setEditing(null)
    } catch (e: any) {
      setError(e?.message || (isEdit ? "Failed to update event" : "Failed to create event"))
    }
  }

  async function deleteEvent(id?: string) {
    if (!id) return
    
    try {
      console.log('Attempting to delete event:', id)
      const res = await fetch(`/api/events/${id}`, { method: "DELETE" })
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: 'Unknown error' }))
        console.error('Delete event API error:', res.status, errorData)
        throw new Error(errorData.error || `Failed to delete event (${res.status})`)
      }
      
      const result = await res.json()
      console.log('Event deleted successfully:', result)
      
      await fetchEvents()
      setDetailsOpen(false)
      setSelectedEvent(null)
    } catch (error) {
      console.error('Delete event error:', error)
      throw error
    }
  }

  function colorForType(type?: string) {
    switch (type) {
      case "hackathon":
        return "bg-blue-500"
      case "meeting":
        return "bg-green-500"
      case "conference":
        return "bg-purple-500"
      case "workshop":
        return "bg-orange-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <div className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <HamburgerMenu />
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <CalendarIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Calendar</h1>
                  <p className="text-sm text-gray-400">Manage your events and deadlines</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 bg-transparent" onClick={() => setSearchOpen((v) => !v)}>
                <Search className="w-4 h-4 mr-2" />
                {searchOpen ? "Close" : "Search"}
              </Button>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={() => openAdd()}>
                <Plus className="w-4 h-4 mr-2" />
                Add Event
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Optional search bar */}
      {searchOpen && (
        <div className="bg-gray-900/70 border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-3">
            <Input placeholder="Search by title, description, or location..." value={searchText} onChange={(e) => setSearchText(e.target.value)} />
            <Button variant="ghost" className="text-gray-300" onClick={() => setSearchText("")}>Clear</Button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-4 text-red-400 text-sm">{error}</div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Calendar View */}
          <div className="lg:col-span-3">
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1))}
                      className="text-gray-300 hover:text-white"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <h2 className="text-2xl font-bold text-white">
                      {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}
                    </h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1))}
                      className="text-gray-300 hover:text-white"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    {["month", "week", "day"].map((mode) => (
                      <Button
                        key={mode}
                        variant={viewMode === mode ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode(mode as any)}
                        className={viewMode === mode ? "bg-blue-600" : "text-gray-300"}
                      >
                        {mode.charAt(0).toUpperCase() + mode.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1 mb-4">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <div key={day} className="p-3 text-center text-sm font-medium text-gray-400">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: getFirstDayOfMonth(selectedDate) }, (_, i) => (
                    <div key={`empty-${i}`} className="p-3 h-24" />
                  ))}
                  {Array.from({ length: getDaysInMonth(selectedDate) }, (_, i) => {
                    const day = i + 1
                    const dayList = dayEvents(day)
                    const thisDate = toYMD(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day))
                    return (
                      <div
                        key={day}
                        className="p-2 h-24 border border-gray-700 rounded-lg hover:bg-gray-700/30 transition-all duration-200 cursor-pointer group"
                        onClick={() => openAdd(thisDate)}
                      >
                        <div className="text-sm text-white font-medium mb-1">{day}</div>
                        <div className="space-y-1">
                          {dayList.slice(0, 2).map((event, idx) => (
                            <div
                              key={idx}
                              className={`text-xs px-2 py-1 rounded text-white truncate ${event.color || colorForType(event.type)} opacity-80 group-hover:opacity-100 transition-opacity`}
                              onClick={(e) => {
                                e.stopPropagation()
                                setSelectedEvent(event)
                                setDetailsOpen(true)
                              }}
                            >
                              {event.title}
                            </div>
                          ))}
                          {dayList.length > 2 && (
                            <div className="text-xs text-gray-400">+{dayList.length - 2} more</div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Filters */}
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-white flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { value: "all", label: "All Events", count: counts.total },
                  { value: "hackathon", label: "Hackathons", count: counts.hackathon },
                  { value: "meeting", label: "Meetings", count: counts.meeting },
                  { value: "conference", label: "Conferences", count: counts.conference },
                  { value: "workshop", label: "Workshops", count: counts.workshop },
                ].map((filter) => (
                  <button
                    key={filter.value}
                    onClick={() => setFilterType(filter.value)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                      filterType === filter.value
                        ? "bg-blue-600 text-white"
                        : "bg-gray-700/50 text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    <span>{filter.label}</span>
                    <Badge variant="secondary" className="bg-gray-600 text-white">
                      {filter.count}
                    </Badge>
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-white flex items-center gap-2">
                  <Bell className="w-4 h-4" />
                  Upcoming Events
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {filteredEvents.slice(0, 5).map((event) => (
                  <div
                    key={event.id || event.title}
                    className="p-4 bg-gray-700/30 rounded-lg border border-gray-600 hover:border-gray-500 transition-all duration-200 group cursor-pointer"
                    onClick={() => { setSelectedEvent(event); setDetailsOpen(true) }}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-3 h-3 rounded-full ${event.color || colorForType(event.type)} mt-2 group-hover:scale-110 transition-transform`} />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-white truncate group-hover:text-blue-400 transition-colors">
                          {event.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1 text-sm text-gray-400">
                          <Clock className="w-3 h-3" />
                          {event.time}
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-sm text-gray-400">
                          <MapPin className="w-3 h-3" />
                          {event.location}
                        </div>
                        {event.type === "hackathon" && event.prize && (
                          <div className="flex items-center gap-2 mt-2">
                            <Badge className="bg-green-600 text-white">
                              <Trophy className="w-3 h-3 mr-1" />
                              {event.prize}
                            </Badge>
                          </div>
                        )}
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-400 transition-colors" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-white">This Month</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Total Events</span>
                  <span className="text-2xl font-bold text-white">{counts.total}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Hackathons</span>
                  <span className="text-white">{counts.hackathon}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Meetings</span>
                  <span className="text-white">{counts.meeting}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Conferences</span>
                  <span className="text-white">{counts.conference}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Workshops</span>
                  <span className="text-white">{counts.workshop}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Add/Edit Event Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Event" : "Add Event"}</DialogTitle>
            <DialogDescription>Provide full details for the event.</DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-300">Title</label>
              <Input className="bg-white text-gray-900 placeholder:text-gray-500" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div>
              <label className="text-sm text-gray-300">Date</label>
              <Input className="bg-white text-gray-900 placeholder:text-gray-500" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </div>
            <div>
              <label className="text-sm text-gray-300">Time</label>
              <Input className="bg-white text-gray-900 placeholder:text-gray-500" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} placeholder="09:00 AM" />
            </div>
            <div>
              <label className="text-sm text-gray-300">Duration</label>
              <Input className="bg-white text-gray-900 placeholder:text-gray-500" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="1 hour" />
            </div>
            <div>
              <label className="text-sm text-gray-300">Location</label>
              <Input className="bg-white text-gray-900 placeholder:text-gray-500" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            </div>
            <div>
              <label className="text-sm text-gray-300">Type</label>
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v, color: colorForType(v) })}>
                <SelectTrigger className="bg-white text-gray-900"><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="hackathon">Hackathon</SelectItem>
                  <SelectItem value="meeting">Meeting</SelectItem>
                  <SelectItem value="conference">Conference</SelectItem>
                  <SelectItem value="workshop">Workshop</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm text-gray-300">Participants</label>
              <Input className="bg-white text-gray-900 placeholder:text-gray-500" type="number" value={form.participants ?? 0} onChange={(e) => setForm({ ...form, participants: Number(e.target.value) })} />
            </div>
            <div>
              <label className="text-sm text-gray-300">Prize (for hackathons)</label>
              <Input className="bg-white text-gray-900 placeholder:text-gray-500" value={form.prize || ""} onChange={(e) => setForm({ ...form, prize: e.target.value })} />
            </div>
            <div>
              <label className="text-sm text-gray-300">Status</label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                <SelectTrigger className="bg-white text-gray-900"><SelectValue placeholder="Select status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="registered">Registered</SelectItem>
                  <SelectItem value="interested">Interested</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="deadline-soon">Deadline Soon</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm text-gray-300">Description</label>
              <Textarea className="bg-white text-gray-900 placeholder:text-gray-500" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button variant="outline" className="border-gray-600 text-gray-300" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={async () => {
              try { await saveEvent() } catch (e) { alert((e as Error).message) }
            }}>{editing ? "Save Changes" : "Create Event"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Event Details</DialogTitle>
            <DialogDescription>Full information about this event.</DialogDescription>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${selectedEvent.color || colorForType(selectedEvent.type)}`} />
                <span className="text-lg font-semibold">{selectedEvent.title}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-300">
                <div><span className="text-gray-400">Date:</span> {selectedEvent.date}</div>
                <div><span className="text-gray-400">Time:</span> {selectedEvent.time}</div>
                <div><span className="text-gray-400">Duration:</span> {selectedEvent.duration}</div>
                <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {selectedEvent.location}</div>
                <div><span className="text-gray-400">Type:</span> {selectedEvent.type}</div>
                <div><span className="text-gray-400">Participants:</span> {selectedEvent.participants ?? 0}</div>
                {selectedEvent.prize && (
                  <div className="flex items-center gap-1"><Trophy className="w-4 h-4" /> {selectedEvent.prize}</div>
                )}
                <div><span className="text-gray-400">Status:</span> {selectedEvent.status}</div>
              </div>
              {selectedEvent.description && (
                <div className="text-sm text-gray-200 whitespace-pre-wrap">
                  {selectedEvent.description}
                </div>
              )}
              <div className="flex justify-end gap-2 mt-4">
                {(() => {
                  // Determine current user id from localStorage
                  let canManage = false
                  try {
                    const raw = typeof window !== 'undefined' ? localStorage.getItem('user') : null
                    const user = raw ? JSON.parse(raw) : null
                    // Allow manage if creator matches OR if created_by is missing/null (fallback for demo)
                    if (!selectedEvent?.created_by) canManage = true
                    if (user?.id && selectedEvent?.created_by === user.id) canManage = true
                  } catch {}

                  if (canManage) {
                    return (
                      <>
                        <Button variant="outline" className="border-gray-600 text-gray-300" onClick={() => { setDetailsOpen(false); openEdit(selectedEvent) }}>
                          <Pencil className="w-4 h-4 mr-1" /> Edit
                        </Button>
                        <Button variant="destructive" onClick={async () => { if (confirm("Delete this event?")) { try { await deleteEvent(selectedEvent.id) } catch (e) { alert((e as Error).message) } } }}>
                          <Trash2 className="w-4 h-4 mr-1" /> Delete
                        </Button>
                      </>
                    )
                  }

                  return (
                    <span className="text-gray-400 text-sm">You can’t edit or delete this event</span>
                  )
                })()}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
