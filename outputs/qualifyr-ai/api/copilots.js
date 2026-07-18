const { badRequest, json, readBody, supabaseSelect, supabaseUpsert } = require("./_lib");
const ACTION_STATUS = { prepare: "Configuration preparee", test: "Test reussi", activate: "Actif" };
const cleanEmail = (value) => {
  const email = String(value || "").trim().toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : "";
};
const cleanText = (value, fallback = "") => String(value || fallback).trim().slice(0, 120);

module.exports = async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const url = new URL(req.url, "http://localhost");
      const email = cleanEmail(url.searchParams.get("email"));
      if (!email) return badRequest(res, "Une session client valide est necessaire.");
      const result = await supabaseSelect("copilot_installations", `account_email=eq.${encodeURIComponent(email)}&select=*&order=updated_at.desc`);
      return json(res, 200, { ok: true, configured: !result.skipped, installations: result.data || [] });
    }
    if (req.method !== "POST") {
      res.setHeader("Allow", "GET, POST");
      return json(res, 405, { ok: false, error: "Method not allowed" });
    }
    const body = await readBody(req);
    const email = cleanEmail(body.email);
    const copilot = cleanText(body.copilot);
    const action = cleanText(body.action);
    if (!email || !copilot || !ACTION_STATUS[action]) return badRequest(res, "Compte, copilote ou etape invalide.");
    const id = `${email}:${copilot.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
    const current = await supabaseSelect("copilot_installations", `id=eq.${encodeURIComponent(id)}&select=*&limit=1`);
    const existing = current.data?.[0] || {};
    const now = new Date().toISOString();
    const row = {
      id,
      account_email: email,
      company: cleanText(body.company, existing.company || "Entreprise"),
      profession: cleanText(body.profession, existing.profession || "Autre"),
      copilot,
      status: ACTION_STATUS[action],
      plan: cleanText(body.plan, existing.plan || "Copilote metier"),
      payload: { ...(existing.payload || {}), ...(body.payload || {}), last_action: action, [`${action}_at`]: now },
      created_at: existing.created_at || now,
      updated_at: now
    };
    const saved = await supabaseUpsert("copilot_installations", row);
    return json(res, 200, { ok: true, configured: !saved.skipped, installation: saved.data?.[0] || row });
  } catch (error) {
    return json(res, 500, { ok: false, error: "L'installation n'a pas pu etre enregistree.", details: error.message });
  }
};
