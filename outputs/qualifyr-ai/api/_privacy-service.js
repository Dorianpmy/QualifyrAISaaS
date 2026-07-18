const crypto = require("crypto");
const lib = require("./_lib");
const { providerRevoke } = require("./connections");

const MAX_ATTEMPTS = 5;
const AI_TABLES = [
  "brain_tool_runs", "brain_approvals", "brain_plan_steps", "brain_runs", "brain_plans",
  "brain_messages", "brain_sessions", "brain_recommendations", "brain_daily_briefs",
  "brain_model_runs", "brain_events", "business_memory_facts"
];
const WORKSPACE_TABLES = [
  "activation_events", "business_memory_facts", "business_profiles", "brain_approvals", "brain_daily_briefs",
  "brain_events", "brain_messages", "brain_model_runs", "brain_plan_steps", "brain_plans", "brain_recommendations",
  "brain_runs", "brain_sessions", "brain_tool_runs", "configuration_overrides", "connections", "content_approvals",
  "content_brand_voices", "content_calendar_entries", "content_campaigns", "content_events", "content_generation_runs",
  "content_ideas", "content_items", "content_media_links", "content_media_rights", "content_metrics", "content_publications",
  "content_series", "content_source_links", "content_usage", "content_versions", "copilot_installations", "crm_activities",
  "crm_contacts", "crm_custom_fields", "crm_custom_values", "crm_documents", "crm_duplicate_candidates",
  "crm_entity_tags", "crm_import_errors", "crm_imports", "crm_notes", "crm_opportunities", "crm_opportunity_contacts",
  "crm_organization_contacts", "crm_organizations", "crm_outbox_events", "crm_pipeline_stages", "crm_pipelines",
  "crm_saved_views", "crm_tags", "crm_tasks", "dashboard_preferences", "health_check_results", "message_drafts",
  "messages", "onboarding_progress", "pack_installations", "pack_upgrade_proposals", "privacy_exports",
  "provisioning_operations", "provisioning_plans", "provisioning_runs", "provisioning_step_runs", "quotes",
  "security_audit_events", "support_diagnostics", "system_test_runs", "website_domains", "website_events", "website_forms",
  "website_form_submissions", "website_generations", "website_media", "website_pages", "website_preview_tokens",
  "website_publications", "website_redirects", "website_revisions", "website_sites", "website_themes", "website_validations",
  "workspace_activities", "workspace_assistant_configs", "workspace_automation_configs", "workspace_configurations",
  "workspace_consents", "workspace_entitlements", "workspace_forms", "workspace_goals", "workspace_initial_configs",
  "workspace_members", "workspace_modules", "workspace_packs", "workspace_recommendations"
];
const EXPORT_TABLES = WORKSPACE_TABLES.filter((table) => !["privacy_exports", "security_audit_events"].includes(table));
const CONTACT_PATCH_FIELDS = new Set(["first_name", "last_name", "display_name", "email", "phone", "city", "postal_code", "short_note"]);
const PROFILE_PATCH_FIELDS = new Set(["company_name", "manager_name", "description", "city", "postal_code", "service_area", "phone", "email", "website"]);
const EXPORT_SECRET_KEY = /(^|_)(token|secret|password|credential|authorization|cookie|api_key|encryption_key|private_key)($|_)/i;

const stableId = (prefix, value) => `${prefix}_${crypto.createHash("sha256").update(String(value)).digest("hex").slice(0, 24)}`;
const delayFor = (attempts) => Math.min(3600, 30 * (2 ** Math.max(0, attempts - 1)));
const query = (workspaceId, extra = "") => `workspace_id=eq.${encodeURIComponent(workspaceId)}${extra}`;

function safeErrorCode(error) {
  const candidate = String(error?.code || error?.message || "PRIVACY_EXECUTION_FAILED").toUpperCase().replace(/[^A-Z0-9_]/g, "_").slice(0, 80);
  return candidate || "PRIVACY_EXECUTION_FAILED";
}

function sanitizeExportValue(value, key = "") {
  if (EXPORT_SECRET_KEY.test(key) || key === "settings") return undefined;
  if (Array.isArray(value)) return value.map((item) => sanitizeExportValue(item)).filter((item) => item !== undefined);
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([childKey, child]) => [childKey, sanitizeExportValue(child, childKey)]).filter(([, child]) => child !== undefined));
  return value;
}

function createStore(overrides = {}) {
  return {
    select: lib.supabaseSelect,
    upsert: lib.supabaseUpsert,
    patch: lib.supabasePatch,
    delete: lib.supabaseDelete,
    rpc: lib.supabaseRpc,
    storageRemove: lib.supabaseStorageRemove,
    authDeleteUser: lib.supabaseAuthDeleteUser,
    ...overrides
  };
}

async function countRows(store, table, workspaceId, extra = "") {
  const result = await store.select(table, `${query(workspaceId, extra)}&select=id`);
  return (result.data || []).length;
}

async function verifyNoWorkspaceResidue(store, workspaceId) {
  const residue = {};
  for (const table of WORKSPACE_TABLES) {
    const count = await countRows(store, table, workspaceId);
    if (count) residue[table] = count;
  }
  const workspace = await store.select("workspaces", `id=eq.${encodeURIComponent(workspaceId)}&select=id`);
  if ((workspace.data || []).length) residue.workspaces = workspace.data.length;
  return residue;
}

async function exportWorkspace(store, request) {
  const payload = { schemaVersion: 1, workspaceId: request.workspace_id, generatedAt: new Date().toISOString(), tables: {} };
  for (const table of EXPORT_TABLES) {
    const rows = await store.select(table, `${query(request.workspace_id)}&select=*`);
    payload.tables[table] = sanitizeExportValue(rows.data || []);
  }
  const id = stableId("privacy_export", request.id);
  await store.upsert("privacy_exports", {
    id, request_id: request.id, workspace_id: request.workspace_id, requested_by: request.requested_by,
    payload, status: "available", expires_at: new Date(Date.now() + 7 * 86400000).toISOString(), created_at: new Date().toISOString()
  });
  return { exportId: id, tableCount: EXPORT_TABLES.length, expiresInDays: 7 };
}

async function correctResource(store, request) {
  const scope = request.scope || {};
  const patches = scope.patch && typeof scope.patch === "object" ? scope.patch : {};
  const config = request.target_type === "contact"
    ? { table: "crm_contacts", allowed: CONTACT_PATCH_FIELDS }
    : request.target_type === "business_profile"
      ? { table: "business_profiles", allowed: PROFILE_PATCH_FIELDS }
      : null;
  if (!config || !request.target_id) throw Object.assign(new Error("CORRECTION_TARGET_UNSUPPORTED"), { permanent: true });
  const patch = Object.fromEntries(Object.entries(patches).filter(([key]) => config.allowed.has(key)));
  if (!Object.keys(patch).length) throw Object.assign(new Error("CORRECTION_PATCH_EMPTY"), { permanent: true });
  patch.updated_at = new Date().toISOString();
  const result = await store.patch(config.table, `${query(request.workspace_id)}&id=eq.${encodeURIComponent(request.target_id)}`, patch);
  if (!(result.data || []).length) throw Object.assign(new Error("CORRECTION_TARGET_NOT_FOUND"), { permanent: true });
  return { targetType: request.target_type, targetId: request.target_id, correctedFields: Object.keys(patch).filter((key) => key !== "updated_at") };
}

async function anonymizeContact(store, request) {
  if (!request.target_id) throw Object.assign(new Error("CONTACT_TARGET_REQUIRED"), { permanent: true });
  const documents = (await store.select("crm_documents", `${query(request.workspace_id)}&contact_id=eq.${encodeURIComponent(request.target_id)}&select=storage_path`)).data || [];
  const paths = documents.map((row) => row.storage_path).filter(Boolean);
  if (paths.length) await store.storageRemove("workspace-files", paths);
  const marker = stableId("anonymous", `${request.workspace_id}:${request.target_id}`);
  const result = await store.rpc("privacy_anonymize_contact", { p_workspace_id: request.workspace_id, p_contact_id: request.target_id, p_marker: marker });
  if (!result.data?.anonymized) throw Object.assign(new Error("CONTACT_NOT_FOUND"), { permanent: true });
  const rows = await store.select("crm_contacts", `${query(request.workspace_id)}&id=eq.${encodeURIComponent(request.target_id)}&select=id,email,phone,display_name,short_note`);
  const contact = rows.data?.[0];
  if (!contact || contact.email || contact.phone || contact.short_note || contact.display_name !== "Contact anonymisé") throw new Error("CONTACT_RESIDUE_DETECTED");
  return { targetId: request.target_id, anonymized: true, marker, storageObjectsDeleted: paths.length };
}

async function deleteAiMemory(store, request) {
  for (const table of AI_TABLES) await store.delete(table, query(request.workspace_id));
  const residue = {};
  for (const table of AI_TABLES) {
    const count = await countRows(store, table, request.workspace_id);
    if (count) residue[table] = count;
  }
  if (Object.keys(residue).length) throw Object.assign(new Error("AI_MEMORY_RESIDUE_DETECTED"), { result: { residue } });
  return { deletedScopes: AI_TABLES, residue: {} };
}

async function withdrawConsent(store, request) {
  const now = new Date().toISOString();
  const id = stableId("consent", `${request.workspace_id}:${request.requested_by}`);
  await store.upsert("workspace_consents", { id, workspace_id: request.workspace_id, user_id: request.requested_by, status: "withdrawn", withdrawn_at: now, updated_at: now });
  const rows = await store.select("workspace_consents", `${query(request.workspace_id)}&id=eq.${id}&status=eq.withdrawn&select=id,status`);
  if (!(rows.data || []).length) throw new Error("CONSENT_WITHDRAWAL_NOT_PERSISTED");
  return { consentId: id, status: "withdrawn" };
}

async function revokeConnections(store, request) {
  const rows = (await store.select("connections", `${query(request.workspace_id)}&select=*`)).data || [];
  const pending = [], revoked = [];
  for (const connection of rows) {
    let remoteStatus = "provider_not_supported";
    try { remoteStatus = (await providerRevoke(connection.provider, connection)).status; }
    catch { remoteStatus = "retry_required"; }
    const now = new Date().toISOString();
    await store.patch("connections", `${query(request.workspace_id)}&id=eq.${encodeURIComponent(connection.id)}`, {
      settings: {}, status: remoteStatus === "revoked" ? "not_connected" : "revocation_pending", reconnect_required: remoteStatus !== "revoked",
      safe_error_code: remoteStatus === "revoked" ? null : "REMOTE_REVOCATION_PENDING", revoked_at: remoteStatus === "revoked" ? now : null, updated_at: now
    });
    if (remoteStatus === "revoked") revoked.push(connection.id);
    else {
      pending.push(connection.id);
      await store.upsert("connection_revocation_jobs", {
        id: stableId("revoke", connection.id), workspace_id: request.workspace_id, connection_id: connection.id,
        provider: connection.provider, status: "queued", attempts: 0, run_after: now, safe_error_code: "REMOTE_REVOCATION_PENDING", created_at: now, updated_at: now
      });
    }
  }
  const secrets = (await store.select("connections", `${query(request.workspace_id)}&settings=not.eq.%7B%7D&select=id`)).data || [];
  if (secrets.length) throw Object.assign(new Error("LOCAL_CONNECTION_SECRET_RESIDUE"), { result: { connectionIds: secrets.map((row) => row.id) } });
  return { revoked, pending, partial: pending.length > 0 };
}

async function removeStorage(store, workspaceId) {
  const documents = (await store.select("crm_documents", `${query(workspaceId)}&select=storage_path`)).data || [];
  const media = (await store.select("website_media", `${query(workspaceId)}&select=storage_path`)).data || [];
  const paths = [...documents, ...media].map((row) => row.storage_path).filter(Boolean);
  if (paths.length) await store.storageRemove("workspace-files", paths);
  return paths.length;
}

async function deleteWorkspace(store, request) {
  const revokeResult = await revokeConnections(store, request);
  const storageObjectsDeleted = await removeStorage(store, request.workspace_id);
  await store.rpc("privacy_revoke_user_sessions", { p_user_id: request.requested_by });
  await store.delete("privacy_exports", query(request.workspace_id));
  await store.rpc("privacy_delete_workspace", { p_workspace_id: request.workspace_id, p_request_id: request.id });
  const residue = await verifyNoWorkspaceResidue(store, request.workspace_id);
  if (Object.keys(residue).length) return { partial: true, residue, pendingRevocations: revokeResult.pending, storageObjectsDeleted };
  if (request.scope?.deleteAccount === true) {
    const memberships = (await store.select("workspace_members", `user_id=eq.${encodeURIComponent(request.requested_by)}&status=eq.active&select=id`)).data || [];
    if (!memberships.length) await store.authDeleteUser(request.requested_by);
  }
  return { partial: revokeResult.pending.length > 0, residue: {}, pendingRevocations: revokeResult.pending, storageObjectsDeleted };
}

async function runOperation(store, request) {
  if (request.request_type === "export") return exportWorkspace(store, request);
  if (request.request_type === "correction") return correctResource(store, request);
  if (request.request_type === "contact_anonymization") return anonymizeContact(store, request);
  if (request.request_type === "withdraw_consent") return withdrawConsent(store, request);
  if (request.request_type === "delete_ai_memory") return deleteAiMemory(store, request);
  if (request.request_type === "revoke_connections") return revokeConnections(store, request);
  if (request.request_type === "workspace_deletion") return deleteWorkspace(store, request);
  throw Object.assign(new Error("PRIVACY_OPERATION_UNSUPPORTED"), { permanent: true });
}

async function executeClaimedJob(store, job) {
  const request = (await store.select("privacy_requests", `id=eq.${encodeURIComponent(job.request_id)}&select=*&limit=1`)).data?.[0];
  if (!request) throw Object.assign(new Error("PRIVACY_REQUEST_NOT_FOUND"), { permanent: true });
  const now = new Date().toISOString();
  await store.patch("privacy_requests", `id=eq.${request.id}&status=in.(approved,queued,processing,failed)`, { status: "processing", started_at: request.started_at || now, updated_at: now });
  try {
    const result = await runOperation(store, request);
    const status = result.partial ? "partially_completed" : "completed";
    await Promise.all([
      store.patch("privacy_request_jobs", `id=eq.${job.id}`, { status, result, safe_error_code: null, completed_at: now, updated_at: now }),
      store.patch("privacy_requests", `id=eq.${request.id}`, { status, result, errors: result.partial ? [{ code: "RESIDUAL_EXTERNAL_WORK" }] : [], executed_at: now, completed_at: now, updated_at: now })
    ]);
    return { requestId: request.id, status, result };
  } catch (error) {
    const attempts = Number(job.attempts || 1), exhausted = error.permanent || attempts >= MAX_ATTEMPTS;
    const safeCode = safeErrorCode(error), next = new Date(Date.now() + delayFor(attempts) * 1000).toISOString();
    await Promise.all([
      store.patch("privacy_request_jobs", `id=eq.${job.id}`, { status: exhausted ? "failed" : "queued", safe_error_code: safeCode, result: error.result || {}, run_after: next, completed_at: exhausted ? now : null, updated_at: now }),
      store.patch("privacy_requests", `id=eq.${request.id}`, { status: exhausted ? "failed" : "queued", errors: [{ code: safeCode, retryable: !exhausted }], updated_at: now })
    ]);
    return { requestId: request.id, status: exhausted ? "failed" : "queued", errorCode: safeCode };
  }
}

async function processNext(store = createStore()) {
  await store.delete("privacy_exports", `expires_at=lt.${encodeURIComponent(new Date().toISOString())}&status=in.(available,downloaded,expired)`);
  const claimed = await store.rpc("claim_privacy_job", { p_worker_id: stableId("worker", crypto.randomUUID()) });
  const job = Array.isArray(claimed.data) ? claimed.data[0] : claimed.data;
  if (!job?.id) return { processed: false };
  return { processed: true, ...(await executeClaimedJob(store, job)) };
}

module.exports = { AI_TABLES, EXPORT_TABLES, MAX_ATTEMPTS, WORKSPACE_TABLES, createStore, executeClaimedJob, processNext, runOperation, safeErrorCode, sanitizeExportValue, verifyNoWorkspaceResidue };
