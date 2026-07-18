const { badRequest, createSupabaseLead, json, methodNotAllowed, publicLead, readBody, sendEmail } = require("./_lib");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") return methodNotAllowed(res);

  try {
    const body = await readBody(req);
    const lead = publicLead({
      ...body,
      status: body.status || "Nouvelle demande",
      createdAt: new Date().toISOString()
    });

    if (!lead.email) return badRequest(res, "Email requis pour creer une demande.");

    const storage = await createSupabaseLead({
      ...lead,
      payload: body
    });
    await sendEmail({
      to: process.env.ADMIN_EMAIL || "contact@qualifyragence.com",
      subject: `Nouvelle demande Qualifyr AI - ${lead.company}`,
      html: `<h1>Nouvelle demande</h1><p>${lead.company} - ${lead.email}</p><p>Metier : ${lead.profession}</p><p>Formule : ${lead.plan}</p>`
    }).catch(() => null);

    return json(res, 200, {
      ok: true,
      lead,
      storage
    });
  } catch (error) {
    return json(res, 500, {
      ok: false,
      error: "Impossible d'enregistrer la demande."
    });
  }
};
