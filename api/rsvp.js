const { listEntries, createEntry, deleteEntry } = require('./_lib/supabase');

module.exports = async function handler(req, res) {
  const table = 'rsvp';
  try {
    if (req.method === 'GET') {
      const entries = await listEntries(table);
      return res.status(200).json({ ok: true, entries });
    }

    if (req.method === 'POST') {
      const payload = req.body || {};
      if (!String(payload.name || '').trim()) {
        return res.status(400).json({ ok: false, error: 'Name is required' });
      }
      const entry = {
        id: payload.id || `rsvp-${Date.now()}`,
        name: payload.name || '익명',
        side: payload.side || '',
        attendance: payload.attendance || '미정',
        guests: payload.guests || '0',
        meal: payload.meal || '',
        afterparty: payload.afterparty || '',
        message: payload.message || '',
        createdAt: payload.createdAt || new Date().toISOString()
      };
      let entries;
      try {
        entries = await createEntry(table, entry);
      } catch (_err) {
        // Fallback for older RSVP schemas without side/meal/afterparty columns.
        entries = await createEntry(table, {
          id: entry.id,
          name: entry.name,
          attendance: entry.attendance,
          guests: entry.guests,
          message: entry.message,
          createdAt: entry.createdAt
        });
      }
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
    return res.status(500).json({ ok: false, error: error.message || 'Supabase request failed' });
  }
};
