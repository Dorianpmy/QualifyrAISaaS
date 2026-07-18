const crypto = require("crypto");
const { badRequest, json, readBody, supabaseInsert } = require("./_lib");
const { runCopilot } = require("./_copilot-engine");

const cleanEmail = (value) => {
  const email = String(value || "").trim().toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : "";
};

module.exports = async function handler(req, res) {
  if (req.method !== "POST") return json(res, 405, { ok: false, error: "Method not allowed" });
  try {
    const body = await readBody(req);
    const email = cleanEmail(body.email);
    const copilot = String(body.copilot || "").trim().slice(0, 120);
    const input = String(body.input || "").trim().slice(0, 12000);
    if (!email || !copilot || !input) return badRequest(res, "Compte, copilote et demande sont necessaires.");
    const result = await runCopilot({ copilot, input, profession: body.profession, company: body.company, context: body.context });
    const row = {
      id: `run_${crypto.randomUUID()}`,
      account_email: email,
      copilot,
      channel: String(body.channel || "test").slice(0, 40),
      status: "completed",
      input: { text: input, context: body.context || {} },
      output: result,
      created_at: new Date().toISOString()
    };
    await supabaseInsert("copilot_runs", row).catch(() => null);
    return json(res, 200, { ok: true, result, run: row });
  } catch (error) {
    return json(res, 500, { ok: false, error: "Le copilote n'a pas pu terminer son action.", details: error.message });
  }
};
