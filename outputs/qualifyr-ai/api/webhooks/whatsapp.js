const crypto = require("crypto");
const { json, supabaseSelect, supabaseUpsert, supabaseRpc } = require("../_lib");
const { auditLog, correlationId, safeEqual } = require("../_security");
const { runCopilot } = require("../_copilot-engine");

async function rawBody(req) {
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > 1024 * 1024) throw Object.assign(new Error("REQUEST_TOO_LARGE"), { status: 413 });
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}
function validSignature(raw, signature = "") {
  if (!process.env.META_APP_SECRET) return false;
  const expected = `sha256=${crypto.createHmac("sha256", process.env.META_APP_SECRET).update(raw).digest("hex")}`;
  return signature.length === expected.length && crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}
async function resolveConnection(phoneNumberId) {
  if (!phoneNumberId) return null;
  const rows = (await supabaseSelect("connections", `provider=eq.whatsapp&status=in.(configured,connected)&settings->>phone_number_id=eq.${encodeURIComponent(phoneNumberId)}&select=id,workspace_id,provider,status,settings&limit=2`)).data || [];
  return rows.length === 1 ? rows[0] : null;
}

module.exports = async function handler(req, res) {
  const requestId = correlationId(req);
  res.setHeader("X-Correlation-ID", requestId);
  if (req.method === "GET") {
    const url = new URL(req.url, "http://localhost");
    if (url.searchParams.get("hub.mode") === "subscribe" && process.env.WHATSAPP_VERIFY_TOKEN && safeEqual(url.searchParams.get("hub.verify_token"), process.env.WHATSAPP_VERIFY_TOKEN)) {
      res.statusCode = 200; return res.end(url.searchParams.get("hub.challenge") || "");
    }
    return json(res, 403, { ok: false });
  }
  if (req.method !== "POST") return json(res, 405, { ok: false });
  try {
    const raw = await rawBody(req);
    if (!validSignature(raw, req.headers["x-hub-signature-256"])) return json(res, 401, { ok: false, error: "Signature Meta invalide." });
    const payload = JSON.parse(raw.toString("utf8") || "{}");
    const changes = payload.entry?.flatMap((entry) => entry.changes || []) || [];
    const messages = changes.flatMap((change) => change.value?.messages || []).filter(Boolean);
    for (const message of messages) {
      if (!message.id || !message.from) continue;
      const change = changes.find((item) => (item.value?.messages || []).some((candidate) => candidate.id === message.id));
      const phoneNumberId = change?.value?.metadata?.phone_number_id;
      const connection = await resolveConnection(phoneNumberId);
      if (!connection?.workspace_id) { auditLog("error", "whatsapp.webhook.unmapped", { correlationId: requestId, provider: "whatsapp", operation: "resolve_workspace", safeErrorCode: "CONNECTION_UNAVAILABLE" }); continue; }
      const claimed = await supabaseRpc("claim_webhook_receipt", { p_provider: "whatsapp", p_event_id: message.id, p_workspace_id: connection.workspace_id, p_payload_hash: crypto.createHash("sha256").update(raw).digest("hex") });
      if (claimed.data !== true) continue;
      const text = message.text?.body || message.image?.caption || `[${message.type || "message"}]`;
      const result = await runCopilot({ copilot: "WhatsApp IA", input: text, profession: "Autre", company: "Entreprise", context: { source_type: message.type } });
      await supabaseUpsert("messages", {
        id: message.id, workspace_id: connection.workspace_id, account_email: null, channel: "whatsapp",
        direction: "inbound", contact_ref: message.from, content: text.slice(0, 12000), status: "received", payload: { provider_message_type: message.type, phone_number_id: phoneNumberId }, created_at: new Date(Number(message.timestamp || Date.now() / 1000) * 1000).toISOString()
      });
      await supabaseUpsert("message_drafts", { id: `draft_${crypto.createHash("sha256").update(`${connection.workspace_id}:${message.id}`).digest("hex").slice(0,24)}`, workspace_id: connection.workspace_id, source_message_id: message.id, channel: "whatsapp", recipient_ref: message.from, body: result.customer_reply, status: "pending_approval", model_response_id: result.response_id || null, idempotency_key: `whatsapp-draft:${message.id}`, created_at: new Date().toISOString(), updated_at: new Date().toISOString() });
      if (result.quote_draft) {
        await supabaseUpsert("quotes", {
          id: `quote_${crypto.randomUUID()}`, workspace_id: connection.workspace_id, account_email: null,
          number: `DEV-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`, client_name: message.from,
          status: "Brouillon", currency: "EUR", vat_rate: result.quote_draft.vat_rate || 20, subtotal: 0, total: 0,
          lines: result.quote_draft.lines || [], source: "whatsapp", payload: { message_id: message.id, analysis: result }, created_at: new Date().toISOString(), updated_at: new Date().toISOString()
        });
      }
    }
    auditLog("info", "whatsapp.webhook.accepted", { correlationId: requestId, received: messages.length });
    return json(res, 200, { ok: true, received: messages.length });
  } catch (error) {
    auditLog("error", "whatsapp.webhook.failed", { correlationId: requestId, provider: "whatsapp", operation: "receive", safeErrorCode: error.status === 413 ? "PAYLOAD_TOO_LARGE" : "PROVIDER_EVENT_FAILED", status: Number(error.status || 500), retryable: Number(error.status || 500) >= 500 });
    return json(res, error.status === 413 ? 413 : 500, { ok: false, error: error.status === 413 ? "Requête trop volumineuse." : "Le message n’a pas pu être traité." });
  }
};

module.exports.validSignature = validSignature;
module.exports.resolveConnection = resolveConnection;
