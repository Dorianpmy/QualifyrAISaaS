const { badRequest, json, readBody, supabasePatch, supabaseSelect, supabaseUpsert } = require("./_lib");
const { requireWorkspace } = require("./_auth");
const { auditLog, correlationId } = require("./_security");
const crypto = require("crypto");

const ALLOWED_ACTIONS = new Set(["configure", "test", "disconnect"]);
const ALLOWED_PROVIDERS = new Set(["google-calendar", "gmail", "google-drive", "whatsapp", "mollie", "google-business"]);
const SECRET_NAMES = /settings|token|secret|credential|api.?key|authorization|headers|payload/i;

function publicConnection(row = {}) {
  return {
    id: row.public_id || (row.id ? `connection_${crypto.createHash("sha256").update(String(row.id)).digest("hex").slice(0,16)}` : null),
    provider: row.provider || null,
    type: row.type || "oauth",
    displayName: row.display_name || row.provider || "Connexion",
    status: row.status || "not_connected",
    capabilities: Array.isArray(row.capabilities) ? row.capabilities : [],
    connectedAt: row.connected_at || null,
    verifiedAt: row.last_test_status === "verified" ? row.last_tested_at || null : null,
    lastTestedAt: row.last_tested_at || null,
    lastSyncAt: row.last_sync_at || null,
    errorCode: row.safe_error_code || null,
    reconnectRequired: Boolean(row.reconnect_required || row.status === "revocation_pending")
  };
}

function assertSafeDto(value) {
  const serialized = JSON.stringify(value);
  if (Object.keys(value || {}).some((key) => SECRET_NAMES.test(key)) || /accessToken|refreshToken|clientSecret|webhookSecret|apiKey/i.test(serialized)) throw new Error("UNSAFE_CONNECTION_DTO");
  return value;
}

function tokenFrom(row) {
  const settings = row.settings && typeof row.settings === "object" ? row.settings : {};
  if (settings.access_token_encrypted) {
    try {
      const [iv, tag, encrypted] = String(settings.access_token_encrypted).split(".");
      const material = process.env.CONNECTION_ENCRYPTION_KEY || process.env.OAUTH_STATE_SECRET || process.env.SUPABASE_SECRET_KEY || "";
      if (!material) return "";
      const decipher = crypto.createDecipheriv("aes-256-gcm", crypto.createHash("sha256").update(material).digest(), Buffer.from(iv, "base64url"));
      decipher.setAuthTag(Buffer.from(tag, "base64url"));
      return Buffer.concat([decipher.update(Buffer.from(encrypted, "base64url")), decipher.final()]).toString("utf8");
    } catch { return ""; }
  }
  return String(settings.access_token || settings.accessToken || "");
}

const adapters = {
  "google-calendar": {
    async test(row) { const token = tokenFrom(row); if (!token) return { status: "not_configured" }; const response = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", { headers: { Authorization: `Bearer ${token}` } }); return response.ok ? { status: "verified" } : { status: "failed", errorCode: `HTTP_${response.status}` }; },
    async revoke(row) { const token = tokenFrom(row); if (!token) return { status: "revoked" }; const response = await fetch(`https://oauth2.googleapis.com/revoke?token=${encodeURIComponent(token)}`, { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" } }); if (!response.ok) throw Object.assign(new Error("PROVIDER_REVOCATION_FAILED"), { retryable: response.status >= 500 }); return { status: "revoked" }; }
  },
  gmail: null,
  "google-drive": null,
  "google-business": null,
  whatsapp: { async test(row) { const token = tokenFrom(row), accountId = row.settings?.business_account_id; if (!token || !accountId) return { status: "not_configured" }; const response = await fetch(`https://graph.facebook.com/v21.0/${encodeURIComponent(accountId)}?fields=id`, { headers: { Authorization: `Bearer ${token}` } }); return response.ok ? { status: "verified" } : { status: "failed", errorCode: `HTTP_${response.status}` }; }, revoke: null },
  mollie: { async test(row) { const token = tokenFrom(row); if (!token) return { status: "not_configured" }; const response = await fetch("https://api.mollie.com/v2/profiles/me", { headers: { Authorization: `Bearer ${token}` } }); return response.ok ? { status: "verified" } : { status: "failed", errorCode: `HTTP_${response.status}` }; }, revoke: null }
};
adapters.gmail = adapters["google-calendar"];
adapters["google-drive"] = adapters["google-calendar"];
adapters["google-business"] = adapters["google-calendar"];

async function providerTest(provider, row) {
  const adapter = adapters[provider];
  if (!adapter?.test) return { status: "provider_not_supported" };
  return adapter.test(row);
}

async function providerRevoke(provider, row) {
  const adapter = adapters[provider];
  if (!adapter?.revoke) return { status: "provider_not_supported" };
  return adapter.revoke(row);
}

module.exports = async function handler(req, res) {
  const cid = correlationId(req);
  try {
    const context = await requireWorkspace(req);
    if (req.method === "GET") {
      const result = await supabaseSelect("connections", `workspace_id=eq.${encodeURIComponent(context.workspaceId)}&select=*&order=updated_at.desc`);
      return json(res, 200, { ok: true, configured: !result.skipped, connections: (result.data || []).map((row) => assertSafeDto(publicConnection(row))) });
    }
    if (req.method !== "POST") { res.setHeader("Allow", "GET, POST"); return json(res, 405, { ok: false, error: "Method not allowed" }); }
    if (!['owner','admin'].includes(context.member.role)) throw Object.assign(new Error("FORBIDDEN"), { status: 403, publicMessage: "Vous n’avez pas la permission de gérer cette connexion." });
    const body = await readBody(req), provider = String(body.provider || "").trim(), action = String(body.action || "").trim();
    if (!ALLOWED_PROVIDERS.has(provider) || !ALLOWED_ACTIONS.has(action)) return badRequest(res, "Connexion ou action invalide.");
    const id = `${context.workspaceId}:${provider}`, now = new Date().toISOString();
    const existing = (await supabaseSelect("connections", `workspace_id=eq.${encodeURIComponent(context.workspaceId)}&id=eq.${encodeURIComponent(id)}&select=*&limit=1`)).data?.[0] || {};
    let patch = {};
    if (action === "configure") {
      const incoming = body.settings && typeof body.settings === "object" ? body.settings : {};
      const allowed = Object.fromEntries(Object.entries(incoming).filter(([key]) => ["business_account_id","phone_number_id","display_name"].includes(key)));
      const nextSettings = { ...(existing.settings || {}), ...allowed };
      const hasCredential = Boolean(nextSettings.access_token_encrypted);
      patch = { settings: nextSettings, status: hasCredential ? "configured" : "not_connected", reconnect_required: !hasCredential, safe_error_code: hasCredential ? null : "PROVIDER_AUTH_REQUIRED" };
    } else if (action === "test") {
      const tested = await providerTest(provider, existing);
      patch = { last_test_status: tested.status, last_tested_at: now, safe_error_code: tested.errorCode || null, status: tested.status === "verified" ? "connected" : existing.status || "configured" };
    } else {
      try {
        const revoked = await providerRevoke(provider, existing);
        patch = { settings: {}, status: "not_connected", last_test_status: null, reconnect_required: false, safe_error_code: revoked.status === "provider_not_supported" ? "REVOKE_AT_PROVIDER_IF_NEEDED" : null, revoked_at: now };
      } catch (error) {
        patch = { settings: {}, status: "revocation_pending", last_test_status: null, reconnect_required: true, safe_error_code: "REVOCATION_PENDING", revocation_attempted_at: now };
        await supabaseUpsert("connection_revocation_jobs", { id: `revoke_${crypto.createHash("sha256").update(id).digest("hex").slice(0,24)}`, workspace_id: context.workspaceId, connection_id: id, provider, status: "queued", attempts: 1, run_after: new Date(Date.now() + 60000).toISOString(), created_at: now, updated_at: now });
      }
    }
    const row = { ...existing, ...patch, id, workspace_id: context.workspaceId, account_email: String(context.user.email || "").toLowerCase(), provider, created_at: existing.created_at || now, updated_at: now };
    const saved = await supabaseUpsert("connections", row);
    auditLog("info", `connection.${action}`, { correlationId: cid, provider, operation: action, status: row.status, workspaceOpaqueId: context.workspaceId.slice(-8) });
    return json(res, 200, { ok: true, configured: !saved.skipped, connection: assertSafeDto(publicConnection(saved.data?.[0] || row)) });
  } catch (error) {
    return json(res, error.status || 500, { ok: false, error: error.publicMessage || "La connexion n'a pas pu etre enregistree." });
  }
};

module.exports.publicConnection = publicConnection;
module.exports.providerTest = providerTest;
module.exports.providerRevoke = providerRevoke;
module.exports.adapters = adapters;
