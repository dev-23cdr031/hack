// Shared registry of all user-facing pages so /admin can control them
export interface PageEntry {
  path: string
  name: string
  group: string
}

export const APP_PAGES: PageEntry[] = [
  { path: "/", name: "Home", group: "General" },
  { path: "/about", name: "About Us", group: "General" },
  { path: "/terms", name: "Terms & Conditions", group: "General" },
  { path: "/privacy", name: "Privacy Policy", group: "General" },
  { path: "/faq", name: "FAQ", group: "General" },
  { path: "/help", name: "Help Center", group: "General" },
  { path: "/contact", name: "Contact", group: "General" },
  { path: "/get-started", name: "Get Started", group: "General" },
  { path: "/docs", name: "Documentation", group: "General" },
  { path: "/services", name: "Services", group: "General" },
  { path: "/downloads", name: "Downloads", group: "General" },
  { path: "/themes", name: "Themes", group: "General" },
  { path: "/feedback", name: "Feedback", group: "General" },
  { path: "/notifications", name: "Notifications", group: "General" },
  { path: "/quick-actions", name: "Quick Actions", group: "General" },

  { path: "/profile", name: "My Profile", group: "Profile" },
  { path: "/settings", name: "Settings", group: "Profile" },
  { path: "/saved", name: "Saved", group: "Profile" },
  { path: "/favorites", name: "Favorites", group: "Profile" },
  { path: "/achievements", name: "Achievements", group: "Profile" },
  { path: "/activity", name: "Activity", group: "Profile" },
  { path: "/calendar", name: "Calendar", group: "Profile" },
  { path: "/hack-streak", name: "Hack Streak", group: "Profile" },
  { path: "/rankings", name: "Rankings", group: "Profile" },
  { path: "/portfolio", name: "Portfolio", group: "Profile" },
  { path: "/resume", name: "Resume", group: "Profile" },

  { path: "/hackathons", name: "Hackathons", group: "Hackathons" },
  { path: "/create-hackathon", name: "Create Hackathon", group: "Hackathons" },
  { path: "/teams", name: "Teams", group: "Teams" },
  { path: "/admin", name: "Admin Dashboard", group: "Admin" },

  { path: "/public", name: "Public Profiles", group: "Community" },
  { path: "/community", name: "Community", group: "Community" },

  { path: "/messages", name: "Messages", group: "Communication" },
  { path: "/meetings", name: "Meetings", group: "Communication" },
  { path: "/hack-meet", name: "Hack Meet", group: "Communication" },

  { path: "/plagiarism", name: "Plagiarism Checker", group: "Tools" },
  { path: "/code-hub", name: "Code Hub", group: "Tools" },
  { path: "/aadhaar-ai", name: "Aadhaar AI", group: "Tools" },
]

// Pages that the admin can never disable (auth / admin / API / notice page)
export const PROTECTED_PATHS = [
  "/admin",
  "/api",
  "/auth",
  "/blocked",
  "/_next",
]
