const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY;

function getHeaders() {
  return {
    'Content-Type': 'application/json',
    'apikey': SUPABASE_ANON_KEY || '',
    'Authorization': SUPABASE_ANON_KEY ? `Bearer ${SUPABASE_ANON_KEY}` : '',
    'Prefer': 'return=representation'
  };
}

async function supabaseRequest(table, method = 'GET', body = null, id = null) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return { ok: false, data: [] };
  }

  const url = new URL(`${SUPABASE_URL}/rest/v1/${table}`);
  url.searchParams.set('select', '*');
  url.searchParams.set('order', 'createdAt.desc');

  const options = {
    method,
    headers: getHeaders()
  };

  if (body !== null) {
    options.body = JSON.stringify(body);
  }

  if (method === 'DELETE' && id) {
    url.searchParams.set('id', `eq.${encodeURIComponent(id)}`);
  }

  const response = await fetch(url, options);
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Supabase ${method} ${table} failed: ${response.status} ${text}`);
  }

  const data = await response.json().catch(() => []);
  return { ok: true, data };
}

async function listEntries(table) {
  const result = await supabaseRequest(table, 'GET');
  return result.ok ? result.data : [];
}

async function createEntry(table, payload) {
  const result = await supabaseRequest(table, 'POST', payload);
  return result.ok ? result.data : [];
}

async function deleteEntry(table, id) {
  const result = await supabaseRequest(table, 'DELETE', null, id);
  return result.ok ? result.data : [];
}

module.exports = {
  listEntries,
  createEntry,
  deleteEntry
};
