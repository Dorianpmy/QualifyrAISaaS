const {
  createSupabaseAccount,
  createSupabaseInstallation,
  createSupabaseLead,
  createSupabasePayment,
  createSupabaseSubscription,
  json,
  methodNotAllowed,
  readBody,
  sendEmail
} = require("../_lib");

async function readForm(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString("utf8");
  const params = new URLSearchParams(raw);
  return Object.fromEntries(params.entries());
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") return methodNotAllowed(res);

  try {
    const contentType = req.headers["content-type"] || "";
    const body = contentType.includes("application/json") ? await readBody(req) : await readForm(req);
    const paymentId = body.id || body.paymentId;

    if (!paymentId) {
      return json(res, 400, { ok: false, error: "Identifiant paiement manquant." });
    }

    if (!process.env.MOLLIE_API_KEY) {
      return json(res, 200, {
        ok: true,
        received: true,
        warning: "MOLLIE_API_KEY absente, paiement non verifie."
      });
    }

    const mollieResponse = await fetch(`https://api.mollie.com/v2/payments/${paymentId}`, {
      headers: {
        Authorization: `Bearer ${process.env.MOLLIE_API_KEY}`
      }
    });
    const payment = await mollieResponse.json();

    if (!mollieResponse.ok) {
      return json(res, mollieResponse.status, {
        ok: false,
        error: "Impossible de verifier le paiement Mollie.",
        details: payment
      });
    }

    const metadata = payment.metadata || {};
    const paid = payment.status === "paid";
    const amount = Number(payment.amount?.value || 0);
    await createSupabaseLead({
      id: metadata.leadId || `payment_${payment.id}`,
      type: "Paiement Mollie",
      status: paid ? "Client actif" : `Paiement ${payment.status}`,
      plan: metadata.plan || "Pro",
      company: metadata.company || "Entreprise",
      email: metadata.email || "",
      profession: metadata.profession || "Plombier",
      payment_id: payment.id,
      amount,
      payload: payment,
      created_at: new Date().toISOString()
    }).catch(() => null);
    await createSupabasePayment({
      id: payment.id,
      lead_id: metadata.leadId,
      status: payment.status,
      amount,
      plan: metadata.plan || "Pro",
      email: metadata.email,
      company: metadata.company,
      payload: payment
    }).catch(() => null);

    if (paid) {
      await createSupabaseAccount({
        role: "client",
        status: "Actif",
        company: metadata.company,
        name: metadata.company,
        email: metadata.email,
        profession: metadata.profession,
        plan: metadata.plan || "Pro",
        payload: payment
      }).catch(() => null);
      await createSupabaseSubscription({
        id: `sub_${payment.id}`,
        account_email: metadata.email,
        status: "active",
        plan: metadata.plan || "Pro",
        amount,
        payload: payment
      }).catch(() => null);
      await createSupabaseInstallation({
        id: `install_${payment.id}`,
        account_email: metadata.email,
        company: metadata.company,
        profession: metadata.profession,
        copilot: `Copilote ${metadata.profession || "metier"}`,
        status: "A installer",
        plan: metadata.plan || "Pro",
        payload: payment
      }).catch(() => null);
      await sendEmail({
        to: metadata.email,
        subject: "Votre paiement Qualifyr AI est confirme",
        html: `<h1>Paiement confirme</h1><p>Merci ${metadata.company || ""}. Votre copilote Qualifyr AI est en preparation.</p><p>Formule : ${metadata.plan || "Pro"}</p>`
      }).catch(() => null);
      await sendEmail({
        to: process.env.ADMIN_EMAIL || "contact@qualifyragence.com",
        subject: `Nouveau client Qualifyr AI - ${metadata.company || metadata.email}`,
        html: `<h1>Nouveau paiement confirme</h1><p>${metadata.company || ""} - ${metadata.email || ""}</p><p>Metier : ${metadata.profession || ""}</p><p>Formule : ${metadata.plan || "Pro"}</p><p>Paiement : ${payment.id}</p>`
      }).catch(() => null);
    }

    return json(res, 200, {
      ok: true,
      paymentId: payment.id,
      status: payment.status,
      paid
    });
  } catch (error) {
    return json(res, 500, {
      ok: false,
      error: "Webhook paiement impossible a traiter.",
      details: error.message
    });
  }
};
