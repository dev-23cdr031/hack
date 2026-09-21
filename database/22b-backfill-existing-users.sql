-- =====================================================================
-- HackConnect - Backfill profiles for EXISTING auth.users
-- =====================================================================
-- Creates a `users` profile row (and a `profiles` row) for every user who
-- already signed up, so they appear on the Public Access page immediately.
--
-- SAFE: detects whether your `users.skills` column is `text[]` or `jsonb`
-- and inserts the correct type. Re-runnable (ON CONFLICT keeps existing).
-- =====================================================================

-- Step 1 - make sure all discovery columns exist (harmless if already there)
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS username TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS college TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS hackathon_interests JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS experience_level TEXT DEFAULT 'beginner';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'student';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS github_url TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS linkedin_url TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS portfolio_url TEXT;

-- Step 2 - backfill (type-aware for the skills column)
DO $$
DECLARE
  v_col_type text;
  v_is_jsonb boolean;
  v_sql text;
BEGIN
  SELECT data_type INTO v_col_type
  FROM information_schema.columns
  WHERE table_schema = 'public'
    AND table_name = 'users'
    AND column_name = 'skills';

  -- jsonb columns report 'jsonb' / 'json', arrays report 'ARRAY'
  v_is_jsonb := COALESCE(v_col_type LIKE '%json%', true);

  IF v_is_jsonb THEN
    v_sql := $q$
      INSERT INTO public.users (
        id, email, name, full_name, username, title, bio, avatar_url, skills,
        location, experience_level, role, college, hackathon_interests, created_at, updated_at
      )
      SELECT
        au.id,
        coalesce(au.email, ''),
        coalesce(au.raw_user_meta_data->>'full_name', au.raw_user_meta_data->>'name', split_part(coalesce(au.email,''),'@',1)),
        coalesce(au.raw_user_meta_data->>'full_name', au.raw_user_meta_data->>'name', split_part(coalesce(au.email,''),'@',1)),
        lower(regexp_replace(coalesce(au.raw_user_meta_data->>'full_name', au.raw_user_meta_data->>'name','user'),'[^a-zA-Z0-9]+','_','g')) || '_' || substr(au.id::text,1,6),
        coalesce(au.raw_user_meta_data->>'title','Developer'),
        coalesce(au.raw_user_meta_data->>'bio',''),
        coalesce(au.raw_user_meta_data->>'avatar_url', au.raw_user_meta_data->>'picture','/placeholder-user.jpg'),
        CASE WHEN jsonb_typeof(au.raw_user_meta_data->'skills')='array' THEN au.raw_user_meta_data->'skills' ELSE '[]'::jsonb END,
        au.raw_user_meta_data->>'location',
        coalesce(au.raw_user_meta_data->>'experience_level','beginner'),
        coalesce(au.raw_user_meta_data->>'role','student'),
        au.raw_user_meta_data->>'college',
        CASE WHEN jsonb_typeof(au.raw_user_meta_data->'hackathon_interests')='array' THEN au.raw_user_meta_data->'hackathon_interests' ELSE '[]'::jsonb END,
        now(), now()
      FROM auth.users au
      ON CONFLICT (id) DO UPDATE SET
        email = excluded.email,
        username = COALESCE(public.users.username, excluded.username),
        updated_at = now();
    $q$;
  ELSE
    -- text[] skills column (e.g. created by `CREATE TABLE users (... skills TEXT[])`)
    v_sql := $q$
      INSERT INTO public.users (
        id, email, name, full_name, username, title, bio, avatar_url, skills,
        location, experience_level, role, college, hackathon_interests, created_at, updated_at
      )
      SELECT
        au.id,
        coalesce(au.email, ''),
        coalesce(au.raw_user_meta_data->>'full_name', au.raw_user_meta_data->>'name', split_part(coalesce(au.email,''),'@',1)),
        coalesce(au.raw_user_meta_data->>'full_name', au.raw_user_meta_data->>'name', split_part(coalesce(au.email,''),'@',1)),
        lower(regexp_replace(coalesce(au.raw_user_meta_data->>'full_name', au.raw_user_meta_data->>'name','user'),'[^a-zA-Z0-9]+','_','g')) || '_' || substr(au.id::text,1,6),
        coalesce(au.raw_user_meta_data->>'title','Developer'),
        coalesce(au.raw_user_meta_data->>'bio',''),
        coalesce(au.raw_user_meta_data->>'avatar_url', au.raw_user_meta_data->>'picture','/placeholder-user.jpg'),
        CASE WHEN jsonb_typeof(au.raw_user_meta_data->'skills')='array'
             THEN (SELECT array_agg(e) FROM jsonb_array_elements_text(au.raw_user_meta_data->'skills') e)
             ELSE '{}'::text[] END,
        au.raw_user_meta_data->>'location',
        coalesce(au.raw_user_meta_data->>'experience_level','beginner'),
        coalesce(au.raw_user_meta_data->>'role','student'),
        au.raw_user_meta_data->>'college',
        CASE WHEN jsonb_typeof(au.raw_user_meta_data->'hackathon_interests')='array' THEN au.raw_user_meta_data->'hackathon_interests' ELSE '[]'::jsonb END,
        now(), now()
      FROM auth.users au
      ON CONFLICT (id) DO UPDATE SET
        email = excluded.email,
        username = COALESCE(public.users.username, excluded.username),
        updated_at = now();
    $q$;
  END IF;

  EXECUTE v_sql;
END $$;


-- Step 3 - keep the profiles table in sync (skills converted for a jsonb column)
DO $$
BEGIN
  IF to_regclass('public.profiles') IS NOT NULL THEN
    INSERT INTO public.profiles (
      id, full_name, username, email, bio, avatar_url, location, role,
      skills, college, hackathon_interests, created_at, updated_at
    )
    SELECT
      u.id, u.name, u.username, u.email, u.bio, u.avatar_url, u.location,
      u.role, to_jsonb(u.skills), u.college, u.hackathon_interests,
      u.created_at, u.updated_at
    FROM public.users u
    ON CONFLICT (id) DO UPDATE SET
      email = excluded.email,
      updated_at = now();
  END IF;
END $$;
