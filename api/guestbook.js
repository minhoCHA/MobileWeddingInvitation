const { listEntries, createEntry, deleteEntry } = require('./_lib/supabase');

module.exports = async function handler(req, res) {
  const table = 'guestbook';
  try {
    if (req.method === 'GET') {
      const entries = await listEntries(table);
      return res.status(200).json({ ok: true, entries });
    }

    if (req.method === 'POST') {
      const payload = req.body || {};
      if (!String(payload.name || '').trim() || !String(payload.message || '').trim()) {
        return res.status(400).json({ ok: false, error: 'Name and message are required' });
      }
      const entry = {
        id: payload.id || `guestbook-${Date.now()}`,
        name: payload.name || '익명',
        message: payload.message || '',
        createdAt: payload.createdAt || new Date().toISOString()
      };
      const entries = await createEntry(table, entry);
      return res.status(200).json({ ok: true, entries });
    }

    if (req.method === 'DELETE') {
      const payload = req.body || {};
      if (!payload.id) {
        return res.status(400).json({ ok: false, error: 'id is required' });
      }
      const entries = await deleteEntry(table, payload.id);
      return res.status(200).json({ ok: true, entries });
    }

    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  } catch (error) {
    const message = error?.message || 'Supabase request failed';
    const isConfigMissing = /Supabase is not configured/i.test(String(message));
    return res.status(isConfigMissing ? 503 : 500).json({ ok: false, error: message });
  }
};
