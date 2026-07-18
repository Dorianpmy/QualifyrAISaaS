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

create table if not exists public.connections (
  id text primary key,
  account_email text not null,
  provider text not null,
  status text not null default 'not_connected'
    check (status in ('not_connected', 'configured', 'connected', 'error')),
  settings jsonb not null default '{}'::jsonb,
  last_test_status text,
  last_tested_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (account_email, provider)
);

create table if not exists public.quotes (
  id text primary key,
  account_email text not null,
  number text not null,
  client_name text not null,
  client_email text,
  status text not null default 'Brouillon',
  currency text not null default 'EUR',
  vat_rate numeric not null default 20,
  subtotal numeric not null default 0,
  total numeric not null default 0,
  lines jsonb not null default '[]'::jsonb,
  source text not null default 'manual',
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.messages (
  id text primary key,
  account_email text not null,
  channel text not null,
  direction text not null check (direction in ('inbound', 'outbound')),
  contact_ref text,
  content text,
  status text not null default 'received',
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.copilot_runs (
  id text primary key,
  account_email text not null,
  copilot text not null,
  channel text not null default 'test',
  status text not null default 'completed',
  input jsonb not null default '{}'::jsonb,
  output jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists quotes_account_email_idx on public.quotes (account_email, updated_at desc);
create index if not exists messages_account_email_idx on public.messages (account_email, created_at desc);
create index if not exists copilot_runs_account_email_idx on public.copilot_runs (account_email, created_at desc);

create index if not exists connections_account_email_idx on public.connections (account_email);

alter table public.leads enable row level security;
alter table public.accounts enable row level security;
alter table public.payments enable row level security;
alter table public.subscriptions enable row level security;
alter table public.copilot_installations enable row level security;
revoke all on table public.copilot_installations from anon, authenticated;
grant select, insert, update, delete on table public.copilot_installations to service_role;
alter table public.email_events enable row level security;
alter table public.connections enable row level security;
alter table public.quotes enable row level security;
alter table public.messages enable row level security;
alter table public.copilot_runs enable row level security;

revoke all on table public.connections from anon, authenticated;
grant select, insert, update, delete on table public.connections to service_role;
revoke all on table public.quotes from anon, authenticated;
revoke all on table public.messages from anon, authenticated;
revoke all on table public.copilot_runs from anon, authenticated;
grant select, insert, update, delete on table public.quotes to service_role;
grant select, insert, update, delete on table public.messages to service_role;
grant select, insert, update, delete on table public.copilot_runs to service_role;

-- Qualifyr OS étape 2 : onboarding multi-tenant et provisioning idempotent.
create table if not exists public.workspaces (
  id text primary key,
  owner_user_id uuid not null unique,
  name text not null,
  status text not null default 'onboarding' check (status in ('onboarding','active','suspended')),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.workspace_members (
  id text primary key, workspace_id text not null references public.workspaces(id) on delete cascade,
  user_id uuid not null, role text not null default 'owner' check (role in ('owner','admin','member')),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(workspace_id,user_id)
);
create table if not exists public.onboarding_progress (
  id text primary key, user_id uuid not null unique, workspace_id text not null references public.workspaces(id) on delete cascade,
  status text not null default 'not_started' check(status in ('not_started','in_progress','provisioning','completed','failed')),
  current_step smallint not null default 1 check(current_step between 1 and 9), answers jsonb not null default '{}'::jsonb,
  started_at timestamptz, updated_at timestamptz not null default now(), completed_at timestamptz, last_error text
);
create table if not exists public.business_profiles (
  id text primary key, workspace_id text not null unique references public.workspaces(id) on delete cascade,
  company_name text not null, manager_name text, description text, company_size text, trade_id text not null, custom_trade text,
  country_code text not null default 'FR', city text, postal_code text, service_area text, phone text, email text, website text,
  locale text not null default 'fr-FR', currency text not null default 'EUR', timezone text not null default 'Europe/Paris',
  primary_color text not null default '#126044', secondary_color text not null default '#EAF7EF', tagline text, communication_tone text,
  updated_at timestamptz not null default now()
);
create table if not exists public.workspace_packs (
  id text primary key, workspace_id text not null references public.workspaces(id) on delete cascade,
  pack_id text not null, pack_version integer not null default 1, status text not null default 'active', installed_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(workspace_id,pack_id)
);
create table if not exists public.workspace_modules (
  id text primary key, workspace_id text not null references public.workspaces(id) on delete cascade,
  module_id text not null, status text not null check(status in ('enabled','recommended','disabled')), source text not null default 'onboarding',
  settings jsonb not null default '{}'::jsonb, updated_at timestamptz not null default now(), unique(workspace_id,module_id)
);
create table if not exists public.workspace_goals (
  id text primary key, workspace_id text not null references public.workspaces(id) on delete cascade,
  goal_id text not null, priority integer not null default 1, is_primary boolean not null default false,
  created_at timestamptz not null default now(), unique(workspace_id,goal_id)
);
create unique index if not exists workspace_goals_one_primary_idx on public.workspace_goals(workspace_id) where is_primary;
create table if not exists public.workspace_initial_configs (
  id text primary key, workspace_id text not null unique references public.workspaces(id) on delete cascade, pack_id text not null,
  crm_pipeline jsonb not null default '[]'::jsonb, crm_fields jsonb not null default '[]'::jsonb, forms jsonb not null default '[]'::jsonb,
  dashboard_cards jsonb not null default '[]'::jsonb, automations jsonb not null default '[]'::jsonb, templates jsonb not null default '[]'::jsonb,
  next_actions jsonb not null default '[]'::jsonb, updated_at timestamptz not null default now()
);
create table if not exists public.provisioning_operations (
  id text primary key, workspace_id text not null references public.workspaces(id) on delete cascade,
  operation_key text not null, position smallint not null, status text not null check(status in ('pending','running','completed','failed')),
  attempts integer not null default 0, last_error text, completed_at timestamptz, updated_at timestamptz not null default now(), unique(workspace_id,operation_key)
);

-- Qualifyr OS / Étape 3 : dashboard entreprise. Tables additives et réversibles.
create table if not exists public.dashboard_preferences (
  id text primary key, workspace_id text not null references public.workspaces(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  widget_order jsonb not null default '[]'::jsonb, hidden_widgets jsonb not null default '[]'::jsonb,
  preferred_period integer not null default 30 check (preferred_period in (7,30,90)), updated_at timestamptz not null default now(),
  unique(workspace_id,user_id)
);
create table if not exists public.workspace_activities (
  id text primary key, workspace_id text not null references public.workspaces(id) on delete cascade,
  actor_user_id uuid references auth.users(id) on delete set null, event_type text not null,
  resource_type text, resource_id text, metadata jsonb not null default '{}'::jsonb, created_at timestamptz not null default now()
);
create table if not exists public.workspace_recommendations (
  id text primary key, workspace_id text not null references public.workspaces(id) on delete cascade,
  recommendation_key text not null, status text not null default 'active' check (status in ('active','dismissed','completed','expired')),
  priority integer not null default 1 check (priority between 0 and 4), source text not null default 'rules',
  action_view text, created_at timestamptz not null default now(), dismissed_at timestamptz, completed_at timestamptz,
  unique(workspace_id,recommendation_key)
);
create index if not exists workspace_activities_workspace_created_idx on public.workspace_activities(workspace_id,created_at desc);
create index if not exists workspace_recommendations_workspace_status_idx on public.workspace_recommendations(workspace_id,status);
create index if not exists dashboard_preferences_workspace_idx on public.dashboard_preferences(workspace_id);
alter table public.dashboard_preferences enable row level security;
alter table public.workspace_activities enable row level security;
alter table public.workspace_recommendations enable row level security;
revoke all on public.dashboard_preferences, public.workspace_activities, public.workspace_recommendations from anon, authenticated;
grant all on public.dashboard_preferences, public.workspace_activities, public.workspace_recommendations to service_role;

-- Qualifyr OS / Étape 4 : CRM multi-tenant. Migration additive, aucune table historique supprimée.
create table if not exists public.crm_contacts (
 id text primary key, workspace_id text not null references public.workspaces(id) on delete cascade,
 first_name text, last_name text, display_name text not null, email text, email_normalized text,
 phone text, phone_normalized text, role_label text, city text, postal_code text, country_code text,
 preferred_locale text, timezone text, source text, status text not null default 'prospect', owner_user_id uuid,
 short_note text, last_activity_at timestamptz, archived_at timestamptz, merged_into_id text references public.crm_contacts(id),
 legacy_lead_id text, version integer not null default 1, created_by uuid, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.crm_organizations (
 id text primary key, workspace_id text not null references public.workspaces(id) on delete cascade, name text not null,
 legal_name text, organization_type text not null default 'client', email text, phone text, website text, address text,
 city text, postal_code text, country_code text, external_reference text, source text, owner_user_id uuid,
 archived_at timestamptz, version integer not null default 1, created_by uuid, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.crm_organization_contacts (
 id text primary key, workspace_id text not null references public.workspaces(id) on delete cascade,
 organization_id text not null references public.crm_organizations(id) on delete cascade,
 contact_id text not null references public.crm_contacts(id) on delete cascade, role_label text, is_primary boolean not null default false,
 created_at timestamptz not null default now(), unique(organization_id,contact_id)
);
create table if not exists public.crm_pipelines (
 id text primary key, workspace_id text not null references public.workspaces(id) on delete cascade,
 template_key text, template_version integer not null default 1, name text not null, description text,
 position integer not null default 1, status text not null default 'active' check(status in ('active','archived')),
 customized boolean not null default false, created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
 unique(workspace_id,template_key)
);
create table if not exists public.crm_pipeline_stages (
 id text primary key, workspace_id text not null references public.workspaces(id) on delete cascade,
 pipeline_id text not null references public.crm_pipelines(id) on delete cascade, stable_key text not null, name text not null,
 position integer not null, stage_type text not null default 'open' check(stage_type in ('open','won','lost')),
 color text, probability integer, inactivity_days integer not null default 7, status text not null default 'active',
 created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(pipeline_id,stable_key)
);
create table if not exists public.crm_opportunities (
 id text primary key, workspace_id text not null references public.workspaces(id) on delete cascade, name text not null,
 opportunity_type text, pipeline_id text not null references public.crm_pipelines(id), stage_id text not null references public.crm_pipeline_stages(id),
 status text not null default 'open' check(status in ('open','won','lost','archived')), primary_contact_id text references public.crm_contacts(id),
 organization_id text references public.crm_organizations(id), owner_user_id uuid, source text, value_minor bigint,
 currency text not null default 'EUR', priority text not null default 'normal', expected_close_at timestamptz,
 next_action text, next_action_at timestamptz, loss_reason text, last_activity_at timestamptz not null default now(),
 stage_entered_at timestamptz not null default now(), closed_at timestamptz, archived_at timestamptz,
 version integer not null default 1, created_by uuid, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.crm_opportunity_contacts (
 id text primary key, workspace_id text not null references public.workspaces(id) on delete cascade,
 opportunity_id text not null references public.crm_opportunities(id) on delete cascade,
 contact_id text not null references public.crm_contacts(id) on delete cascade, role_label text not null default 'contact',
 is_primary boolean not null default false, created_at timestamptz not null default now(), unique(opportunity_id,contact_id)
);
create table if not exists public.crm_tasks (
 id text primary key, workspace_id text not null references public.workspaces(id) on delete cascade, title text not null,
 description text, task_type text not null default 'other', priority text not null default 'normal',
 status text not null default 'todo' check(status in ('todo','in_progress','completed','cancelled')),
 due_at timestamptz, reminder_at timestamptz, contact_id text references public.crm_contacts(id),
 organization_id text references public.crm_organizations(id), opportunity_id text references public.crm_opportunities(id),
 owner_user_id uuid, created_by uuid, completed_at timestamptz, archived_at timestamptz,
 version integer not null default 1, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.crm_notes (
 id text primary key, workspace_id text not null references public.workspaces(id) on delete cascade, content text not null,
 contact_id text references public.crm_contacts(id), organization_id text references public.crm_organizations(id),
 opportunity_id text references public.crm_opportunities(id), author_user_id uuid, archived_at timestamptz,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.crm_documents (
 id text primary key, workspace_id text not null references public.workspaces(id) on delete cascade, file_name text not null,
 storage_path text not null, mime_type text, size_bytes bigint, contact_id text references public.crm_contacts(id),
 organization_id text references public.crm_organizations(id), opportunity_id text references public.crm_opportunities(id),
 author_user_id uuid, archived_at timestamptz, created_at timestamptz not null default now()
);
create table if not exists public.crm_activities (
 id text primary key, workspace_id text not null references public.workspaces(id) on delete cascade, actor_user_id uuid,
 event_type text not null, resource_type text not null, resource_id text not null, summary text not null,
 metadata jsonb not null default '{}'::jsonb, created_at timestamptz not null default now()
);
create table if not exists public.crm_saved_views (
 id text primary key, workspace_id text not null references public.workspaces(id) on delete cascade, user_id uuid,
 name text not null, entity_type text not null, filters jsonb not null default '{}'::jsonb, columns jsonb not null default '[]'::jsonb,
 scope text not null default 'personal' check(scope in ('personal','workspace')), created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.crm_duplicate_candidates (
 id text primary key, workspace_id text not null references public.workspaces(id) on delete cascade,
 entity_type text not null, primary_id text not null, duplicate_id text not null, reasons jsonb not null default '[]'::jsonb,
 status text not null default 'pending' check(status in ('pending','ignored','merged')), created_at timestamptz not null default now(), resolved_at timestamptz,
 unique(workspace_id,entity_type,primary_id,duplicate_id)
);
create table if not exists public.crm_custom_fields (
 id text primary key, workspace_id text not null references public.workspaces(id) on delete cascade, internal_key text not null,
 label text not null, description text, field_type text not null, entity_type text not null,
 position integer not null default 1, required boolean not null default false, options jsonb not null default '[]'::jsonb,
 default_value text, pack_origin text, status text not null default 'active', created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
 unique(workspace_id,entity_type,internal_key)
);
create table if not exists public.crm_custom_values (
 id text primary key, workspace_id text not null references public.workspaces(id) on delete cascade,
 field_id text not null references public.crm_custom_fields(id), entity_type text not null, entity_id text not null,
 value_text text, value_number numeric, value_boolean boolean, value_date timestamptz,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(field_id,entity_id)
);
create table if not exists public.crm_tags (
 id text primary key, workspace_id text not null references public.workspaces(id) on delete cascade, name text not null, color text,
 created_at timestamptz not null default now(), unique(workspace_id,name)
);
create table if not exists public.crm_entity_tags (
 id text primary key, workspace_id text not null references public.workspaces(id) on delete cascade,
 tag_id text not null references public.crm_tags(id) on delete cascade, entity_type text not null, entity_id text not null,
 created_at timestamptz not null default now(), unique(tag_id,entity_type,entity_id)
);
create table if not exists public.crm_imports (
 id text primary key, workspace_id text not null references public.workspaces(id) on delete cascade, user_id uuid,
 entity_type text not null, status text not null, total_rows integer not null default 0, imported_rows integer not null default 0,
 rejected_rows integer not null default 0, strategy text, created_at timestamptz not null default now(), completed_at timestamptz
);
create table if not exists public.crm_import_errors (
 id text primary key, workspace_id text not null references public.workspaces(id) on delete cascade,
 import_id text not null references public.crm_imports(id) on delete cascade, row_number integer not null, message text not null,
 created_at timestamptz not null default now()
);
create table if not exists public.crm_outbox_events (
 id text primary key, workspace_id text not null references public.workspaces(id) on delete cascade, event_type text not null,
 resource_type text not null, resource_id text not null, actor_user_id uuid, metadata jsonb not null default '{}'::jsonb,
 idempotency_key text not null unique, status text not null default 'pending', created_at timestamptz not null default now(), processed_at timestamptz
);
create index if not exists crm_contacts_workspace_updated_idx on public.crm_contacts(workspace_id,updated_at desc) where archived_at is null;
create index if not exists crm_contacts_workspace_email_idx on public.crm_contacts(workspace_id,email_normalized) where archived_at is null;
create index if not exists crm_contacts_workspace_phone_idx on public.crm_contacts(workspace_id,phone_normalized) where archived_at is null;
create index if not exists crm_organizations_workspace_name_idx on public.crm_organizations(workspace_id,name) where archived_at is null;
create index if not exists crm_opportunities_workspace_stage_idx on public.crm_opportunities(workspace_id,pipeline_id,stage_id) where archived_at is null;
create index if not exists crm_opportunities_workspace_action_idx on public.crm_opportunities(workspace_id,next_action_at) where status='open';
create index if not exists crm_tasks_workspace_due_idx on public.crm_tasks(workspace_id,due_at) where status in ('todo','in_progress');
create index if not exists crm_activities_resource_idx on public.crm_activities(workspace_id,resource_type,resource_id,created_at desc);
create index if not exists crm_outbox_workspace_created_idx on public.crm_outbox_events(workspace_id,created_at desc);
do $$ declare t text; begin foreach t in array array['crm_contacts','crm_organizations','crm_organization_contacts','crm_pipelines','crm_pipeline_stages','crm_opportunities','crm_opportunity_contacts','crm_tasks','crm_notes','crm_documents','crm_activities','crm_saved_views','crm_duplicate_candidates','crm_custom_fields','crm_custom_values','crm_tags','crm_entity_tags','crm_imports','crm_import_errors','crm_outbox_events'] loop execute format('alter table public.%I enable row level security',t);execute format('revoke all on public.%I from anon, authenticated',t);execute format('grant all on public.%I to service_role',t);end loop; end $$;

-- La fusion reste atomique et vérifie explicitement l'espace de travail.
create or replace function public.crm_merge_contacts(
 p_workspace_id text, p_primary_id text, p_duplicate_id text, p_actor_id uuid
) returns void language plpgsql security definer set search_path = public as $$
declare primary_row public.crm_contacts%rowtype; duplicate_row public.crm_contacts%rowtype;
begin
 if p_primary_id = p_duplicate_id then raise exception 'same_contact'; end if;
 select * into primary_row from public.crm_contacts where id=p_primary_id and workspace_id=p_workspace_id and archived_at is null for update;
 select * into duplicate_row from public.crm_contacts where id=p_duplicate_id and workspace_id=p_workspace_id and archived_at is null for update;
 if primary_row.id is null or duplicate_row.id is null then raise exception 'contact_not_found'; end if;

 update public.crm_contacts set
  first_name=coalesce(nullif(first_name,''),duplicate_row.first_name), last_name=coalesce(nullif(last_name,''),duplicate_row.last_name),
  email=coalesce(nullif(email,''),duplicate_row.email), email_normalized=coalesce(nullif(email_normalized,''),duplicate_row.email_normalized),
  phone=coalesce(nullif(phone,''),duplicate_row.phone), phone_normalized=coalesce(nullif(phone_normalized,''),duplicate_row.phone_normalized),
  role_label=coalesce(nullif(role_label,''),duplicate_row.role_label), city=coalesce(nullif(city,''),duplicate_row.city),
  postal_code=coalesce(nullif(postal_code,''),duplicate_row.postal_code), country_code=coalesce(nullif(country_code,''),duplicate_row.country_code),
  short_note=coalesce(nullif(short_note,''),duplicate_row.short_note), last_activity_at=greatest(last_activity_at,duplicate_row.last_activity_at),
  version=version+1, updated_at=now()
 where id=p_primary_id and workspace_id=p_workspace_id;

 insert into public.crm_organization_contacts(id,workspace_id,organization_id,contact_id,role_label,is_primary,created_at)
 select 'merge_'||md5(id||p_primary_id),workspace_id,organization_id,p_primary_id,role_label,is_primary,created_at
 from public.crm_organization_contacts where workspace_id=p_workspace_id and contact_id=p_duplicate_id
 on conflict(organization_id,contact_id) do nothing;
 delete from public.crm_organization_contacts where workspace_id=p_workspace_id and contact_id=p_duplicate_id;

 insert into public.crm_opportunity_contacts(id,workspace_id,opportunity_id,contact_id,role_label,is_primary,created_at)
 select 'merge_'||md5(id||p_primary_id),workspace_id,opportunity_id,p_primary_id,role_label,is_primary,created_at
 from public.crm_opportunity_contacts where workspace_id=p_workspace_id and contact_id=p_duplicate_id
 on conflict(opportunity_id,contact_id) do nothing;
 delete from public.crm_opportunity_contacts where workspace_id=p_workspace_id and contact_id=p_duplicate_id;

 update public.crm_opportunities set primary_contact_id=p_primary_id,updated_at=now(),version=version+1 where workspace_id=p_workspace_id and primary_contact_id=p_duplicate_id;
 update public.crm_tasks set contact_id=p_primary_id,updated_at=now(),version=version+1 where workspace_id=p_workspace_id and contact_id=p_duplicate_id;
 update public.crm_notes set contact_id=p_primary_id,updated_at=now() where workspace_id=p_workspace_id and contact_id=p_duplicate_id;
 update public.crm_documents set contact_id=p_primary_id where workspace_id=p_workspace_id and contact_id=p_duplicate_id;
 delete from public.crm_custom_values v using public.crm_custom_values p where v.workspace_id=p_workspace_id and v.entity_type='contact' and v.entity_id=p_duplicate_id and p.field_id=v.field_id and p.entity_id=p_primary_id;
 update public.crm_custom_values set entity_id=p_primary_id,updated_at=now() where workspace_id=p_workspace_id and entity_type='contact' and entity_id=p_duplicate_id;
 delete from public.crm_entity_tags d using public.crm_entity_tags p where d.workspace_id=p_workspace_id and d.entity_type='contact' and d.entity_id=p_duplicate_id and p.tag_id=d.tag_id and p.entity_type='contact' and p.entity_id=p_primary_id;
 update public.crm_entity_tags set entity_id=p_primary_id where workspace_id=p_workspace_id and entity_type='contact' and entity_id=p_duplicate_id;

 update public.crm_contacts set archived_at=now(),merged_into_id=p_primary_id,version=version+1,updated_at=now() where id=p_duplicate_id and workspace_id=p_workspace_id;
 update public.crm_duplicate_candidates set status='merged',resolved_at=now() where workspace_id=p_workspace_id and entity_type='contact' and status='pending' and ((primary_id=p_primary_id and duplicate_id=p_duplicate_id) or (primary_id=p_duplicate_id and duplicate_id=p_primary_id));
end $$;
revoke all on function public.crm_merge_contacts(text,text,text,uuid) from public,anon,authenticated;
grant execute on function public.crm_merge_contacts(text,text,text,uuid) to service_role;

-- Qualifyr OS / Étape 5 : Website Builder structuré, versionné et publiable.
create table if not exists public.website_sites (
 id text primary key, workspace_id text not null references public.workspaces(id) on delete cascade, name text not null, slug text not null unique,
 locale text not null default 'fr-FR', objective text not null default 'contact', style_direction text not null default 'professional', status text not null default 'draft' check(status in ('draft','ready','published','unpublished','archived','error')),
 home_page_id text, published_version_id text, version integer not null default 1, archived_at timestamptz, last_published_at timestamptz,
 created_by uuid, created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(workspace_id,name)
);
create table if not exists public.website_themes (
 id text primary key, workspace_id text not null references public.workspaces(id) on delete cascade, site_id text not null unique references public.website_sites(id) on delete cascade,
 theme_key text not null, schema_version integer not null default 1, tokens jsonb not null default '{}'::jsonb, version integer not null default 1, updated_at timestamptz not null default now()
);
create table if not exists public.website_pages (
 id text primary key, workspace_id text not null references public.workspaces(id) on delete cascade, site_id text not null references public.website_sites(id) on delete cascade,
 name text not null, slug text not null, page_type text not null default 'standard', status text not null default 'draft', menu_order integer not null default 1, in_menu boolean not null default true,
 seo_title text, seo_description text, canonical_url text, indexable boolean not null default true, share_image_url text,
 draft_content jsonb not null default '{"schemaVersion":1,"blocks":[]}'::jsonb, schema_version integer not null default 1, version integer not null default 1,
 archived_at timestamptz, created_by uuid, created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(site_id,slug)
);
alter table public.website_sites drop constraint if exists website_sites_home_page_fk;
alter table public.website_sites add constraint website_sites_home_page_fk foreign key(home_page_id) references public.website_pages(id) deferrable initially deferred;
create table if not exists public.website_revisions (
 id text primary key, workspace_id text not null references public.workspaces(id) on delete cascade, site_id text not null references public.website_sites(id) on delete cascade,
 revision_number integer not null, origin text not null, snapshot jsonb not null, author_user_id uuid, comment text, created_at timestamptz not null default now(), unique(site_id,revision_number)
);
create table if not exists public.website_publications (
 id text primary key, workspace_id text not null references public.workspaces(id) on delete cascade, site_id text not null references public.website_sites(id) on delete cascade,
 version_number integer not null, snapshot jsonb not null, validation_result jsonb not null, status text not null default 'published', author_user_id uuid,
 created_at timestamptz not null default now(), unpublished_at timestamptz, unique(site_id,version_number)
);
create table if not exists public.website_forms (
 id text primary key, workspace_id text not null references public.workspaces(id) on delete cascade, site_id text not null references public.website_sites(id) on delete cascade,
 page_id text references public.website_pages(id), form_type text not null, name text not null, fields jsonb not null default '[]'::jsonb,
 crm_create_opportunity boolean not null default true, consent_text text, consent_version integer not null default 1, status text not null default 'active', created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.website_form_submissions (
 id text primary key, workspace_id text not null references public.workspaces(id) on delete cascade, site_id text not null references public.website_sites(id) on delete cascade,
 form_id text not null references public.website_forms(id), page_slug text, contact_id text references public.crm_contacts(id), opportunity_id text references public.crm_opportunities(id),
 payload jsonb not null, consent boolean not null default false, consent_version integer, campaign jsonb not null default '{}'::jsonb, ip_hash text, created_at timestamptz not null default now()
);
create table if not exists public.website_generations (
 id text primary key, workspace_id text not null references public.workspaces(id) on delete cascade, site_id text references public.website_sites(id), idempotency_key text not null unique,
 generation_type text not null, status text not null, provider text not null default 'deterministic', input_summary jsonb not null default '{}'::jsonb, error_code text,
 started_at timestamptz not null default now(), completed_at timestamptz, created_by uuid
);
create table if not exists public.website_validations (
 id text primary key, workspace_id text not null references public.workspaces(id) on delete cascade, site_id text not null references public.website_sites(id),
 site_version integer not null, result jsonb not null, ready boolean not null, created_by uuid, created_at timestamptz not null default now()
);
create table if not exists public.website_preview_tokens (
 id text primary key, workspace_id text not null references public.workspaces(id) on delete cascade, site_id text not null references public.website_sites(id),
 token_hash text not null unique, expires_at timestamptz not null, revoked_at timestamptz, created_by uuid, created_at timestamptz not null default now()
);
create table if not exists public.website_media (
 id text primary key, workspace_id text not null references public.workspaces(id) on delete cascade, site_id text not null references public.website_sites(id),
 storage_path text not null, public_path text, file_name text not null, mime_type text not null, size_bytes bigint not null, width integer, height integer,
 alt_text text, publishable boolean not null default false, archived_at timestamptz, created_by uuid, created_at timestamptz not null default now(), unique(workspace_id,storage_path)
);
create table if not exists public.website_domains (
 id text primary key, workspace_id text not null references public.workspaces(id) on delete cascade, site_id text not null references public.website_sites(id),
 hostname text not null unique, provider text, status text not null default 'verification_required', verification_token text, is_primary boolean not null default false,
 verified_at timestamptz, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.website_redirects (
 id text primary key, workspace_id text not null references public.workspaces(id) on delete cascade, site_id text not null references public.website_sites(id),
 from_path text not null, to_path text not null, status_code integer not null default 301, created_at timestamptz not null default now(), unique(site_id,from_path)
);
create table if not exists public.website_events (
 id text primary key, workspace_id text not null references public.workspaces(id) on delete cascade, site_id text, event_type text not null,
 resource_type text not null, resource_id text, actor_user_id uuid, metadata jsonb not null default '{}'::jsonb, idempotency_key text not null unique, created_at timestamptz not null default now()
);
create index if not exists website_sites_workspace_idx on public.website_sites(workspace_id,updated_at desc) where archived_at is null;
create index if not exists website_pages_site_order_idx on public.website_pages(site_id,menu_order) where archived_at is null;
create index if not exists website_publications_site_idx on public.website_publications(site_id,version_number desc);
create index if not exists website_submissions_site_idx on public.website_form_submissions(site_id,created_at desc);
create index if not exists website_events_workspace_idx on public.website_events(workspace_id,created_at desc);
do $$ declare t text; begin foreach t in array array['website_sites','website_themes','website_pages','website_revisions','website_publications','website_forms','website_form_submissions','website_generations','website_validations','website_preview_tokens','website_media','website_domains','website_redirects','website_events'] loop execute format('alter table public.%I enable row level security',t);execute format('revoke all on public.%I from anon, authenticated',t);execute format('grant all on public.%I to service_role',t);end loop; end $$;
create index if not exists workspace_members_user_idx on public.workspace_members(user_id,workspace_id);
create index if not exists onboarding_progress_workspace_idx on public.onboarding_progress(workspace_id);
create index if not exists workspace_modules_workspace_idx on public.workspace_modules(workspace_id,status);
create index if not exists provisioning_operations_workspace_idx on public.provisioning_operations(workspace_id,position);

alter table public.workspaces enable row level security;
alter table public.workspace_members enable row level security;
alter table public.onboarding_progress enable row level security;
alter table public.business_profiles enable row level security;
alter table public.workspace_packs enable row level security;
alter table public.workspace_modules enable row level security;
alter table public.workspace_goals enable row level security;
alter table public.workspace_initial_configs enable row level security;
alter table public.provisioning_operations enable row level security;
revoke all on table public.workspaces,public.workspace_members,public.onboarding_progress,public.business_profiles,public.workspace_packs,public.workspace_modules,public.workspace_goals,public.workspace_initial_configs,public.provisioning_operations from anon,authenticated;
grant select,insert,update,delete on table public.workspaces,public.workspace_members,public.onboarding_progress,public.business_profiles,public.workspace_packs,public.workspace_modules,public.workspace_goals,public.workspace_initial_configs,public.provisioning_operations to service_role;

-- Qualifyr OS Step 8: Content Studio (server-only Data API surface)
create table if not exists public.content_brand_voices (
  id text primary key, workspace_id text not null references public.workspaces(id) on delete cascade, locale text not null default 'fr-FR', tone text not null default 'sobre', formality text not null default 'simple', address_mode text not null default 'vous', vocabulary jsonb not null default '[]', forbidden_terms jsonb not null default '[]', cta_rules jsonb not null default '[]', channel_rules jsonb not null default '{}', examples jsonb not null default '[]', version integer not null default 1 check(version>0), updated_by uuid, created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(workspace_id,locale)
);
create table if not exists public.content_campaigns (
  id text primary key, workspace_id text not null references public.workspaces(id) on delete cascade, name text not null, objective text not null, audience text, channels jsonb not null default '[]', status text not null default 'draft' check(status in('draft','active','completed','cancelled','archived')), start_at timestamptz, end_at timestamptz, owner_user_id uuid not null, results jsonb not null default '{}', created_at timestamptz not null default now(), updated_at timestamptz not null default now(), archived_at timestamptz
);
create table if not exists public.content_series (
  id text primary key, workspace_id text not null references public.workspaces(id) on delete cascade, name text not null, objective text not null, cadence text, formats jsonb not null default '[]', channels jsonb not null default '[]', source_ids jsonb not null default '[]', item_count integer not null default 0 check(item_count between 0 and 100), status text not null default 'draft' check(status in('draft','active','paused','completed','archived')), configuration jsonb not null default '{}', owner_user_id uuid not null, created_at timestamptz not null default now(), updated_at timestamptz not null default now(), archived_at timestamptz
);
create table if not exists public.content_ideas (
  id text primary key, workspace_id text not null references public.workspaces(id) on delete cascade, title text not null, angle text not null, objective text not null, recommended_channels jsonb not null default '[]', recommended_formats jsonb not null default '[]', source_ids jsonb not null default '[]', reason text, effort text, reuse text, status text not null default 'idea' check(status in('idea','used','dismissed','archived')), owner_user_id uuid not null, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.content_items (
  id text primary key, workspace_id text not null references public.workspaces(id) on delete cascade, type text not null, channel text not null, title text not null, status text not null default 'draft' check(status in('idea','draft','needs_review','approved','scheduled','publishing','published','failed','cancelled','archived')), objective text not null, audience text, locale text not null default 'fr-FR', tone text not null default 'sobre', owner_user_id uuid not null, campaign_id text references public.content_campaigns(id) on delete set null, series_id text references public.content_series(id) on delete set null, source_type text, parent_content_id text references public.content_items(id) on delete set null, current_version_id text, version integer not null default 1 check(version>0), approved_at timestamptz, published_at timestamptz, created_at timestamptz not null default now(), updated_at timestamptz not null default now(), archived_at timestamptz
);
create table if not exists public.content_versions (
  id text primary key, workspace_id text not null references public.workspaces(id) on delete cascade, content_item_id text not null references public.content_items(id) on delete cascade, version integer not null check(version>0), structured_content jsonb not null, source_ids jsonb not null default '[]', facts_used jsonb not null default '[]', claims_to_review jsonb not null default '[]', warnings jsonb not null default '[]', created_by uuid not null, checksum text not null, created_at timestamptz not null default now(), unique(content_item_id,version)
);
alter table public.content_items drop constraint if exists content_items_current_version_fk;
alter table public.content_items add constraint content_items_current_version_fk foreign key(current_version_id) references public.content_versions(id) on delete set null;
create table if not exists public.content_source_links (
  id text primary key, workspace_id text not null references public.workspaces(id) on delete cascade, content_item_id text not null references public.content_items(id) on delete cascade, source_type text not null, source_id text not null, usage_type text not null default 'fact', verified boolean not null default false, publishable boolean not null default false, permission_reference text, created_at timestamptz not null default now(), unique(content_item_id,source_type,source_id)
);
create table if not exists public.content_approvals (
  id text primary key, workspace_id text not null references public.workspaces(id) on delete cascade, content_item_id text not null references public.content_items(id) on delete cascade, version_id text not null references public.content_versions(id) on delete cascade, reviewer_user_id uuid, reviewer_role text, status text not null default 'requested' check(status in('requested','approved','changes_requested','rejected','cancelled')), comment text, requested_at timestamptz not null default now(), decided_at timestamptz
);
create table if not exists public.content_calendar_entries (
  id text primary key, workspace_id text not null references public.workspaces(id) on delete cascade, content_item_id text not null references public.content_items(id) on delete cascade, version_id text not null references public.content_versions(id) on delete restrict, channel_connection_id text, scheduled_at timestamptz not null, timezone text not null default 'Europe/Paris', status text not null default 'scheduled' check(status in('scheduled','publishing','published','failed','cancelled')), attempt_count integer not null default 0 check(attempt_count between 0 and 20), idempotency_key text not null unique, last_error_code text, last_error_summary text, next_attempt_at timestamptz, locked_at timestamptz, created_by uuid not null, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.content_publications (
  id text primary key, workspace_id text not null references public.workspaces(id) on delete cascade, content_item_id text not null references public.content_items(id) on delete cascade, version_id text not null references public.content_versions(id) on delete restrict, calendar_entry_id text references public.content_calendar_entries(id) on delete set null, channel text not null, provider text not null, provider_content_id text, public_url text, status text not null check(status in('publishing','published','failed','exported')), idempotency_key text not null unique, metadata jsonb not null default '{}', published_at timestamptz, created_at timestamptz not null default now()
);
create table if not exists public.content_metrics (
  id text primary key, workspace_id text not null references public.workspaces(id) on delete cascade, publication_id text not null references public.content_publications(id) on delete cascade, metric_type text not null, value numeric not null check(value>=0), period_start timestamptz, period_end timestamptz, fetched_at timestamptz not null default now(), source text not null, attribution_method text, unique(publication_id,metric_type,period_start,period_end)
);
create table if not exists public.content_media_rights (
  id text primary key, workspace_id text not null references public.workspaces(id) on delete cascade, media_id text not null references public.website_media(id) on delete cascade, owner_name text, license text, permission_status text not null default 'unknown' check(permission_status in('unknown','granted','not_required','denied','expired')), allowed_channels jsonb not null default '[]', recognizable_people boolean not null default false, expires_at timestamptz, status text not null default 'needs_review' check(status in('needs_review','valid','blocked','expired')), evidence_reference text, created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(workspace_id,media_id)
);
create table if not exists public.content_media_links (
  id text primary key, workspace_id text not null references public.workspaces(id) on delete cascade, content_item_id text not null references public.content_items(id) on delete cascade, media_id text not null references public.website_media(id) on delete restrict, usage text not null default 'primary', sort_order integer not null default 0, alt_text text, rights_status text not null default 'needs_review', created_at timestamptz not null default now(), unique(content_item_id,media_id,usage)
);
create table if not exists public.content_generation_runs (
  id text primary key, workspace_id text not null references public.workspaces(id) on delete cascade, content_item_id text references public.content_items(id) on delete set null, provider text not null, model text not null, generation_type text not null, status text not null check(status in('running','completed','failed','rejected')), usage jsonb not null default '{}', cost_minor integer, duration_ms integer, correlation_id text not null, error_code text, error_summary text, started_at timestamptz not null default now(), finished_at timestamptz
);
create table if not exists public.content_events (
  id text primary key, workspace_id text not null references public.workspaces(id) on delete cascade, event_type text not null, resource_type text not null, resource_id text not null, actor_user_id uuid, version integer, correlation_id text not null, causation_id text, metadata jsonb not null default '{}', created_at timestamptz not null default now(), unique(workspace_id,event_type,correlation_id)
);
create table if not exists public.content_usage (
  id text primary key, workspace_id text not null references public.workspaces(id) on delete cascade, period_key text not null, generations integer not null default 0 check(generations>=0), variants integer not null default 0 check(variants>=0), adaptations integer not null default 0 check(adaptations>=0), publications integer not null default 0 check(publications>=0), syncs integer not null default 0 check(syncs>=0), updated_at timestamptz not null default now(), unique(workspace_id,period_key)
);
create index if not exists content_items_workspace_status_idx on public.content_items(workspace_id,status,updated_at desc);
create index if not exists content_items_calendar_idx on public.content_items(workspace_id,channel,status,created_at desc);
create index if not exists content_versions_item_idx on public.content_versions(content_item_id,version desc);
create index if not exists content_calendar_due_idx on public.content_calendar_entries(status,scheduled_at) where status in('scheduled','failed');
create index if not exists content_ideas_workspace_idx on public.content_ideas(workspace_id,status,created_at desc);
create index if not exists content_events_workspace_idx on public.content_events(workspace_id,created_at desc);
create index if not exists content_metrics_publication_idx on public.content_metrics(publication_id,fetched_at desc);
do $$ declare t text; begin foreach t in array array['content_brand_voices','content_campaigns','content_series','content_ideas','content_items','content_versions','content_source_links','content_approvals','content_calendar_entries','content_publications','content_metrics','content_media_rights','content_media_links','content_generation_runs','content_events','content_usage'] loop execute format('alter table public.%I enable row level security',t);execute format('revoke all on public.%I from anon,authenticated',t);execute format('grant select,insert,update,delete on public.%I to service_role',t);end loop; end $$;
-- QUALIFYR BRAIN (Step 9) ----------------------------------------------------
-- Server-only tables. The browser never receives direct table grants; every
-- operation is authorized again by /api/brain and scoped by workspace_id.
create table if not exists public.brain_sessions (id text primary key,workspace_id text not null references public.workspaces(id) on delete cascade,user_id uuid not null references auth.users(id) on delete cascade,title text not null check(char_length(title)<=120),status text not null default 'active' check(status in('active','closed')),mode text not null default 'understand' check(mode in('understand','prepare','act')),created_at timestamptz not null default now(),updated_at timestamptz not null default now(),archived_at timestamptz);
create table if not exists public.brain_messages (id text primary key,workspace_id text not null references public.workspaces(id) on delete cascade,session_id text not null references public.brain_sessions(id) on delete cascade,user_id uuid references auth.users(id) on delete set null,role text not null check(role in('user','assistant','system')),content text not null check(char_length(content)<=12000),metadata jsonb not null default '{}'::jsonb,created_at timestamptz not null default now());
create table if not exists public.business_memory_facts (id text primary key,workspace_id text not null references public.workspaces(id) on delete cascade,fact_key text not null,fact_value jsonb not null,source_type text not null,source_id text,confidence numeric(4,3) not null default 1 check(confidence between 0 and 1),confirmation_status text not null default 'unconfirmed' check(confirmation_status in('unconfirmed','confirmed','corrected','archived')),confirmed_by uuid references auth.users(id),confirmed_at timestamptz,archived_at timestamptz,created_at timestamptz not null default now(),updated_at timestamptz not null default now(),unique(workspace_id,fact_key));
create table if not exists public.brain_plans (id text primary key,workspace_id text not null references public.workspaces(id) on delete cascade,session_id text references public.brain_sessions(id) on delete set null,created_by uuid not null references auth.users(id),mode text not null check(mode in('prepare','act')),status text not null check(status in('pending_approval','approved','rejected','running','completed','partial','failed','cancelled')),title text not null,objective text not null,reason text not null,plan_json jsonb not null default '{}'::jsonb,created_at timestamptz not null default now(),updated_at timestamptz not null default now(),approved_at timestamptz,executed_at timestamptz);
create table if not exists public.brain_plan_steps (id text primary key,workspace_id text not null references public.workspaces(id) on delete cascade,plan_id text not null references public.brain_plans(id) on delete cascade,position integer not null check(position>0),tool_id text not null,label text not null,risk text not null check(risk in('read','draft','internal_write','external_write','destructive','financial')),approval_required boolean not null default true,status text not null default 'pending' check(status in('pending','approved','running','completed','blocked','failed','cancelled')),arguments jsonb not null default '{}'::jsonb,result jsonb,error_message text,created_at timestamptz not null default now(),updated_at timestamptz not null default now(),executed_at timestamptz,unique(plan_id,position));
create table if not exists public.brain_approvals (id text primary key,workspace_id text not null references public.workspaces(id) on delete cascade,plan_id text not null references public.brain_plans(id) on delete cascade,user_id uuid not null references auth.users(id),decision text not null check(decision in('approved','rejected')),scope text not null default 'all_steps' check(scope in('all_steps','selected_steps')),step_ids jsonb not null default '[]'::jsonb,reason text,created_at timestamptz not null default now(),unique(plan_id,user_id));
create table if not exists public.brain_runs (id text primary key,workspace_id text not null references public.workspaces(id) on delete cascade,plan_id text not null references public.brain_plans(id) on delete cascade,user_id uuid not null references auth.users(id),status text not null check(status in('queued','running','completed','partial','failed','cancelled')),idempotency_key text not null,result_summary jsonb not null default '{}'::jsonb,error_message text,created_at timestamptz not null default now(),started_at timestamptz,completed_at timestamptz,unique(workspace_id,idempotency_key));
create table if not exists public.brain_tool_runs (id text primary key,workspace_id text not null references public.workspaces(id) on delete cascade,brain_run_id text not null references public.brain_runs(id) on delete cascade,plan_step_id text not null references public.brain_plan_steps(id) on delete cascade,tool_id text not null,status text not null check(status in('running','completed','blocked','failed')),risk text not null,input_redacted jsonb not null default '{}'::jsonb,output_redacted jsonb not null default '{}'::jsonb,error_code text,duration_ms integer check(duration_ms>=0),created_at timestamptz not null default now());
create table if not exists public.brain_recommendations (id text primary key,workspace_id text not null references public.workspaces(id) on delete cascade,recommendation_key text not null,title text not null,reason text not null,priority integer not null default 1,status text not null default 'active' check(status in('active','dismissed','completed','expired')),action_view text,source_refs jsonb not null default '[]'::jsonb,created_at timestamptz not null default now(),dismissed_at timestamptz,completed_at timestamptz,unique(workspace_id,recommendation_key));
create table if not exists public.brain_daily_briefs (id text primary key,workspace_id text not null references public.workspaces(id) on delete cascade,user_id uuid not null references auth.users(id),brief_date date not null,summary jsonb not null,sources jsonb not null default '[]'::jsonb,created_at timestamptz not null default now(),unique(workspace_id,user_id,brief_date));
create table if not exists public.brain_model_runs (id text primary key,workspace_id text not null references public.workspaces(id) on delete cascade,user_id uuid references auth.users(id),purpose text not null,provider text,model text,input_tokens integer not null default 0,output_tokens integer not null default 0,estimated_cost_minor integer not null default 0,latency_ms integer,status text not null,metadata_redacted jsonb not null default '{}'::jsonb,created_at timestamptz not null default now());
create table if not exists public.brain_events (id text primary key,workspace_id text not null references public.workspaces(id) on delete cascade,user_id uuid references auth.users(id),event_type text not null,resource_type text not null,resource_id text not null,metadata jsonb not null default '{}'::jsonb,created_at timestamptz not null default now());
create index if not exists brain_sessions_workspace_user_idx on public.brain_sessions(workspace_id,user_id,updated_at desc) where archived_at is null;
create index if not exists brain_messages_session_idx on public.brain_messages(workspace_id,session_id,created_at);
create index if not exists brain_plans_workspace_status_idx on public.brain_plans(workspace_id,status,created_at desc);
create index if not exists brain_runs_workspace_created_idx on public.brain_runs(workspace_id,created_at desc);
create index if not exists brain_events_workspace_created_idx on public.brain_events(workspace_id,created_at desc);
do $$ declare t text; begin foreach t in array array['brain_sessions','brain_messages','business_memory_facts','brain_plans','brain_plan_steps','brain_approvals','brain_runs','brain_tool_runs','brain_recommendations','brain_daily_briefs','brain_model_runs','brain_events'] loop execute format('alter table public.%I enable row level security',t);execute format('revoke all on public.%I from anon, authenticated',t);execute format('grant all on public.%I to service_role',t);end loop; end $$;

-- Qualifyr Autopilot : consolidation additive après l'étape 9.
-- Ces tables n'envoient aucun message et ne publient aucun contenu.
create table if not exists public.workspace_configurations (
 id text primary key, workspace_id text not null references public.workspaces(id) on delete cascade,
 pack_id text not null, pack_version text not null, layers jsonb not null default '{}'::jsonb,
 effective_config jsonb not null default '{}'::jsonb, source_map jsonb not null default '{}'::jsonb,
 status text not null default 'active' check(status in('active','archived')), updated_at timestamptz not null default now()
);
create table if not exists public.configuration_overrides (
 id text primary key, workspace_id text not null references public.workspaces(id) on delete cascade,
 scope text not null check(scope in('workspace','user')), user_id uuid references auth.users(id) on delete cascade,
 path text not null, value jsonb not null, source text not null default 'user', created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
 unique(workspace_id,scope,user_id,path)
);
create table if not exists public.provisioning_plans (
 id text primary key, workspace_id text not null references public.workspaces(id) on delete cascade, user_id uuid not null references auth.users(id),
 pack_id text not null, pack_version text not null, checksum text not null, status text not null check(status in('draft','awaiting_confirmation','confirmed','running','completed','failed','cancelled')),
 plan jsonb not null, created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(workspace_id,checksum)
);
create table if not exists public.provisioning_runs (
 id text primary key, workspace_id text not null references public.workspaces(id) on delete cascade, plan_id text not null references public.provisioning_plans(id) on delete cascade,
 status text not null check(status in('pending','running','completed','failed','cancelled')), attempts integer not null default 0,
 error_code text, started_at timestamptz, completed_at timestamptz, updated_at timestamptz not null default now()
);
create table if not exists public.provisioning_step_runs (
 id text primary key, workspace_id text not null references public.workspaces(id) on delete cascade, run_id text not null references public.provisioning_runs(id) on delete cascade,
 step_key text not null, idempotency_key text not null unique, position integer not null, status text not null check(status in('pending','running','completed','failed','skipped')),
 attempts integer not null default 0, error_code text, error_message text, started_at timestamptz, completed_at timestamptz, updated_at timestamptz not null default now()
);
create table if not exists public.pack_installations (
 id text primary key, workspace_id text not null references public.workspaces(id) on delete cascade, pack_id text not null, pack_version text not null,
 readiness text not null check(readiness in('production_ready','beta','experimental')), status text not null check(status in('installed','upgrade_available','archived')),
 installed_by uuid references auth.users(id), installed_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(workspace_id,pack_id)
);
create table if not exists public.pack_upgrade_proposals (
 id text primary key, workspace_id text not null references public.workspaces(id) on delete cascade, pack_id text not null,
 from_version text not null, to_version text not null, diff jsonb not null, status text not null default 'proposed' check(status in('proposed','accepted','dismissed','applied')),
 created_at timestamptz not null default now(), decided_at timestamptz
);
create table if not exists public.workspace_forms (
 id text primary key, workspace_id text not null references public.workspaces(id) on delete cascade, form_key text not null, name text not null,
 status text not null default 'active' check(status in('active','inactive','archived')), schema jsonb not null default '{}'::jsonb,
 crm_destination boolean not null default true, consent_required boolean not null default true, updated_at timestamptz not null default now(), unique(workspace_id,form_key)
);
create table if not exists public.workspace_assistant_configs (
 id text primary key, workspace_id text not null references public.workspaces(id) on delete cascade, mode text not null default 'copilot',
 auto_reply boolean not null default false, external_actions boolean not null default false, status text not null default 'active',
 instructions jsonb not null default '{}'::jsonb, updated_at timestamptz not null default now(), unique(workspace_id)
);
create table if not exists public.workspace_automation_configs (
 id text primary key, workspace_id text not null references public.workspaces(id) on delete cascade, automation_key text not null, name text not null,
 kind text not null check(kind in('internal','external')), enabled boolean not null default false, external_action boolean not null default false,
 status text not null default 'active', config jsonb not null default '{}'::jsonb, updated_at timestamptz not null default now(), unique(workspace_id,automation_key),
 constraint external_automation_requires_disabled check(kind='internal' or enabled=false)
);
create table if not exists public.health_check_results (
 id text primary key, workspace_id text not null references public.workspaces(id) on delete cascade, check_id text not null, check_version integer not null,
 status text not null check(status in('operational','action_required','blocked','unavailable')), severity text not null,
 evidence jsonb not null default '{}'::jsonb, checked_at timestamptz not null default now(), unique(workspace_id,check_id,check_version)
);
create table if not exists public.system_test_runs (
 id text primary key, workspace_id text not null references public.workspaces(id) on delete cascade, user_id uuid not null references auth.users(id),
 mode text not null check(mode in('simulation','isolated_transaction')), status text not null check(status in('passed','blocked','failed')),
 steps jsonb not null default '[]'::jsonb, evidence jsonb not null default '{}'::jsonb, created_at timestamptz not null default now(), completed_at timestamptz
);
create table if not exists public.support_diagnostics (
 id text primary key, workspace_id text not null references public.workspaces(id) on delete cascade, user_id uuid not null references auth.users(id),
 snapshot jsonb not null, redacted boolean not null default true, created_at timestamptz not null default now()
);
create table if not exists public.activation_events (
 id text primary key, workspace_id text not null references public.workspaces(id) on delete cascade, user_id uuid references auth.users(id),
 event_name text not null, source text not null, metadata jsonb not null default '{}'::jsonb, created_at timestamptz not null default now()
);
create index if not exists provisioning_runs_workspace_idx on public.provisioning_runs(workspace_id,updated_at desc);
create index if not exists provisioning_steps_run_idx on public.provisioning_step_runs(run_id,position);
create index if not exists health_results_workspace_idx on public.health_check_results(workspace_id,checked_at desc);
create index if not exists activation_events_workspace_idx on public.activation_events(workspace_id,created_at desc);
do $$ declare t text; begin foreach t in array array['workspace_configurations','configuration_overrides','provisioning_plans','provisioning_runs','provisioning_step_runs','pack_installations','pack_upgrade_proposals','workspace_forms','workspace_assistant_configs','workspace_automation_configs','health_check_results','system_test_runs','support_diagnostics','activation_events'] loop execute format('alter table public.%I enable row level security',t);execute format('revoke all on public.%I from anon, authenticated',t);execute format('grant all on public.%I to service_role',t);end loop; end $$;
