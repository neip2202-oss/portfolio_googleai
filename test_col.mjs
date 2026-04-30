const SUPABASE_URL = 'https://wjkgjjsdbftijusbjsie.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indqa2dqanNkYmZ0aWp1c2Jqc2llIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3OTU2MjQsImV4cCI6MjA5MTM3MTYyNH0.9uQVRZ-uDhjdJKD4LcaH3hQlmu6OKt-bOFkN_W0kvkU';

async function checkColumn() {
  console.log('Testing select=updated_at...');
  const res = await fetch(`${SUPABASE_URL}/rest/v1/site_content?key=eq.projectsData&select=updated_at`, {
    headers: { 'apikey': SUPABASE_ANON_KEY, 'Authorization': `Bearer ${SUPABASE_ANON_KEY}` }
  });
  console.log('Status:', res.status);
  console.log('Data:', await res.text());
}
checkColumn();
