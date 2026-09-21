import { supabase } from "@/lib/supabase"

/**
 * Client-side profile sync used by login / signup / OAuth callback.
 *
 * Guarantees a row exists in the `users` table (HackConnect's profile store)
 * for the given auth user, WITHOUT failing when optional columns are missing
 * from the database schema:
 *
 *   1. If a profile row already exists -> return it (never duplicated).
 *   2. Otherwise try a full-row upsert (all app columns).
 *   3. If that fails (e.g. "column does not exist"), retry with ONLY the core
 *      columns that every HackConnect schema has, so the user is never hidden
 *      from the Public Profiles / Explore page.
 */
export async function syncUserProfile(authUser: {
  id: string
  email?: string
  user_metadata?: Record<string, any> | null
}): Promise<{ profile: any | null; error?: any }> {
  const metadata = authUser.user_metadata || {}
  const email = authUser.email || ""
  const fullName =
    metadata.full_name ||
    metadata.name ||
    String(email.split("@")[0] || "").trim() ||
    "User"
  const avatarUrl =
    metadata.avatar_url || metadata.picture || "/placeholder-user.jpg"
  const username =
    metadata.username ||
    String((metadata.full_name || metadata.name || email.split("@")[0] || "user"))
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, "_")
  const skills = Array.isArray(metadata.skills)
    ? metadata.skills
    : ["JavaScript", "React"]

  // 1) Reuse an existing profile instead of creating a duplicate.
  const { data: existing, error: existingError } = await supabase
    .from("users")
    .select("*")
    .eq("id", authUser.id)
    .maybeSingle()

  if (!existingError && existing) {
    return { profile: existing }
  }

  // 2) Full-row upsert (works after the migration adds all columns).
  const fullRow = {
    id: authUser.id,
    email,
    name: fullName,
    username,
    title: metadata.title || "Developer",
    bio: metadata.bio || "New HackConnect user",
    skills,
    avatar_url: avatarUrl,
    github_url: metadata.github_url || null,
    linkedin_url: metadata.linkedin_url || null,
    portfolio_url: metadata.portfolio_url || null,
    location: metadata.location || null,
    experience_level: metadata.experience_level || metadata.role || "beginner",
    role: metadata.role || "student",
    college: metadata.college || null,
    hackathon_interests: Array.isArray(metadata.hackathon_interests)
      ? metadata.hackathon_interests
      : [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  const { data: created, error: fullError } = await supabase
    .from("users")
    .upsert(fullRow, { onConflict: "id" })
    .select("*")
    .maybeSingle()

  if (!fullError && created) {
    return { profile: created }
  }

  if (fullError) {
    console.warn("Full profile upsert failed (falling back to core columns):", fullError.message)
  }

  // 3) Core-columns-only upsert (safe on the base users schema).
  const coreRow = {
    id: authUser.id,
    email,
    name: fullName,
    title: metadata.title || "Developer",
    bio: metadata.bio || "New HackConnect user",
    skills,
    avatar_url: avatarUrl,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  const { data: coreCreated, error: coreError } = await supabase
    .from("users")
    .upsert(coreRow, { onConflict: "id" })
    .select("*")
    .maybeSingle()

  if (coreError) {
    console.error("Core profile upsert failed:", coreError.message)
    return { profile: null, error: coreError }
  }

  return { profile: coreCreated }
}

/** Convenience: builds the "currentUser" object the app stores in localStorage. */
export function buildLocalUser(authUser: {
  id: string
  email?: string
  user_metadata?: Record<string, any> | null
}, profile?: any | null) {
  const metadata = authUser.user_metadata || {}
  const email = authUser.email || ""
  const fullName =
    profile?.name ||
    metadata.full_name ||
    metadata.name ||
    email.split("@")[0] ||
    "User"
  const avatarUrl =
    profile?.avatar_url ||
    metadata.avatar_url ||
    metadata.picture ||
    "/placeholder-user.jpg"

  return {
    id: authUser.id,
    email: profile?.email || email,
    name: fullName,
    username: profile?.username || "",
    bio: profile?.bio || metadata.bio || "",
    title: profile?.title || metadata.title || "Developer",
    skills:
      Array.isArray(profile?.skills) && profile.skills.length > 0
        ? profile.skills
        : Array.isArray(metadata.skills)
          ? metadata.skills
          : ["JavaScript", "React"],
    avatar_url: avatarUrl,
    github_url: profile?.github_url || "",
    linkedin_url: profile?.linkedin_url || "",
    portfolio_url: profile?.portfolio_url || "",
    location: profile?.location || metadata.location || "",
    experience_level: profile?.experience_level || metadata.experience_level || "beginner",
    role: profile?.role || metadata.role || "student",
    college: profile?.college || metadata.college || "",
    hackathon_interests: Array.isArray(profile?.hackathon_interests)
      ? profile.hackathon_interests
      : [],
    created_at: profile?.created_at || new Date().toISOString(),
    updated_at: profile?.updated_at || new Date().toISOString(),
  }
}
