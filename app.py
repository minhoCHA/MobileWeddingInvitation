import os
import json
from datetime import datetime, timezone
from flask import Flask, jsonify, request, send_from_directory

from supabase_store import list_entries, add_entry, delete_entry

app = Flask(__name__, static_folder='.', static_url_path='')
DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'data')
os.makedirs(DATA_DIR, exist_ok=True)
RSVP_PATH = os.path.join(DATA_DIR, 'rsvp.json')
GUESTBOOK_PATH = os.path.join(DATA_DIR, 'guestbook.json')


def _load_entries(path):
    if not os.path.exists(path):
        return []
    try:
        with open(path, 'r', encoding='utf-8') as fh:
            data = json.load(fh)
            return data if isinstance(data, list) else []
    except Exception:
        return []


def _save_entries(path, entries):
    os.makedirs(DATA_DIR, exist_ok=True)
    with open(path, 'w', encoding='utf-8') as fh:
        json.dump(entries, fh, ensure_ascii=False, indent=2)


def _now_iso():
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace('+00:00', 'Z')


@app.get('/api/rsvp')
def get_rsvp():
    try:
        entries = list_entries('wedding_rsvp_entries')
    except Exception as exc:
        print(f"Rsvp list error: {exc}")
        entries = []
    if entries:
        return jsonify({'entries': entries})
    return jsonify({'entries': _load_entries(RSVP_PATH)})


@app.post('/api/rsvp')
def post_rsvp():
    payload = request.get_json(silent=True) or {}
    try:
        synced = add_entry('wedding_rsvp_entries', payload)
    except Exception as exc:
        print(f"Rsvp add error: {exc}")
        synced = []
    if synced:
        return jsonify({'ok': True, 'entries': synced})
    entries = _load_entries(RSVP_PATH)
    entry = {
        'id': payload.get('id') or f"rsvp-{len(entries)+1}",
        'name': payload.get('name', '익명'),
        'attendance': payload.get('attendance', '미정'),
        'guests': payload.get('guests', '1'),
        'message': payload.get('message', ''),
        'createdAt': payload.get('createdAt') or _now_iso(),
    }
    entries.insert(0, entry)
    _save_entries(RSVP_PATH, entries)
    return jsonify({'ok': True, 'entries': entries})


@app.delete('/api/rsvp')
def delete_rsvp():
    payload = request.get_json(silent=True) or {}
    try:
        synced = delete_entry('wedding_rsvp_entries', payload.get('id'))
    except Exception as exc:
        print(f"Rsvp delete error: {exc}")
        synced = []
    if synced:
        return jsonify({'ok': True, 'entries': synced})
    entries = _load_entries(RSVP_PATH)
    remaining = [entry for entry in entries if entry.get('id') != payload.get('id')]
    _save_entries(RSVP_PATH, remaining)
    return jsonify({'ok': True, 'entries': remaining})


@app.get('/api/guestbook')
def get_guestbook():
    try:
        entries = list_entries('wedding_guestbook_entries')
    except Exception as exc:
        print(f"Guestbook list error: {exc}")
        entries = []
    if entries:
        return jsonify({'entries': entries})
    return jsonify({'entries': _load_entries(GUESTBOOK_PATH)})


@app.post('/api/guestbook')
def post_guestbook():
    payload = request.get_json(silent=True) or {}
    try:
        synced = add_entry('wedding_guestbook_entries', payload)
    except Exception as exc:
        print(f"Guestbook add error: {exc}")
        synced = []
    if synced:
        return jsonify({'ok': True, 'entries': synced})
    entries = _load_entries(GUESTBOOK_PATH)
    entry = {
        'id': payload.get('id') or f"guestbook-{len(entries)+1}",
        'name': payload.get('name', '익명'),
        'message': payload.get('message', ''),
        'createdAt': payload.get('createdAt') or _now_iso(),
    }
    entries.insert(0, entry)
    _save_entries(GUESTBOOK_PATH, entries)
    return jsonify({'ok': True, 'entries': entries})


@app.delete('/api/guestbook')
def delete_guestbook():
    payload = request.get_json(silent=True) or {}
    try:
        synced = delete_entry('wedding_guestbook_entries', payload.get('id'))
    except Exception as exc:
        print(f"Guestbook delete error: {exc}")
        synced = []
    if synced:
        return jsonify({'ok': True, 'entries': synced})
    entries = _load_entries(GUESTBOOK_PATH)
    remaining = [entry for entry in entries if entry.get('id') != payload.get('id')]
    _save_entries(GUESTBOOK_PATH, remaining)
    return jsonify({'ok': True, 'entries': remaining})


@app.route('/')
def index():
    return send_from_directory('.', 'index.html')


@app.route('/<path:path>')
def static_proxy(path):
    return send_from_directory('.', path)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=False)
