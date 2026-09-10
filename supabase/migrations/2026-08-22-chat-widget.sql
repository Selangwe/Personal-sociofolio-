-- ============================================================================
--  Chat widget — schema migration
--  Run this in the Supabase SQL editor against the EXISTING project.
-- ============================================================================
--
--  Why this file exists separately from schema.sql:
--
--  Both schema.sql and schema.ready.sql use `create table if not exists`. On a
--  database that is already provisioned, editing the create-table body in those
--  files changes nothing at all — the statement is a no-op and the new columns
--  never appear. Only explicit `alter` statements actually migrate a live table.
--
--  Everything below is idempotent and safe to re-run.
-- ============================================================================


-- ----------------------------------------------------------------------------
--  1. LEADS — accept chat-sourced leads
-- ----------------------------------------------------------------------------

-- Which of the nine services the visitor's need mapped to, and how soon they
-- want to start. Null for leads that arrive through the ordinary forms.
alter table public.leads add column if not exists service  text;
alter table public.leads add column if not exists timeline text;

-- Widen the form enum to include chat-qualified leads.
alter table public.leads drop constraint if exists leads_form_check;
alter table public.leads add  constraint leads_form_check
  check (form in ('contact','newsletter','resource-download','chat'));


-- ----------------------------------------------------------------------------
--  2. CHAT_EVENTS — rate limiting and spend tracking
-- ----------------------------------------------------------------------------
--
--  One row per admitted chat message. `ip_hash` is sha256(ip + salt), never the
--  address itself, so this is a rate-limit ledger rather than a visitor log.
--
create table if not exists public.chat_events (
  id            uuid primary key default gen_random_uuid(),
  ip_hash       text not null,
  input_tokens  int  not null default 0,
  output_tokens int  not null default 0,
  cache_read    int  not null default 0,
  created_at    timestamptz not null default now()
);

create index if not exists chat_events_ip_time_idx
  on public.chat_events (ip_hash, created_at desc);
create index if not exists chat_events_time_idx
  on public.chat_events (created_at desc);

alter table public.chat_events enable row level security;

-- Deliberately NO policies, same reasoning as `leads`: this table is written
-- and read only by the service-role client in the chat route.


-- ----------------------------------------------------------------------------
--  3. CHAT_ADMIT — check the caps and record the attempt, in one round trip
-- ----------------------------------------------------------------------------
--
--  Returns whether the request is allowed, why not if it isn't, and the id of
--  the row it created so the route can write real token usage back onto it.
--
--  Order matters: the global cap is checked first, because it is the stop-loss
--  and must fail closed regardless of who is asking.
--
create or replace function public.chat_admit(
  p_ip_hash  text,
  p_hour_cap int,
  p_day_cap  int,
  p_month_cap int
)
returns table (allowed boolean, reason text, event_id uuid)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_hour  int;
  v_day   int;
  v_month int;
  v_id    uuid;
begin
  select count(*) into v_month from chat_events
    where created_at >= date_trunc('month', now());
  if v_month >= p_month_cap then
    return query select false, 'global'::text, null::uuid;
    return;
  end if;

  select count(*) into v_day from chat_events
    where ip_hash = p_ip_hash and created_at > now() - interval '1 day';
  if v_day >= p_day_cap then
    return query select false, 'ip-day'::text, null::uuid;
    return;
  end if;

  select count(*) into v_hour from chat_events
    where ip_hash = p_ip_hash and created_at > now() - interval '1 hour';
  if v_hour >= p_hour_cap then
    return query select false, 'ip-hour'::text, null::uuid;
    return;
  end if;

  insert into chat_events (ip_hash) values (p_ip_hash) returning id into v_id;
  return query select true, null::text, v_id;
end;
$$;


-- ----------------------------------------------------------------------------
--  Verify
-- ----------------------------------------------------------------------------
--
--    select column_name from information_schema.columns
--      where table_name = 'leads' and column_name in ('service','timeline');
--    -- expect 2 rows
--
--    select pg_get_constraintdef(oid) from pg_constraint
--      where conname = 'leads_form_check';
--    -- expect the four-value CHECK
--
--    select * from public.chat_admit('test-hash', 8, 30, 1500);
--    -- expect allowed = true and an event_id; then clean up:
--    delete from public.chat_events where ip_hash = 'test-hash';
