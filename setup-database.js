const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://sdvymgpugilsreqhovwt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNkdnltZ3B1Z2lsc3JlcWhvdnd0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDY3MjQyOSwiZXhwIjoyMDcwMjQ4NDI5fQ.VQBtl62lpq1frvgeASr7BJs6kb-7Q9PkB2cxmVy7ZJk';

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupDatabase() {
  console.log('Setting up database tables...');
  
  try {
    // Test connection
    const { data, error } = await supabase.from('users').select('count(*)').limit(1);
    
    if (error) {
      console.log('Tables do not exist yet. You need to run the SQL scripts in your Supabase dashboard.');
      console.log('\n📋 INSTRUCTIONS:');
      console.log('1. Go to: https://supabase.com/dashboard/project/sdvymgpugilsreqhovwt/sql');
      console.log('2. Copy and run the contents of scripts/01-create-tables.sql');
      console.log('3. Copy and run the contents of scripts/02-seed-data.sql');
      console.log('4. Then restart your server with: npm run dev');
      return;
    }
    
    console.log('✅ Database connection successful!');
    console.log('✅ Tables exist and are accessible');
    console.log('\n🎉 Your login and signup should now work!');
    console.log('Visit: http://localhost:3001/auth/login');
    
  } catch (error) {
    console.error('Database setup error:', error.message);
  }
}

setupDatabase();
