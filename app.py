import os
from flask import Flask, jsonify, request, send_from_directory

from supabase_store import list_entries, add_entry, delete_entry, is_configured

app = Flask(__name__, static_folder='.', static_url_path='')


def _service_unavailable():
    return jsonify({'ok': False, 'error': 'Supabase is not configured'}), 503


@app.get('/api/rsvp')
def get_rsvp():
    if not is_configured():
        return _service_unavailable()
    try:
        entries = list_entries('wedding_rsvp_entries')
    except Exception as exc:
        print(f"Rsvp list error: {exc}")
        return jsonify({'ok': False, 'error': 'Failed to load RSVP entries'}), 500
    return jsonify({'ok': True, 'entries': entries})


@app.post('/api/rsvp')
def post_rsvp():
    if not is_configured():
        return _service_unavailable()
    payload = request.get_json(silent=True) or {}
    if not str(payload.get('name', '')).strip():
        return jsonify({'ok': False, 'error': 'Name is required'}), 400
    try:
        synced = add_entry('wedding_rsvp_entries', payload)
    except RuntimeError as exc:
        print(f"Rsvp schema error: {exc}")
        return jsonify({'ok': False, 'code': 'RSVP_SCHEMA_MISMATCH', 'error': str(exc)}), 500
    except Exception as exc:
        print(f"Rsvp add error: {exc}")
        return jsonify({'ok': False, 'error': 'Failed to save RSVP entry'}), 500
    return jsonify({'ok': True, 'entries': synced})


@app.delete('/api/rsvp')
def delete_rsvp():
    if not is_configured():
        return _service_unavailable()
    payload = request.get_json(silent=True) or {}
    if not payload.get('id'):
        return jsonify({'ok': False, 'error': 'id is required'}), 400
    try:
        synced = delete_entry('wedding_rsvp_entries', payload.get('id'))
    except Exception as exc:
        print(f"Rsvp delete error: {exc}")
        return jsonify({'ok': False, 'error': 'Failed to delete RSVP entry'}), 500
    return jsonify({'ok': True, 'entries': synced})


@app.get('/api/guestbook')
def get_guestbook():
    if not is_configured():
        return _service_unavailable()
    try:
        entries = list_entries('wedding_guestbook_entries')
    except Exception as exc:
        print(f"Guestbook list error: {exc}")
        return jsonify({'ok': False, 'error': 'Failed to load guestbook entries'}), 500
    return jsonify({'ok': True, 'entries': entries})


@app.post('/api/guestbook')
def post_guestbook():
    if not is_configured():
        return _service_unavailable()
    payload = request.get_json(silent=True) or {}
    if not str(payload.get('name', '')).strip() or not str(payload.get('message', '')).strip():
        return jsonify({'ok': False, 'error': 'Name and message are required'}), 400
    try:
        synced = add_entry('wedding_guestbook_entries', payload)
    except Exception as exc:
        print(f"Guestbook add error: {exc}")
        return jsonify({'ok': False, 'error': 'Failed to save guestbook entry'}), 500
    return jsonify({'ok': True, 'entries': synced})


@app.delete('/api/guestbook')
def delete_guestbook():
    if not is_configured():
        return _service_unavailable()
    payload = request.get_json(silent=True) or {}
    if not payload.get('id'):
        return jsonify({'ok': False, 'error': 'id is required'}), 400
    try:
        synced = delete_entry('wedding_guestbook_entries', payload.get('id'))
    except Exception as exc:
        print(f"Guestbook delete error: {exc}")
        return jsonify({'ok': False, 'error': 'Failed to delete guestbook entry'}), 500
    return jsonify({'ok': True, 'entries': synced})


@app.route('/')
def index():
    return send_from_directory('.', 'index.html')


@app.route('/en/')
def index_en():
    return send_from_directory('en', 'index.html')


@app.route('/friends/')
def index_friends():
    return send_from_directory('friends', 'index.html')


@app.route('/<path:path>')
def static_proxy(path):
    if path.endswith('/'):
        return send_from_directory(path.rstrip('/'), 'index.html')
    return send_from_directory('.', path)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=False)
