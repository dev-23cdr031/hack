-- Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id TEXT NOT NULL,
  user_id UUID,
  content TEXT NOT NULL,
  sender TEXT NOT NULL CHECK (sender IN ('user', 'bot')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_chat_messages_conversation_id ON chat_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at);

-- Enable row level security
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow users to view their own messages and bot responses in their conversations
CREATE POLICY "Users can view their own conversations" 
  ON chat_messages 
  FOR SELECT 
  USING (
    auth.uid() = user_id OR 
    conversation_id IN (
      SELECT DISTINCT conversation_id 
      FROM chat_messages 
      WHERE user_id = auth.uid()
    )
  );

-- Allow users to insert messages
CREATE POLICY "Users can insert messages" 
  ON chat_messages 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Enable realtime subscriptions
ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;

-- Add function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to update updated_at on row update
CREATE TRIGGER update_chat_messages_updated_at
BEFORE UPDATE ON chat_messages
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();