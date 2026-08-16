-- Coindle schema — public schema of project udpurxhhnufriznjmkhv
--
-- Dumped from the live database on 2026-08-16 after restoring the project
-- from an inactivity pause. This file is the authoritative record: the project
-- previously had no schema committed anywhere, which made a rebuild guesswork.
--
-- All application access is server-side through SUPABASE_SERVICE_KEY. The
-- service_role bypasses RLS, so the policies below are belt-and-braces rather
-- than load-bearing. anon/authenticated hold broad table grants but have no
-- policies, so RLS blocks them outright.

-- ---------------------------------------------------------------
-- game_events — one row per completed game (analytics)
-- Written by  POST /api/analytics
-- Read by     GET  /api/analytics/stats
-- ---------------------------------------------------------------
create table if not exists public.game_events (
  id          bigserial   primary key,
  created_at  timestamptz default now(),
  mode        text        not null,   -- 'daily' | 'freeplay'
  difficulty  text        not null,   -- 'easy'  | 'hard'
  result      text        not null,   -- 'win'   | 'loss'
  guesses     integer     not null,
  answer      text        not null,
  platform    text        default 'web',
  user_id     text                    -- localStorage 'coindle-uid', not an auth.users FK
);

-- ---------------------------------------------------------------
-- leaderboard — one row per user per puzzle
-- Written by  POST /api/leaderboard
-- Read by     GET  /api/leaderboard[?puzzle=N]
-- ---------------------------------------------------------------
create table if not exists public.leaderboard (
  id             bigserial   primary key,
  user_id        text        not null,
  username       text        not null,
  puzzle_number  integer     not null,
  guesses        integer     not null,
  won            boolean     not null,
  created_at     timestamptz default now(),
  -- load-bearing: POST upserts with onConflict "user_id,puzzle_number".
  -- Without this the upsert errors instead of updating.
  constraint leaderboard_user_id_puzzle_number_key unique (user_id, puzzle_number)
);

-- ---------------------------------------------------------------
-- reports — player-submitted coin data corrections
-- Written by  POST /api/reports
-- Read by     GET  /api/reports and the stats route
-- ---------------------------------------------------------------
create table if not exists public.reports (
  id          bigserial   primary key,
  created_at  timestamptz default now(),
  ticker      text        not null,
  category    text        not null,
  message     text,
  user_id     text
);

-- ---------------------------------------------------------------
-- Row level security
-- ---------------------------------------------------------------
alter table public.game_events enable row level security;
alter table public.leaderboard enable row level security;
alter table public.reports     enable row level security;

create policy "Allow select from service role" on public.game_events
  for select to service_role using (true);
create policy "Allow insert from service role" on public.game_events
  for insert to service_role with check (true);

create policy "Allow select from service role" on public.leaderboard
  for select to service_role using (true);
create policy "Allow insert from service role" on public.leaderboard
  for insert to service_role with check (true);

create policy "Allow select from service role" on public.reports
  for select to service_role using (true);
create policy "Allow insert from service role" on public.reports
  for insert to service_role with check (true);

-- ---------------------------------------------------------------
-- Not present in the live database, deliberately left out of the
-- schema so this file stays a faithful dump. See NOTES below.
-- ---------------------------------------------------------------
-- create index game_events_created_at_idx on public.game_events (created_at desc);
-- create index leaderboard_daily_idx      on public.leaderboard (puzzle_number, won, guesses, created_at);
