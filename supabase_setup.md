# Supabase setup

1. Supabase Dashboard > Project > Settings > API 에서 Project URL, anon/public key를 확인합니다.
2. .env 파일의 SUPABASE_URL과 SUPABASE_KEY에 붙여넣습니다.
3. Database > SQL Editor 에 아래 SQL을 실행합니다.

```sql
create table if not exists public.rsvp (
  id text primary key,
  name text not null,
  attendance text not null default '미정',
  guests text not null default '1',
  message text default '',
  "createdAt" text not null
);

create table if not exists public.guestbook (
  id text primary key,
  name text not null,
  message text default '',
  "createdAt" text not null
);

alter table public.rsvp enable row level security;
alter table public.guestbook enable row level security;

create policy "Allow public insert on rsvp" on public.rsvp for insert with check (true);
create policy "Allow public select on rsvp" on public.rsvp for select using (true);
create policy "Allow public delete on rsvp" on public.rsvp for delete using (true);

create policy "Allow public insert on guestbook" on public.guestbook for insert with check (true);
create policy "Allow public select on guestbook" on public.guestbook for select using (true);
create policy "Allow public delete on guestbook" on public.guestbook for delete using (true);
```

4. 실행 후 서버를 재시작하면, 앱이 Supabase를 우선 사용하고 테이블이 없을 때는 로컬 JSON 폴백으로 동작합니다.
