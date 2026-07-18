const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const connections = require("../api/connections");
const { buildModelContext } = require("../api/_copilot-engine");

test("connection DTO cannot expose settings or credentials", () => {
  const dto = connections.publicConnection({ id: "c1", provider: "whatsapp", status: "connected", settings: { access_token: "secret" }, last_test_status: "verified", last_tested_at: "2026-01-01" });
  const text = JSON.stringify(dto);
  assert.doesNotMatch(text, /settings|access.?token|refresh.?token|client.?secret|webhook.?secret|api.?key|secret/i);
  assert.equal(dto.status, "connected");
});

test("provider test really calls the adapter and reports verified", async () => {
  const before = connections.adapters.whatsapp;
  let called = 0;
  connections.adapters.whatsapp = { async test() { called++; return { status: "verified" }; } };
  const result = await connections.providerTest("whatsapp", {});
  assert.equal(called, 1);
  assert.equal(result.status, "verified");
  connections.adapters.whatsapp = before;
});

test("unsupported provider test never claims success", async () => {
  const result = await connections.providerTest("unknown", {});
  assert.equal(result.status, "provider_not_supported");
});

test("AI context is allowlisted, bounded and redacts personal data", () => {
  const context = buildModelContext("task", { status: "open", email: "victim@example.com", token: "top-secret", next_action: "Call +33 6 12 34 56 78", unrelated: "private", tasks: Array.from({ length: 100 }, (_, index) => ({ status: "open", title: `secret ${index}` })) });
  const serialized = JSON.stringify(context);
  assert.equal(context.status, "open");
  assert.doesNotMatch(serialized, /victim@example|top-secret|unrelated|private|secret 99/);
  assert.match(serialized, /\[PHONE\]/);
  assert.ok(serialized.length < 2000);
});

test("WhatsApp implementation creates an approval draft and has no auto-send path", () => {
  const source = fs.readFileSync(path.join(__dirname, "../api/webhooks/whatsapp.js"), "utf8");
  assert.match(source, /message_drafts/);
  assert.match(source, /pending_approval/);
  assert.doesNotMatch(source, /WHATSAPP_AUTO_REPLY|sendWhatsApp\(/);
  assert.doesNotMatch(source, /WHATSAPP_ACCOUNT_EMAIL/);
});

test("frontend installation waits for persisted server status", () => {
  const source = fs.readFileSync(path.join(__dirname, "../app.js"), "utf8");
  assert.match(source, /payload\.installation\?\.status === "installed"/);
  assert.doesNotMatch(source, /copilot\.installed = true/);
});

test("follow-up migration is additive and provides idempotent webhook claiming", () => {
  const migration = fs.readFileSync(path.join(__dirname, "../supabase/migrations/20260718220000_security_findings_followup.sql"), "utf8");
  assert.match(migration, /create or replace function public\.claim_webhook_receipt/);
  assert.match(migration, /on conflict\(provider,provider_event_id\) do nothing/);
  assert.match(migration, /create table if not exists public\.privacy_request_jobs/);
  assert.doesNotMatch(migration, /drop table|truncate table|delete from/i);
});

test("CRM service validates every supported foreign reference with workspace filters", () => {
  const source = fs.readFileSync(path.join(__dirname, "../api/_crm-service.js"), "utf8");
  for (const field of ["contactId","organizationId","opportunityId","pipelineId","stageId","taskId","ownerId","userId","formId","conversationId","documentId","tagId"]) assert.match(source, new RegExp(field));
  assert.match(source, /workspace_id=eq/);
  assert.match(source, /RESOURCE_NOT_FOUND/);
});

test("CRM resource validation refuses a resource from workspace B", async () => {
  const libPath = require.resolve("../api/_lib");
  const servicePath = require.resolve("../api/_crm-service");
  const originalLib = require.cache[libPath];
  require.cache[libPath] = { id: libPath, filename: libPath, loaded: true, exports: { supabaseSelect: async (_table, query) => ({ data: query.includes("workspace_id=eq.ws_A") && query.includes("id=eq.contact_A") ? [{ id: "contact_A", workspace_id: "ws_A" }] : [] }), supabaseUpsert: async () => ({ data: [] }) } };
  delete require.cache[servicePath];
  const service = require(servicePath);
  await assert.rejects(() => service.validateResourceReferences({ wid: "ws_A" }, { contactId: "contact_B" }, ["contactId"]), /RESOURCE_NOT_FOUND/);
  const accepted = await service.validateResourceReferences({ wid: "ws_A" }, { contactId: "contact_A" }, ["contactId"]);
  assert.equal(accepted.contact_id, "contact_A");
  delete require.cache[servicePath];
  if (originalLib) require.cache[libPath] = originalLib; else delete require.cache[libPath];
});

test("workspace resolution accepts only active accepted memberships", () => {
  const source = fs.readFileSync(path.join(__dirname, "../api/_auth.js"), "utf8");
  assert.match(source, /candidate\.status \|\| "active"/);
  assert.match(source, /candidate\.invitation_status \|\| "accepted"/);
  assert.match(source, /requestedWorkspace/);
});
