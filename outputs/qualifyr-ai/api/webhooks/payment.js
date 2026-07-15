const { createSupabaseLead, json, methodNotAllowed, readBody } = require("../_lib");

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
    await createSupabaseLead({
      id: metadata.leadId || `payment_${payment.id}`,
      type: "Paiement Mollie",
      status: payment.status === "paid" ? "Client actif" : `Paiement ${payment.status}`,
      plan: metadata.plan || "Pro",
      company: metadata.company || "Entreprise",
      email: metadata.email || "",
      profession: metadata.profession || "Plombier",
      payment_id: payment.id,
      amount: Number(payment.amount?.value || 0),
      payload: payment,
      createdAt: new Date().toISOString()
    }).catch(() => null);

    return json(res, 200, {
      ok: true,
      paymentId: payment.id,
      status: payment.status,
      paid: payment.status === "paid"
    });
  } catch (error) {
    return json(res, 500, {
      ok: false,
      error: "Webhook paiement impossible a traiter.",
      details: error.message
    });
  }
};
