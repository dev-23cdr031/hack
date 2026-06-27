-- Enhanced Messaging System for HackConnect
-- This script creates tables for a comprehensive messaging system

-- Create conversations table (for organizing different types of chats)
CREATE TABLE IF NOT EXISTS conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255),
  type VARCHAR(50) NOT NULL CHECK (type IN ('direct', 'team', 'hackathon')),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  hackathon_id UUID REFERENCES hackathons(id) ON DELETE CASCADE,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create conversation_participants table (who's in each conversation)
CREATE TABLE IF NOT EXISTS conversation_participants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_read_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(conversation_id, user_id)
);

-- Update messages table to use conversations
ALTER TABLE messages 
DROP CONSTRAINT IF EXISTS messages_team_id_fkey,
ADD COLUMN IF NOT EXISTS conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS message_type VARCHAR(50) DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file', 'system')),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Make team_id optional since we now have conversation_id
ALTER TABLE messages ALTER COLUMN team_id DROP NOT NULL;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_conversations_type ON conversations(type);
CREATE INDEX IF NOT EXISTS idx_conversations_team_id ON conversations(team_id);
CREATE INDEX IF NOT EXISTS idx_conversations_hackathon_id ON conversations(hackathon_id);
CREATE INDEX IF NOT EXISTS idx_conversation_participants_conversation_id ON conversation_participants(conversation_id);
CREATE INDEX IF NOT EXISTS idx_conversation_participants_user_id ON conversation_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON conversations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON messages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample conversations and messages
-- Direct conversation between users
INSERT INTO conversations (id, name, type, created_by) VALUES
('880e8400-e29b-41d4-a716-446655440001', NULL, 'direct', '550e8400-e29b-41d4-a716-446655440001'),
('880e8400-e29b-41d4-a716-446655440002', NULL, 'direct', '550e8400-e29b-41d4-a716-446655440002');

-- Team conversations (one for each team)
INSERT INTO conversations (id, name, type, team_id, created_by) VALUES
('880e8400-e29b-41d4-a716-446655440003', 'Quantum Coders Team Chat', 'team', '770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001'),
('880e8400-e29b-41d4-a716-446655440004', 'Blockchain Builders Team Chat', 'team', '770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440006'),
('880e8400-e29b-41d4-a716-446655440005', 'Code Warriors Team Chat', 'team', '770e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002');

-- Hackathon announcements
INSERT INTO conversations (id, name, type, hackathon_id, created_by) VALUES
('880e8400-e29b-41d4-a716-446655440006', 'Global AI Challenge Announcements', 'hackathon', '660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001'),
('880e8400-e29b-41d4-a716-446655440007', 'Web3 Buildathon Announcements', 'hackathon', '660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001');

-- Add participants to conversations
-- Direct conversation participants
INSERT INTO conversation_participants (conversation_id, user_id) VALUES
('880e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001'),
('880e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002'),
('880e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002'),
('880e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003');

-- Team conversation participants (add all team members)
-- Quantum Coders team
INSERT INTO conversation_participants (conversation_id, user_id) VALUES
('880e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001'),
('880e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002'),
('880e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003'),
('880e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440004');

-- Sample messages
INSERT INTO messages (conversation_id, sender_id, content, message_type) VALUES
-- Direct messages
('880e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Hey! Want to collaborate on the blockchain hackathon?', 'text'),
('880e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', 'Absolutely! I have some great ideas for DeFi applications.', 'text'),
('880e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Perfect! Let''s set up a call to discuss the details.', 'text'),

-- Team messages
('880e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', 'Welcome to the Quantum Coders team chat! 🚀', 'text'),
('880e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', 'Excited to work with everyone on this AI project!', 'text'),
('880e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', 'I''ve uploaded the initial dataset to our shared drive.', 'text'),
('880e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', 'Great work team! Ready for tomorrow''s presentation?', 'text'),

-- Hackathon announcements
('880e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440001', 'Welcome to the Global AI Challenge! Check out the resources and guidelines.', 'system'),
('880e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440001', 'Reminder: Submission deadline is March 17th at 6 PM PST.', 'system');
