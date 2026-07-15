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
    created_at: lead.created_at || lead.createdAt || new Date().toISOString()
  };
}

function supabaseConfig() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return { configured: Boolean(url && key), url: url?.replace(/\/$/, ""), key };
}

async function supabaseInsert(table, row) {
  const config = supabaseConfig();
  if (!config.configured) return { skipped: true, reason: "Supabase is not configured" };

  const response = await fetch(`${config.url}/rest/v1/${table}`, {
    method: "POST",
    headers: {
      apikey: config.key,
      Authorization: `Bearer ${config.key}`,
      "Content-Type": "application/json",
      Prefer: "return=representation"
    },
    body: JSON.stringify(row)
  });

  const text = await response.text();
  if (!response.ok) {
    throw new Error(`Supabase insert failed on ${table}: ${response.status} ${text}`);
  }

  try {
    return { skipped: false, data: JSON.parse(text) };
  } catch {
    return { skipped: false, data: text };
  }
}

function normalizeLead(lead) {
  return {
    id: lead.id,
    type: lead.type,
    status: lead.status,
    plan: lead.plan,
    company: lead.company,
    name: lead.name,
    email: lead.email,
    phone: lead.phone || null,
    profession: lead.profession,
    payment_id: lead.payment_id || null,
    amount: lead.amount || null,
    payload: lead.payload || {},
    created_at: lead.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
}

async function createSupabaseLead(lead) {
  return supabaseInsert("leads", normalizeLead(lead));
}

async function createSupabaseAccount(account) {
  return supabaseInsert("accounts", {
    id: account.id || `account_${Date.now()}`,
    role: account.role || "client",
    status: account.status || "Actif",
    company: account.company || "Entreprise",
    name: account.name || "Client Qualifyr",
    email: String(account.email || "").trim().toLowerCase(),
    profession: account.profession || "Plombier",
    plan: account.plan || "Pro",
    payload: account.payload || {},
    created_at: account.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString()
  });
}

async function createSupabasePayment(payment) {
  return supabaseInsert("payments", {
    id: payment.id,
    lead_id: payment.lead_id || null,
    status: payment.status,
    provider: "mollie",
    amount: payment.amount,
    currency: payment.currency || "EUR",
    plan: payment.plan || "Pro",
    email: String(payment.email || "").trim().toLowerCase(),
    company: payment.company || "Entreprise",
    payload: payment.payload || {},
    created_at: payment.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString()
  });
}

async function createSupabaseSubscription(subscription) {
  return supabaseInsert("subscriptions", {
    id: subscription.id || `subscription_${Date.now()}`,
    account_email: String(subscription.account_email || subscription.email || "").trim().toLowerCase(),
    status: subscription.status || "active",
    provider: "mollie",
    plan: subscription.plan || "Pro",
    amount: subscription.amount || null,
    currency: subscription.currency || "EUR",
    current_period_start: subscription.current_period_start || new Date().toISOString(),
    current_period_end: subscription.current_period_end || null,
    payload: subscription.payload || {},
    created_at: subscription.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString()
  });
}

async function createSupabaseInstallation(installation) {
  return supabaseInsert("copilot_installations", {
    id: installation.id || `installation_${Date.now()}`,
    account_email: String(installation.account_email || installation.email || "").trim().toLowerCase(),
    company: installation.company || "Entreprise",
    profession: installation.profession || "Plombier",
    copilot: installation.copilot || `Copilote ${installation.profession || "metier"}`,
    status: installation.status || "A installer",
    plan: installation.plan || "Pro",
    payload: installation.payload || {},
    created_at: installation.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString()
  });
}

async function sendEmail({ to, subject, html }) {
  if (!process.env.RESEND_API_KEY) return { skipped: true, reason: "Resend is not configured" };
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM || "Qualifyr AI <onboarding@resend.dev>",
      to,
      subject,
      html
    })
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(`Resend email failed: ${response.status} ${JSON.stringify(payload)}`);
  await supabaseInsert("email_events", {
    to_email: Array.isArray(to) ? to.join(",") : to,
    subject,
    status: "sent",
    provider: "resend",
    payload
  }).catch(() => null);
  return { skipped: false, data: payload };
}

module.exports = {
  amountForPlan,
  appUrl,
  badRequest,
  createSupabaseAccount,
  createSupabaseInstallation,
  createSupabaseLead,
  createSupabasePayment,
  createSupabaseSubscription,
  json,
  methodNotAllowed,
  publicLead,
  readBody,
  sendEmail,
  supabaseInsert
};
