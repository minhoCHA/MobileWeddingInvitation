import json
import urllib.request
payload = {
    'id': 'manual-test',
    'name': '테스트',
    'attendance': '예정',
    'guests': '2',
    'message': 'hello',
    'createdAt': '2026-08-02T00:00:00Z'
}
req = urllib.request.Request(
    'http://127.0.0.1:8000/api/rsvp',
    data=json.dumps(payload).encode(),
    headers={'Content-Type': 'application/json'},
    method='POST'
)
with urllib.request.urlopen(req) as res:
    print(res.status)
    print(res.read().decode())
