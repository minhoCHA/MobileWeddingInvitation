import os
from datetime import datetime, timezone
from typing import List, Dict, Any

from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

SUPABASE_URL = os.getenv('SUPABASE_URL', '').strip()
SUPABASE_KEY = os.getenv('SUPABASE_KEY', '').strip()

supabase: Client | None = None
if SUPABASE_URL and SUPABASE_KEY:
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)


def now_iso() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace('+00:00', 'Z')


def _table_name(key: str) -> str:
    return 'rsvp' if key == 'wedding_rsvp_entries' else 'guestbook'


def is_configured() -> bool:
    return supabase is not None


def list_entries(key: str) -> List[Dict[str, Any]]:
    if not supabase:
        raise RuntimeError('Supabase is not configured')
    table = _table_name(key)
    response = supabase.table(table).select('*').order('createdAt', desc=True).execute()
    if hasattr(response, 'data'):
        return response.data or []
    return []


def add_entry(key: str, payload: Dict[str, Any]) -> List[Dict[str, Any]]:
    if not supabase:
        raise RuntimeError('Supabase is not configured')
    table = _table_name(key)
    entry = {
        'id': payload.get('id') or f"{table}-{int(datetime.now(timezone.utc).timestamp()*1000)}",
        'name': payload.get('name', '익명'),
        'side': payload.get('side', '신랑') or '신랑',
        'attendance': payload.get('attendance', '미정') or '미정',
        'guests': payload.get('guests', '0'),
        'adultGuests': payload.get('adultGuests', payload.get('guests', '0')),
        'childGuests': payload.get('childGuests', '0'),
        'meal': payload.get('meal', '0') or '0',
        'afterparty': payload.get('afterparty', '미정') or '미정',
        'createdAt': payload.get('createdAt') or now_iso(),
    }
    if table == 'guestbook':
        entry = {
            'id': payload.get('id') or f"{table}-{int(datetime.now(timezone.utc).timestamp()*1000)}",
            'name': payload.get('name', '익명'),
            'message': payload.get('message', ''),
            'createdAt': payload.get('createdAt') or now_iso(),
        }
    try:
        response = supabase.table(table).insert(entry).execute()
        if hasattr(response, 'data'):
            return response.data or []
        return []
    except Exception as exc:
        message = str(exc)
        schema_mismatch = ('column' in message and 'does not exist' in message) or ('schema cache' in message.lower())
        if table == 'rsvp' and schema_mismatch:
            # Legacy fallback: some existing rsvp tables do not have side/meal/afterparty yet.
            legacy_entry = {
                'id': entry['id'],
                'name': entry['name'],
                'attendance': entry['attendance'],
                'guests': entry['guests'],
                'createdAt': entry['createdAt'],
            }
            try:
                fallback_response = supabase.table(table).insert(legacy_entry).execute()
                if hasattr(fallback_response, 'data'):
                    return fallback_response.data or []
                return []
            except Exception as fallback_exc:
                raise RuntimeError('RSVP schema is outdated. Add side, meal, afterparty, adultGuests, childGuests columns to public.rsvp.') from fallback_exc
        raise


def delete_entry(key: str, entry_id: str) -> List[Dict[str, Any]]:
    if not supabase:
        raise RuntimeError('Supabase is not configured')
    table = _table_name(key)
    response = supabase.table(table).delete().eq('id', entry_id).execute()
    if hasattr(response, 'data'):
        return response.data or []
    return []
