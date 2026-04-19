-- AgentCheckout database migration
-- Run this in Supabase SQL Editor after creating the project

create table merchants (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  email text not null,
  store_url text not null,
  store_name text not null,
  created_at timestamptz default now()
);

create table agent_sessions (
  id uuid primary key default gen_random_uuid(),
  merchant_slug text,
  query text,
  events jsonb default '[]'::jsonb,
  order_id text,
  order_total numeric,
  created_at timestamptz default now()
);

create index on agent_sessions (merchant_slug);
create index on agent_sessions (created_at desc);

-- Seed demo merchant
insert into merchants (slug, email, store_url, store_name)
values ('demo', 'demo@agentcheckout.app', 'https://demo.example.com', 'Demo Running Store');

-- Disable RLS for buildathon (no auth)
alter table merchants disable row level security;
alter table agent_sessions disable row level security;
