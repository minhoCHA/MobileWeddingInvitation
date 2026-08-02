import urllib.request
with urllib.request.urlopen('http://127.0.0.1:8000/api/rsvp') as res:
    print(res.status)
    print(res.read().decode()[:200])
