# Supabase setup

1. Supabase Dashboard > Project > Settings > API 에서 Project URL, anon/public key를 확인합니다.
2. .env 파일의 SUPABASE_URL과 SUPABASE_KEY에 붙여넣습니다.
3. Database > SQL Editor 에 아래 SQL을 실행합니다.

```sql
create table if not exists public.rsvp (
  id text primary key,
  name text not null,
  side text default '',
  attendance text not null default '미정',
  guests text not null default '0',
  meal text default '',
  afterparty text default '',
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

alter table public.rsvp add column if not exists side text default '';
alter table public.rsvp add column if not exists meal text default '';
alter table public.rsvp add column if not exists afterparty text default '';
```

4. 이미 기존 `rsvp` 테이블을 만들어 둔 경우에도 위 `alter table` 구문까지 꼭 실행해야 새 RSVP 필드가 정상 저장됩니다.
5. 빠르게 패치만 적용하려면 [data/rsvp_schema_patch.sql](data/rsvp_schema_patch.sql) 파일 내용을 SQL Editor에서 실행하세요.
6. 현재 서버는 RSVP 스키마가 구버전이면 `RSVP_SCHEMA_MISMATCH` 에러를 반환하도록 설정되어 있습니다. (조용한 필드 누락 방지)
7. 실행 후 서버를 재시작합니다.
