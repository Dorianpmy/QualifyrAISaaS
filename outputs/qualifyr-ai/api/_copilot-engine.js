const PLAYBOOKS = {
  whatsapp: "Qualifie le message, extrait le besoin, l'urgence, l'adresse, les photos manquantes et propose une reponse WhatsApp courte.",
  devis: "Transforme la demande en brouillon de devis prudent, avec prestations, quantites, prix a verifier et questions manquantes.",
  telephone: "Resume l'appel, detecte l'urgence, collecte les coordonnees et propose la prochaine action.",
  planning: "Propose un rendez-vous realiste, evite les doublons et indique les informations a confirmer.",
  email: "Classe l'email, resume la demande et prepare une reponse a valider.",
  relance: "Prepare une relance polie, factuelle et non agressive, sans envoyer automatiquement.",
  facturation: "Identifie le paiement, l'echeance et prepare une action de suivi a valider.",
  avis: "Evalue la satisfaction et prepare une demande d'avis uniquement si le contexte est positif.",
  reseaux: "Prepare une publication professionnelle a partir des informations fournies, sans inventer de chantier.",
  crm: "Cree ou enrichit une fiche client et propose une prochaine action.",
  documents: "Classe le document et extrait uniquement les informations explicitement presentes.",
  default: "Analyse la demande de l'entreprise et propose une action concrete, prudente et validable par un humain."
};

function kindFor(name = "") {
  const value = String(name).toLowerCase();
  return Object.keys(PLAYBOOKS).find((key) => key !== "default" && value.includes(key)) || "default";
}

function fallbackResult({ copilot, input, profession }) {
  const kind = kindFor(copilot);
  const text = String(input || "").trim();
  const urgent = /urgent|urgence|fuite|panne|danger|court-circuit|inond/i.test(text);
  return {
    summary: text ? text.slice(0, 240) : "Demande de test sans contenu client.",
    category: kind,
    urgency: urgent ? "haute" : "normale",
    customer_reply: urgent
      ? "Merci pour votre message. Votre demande semble urgente. Pouvez-vous confirmer votre adresse et envoyer une photo si cela ne vous met pas en danger ?"
      : "Merci pour votre message. Pour vous aider rapidement, pouvez-vous préciser votre besoin, votre adresse et votre délai ?",
    next_action: kind === "devis" ? "Creer un brouillon de devis a verifier" : "Faire valider la reponse par l'entreprise",
    missing_information: ["Coordonnees completes", "Adresse", "Delai souhaite"],
    quote_draft: kind === "devis" || /devis|prix|tarif/i.test(text) ? {
      title: `Brouillon ${profession || "entreprise"}`,
      lines: [{ description: "Prestation a confirmer", quantity: 1, unit_price: 0 }],
      vat_rate: 20,
      requires_review: true
    } : null,
    mode: "rules"
  };
}

async function runCopilot({ copilot, input, profession = "Autre", company = "Entreprise", context = {} }) {
  const fallback = fallbackResult({ copilot, input, profession });
  if (!process.env.OPENAI_API_KEY) return fallback;
  const kind = kindFor(copilot);
  const prompt = `Tu es ${copilot}, un copilote pour ${company}, metier ${profession}. ${PLAYBOOKS[kind]}
Ne contacte jamais un client et ne confirme jamais un prix ou rendez-vous sans validation humaine. Reponds uniquement en JSON avec les cles summary, category, urgency, customer_reply, next_action, missing_information et quote_draft. Donnees: ${JSON.stringify({ input, context }).slice(0, 12000)}`;
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model: process.env.OPENAI_MODEL || "gpt-5.6-luna", input: prompt, max_output_tokens: 1200 })
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error?.message || "Le moteur IA est indisponible.");
  const output = payload.output_text || payload.output?.flatMap((item) => item.content || []).find((item) => item.type === "output_text")?.text || "";
  try {
    return { ...JSON.parse(output.replace(/^```json\s*|\s*```$/g, "")), mode: "openai", response_id: payload.id };
  } catch {
    return { ...fallback, summary: output.slice(0, 500) || fallback.summary, mode: "openai_unstructured", response_id: payload.id };
  }
}

module.exports = { runCopilot };
