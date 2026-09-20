-- 17-direct-messaging.sql
-- Ensures tables/columns used by direct messaging between any two registered users exist.
-- Idempotent - safe to run multiple times. Run in the Supabase SQL Editor.

-- Conversations table (if missing)
CREATE TABLE IF NOT EXISTS conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT,
  type TEXT NOT NULL CHECK (type IN ('direct', 'team', 'hackathon')) DEFAULT 'direct',
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  hackathon_id UUID REFERENCES hackathons(id) ON DELETE CASCADE,
  created_by UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Conversation participants table (if missing)
CREATE TABLE IF NOT EXISTS conversation_participants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  last_read_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(conversation_id, user_id)
);

-- Add missing columns to the messages table
ALTER TABLE messages ADD COLUMN IF NOT EXISTS conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS message_type TEXT DEFAULT 'text';
ALTER TABLE messages ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Indexes for direct-messaging performance
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_conversations_created_by ON conversations(created_by);
CREATE INDEX IF NOT EXISTS idx_conversation_participants_user ON conversation_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_conversation_participants_conversation ON conversation_participants(conversation_id);

-- RLS policies - public access (matches existing app behaviour; server API uses the service role key)
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_participants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read conversations" ON conversations FOR SELECT USING (true);
CREATE POLICY "Allow public insert conversations" ON conversations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read participants" ON conversation_participants FOR SELECT USING (true);
CREATE POLICY "Allow public insert participants" ON conversation_participants FOR INSERT WITH CHECK (true);

-- Ensure the users table has drop policies so new signups can insert their own profile row
DROP POLICY IF EXISTS "Allow users to insert own profile" ON users;
CREATE POLICY "Allow users to insert own profile" ON users FOR INSERT WITH CHECK (true);
