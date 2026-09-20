const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://uzsygzfchokeotyqlako.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function cleanupDatabase() {
  console.log('Starting database cleanup...');
  console.log('Deleting all dummy/seed data from Supabase...\n');

  const tables = [
    'connection_requests',
    'hackathon_participants',
    'team_members',
    'messages',
    'calls',
    'conversation_participants',
    'conversations',
    'projects',
    'teams',
    'hackathons',
    'users',
  ];

  for (const table of tables) {
    try {
      const { error } = await supabase.from(table).delete().neq('id', '00000000-0000-0000-0000-000000000000');
      if (error) {
        console.log('Warning - ' + table + ': ' + error.message);
      } else {
        console.log('OK - Deleted all data from ' + table);
      }
    } catch (e) {
      console.log('Warning - ' + table + ': ' + e.message);
    }
  }

  console.log('\nDatabase cleanup complete!');
  console.log('Now only users who sign up will appear on the public profiles page.');
  console.log('Only teams created by signed-up users will appear on the teams page.');
}

cleanupDatabase();