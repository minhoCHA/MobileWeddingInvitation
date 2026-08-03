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
        'side': payload.get('side', ''),
        'attendance': payload.get('attendance', '미정'),
        'guests': payload.get('guests', '0'),
        'meal': payload.get('meal', ''),
        'afterparty': payload.get('afterparty', ''),
        'message': payload.get('message', ''),
        'createdAt': payload.get('createdAt') or now_iso(),
    }
    if table == 'guestbook':
        entry = {'id': entry['id'], 'name': entry['name'], 'message': entry['message'], 'createdAt': entry['createdAt']}
    try:
        response = supabase.table(table).insert(entry).execute()
        if hasattr(response, 'data'):
            return response.data or []
        return []
    except Exception as exc:
        message = str(exc)
        schema_mismatch = ('column' in message and 'does not exist' in message) or ('schema cache' in message.lower())
        if table == 'rsvp' and schema_mismatch:
            raise RuntimeError('RSVP schema is outdated. Add side, meal, afterparty columns to public.rsvp.') from exc
        raise


def delete_entry(key: str, entry_id: str) -> List[Dict[str, Any]]:
    if not supabase:
        raise RuntimeError('Supabase is not configured')
    table = _table_name(key)
    response = supabase.table(table).delete().eq('id', entry_id).execute()
    if hasattr(response, 'data'):
        return response.data or []
    return []
