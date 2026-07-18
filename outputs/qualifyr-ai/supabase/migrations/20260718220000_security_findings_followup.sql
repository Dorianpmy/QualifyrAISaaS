-- Correctifs additifs après la revue 9B. Aucune table ni donnée existante supprimée.
create extension if not exists pgcrypto;
alter table public.workspace_members add column if not exists status text not null default 'active';
alter table public.workspace_members add column if not exists invitation_status text not null default 'accepted';
alter table public.workspace_members add column if not exists invited_at timestamptz;
alter table public.workspace_members add column if not exists accepted_at timestamptz;
alter table public.workspace_members add column if not exists removed_at timestamptz;
create index if not exists workspace_members_active_lookup_idx on public.workspace_members(user_id,workspace_id) where status='active' and invitation_status='accepted';

alter table public.connections add column if not exists workspace_id text references public.workspaces(id) on delete cascade;
alter table public.connections add column if not exists display_name text;
alter table public.connections add column if not exists capabilities jsonb not null default '[]'::jsonb;
alter table public.connections add column if not exists connected_at timestamptz;
alter table public.connections add column if not exists last_sync_at timestamptz;
alter table public.connections add column if not exists safe_error_code text;
alter table public.connections add column if not exists reconnect_required boolean not null default false;
alter table public.connections add column if not exists revoked_at timestamptz;
alter table public.connections add column if not exists revocation_attempted_at timestamptz;
update public.connections c set workspace_id=m.workspace_id
from auth.users u join public.workspace_members m on m.user_id=u.id and m.status='active' and m.invitation_status='accepted'
where c.workspace_id is null and lower(c.account_email)=lower(u.email) and not exists(select 1 from public.workspace_members m2 where m2.user_id=u.id and m2.workspace_id<>m.workspace_id and m2.status='active');
alter table public.connections drop constraint if exists connections_account_email_provider_key;
alter table public.connections drop constraint if exists connections_status_check;
alter table public.connections add constraint connections_status_check check(status in ('not_connected','configured','connected','error','revocation_pending')) not valid;
create unique index if not exists connections_workspace_provider_idx on public.connections(workspace_id,provider) where workspace_id is not null;

alter table public.copilot_installations add column if not exists workspace_id text references public.workspaces(id) on delete cascade;
alter table public.copilot_installations add column if not exists copilot_id text;
alter table public.copilot_installations add column if not exists dependencies_valid boolean not null default false;
alter table public.copilot_installations add column if not exists entitlement_valid boolean not null default false;
alter table public.copilot_installations add column if not exists safe_error_code text;
alter table public.copilot_installations add column if not exists last_idempotency_key text;
alter table public.copilot_installations add column if not exists installed_at timestamptz;
update public.copilot_installations c set workspace_id=m.workspace_id,copilot_id=lower(regexp_replace(coalesce(c.copilot,'unknown'),'[^a-zA-Z0-9]+','-','g'))
from auth.users u join public.workspace_members m on m.user_id=u.id and m.status='active' and m.invitation_status='accepted'
where c.workspace_id is null and lower(c.account_email)=lower(u.email) and not exists(select 1 from public.workspace_members m2 where m2.user_id=u.id and m2.workspace_id<>m.workspace_id and m2.status='active');
create unique index if not exists copilot_installations_workspace_copilot_idx on public.copilot_installations(workspace_id,copilot_id) where workspace_id is not null;

create table if not exists public.workspace_entitlements (
  id text primary key, workspace_id text not null references public.workspaces(id) on delete cascade,
  entitlement_key text not null default 'copilots', status text not null default 'active' check(status in('active','expired','suspended')),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(workspace_id,entitlement_key)
);
insert into public.workspace_entitlements(id,workspace_id,entitlement_key,status)
select 'entitlement_'||encode(digest(wp.workspace_id||':copilots','sha256'),'hex'),wp.workspace_id,'copilots','active'
from public.workspace_packs wp where wp.status='active'
on conflict(workspace_id,entitlement_key) do nothing;

alter table public.messages add column if not exists workspace_id text references public.workspaces(id) on delete cascade;
alter table public.messages alter column account_email drop not null;
alter table public.quotes add column if not exists workspace_id text references public.workspaces(id) on delete cascade;
alter table public.quotes alter column account_email drop not null;
create index if not exists messages_workspace_created_idx on public.messages(workspace_id,created_at desc);

create table if not exists public.message_drafts (
  id text primary key, workspace_id text not null references public.workspaces(id) on delete cascade,
  source_message_id text not null, channel text not null, recipient_ref text not null, body text not null,
  status text not null default 'pending_approval' check(status in('pending_approval','approved','sending','sent','blocked','failed')),
  model_response_id text, approved_by uuid references auth.users(id), approved_at timestamptz,
  idempotency_key text not null, provider_message_id text, created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  unique(workspace_id,idempotency_key)
);

create or replace function public.claim_webhook_receipt(p_provider text,p_event_id text,p_workspace_id text,p_payload_hash text)
returns boolean language plpgsql security definer set search_path=public as $$
begin
  insert into public.webhook_receipts(id,provider,provider_event_id,workspace_id,payload_hash,status,received_at)
  values('receipt_'||encode(digest(p_provider||':'||p_event_id,'sha256'),'hex'),p_provider,p_event_id,p_workspace_id,p_payload_hash,'processing',now())
  on conflict(provider,provider_event_id) do nothing;
  return found;
end $$;
revoke all on function public.claim_webhook_receipt(text,text,text,text) from public,anon,authenticated;
grant execute on function public.claim_webhook_receipt(text,text,text,text) to service_role;

create table if not exists public.privacy_request_jobs (
  id text primary key, request_id text not null references public.privacy_requests(id) on delete cascade,
  workspace_id text not null references public.workspaces(id) on delete cascade, operation text not null,
  status text not null default 'queued' check(status in('queued','processing','completed','partially_completed','failed','cancelled')),
  attempts integer not null default 0, idempotency_key text not null unique, safe_error_code text,
  run_after timestamptz not null default now(), started_at timestamptz, completed_at timestamptz, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.connection_revocation_jobs (
  id text primary key, workspace_id text not null references public.workspaces(id) on delete cascade,
  connection_id text not null references public.connections(id) on delete cascade, provider text not null,
  status text not null default 'queued' check(status in('queued','processing','completed','failed','cancelled')),
  attempts integer not null default 0, run_after timestamptz not null default now(), safe_error_code text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(connection_id)
);

alter table public.privacy_requests drop constraint if exists privacy_requests_request_type_check;
alter table public.privacy_requests add constraint privacy_requests_request_type_check check(request_type in('export','correction','contact_anonymization','withdraw_consent','delete_ai_memory','revoke_connections','workspace_deletion')) not valid;
alter table public.privacy_requests drop constraint if exists privacy_requests_status_check;
alter table public.privacy_requests add constraint privacy_requests_status_check check(status in('pending','requested','identity_verification_required','approved','queued','running','processing','completed','partially_completed','failed','rejected','cancelled')) not valid;

do $$ declare t text; begin
  foreach t in array array['workspace_entitlements','message_drafts','privacy_request_jobs','connection_revocation_jobs'] loop
    execute format('alter table public.%I enable row level security',t);
    execute format('revoke all on public.%I from anon,authenticated',t);
    execute format('grant select,insert,update,delete on public.%I to service_role',t);
  end loop;
end $$;
