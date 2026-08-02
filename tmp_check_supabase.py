import os
from dotenv import load_dotenv
load_dotenv()
from supabase import create_client
client = create_client(os.getenv('SUPABASE_URL',''), os.getenv('SUPABASE_KEY',''))
print('client_created', client is not None)
try:
    res = client.table('rsvp').select('*').limit(1).execute()
    print('rsvp_read', res.data)
except Exception as e:
    print('rsvp_error', type(e).__name__, e)
try:
    res = client.table('guestbook').select('*').limit(1).execute()
    print('guestbook_read', res.data)
except Exception as e:
    print('guestbook_error', type(e).__name__, e)
