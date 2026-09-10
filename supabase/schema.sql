-- ============================================================================
--  Sociofolio — database schema
-- ============================================================================
--
--  Run this once in the Supabase SQL editor (Dashboard -> SQL Editor -> New
--  query -> paste -> Run).
--
--  BEFORE RUNNING:
--    1. Authentication -> Providers -> Email: turn OFF "Allow new users to
--       sign up". This site has exactly one user; leaving signups on lets
--       anyone create an account.
--    2. Authentication -> Users -> Add user: create your account.
--    3. Copy that user's UUID and replace every occurrence of
--       'PASTE-YOUR-USER-UUID-HERE' below. Find/Replace All is fine.
--
--  AFTER RUNNING:
--    4. Storage -> New bucket -> name it exactly `post-images`, tick "Public
--       bucket", then run the storage policies at the bottom of this file.
-- ============================================================================


-- ----------------------------------------------------------------------------
--  LEADS — contact form, newsletter, resource-download, and chat captures
-- ----------------------------------------------------------------------------
--
--  NOTE: `create table if not exists` is a no-op on an already-provisioned
--  database. If you are upgrading rather than provisioning fresh, run
--  supabase/migrations/2026-08-22-chat-widget.sql instead — editing the body
--  below will not add the columns to a table that already exists.
--
create table if not exists public.leads (
  id         uuid primary key default gen_random_uuid(),
  form       text not null
             constraint leads_form_check
             check (form in ('contact','newsletter','resource-download','chat')),
  email      text not null,
  name       text,
  subject    text,
  message    text,
  resource   text,
  -- Chat-qualified leads only.
  service    text,
  timeline   text,
  created_at timestamptz not null default now()
);

create index if not exists leads_created_at_idx on public.leads (created_at desc);

alter table public.leads enable row level security;

-- Note there is deliberately NO insert policy here. Submissions arrive through
-- /api/lead, which uses the service role key and bypasses RLS. An anon-writable
-- leads table is an open spam endpoint with nowhere to validate.
drop policy if exists "owner reads leads" on public.leads;
create policy "owner reads leads"
  on public.leads for select
  using (auth.uid() = 'PASTE-YOUR-USER-UUID-HERE');


-- ----------------------------------------------------------------------------
--  POSTS — the activity feed
-- ----------------------------------------------------------------------------
create table if not exists public.posts (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  type        text not null default 'text'
              check (type in ('text','image','carousel','youtube','case-study')),
  title       text,
  content     text not null,
  image       text,
  images      text[],
  youtube_id  text,
  tags        text[] not null default '{}',
  category    text not null,
  likes       int not null default 0 check (likes >= 0),
  comments    int not null default 0 check (comments >= 0),
  shares      int not null default 0 check (shares >= 0),
  published   boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- The public feed filters on `published` and sorts by `created_at`.
create index if not exists posts_published_created_idx
  on public.posts (published, created_at desc);

alter table public.posts enable row level security;

-- Anyone may read published posts. Drafts stay invisible.
drop policy if exists "public reads published posts" on public.posts;
create policy "public reads published posts"
  on public.posts for select
  using (published = true);

-- Only you may see drafts or change anything.
--
-- This is pinned to a specific user id rather than the generic `authenticated`
-- role on purpose: if signups were ever switched back on, an
-- `authenticated`-scoped policy would let any new account edit your feed.
drop policy if exists "owner full access to posts" on public.posts;
create policy "owner full access to posts"
  on public.posts for all
  using      (auth.uid() = 'PASTE-YOUR-USER-UUID-HERE')
  with check (auth.uid() = 'PASTE-YOUR-USER-UUID-HERE');


-- ----------------------------------------------------------------------------
--  STORAGE — the `post-images` bucket
-- ----------------------------------------------------------------------------
--  Create the bucket in the dashboard first (Storage -> New bucket ->
--  `post-images`, Public). Then run these.
-- ----------------------------------------------------------------------------
drop policy if exists "public reads post images" on storage.objects;
create policy "public reads post images"
  on storage.objects for select
  using (bucket_id = 'post-images');

drop policy if exists "owner writes post images" on storage.objects;
create policy "owner writes post images"
  on storage.objects for insert
  with check (
    bucket_id = 'post-images'
    and auth.uid() = 'PASTE-YOUR-USER-UUID-HERE'
  );

drop policy if exists "owner deletes post images" on storage.objects;
create policy "owner deletes post images"
  on storage.objects for delete
  using (
    bucket_id = 'post-images'
    and auth.uid() = 'PASTE-YOUR-USER-UUID-HERE'
  );


-- ----------------------------------------------------------------------------
--  Sanity check — run this after the above and read the results.
-- ----------------------------------------------------------------------------
--  Both tables must report rowsecurity = true.
--
--    select tablename, rowsecurity
--    from pg_tables
--    where schemaname = 'public' and tablename in ('posts','leads');
--
--  You should see 3 policies (1 on leads, 2 on posts):
--
--    select tablename, policyname, cmd
--    from pg_policies
--    where schemaname = 'public' and tablename in ('posts','leads');
-- ----------------------------------------------------------------------------
