"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Menu,
  Settings,
  User,
  Bell,
  HelpCircle,
  Shield,
  LogOut,
  Palette,
  Globe,
  Download,
  Share2,
  BookOpen,
  Users,
  MessageCircle,
  Home,
  Compass,
  Trophy,
  Calendar,
  Star,
  Bookmark,
  Activity,
  Zap,
  Code,
  Flame,
  Video,
  TrendingUp,
  Plus,
  Fingerprint,
} from "lucide-react"
import Link from "next/link"
import { isAdminEmail } from "@/lib/admin"

export function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Check if the current user is an admin (by email only)
    try {
      const raw = localStorage.getItem('user')
      const user = raw ? JSON.parse(raw) : null
      setIsAdmin(isAdminEmail(user?.email))
    } catch {
      setIsAdmin(false)
    }
  }, [])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const menuItems = [
    {
      category: "Navigation",
      items: [
        { icon: Home, label: "Home", href: "/", description: "Back to homepage" },
        { icon: Compass, label: "Explore", href: "/hackathons", description: "Discover hackathons" },
        ...(isAdmin ? [{ icon: Plus, label: "Create Hackathon", href: "/admin", description: "Create hackathons from the admin dashboard" }] : []),
        { icon: Globe, label: "Public Access", href: "/public", description: "Browse public user profiles" },
        { icon: Users, label: "Teams", href: "/teams", description: "Find or create teams" },
        { icon: MessageCircle, label: "Messages", href: "/messages", description: "Chat with teammates" },
        { icon: Calendar, label: "Meetings", href: "/meetings", description: "View all meetings" },
        { icon: Video, label: "Hack Meet", href: "/hack-meet", description: "Video meetings with your team" },
        { icon: TrendingUp, label: "Rankings", href: "/rankings", description: "User rankings and leaderboard" },
        { icon: User, label: "Profile", href: "/profile", description: "View your profile" },
      ],
    },
    {
      category: "Account",
      items: [
        { icon: Settings, label: "Settings", href: "/settings", description: "Account preferences" },
        { icon: Bell, label: "Notifications", href: "/notifications", description: "Manage notifications" },
        { icon: Bookmark, label: "Saved", href: "/saved", description: "Your saved items" },
        { icon: Activity, label: "Activity", href: "/activity", description: "Your recent activity" },
      ],
    },
    {
      category: "Tools",
      items: [
        { icon: Calendar, label: "Calendar", href: "/calendar", description: "Upcoming events" },
        { icon: Trophy, label: "Achievements", href: "/achievements", description: "Your accomplishments" },
        { icon: Star, label: "Favorites", href: "/favorites", description: "Favorite hackathons" },
        { icon: Zap, label: "Quick Actions", href: "/quick-actions", description: "Shortcuts and tools" },
        { icon: Code, label: "Code Hub", href: "/code-hub", description: "Your code workspace" },
        { icon: Flame, label: "Hack Streak", href: "/hack-streak", description: "Track your daily coding streak" },
        { icon: Fingerprint, label: "Aadhaar AI", href: "/aadhaar-ai", description: "AI-powered Aadhaar verification" },
      ],
    },
    {
      category: "Support",
      items: [
        { icon: HelpCircle, label: "Help Center", href: "/help", description: "Get help and support" },
        { icon: BookOpen, label: "Documentation", href: "/docs", description: "API and guides" },
        { icon: Share2, label: "Feedback", href: "/feedback", description: "Share your thoughts" },
        { icon: Globe, label: "Community", href: "/community", description: "Join discussions" },
      ],
    },
    {
      category: "Other",
      items: [
        ...(isAdmin ? [{ icon: Shield, label: "Admin Dashboard", href: "/admin", description: "Manage hackathons" }] : []),
        { icon: Palette, label: "Themes", href: "/themes", description: "Customize appearance" },
        { icon: Download, label: "Downloads", href: "/downloads", description: "Your downloads" },
        { icon: Shield, label: "Privacy", href: "/privacy", description: "Privacy settings" },
        { icon: LogOut, label: "Sign Out", href: "/auth/logout", description: "Sign out of account" },
      ],
    },
  ]

  return (
    <div className="relative" ref={menuRef}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="text-gray-300 hover:text-white hover:bg-gray-800 p-2"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-[calc(100vw-2rem)] max-w-80 bg-gray-900 border border-gray-700 rounded-lg shadow-2xl z-50 max-h-[80vh] overflow-y-auto">
          <div className="p-4">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Menu className="w-5 h-5 text-blue-400" />
              Quick Menu
            </h3>

            {menuItems.map((category, categoryIndex) => (
              <div key={categoryIndex} className="mb-6 last:mb-0">
                <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-3">{category.category}</h4>
                <div className="space-y-1">
                  {category.items.map((item, itemIndex) => (
                    <Link
                      key={itemIndex}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors group"
                    >
                      <div className="flex-shrink-0">
                        <item.icon className="w-4 h-4 text-gray-400 group-hover:text-blue-400 transition-colors" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors">
                          {item.label}
                        </div>
                        <div className="text-xs text-gray-500 truncate">{item.description}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}

            <div className="border-t border-gray-700 pt-4 mt-4">
              <div className="text-xs text-gray-500 text-center">HackConnect v2.0 • Made with ❤️ for developers</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}