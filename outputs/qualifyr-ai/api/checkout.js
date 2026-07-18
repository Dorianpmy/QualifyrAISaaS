const {
  amountForPlan,
  appUrl,
  badRequest,
  createSupabaseAccount,
  createSupabaseLead,
  createSupabasePayment,
  json,
  methodNotAllowed,
  publicLead,
  readBody
} = require("./_lib");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") return methodNotAllowed(res);

  try {
    const body = await readBody(req);
    const lead = publicLead({
      ...body,
      type: "Paiement",
      status: "Paiement cree",
      createdAt: new Date().toISOString()
    });

    if (!lead.email) return badRequest(res, "Email de facturation requis.");
    if (!process.env.MOLLIE_API_KEY) {
      return json(res, 503, {
        ok: false,
        error: "Mollie n'est pas encore configure.",
        missing: ["MOLLIE_API_KEY"],
        nextStep: "Ajoutez MOLLIE_API_KEY dans les variables d'environnement Vercel puis redeployez."
      });
    }

    const plan = amountForPlan(lead.plan);
    const baseUrl = appUrl(req);
    const paymentPayload = {
      amount: {
        currency: "EUR",
        value: plan.value
      },
      description: `Qualifyr AI - ${plan.label} mensuel`,
      redirectUrl: `${baseUrl}/?payment=return&plan=${encodeURIComponent(plan.label)}`,
      webhookUrl: `${baseUrl}/api/webhooks/payment`,
      metadata: {
        source: "qualifyr-ai",
        leadId: lead.id,
        company: lead.company,
        email: lead.email,
        profession: lead.profession,
        plan: plan.label
      }
    };

    const mollieResponse = await fetch("https://api.mollie.com/v2/payments", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.MOLLIE_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(paymentPayload)
    });

    const payment = await mollieResponse.json();
    if (!mollieResponse.ok) {
      return json(res, mollieResponse.status, {
        ok: false,
        error: "Mollie a refuse la creation du paiement."
      });
    }

    await createSupabaseLead({
      ...lead,
      status: "Paiement Mollie cree",
      payment_id: payment.id,
      amount: Number(plan.value),
      payload: body
    }).catch((error) => ({ skipped: true, reason: error.message }));
    await createSupabaseAccount({
      role: "client",
      status: "Paiement en cours",
      company: lead.company,
      name: lead.name,
      email: lead.email,
      profession: lead.profession,
      plan: plan.label,
      payload: body
    }).catch((error) => ({ skipped: true, reason: error.message }));
    await createSupabasePayment({
      id: payment.id,
      lead_id: lead.id,
      status: payment.status,
      amount: Number(plan.value),
      plan: plan.label,
      email: lead.email,
      company: lead.company,
      payload: payment
    }).catch((error) => ({ skipped: true, reason: error.message }));

    return json(res, 200, {
      ok: true,
      paymentId: payment.id,
      checkoutUrl: payment._links?.checkout?.href,
      status: payment.status,
      plan: plan.label,
      amount: plan.value
    });
  } catch (error) {
    return json(res, 500, {
      ok: false,
      error: "Impossible de creer le paiement."
    });
  }
};
