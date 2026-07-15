const PLAN_PRICES = {
  Essentiel: { value: "79.00", label: "Essentiel" },
  Pro: { value: "149.00", label: "Pro" },
  Equipe: { value: "299.00", label: "Equipe" },
  Scale: { value: "299.00", label: "Equipe" }
};

function json(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(payload));
}

function badRequest(res, message, details = {}) {
  return json(res, 400, { ok: false, error: message, ...details });
}

function methodNotAllowed(res) {
  res.setHeader("Allow", "POST");
  return json(res, 405, { ok: false, error: "Method not allowed" });
}

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString("utf8");
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function appUrl(req) {
  const configured = process.env.APP_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (configured) return configured.startsWith("http") ? configured : `https://${configured}`;
  const host = req.headers["x-forwarded-host"] || req.headers.host || "qualifyr-ai.vercel.app";
  const proto = req.headers["x-forwarded-proto"] || "https";
  return `${proto}://${host}`;
}

function amountForPlan(planName = "Pro") {
  return PLAN_PRICES[planName] || PLAN_PRICES.Pro;
}

function publicLead(lead = {}) {
  return {
    id: lead.id || `lead_${Date.now()}`,
    type: lead.type || "Paiement",
    status: lead.status || "Paiement a finaliser",
    plan: lead.plan || "Pro",
    company: lead.company || "Entreprise",
    name: lead.name || "Client Qualifyr",
    email: String(lead.email || "").trim().toLowerCase(),
    profession: lead.profession || "Plombier",
    createdAt: lead.createdAt || new Date().toISOString()
  };
}

async function createSupabaseLead(lead) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return { skipped: true, reason: "Supabase is not configured" };

  const response = await fetch(`${url.replace(/\/$/, "")}/rest/v1/leads`, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: "return=representation"
    },
    body: JSON.stringify(lead)
  });

  const text = await response.text();
  if (!response.ok) {
    throw new Error(`Supabase lead insert failed: ${response.status} ${text}`);
  }

  try {
    return { skipped: false, data: JSON.parse(text) };
  } catch {
    return { skipped: false, data: text };
  }
}

module.exports = {
  amountForPlan,
  appUrl,
  badRequest,
  createSupabaseLead,
  json,
  methodNotAllowed,
  publicLead,
  readBody
};
