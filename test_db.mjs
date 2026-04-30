const SUPABASE_URL = 'https://wjkgjjsdbftijusbjsie.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indqa2dqanNkYmZ0aWp1c2Jqc2llIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3OTU2MjQsImV4cCI6MjA5MTM3MTYyNH0.9uQVRZ-uDhjdJKD4LcaH3hQlmu6OKt-bOFkN_W0kvkU';

async function checkDB() {
  console.log('1. Checking general connection (companyList)...');
  const res1 = await fetch(`${SUPABASE_URL}/rest/v1/site_content?key=eq.companyList&select=key`, {
    headers: { 'apikey': SUPABASE_ANON_KEY, 'Authorization': `Bearer ${SUPABASE_ANON_KEY}` }
  });
  console.log('Status:', res1.status, res1.statusText);
  if (!res1.ok) {
    console.log('Error Body:', await res1.text());
  } else {
    console.log('Data:', await res1.json());
  }

  console.log('\n2. Fetching planData without values to check if it exists...');
  const res2 = await fetch(`${SUPABASE_URL}/rest/v1/site_content?key=eq.planData&select=key`, {
    headers: { 'apikey': SUPABASE_ANON_KEY, 'Authorization': `Bearer ${SUPABASE_ANON_KEY}` }
  });
  console.log('Status:', res2.status);
  if (!res2.ok) {
    console.log('Error Body:', await res2.text());
  } else {
    console.log('Data:', await res2.json());
  }
}
checkDB();
