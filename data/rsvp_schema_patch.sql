-- Run in Supabase SQL Editor
-- RSVP required fields:
-- name, side, attendance, guests, meal, afterparty

alter table if exists public.rsvp
  add column if not exists side text not null default '';

alter table if exists public.rsvp
  add column if not exists attendance text not null default '미정';

alter table if exists public.rsvp
  add column if not exists guests text not null default '0';

alter table if exists public.rsvp
  add column if not exists meal text not null default '';

alter table if exists public.rsvp
  add column if not exists afterparty text not null default '초대안함';

-- Optional: normalize existing nulls / empty values
update public.rsvp set side = '' where side is null;
update public.rsvp set attendance = '미정' where attendance is null or attendance = '';
update public.rsvp set guests = '0' where guests is null or guests = '';
update public.rsvp set meal = '' where meal is null;
update public.rsvp set afterparty = '초대안함' where afterparty is null or afterparty = '';

-- Optional: remove legacy RSVP free-text column if no longer used.
alter table if exists public.rsvp
  drop column if exists message;
