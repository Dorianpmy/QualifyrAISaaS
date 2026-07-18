const crypto = require("crypto");
const { json, supabaseInsert, supabaseUpsert } = require("../_lib");
const { runCopilot } = require("../_copilot-engine");

async function rawBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return Buffer.concat(chunks);
}
function validSignature(raw, signature = "") {
  if (!process.env.META_APP_SECRET) return process.env.NODE_ENV !== "production";
  const expected = `sha256=${crypto.createHmac("sha256", process.env.META_APP_SECRET).update(raw).digest("hex")}`;
  return signature.length === expected.length && crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}
async function sendWhatsApp(to, text, phoneNumberId) {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phone = phoneNumberId || process.env.WHATSAPP_PHONE_NUMBER_ID;
  if (!token || !phone || !text) return { skipped: true };
  const response = await fetch(`https://graph.facebook.com/v21.0/${phone}/messages`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ messaging_product: "whatsapp", recipient_type: "individual", to, type: "text", text: { preview_url: false, body: text.slice(0, 4000) } })
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error?.message || "Envoi WhatsApp refuse par Meta.");
  return payload;
}

module.exports = async function handler(req, res) {
  if (req.method === "GET") {
    const url = new URL(req.url, "http://localhost");
    if (url.searchParams.get("hub.mode") === "subscribe" && url.searchParams.get("hub.verify_token") === process.env.WHATSAPP_VERIFY_TOKEN) {
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
    const metadata = changes[0]?.value?.metadata || {};
    for (const message of messages) {
      const text = message.text?.body || message.image?.caption || `[${message.type || "message"}]`;
      const result = await runCopilot({ copilot: "WhatsApp IA", input: text, profession: "Autre", company: "Entreprise", context: { from: message.from, type: message.type } });
      await supabaseUpsert("messages", {
        id: message.id, account_email: process.env.WHATSAPP_ACCOUNT_EMAIL || "whatsapp@qualifyr.local", channel: "whatsapp",
        direction: "inbound", contact_ref: message.from, content: text, status: "received", payload: { raw: message, analysis: result }, created_at: new Date(Number(message.timestamp || Date.now() / 1000) * 1000).toISOString()
      }).catch(() => null);
      if (result.quote_draft) {
        await supabaseInsert("quotes", {
          id: `quote_${crypto.randomUUID()}`, account_email: process.env.WHATSAPP_ACCOUNT_EMAIL || "whatsapp@qualifyr.local",
          number: `DEV-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`, client_name: message.from,
          status: "Brouillon", currency: "EUR", vat_rate: result.quote_draft.vat_rate || 20, subtotal: 0, total: 0,
          lines: result.quote_draft.lines || [], source: "whatsapp", payload: { message_id: message.id, analysis: result }, created_at: new Date().toISOString(), updated_at: new Date().toISOString()
        }).catch(() => null);
      }
      if (process.env.WHATSAPP_AUTO_REPLY === "true") await sendWhatsApp(message.from, result.customer_reply, metadata.phone_number_id);
    }
    return json(res, 200, { ok: true, received: messages.length });
  } catch (error) {
    return json(res, 500, { ok: false, error: error.message });
  }
};
