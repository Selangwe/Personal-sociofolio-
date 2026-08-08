-- ============================================================================
-- Supabase schema for post likes and comments (Personal Sociofolio)
-- Run this once in your Supabase project: Dashboard -> SQL Editor -> New query.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Likes: one row per post, holding the running count.
-- ----------------------------------------------------------------------------
create table if not exists public.post_likes (
  post_id text primary key,
  count   integer not null default 0
);

-- ----------------------------------------------------------------------------
-- Comments: one row per comment.
-- ----------------------------------------------------------------------------
create table if not exists public.post_comments (
  id         uuid primary key default gen_random_uuid(),
  post_id    text        not null,
  author     text        not null check (char_length(author) between 1 and 60),
  body       text        not null check (char_length(body)   between 1 and 1000),
  created_at timestamptz not null default now()
);

create index if not exists post_comments_post_id_created_at_idx
  on public.post_comments (post_id, created_at);

-- ----------------------------------------------------------------------------
-- Atomic like / unlike helpers (avoid read-modify-write race conditions).
-- ----------------------------------------------------------------------------
create or replace function public.increment_post_like(p_post_id text)
returns integer
language plpgsql
security definer
as $$
declare
  new_count integer;
begin
  insert into public.post_likes (post_id, count)
  values (p_post_id, 1)
  on conflict (post_id)
  do update set count = public.post_likes.count + 1
  returning count into new_count;
  return new_count;
end;
$$;

create or replace function public.decrement_post_like(p_post_id text)
returns integer
language plpgsql
security definer
as $$
declare
  new_count integer;
begin
  insert into public.post_likes (post_id, count)
  values (p_post_id, 0)
  on conflict (post_id)
  do update set count = greatest(public.post_likes.count - 1, 0)
  returning count into new_count;
  return new_count;
end;
$$;

-- ----------------------------------------------------------------------------
-- Row Level Security.
-- Anyone (the anon key) may read likes and comments, add a comment, and call
-- the like helpers. Nobody can edit or delete via the anon key -- moderate
-- comments from the Supabase dashboard (Table editor) or with the service role.
-- ----------------------------------------------------------------------------
alter table public.post_likes    enable row level security;
alter table public.post_comments enable row level security;

drop policy if exists "read likes"        on public.post_likes;
drop policy if exists "read comments"     on public.post_comments;
drop policy if exists "insert comments"   on public.post_comments;

create policy "read likes"
  on public.post_likes for select
  using (true);

create policy "read comments"
  on public.post_comments for select
  using (true);

create policy "insert comments"
  on public.post_comments for insert
  with check (
    char_length(author) between 1 and 60
    and char_length(body) between 1 and 1000
  );

grant execute on function public.increment_post_like(text) to anon, authenticated;
grant execute on function public.decrement_post_like(text) to anon, authenticated;

-- ----------------------------------------------------------------------------
-- OPTIONAL: seed the like counts with the numbers currently shown on the site
-- so the display doesn't reset to zero. Edit/remove as you like.
-- ----------------------------------------------------------------------------
insert into public.post_likes (post_id, count) values
  ('post-1', 142),
  ('post-2', 98),
  ('post-3', 215),
  ('post-4', 187),
  ('post-5', 156),
  ('post-6', 134)
on conflict (post_id) do nothing;
