-- ============================================================================
--  Sociofolio — database schema (READY TO RUN)
-- ============================================================================
--
--  This is `schema.sql` with the owner UUID already filled in. Nothing to edit.
--
--  HOW TO RUN:
--    Supabase Dashboard -> SQL Editor -> New query -> paste this whole file
--    -> Run. It is safe to run more than once (every statement is idempotent).
--
--  ALREADY DONE — verified against the live project on 2026-08-11:
--    [x] Auth user selangwe19u@gmail.com exists and is email-confirmed.
--        UUID: 05519148-b232-4e49-913b-62dd992de3a3  (used throughout below)
--    [x] Storage bucket `post-images` exists and is public.
--
--  STILL WORTH CHECKING (dashboard, not SQL):
--    [ ] Authentication -> Providers -> Email: turn OFF "Allow new users to
--        sign up". This site has exactly one user; leaving signups on lets
--        anyone create an account. The policies below are pinned to your
--        specific UUID so a stray signup still could not touch your data —
--        but there is no reason to leave the door open.
--
--  The last statement is a verification query. Read its output when the run
--  finishes; expected results are described down there.
-- ============================================================================


-- ----------------------------------------------------------------------------
--  LEADS — contact form, newsletter, and resource-download captures
-- ----------------------------------------------------------------------------
--  NOTE: `create table if not exists` is a no-op on an already-provisioned
--  database. This project IS already provisioned, so to add the chat columns
--  run supabase/migrations/2026-08-22-chat-widget.sql — editing the body below
--  will not change the live table.
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
  using (auth.uid() = '05519148-b232-4e49-913b-62dd992de3a3'::uuid);


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
  using      (auth.uid() = '05519148-b232-4e49-913b-62dd992de3a3'::uuid)
  with check (auth.uid() = '05519148-b232-4e49-913b-62dd992de3a3'::uuid);


-- ----------------------------------------------------------------------------
--  STORAGE — the `post-images` bucket
-- ----------------------------------------------------------------------------
--  The bucket already exists (created 2026-08-11, public). These are just the
--  access policies for the objects inside it.
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
    and auth.uid() = '05519148-b232-4e49-913b-62dd992de3a3'::uuid
  );

drop policy if exists "owner deletes post images" on storage.objects;
create policy "owner deletes post images"
  on storage.objects for delete
  using (
    bucket_id = 'post-images'
    and auth.uid() = '05519148-b232-4e49-913b-62dd992de3a3'::uuid
  );


-- ----------------------------------------------------------------------------
--  VERIFICATION — this is the last statement, so its output is what the SQL
--  editor shows you when the run finishes.
--
--  EXPECTED: 8 rows.
--
--    kind   | name                              | detail
--    -------+-----------------------------------+---------
--    table  | leads                             | rls=true
--    table  | posts                             | rls=true
--    policy | leads: owner reads leads          | SELECT
--    policy | posts: owner full access to posts | ALL
--    policy | posts: public reads published...  | SELECT
--    storage| owner deletes post images         | DELETE
--    storage| owner writes post images          | INSERT
--    storage| public reads post images          | SELECT
--
--  If any table shows rls=false, or you get fewer than 8 rows, something did
--  not apply — do not put the site live until this comes back clean.
-- ----------------------------------------------------------------------------
select 'table' as kind, tablename as name,
       'rls=' || rowsecurity as detail
  from pg_tables
 where schemaname = 'public' and tablename in ('posts','leads')

union all

select 'policy', tablename || ': ' || policyname, cmd
  from pg_policies
 where schemaname = 'public' and tablename in ('posts','leads')

union all

select 'storage', policyname, cmd
  from pg_policies
 where schemaname = 'storage' and tablename = 'objects'
   and policyname in ('public reads post images',
                      'owner writes post images',
                      'owner deletes post images')

 order by 1, 2;
