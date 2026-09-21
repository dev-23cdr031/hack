-- =====================================================================
-- HackConnect - Automatic Profile Creation, Public Discovery & Messaging
-- =====================================================================
-- Run this ONCE in the Supabase SQL Editor:
--   https://supabase.com/dashboard/project/<your-project-ref>/sql
--
-- Safe / idempotent: it can be run multiple times without breaking.
--
-- What this does:
--   1. Extends the existing `users` table (the app's profile store) with
--      the discovery columns used by the Explore / Public Access page.
--   2. Keeps `profiles` (role checks used by /admin & /create-hackathon)
--      in sync with the same columns so records never go missing.
--   3. Auto-creates a profile row (users + profiles) for EVERY new auth
--      user - email/password AND Google OAuth - via a database trigger.
--   4. Guarantees a direct conversation exists between any two users with
--      a helper function (no duplicate direct conversations possible).
--   5. Hardens RLS so users can read public profiles, update only their
--      own profile, and only access conversations/messages they are part
--      of (sender_id can never be spoofed).
--   6. Enables Supabase Realtime for messages/profiles.
-- =====================================================================

-- -----------------------------------------------------------------------
-- 0. PROFILES TABLE - created FIRST so every later statement can rely on it.
-- -----------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  username text,
  email text,
  avatar_url text,
  bio text,
  skills jsonb DEFAULT '[]'::jsonb,
  college text,
  hackathon_interests jsonb DEFAULT '[]'::jsonb,
  location text,
  role text DEFAULT 'student',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 1. PROFILE DISCOVERY COLUMNS (users table = HackConnect profile store)
-- -----------------------------------------------------------------------
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS username TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS college TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS hackathon_interests JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS experience_level TEXT DEFAULT 'beginner';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'student';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS experience JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS education JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS achievements JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS github_url TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS linkedin_url TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS portfolio_url TEXT;

-- Unique index so usernames stay clickable / unique (nullable usernames OK).
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_username ON public.users(username) WHERE username IS NOT NULL;

-- Useful for filtering on the Explore page.
CREATE INDEX IF NOT EXISTS idx_users_college ON public.users(college);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON public.users(created_at DESC);

-- -----------------------------------------------------------------------
-- 2. PROFILES TABLE - created at the TOP of this script (section 0).
--    This section only adds missing columns / indexes for projects that
--    already had the table installed.
-- -----------------------------------------------------------------------
DO $$
BEGIN
  IF to_regclass('public.profiles') IS NOT NULL THEN
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT;
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS username TEXT;
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS skills JSONB DEFAULT '[]'::jsonb;
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS college TEXT;
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS hackathon_interests JSONB DEFAULT '[]'::jsonb;
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS location TEXT;
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'student';
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON public.profiles(created_at DESC);

-- -----------------------------------------------------------------------
-- 3. AUTOMATIC PROFILE CREATION TRIGGER (email/password + Google OAuth)
--    A new `auth.users` row is created for BOTH flow types, so this single
--    server-side trigger guarantees a profile exists immediately after
--    registration. SECURITY DEFINER lets it bypass RLS.
-- -----------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_full_name text;
  v_avatar_url text;
  v_username text;
BEGIN
  v_full_name := coalesce(
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'name',
    split_part(coalesce(new.email, ''), '@', 1)
  );

  v_avatar_url := coalesce(
    new.raw_user_meta_data ->> 'avatar_url',
    new.raw_user_meta_data ->> 'picture',
    '/placeholder-user.jpg'
  );

  v_username := coalesce(
    new.raw_user_meta_data ->> 'username',
    lower(regexp_replace(v_full_name, '[^a-zA-Z0-9]+', '_', 'g')) || '_' || substr(new.id::text, 1, 6)
  );

  -- Primary profile store: users (everything in the app reads this).
  INSERT INTO public.users (
    id, email, name, full_name, username, title, bio, avatar_url,
    location, experience_level, role, college, hackathon_interests,
    created_at, updated_at
  )
  VALUES (
    new.id,
    coalesce(new.email, ''),
    v_full_name,
    v_full_name,
    v_username,
    coalesce(new.raw_user_meta_data ->> 'title', 'Developer'),
    coalesce(new.raw_user_meta_data ->> 'bio', ''),
    v_avatar_url,
    new.raw_user_meta_data ->> 'location',
    coalesce(new.raw_user_meta_data ->> 'experience_level', 'beginner'),
    CASE WHEN new.raw_user_meta_data ->> 'role' IN ('student','mentor','organizer','admin')
         THEN new.raw_user_meta_data ->> 'role' ELSE 'student' END,
    new.raw_user_meta_data ->> 'college',
    CASE
      WHEN jsonb_typeof(new.raw_user_meta_data->'hackathon_interests') = 'array'
        THEN new.raw_user_meta_data->'hackathon_interests'
      ELSE '[]'::jsonb
    END,
    now(), now()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = excluded.email,
    name = excluded.name,
    full_name = excluded.full_name,
    username = COALESCE(public.users.username, excluded.username),
    avatar_url = COALESCE(NULLIF(public.users.avatar_url, ''), excluded.avatar_url),
    updated_at = now();

  -- Secondary store: profiles table (role checks used by /admin etc.)
  -- Guarded: some HackConnect projects may not have the profiles/user_role
  -- schema installed yet - the users table above remains the source of truth.
  IF to_regclass('public.profiles') IS NOT NULL THEN
    IF to_regtype('public.user_role') IS NOT NULL THEN
      INSERT INTO public.profiles (
        id, full_name, username, email, bio, avatar_url, location, role,
        skills, college, hackathon_interests, created_at, updated_at
      )
      VALUES (
        new.id,
        v_full_name,
        v_username,
        coalesce(new.email, ''),
        new.raw_user_meta_data ->> 'bio',
        v_avatar_url,
        new.raw_user_meta_data ->> 'location',
        CASE WHEN new.raw_user_meta_data ->> 'role' IN ('student','mentor','admin')
             THEN (new.raw_user_meta_data ->> 'role')::public.user_role ELSE 'student'::public.user_role END,
        CASE
          WHEN jsonb_typeof(new.raw_user_meta_data->'skills') = 'array'
            THEN new.raw_user_meta_data->'skills'
          ELSE '[]'::jsonb
        END,
        new.raw_user_meta_data ->> 'college',
        CASE
          WHEN jsonb_typeof(new.raw_user_meta_data->'hackathon_interests') = 'array'
            THEN new.raw_user_meta_data->'hackathon_interests'
          ELSE '[]'::jsonb
        END,
        now(), now()
      )
      ON CONFLICT (id) DO UPDATE SET
        email = excluded.email,
        username = COALESCE(public.profiles.username, excluded.username),
        updated_at = now();
    ELSE
      INSERT INTO public.profiles (
        id, full_name, username, email, bio, avatar_url, location, role,
        skills, college, hackathon_interests, created_at, updated_at
      )
      VALUES (
        new.id,
        v_full_name,
        v_username,
        coalesce(new.email, ''),
        new.raw_user_meta_data ->> 'bio',
        v_avatar_url,
        new.raw_user_meta_data ->> 'location',
        CASE WHEN new.raw_user_meta_data ->> 'role' IN ('student','mentor','organizer','admin')
             THEN new.raw_user_meta_data ->> 'role' ELSE 'student' END,
        CASE
          WHEN jsonb_typeof(new.raw_user_meta_data->'skills') = 'array'
            THEN new.raw_user_meta_data->'skills'
          ELSE '[]'::jsonb
        END,
        new.raw_user_meta_data ->> 'college',
        CASE
          WHEN jsonb_typeof(new.raw_user_meta_data->'hackathon_interests') = 'array'
            THEN new.raw_user_meta_data->'hackathon_interests'
          ELSE '[]'::jsonb
        END,
        now(), now()
      )
      ON CONFLICT (id) DO UPDATE SET
        email = excluded.email,
        username = COALESCE(public.profiles.username, excluded.username),
        updated_at = now();
    END IF;
  END IF;

  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT,
  type TEXT NOT NULL CHECK (type IN ('direct', 'team', 'hackathon')) DEFAULT 'direct',
  team_id UUID,
  hackathon_id UUID,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.conversation_participants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  last_read_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(conversation_id, user_id)
);

-- messages: conversation wiring (already added by previous migrations if present)
DO $$
BEGIN
  IF to_regclass('public.messages') IS NOT NULL THEN
    ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE;
    ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS message_type TEXT DEFAULT 'text';
    ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
  END IF;
END $$;

DO $$
BEGIN
  IF to_regclass('public.messages') IS NOT NULL THEN
    CREATE INDEX IF NOT EXISTS idx_messages_conversation ON public.messages(conversation_id);
    CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at);
  END IF;
END $$;
CREATE INDEX IF NOT EXISTS idx_conversations_created_by ON public.conversations(created_by);
CREATE INDEX IF NOT EXISTS idx_conversation_participants_user ON public.conversation_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_conversation_participants_conversation ON public.conversation_participants(conversation_id);

-- -----------------------------------------------------------------------
-- 5. GET-OR-CREATE DIRECT CONVERSATION (atomic, no duplicates)
--    Usage: select public.get_or_create_direct_conversation(a, b)
-- -----------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_or_create_direct_conversation(p_user_a UUID, p_user_b UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_conv_id UUID;
BEGIN
  IF p_user_a IS NULL OR p_user_b IS NULL OR p_user_a = p_user_b THEN
    RETURN NULL;
  END IF;

  -- Safety net: if either auth user has no profile row yet (legacy accounts),
  -- backfill a minimal row so foreign keys always resolve.
  INSERT INTO public.users (id, email, name, username, title, bio, avatar_url,
                            location, experience_level, role,
                            created_at, updated_at)
  SELECT
    au.id,
    coalesce(au.email, ''),
    coalesce(au.raw_user_meta_data ->> 'full_name', au.raw_user_meta_data ->> 'name',
             split_part(coalesce(au.email, ''), '@', 1)),
    lower(regexp_replace(coalesce(au.raw_user_meta_data ->> 'full_name', au.raw_user_meta_data ->> 'name', 'user'), '[^a-zA-Z0-9]+', '_', 'g')) || '_' || substr(au.id::text, 1, 6),
    coalesce(au.raw_user_meta_data ->> 'title', 'Developer'),
    coalesce(au.raw_user_meta_data ->> 'bio', ''),
    coalesce(au.raw_user_meta_data ->> 'avatar_url', au.raw_user_meta_data ->> 'picture', '/placeholder-user.jpg'),
    au.raw_user_meta_data ->> 'location',
    coalesce(au.raw_user_meta_data ->> 'experience_level', 'beginner'),
    coalesce(au.raw_user_meta_data ->> 'role', 'student'),
    now(), now()
  FROM auth.users au
  WHERE au.id IN (p_user_a, p_user_b)
  ON CONFLICT (id) DO NOTHING;

  -- Existing direct conversation shared by BOTH users?
  SELECT cp.conversation_id INTO v_conv_id
  FROM public.conversation_participants cp
  WHERE cp.user_id = p_user_b
    AND cp.conversation_id IN (
      SELECT cp2.conversation_id
      FROM public.conversation_participants cp2
      WHERE cp2.user_id = p_user_a
    )
    AND EXISTS (SELECT 1 FROM public.conversations c WHERE c.id = cp.conversation_id AND c.type = 'direct')
  LIMIT 1;

  IF v_conv_id IS NOT NULL THEN
    RETURN v_conv_id;
  END IF;

  -- Create it + attach both participants atomically.
  INSERT INTO public.conversations (type, created_by, name)
  VALUES ('direct', least(p_user_a, p_user_b), NULL)
  RETURNING id INTO v_conv_id;

  INSERT INTO public.conversation_participants (conversation_id, user_id)
  VALUES (v_conv_id, p_user_a), (v_conv_id, p_user_b)
  ON CONFLICT (conversation_id, user_id) DO NOTHING;

  RETURN v_conv_id;
END;
$$;
-- -----------------------------------------------------------------------
-- 6. ROW LEVEL SECURITY
--    Users can read public profiles, update only their own, and only ever
--    see conversations/messages they are part of. sender_id is locked to
--    auth.uid() so impersonation is impossible.
-- -----------------------------------------------------------------------

-- --- users (public profile store) ---
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access to users" ON public.users;
DROP POLICY IF EXISTS "Public can view user profiles" ON public.users;

-- Authenticated users can view all registered users (Explore / Discovery).
DROP POLICY IF EXISTS "Authenticated users can view all profiles" ON public.users;
CREATE POLICY "Authenticated users can view all profiles" ON public.users
  FOR SELECT TO authenticated USING (true);

-- Each user can create only their OWN profile row.
DROP POLICY IF EXISTS "Users can create their own profile" ON public.users;
CREATE POLICY "Users can create their own profile" ON public.users
  FOR INSERT TO authenticated WITH CHECK (id = auth.uid());

-- Each user can update only their OWN profile row.
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE TO authenticated USING (id = auth.uid());

-- --- profiles (role store) ---
DO $$
BEGIN
  IF to_regclass('public.profiles') IS NOT NULL THEN
    ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS "Authenticated users can read profiles" ON public.profiles;

    DROP POLICY IF EXISTS "Authenticated users can read all profiles" ON public.profiles;
CREATE POLICY "Authenticated users can read all profiles" ON public.profiles
      FOR SELECT TO authenticated USING (true);

    DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile" ON public.profiles
      FOR INSERT TO authenticated WITH CHECK (id = auth.uid());

    DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" ON public.profiles
      FOR UPDATE TO authenticated USING (id = auth.uid());
  END IF;
END $$;

-- --- conversations ---
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read conversations" ON public.conversations;
DROP POLICY IF EXISTS "Allow public insert conversations" ON public.conversations;
DROP POLICY IF EXISTS "Allow public update conversations" ON public.conversations;

DROP POLICY IF EXISTS "Participants can view conversations" ON public.conversations;
CREATE POLICY "Participants can view conversations" ON public.conversations
  FOR SELECT TO authenticated USING (
    created_by = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.conversation_participants p
      WHERE p.conversation_id = conversations.id AND p.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Authenticated users can create direct conversations" ON public.conversations;
CREATE POLICY "Authenticated users can create direct conversations" ON public.conversations
  FOR INSERT TO authenticated WITH CHECK (type = 'direct' AND created_by = auth.uid());

-- --- conversation_participants ---
ALTER TABLE public.conversation_participants ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read participants" ON public.conversation_participants;
DROP POLICY IF EXISTS "Allow public insert participants" ON public.conversation_participants;
DROP POLICY IF EXISTS "Allow public update participants" ON public.conversation_participants;

DROP POLICY IF EXISTS "Participants can view conversation participants" ON public.conversation_participants;
CREATE POLICY "Participants can view conversation participants" ON public.conversation_participants
  FOR SELECT TO authenticated USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.conversation_participants me
      WHERE me.conversation_id = conversation_participants.conversation_id AND me.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Participants can add conversation participants" ON public.conversation_participants;
CREATE POLICY "Participants can add conversation participants" ON public.conversation_participants
  FOR INSERT TO authenticated WITH CHECK (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.conversation_participants me
      WHERE me.conversation_id = conversation_participants.conversation_id AND me.user_id = auth.uid()
    )
  );

-- --- messages ---
DO $$
BEGIN
  IF to_regclass('public.messages') IS NOT NULL THEN
    ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS "Allow public read messages" ON public.messages;
    DROP POLICY IF EXISTS "Allow public insert messages" ON public.messages;

    DROP POLICY IF EXISTS "Participants can view messages" ON public.messages;
    CREATE POLICY "Participants can view messages" ON public.messages
      FOR SELECT TO authenticated USING (
        EXISTS (
          SELECT 1 FROM public.conversation_participants p
          WHERE p.conversation_id = messages.conversation_id AND p.user_id = auth.uid()
        )
      );

    -- sender_id is forced to equal auth.uid() so users cannot impersonate others.
    DROP POLICY IF EXISTS "Participants can send messages" ON public.messages;
    CREATE POLICY "Participants can send messages" ON public.messages
      FOR INSERT TO authenticated WITH CHECK (
        sender_id = auth.uid()
        AND EXISTS (
          SELECT 1 FROM public.conversation_participants p
          WHERE p.conversation_id = messages.conversation_id AND p.user_id = auth.uid()
        )
      );
  END IF;
END $$;

-- -----------------------------------------------------------------------
-- 7. SUPABASE REALTIME - include chat + profile tables in the publication
-- -----------------------------------------------------------------------
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.users;
EXCEPTION WHEN duplicate_object OR undefined_table OR undefined_object THEN NULL;
END $$;

DO $$
BEGIN
  IF to_regclass('public.profiles') IS NOT NULL THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
  END IF;
EXCEPTION WHEN duplicate_object OR undefined_table OR undefined_object THEN NULL;
END $$;

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
EXCEPTION WHEN duplicate_object OR undefined_table OR undefined_object THEN NULL;
END $$;

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.conversations;
EXCEPTION WHEN duplicate_object OR undefined_table OR undefined_object THEN NULL;
END $$;

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.conversation_participants;
EXCEPTION WHEN duplicate_object OR undefined_table OR undefined_object THEN NULL;
END $$;

-- -----------------------------------------------------------------------
-- 8. ONE-TIME BACKFILL - create profile rows for existing auth users
--    (users who signed up before this migration, e.g. Google OAuth users),
--    so every registered user appears on the Public Access page instantly.
--    Safe to re-run: ON CONFLICT (id) keeps existing rows untouched.
-- -----------------------------------------------------------------------
INSERT INTO public.users (
  id, email, name, full_name, username, title, bio, avatar_url,
  location, experience_level, role, college, hackathon_interests,
  created_at, updated_at
)
SELECT
  au.id,
  coalesce(au.email, ''),
  coalesce(au.raw_user_meta_data ->> 'full_name', au.raw_user_meta_data ->> 'name',
           split_part(coalesce(au.email, ''), '@', 1)),
  coalesce(au.raw_user_meta_data ->> 'full_name', au.raw_user_meta_data ->> 'name',
           split_part(coalesce(au.email, ''), '@', 1)),
  lower(regexp_replace(
    coalesce(au.raw_user_meta_data ->> 'full_name', au.raw_user_meta_data ->> 'name', 'user'),
    '[^a-zA-Z0-9]+', '_', 'g')) || '_' || substr(au.id::text, 1, 6),
  coalesce(au.raw_user_meta_data ->> 'title', 'Developer'),
  coalesce(au.raw_user_meta_data ->> 'bio', ''),
  coalesce(au.raw_user_meta_data ->> 'avatar_url', au.raw_user_meta_data ->> 'picture', '/placeholder-user.jpg'),
  au.raw_user_meta_data ->> 'location',
  coalesce(au.raw_user_meta_data ->> 'experience_level', 'beginner'),
  coalesce(au.raw_user_meta_data ->> 'role', 'student'),
  au.raw_user_meta_data ->> 'college',
  CASE WHEN jsonb_typeof(au.raw_user_meta_data -> 'hackathon_interests') = 'array'
       THEN au.raw_user_meta_data -> 'hackathon_interests' ELSE '[]'::jsonb END,
  now(), now()
FROM auth.users au
ON CONFLICT (id) DO UPDATE SET
  email = excluded.email,
  username = COALESCE(public.users.username, excluded.username),
  updated_at = now();

-- Backfill the profiles table too (keeps /admin role checks working).
DO $$
BEGIN
  IF to_regclass('public.profiles') IS NOT NULL THEN
    INSERT INTO public.profiles (
      id, full_name, username, email, bio, avatar_url, location, role,
      skills, college, hackathon_interests, created_at, updated_at
    )
    SELECT
      u.id, u.name, u.username, u.email, u.bio, u.avatar_url, u.location,
      u.role, to_jsonb(u.skills), u.college, u.hackathon_interests, u.created_at, u.updated_at
    FROM public.users u
    ON CONFLICT (id) DO UPDATE SET
      email = excluded.email,
      username = COALESCE(public.profiles.username, excluded.username),
      updated_at = now();
  END IF;
END $$;
