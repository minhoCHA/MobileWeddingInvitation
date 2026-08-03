-- Run in Supabase SQL Editor
-- Ensures RSVP fields are stored without silent data loss.

alter table if exists public.rsvp
  add column if not exists side text default '';

alter table if exists public.rsvp
  add column if not exists meal text default '';

alter table if exists public.rsvp
  add column if not exists afterparty text default '';

-- Optional: normalize existing nulls
update public.rsvp set side = '' where side is null;
update public.rsvp set meal = '' where meal is null;
update public.rsvp set afterparty = '' where afterparty is null;
