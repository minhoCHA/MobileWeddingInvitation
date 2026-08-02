import os
import json
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


def list_entries(key: str) -> List[Dict[str, Any]]:
    if not supabase:
        return []
    table = _table_name(key)
    try:
        response = supabase.table(table).select('*').order('createdAt', desc=True).execute()
    except Exception as exc:
        print(f"Supabase list_entries failed for {table}: {exc}")
        return []
    if hasattr(response, 'data'):
        return response.data or []
    return []


def add_entry(key: str, payload: Dict[str, Any]) -> List[Dict[str, Any]]:
    if not supabase:
        print('[supabase] no client available')
        return []
    table = _table_name(key)
    entry = {
        'id': payload.get('id') or f"{table}-{int(datetime.now(timezone.utc).timestamp()*1000)}",
        'name': payload.get('name', '익명'),
        'attendance': payload.get('attendance', '미정'),
        'guests': payload.get('guests', '1'),
        'message': payload.get('message', ''),
        'createdAt': payload.get('createdAt') or now_iso(),
    }
    if table == 'guestbook':
        entry = {'id': entry['id'], 'name': entry['name'], 'message': entry['message'], 'createdAt': entry['createdAt']}
    try:
        response = supabase.table(table).insert(entry).execute()
    except Exception as exc:
        print(f"Supabase add_entry failed for {table}: {exc}")
        return []
    if hasattr(response, 'data'):
        return response.data or []
    return []


def delete_entry(key: str, entry_id: str) -> List[Dict[str, Any]]:
    if not supabase:
        return []
    table = _table_name(key)
    try:
        response = supabase.table(table).delete().eq('id', entry_id).execute()
    except Exception as exc:
        print(f"Supabase delete_entry failed for {table}: {exc}")
        return []
    if hasattr(response, 'data'):
        return response.data or []
    return []
