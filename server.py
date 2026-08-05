import json
import mimetypes
import os
from http import HTTPStatus
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlparse

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")
os.makedirs(DATA_DIR, exist_ok=True)
RSVP_PATH = os.path.join(DATA_DIR, "rsvp.json")
GUESTBOOK_PATH = os.path.join(DATA_DIR, "guestbook.json")


def load_entries(path, default=None):
    if not os.path.exists(path):
        return default if default is not None else []
    try:
        with open(path, "r", encoding="utf-8") as fh:
            data = json.load(fh)
            return data if isinstance(data, list) else []
    except Exception:
        return default if default is not None else []


def save_entries(path, entries):
    os.makedirs(DATA_DIR, exist_ok=True)
    with open(path, "w", encoding="utf-8") as fh:
        json.dump(entries, fh, ensure_ascii=False, indent=2)


class Handler(BaseHTTPRequestHandler):
    server_version = "WeddingServer/1.0"

    def do_GET(self):
        parsed = urlparse(self.path)
        if parsed.path == "/api/rsvp":
            self._send_json(200, {"entries": load_entries(RSVP_PATH, [])})
            return
        if parsed.path == "/api/guestbook":
            self._send_json(200, {"entries": load_entries(GUESTBOOK_PATH, [])})
            return

        file_path = self._resolve_static_path(parsed.path)
        if file_path and os.path.exists(file_path):
            self._serve_file(file_path)
            return
        self._send_json(404, {"error": "not found"})

    def do_POST(self):
        parsed = urlparse(self.path)
        if parsed.path == "/api/rsvp":
            payload = self._read_json_body()
            entries = load_entries(RSVP_PATH, [])
            adult_guests = payload.get("adultGuests", payload.get("guests", "0"))
            child_guests = payload.get("childGuests", "0")
            try:
                total_guests = str(max(0, int(adult_guests)) + max(0, int(child_guests)))
            except Exception:
                total_guests = str(payload.get("guests", "0"))
            entry = {
                "id": payload.get("id") or f"rsvp-{len(entries)+1}",
                "name": payload.get("name", "익명"),
                "side": payload.get("side", ""),
                "attendance": payload.get("attendance", "미정"),
                "guests": total_guests,
                "adultGuests": str(adult_guests),
                "childGuests": str(child_guests),
                "meal": payload.get("meal", ""),
                "afterparty": payload.get("afterparty", "초대안함"),
                "createdAt": payload.get("createdAt") or self._now_iso(),
            }
            entries.insert(0, entry)
            save_entries(RSVP_PATH, entries)
            self._send_json(200, {"ok": True, "entries": entries})
            return
        if parsed.path == "/api/guestbook":
            payload = self._read_json_body()
            entries = load_entries(GUESTBOOK_PATH, [])
            entry = {
                "id": payload.get("id") or f"guestbook-{len(entries)+1}",
                "name": payload.get("name", "익명"),
                "message": payload.get("message", ""),
                "createdAt": payload.get("createdAt") or self._now_iso(),
            }
            entries.insert(0, entry)
            save_entries(GUESTBOOK_PATH, entries)
            self._send_json(200, {"ok": True, "entries": entries})
            return
        self._send_json(404, {"error": "not found"})

    def do_DELETE(self):
        parsed = urlparse(self.path)
        if parsed.path == "/api/rsvp":
            payload = self._read_json_body()
            entries = load_entries(RSVP_PATH, [])
            remaining = [entry for entry in entries if entry.get("id") != payload.get("id")]
            save_entries(RSVP_PATH, remaining)
            self._send_json(200, {"ok": True, "entries": remaining})
            return
        if parsed.path == "/api/guestbook":
            payload = self._read_json_body()
            entries = load_entries(GUESTBOOK_PATH, [])
            remaining = [entry for entry in entries if entry.get("id") != payload.get("id")]
            save_entries(GUESTBOOK_PATH, remaining)
            self._send_json(200, {"ok": True, "entries": remaining})
            return
        self._send_json(404, {"error": "not found"})

    def log_message(self, format, *args):
        return

    def _read_json_body(self):
        length = int(self.headers.get("Content-Length", "0"))
        raw = self.rfile.read(length).decode("utf-8") if length else ""
        if not raw:
            return {}
        try:
            return json.loads(raw)
        except Exception:
            return {}

    def _send_json(self, status, payload):
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _resolve_static_path(self, path):
        if path in ("", "/"):
            return os.path.join(BASE_DIR, "index.html")
        if path in ("/manager", "/manager/"):
            return os.path.join(BASE_DIR, "manager", "index.html")
        if path in ("/friends/manager", "/friends/manager/"):
            return os.path.join(BASE_DIR, "friends", "manager", "index.html")
        if path in ("/en/manager", "/en/manager/"):
            return os.path.join(BASE_DIR, "en", "manager", "index.html")
        normalized = path.lstrip("/")
        if normalized.startswith("api/"):
            return None
        return os.path.join(BASE_DIR, normalized)

    def _serve_file(self, file_path):
        mimetypes.add_type(".js", "application/javascript", True)
        mimetypes.add_type(".css", "text/css", True)
        guessed_type, _ = mimetypes.guess_type(file_path)
        if guessed_type is None:
            guessed_type = "application/octet-stream"
        with open(file_path, "rb") as fh:
            content = fh.read()
        self.send_response(HTTPStatus.OK)
        self.send_header("Content-Type", guessed_type)
        self.send_header("Content-Length", str(len(content)))
        self.end_headers()
        self.wfile.write(content)

    def _now_iso(self):
        from datetime import datetime
        return datetime.utcnow().replace(microsecond=0).isoformat() + "Z"


if __name__ == "__main__":
    host = "0.0.0.0"
    port = int(os.environ.get("PORT", "8080"))
    server = ThreadingHTTPServer((host, port), Handler)
    print(f"Serving on http://{host}:{port}")
    server.serve_forever()
