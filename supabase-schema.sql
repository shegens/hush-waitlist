-- Run this in Supabase SQL editor

create table waitlist (
  address     text primary key,
  name        text,
  notes       text,
  score       int not null default 1,
  status      text not null default 'pending' check (status in ('pending', 'approved')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Score: 1 base + 1 if name filled + 1 if notes filled
-- Admin view: order by status, then score desc, then created_at asc
create view waitlist_ranked as
  select *, rank() over (order by status desc, score desc, created_at asc) as rank
  from waitlist;

-- Enable RLS
alter table waitlist enable row level security;

-- Anyone can insert (to join the waitlist)
create policy "insert own" on waitlist for insert with check (true);

-- Anyone can update their own row (to add name/notes)
create policy "update own" on waitlist for update using (true);

-- No public reads — only service role (admin) can see the list
-- The anon key gets nothing; use service key for admin queries
