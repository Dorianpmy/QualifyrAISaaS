const crypto = require("crypto");
const { badRequest, json, readBody, supabaseSelect, supabaseUpsert } = require("./_lib");
const { requireWorkspace } = require("./_auth");

const CATALOG = new Set(["whatsapp", "devis", "planning", "email", "relance", "facturation", "avis", "reseaux", "crm", "documents", "plumber", "electrician", "mason", "carpenter", "pool", "heating", "garage", "cleaning", "landscaper", "restaurant", "dentist", "real-estate"]);
const dependencyFor = (copilotId) => ({ whatsapp: "automations", devis: "quotes", planning: "booking", email: "automations", relance: "automations", facturation: "invoices", avis: "reviews", reseaux: "social-content", documents: "files" }[copilotId] || "crm");
const clean = (value) => String(value || "").trim().toLowerCase().replace(/[^a-z0-9-]+/g, "-").slice(0, 80);
const publicInstallation = (row = {}) => ({ id: row.id, copilotId: row.copilot_id, status: row.status || "not_installed", dependenciesValid: row.dependencies_valid !== false, entitlementValid: row.entitlement_valid !== false, errorCode: row.safe_error_code || null, installedAt: row.installed_at || null, updatedAt: row.updated_at || null });

async function entitlement(workspaceId) {
  const row = (await supabaseSelect("workspace_entitlements", `workspace_id=eq.${encodeURIComponent(workspaceId)}&status=eq.active&select=id&limit=1`)).data?.[0];
  return Boolean(row);
}

module.exports = async function handler(req, res) {
  try {
    const context = await requireWorkspace(req);
    if (req.method === "GET") {
      const result = await supabaseSelect("copilot_installations", `workspace_id=eq.${encodeURIComponent(context.workspaceId)}&select=*&order=updated_at.desc`);
      return json(res, 200, { ok: true, installations: (result.data || []).map(publicInstallation) });
    }
    if (req.method !== "POST") { res.setHeader("Allow", "GET, POST"); return json(res, 405, { ok: false, error: "Method not allowed" }); }
    if (!['owner','admin'].includes(context.member.role)) throw Object.assign(new Error("FORBIDDEN"), { status: 403, publicMessage: "Vous n’avez pas la permission d’installer ce copilote." });
    const body = await readBody(req), copilotId = clean(body.copilotId || body.copilot), action = clean(body.action || "install");
    if (!CATALOG.has(copilotId) || !["install", "retry", "uninstall"].includes(action)) return badRequest(res, "Copilote ou action invalide.");
    const idempotencyKey = String(req.headers?.["idempotency-key"] || body.idempotencyKey || "").slice(0, 120);
    if (!idempotencyKey) return badRequest(res, "Une clé d’idempotence est requise.");
    const id = `install_${crypto.createHash("sha256").update(`${context.workspaceId}:${copilotId}`).digest("hex").slice(0,24)}`;
    const existing = (await supabaseSelect("copilot_installations", `workspace_id=eq.${encodeURIComponent(context.workspaceId)}&id=eq.${id}&select=*&limit=1`)).data?.[0] || {};
    if (existing.last_idempotency_key === idempotencyKey) return json(res, 200, { ok: true, installation: publicInstallation(existing), idempotent: true });
    const entitled = await entitlement(context.workspaceId), dependency = dependencyFor(copilotId), module = (await supabaseSelect("workspace_modules", `workspace_id=eq.${encodeURIComponent(context.workspaceId)}&module_id=eq.${encodeURIComponent(dependency)}&status=eq.enabled&select=id&limit=1`)).data?.[0];
    const now = new Date().toISOString();
    const status = action === "uninstall" ? "not_installed" : !entitled ? "unavailable" : !module ? "failed" : "installed";
    const row = { ...existing, id, workspace_id: context.workspaceId, account_email: String(context.user.email || "").toLowerCase(), copilot_id: copilotId, copilot: copilotId, status, dependencies_valid: Boolean(module), entitlement_valid: entitled, safe_error_code: !entitled ? "ENTITLEMENT_REQUIRED" : !module ? "DEPENDENCY_MISSING" : null, last_idempotency_key: idempotencyKey, installed_at: status === "installed" ? existing.installed_at || now : null, created_at: existing.created_at || now, updated_at: now };
    const saved = await supabaseUpsert("copilot_installations", row);
    return json(res, status === "installed" || status === "not_installed" ? 200 : 409, { ok: status === "installed" || status === "not_installed", installation: publicInstallation(saved.data?.[0] || row) });
  } catch (error) { return json(res, error.status || 500, { ok: false, error: error.publicMessage || "L'installation n'a pas pu etre enregistree." }); }
};

module.exports.publicInstallation = publicInstallation;
