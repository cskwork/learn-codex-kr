-- learn-codex-kr Supabase schema (Stories G005, G007, G008, G009)
--
-- Apply via Supabase Dashboard SQL editor or `supabase db push`.
-- Anon-only writes are allowed via RLS; we keep tables minimal and append-only where possible.

create extension if not exists "pgcrypto";

-- =========================================================================
-- G005: lesson_progress — one row per (device_id, lesson_slug)
-- =========================================================================
create table if not exists public.lesson_progress (
  id            uuid primary key default gen_random_uuid(),
  device_id     text not null,
  display_name  text,
  lesson_slug   text not null,
  duration_sec  integer not null check (duration_sec >= 0),
  completed_at  timestamptz not null default now(),
  unique (device_id, lesson_slug)
);

create index if not exists lesson_progress_device_idx
  on public.lesson_progress (device_id);

alter table public.lesson_progress enable row level security;

-- Anyone (anon) can read aggregate counts. Writes use device_id as identity.
drop policy if exists lesson_progress_select on public.lesson_progress;
create policy lesson_progress_select
  on public.lesson_progress for select
  to anon, authenticated
  using (true);

drop policy if exists lesson_progress_upsert on public.lesson_progress;
create policy lesson_progress_upsert
  on public.lesson_progress for insert
  to anon, authenticated
  with check (length(device_id) between 5 and 64);

drop policy if exists lesson_progress_update on public.lesson_progress;
create policy lesson_progress_update
  on public.lesson_progress for update
  to anon, authenticated
  using (true)
  with check (length(device_id) between 5 and 64);

-- =========================================================================
-- G008: race_scores — append-only race finish events
-- =========================================================================
create table if not exists public.race_scores (
  id            uuid primary key default gen_random_uuid(),
  device_id     text not null,
  display_name  text,
  match_id      text not null,
  lesson_slug   text,
  time_ms       integer not null check (time_ms > 0),
  finished_at   timestamptz not null default now()
);

create index if not exists race_scores_match_idx on public.race_scores (match_id);
create index if not exists race_scores_finished_idx on public.race_scores (finished_at desc);

alter table public.race_scores enable row level security;

drop policy if exists race_scores_select on public.race_scores;
create policy race_scores_select
  on public.race_scores for select
  to anon, authenticated
  using (true);

drop policy if exists race_scores_insert on public.race_scores;
create policy race_scores_insert
  on public.race_scores for insert
  to anon, authenticated
  with check (length(device_id) between 5 and 64 and time_ms > 0);

-- =========================================================================
-- G009: weekly_leaderboard view — fastest race time per device, last 7 days
-- =========================================================================
create or replace view public.weekly_leaderboard as
  select
    device_id,
    coalesce(max(display_name), '익명') as display_name,
    min(time_ms)                       as best_time_ms,
    count(*)                           as races
  from public.race_scores
  where finished_at >= now() - interval '7 days'
  group by device_id
  order by min(time_ms) asc
  limit 100;

grant select on public.weekly_leaderboard to anon, authenticated;

-- =========================================================================
-- G009: daily challenge progress
-- =========================================================================
create table if not exists public.daily_challenge_completions (
  id            uuid primary key default gen_random_uuid(),
  device_id     text not null,
  display_name  text,
  challenge_day date not null,
  time_ms       integer not null check (time_ms > 0),
  completed_at  timestamptz not null default now(),
  unique (device_id, challenge_day)
);

alter table public.daily_challenge_completions enable row level security;

drop policy if exists daily_select on public.daily_challenge_completions;
create policy daily_select on public.daily_challenge_completions for select
  to anon, authenticated using (true);

drop policy if exists daily_insert on public.daily_challenge_completions;
create policy daily_insert on public.daily_challenge_completions for insert
  to anon, authenticated with check (length(device_id) between 5 and 64);
