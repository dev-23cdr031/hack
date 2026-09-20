export const ADMIN_EMAILS = [
  "devdharrshans.23csd@kongu.edu",
  "divyadharshinis.23csd@kongu.edu",
  "anusreed.23csd@kongu.edu",
  "divakarv.23csd@kongu.edu",
  "bharanin.23csd@kongu.edu",
  "hemapriyavs.23csd@kongu.edu",
] as const

export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false
  return ADMIN_EMAILS.includes(email.trim().toLowerCase() as (typeof ADMIN_EMAILS)[number])
}
