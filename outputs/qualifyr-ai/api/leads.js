const { badRequest, createSupabaseLead, json, methodNotAllowed, publicLead, readBody } = require("./_lib");

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

    return json(res, 200, {
      ok: true,
      lead,
      storage
    });
  } catch (error) {
    return json(res, 500, {
      ok: false,
      error: "Impossible d'enregistrer la demande.",
      details: error.message
    });
  }
};
