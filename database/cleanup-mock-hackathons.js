const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://uzsygzfchokeotyqlako.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function cleanupMockHackathons() {
  console.log('Cleaning up mock/dummy hackathon data...');

  // Mock hackathons from lib/mock-hackathons.ts have IDs like devpost-1 through devpost-9
  const mockIds = [
    'devpost-1', 'devpost-2', 'devpost-3', 'devpost-4', 'devpost-5',
    'devpost-6', 'devpost-7', 'devpost-8', 'devpost-9'
  ];

  // Also delete hackathons with these known mock titles
  const mockTitles = [
    '2026 Global Challenge Hackathon',
    'Blockchain Developer Challenge',
    'Sustainable Technology Hackathon',
    'Full Stack Sprint',
    'Cyber Shield Hack',
    'Mobile Innovation Jam',
    'Data Science Challenge',
    'Open Source Weekend',
    'Startup Prototype Arena'
  ];

  // Delete by mock IDs
  for (const id of mockIds) {
    const { error } = await supabase.from('hackathons').delete().eq('id', id);
    if (error) {
      console.log(`  - Warning deleting ${id}: ${error.message}`);
    } else {
      console.log(`  - Deleted mock hackathon: ${id}`);
    }
  }

  // Delete any hackathons with mock titles (case-insensitive)
  const { data: allHackathons, error: fetchError } = await supabase
    .from('hackathons')
    .select('id, title, created_by, created_at');

  if (fetchError) {
    console.log('  - Warning fetching hackathons:', fetchError.message);
  } else if (allHackathons) {
    for (const hackathon of allHackathons) {
      const title = (hackathon.title || '').toLowerCase();
      const isMock = mockTitles.some(t => title === t.toLowerCase());
      // Also delete hackathons with no created_by (these are likely seed/mock data)
      // But keep ones created by actual users
      if (isMock || (!hackathon.created_by && hackathon.id.startsWith('created-'))) {
        const { error } = await supabase.from('hackathons').delete().eq('id', hackathon.id);
        if (!error) {
          console.log(`  - Deleted mock/seed hackathon: ${hackathon.title} (${hackathon.id})`);
        }
      }
    }
  }

  // Clean up hackathon_participants for deleted hackathons
  const { data: participants, error: partError } = await supabase
    .from('hackathon_participants')
    .select('id, hackathon_id');

  if (!partError && participants) {
    for (const participant of participants) {
      const isMock = mockIds.includes(participant.hackathon_id) || participant.hackathon_id?.startsWith('devpost-');
      if (isMock) {
        await supabase.from('hackathon_participants').delete().eq('id', participant.id);
      }
    }
  }

  console.log('\nCleanup complete! Only hackathons created by real users/admin remain.');
  console.log('The Explore page now only shows dynamically created hackathons.');
}

cleanupMockHackathons();