export interface LocalRegistration {
  id: string
  hackathon_id: string
  user_id: string
  joined_at: string
  full_name?: string
  email?: string
  phone?: string
  city?: string
  state?: string
  country?: string
  hackathon_title?: string
  user_name?: string
  user_email?: string
}

const STORAGE_KEY = "localRegistrations"

export function getLocalRegistrations(): LocalRegistration[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]")
  } catch {
    return []
  }
}

export function saveLocalRegistration(registration: Omit<LocalRegistration, "id" | "joined_at">): LocalRegistration {
  const registrations = getLocalRegistrations()

  // Avoid duplicate registration (same user + hackathon)
  const existing = registrations.find(
    (r) => r.hackathon_id === registration.hackathon_id && r.user_id === registration.user_id
  )
  if (existing) return existing

  const newRegistration: LocalRegistration = {
    ...registration,
    id: `local-reg-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
    joined_at: new Date().toISOString(),
  }

  registrations.push(newRegistration)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(registrations))
  return newRegistration
}

export function getLocalRegistrationsForHackathon(hackathonId: string): LocalRegistration[] {
  return getLocalRegistrations().filter((r) => r.hackathon_id === hackathonId)
}