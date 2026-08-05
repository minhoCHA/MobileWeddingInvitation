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
        side: payload.side || '신랑',
        attendance: payload.attendance || '미정',
        guests: payload.guests || '0',
        adultGuests: payload.adultGuests || '0',
        childGuests: payload.childGuests || '0',
        meal: payload.meal || '0',
        afterparty: payload.afterparty || '미정',
        message: payload.message || '',
        createdAt: payload.createdAt || new Date().toISOString()
      };
      try {
        const entries = await createEntry(table, entry);
        return res.status(200).json({ ok: true, entries });
      } catch (err) {
        const message = String(err?.message || '');
        const schemaMismatch = /column .* does not exist|schema cache/i.test(message);
        if (schemaMismatch) {
          const legacyEntry = {
            id: entry.id,
            name: entry.name,
            attendance: entry.attendance,
            guests: entry.guests,
            createdAt: entry.createdAt
          };
          try {
            const entries = await createEntry(table, legacyEntry);
            return res.status(200).json({ ok: true, entries, legacySchema: true });
          } catch (fallbackErr) {
            return res.status(500).json({
              ok: false,
              code: 'RSVP_SCHEMA_MISMATCH',
              error: 'RSVP schema is outdated. Add side, meal, afterparty, adultGuests, childGuests columns to public.rsvp.'
            });
          }
        }
        throw err;
      }
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
