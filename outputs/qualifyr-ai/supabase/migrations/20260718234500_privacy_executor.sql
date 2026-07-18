-- Exécuteur RGPD durable. Migration additive, à valider localement avant toute application distante.
create extension if not exists pgcrypto;

alter table public.privacy_requests add column if not exists scope jsonb not null default '{}'::jsonb;
alter table public.privacy_requests add column if not exists validation_required boolean not null default false;
alter table public.privacy_requests add column if not exists approved_by uuid references auth.users(id) on delete set null;
alter table public.privacy_requests add column if not exists approved_at timestamptz;
alter table public.privacy_requests add column if not exists started_at timestamptz;
alter table public.privacy_requests add column if not exists executed_at timestamptz;
alter table public.privacy_requests add column if not exists result jsonb not null default '{}'::jsonb;
alter table public.privacy_requests add column if not exists errors jsonb not null default '[]'::jsonb;
alter table public.privacy_requests add column if not exists correlation_id text;
alter table public.privacy_requests add column if not exists idempotency_key text;
alter table public.privacy_requests add column if not exists updated_at timestamptz not null default now();
alter table public.privacy_requests alter column workspace_id drop not null;
alter table public.privacy_requests drop constraint if exists privacy_requests_workspace_id_fkey;
alter table public.privacy_requests add constraint privacy_requests_workspace_id_fkey foreign key(workspace_id) references public.workspaces(id) on delete set null not valid;
alter table public.privacy_requests drop constraint if exists privacy_requests_status_check;
alter table public.privacy_requests add constraint privacy_requests_status_check check(status in('requested','verification_required','approved','queued','processing','completed','partially_completed','failed','cancelled')) not valid;
update public.privacy_requests set status=case status when 'pending' then 'requested' when 'identity_verification_required' then 'verification_required' when 'running' then 'processing' when 'rejected' then 'cancelled' else status end;
create unique index if not exists privacy_requests_idempotency_idx on public.privacy_requests(idempotency_key) where idempotency_key is not null;

alter table public.privacy_request_jobs add column if not exists correlation_id text;
alter table public.privacy_request_jobs add column if not exists worker_id text;
alter table public.privacy_request_jobs add column if not exists locked_at timestamptz;
alter table public.privacy_request_jobs add column if not exists result jsonb not null default '{}'::jsonb;
alter table public.privacy_request_jobs alter column workspace_id drop not null;
alter table public.privacy_request_jobs drop constraint if exists privacy_request_jobs_workspace_id_fkey;
alter table public.privacy_request_jobs add constraint privacy_request_jobs_workspace_id_fkey foreign key(workspace_id) references public.workspaces(id) on delete set null not valid;
create index if not exists privacy_request_jobs_claim_idx on public.privacy_request_jobs(status,run_after,created_at) where status in('queued','processing','failed');

create table if not exists public.privacy_exports (
  id text primary key,
  request_id text not null references public.privacy_requests(id) on delete cascade,
  workspace_id text references public.workspaces(id) on delete cascade,
  requested_by uuid references auth.users(id) on delete set null,
  payload jsonb not null,
  status text not null default 'available' check(status in('available','downloaded','expired','deleted')),
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  downloaded_at timestamptz
);

create table if not exists public.workspace_consents (
  id text primary key,
  workspace_id text not null references public.workspaces(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  status text not null check(status in('granted','withdrawn')),
  granted_at timestamptz,
  withdrawn_at timestamptz,
  updated_at timestamptz not null default now(),
  unique(workspace_id,user_id)
);

create or replace function public.claim_privacy_job(p_worker_id text)
returns setof public.privacy_request_jobs
language plpgsql security definer set search_path=public as $$
declare selected_id text;
begin
  select id into selected_id
  from public.privacy_request_jobs
  where attempts < 5 and (
    (status in ('queued','failed') and run_after <= now()) or
    (status='processing' and locked_at < now() - interval '15 minutes')
  )
  order by run_after,created_at
  for update skip locked
  limit 1;
  if selected_id is null then return; end if;
  return query
    update public.privacy_request_jobs
    set status='processing',attempts=attempts+1,worker_id=p_worker_id,locked_at=now(),started_at=coalesce(started_at,now()),updated_at=now()
    where id=selected_id
    returning *;
end $$;

create or replace function public.privacy_anonymize_contact(p_workspace_id text,p_contact_id text,p_marker text)
returns jsonb language plpgsql security definer set search_path=public as $$
declare affected integer;
begin
  if not exists(select 1 from public.crm_contacts where id=p_contact_id and workspace_id=p_workspace_id) then
    return jsonb_build_object('anonymized',false);
  end if;
  delete from public.crm_notes where workspace_id=p_workspace_id and contact_id=p_contact_id;
  delete from public.crm_documents where workspace_id=p_workspace_id and contact_id=p_contact_id;
  delete from public.crm_organization_contacts where workspace_id=p_workspace_id and contact_id=p_contact_id;
  delete from public.crm_opportunity_contacts where workspace_id=p_workspace_id and contact_id=p_contact_id;
  delete from public.crm_entity_tags where workspace_id=p_workspace_id and entity_type='contact' and entity_id=p_contact_id;
  delete from public.crm_custom_values where workspace_id=p_workspace_id and entity_type='contact' and entity_id=p_contact_id;
  update public.crm_tasks set contact_id=null,description=null,updated_at=now() where workspace_id=p_workspace_id and contact_id=p_contact_id;
  update public.crm_opportunities set primary_contact_id=null,updated_at=now() where workspace_id=p_workspace_id and primary_contact_id=p_contact_id;
  update public.website_form_submissions set contact_id=null,payload=jsonb_build_object('anonymized',true),ip_hash=null where workspace_id=p_workspace_id and contact_id=p_contact_id;
  update public.crm_contacts set
    first_name=null,last_name=null,display_name='Contact anonymisé',email=null,email_normalized=null,phone=null,phone_normalized=null,
    role_label=null,city=null,postal_code=null,short_note=null,source='privacy_anonymization',status='archived',owner_user_id=null,
    archived_at=coalesce(archived_at,now()),legacy_lead_id=null,updated_at=now()
  where id=p_contact_id and workspace_id=p_workspace_id;
  get diagnostics affected=row_count;
  insert into public.security_audit_events(workspace_id,event_type,resource_type,resource_id,metadata_redacted)
  values(p_workspace_id,'privacy.contact.anonymized','contact',p_marker,jsonb_build_object('affected',affected));
  return jsonb_build_object('anonymized',affected=1,'marker',p_marker);
end $$;

create or replace function public.privacy_revoke_user_sessions(p_user_id uuid)
returns integer language plpgsql security definer set search_path=public,auth as $$
declare affected integer;
begin
  delete from auth.sessions where user_id=p_user_id;
  get diagnostics affected=row_count;
  return affected;
end $$;

create or replace function public.privacy_delete_workspace(p_workspace_id text,p_request_id text)
returns boolean language plpgsql security definer set search_path=public as $$
begin
  if not exists(select 1 from public.privacy_requests where id=p_request_id and workspace_id=p_workspace_id and status='processing' and request_type='workspace_deletion') then
    raise exception 'PRIVACY_REQUEST_NOT_EXECUTABLE';
  end if;
  delete from public.workspaces where id=p_workspace_id;
  return found;
end $$;

revoke all on function public.claim_privacy_job(text) from public,anon,authenticated;
revoke all on function public.privacy_anonymize_contact(text,text,text) from public,anon,authenticated;
revoke all on function public.privacy_revoke_user_sessions(uuid) from public,anon,authenticated;
revoke all on function public.privacy_delete_workspace(text,text) from public,anon,authenticated;
grant execute on function public.claim_privacy_job(text) to service_role;
grant execute on function public.privacy_anonymize_contact(text,text,text) to service_role;
grant execute on function public.privacy_revoke_user_sessions(uuid) to service_role;
grant execute on function public.privacy_delete_workspace(text,text) to service_role;

alter table public.privacy_exports enable row level security;
alter table public.workspace_consents enable row level security;
revoke all on public.privacy_exports,public.workspace_consents from anon,authenticated;
grant select,insert,update,delete on public.privacy_exports,public.workspace_consents to service_role;

comment on function public.claim_privacy_job(text) is 'Atomic SKIP LOCKED claim with stale-job recovery.';
comment on table public.privacy_exports is 'Short-lived exports; payload must be deleted by expiry cleanup or workspace deletion.';
