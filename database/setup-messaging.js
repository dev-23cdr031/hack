const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://uzsygzfchokeotyqlako.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupMessaging() {
  console.log('Setting up messaging tables...');

  // Create conversations table
  const { error: convError } = await supabase.rpc('exec_sql', {
    sql: `
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
    `
  });
  if (convError) console.log('conversations:', convError.message);
  else console.log('OK - conversations table ready');

  // Create conversation_participants table
  const { error: partError } = await supabase.rpc('exec_sql', {
    sql: `
      CREATE TABLE IF NOT EXISTS conversation_participants (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        last_read_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(conversation_id, user_id)
      );
    `
  });
  if (partError) console.log('conversation_participants:', partError.message);
  else console.log('OK - conversation_participants table ready');

  // Create messages table
  const { error: msgError } = await supabase.rpc('exec_sql', {
    sql: `
      CREATE TABLE IF NOT EXISTS messages (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
        team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
        sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        message_type TEXT DEFAULT 'text',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `
  });
  if (msgError) console.log('messages:', msgError.message);
  else console.log('OK - messages table ready');

  // Create calls table
  const { error: callError } = await supabase.rpc('exec_sql', {
    sql: `
      CREATE TABLE IF NOT EXISTS calls (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        caller_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        receiver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
        call_type VARCHAR(10) NOT NULL CHECK (call_type IN ('audio', 'video')),
        status VARCHAR(20) NOT NULL DEFAULT 'initiated' CHECK (status IN ('initiated', 'ringing', 'answered', 'declined', 'ended', 'failed')),
        started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        answered_at TIMESTAMP WITH TIME ZONE,
        ended_at TIMESTAMP WITH TIME ZONE,
        duration_seconds INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `
  });
  if (callError) console.log('calls:', callError.message);
  else console.log('OK - calls table ready');

  console.log('\nMessaging setup complete!');
}

setupMessaging();