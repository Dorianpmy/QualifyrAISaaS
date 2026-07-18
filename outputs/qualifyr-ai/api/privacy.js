const crypto = require("crypto");
const { json, readBody, supabasePatch, supabaseSelect, supabaseUpsert } = require("./_lib");
const { requireWorkspace } = require("./_auth");
const { auditLog, correlationId } = require("./_security");
const privacy = require("./_privacy-service");

const TYPES = new Set(["export", "correction", "contact_anonymization", "withdraw_consent", "delete_ai_memory", "revoke_connections", "workspace_deletion"]);
const stableId = (prefix, value) => `${prefix}_${crypto.createHash("sha256").update(String(value)).digest("hex").slice(0, 24)}`;
const publicRequest = (row = {}) => ({
  id: row.id, type: row.request_type, status: row.status, scope: row.scope || {}, validationRequired: Boolean(row.validation_required),
  createdAt: row.created_at, executedAt: row.executed_at || null, completedAt: row.completed_at || null,
  result: row.result || {}, errors: row.errors || [], correlationId: row.correlation_id || null
});

module.exports = async function handler(req, res) {
  const cid = correlationId(req);
  try {
    const context = await requireWorkspace(req);
    if (req.method === "GET") {
      const rows = (await supabaseSelect("privacy_requests", `workspace_id=eq.${encodeURIComponent(context.workspaceId)}&requested_by=eq.${context.user.id}&select=*&order=created_at.desc`)).data || [];
      return json(res, 200, { ok: true, requests: rows.map(publicRequest) });
    }
    if (req.method !== "POST") return json(res, 405, { ok: false, error: "Méthode non autorisée." });
    const body = await readBody(req), action = String(body.action || "request"), type = String(body.type || "");
    if (action === "download_export") {
      const exported = (await supabaseSelect("privacy_exports", `workspace_id=eq.${encodeURIComponent(context.workspaceId)}&requested_by=eq.${context.user.id}&id=eq.${encodeURIComponent(body.exportId)}&status=in.(available,downloaded)&expires_at=gt.${encodeURIComponent(new Date().toISOString())}&select=*&limit=1`)).data?.[0];
      if (!exported) return json(res, 404, { ok: false, error: "Export introuvable ou expiré." });
      await supabasePatch("privacy_exports", `id=eq.${exported.id}&workspace_id=eq.${context.workspaceId}`, { status: "downloaded", downloaded_at: new Date().toISOString() });
      return json(res, 200, { ok: true, export: { id: exported.id, createdAt: exported.created_at, expiresAt: exported.expires_at, data: exported.payload } });
    }
    if (action === "request") {
      if (!TYPES.has(type)) return json(res, 400, { ok: false, error: "Type de demande invalide." });
      const idem = String(req.headers?.["idempotency-key"] || body.idempotencyKey || "").slice(0, 120);
      if (!idem) return json(res, 400, { ok: false, error: "Une clé d’idempotence est requise." });
      const now = new Date().toISOString(), requestId = stableId("privacy", `${context.workspaceId}:${idem}`), jobId = stableId("privacy_job", requestId);
      const existing = (await supabaseSelect("privacy_requests", `workspace_id=eq.${encodeURIComponent(context.workspaceId)}&id=eq.${requestId}&requested_by=eq.${context.user.id}&select=*&limit=1`)).data?.[0];
      if (existing) return json(res, 200, { ok: true, idempotentReplay: true, request: publicRequest(existing) });
      const validationRequired = ["contact_anonymization", "workspace_deletion"].includes(type);
      const status = validationRequired ? "verification_required" : "approved";
      const requestRow = {
        id: requestId, workspace_id: context.workspaceId, requested_by: context.user.id, request_type: type,
        target_type: body.targetType || null, target_id: body.targetId || null, scope: body.scope && typeof body.scope === "object" ? body.scope : {},
        status, validation_required: validationRequired, correlation_id: cid, idempotency_key: `${context.workspaceId}:${idem}`,
        result: {}, errors: [], created_at: now, updated_at: now
      };
      const saved = await supabaseUpsert("privacy_requests", requestRow);
      const persisted = saved.data?.[0] || requestRow;
      if (!validationRequired) await supabaseUpsert("privacy_request_jobs", {
        id: jobId, request_id: requestId, workspace_id: context.workspaceId, operation: type, status: "queued",
        attempts: 0, idempotency_key: `${context.workspaceId}:${idem}`, correlation_id: cid, result: {}, created_at: now, updated_at: now
      });
      auditLog("info", "privacy.request.created", { correlationId: cid, operation: type, workspaceOpaqueId: context.workspaceId.slice(-8) });
      return json(res, 202, { ok: true, request: publicRequest(persisted) });
    }
    if (action === "approve") {
      if (!['owner', 'admin'].includes(context.member.role)) throw Object.assign(new Error("FORBIDDEN"), { status: 403, publicMessage: "Validation requise." });
      const request = (await supabaseSelect("privacy_requests", `workspace_id=eq.${encodeURIComponent(context.workspaceId)}&id=eq.${encodeURIComponent(body.requestId)}&status=eq.verification_required&select=*&limit=1`)).data?.[0];
      if (!request) return json(res, 404, { ok: false, error: "Demande à valider introuvable." });
      if (body.confirmation !== `DELETE ${context.workspaceId}`) return json(res, 400, { ok: false, error: "La confirmation explicite est incorrecte." });
      const now = new Date().toISOString(), jobId = stableId("privacy_job", request.id);
      await Promise.all([
        supabasePatch("privacy_requests", `workspace_id=eq.${context.workspaceId}&id=eq.${request.id}`, { status: "approved", approved_by: context.user.id, approved_at: now, updated_at: now }),
        supabaseUpsert("privacy_request_jobs", { id: jobId, request_id: request.id, workspace_id: context.workspaceId, operation: request.request_type, status: "queued", attempts: 0, idempotency_key: request.idempotency_key, correlation_id: request.correlation_id || cid, result: {}, created_at: now, updated_at: now })
      ]);
      return json(res, 202, { ok: true, request: { id: request.id, status: "queued" } });
    }
    if (action === "process") {
      return json(res, 409, { ok: false, error: "Cette demande est traitée par le worker sécurisé." });
    }
    return json(res, 400, { ok: false, error: "Action inconnue." });
  } catch (error) {
    auditLog("error", "privacy.request.failed", { correlationId: cid, errorCode: privacy.safeErrorCode(error) });
    return json(res, error.status || 500, { ok: false, error: error.publicMessage || "La demande n’a pas pu être traitée." });
  }
};

module.exports.publicRequest = publicRequest;
