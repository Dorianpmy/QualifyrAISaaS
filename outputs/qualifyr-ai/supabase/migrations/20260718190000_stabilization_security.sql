-- Additive stabilization migration. Review in a staging Supabase project before applying.
create table if not exists public.webhook_receipts (
  id text primary key,
  provider text not null,
  workspace_id text references public.workspaces(id) on delete cascade,
  provider_event_id text not null,
  payload_hash text not null,
  status text not null check (status in ('processing','completed','rejected','failed')),
  received_at timestamptz not null default now(),
  completed_at timestamptz,
  unique(provider, provider_event_id)
);

create table if not exists public.privacy_requests (
  id text primary key,
  workspace_id text not null references public.workspaces(id) on delete cascade,
  requested_by uuid not null references auth.users(id),
  request_type text not null check (request_type in ('export','contact_anonymization','workspace_deletion')),
  target_type text,
  target_id text,
  status text not null default 'pending' check (status in ('pending','approved','running','completed','rejected','failed')),
  reason text,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create table if not exists public.security_audit_events (
  id uuid primary key default gen_random_uuid(),
  workspace_id text references public.workspaces(id) on delete set null,
  actor_user_id uuid references auth.users(id) on delete set null,
  event_type text not null,
  resource_type text,
  resource_id text,
  correlation_id text,
  metadata_redacted jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists webhook_receipts_workspace_idx on public.webhook_receipts(workspace_id, received_at desc);
create index if not exists privacy_requests_workspace_idx on public.privacy_requests(workspace_id, created_at desc);
create index if not exists security_audit_events_workspace_idx on public.security_audit_events(workspace_id, created_at desc);

do $$ declare t text; begin
  foreach t in array array['webhook_receipts','privacy_requests','security_audit_events'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('revoke all on public.%I from anon, authenticated', t);
    execute format('grant select, insert, update, delete on public.%I to service_role', t);
  end loop;
end $$;

comment on table public.privacy_requests is 'Auditable privacy requests; destructive execution is deliberately separate and requires review.';
