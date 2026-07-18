const crypto = require("crypto");
const { badRequest, json, readBody, supabaseSelect, supabaseUpsert } = require("./_lib");

const cleanEmail = (value) => {
  const email = String(value || "").trim().toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : "";
};
const allowedStatuses = new Set(["Brouillon", "Envoye", "Relance", "Accepte", "Refuse", "Archive"]);

module.exports = async function handler(req, res) {
  try {
    const url = new URL(req.url, "http://localhost");
    if (req.method === "GET") {
      const email = cleanEmail(url.searchParams.get("email"));
      if (!email) return badRequest(res, "Une session client valide est necessaire.");
      const result = await supabaseSelect("quotes", `account_email=eq.${encodeURIComponent(email)}&select=*&order=updated_at.desc`);
      return json(res, 200, { ok: true, configured: !result.skipped, quotes: result.data || [] });
    }
    if (!["POST", "PATCH"].includes(req.method)) return json(res, 405, { ok: false, error: "Method not allowed" });
    const body = await readBody(req);
    const email = cleanEmail(body.email);
    if (!email) return badRequest(res, "Une session client valide est necessaire.");
    const now = new Date().toISOString();
    const id = String(body.id || `quote_${crypto.randomUUID()}`).slice(0, 100);
    const existingResult = await supabaseSelect("quotes", `id=eq.${encodeURIComponent(id)}&account_email=eq.${encodeURIComponent(email)}&select=*&limit=1`);
    const existing = existingResult.data?.[0] || {};
    if (req.method === "PATCH" && !existing.id) return json(res, 404, { ok: false, error: "Devis introuvable." });
    const lines = Array.isArray(body.lines) ? body.lines.slice(0, 50).map((line) => ({
      description: String(line.description || line[0] || "Prestation").slice(0, 240),
      quantity: Math.max(0, Number(line.quantity ?? line[1] ?? 1) || 0),
      unit_price: Math.max(0, Number(line.unit_price ?? line[2] ?? 0) || 0)
    })) : existing.lines || [];
    const row = {
      id, account_email: email,
      number: String(body.number || existing.number || `DEV-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`).slice(0, 60),
      client_name: String(body.client_name || body.client || existing.client_name || "Client a confirmer").slice(0, 160),
      client_email: cleanEmail(body.client_email || existing.client_email) || null,
      status: allowedStatuses.has(body.status) ? body.status : existing.status || "Brouillon",
      currency: "EUR", vat_rate: Math.max(0, Math.min(100, Number(body.vat_rate ?? body.vat ?? existing.vat_rate ?? 20))),
      lines, source: String(body.source || existing.source || "manual").slice(0, 40),
      payload: { ...(existing.payload || {}), ...(body.payload || {}) },
      created_at: existing.created_at || now, updated_at: now
    };
    row.subtotal = lines.reduce((sum, line) => sum + line.quantity * line.unit_price, 0);
    row.total = row.subtotal * (1 + row.vat_rate / 100);
    const saved = await supabaseUpsert("quotes", row);
    return json(res, 200, { ok: true, configured: !saved.skipped, quote: saved.data?.[0] || row });
  } catch (error) {
    return json(res, 500, { ok: false, error: "Le devis n'a pas pu etre enregistre.", details: error.message });
  }
};
