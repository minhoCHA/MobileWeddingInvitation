-- Run in Supabase SQL Editor
-- RSVP required fields:
-- name, side, attendance, guests, adultGuests, childGuests, meal, afterparty

alter table if exists public.rsvp
  add column if not exists side text not null default '신랑';

alter table if exists public.rsvp
  add column if not exists attendance text not null default '미정';

alter table if exists public.rsvp
  add column if not exists guests text not null default '0';

alter table if exists public.rsvp
  add column if not exists "adultGuests" text not null default '0';

alter table if exists public.rsvp
  add column if not exists "childGuests" text not null default '0';

alter table if exists public.rsvp
  add column if not exists meal text not null default '0';

alter table if exists public.rsvp
  add column if not exists afterparty text not null default '미정';

-- Optional: normalize existing nulls / empty values
update public.rsvp set side = '신랑' where side is null or side = '';
update public.rsvp set attendance = '미정' where attendance is null or attendance = '';
update public.rsvp set guests = '0' where guests is null or guests = '';
update public.rsvp set "adultGuests" = guests where "adultGuests" is null or "adultGuests" = '';
update public.rsvp set "childGuests" = '0' where "childGuests" is null or "childGuests" = '';
update public.rsvp set meal = '0' where meal is null or meal = '';
update public.rsvp set afterparty = '미정' where afterparty is null or afterparty = '';

-- Optional: remove legacy RSVP free-text column if no longer used.
alter table if exists public.rsvp
  drop column if exists message;
