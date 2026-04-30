/**
 * Supabase REST API utility
 */

const SUPABASE_URL = 'https://wjkgjjsdbftijusbjsie.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indqa2dqanNkYmZ0aWp1c2Jqc2llIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3OTU2MjQsImV4cCI6MjA5MTM3MTYyNH0.9uQVRZ-uDhjdJKD4LcaH3hQlmu6OKt-bOFkN_W0kvkU';

export const supabaseFetch = async (path: string, options: RequestInit = {}) => {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': options.method === 'POST' || options.method === 'PATCH' ? 'return=representation' : '',
      ...options.headers,
    },
  });
  if (!res.ok) return null;
  return res.json();
};

/** Safe serializer: strips React elements & functions before saving */
export const safeSerialize = (data: any): any => {
  if (data === null || data === undefined) return data;
  if (typeof data === 'string' || typeof data === 'number' || typeof data === 'boolean') return data;
  if (typeof data === 'function') return undefined;
  if (data?.$$typeof) return undefined;
  if (Array.isArray(data)) return data.map(safeSerialize);
  if (typeof data === 'object') {
    if ('_owner' in data && 'ref' in data && 'props' in data) return undefined;
    const clean: any = {};
    for (const k of Object.keys(data)) {
      const v = safeSerialize(data[k]);
      if (v !== undefined) clean[k] = v;
    }
    return clean;
  }
  return data;
};

export const hasContent = (value: any): boolean => {
  if (!value) return false;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'object') return Object.keys(value).length > 0;
  return true;
};

export const GEMINI_PROXY_URL = `${SUPABASE_URL}/functions/v1/gemini-proxy`;


export const supabaseUploadFile = async (fileBlob: Blob, filename: string): Promise<string | null> => {
  try {
    const SUPABASE_URL = 'https://wjkgjjsdbftijusbjsie.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indqa2dqanNkYmZ0aWp1c2Jqc2llIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3OTU2MjQsImV4cCI6MjA5MTM3MTYyNH0.9uQVRZ-uDhjdJKD4LcaH3hQlmu6OKt-bOFkN_W0kvkU';
    
    const res = await fetch(`${SUPABASE_URL}/storage/v1/object/portfolio_media/${filename}`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': fileBlob.type,
      },
      body: fileBlob
    });
    if (!res.ok) {
      console.warn('[Storage] Upload failed server response:', await res.text());
      return null;
    }
    return `${SUPABASE_URL}/storage/v1/object/public/portfolio_media/${filename}`;
  } catch (err: any) {
    console.error('[Storage] Upload network/system error:', err);
    
    return null;
  }
};
