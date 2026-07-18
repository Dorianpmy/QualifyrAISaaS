begin;
create extension if not exists pgtap;
select plan(8);

insert into auth.users(id,email) values
  ('10000000-0000-0000-0000-000000000001','privacy-a@example.test'),
  ('10000000-0000-0000-0000-000000000002','privacy-b@example.test')
on conflict(id) do nothing;
insert into public.workspaces(id,owner_user_id,name,status) values
  ('privacy_ws_a','10000000-0000-0000-0000-000000000001','Workspace A','active'),
  ('privacy_ws_b','10000000-0000-0000-0000-000000000002','Workspace B','active');
insert into public.workspace_members(id,workspace_id,user_id,role,status,invitation_status) values
  ('privacy_member_a','privacy_ws_a','10000000-0000-0000-0000-000000000001','owner','active','accepted'),
  ('privacy_member_b','privacy_ws_b','10000000-0000-0000-0000-000000000002','owner','active','accepted');
insert into public.crm_contacts(id,workspace_id,display_name,email,phone,status) values
  ('privacy_contact_a','privacy_ws_a','Alice','alice@example.test','+33111111111','prospect'),
  ('privacy_contact_b','privacy_ws_b','Bob','bob@example.test','+33222222222','prospect');
insert into public.privacy_requests(id,workspace_id,requested_by,request_type,status,validation_required,idempotency_key) values
  ('privacy_request_a','privacy_ws_a','10000000-0000-0000-0000-000000000001','workspace_deletion','processing',true,'privacy-idem-a');
insert into public.privacy_request_jobs(id,request_id,workspace_id,operation,status,idempotency_key) values
  ('privacy_job_a','privacy_request_a','privacy_ws_a','workspace_deletion','queued','privacy-job-idem-a');

select is((select count(*)::integer from public.claim_privacy_job('pgtap-worker')),1,'one queued job is claimed');
select is((select status from public.privacy_request_jobs where id='privacy_job_a'),'processing','claim marks the job processing');
select is((select attempts from public.privacy_request_jobs where id='privacy_job_a'),1,'claim increments attempts once');
select ok(public.privacy_delete_workspace('privacy_ws_a','privacy_request_a'),'approved processing request deletes workspace A');
select is((select count(*)::integer from public.workspaces where id='privacy_ws_a'),0,'workspace A is deleted');
select is((select count(*)::integer from public.crm_contacts where workspace_id='privacy_ws_a'),0,'workspace A contact is deleted by cascade');
select is((select count(*)::integer from public.crm_contacts where workspace_id='privacy_ws_b'),1,'workspace B contact is preserved');
select is((select count(*)::integer from public.privacy_requests where id='privacy_request_a'),1,'privacy audit request survives workspace deletion');

select * from finish();
rollback;
