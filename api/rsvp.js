const { listEntries, createEntry, deleteEntry } = require('./_lib/supabase');

module.exports = async function handler(req, res) {
  const table = 'rsvp';

  if (req.method === 'GET') {
    const entries = await listEntries(table);
    return res.status(200).json({ entries });
  }

  if (req.method === 'POST') {
    const payload = req.body || {};
    const entry = {
      id: payload.id || `rsvp-${Date.now()}`,
      name: payload.name || '익명',
      attendance: payload.attendance || '미정',
      guests: payload.guests || '1',
      message: payload.message || '',
      createdAt: payload.createdAt || new Date().toISOString()
    };
    const entries = await createEntry(table, entry);
    return res.status(200).json({ ok: true, entries });
  }

  if (req.method === 'DELETE') {
    const payload = req.body || {};
    const entries = await deleteEntry(table, payload.id);
    return res.status(200).json({ ok: true, entries });
  }

  return res.status(405).json({ ok: false, error: 'Method not allowed' });
};
