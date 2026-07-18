const { badRequest, json, readBody, supabaseSelect, supabaseUpsert } = require("./_lib");

const ALLOWED_ACTIONS = new Set(["configure", "test", "disconnect"]);
const ALLOWED_PROVIDERS = new Set([
  "google-calendar",
  "gmail",
  "google-drive",
  "whatsapp",
  "mollie",
  "google-business"
]);

function cleanEmail(value) {
  const email = String(value || "").trim().toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : "";
}

module.exports = async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const url = new URL(req.url, "http://localhost");
      const email = cleanEmail(url.searchParams.get("email"));
      if (!email) return badRequest(res, "Une session client valide est necessaire.");
      const result = await supabaseSelect(
        "connections",
        `account_email=eq.${encodeURIComponent(email)}&select=id,provider,status,settings,last_test_status,last_tested_at,updated_at&order=updated_at.desc`
      );
      return json(res, 200, { ok: true, configured: !result.skipped, connections: result.data || [] });
    }

    if (req.method !== "POST") {
      res.setHeader("Allow", "GET, POST");
      return json(res, 405, { ok: false, error: "Method not allowed" });
    }

    const body = await readBody(req);
    const email = cleanEmail(body.email);
    const provider = String(body.provider || "").trim();
    const action = String(body.action || "").trim();
    if (!email || !ALLOWED_PROVIDERS.has(provider) || !ALLOWED_ACTIONS.has(action)) {
      return badRequest(res, "Connexion, action ou compte invalide.");
    }

    const now = new Date().toISOString();
    const id = `${email}:${provider}`;
    const current = await supabaseSelect(
      "connections",
      `id=eq.${encodeURIComponent(id)}&select=*&limit=1`
    );
    const existing = current.data?.[0] || {};
    let status = existing.status || "not_connected";
    let lastTestStatus = existing.last_test_status || null;
    let lastTestedAt = existing.last_tested_at || null;
    let settings = existing.settings || {};

    if (action === "configure") {
      settings = { ...settings, ...(body.settings && typeof body.settings === "object" ? body.settings : {}) };
      status = "configured";
    }
    if (action === "test") {
      lastTestStatus = status === "configured" || status === "connected" ? "success" : "needs_configuration";
      lastTestedAt = now;
    }
    if (action === "disconnect") {
      status = "not_connected";
      settings = {};
      lastTestStatus = null;
      lastTestedAt = null;
    }

    const row = {
      id,
      account_email: email,
      provider,
      status,
      settings,
      last_test_status: lastTestStatus,
      last_tested_at: lastTestedAt,
      created_at: existing.created_at || now,
      updated_at: now
    };
    const saved = await supabaseUpsert("connections", row);
    return json(res, 200, { ok: true, configured: !saved.skipped, connection: saved.data?.[0] || row });
  } catch (error) {
    return json(res, 500, { ok: false, error: "La connexion n'a pas pu etre enregistree.", details: error.message });
  }
};
