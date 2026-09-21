-- =====================================================================
-- HackConnect - Team Join Requests (store in Supabase)
-- =====================================================================
-- Run this ONCE in the Supabase SQL Editor (safe to re-run).
--
-- Self-healing: if the table already exists but is missing columns (e.g. a
-- partially-applied earlier version), the ALTER TABLE statements below add
-- them, so every join request is stored correctly.
-- =====================================================================

-- -----------------------------------------------------------------------
-- 1. TEAM JOIN REQUESTS TABLE
-- -----------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.team_join_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid NOT NULL,
  user_id uuid NOT NULL,
  message text,
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_at timestamptz,
  reviewed_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (team_id, user_id)
);

-- Make sure every column exists even if the table was created earlier
-- without some of them.
ALTER TABLE public.team_join_requests ADD COLUMN IF NOT EXISTS message text;
ALTER TABLE public.team_join_requests ADD COLUMN IF NOT EXISTS status text DEFAULT 'pending';
ALTER TABLE public.team_join_requests ADD COLUMN IF NOT EXISTS reviewed_at timestamptz;
ALTER TABLE public.team_join_requests ADD COLUMN IF NOT EXISTS reviewed_by uuid;
ALTER TABLE public.team_join_requests ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Make sure the UNIQUE(team_id, user_id) constraint exists so the app's
-- upsert (re-apply) always works.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid = 'public.team_join_requests'::regclass
      AND contype = 'u'
      AND conname = 'team_join_requests_team_id_user_id_key'
  ) THEN
    ALTER TABLE public.team_join_requests
      ADD CONSTRAINT team_join_requests_team_id_user_id_key UNIQUE (team_id, user_id);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_join_req_team ON public.team_join_requests(team_id, status);
CREATE INDEX IF NOT EXISTS idx_join_req_user ON public.team_join_requests(user_id);

-- -----------------------------------------------------------------------
-- 2. ROW LEVEL SECURITY
--    (comparisons use ::text so they work whether ids are text or uuid)
-- -----------------------------------------------------------------------
ALTER TABLE public.team_join_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Requesters can view their own requests" ON public.team_join_requests;
CREATE POLICY "Requesters can view their own requests" ON public.team_join_requests
  FOR SELECT TO authenticated USING (user_id::text = auth.uid()::text);

DROP POLICY IF EXISTS "Team leaders can view their team requests" ON public.team_join_requests;
CREATE POLICY "Team leaders can view their team requests" ON public.team_join_requests
  FOR SELECT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.teams t
      WHERE t.id::text = team_join_requests.team_id::text
        AND t.leader_id::text = auth.uid()::text
    )
  );

DROP POLICY IF EXISTS "Users can request to join a team" ON public.team_join_requests;
CREATE POLICY "Users can request to join a team" ON public.team_join_requests
  FOR INSERT TO authenticated WITH CHECK (
    user_id::text = auth.uid()::text
    AND EXISTS (SELECT 1 FROM public.teams t WHERE t.id::text = team_join_requests.team_id::text)
  );

DROP POLICY IF EXISTS "Team leaders can manage join requests" ON public.team_join_requests;
CREATE POLICY "Team leaders can manage join requests" ON public.team_join_requests
  FOR UPDATE TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.teams t
      WHERE t.id::text = team_join_requests.team_id::text
        AND t.leader_id::text = auth.uid()::text
    )
  );

-- -----------------------------------------------------------------------
-- 3. REALTIME (optional: live "new request" badges for the team leader)
-- -----------------------------------------------------------------------
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.team_join_requests;
EXCEPTION WHEN duplicate_object OR undefined_table OR undefined_object THEN NULL;
END $$;
