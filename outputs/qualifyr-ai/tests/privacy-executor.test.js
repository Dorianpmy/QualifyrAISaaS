const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const service = require("../api/_privacy-service");

function memoryStore(seed = {}) {
  const tables = Object.fromEntries(Object.entries(seed).map(([key, rows]) => [key, structuredClone(rows)]));
  const calls = { deleted: [], patched: [], upserted: [], storage: [], rpc: [] };
  const rows = (table) => tables[table] || (tables[table] = []);
  const value = (query, key) => {
    const match = String(query).match(new RegExp(`(?:^|&)${key}=eq\\.([^&]+)`));
    return match ? decodeURIComponent(match[1]) : null;
  };
  const matchQuery = (row, query) => {
    for (const key of ["id", "workspace_id", "request_id", "contact_id", "user_id", "status", "requested_by"]) {
      const expected = value(query, key);
      if (expected !== null && String(row[key]) !== expected) return false;
    }
    return true;
  };
  const store = {
    tables, calls,
    async select(table, query = "") { return { data: rows(table).filter((row) => matchQuery(row, query)).map((row) => structuredClone(row)) }; },
    async upsert(table, row) {
      calls.upserted.push({ table, row: structuredClone(row) });
      const index = rows(table).findIndex((existing) => existing.id === row.id);
      if (index >= 0) rows(table)[index] = { ...rows(table)[index], ...structuredClone(row) };
      else rows(table).push(structuredClone(row));
      return { data: [structuredClone(row)] };
    },
    async patch(table, query, patch) {
      calls.patched.push({ table, query, patch: structuredClone(patch) });
      const affected = rows(table).filter((row) => matchQuery(row, query));
      affected.forEach((row) => Object.assign(row, structuredClone(patch)));
      return { data: affected.map((row) => structuredClone(row)) };
    },
    async delete(table, query = "") {
      calls.deleted.push({ table, query });
      if (String(query).startsWith("expires_at=lt.")) return { data: [] };
      const removed = rows(table).filter((row) => matchQuery(row, query));
      tables[table] = rows(table).filter((row) => !matchQuery(row, query));
      return { data: removed };
    },
    async rpc(name, args) {
      calls.rpc.push({ name, args });
      if (name === "claim_privacy_job") {
        const job = rows("privacy_request_jobs").find((row) => ["queued", "failed"].includes(row.status));
        if (!job) return { data: [] };
        job.status = "processing"; job.attempts = Number(job.attempts || 0) + 1;
        return { data: [structuredClone(job)] };
      }
      if (name === "privacy_anonymize_contact") {
        const contact = rows("crm_contacts").find((row) => row.workspace_id === args.p_workspace_id && row.id === args.p_contact_id);
        if (!contact) return { data: { anonymized: false } };
        Object.assign(contact, { display_name: "Contact anonymisé", email: null, phone: null, short_note: null });
        tables.crm_documents = rows("crm_documents").filter((row) => row.contact_id !== args.p_contact_id);
        return { data: { anonymized: true } };
      }
      if (name === "privacy_delete_workspace") {
        for (const table of service.WORKSPACE_TABLES) tables[table] = rows(table).filter((row) => row.workspace_id !== args.p_workspace_id);
        tables.workspaces = rows("workspaces").filter((row) => row.id !== args.p_workspace_id);
        const request = rows("privacy_requests").find((row) => row.id === args.p_request_id);
        if (request) request.workspace_id = null;
        return { data: true };
      }
      if (name === "privacy_revoke_user_sessions") return { data: 1 };
      return { data: null };
    },
    async storageRemove(bucket, paths) { calls.storage.push({ bucket, paths }); return { data: paths }; },
    async authDeleteUser() { calls.authDeleted = true; return { data: true }; }
  };
  return store;
}

function request(type, extras = {}) {
  return { id: `request_${type}`, workspace_id: "ws_A", requested_by: "user_A", request_type: type, status: "approved", scope: {}, ...extras };
}

function job(type, extras = {}) {
  return { id: `job_${type}`, request_id: `request_${type}`, workspace_id: "ws_A", operation: type, status: "processing", attempts: 1, ...extras };
}

test("AI memory deletion verifies every AI table before completing", async () => {
  const req = request("delete_ai_memory"), currentJob = job("delete_ai_memory");
  const seed = { privacy_requests: [req], privacy_request_jobs: [currentJob] };
  service.AI_TABLES.forEach((table) => { seed[table] = [{ id: `${table}_1`, workspace_id: "ws_A" }, { id: `${table}_B`, workspace_id: "ws_B" }]; });
  const store = memoryStore(seed), result = await service.executeClaimedJob(store, currentJob);
  assert.equal(result.status, "completed");
  for (const table of service.AI_TABLES) assert.deepEqual(store.tables[table], [{ id: `${table}_B`, workspace_id: "ws_B" }]);
});

test("contact anonymization removes attached files and personal fields", async () => {
  const req = request("contact_anonymization", { target_id: "contact_A" }), currentJob = job("contact_anonymization");
  const store = memoryStore({ privacy_requests: [req], privacy_request_jobs: [currentJob], crm_contacts: [{ id: "contact_A", workspace_id: "ws_A", display_name: "Alice", email: "alice@example.test", phone: "+33000000000", short_note: "private" }], crm_documents: [{ id: "doc_A", workspace_id: "ws_A", contact_id: "contact_A", storage_path: "ws_A/private.pdf" }] });
  const result = await service.executeClaimedJob(store, currentJob);
  assert.equal(result.status, "completed");
  assert.deepEqual(store.calls.storage, [{ bucket: "workspace-files", paths: ["ws_A/private.pdf"] }]);
  assert.equal(store.tables.crm_contacts[0].email, null);
});

test("a transient failure is requeued and never reported completed", async () => {
  const req = request("correction", { target_type: "contact", target_id: "missing", scope: { patch: { display_name: "Correct" } } }), currentJob = job("correction", { attempts: 1 });
  const store = memoryStore({ privacy_requests: [req], privacy_request_jobs: [currentJob], crm_contacts: [] });
  const result = await service.executeClaimedJob(store, currentJob);
  assert.equal(result.status, "failed");
  assert.equal(store.tables.privacy_requests[0].status, "failed");
  assert.notEqual(store.tables.privacy_requests[0].status, "completed");
});

test("workspace deletion preserves workspace B and verifies no workspace A residue", async () => {
  const req = request("workspace_deletion"), currentJob = job("workspace_deletion");
  const seed = { privacy_requests: [req], privacy_request_jobs: [currentJob], workspaces: [{ id: "ws_A" }, { id: "ws_B" }], connections: [], crm_contacts: [{ id: "A", workspace_id: "ws_A" }, { id: "B", workspace_id: "ws_B" }], crm_documents: [], website_media: [], privacy_exports: [], workspace_members: [{ id: "member_B", workspace_id: "ws_B", user_id: "user_B", status: "active" }] };
  const store = memoryStore(seed), result = await service.executeClaimedJob(store, currentJob);
  assert.equal(result.status, "completed");
  assert.deepEqual(store.tables.workspaces, [{ id: "ws_B" }]);
  assert.deepEqual(store.tables.crm_contacts, [{ id: "B", workspace_id: "ws_B" }]);
});

test("golden path queues, atomically claims, executes and persists a real export result", async () => {
  const req = request("export", { id: "request_export", status: "approved" });
  const currentJob = job("export", { id: "job_export", request_id: req.id, status: "queued", attempts: 0 });
  const store = memoryStore({ privacy_requests: [req], privacy_request_jobs: [currentJob], crm_contacts: [{ id: "A", workspace_id: "ws_A", display_name: "Alice" }] });
  const result = await service.processNext(store);
  assert.equal(result.processed, true);
  assert.equal(result.status, "completed");
  assert.equal(store.tables.privacy_exports.length, 1);
  assert.equal(store.tables.privacy_requests[0].status, "completed");
  assert.equal(store.calls.rpc.filter((call) => call.name === "claim_privacy_job").length, 1);
});

test("exports contain personal data but never provider credentials or tokens", () => {
  const value = service.sanitizeExportValue({ email: "alice@example.test", settings: { access_token_encrypted: "secret" }, refresh_token: "secret", nested: { api_key: "secret", city: "Paris" } });
  assert.equal(value.email, "alice@example.test");
  assert.equal(value.settings, undefined);
  assert.equal(value.refresh_token, undefined);
  assert.equal(value.nested.api_key, undefined);
  assert.equal(value.nested.city, "Paris");
});

test("migration keeps audit records, claims with SKIP LOCKED and restricts privileged functions", () => {
  const migration = fs.readFileSync(path.join(__dirname, "../supabase/migrations/20260718234500_privacy_executor.sql"), "utf8");
  assert.match(migration, /on delete set null not valid/i);
  assert.match(migration, /for update skip locked/i);
  assert.match(migration, /status='processing'/i);
  assert.match(migration, /revoke all on function public\.privacy_delete_workspace/i);
  assert.match(migration, /grant execute on function public\.privacy_delete_workspace\(text,text\) to service_role/i);
  assert.doesNotMatch(migration, /drop table/i);
});
