create table if not exists public.leads (
  id text primary key,
  type text not null default 'Nouvelle demande',
  status text not null default 'Nouvelle demande',
  plan text,
  company text,
  name text,
  email text,
  phone text,
  profession text,
  payment_id text,
  amount numeric,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.accounts (
  id text primary key,
  role text not null default 'client',
  status text not null default 'Actif',
  company text,
  name text,
  email text unique not null,
  profession text,
  plan text,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.payments (
  id text primary key,
  lead_id text,
  status text not null,
  provider text not null default 'mollie',
  amount numeric,
  currency text not null default 'EUR',
  plan text,
  email text,
  company text,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.subscriptions (
  id text primary key,
  account_email text not null,
  status text not null default 'active',
  provider text not null default 'mollie',
  plan text,
  amount numeric,
  currency text not null default 'EUR',
  current_period_start timestamptz,
  current_period_end timestamptz,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.copilot_installations (
  id text primary key,
  account_email text not null,
  company text,
  profession text,
  copilot text,
  status text not null default 'A installer',
  plan text,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.email_events (
  id bigserial primary key,
  to_email text not null,
  subject text not null,
  status text not null default 'sent',
  provider text not null default 'resend',
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.leads enable row level security;
alter table public.accounts enable row level security;
alter table public.payments enable row level security;
alter table public.subscriptions enable row level security;
alter table public.copilot_installations enable row level security;
alter table public.email_events enable row level security;
