-- Fix the hackathons table to match the app's expected schema.
-- Run this in your Supabase SQL editor.

ALTER TABLE public.hackathons
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'upcoming';

ALTER TABLE public.hackathons
  ADD COLUMN IF NOT EXISTS format TEXT DEFAULT 'competitive';

ALTER TABLE public.hackathons
  ADD COLUMN IF NOT EXISTS themes JSONB DEFAULT '[]';

ALTER TABLE public.hackathons
  ADD COLUMN IF NOT EXISTS max_participants INTEGER;

ALTER TABLE public.hackathons
  ADD COLUMN IF NOT EXISTS current_participants INTEGER DEFAULT 0;

ALTER TABLE public.hackathons
  ADD COLUMN IF NOT EXISTS prize_amount INTEGER;

ALTER TABLE public.hackathons
  ADD COLUMN IF NOT EXISTS skill_level TEXT DEFAULT 'all-levels';

ALTER TABLE public.hackathons
  ADD COLUMN IF NOT EXISTS eligibility TEXT DEFAULT 'Open to all';

ALTER TABLE public.hackathons
  ADD COLUMN IF NOT EXISTS rules JSONB DEFAULT '[]';

ALTER TABLE public.hackathons
  ADD COLUMN IF NOT EXISTS schedule JSONB DEFAULT '[]';

ALTER TABLE public.hackathons
  ADD COLUMN IF NOT EXISTS judges JSONB DEFAULT '[]';

ALTER TABLE public.hackathons
  ADD COLUMN IF NOT EXISTS sponsors JSONB DEFAULT '[]';

ALTER TABLE public.hackathons
  ADD COLUMN IF NOT EXISTS faq JSONB DEFAULT '[]';

ALTER TABLE public.hackathons
  ADD COLUMN IF NOT EXISTS resources JSONB DEFAULT '[]';

ALTER TABLE public.hackathons
  ADD COLUMN IF NOT EXISTS organizer_id UUID REFERENCES public.users(id) ON DELETE SET NULL;

ALTER TABLE public.hackathons
  ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES public.users(id) ON DELETE SET NULL;

ALTER TABLE public.hackathons
  ADD COLUMN IF NOT EXISTS created_by_email TEXT;

CREATE INDEX IF NOT EXISTS idx_hackathons_status ON public.hackathons(status);
CREATE INDEX IF NOT EXISTS idx_hackathons_type ON public.hackathons(type);
CREATE INDEX IF NOT EXISTS idx_hackathons_created_by ON public.hackathons(created_by);

-- Optional: ensure public read access exists (safe if already present)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'hackathons' AND policyname = 'Allow public read access to hackathons'
  ) THEN
    CREATE POLICY "Allow public read access to hackathons"
      ON public.hackathons
      FOR SELECT
      USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'hackathons' AND policyname = 'Allow authenticated users to create hackathons'
  ) THEN
    CREATE POLICY "Allow authenticated users to create hackathons"
      ON public.hackathons
      FOR INSERT
      WITH CHECK (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'hackathons' AND policyname = 'Allow users to update their own hackathons'
  ) THEN
    CREATE POLICY "Allow users to update their own hackathons"
      ON public.hackathons
      FOR UPDATE
      USING (created_by = auth.uid() OR created_by IS NULL);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'hackathons' AND policyname = 'Allow users to delete their own hackathons'
  ) THEN
    CREATE POLICY "Allow users to delete their own hackathons"
      ON public.hackathons
      FOR DELETE
      USING (created_by = auth.uid() OR created_by IS NULL);
  END IF;
END $$;
