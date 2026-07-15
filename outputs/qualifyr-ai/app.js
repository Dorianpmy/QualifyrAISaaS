const professions = [
  "Plombier",
  "Electricien",
  "Chauffagiste",
  "Couvreur",
  "Macon",
  "Peintre",
  "Menuisier",
  "Serrurier",
  "Garage automobile",
  "Carrossier",
  "Societe de nettoyage",
  "Paysagiste",
  "Pisciniste",
  "Restaurant",
  "Dentiste",
  "Avocat",
  "Agence immobiliere",
  "Autre"
];

const professionPlaybooks = {
  Plombier: {
    urgency: "Fuite active, degat des eaux, ballon en panne",
    questions: ["Ou se situe la fuite ?", "L'eau est-elle coupee ?", "Pouvez-vous envoyer une photo ?"],
    automations: ["Qualification urgence 24/7", "Tournee par secteur", "Relance devis sous 24h"]
  },
  Electricien: {
    urgency: "Panne generale, tableau electrique, court-circuit",
    questions: ["Le disjoncteur saute-t-il ?", "Toute la maison est-elle concernee ?", "Y a-t-il une odeur de brule ?"],
    automations: ["Priorite securite", "Diagnostic avant intervention", "Checklist photos tableau"]
  },
  Restaurant: {
    urgency: "Reservation groupe, avis negatif, demande traiteur",
    questions: ["Date et nombre de personnes ?", "Allergies ou regime specifique ?", "Besoin d'un devis groupe ?"],
    automations: ["Confirmation reservation", "Demande avis apres visite", "Relance evenement"]
  },
  "Agence immobiliere": {
    urgency: "Demande visite, estimation urgente, dossier locataire",
    questions: ["Type de bien ?", "Ville recherchee ?", "Budget et delai ?"],
    automations: ["Qualification acheteur", "Planning visites", "Relance mandat"]
  },
  Autre: {
    urgency: "Demande entrante a qualifier",
    questions: ["Quel est le besoin ?", "Quel delai ?", "Quelles pieces jointes sont utiles ?"],
    automations: ["Qualification standard", "Relance multicanal", "Creation tache CRM"]
  }
};

const modules = [
  {
    id: "phone",
    title: "Assistant telephonique IA",
    icon: "phone",
    status: "success",
    summary: "Repond, detecte l'urgence, prend les coordonnees, resume et cree un rendez-vous.",
    tags: ["Appels", "Urgence", "Agenda", "Resume IA"]
  },
  {
    id: "whatsapp",
    title: "Assistant WhatsApp IA",
    icon: "message",
    status: "success",
    summary: "Repond automatiquement, demande des photos et qualifie le prospect avant intervention.",
    tags: ["Photos", "Qualification", "Meta API"]
  },
  {
    id: "calendar",
    title: "Agenda intelligent",
    icon: "calendar",
    status: "warning",
    summary: "Synchronise Google et Outlook, evite les doublons et optimise les tournees.",
    tags: ["Google", "Outlook", "Tournees"]
  },
  {
    id: "quotes",
    title: "Generateur de devis IA",
    icon: "file",
    status: "success",
    summary: "Questionnaire intelligent, photos, estimation et devis entierement modifiable.",
    tags: ["Devis", "Photos", "Editable"]
  },
  {
    id: "followup",
    title: "Relance automatique",
    icon: "repeat",
    status: "success",
    summary: "Relance devis, factures et rendez-vous par SMS, email ou WhatsApp.",
    tags: ["SMS", "Email", "WhatsApp"]
  },
  {
    id: "reviews",
    title: "Avis Google",
    icon: "star",
    status: "warning",
    summary: "Demande les avis, filtre les clients mecontents et mesure la satisfaction.",
    tags: ["Google", "NPS", "Statistiques"]
  },
  {
    id: "crm",
    title: "CRM intelligent",
    icon: "users",
    status: "success",
    summary: "Prospects, clients, historique, pipeline et taches avec priorisation IA.",
    tags: ["Pipeline", "Historique", "Taches"]
  },
  {
    id: "ai-center",
    title: "Centre IA",
    icon: "workflow",
    status: "success",
    summary: "Cree de nouvelles automatisations visuelles inspirees de n8n et Make.",
    tags: ["No-code", "Workflows", "Connecteurs"]
  }
];

const connectors = [
  "Google Calendar",
  "Gmail",
  "WhatsApp",
  "Facebook",
  "Instagram",
  "Messenger",
  "Mollie",
  "Google Sheets",
  "Slack",
  "Zapier",
  "Webhook",
  "API"
];

const integrationCatalog = [
  {
    id: "google-calendar",
    name: "Google Calendar",
    logo: "GC",
    description: "Synchronise les rendez-vous, evite les doublons et permet a l'Agenda IA d'optimiser les tournees.",
    state: "Connecte",
    connected: true,
    configuration: ["OAuth Google", "Calendrier principal", "Temps tampon 20 min", "Creation RDV automatique"],
    history: ["20 rendez-vous synchronises aujourd'hui", "Doublon evite pour Claire Martin", "Tournee Lyon Est optimisee"]
  },
  {
    id: "gmail",
    name: "Gmail",
    logo: "GM",
    description: "Permet a Email IA de classer les emails, extraire les demandes et preparer des reponses.",
    state: "Connecte",
    connected: true,
    configuration: ["OAuth Gmail", "Libelles Qualifyr", "Pieces jointes archivees", "Brouillons valides manuellement"],
    history: ["27 emails urgents classes", "19 reponses preparees", "Brief client archive"]
  },
  {
    id: "google-drive",
    name: "Google Drive",
    logo: "GD",
    description: "Stocke automatiquement devis, factures, photos chantier, contrats et documents client.",
    state: "Deconnecte",
    connected: false,
    configuration: ["Dossier racine Qualifyr AI", "Classement par client", "Export PDF", "Permissions equipe"],
    history: ["Connecteur pret", "Migration documents planifiee", "OAuth requis"]
  },
  {
    id: "mollie",
    name: "Mollie",
    logo: "MO",
    description: "Suit les paiements, acomptes, abonnements et relances d'impayes dans Facturation IA.",
    state: "Connecte",
    connected: true,
    configuration: ["Compte Mollie", "Paiement CB", "Webhooks paiement", "Relance impayes"],
    history: ["3 acomptes rapproches", "F-2026-031 payee", "Webhook paiement valide"]
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    logo: "WA",
    description: "Active WhatsApp IA pour repondre, demander des photos et qualifier les prospects.",
    state: "Connecte",
    connected: true,
    configuration: ["WhatsApp Cloud API", "Templates Meta", "Photos obligatoires", "Escalade equipe"],
    history: ["326 messages traites", "63 photos recues", "14 devis declenches"]
  },
  {
    id: "meta",
    name: "Meta",
    logo: "ME",
    description: "Centralise les permissions Facebook, Instagram, Messenger et WhatsApp Business.",
    state: "A configurer",
    connected: false,
    configuration: ["Business Manager", "Permissions pages", "Webhooks Meta", "Validation templates"],
    history: ["Application creee", "Permissions a valider", "Revue Meta en attente"]
  },
  {
    id: "instagram",
    name: "Instagram",
    logo: "IG",
    description: "Transforme les DM Instagram en prospects qualifies et opportunites CRM.",
    state: "Deconnecte",
    connected: false,
    configuration: ["Compte professionnel", "DM autorises", "Mots-cles", "Transfert CRM"],
    history: ["Scenario pret", "Connexion Meta requise", "Templates reponse disponibles"]
  },
  {
    id: "messenger",
    name: "Messenger",
    logo: "MS",
    description: "Permet a Messenger IA de repondre aux demandes Facebook et de creer des fiches clients.",
    state: "Deconnecte",
    connected: false,
    configuration: ["Page Facebook", "Questions rapides", "Horaires", "Notifications equipe"],
    history: ["Connecteur disponible", "Webhook prepare", "Page non connectee"]
  },
  {
    id: "google-business",
    name: "Google Business",
    logo: "GB",
    description: "Pilote les demandes d'avis Google, le suivi reputation et les publications locales.",
    state: "Connecte",
    connected: true,
    configuration: ["Fiche etablissement", "Lien avis", "Filtre insatisfaction", "Posts locaux"],
    history: ["15 avis suivis", "2 clients rappeles", "9 demandes d'avis envoyees"]
  },
  {
    id: "slack",
    name: "Slack",
    logo: "SL",
    description: "Notifie l'equipe quand un prospect chaud, un paiement ou une urgence arrive.",
    state: "A configurer",
    connected: false,
    configuration: ["Canal #qualifyr", "Alertes urgentes", "Mentions equipe", "Resume quotidien"],
    history: ["Connecteur pret", "Canal a choisir", "Notifications test non envoyees"]
  },
  {
    id: "zapier",
    name: "Zapier",
    logo: "ZA",
    description: "Expose les evenements Qualifyr AI vers les automatisations existantes de l'entreprise.",
    state: "Deconnecte",
    connected: false,
    configuration: ["Trigger nouveau client", "Trigger devis signe", "Action webhook", "Token serveur"],
    history: ["Recettes disponibles", "Token a generer", "Aucune execution"]
  },
  {
    id: "make",
    name: "Make",
    logo: "MK",
    description: "Permet de connecter Qualifyr AI a des scenarios Make pour workflows avances.",
    state: "Deconnecte",
    connected: false,
    configuration: ["Webhook entrant", "Scenario Make", "Secret signature", "Retry automatique"],
    history: ["Blueprint prepare", "Webhook non active", "Documentation prete"]
  },
  {
    id: "n8n",
    name: "n8n",
    logo: "N8",
    description: "Branche les workflows Qualifyr AI avec n8n pour les clients techniques ou agences.",
    state: "A configurer",
    connected: false,
    configuration: ["URL instance", "API key serveur", "Node Qualifyr", "Journal executions"],
    history: ["Adapter prevu", "Node custom a publier", "Connexion non testee"]
  },
  {
    id: "api",
    name: "API",
    logo: "API",
    description: "Prepare une API serveur pour creer clients, devis, rendez-vous, factures et evenements.",
    state: "Pret",
    connected: true,
    configuration: ["REST API", "Scopes", "Rate limits", "Audit logs"],
    history: ["Contrat API documente", "Scopes definis", "Backend adapter prevu"]
  },
  {
    id: "webhook",
    name: "Webhook",
    logo: "WH",
    description: "Recoit et emet des evenements vers les outils metier sans exposer de secrets cote client.",
    state: "Pret",
    connected: true,
    configuration: ["Signature HMAC", "Evenements", "Retries", "Logs livraison"],
    history: ["Evenements clients definis", "Retry policy preparee", "Signature serveur requise"]
  }
];

const navItems = [
  ["dashboard", "Accueil", "dashboard", "🏠"],
  ["crm", "Mes clients", "users", "👥"],
  ["quotes", "Mes devis", "file", "📄"],
  ["calendar", "Mon planning", "calendar", "📅"],
  ["ai-center", "Mon assistant IA", "spark", "🤖"],
  ["automations", "Mes automatisations", "workflow", "⚡"],
  ["marketplace", "Ajouter une IA", "grid", "🧩"],
  ["notifications", "Mon activite", "dashboard", "📈"],
  ["settings", "Mon entreprise", "shield", "🏢"]
];

const bottomNavItems = [
  ["dashboard", "Accueil", "dashboard"],
  ["crm", "Clients", "users"],
  ["quotes", "Devis", "file"],
  ["calendar", "Planning", "calendar"],
  ["ai-center", "Assistant", "spark"],
  ["more", "Plus", "grid"]
];

const state = {
  view: "dashboard",
  profession: "Plombier",
  selectedCopilotName: "WhatsApp IA",
  selectedCopilotMode: "install",
  quote: {
    client: "Marc Lefevre",
    need: "Fuite sous evier avec remplacement siphon",
    urgency: "Aujourd'hui",
    amount: 420
  }
};

const icons = {
  dashboard: "<path d='M3 13h8V3H3zM13 21h8V11h-8zM13 3v6h8V3zM3 21h8v-6H3z'/>",
  spark: "<path d='M13 2 3 14h8l-1 8 10-12h-8z'/>",
  grid: "<path d='M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z'/>",
  users: "<path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2'/><circle cx='9' cy='7' r='4'/><path d='M22 21v-2a4 4 0 0 0-3-3.9'/><path d='M16 3.1a4 4 0 0 1 0 7.8'/>",
  file: "<path d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z'/><path d='M14 2v6h6'/><path d='M8 13h8M8 17h6'/>",
  workflow: "<path d='M6 3v6h6'/><path d='M6 9a6 6 0 0 1 6 6v6'/><path d='M18 3v6h-6'/><path d='M18 9a6 6 0 0 0-6 6'/><path d='M9 21h6'/>",
  shield: "<path d='M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'/>",
  card: "<rect x='2' y='5' width='20' height='14' rx='2'/><path d='M2 10h20'/>",
  help: "<circle cx='12' cy='12' r='10'/><path d='M9.1 9a3 3 0 1 1 5.8 1c-.7 1.3-2.9 1.6-2.9 3'/><path d='M12 17h.01'/>",
  phone: "<path d='M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.4 2.1L8.1 10a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.6 1.9z'/>",
  message: "<path d='M21 15a4 4 0 0 1-4 4H7l-4 4V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z'/>",
  calendar: "<path d='M8 2v4M16 2v4'/><rect x='3' y='4' width='18' height='18' rx='2'/><path d='M3 10h18'/>",
  repeat: "<path d='M17 1l4 4-4 4'/><path d='M3 11V9a4 4 0 0 1 4-4h14'/><path d='M7 23l-4-4 4-4'/><path d='M21 13v2a4 4 0 0 1-4 4H3'/>",
  star: "<path d='m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8-6.2-3.3L5.8 21 7 14.2 2 9.3l6.9-1z'/>"
};

function svg(name) {
  return `<svg viewBox="0 0 24 24" aria-hidden="true">${icons[name] || icons.dashboard}</svg>`;
}

function el(id) {
  return document.getElementById(id);
}

function playbook() {
  return professionPlaybooks[state.profession] || professionPlaybooks.Autre;
}

function toast(message) {
  const node = el("toast");
  node.textContent = message;
  node.classList.add("show");
  window.clearTimeout(window.toastTimer);
  window.toastTimer = window.setTimeout(() => node.classList.remove("show"), 2600);
}

function viewFromAssistantPrompt(prompt) {
  const text = (prompt || "").toLowerCase();
  const rules = [
    [["devis", "relance", "relancer"], "quotes"],
    [["client", "martin", "dupont", "rappeler", "prospect"], "crm"],
    [["rendez", "planning", "agenda"], "calendar"],
    [["facture", "impaye", "paiement"], "billing"],
    [["whatsapp", "instagram", "facebook", "messenger", "connect"], "integrations"],
    [["ia", "installer", "telephone"], "marketplace"],
    [["journee", "prepare", "assistant"], "ai-center"]
  ];
  const match = rules.find(([keywords]) => keywords.some((keyword) => text.includes(keyword)));
  return match ? match[1] : "ai-center";
}

function renderNav() {
  el("navList").innerHTML = navItems
    .map(([id, label, , emoji]) => `
      <button class="nav-item ${state.view === id ? "active" : ""}" data-view="${id}">
        <span class="nav-emoji" aria-hidden="true">${emoji}</span>
        <span>${label}</span>
      </button>
    `)
    .join("");
}

function renderBottomNav() {
  const node = el("bottomNav");
  if (!node) return;
  const moreViews = ["more", "landing", "pricing", "commercial", "documents", "notifications", "integrations", "custom-ai", "copilot-setup", "settings", "billing", "help", "admin", "onboarding"];
  node.innerHTML = bottomNavItems
    .map(([id, label, icon]) => `
      <button class="bottom-nav-item ${state.view === id || (id === "more" && moreViews.includes(state.view)) ? "active" : ""}" data-view="${id}">
        ${svg(icon)}
        <span>${label}</span>
      </button>
    `)
    .join("");
}

function simplifyVisibleLanguage(root) {
  if (!root) return;
  const replacements = [
    [/\bDashboard\b/g, "Accueil"],
    [/\bCRM\b/g, "clients"],
    [/\bPipeline\b/g, "Mes prospects"],
    [/\bpipeline\b/g, "mes prospects"],
    [/\bMarketplace\b/g, "Ajouter une IA"],
    [/\bmarketplace\b/g, "bibliotheque d'IA"],
    [/\bCentre IA\b/g, "Mon assistant IA"],
    [/\bcentre IA\b/g, "mon assistant IA"],
    [/\bIntegrations\b/g, "Mes connexions"],
    [/\bintegrations\b/g, "connexions"],
    [/\bParametres\b/g, "Mon entreprise"],
    [/\bparametres\b/g, "reglages"],
    [/\bNotifications\b/g, "Mes alertes"],
    [/\bnotifications\b/g, "alertes"],
    [/\bWorkflow\b/g, "Aide automatique"],
    [/\bworkflow\b/g, "aide automatique"],
    [/\bWorkflows\b/g, "Aides automatiques"],
    [/\bworkflows\b/g, "aides automatiques"],
    [/\bWebhook\b/g, "Lien automatique"],
    [/\bwebhook\b/g, "lien automatique"],
    [/\bWebhooks\b/g, "Liens automatiques"],
    [/\bwebhooks\b/g, "liens automatiques"],
    [/\bAPI\b/g, "connexion securisee"],
    [/\bOAuth\b/g, "connexion securisee"],
    [/\bSaaS\b/g, "service"],
    [/\bBackend\b/g, "systeme securise"],
    [/\bbackend\b/g, "systeme securise"],
    [/\bTrigger\b/g, "Depart"],
    [/\btrigger\b/g, "depart"]
  ];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      if (!parent || ["SCRIPT", "STYLE", "TEXTAREA", "INPUT"].includes(parent.tagName)) {
        return NodeFilter.FILTER_REJECT;
      }
      return NodeFilter.FILTER_ACCEPT;
    }
  });
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach((node) => {
    let value = node.nodeValue;
    replacements.forEach(([pattern, replacement]) => {
      value = value.replace(pattern, replacement);
    });
    node.nodeValue = value;
  });
}

function showView(view) {
  const friendlyTitles = {
    dashboard: "Accueil",
    crm: "Mes clients",
    quotes: "Mes devis",
    calendar: "Mon planning",
    "ai-center": "Mon assistant IA",
    automations: "Mes automatisations",
    marketplace: "Ajouter une IA",
    notifications: "Mes alertes",
    integrations: "Mes connexions",
    documents: "Mes documents",
    settings: "Mon entreprise",
    billing: "Mes factures",
    help: "Aide",
    "custom-ai": "IA sur mesure",
    pricing: "Tarifs",
    commercial: "Mon abonnement",
    onboarding: "Premiers pas",
    "copilot-setup": "Installation du copilote"
  };
  state.view = view;
  document.querySelectorAll(".view").forEach((node) => node.classList.remove("active"));
  el(`view-${view}`).classList.add("active");
  const nav = navItems.find(([id]) => id === view);
  const bottomNav = bottomNavItems.find(([id]) => id === view);
  el("viewTitle").textContent = friendlyTitles[view] || (nav ? nav[1] : bottomNav ? bottomNav[1] : "Qualifyr AI");
  renderNav();
  renderBottomNav();
  simplifyVisibleLanguage(el(`view-${view}`));
  simplifyVisibleLanguage(el("navList"));
  simplifyVisibleLanguage(el("bottomNav"));
  document.querySelector(".sidebar").classList.remove("open");
}

function metric(label, value, trend) {
  return `
    <article class="card metric-card">
      <p class="eyebrow">${label}</p>
      <div>
        <div class="metric-value">${value}</div>
        <span class="trend">${trend}</span>
      </div>
    </article>
  `;
}

function renderDashboard() {
  el("view-dashboard").innerHTML = `
    <div class="hero-panel">
      <p class="eyebrow">Automatisation premium pour PME et artisans</p>
      <h2>Qualifyr AI transforme les demandes entrantes en rendez-vous, devis et relances.</h2>
      <p>Un moteur commun pour agenda, CRM, telephonie, WhatsApp, devis et workflows, adapte automatiquement au metier choisi.</p>
      <div class="hero-actions">
        <button class="primary-button" data-view="onboarding">${svg("spark")} Configurer mon metier</button>
        <button class="secondary-button" data-view="ai-center">${svg("workflow")} Ouvrir le centre IA</button>
      </div>
    </div>

    <div class="section grid grid-4">
      ${metric("Appels traites", "184", "+31% ce mois-ci")}
      ${metric("Rendez-vous generes", "47", "+18 rendez-vous")}
      ${metric("Devis envoyes", "32", "12 en attente")}
      ${metric("Temps gagne", "96h", "Estime par workflow")}
    </div>

    <div class="section-header">
      <div>
        <p class="eyebrow">Playbook actuel</p>
        <h2>${state.profession}</h2>
        <p>${playbook().urgency}</p>
      </div>
      <button class="secondary-button" data-view="modules">Voir les modules</button>
    </div>
    <div class="grid grid-3">
      ${playbook().automations.map((item) => `<article class="card"><span class="status success">Actif</span><h3>${item}</h3><p>Scenario adapte au metier ${state.profession.toLowerCase()} avec questions, delais et canaux personnalises.</p></article>`).join("")}
    </section>
  `;
}

function renderOnboarding() {
  el("view-onboarding").innerHTML = `
    <div class="section-header">
      <div>
        <p class="eyebrow">Onboarding intelligent</p>
        <h2>Choisissez le metier pour adapter les automatisations.</h2>
        <p>Les questions, niveaux d'urgence, workflows, relances et estimations changent selon ce choix.</p>
      </div>
      <button class="primary-button" id="saveOnboarding">${svg("spark")} Enregistrer</button>
    </div>
    <div class="profession-picker">
      ${professions.map((item) => `<button class="profession-option ${item === state.profession ? "active" : ""}" data-profession="${item}"><strong>${item}</strong><br><span class="mini-muted">${(professionPlaybooks[item] || professionPlaybooks.Autre).urgency}</span></button>`).join("")}
    </div>
    <div class="section grid grid-2">
      <article class="card">
        <p class="eyebrow">Questions IA</p>
        <h3>Qualification automatique</h3>
        ${playbook().questions.map((q) => `<div class="list-row"><span>${q}</span><strong>Auto</strong></div>`).join("")}
      </article>
      <article class="card">
        <p class="eyebrow">Modules recommandes</p>
        <h3>Pack ${state.profession}</h3>
        ${playbook().automations.map((a) => `<div class="list-row"><span>${a}</span><span class="status success">Pret</span></div>`).join("")}
      </article>
    </div>
  `;
}

function renderModules() {
  el("view-modules").innerHTML = `
    <div class="section-header">
      <div>
        <p class="eyebrow">Bibliotheque de copilotes</p>
        <h2>Modules actifs pour ${state.profession}</h2>
        <p>Chaque module partage le meme moteur, mais charge ses scenarios metier et ses connecteurs.</p>
      </div>
      <button class="primary-button" data-view="ai-center">${svg("workflow")} Composer un workflow</button>
    </div>
    <div class="grid grid-4">
      ${modules.map((module) => `
        <article class="card module-card">
          <div class="module-head">
            <span class="module-icon">${svg(module.icon)}</span>
            <span class="status ${module.status}">${module.status === "success" ? "Actif" : "A connecter"}</span>
          </div>
          <div>
            <h3>${module.title}</h3>
            <p>${module.summary}</p>
          </div>
          <div class="tag-list">${module.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}</div>
        </article>
      `).join("")}
    </div>
  `;
}

function renderLanding() {
  el("view-landing").innerHTML = `
    <section class="sales-hero">
      <p class="eyebrow">Qualifyr AI pour artisans et PME</p>
      <h2>Le copilote IA qui transforme les demandes entrantes en clients, devis et rendez-vous.</h2>
      <p>Telephone, WhatsApp, devis, agenda, relances, avis Google et automatisations dans une plateforme premium prete a vendre.</p>
      <div class="hero-actions">
        <button class="primary-button" data-view="pricing">Demarrer l'essai gratuit</button>
        <button class="secondary-button" data-view="ai-center">Voir les copilotes</button>
      </div>
    </section>
    <div class="section grid grid-4">
      ${metric("Temps gagne moyen", "128h", "par mois")}
      ${metric("Automatisations", performanceStats.automations.toLocaleString("fr-FR"), "ce mois")}
      ${metric("Conversion", `${performanceStats.conversion}%`, "+6 pts")}
      ${metric("Avis Google", `${performanceStats.reviewsAverage}/5`, "reputation suivie")}
    </div>
    <div class="section grid grid-3">
      ${["Ne plus manquer les appels importants", "Envoyer des devis plus vite", "Relancer automatiquement", "Remplir l'agenda", "Centraliser clients et documents", "Installer des copilotes metier"].map((item) => `<article class="card"><span class="status success">Inclus</span><h3>${item}</h3><p>Scenario concret pret pour artisans, PME et independants avec donnees, historique et automatisations.</p></article>`).join("")}
    </div>
    <div class="section grid grid-3">
      ${clients.slice(0, 3).map((client) => `<article class="card testimonial-card"><img class="client-avatar" src="${client.avatar}" alt=""><h3>${client.company}</h3><p>${client.notes}</p><strong>${client.name}</strong></article>`).join("")}
    </div>
  `;
}

function renderPricing() {
  const planExplanations = [
    "Cette offre est ideale si vous travaillez seul.",
    "Cette offre est pensee pour une equipe.",
    "Cette offre est faite pour les entreprises qui veulent automatiser la majorite de leur activite.",
    "Cette offre est construite autour de vos processus specifiques."
  ];
  const roiRows = [
    ["Temps gagne par semaine", subscriptionCenter.roi.weeklySaved],
    ["Temps gagne par mois", subscriptionCenter.roi.monthlySaved],
    ["Revenus potentiellement recuperes", subscriptionCenter.roi.monthlyEstimate],
    ["Taches automatisees", subscriptionCenter.roi.tasksAutomated],
    ["Retour estime", "x6,4"]
  ];
  el("view-pricing").innerHTML = `
    <div class="section-header">
      <div>
        <p class="eyebrow">Tarifs et options</p>
        <h2>Choisir ce que Qualifyr AI peut faire pour votre entreprise.</h2>
        <p>Comparez les offres, ajoutez seulement les options utiles et voyez le retour estime avant de debloquer une fonctionnalite.</p>
      </div>
      <button class="primary-button" data-view="commercial">Voir mon abonnement</button>
    </div>
    <div class="pricing-toggle"><span>Mensuel</span><strong>Annuel - 2 mois offerts</strong></div>
    <div class="grid grid-4">
      ${commercialSuite.plans.map((plan, index) => `
        <article class="card pricing-card ${plan.highlighted ? "featured" : ""}">
          <p class="eyebrow">${plan.trial}</p>
          <h3>${plan.name}</h3>
          <div class="price">${plan.price}</div>
          <p>${planExplanations[index]}</p>
          <p>${plan.description}</p>
          <div class="tag-list">${plan.features.map((feature) => `<span class="tag">${feature}</span>`).join("")}</div>
          <div class="list-row"><span>Cible</span><strong>${plan.target}</strong></div>
          <button class="${plan.highlighted ? "primary-button" : "secondary-button"} trial-action" data-plan="${plan.name}">Demarrer</button>
        </article>
      `).join("")}
    </div>
    <section class="section grid grid-2">
      <article class="card roi-calculator-card">
        <p class="eyebrow">Calculateur de ROI</p>
        <h2>Avant d'acheter, voyez ce que vous gagnez.</h2>
        ${roiRows.map(([label, value]) => `<div class="list-row"><span>${label}</span><strong>${value}</strong></div>`).join("")}
        <div class="assistant-score-line"><span style="width:86%"></span></div>
        <p>Estimation basee sur vos clients, devis, factures, rendez-vous et actions deja automatisees.</p>
      </article>
      <article class="card">
        <p class="eyebrow">Pourquoi passer a l'offre superieure ?</p>
        <h2>Plus Qualifyr AI travaille, plus vous recuperez du temps.</h2>
        <div class="commercial-benefit-grid">
          <span><strong>+18 h</strong><small>Temps gagne supplementaire / mois</small></span>
          <span><strong>+6</strong><small>Nouveaux copilotes</small></span>
          <span><strong>+8</strong><small>Nouvelles connexions</small></span>
          <span><strong>+2 500</strong><small>Missions automatiques / mois</small></span>
        </div>
      </article>
    </section>

    <section class="section">
      <div class="section-header compact-header">
        <div>
          <p class="eyebrow">✨ Boutique des options</p>
          <h2>Ajoutez uniquement ce dont vous avez besoin.</h2>
        </div>
      </div>
      <div class="grid grid-3">
        ${subscriptionCenter.optionShop.map(([name, price, description, saved, proof]) => `
          <article class="card option-card">
            <p class="eyebrow">${price}</p>
            <h3>${name}</h3>
            <p>${description}</p>
            <div class="list-row"><span>Temps gagne estime</span><strong>${saved}</strong></div>
            <div class="list-row"><span>Dans votre activite</span><strong>${proof}</strong></div>
            <button class="primary-button option-unlock" data-option="${name}">Debloquer</button>
          </article>
        `).join("")}
      </div>
    </section>

    <section class="section grid grid-2">
      <article class="card custom-employee-card">
        <p class="eyebrow">⭐ IA sur mesure</p>
        <h2>Construisons votre propre employe numerique.</h2>
        <p>Nous developpons des copilotes IA adaptes a votre metier, vos habitudes et vos logiciels.</p>
        ${["Nom", "Entreprise", "Metier", "Objectif principal", "Outils utilises", "Taches a automatiser", "Budget mensuel", "Telephone", "Email"].map((label, index) => `<div class="field"><label>${label}</label><input value="${index === 0 ? "Dorian" : index === 1 ? "Atelier Qualifyr Demo" : ""}"></div>`).join("")}
        <button class="primary-button" id="customStudy">${svg("message")} Demander une etude</button>
      </article>
      <article class="card">
        <p class="eyebrow">Comparateur d'offres</p>
        <h2>Ce qui change vraiment.</h2>
        <div class="data-table compact-connection-table">
          ${commercialSuite.plans.map((plan, index) => `<div class="table-row"><span><strong>${plan.name}</strong><small>${planExplanations[index]}</small></span><span>${plan.price}</span><span>${plan.features.slice(0, 2).join(", ")}</span><span>${plan.target}</span></div>`).join("")}
        </div>
      </article>
    </section>

    <section class="section grid grid-3">
      ${commercialSuite.coupons.map(([code, value, status, usage]) => `<article class="card"><p class="eyebrow">Coupon</p><h3>${code}</h3><p>${value}</p><div class="list-row"><span>${status}</span><strong>${usage}</strong></div></article>`).join("")}
    </section>
  `;
}

function renderCommercial() {
  const current = subscriptionCenter.currentPlan;
  const progressRows = [
    ["Copilotes", "12 / 20", 60],
    ["Connexions", "7 / 15", 47],
    ["Potentiel utilise", "68%", 68]
  ];
  const companyHealth = [
    ["Entreprise optimisee", "86%"],
    ["Connexions", "7 / 15"],
    ["Copilotes", "12 / 20"],
    ["Missions automatiques", "284 ce mois"],
    ["Clients suivis", `${clients.length}`],
    ["Factures", `${invoices.length}`],
    ["Avis Google", `${googleReviews.length}`]
  ];
  el("view-commercial").innerHTML = `
    <div class="section-header">
      <div>
        <p class="eyebrow">💎 Mon abonnement</p>
        <h2>Gerez votre abonnement et decouvrez toutes les fonctionnalites disponibles.</h2>
        <p>Comprenez ce que vous possedez, ce que vous pouvez debloquer et le temps que Qualifyr AI peut encore vous faire gagner.</p>
      </div>
      <button class="primary-button" data-view="pricing">Voir les options</button>
    </div>

    <section class="subscription-hero">
      <article class="card current-plan-card">
        <p class="eyebrow">Mon offre actuelle</p>
        <h2>${current.name}</h2>
        <div class="price">${current.price}</div>
        ${[
          ["Renouvellement", current.renewal],
          ["Utilisateurs", current.users],
          ["Copilotes inclus", current.copilots],
          ["Connexions incluses", current.connections],
          ["Stockage utilise", current.storage]
        ].map(([label, value]) => `<div class="list-row"><span>${label}</span><strong>${value}</strong></div>`).join("")}
      </article>
      <article class="card">
        <p class="eyebrow">Votre potentiel</p>
        <h2>Vous utilisez 68% de votre potentiel.</h2>
        ${progressRows.map(([label, value, progress]) => `
          <div class="subscription-progress-row">
            <div class="list-row"><span>${label}</span><strong>${value}</strong></div>
            <div class="assistant-score-line"><span style="width:${progress}%"></span></div>
          </div>
        `).join("")}
        <button class="primary-button" data-view="pricing">Decouvrir ce que je peux debloquer</button>
      </article>
    </section>

    <section class="section grid grid-2">
      <article class="card">
        <p class="eyebrow">Fonctionnalites incluses</p>
        <h2>Ce que vous possedez deja.</h2>
        <div class="feature-check-grid">
          ${subscriptionCenter.includedFeatures.map((feature) => `<span>✅ ${feature}</span>`).join("")}
        </div>
      </article>
      <article class="card">
        <p class="eyebrow">Votre retour sur investissement</p>
        <h2>${subscriptionCenter.roi.monthlyEstimate}</h2>
        <div class="commercial-benefit-grid">
          <span><strong>${subscriptionCenter.roi.weeklySaved}</strong><small>Temps gagne / semaine</small></span>
          <span><strong>${subscriptionCenter.roi.moneySaved}</strong><small>Argent economise</small></span>
          <span><strong>${subscriptionCenter.roi.prospectsRecovered}</strong><small>Prospects recuperes</small></span>
          <span><strong>${subscriptionCenter.roi.callsHandled}</strong><small>Appels traites</small></span>
          <span><strong>${subscriptionCenter.roi.quotesFollowed}</strong><small>Devis relances</small></span>
          <span><strong>${subscriptionCenter.roi.reviewsWon}</strong><small>Avis Google obtenus</small></span>
        </div>
      </article>
    </section>

    <section class="section">
      <div class="section-header compact-header">
        <div>
          <p class="eyebrow">Fonctionnalites Premium</p>
          <h2>Les prochaines aides que vous pouvez debloquer.</h2>
        </div>
      </div>
      <div class="grid grid-3">
        ${subscriptionCenter.premiumFeatures.map(([name, description, saved, popularity, why]) => `
          <article class="card premium-feature-card">
            <span class="status success">${popularity}</span>
            <h3>${name}</h3>
            <p>${description}</p>
            <div class="list-row"><span>Temps gagne</span><strong>${saved}</strong></div>
            <div class="list-row"><span>Pourquoi l'utiliser</span><strong>${why}</strong></div>
            <button class="primary-button option-unlock" data-option="${name}">Debloquer</button>
          </article>
        `).join("")}
      </div>
    </section>

    <section class="section grid grid-2">
      <article class="card">
        <p class="eyebrow">Succès de votre entreprise</p>
        <h2>Depuis votre inscription.</h2>
        <div class="commercial-benefit-grid">
          <span><strong>128 h</strong><small>Temps economise</small></span>
          <span><strong>${clients.length}</strong><small>Nouveaux clients suivis</small></span>
          <span><strong>${quotes.length}</strong><small>Devis envoyes</small></span>
          <span><strong>${googleReviews.length}</strong><small>Avis Google obtenus</small></span>
          <span><strong>${performanceStats.automations}</strong><small>Missions executees</small></span>
          <span><strong>86%</strong><small>Score Entreprise Autonome</small></span>
        </div>
      </article>
      <article class="card">
        <p class="eyebrow">Sante de votre entreprise</p>
        <h2>Score global : 86%</h2>
        ${companyHealth.map(([label, value]) => `<div class="list-row"><span>${label}</span><strong>${value}</strong></div>`).join("")}
      </article>
    </section>

    <section class="section grid grid-2">
      <article class="card">
        <p class="eyebrow">Qualifyr AI vous recommande</p>
        <h2>Les meilleures ameliorations selon votre utilisation.</h2>
        ${subscriptionCenter.recommendations.map(([title, reason, gain]) => `<div class="list-row"><span><strong>${title}</strong><br><small class="mini-muted">${reason}</small></span><strong>${gain}</strong></div>`).join("")}
      </article>
      <article class="card">
        <p class="eyebrow">Mes recompenses</p>
        <h2>Votre progression.</h2>
        ${subscriptionCenter.rewards.map(([label, value, detail]) => `<div class="list-row"><span><strong>${label}</strong><br><small class="mini-muted">${detail}</small></span><strong>${value}</strong></div>`).join("")}
      </article>
    </section>

    <section class="section grid grid-2">
      <article class="card">
        <p class="eyebrow">Mes licences</p>
        <h2>${subscriptionCenter.currentPlan.users}</h2>
        ${subscriptionCenter.licenses.map(([name, role, status, scope]) => `<div class="list-row"><span><strong>${name}</strong><br><small class="mini-muted">${role} · ${scope}</small></span><strong>${status}</strong></div>`).join("")}
        <button class="primary-button license-action">${svg("users")} Inviter un collaborateur</button>
      </article>
      <article class="card">
        <p class="eyebrow">Programme Ambassadeur</p>
        <h2>Invitez une entreprise.</h2>
        <p>Recevez des recompenses quand une entreprise demarre avec Qualifyr AI.</p>
        <div class="referral-link">${subscriptionCenter.ambassador.link}</div>
        <div class="list-row"><span>Invitations</span><strong>${subscriptionCenter.ambassador.invites}</strong></div>
        <div class="list-row"><span>Recompenses obtenues</span><strong>${subscriptionCenter.ambassador.rewards}</strong></div>
        <button class="secondary-button referral-action">Copier le lien</button>
      </article>
    </section>

    <section class="section grid grid-2">
      <article class="card">
        <p class="eyebrow">Historique</p>
        <h2>Les changements importants.</h2>
        ${subscriptionCenter.history.map(([type, detail, date]) => `<div class="list-row"><span><strong>${type}</strong><br><small class="mini-muted">${detail}</small></span><strong>${date}</strong></div>`).join("")}
      </article>
      <article class="card">
        <p class="eyebrow">Historique des paiements</p>
        <h2>Factures et paiements.</h2>
        ${subscriptionCenter.paymentHistory.map(([number, date, amount, status]) => `<div class="list-row"><span><strong>${number}</strong><br><small class="mini-muted">${date}</small></span><strong>${amount} · ${status}</strong></div>`).join("")}
        <div class="hero-actions">
          <button class="secondary-button payment-action">Telecharger les factures</button>
          <button class="secondary-button payment-action">Mettre a jour le moyen de paiement</button>
        </div>
      </article>
    </section>

    <section class="section grid grid-2">
      <article class="card">
        <p class="eyebrow">Centre d'aide</p>
        <h2>Trouver une reponse rapidement.</h2>
        ${subscriptionCenter.helpCenter.map(([title, desc, metric]) => `<div class="list-row"><span><strong>${title}</strong><br><small class="mini-muted">${desc}</small></span><strong>${metric}</strong></div>`).join("")}
      </article>
      <article class="card">
        <p class="eyebrow">Nouveautes</p>
        <h2>Dernieres fonctionnalites ajoutees.</h2>
        ${subscriptionCenter.news.map(([title, desc]) => `<div class="list-row"><span><strong>${title}</strong><br><small class="mini-muted">${desc}</small></span><button class="secondary-button" data-view="marketplace">Decouvrir</button></div>`).join("")}
      </article>
    </section>

    <section class="section">
      <article class="card">
        <p class="eyebrow">Onboarding premium</p>
        <h2>Votre espace est prepare selon votre metier, vos objectifs et vos outils.</h2>
        <div class="grid grid-4">
          ${subscriptionCenter.onboardingSteps.map(([title, value, detail]) => `<div class="mini-panel"><strong>${title}</strong><span>${value}</span><small>${detail}</small></div>`).join("")}
        </div>
        <button class="primary-button" data-view="onboarding">Revoir mon onboarding</button>
      </article>
    </section>
  `;
}

function renderCrm() {
  const columns = [
    ["Nouveau", ["Fuite cuisine - Lyon", "Demande devis terrasse", "Nettoyage bureaux"]],
    ["Qualifie", ["Ballon eau chaude", "Contrat entretien"]],
    ["Devis envoye", ["Renovation salle de bain", "Pose portail"]],
    ["Gagne", ["Depannage serrure", "Entretien piscine"]]
  ];

  el("view-crm").innerHTML = `
    <div class="section-header">
      <div>
        <p class="eyebrow">CRM intelligent</p>
        <h2>Pipeline, historique et taches prioritaires.</h2>
      </div>
      <button class="secondary-button" id="addLead">${svg("users")} Ajouter un prospect</button>
    </div>
    <div class="pipeline">
      ${columns.map(([title, cards]) => `
        <section class="pipeline-column">
          <strong>${title}</strong>
          ${cards.map((card, index) => `
            <article class="pipeline-card">
              <span class="status ${index % 2 ? "warning" : "success"}">${index % 2 ? "A relancer" : "Prioritaire"}</span>
              <h3>${card}</h3>
              <p>${state.profession} · Source WhatsApp · Score IA ${86 - index * 7}%</p>
            </article>
          `).join("")}
        </section>
      `).join("")}
    </div>
  `;
}

function renderQuotes() {
  el("view-quotes").innerHTML = `
    <div class="split-layout">
      <section class="card">
        <p class="eyebrow">Generateur de devis IA</p>
        <h2>Questionnaire intelligent et devis modifiable</h2>
        <div class="form-grid section">
          <div class="field"><label>Client</label><input id="quoteClient" value="${state.quote.client}"></div>
          <div class="field"><label>Besoin detecte</label><textarea id="quoteNeed">${state.quote.need}</textarea></div>
          <div class="field"><label>Urgence</label><select id="quoteUrgency"><option>Aujourd'hui</option><option>Cette semaine</option><option>Planifie</option></select></div>
          <div class="field"><label>Estimation HT</label><input id="quoteAmount" type="number" value="${state.quote.amount}"></div>
          <button class="primary-button" id="updateQuote">${svg("file")} Generer le devis</button>
        </div>
      </section>
      <aside class="quote-preview">
        <p class="eyebrow">Apercu modifiable</p>
        <h2>Devis ${state.profession}</h2>
        <div class="quote-line"><span>Client</span><strong>${state.quote.client}</strong></div>
        <div class="quote-line"><span>Intervention</span><strong>${state.quote.need}</strong></div>
        <div class="quote-line"><span>Main d'oeuvre</span><strong>${Math.round(state.quote.amount * 0.48)} EUR</strong></div>
        <div class="quote-line"><span>Materiel estime</span><strong>${Math.round(state.quote.amount * 0.32)} EUR</strong></div>
        <div class="quote-line"><span>Deplacement</span><strong>${Math.round(state.quote.amount * 0.2)} EUR</strong></div>
        <div class="quote-line"><span>Total HT</span><strong>${state.quote.amount} EUR</strong></div>
        <p class="mini-muted">Chaque ligne reste editable avant envoi. En production, les photos et la signature client seraient stockees cote serveur.</p>
      </aside>
    </div>
  `;
}

function renderAiCenter() {
  const nodes = [
    { x: 38, y: 58, title: "Appel entrant", sub: "Assistant telephone" },
    { x: 300, y: 80, title: "Detecter urgence", sub: playbook().urgency },
    { x: 570, y: 58, title: "Creer RDV", sub: "Google ou Outlook" },
    { x: 310, y: 275, title: "Resume IA", sub: "Historique CRM" },
    { x: 570, y: 300, title: "Relance auto", sub: "SMS, email, WhatsApp" }
  ];
  const lines = [
    [220, 96, 82, 6],
    [480, 118, 92, -10],
    [392, 160, 118, 88],
    [490, 320, 92, 6]
  ];

  el("view-ai-center").innerHTML = `
    <div class="section-header">
      <div>
        <p class="eyebrow">Centre IA</p>
        <h2>Workflow visuel inspire de n8n et Make.</h2>
        <p>Connectez un declencheur, ajoutez des actions, puis adaptez le scenario au metier.</p>
      </div>
      <div class="section-actions">
        <button class="secondary-button" id="testWorkflow">${svg("spark")} Tester</button>
        <button class="primary-button" id="publishWorkflow">${svg("workflow")} Publier</button>
      </div>
    </div>
    <div class="workflow-board">
      <aside class="connector-list">
        <p class="eyebrow">Connecteurs</p>
        ${connectors.map((connector, index) => `<button class="connector"><span>${connector}</span><span class="status ${index < 5 ? "success" : "warning"}">${index < 5 ? "Pret" : "OAuth"}</span></button>`).join("")}
      </aside>
      <section class="canvas" aria-label="Canvas workflow">
        ${lines.map(([x, y, width, rotate]) => `<div class="flow-line" style="left:${x}px;top:${y}px;width:${width}px;transform:rotate(${rotate}deg)"></div>`).join("")}
        ${nodes.map((node) => `<article class="flow-node" style="left:${node.x}px;top:${node.y}px"><strong>${node.title}</strong><span>${node.sub}</span></article>`).join("")}
      </section>
      <aside class="card node-settings">
        <p class="eyebrow">Parametres du noeud</p>
        <h3>Detecter urgence</h3>
        <div class="field"><label>Metier</label><input value="${state.profession}"></div>
        <div class="field"><label>Seuil priorite</label><input type="range" min="1" max="10" value="8"></div>
        <label class="toggle active"><span class="switch"></span> Creer tache CRM</label>
        <label class="toggle active"><span class="switch"></span> Proposer un rendez-vous</label>
        <label class="toggle"><span class="switch"></span> Demander paiement Mollie</label>
      </aside>
    </div>
  `;
}

function renderAdmin() {
  el("view-admin").innerHTML = `
    <div class="section-header">
      <div>
        <p class="eyebrow">Tableau admin</p>
        <h2>Roles, utilisateurs, logs et gouvernance.</h2>
      </div>
      <button class="secondary-button">${svg("shield")} Inviter un utilisateur</button>
    </div>
    <div class="grid grid-3">
      <article class="card"><h3>Administrateur</h3><p>Acces facturation, modules, equipe, workflows et donnees.</p><span class="status success">2 utilisateurs</span></article>
      <article class="card"><h3>Manager</h3><p>Acces CRM, devis, agenda, relances et rapports.</p><span class="status warning">3 utilisateurs</span></article>
      <article class="card"><h3>Collaborateur</h3><p>Acces limite aux taches, rendez-vous et fiches clients assignees.</p><span class="status success">8 utilisateurs</span></article>
    </div>
    <div class="section card">
      <p class="eyebrow">Journal d'automatisation</p>
      ${["Appel resume et fiche prospect creee", "Devis relance par WhatsApp", "Avis Google demande apres intervention", "Rendez-vous Outlook synchronise"].map((item, index) => `<div class="list-row"><span>${item}</span><strong>${index + 1} min</strong></div>`).join("")}
    </div>
  `;
}

function renderBilling() {
  el("view-billing").innerHTML = `
    <div class="section-header">
      <div>
        <p class="eyebrow">Mes factures</p>
        <h2>Suivre les paiements et relancer les factures.</h2>
        <p>${invoices.length} factures avec statut, montant, date, paiement, relance et export.</p>
      </div>
      <div class="section-actions">
        <button class="secondary-button export-action" data-format="pdf">Exporter PDF</button>
        <button class="secondary-button export-action" data-format="excel">Exporter Excel</button>
        <button class="secondary-button export-action" data-format="csv">Exporter CSV</button>
        <button class="primary-button">${svg("card")} Creer une facture</button>
      </div>
    </div>
    <div class="grid grid-4">
      ${metric("Payees", invoices.filter((invoice) => invoice.status === "Payee").length, money(invoices.filter((invoice) => invoice.status === "Payee").reduce((sum, invoice) => sum + invoice.amount, 0)))}
      ${metric("En attente", invoices.filter((invoice) => invoice.status === "En attente").length, "A surveiller")}
      ${metric("En retard", invoices.filter((invoice) => invoice.status === "En retard").length, "Relance conseillee")}
      ${metric("Total facture", money(invoices.reduce((sum, invoice) => sum + invoice.amount, 0)), "Toutes factures")}
    </div>
    <div class="section data-table">
      ${invoices.map((invoice) => `
        <article class="table-row invoice-row">
          <span><strong>${invoice.number}</strong><small>${invoice.client} · ${invoice.quote}</small></span>
          <span>${invoice.date}<small>Echeance ${invoice.dueDate}</small></span>
          <span>${money(invoice.amount)}</span>
          <span class="status ${invoice.status === "Payee" ? "success" : invoice.status === "En retard" ? "danger" : "warning"}">${invoice.status}</span>
          <span class="invoice-actions">
            <button class="secondary-button invoice-action" data-action="edit">Modifier</button>
            <button class="secondary-button invoice-action" data-action="pdf">PDF</button>
            <button class="secondary-button invoice-action" data-action="payment">Paiement</button>
            <button class="primary-button invoice-action" data-action="reminder">Relancer</button>
          </span>
        </article>
      `).join("")}
    </div>
  `;
}

function renderHelp() {
  el("view-help").innerHTML = `
    <div class="section-header">
      <div>
        <p class="eyebrow">Centre d'aide</p>
        <h2>Guides, notifications et support client.</h2>
      </div>
      <button class="primary-button">${svg("message")} Contacter le support</button>
    </div>
    <div class="grid grid-3">
      ${["Connecter Google Calendar", "Configurer WhatsApp Cloud API", "Creer un workflow", "Modifier un devis IA", "Gerer les roles", "Exporter les donnees RGPD"].map((title) => `<article class="card"><h3>${title}</h3><p>Guide operationnel avec etapes, permissions requises et controles de production.</p></article>`).join("")}
    </div>
  `;
}

const platformRegistry = {
  valueRules: [
    "fait gagner du temps",
    "fait gagner de l'argent",
    "reduit une tache repetitive",
    "sert un usage reel d'artisan ou PME"
  ],
  assistants: [
    {
      id: "phone-ai",
      title: "IA Telephone",
      status: "Actif",
      cost: "42,80 EUR",
      usage: "184 appels",
      saved: "31h gagnees",
      description: "Repond aux appels, qualifie l'urgence, prend les coordonnees et cree les rendez-vous.",
      stats: ["92% appels qualifies", "47 RDV crees", "18 urgences detectees"],
      settings: ["Message d'accueil", "Zones desservies", "Regles d'urgence", "Transfert humain"],
      history: ["Appel de Claire Martin resume", "Urgence fuite priorisee", "RDV cree jeudi 10h"]
    },
    {
      id: "whatsapp-ai",
      title: "IA WhatsApp",
      status: "Actif",
      cost: "18,40 EUR",
      usage: "326 messages",
      saved: "22h gagnees",
      description: "Repond aux messages, demande des photos, collecte les informations et relance.",
      stats: ["63 photos recues", "41 prospects qualifies", "14 devis declenches"],
      settings: ["Ton des reponses", "Delais de relance", "Photos obligatoires", "Notifications equipe"],
      history: ["Photos chantier recues", "Devis cuisine prepare", "Relance envoyee a Hugo Perrin"]
    },
    {
      id: "instagram-ai",
      title: "IA Instagram",
      status: "Inactif",
      cost: "0 EUR",
      usage: "Pret a connecter",
      saved: "0h",
      description: "Transforme les DM Instagram en fiches prospects et demandes qualifiees.",
      stats: ["Connexion Meta requise", "Templates prets", "Qualification active apres OAuth"],
      settings: ["Compte Instagram", "Questions rapides", "Transfert CRM", "Suivi campagne"],
      history: ["Assistant configure mais non active"]
    },
    {
      id: "messenger-ai",
      title: "IA Messenger",
      status: "Inactif",
      cost: "0 EUR",
      usage: "Pret a connecter",
      saved: "0h",
      description: "Centralise les messages Facebook et cree automatiquement les fiches clients.",
      stats: ["Connexion Facebook requise", "Pipeline compatible", "Relances pretes"],
      settings: ["Page Facebook", "Motifs de contact", "Horaires", "Escalade humaine"],
      history: ["Connecteur disponible dans la marketplace"]
    },
    {
      id: "email-ai",
      title: "IA Email",
      status: "Actif",
      cost: "11,90 EUR",
      usage: "89 emails",
      saved: "12h gagnees",
      description: "Classe les emails, extrait les demandes importantes et prepare les reponses.",
      stats: ["27 emails urgents", "19 brouillons prets", "8 relances programmees"],
      settings: ["Gmail", "Signature", "Categories", "Regles de priorite"],
      history: ["Email syndic classe", "Brouillon envoye a Benedicte Roux", "Piece jointe archivee"]
    },
    {
      id: "quote-ai",
      title: "IA Devis",
      status: "Actif",
      cost: "23,10 EUR",
      usage: "32 devis",
      saved: "18h gagnees",
      description: "Prepare les lignes de prestations, quantites, TVA et variantes de prix.",
      stats: ["32 devis envoyes", "11 acceptes", "28 460 EUR CA estime"],
      settings: ["TVA", "Catalogue prestations", "Marges", "Conditions de paiement"],
      history: ["Devis QAI-2026-014 genere", "Variante premium ajoutee", "PDF telecharge"]
    },
    {
      id: "followup-ai",
      title: "IA Relance",
      status: "Actif",
      cost: "9,70 EUR",
      usage: "74 relances",
      saved: "9h gagnees",
      description: "Relance devis, factures et rendez-vous au bon moment sur le bon canal.",
      stats: ["74 relances", "18 reponses", "6 devis signes"],
      settings: ["Delais", "Canaux", "Message court", "Stop relance si reponse"],
      history: ["Relance devis garage envoyee", "Facture F-2026-031 signalee", "SMS rappel RDV envoye"]
    },
    {
      id: "planning-ai",
      title: "IA Planning",
      status: "Actif",
      cost: "15,20 EUR",
      usage: "47 RDV",
      saved: "14h gagnees",
      description: "Optimise les tournees, evite les doublons et tient compte des trajets.",
      stats: ["47 RDV planifies", "6 doublons evites", "8h de trajet economisees"],
      settings: ["Google Calendar", "Zones", "Duree intervention", "Temps tampon"],
      history: ["Tournee Lyon Est optimisee", "Doublon Outlook evite", "RDV urgent insere"]
    },
    {
      id: "accounting-ai",
      title: "IA Comptable",
      status: "Inactif",
      cost: "0 EUR",
      usage: "Module beta",
      saved: "0h",
      description: "Classe factures, rapproche paiements et prepare les exports comptables.",
      stats: ["Export CSV pret", "Regles TVA pretes", "Mollie compatible"],
      settings: ["Plan comptable", "TVA", "Exports", "Rapprochement bancaire"],
      history: ["Beta reservee aux plans Scale"]
    },
    {
      id: "hr-ai",
      title: "IA RH",
      status: "Inactif",
      cost: "0 EUR",
      usage: "Module beta",
      saved: "0h",
      description: "Prepare plannings equipe, consignes chantier et suivi des absences.",
      stats: ["Roles equipes prets", "Planning compatible", "Notifications disponibles"],
      settings: ["Equipes", "Competences", "Disponibilites", "Absences"],
      history: ["Module pret pour future activation"]
    },
    {
      id: "marketing-ai",
      title: "IA Marketing",
      status: "Actif",
      cost: "13,60 EUR",
      usage: "21 contenus",
      saved: "7h gagnees",
      description: "Prepare avis Google, posts locaux, emails saisonniers et campagnes de relance.",
      stats: ["21 contenus", "9 avis demandes", "3 campagnes actives"],
      settings: ["Zone locale", "Offres", "Calendrier editorial", "Validation humaine"],
      history: ["Post entretien chaudiere cree", "Email printemps planifie", "Avis Google demande"]
    }
  ],
  aiCenterCopilots: [
    {
      id: "phone-ai",
      name: "Telephone IA",
      status: "Actif",
      description: "Repond aux appels, pose les bonnes questions, qualifie l'urgence, resume l'echange et cree le client.",
      capture: "Appels qualifies",
      savedTime: "31h/mois",
      automations: 184,
      stats: ["92% appels qualifies", "47 RDV crees", "18 urgences detectees"],
      configuration: ["Message d'accueil", "Transfert humain", "Zones desservies", "Regles d'urgence"],
      history: ["Claire Martin appelee et RDV cree", "Urgence toiture transferee", "Resume envoye dans le CRM"]
    },
    {
      id: "whatsapp-ai",
      name: "WhatsApp IA",
      status: "Actif",
      description: "Repond automatiquement, demande des photos, collecte les informations et transforme les messages en prospects.",
      capture: "Photos et qualification",
      savedTime: "22h/mois",
      automations: 326,
      stats: ["63 photos recues", "41 prospects qualifies", "14 devis declenches"],
      configuration: ["Ton des reponses", "Photos obligatoires", "Delais de relance", "Escalade equipe"],
      history: ["Photos chantier recues", "Devis cuisine prepare", "Relance envoyee a Hugo Perrin"]
    },
    {
      id: "messenger-ai",
      name: "Messenger IA",
      status: "Inactif",
      description: "Centralise les conversations Facebook, qualifie les demandes et cree les opportunites dans le pipeline.",
      capture: "Messages Facebook",
      savedTime: "8h/mois",
      automations: 54,
      stats: ["17 demandes triees", "9 fiches creees", "4 RDV proposes"],
      configuration: ["Page Facebook", "Questions rapides", "Horaires", "Notifications equipe"],
      history: ["Connecteur configure", "Scenario plomberie pret", "Activation en attente"]
    },
    {
      id: "instagram-ai",
      name: "Instagram IA",
      status: "Inactif",
      description: "Repond aux DM Instagram, identifie les demandes serieuses et cree automatiquement les prospects.",
      capture: "DM qualifies",
      savedTime: "9h/mois",
      automations: 61,
      stats: ["21 DM analyses", "13 prospects detectes", "5 visites proposees"],
      configuration: ["Compte Instagram", "Mots-cles", "Transfert CRM", "Suivi campagne"],
      history: ["DM paysagiste classe", "Demande restaurant detectee", "Template reponse pret"]
    },
    {
      id: "email-ai",
      name: "Email IA",
      status: "Actif",
      description: "Classe les emails, extrait les demandes importantes, archive les pieces jointes et prepare les reponses.",
      capture: "Boite email triee",
      savedTime: "12h/mois",
      automations: 89,
      stats: ["27 emails urgents", "19 reponses preparees", "8 relances programmees"],
      configuration: ["Gmail", "Signature", "Categories", "Priorites"],
      history: ["Email syndic classe", "Piece jointe archivee", "Reponse garage preparee"]
    },
    {
      id: "quote-ai",
      name: "Devis IA",
      status: "Actif",
      description: "Analyse le besoin, ajoute les prestations, estime les prix, prepare le PDF et la signature.",
      capture: "Devis pre-rempli",
      savedTime: "18h/mois",
      automations: 50,
      stats: ["50 devis suivis", "10 acceptes", "CA estime 58 437 EUR"],
      configuration: ["Catalogue", "TVA", "Marges", "Signature"],
      history: ["QAI-2026-014 genere", "Variante premium ajoutee", "PDF exporte"]
    },
    {
      id: "calendar-ai",
      name: "Agenda IA",
      status: "Actif",
      description: "Planifie les rendez-vous, evite les doublons, calcule les trajets et synchronise Google/Outlook.",
      capture: "Tournee optimisee",
      savedTime: "14h/mois",
      automations: 20,
      stats: ["20 RDV planifies", "6 doublons evites", "8h trajet economisees"],
      configuration: ["Google Calendar", "Outlook", "Temps tampon", "Zones"],
      history: ["Tournee Lyon Est optimisee", "Doublon Outlook evite", "RDV urgent insere"]
    },
    {
      id: "reviews-ai",
      name: "Avis Google IA",
      status: "Actif",
      description: "Demande des avis apres intervention, detecte les clients insatisfaits et protege la reputation.",
      capture: "Avis surveilles",
      savedTime: "6h/mois",
      automations: 15,
      stats: ["15 avis suivis", "4,7/5 moyenne", "2 clients rappeles"],
      configuration: ["Delai d'envoi", "Message avis", "Filtre insatisfaction", "Lien Google"],
      history: ["Avis Claire Martin demande", "Client insatisfait detecte", "Message Google envoye"]
    },
    {
      id: "followup-ai",
      name: "Relance IA",
      status: "Actif",
      description: "Suit devis, factures et rendez-vous, puis relance au bon moment par SMS, email ou WhatsApp.",
      capture: "Relances pilotees",
      savedTime: "16h/mois",
      automations: 214,
      stats: ["214 relances", "38 reponses", "12 devis signes"],
      configuration: ["Canaux", "Delais", "Stop si reponse", "Ton commercial"],
      history: ["Relance Nassim envoyee", "Facture F-2026-033 suivie", "SMS rappel RDV envoye"]
    },
    {
      id: "marketing-ai",
      name: "Marketing IA",
      status: "Actif",
      description: "Transforme photos et interventions en posts locaux pour Facebook, Instagram, Google Business et LinkedIn.",
      capture: "Posts locaux",
      savedTime: "11h/mois",
      automations: 73,
      stats: ["21 contenus generes", "9 avis reutilises", "3 campagnes actives"],
      configuration: ["Canaux", "Hashtags", "Calendrier", "Validation humaine"],
      history: ["Post chaudiere cree", "Campagne printemps planifiee", "Google Business mis a jour"]
    },
    {
      id: "crm-ai",
      name: "CRM IA",
      status: "Actif",
      description: "Enrichit les fiches clients, resume l'activite, priorise les prospects et detecte les relances utiles.",
      capture: "Pipeline vivant",
      savedTime: "19h/mois",
      automations: 412,
      stats: ["30 clients enrichis", "40 notifications", "20 conversations resumees"],
      configuration: ["Scores prospects", "Champs obligatoires", "Priorites", "Alertes"],
      history: ["Fiche Benedicte enrichie", "Prospect chaud detecte", "Pipeline mis a jour"]
    },
    {
      id: "billing-ai",
      name: "Facturation IA",
      status: "Inactif",
      description: "Convertit les devis en factures, suit les paiements Mollie/CB et relance les impayes.",
      capture: "Factures suivies",
      savedTime: "10h/mois",
      automations: 10,
      stats: ["10 factures suivies", "3 acomptes recus", "2 impayes detectes"],
      configuration: ["Mollie", "TVA", "Relance impayes", "Exports comptables"],
      history: ["F-2026-031 rapprochee", "Acompte recu", "Export comptable pret"]
    }
  ],
  copilots: [
    {
      id: "copilot-plumber",
      title: "Copilote Plombier",
      category: "Metier",
      installed: true,
      price: "Inclus",
      description: "Urgences fuite, ballons d'eau chaude, photos avant intervention et tournee par secteur.",
      modules: ["IA Telephone", "IA WhatsApp", "IA Devis", "IA Planning"],
      outcomes: ["Moins d'appels manques", "Devis plus rapides", "Urgences mieux priorisees"]
    },
    {
      id: "copilot-garage",
      title: "Copilote Garage",
      category: "Metier",
      installed: false,
      price: "29 EUR/mois",
      description: "Diagnostic vehicule, prise de RDV atelier, relances controle technique et devis pieces.",
      modules: ["IA Telephone", "IA Email", "IA Devis", "IA Relance"],
      outcomes: ["Atelier mieux rempli", "Moins d'oublis", "Relances automatiques"]
    },
    {
      id: "copilot-restaurant",
      title: "Copilote Restaurant",
      category: "Metier",
      installed: false,
      price: "29 EUR/mois",
      description: "Reservations, demandes groupes, avis clients et campagnes heures creuses.",
      modules: ["IA WhatsApp", "IA Messenger", "IA Avis Google", "IA Marketing"],
      outcomes: ["Reservations confirmees", "Avis filtres", "Tables mieux remplies"]
    },
    {
      id: "copilot-dentist",
      title: "Copilote Dentiste",
      category: "Metier",
      installed: false,
      price: "39 EUR/mois",
      description: "Rappels RDV, demandes urgentes, preparation patient et suivi post-consultation.",
      modules: ["IA Telephone", "IA Planning", "IA Email", "IA Relance"],
      outcomes: ["Moins de no-show", "Urgences triees", "Secretariat soulage"]
    },
    {
      id: "copilot-real-estate",
      title: "Copilote Immobilier",
      category: "Metier",
      installed: false,
      price: "49 EUR/mois",
      description: "Qualification acheteurs, visites, relances mandat et syntheses de biens.",
      modules: ["IA Email", "IA Planning", "IA CRM", "IA Marketing"],
      outcomes: ["Visites mieux qualifiees", "Pipeline clair", "Mandats relances"]
    },
    {
      id: "copilot-cleaning",
      title: "Copilote Nettoyage",
      category: "Metier",
      installed: false,
      price: "29 EUR/mois",
      description: "Devis surfaces, contrats recurrents, plannings equipe et photos avant/apres.",
      modules: ["IA Devis", "IA Planning", "IA RH", "IA Relance"],
      outcomes: ["Contrats suivis", "Equipes mieux planifiees", "Preuves archivees"]
    },
    {
      id: "copilot-electrician",
      title: "Copilote Electricien",
      category: "Metier",
      installed: false,
      price: "29 EUR/mois",
      description: "Pannes electriques, tableaux, diagnostics securite et interventions urgentes.",
      modules: ["IA Telephone", "IA WhatsApp", "IA Devis", "IA Planning"],
      outcomes: ["Urgences securisees", "Photos tableau recues", "Devis plus fiables"]
    },
    {
      id: "copilot-landscaper",
      title: "Copilote Paysagiste",
      category: "Metier",
      installed: false,
      price: "29 EUR/mois",
      description: "Visites terrain, contrats d'entretien, saisons fortes et relances recurrentes.",
      modules: ["IA Planning", "IA Devis", "IA Relance", "IA Marketing"],
      outcomes: ["Saisonnalite anticipee", "Contrats relances", "Tournees optimisees"]
    },
    {
      id: "copilot-mason",
      title: "Copilote Macon",
      category: "Metier",
      installed: false,
      price: "39 EUR/mois",
      description: "Chantiers, demandes de plans, estimation materiaux et suivi des etapes.",
      modules: ["IA Devis", "IA Email", "IA Planning", "IA CRM"],
      outcomes: ["Plans centralises", "Estimations accelerees", "Suivi chantier clair"]
    },
    {
      id: "copilot-carpenter",
      title: "Copilote Menuisier",
      category: "Metier",
      installed: false,
      price: "39 EUR/mois",
      description: "Mesures, photos, variantes de materiaux, devis et pose planifiee.",
      modules: ["IA WhatsApp", "IA Devis", "IA Planning", "IA Relance"],
      outcomes: ["Mesures mieux collectees", "Variantes vendues", "Pose planifiee"]
    },
    {
      id: "copilot-heating",
      title: "Copilote Chauffagiste",
      category: "Metier",
      installed: false,
      price: "39 EUR/mois",
      description: "Entretien chaudiere, pannes chauffage, contrats annuels et rappels saisonniers.",
      modules: ["IA Telephone", "IA Fidelisation", "IA Planning", "IA Facturation"],
      outcomes: ["Contrats annuels", "Rappels auto", "Urgences triees"]
    },
    {
      id: "copilot-pool",
      title: "Copilote Pisciniste",
      category: "Metier",
      installed: false,
      price: "39 EUR/mois",
      description: "Ouverture saison, hivernage, maintenance, photos bassin et relances clients.",
      modules: ["IA Planning", "IA WhatsApp", "IA Devis", "IA Fidelisation"],
      outcomes: ["Saisons preparees", "Photos archivees", "Maintenance recurrente"]
    }
  ],
  copilotCategories: [
    {
      id: "acquisition",
      title: "Acquisition",
      promise: "Ne plus perdre de demandes entrantes.",
      copilots: [
        {
          title: "Copilote Telephone IA",
          description: "Repond aux appels, qualifie le prospect, resume l'appel, cree le client et propose un rendez-vous.",
          features: ["Questions metier", "Resume automatique", "Creation client", "RDV propose", "Statistiques appels"],
          savedTime: "8h/semaine",
          popularity: "96%",
          rating: "4,9/5",
          status: "Actif"
        },
        {
          title: "Copilote WhatsApp IA",
          description: "Repond automatiquement, demande des photos, qualifie le besoin, cree le prospect et prend rendez-vous.",
          features: ["Photos demandees", "Qualification", "Creation prospect", "Historique complet"],
          savedTime: "6h/semaine",
          popularity: "91%",
          rating: "4,8/5",
          status: "Actif"
        },
        {
          title: "Copilote Messenger IA",
          description: "Centralise les conversations Facebook, qualifie les demandes et les transforme en opportunites CRM.",
          features: ["Reponses automatiques", "Qualification", "Pipeline", "Notifications equipe"],
          savedTime: "3h/semaine",
          popularity: "67%",
          rating: "4,6/5",
          status: "Disponible"
        },
        {
          title: "Copilote Instagram IA",
          description: "Repond aux DM Instagram, identifie les demandes serieuses et cree les prospects automatiquement.",
          features: ["DM automatises", "Qualification", "Prospect CRM", "Suivi campagne"],
          savedTime: "4h/semaine",
          popularity: "72%",
          rating: "4,7/5",
          status: "Disponible"
        }
      ]
    },
    {
      id: "commercial",
      title: "Commercial",
      promise: "Transformer les demandes en devis signes.",
      copilots: [
        {
          title: "Copilote Devis IA",
          description: "Analyse le besoin, pre-remplit les prestations, estime le prix, la duree, genere PDF et signature.",
          features: ["Prestations auto", "Estimation", "Duree prevue", "PDF", "Signature electronique"],
          savedTime: "5h/semaine",
          popularity: "94%",
          rating: "4,9/5",
          status: "Actif"
        },
        {
          title: "Copilote Relance IA",
          description: "Suit les devis et relance automatiquement par SMS, email ou WhatsApp avec statistiques.",
          features: ["SMS", "Email", "WhatsApp", "Stop si reponse", "Stats conversion"],
          savedTime: "4h/semaine",
          popularity: "89%",
          rating: "4,8/5",
          status: "Actif"
        }
      ]
    },
    {
      id: "planning",
      title: "Planning",
      promise: "Remplir les journees sans perdre de temps sur les trajets.",
      copilots: [
        {
          title: "Copilote Agenda IA",
          description: "Optimise les rendez-vous, evite les doublons, calcule les trajets et synchronise Google/Outlook.",
          features: ["Google Calendar", "Outlook", "Trajets", "Anti-doublon", "Tournees"],
          savedTime: "7h/semaine",
          popularity: "88%",
          rating: "4,8/5",
          status: "Actif"
        }
      ]
    },
    {
      id: "clients",
      title: "Clients",
      promise: "Conserver les bons clients et proteger la reputation.",
      copilots: [
        {
          title: "Copilote Avis Google",
          description: "Demande un avis apres intervention, detecte les clients insatisfaits et evite les avis negatifs publics.",
          features: ["Demande automatique", "Filtre insatisfaction", "Statistiques avis", "Message adapte"],
          savedTime: "2h/semaine",
          popularity: "81%",
          rating: "4,7/5",
          status: "Disponible"
        },
        {
          title: "Copilote Fidelisation",
          description: "Planifie entretiens annuels, controles, maintenance et offres speciales pour les clients existants.",
          features: ["Maintenance", "Controle", "Offres speciales", "Relances recurrentes"],
          savedTime: "5h/semaine",
          popularity: "76%",
          rating: "4,6/5",
          status: "Disponible"
        }
      ]
    },
    {
      id: "marketing",
      title: "Marketing",
      promise: "Publier plus souvent sans y passer les soirees.",
      copilots: [
        {
          title: "Copilote Reseaux Sociaux",
          description: "Transforme une photo en publications Facebook, Instagram, TikTok, Google Business Profile et LinkedIn.",
          features: ["Import photo", "Descriptions", "Hashtags", "Calendrier", "Multi-reseaux"],
          savedTime: "6h/semaine",
          popularity: "84%",
          rating: "4,7/5",
          status: "Disponible"
        }
      ]
    },
    {
      id: "finance",
      title: "Finance",
      promise: "Facturer plus vite et reduire les impayes.",
      copilots: [
        {
          title: "Copilote Facturation",
          description: "Transforme les devis en factures, suit Mollie/CB et relance les impayes avec statistiques.",
          features: ["Devis vers facture", "Mollie", "Paiement CB", "Relance impayes", "Stats paiement"],
          savedTime: "4h/semaine",
          popularity: "79%",
          rating: "4,6/5",
          status: "Disponible"
        }
      ]
    },
    {
      id: "pilotage",
      title: "Pilotage",
      promise: "Voir ce qui freine la croissance avant qu'il soit trop tard.",
      copilots: [
        {
          title: "Copilote Performance",
          description: "Analyse CA, conversion, appels, prospects et temps gagne, puis propose des ameliorations.",
          features: ["CA", "Conversion", "Appels", "Prospects", "Points faibles"],
          savedTime: "3h/semaine",
          popularity: "73%",
          rating: "4,8/5",
          status: "Disponible"
        }
      ]
    }
  ],
  extensionPoints: [
    "ModuleManifest",
    "AssistantManifest",
    "CopilotManifest",
    "WorkflowTrigger",
    "WorkflowAction",
    "BillingEntitlement",
    "BackendAdapter"
  ]
};

const marketplaceCatalog = [
  {
    id: "market-artisans",
    title: "Artisans du batiment",
    description: "Copilotes concus pour les interventions terrain, urgences, devis rapides et tournees optimisees.",
    copilots: [
      ["plumber", "Plombier", "Urgences fuite, ballon d'eau chaude, photos WhatsApp, qualification telephone et devis intervention.", "Intervention fuite", "9h/semaine", 18, "4,9/5", "96%", ["Telephone IA", "WhatsApp IA", "Devis IA", "Agenda IA"]],
      ["electrician", "Electricien", "Pannes, tableaux electriques, demandes de photos, priorite securite et planification rapide.", "Diagnostic tableau", "8h/semaine", 16, "4,8/5", "92%", ["Telephone IA", "WhatsApp IA", "Checklist photos", "Relance IA"]],
      ["mason", "Macon", "Chantiers, plans, estimation materiaux, suivi des etapes et documents clients.", "Suivi chantier", "7h/semaine", 14, "4,7/5", "84%", ["Devis IA", "Documents", "Agenda IA", "CRM IA"]],
      ["carpenter", "Menuisier", "Mesures, photos, variantes de materiaux, devis sur mesure et pose planifiee.", "Projet sur mesure", "6h/semaine", 13, "4,8/5", "86%", ["WhatsApp IA", "Devis IA", "Agenda IA", "Relance IA"]],
      ["pool", "Pisciniste", "Ouverture saison, hivernage, maintenance, photos bassin et relances recurrentes.", "Maintenance bassin", "7h/semaine", 15, "4,7/5", "79%", ["Agenda IA", "WhatsApp IA", "Fidelisation", "Facturation IA"]],
      ["heating", "Chauffagiste", "Entretien chaudiere, pannes chauffage, contrats annuels et rappels saisonniers.", "Contrat entretien", "10h/semaine", 19, "4,9/5", "91%", ["Telephone IA", "Agenda IA", "Fidelisation", "Facturation IA"]]
    ]
  },
  {
    id: "market-services",
    title: "Services locaux",
    description: "Copilotes pour remplir l'agenda, gerer les clients et automatiser les relances recurrentes.",
    copilots: [
      ["garage", "Garage", "Reception appels atelier, devis pieces, relances controle technique et suivi intervention vehicule.", "Planning atelier", "8h/semaine", 17, "4,8/5", "89%", ["Telephone IA", "Email IA", "Devis IA", "Relance IA"]],
      ["cleaning", "Nettoyage", "Contrats recurrents, preuves photos, planning equipe, relances et facturation mensuelle.", "Preuves avant/apres", "11h/semaine", 21, "4,9/5", "94%", ["Devis IA", "Agenda IA", "Documents", "Facturation IA"]],
      ["landscaper", "Paysagiste", "Visites terrain, entretien annuel, saisonnalite, devis jardin et planning equipe.", "Tournee jardin", "7h/semaine", 15, "4,7/5", "82%", ["Agenda IA", "Devis IA", "Relance IA", "Marketing IA"]]
    ]
  },
  {
    id: "market-business",
    title: "PME et professions",
    description: "Copilotes pour accueil, reservations, rendez-vous, avis Google et performance commerciale.",
    copilots: [
      ["restaurant", "Restaurant", "Reservations, demandes groupes, avis clients, campagnes heures creuses et messages sociaux.", "Reservations groupe", "6h/semaine", 14, "4,8/5", "88%", ["WhatsApp IA", "Messenger IA", "Avis Google IA", "Marketing IA"]],
      ["dentist", "Dentiste", "Rappels rendez-vous, urgences patient, preparation consultation et suivi post-visite.", "Rappels patient", "9h/semaine", 18, "4,9/5", "90%", ["Telephone IA", "Agenda IA", "Email IA", "Relance IA"]],
      ["real-estate", "Immobilier", "Qualification acquereurs, visites, relances mandat, syntheses biens et suivi pipeline.", "Visites qualifiees", "10h/semaine", 20, "4,8/5", "87%", ["Email IA", "Agenda IA", "CRM IA", "Marketing IA"]]
    ]
  },
  {
    id: "market-custom",
    title: "Sur mesure",
    description: "Copilote concu autour de vos processus, logiciels, equipe et objectifs business.",
    copilots: [
      ["custom", "Copilote IA personnalise", "Nous concevons un copilote IA sur devis, connecte a vos outils, vos processus et vos cas metier.", "Etude personnalisee", "Variable", 0, "Sur devis", "Premium", ["Audit processus", "Workflows dedies", "Connecteurs API", "Accompagnement"]]
    ]
  }
].map((category) => ({
  ...category,
  copilots: category.copilots.map(([id, name, description, capture, savedTime, automations, rating, popularity, included]) => ({
    id,
    name,
    description,
    capture,
    savedTime,
    automations,
    rating,
    popularity,
    included,
    installed: id === "plumber"
  }))
}));

const commercialSuite = {
  plans: [
    {
      name: "Starter",
      price: "79 EUR",
      target: "Independants et petites equipes",
      trial: "14 jours gratuits",
      description: "CRM, devis IA, relances email, centre documents et 2 copilotes inclus.",
      features: ["2 utilisateurs", "500 automatisations/mois", "CRM complet", "Devis IA", "Support email"],
      highlighted: false
    },
    {
      name: "Pro",
      price: "149 EUR",
      target: "Artisans avec volume d'appels",
      trial: "14 jours gratuits",
      description: "Telephone IA, WhatsApp IA, agenda intelligent, avis Google et marketplace metier.",
      features: ["5 utilisateurs", "2 500 automatisations/mois", "Telephone IA", "WhatsApp IA", "Google Calendar", "Avis Google"],
      highlighted: true
    },
    {
      name: "Scale",
      price: "299 EUR",
      target: "PME multi-equipes",
      trial: "30 jours accompagnes",
      description: "Workflows avances, API, webhooks, licences equipe, roles et support prioritaire.",
      features: ["15 utilisateurs", "10 000 automatisations/mois", "API", "Webhooks", "Licences equipe", "Support prioritaire"],
      highlighted: false
    },
    {
      name: "Sur mesure",
      price: "Sur devis",
      target: "Processus metier specifiques",
      trial: "Audit offert",
      description: "Copilote IA personnalise, connecteurs dedies, accompagnement et SLA.",
      features: ["Copilote dedie", "Connecteurs metier", "Onboarding equipe", "SLA", "Succes manager"],
      highlighted: false
    }
  ],
  subscriptions: [
    ["Atelier Perrin", "Pro", "149 EUR/mois", "Actif", "Renouvellement 01/08/2026"],
    ["Roux Nettoyage Pro", "Scale", "299 EUR/mois", "Actif", "Renouvellement 03/08/2026"],
    ["Belkacem Paysage", "Starter", "79 EUR/mois", "Essai gratuit", "Fin essai 24/07/2026"],
    ["Cabinet Lacroix Dentaire", "Pro", "149 EUR/mois", "Paiement en attente", "Carte a verifier"]
  ],
  billingEvents: [
    ["Paiement Mollie", "Roux Nettoyage Pro", "299 EUR", "Reussi"],
    ["Essai gratuit", "Belkacem Paysage", "14 jours", "Actif"],
    ["Facture abonnement", "Atelier Perrin", "149 EUR", "Envoyee"],
    ["Carte expiree", "Cabinet Lacroix Dentaire", "149 EUR", "Action requise"]
  ],
  licenses: [
    ["Admin", "4 licences", "3 utilisees", "Acces complet"],
    ["Manager", "8 licences", "6 utilisees", "CRM, devis, agenda"],
    ["Terrain", "12 licences", "9 utilisees", "RDV, photos, commentaires"]
  ],
  coupons: [
    ["QUALIFYR-START", "-20% pendant 3 mois", "Actif", "18 utilisations"],
    ["ARTISAN2026", "1 mois offert", "Actif", "7 utilisations"],
    ["PARTENAIRE-LYON", "-15% annuel", "Planifie", "0 utilisation"]
  ],
  referrals: [
    ["Hugo Perrin", "Garage Martin", "1 mois offert", "Valide"],
    ["Benedicte Roux", "Nettoyage Alpes", "50 EUR credit", "En attente"],
    ["Julien Arnaud", "Chauffage Est", "1 mois offert", "Invite envoye"]
  ],
  emails: [
    ["Bienvenue essai gratuit", "Envoye apres inscription", "98% delivrabilite"],
    ["Activation Mollie", "Envoye apres abonnement", "96% delivrabilite"],
    ["Devis signe", "Confirmation client", "99% delivrabilite"],
    ["Relance impaye", "J+3 et J+7", "92% delivrabilite"],
    ["Fin d'essai", "J-3 avant conversion", "94% delivrabilite"]
  ],
  tutorials: [
    ["Configurer Telephone IA", "8 min", "Video + checklist"],
    ["Connecter Google Calendar", "5 min", "Guide OAuth"],
    ["Creer un devis IA", "6 min", "Cas plombier"],
    ["Installer un copilote metier", "4 min", "Marketplace"],
    ["Inviter son equipe", "3 min", "Licences et roles"]
  ],
  faq: [
    ["Peut-on essayer sans carte bancaire ?", "Oui, l'essai gratuit peut etre active sans paiement pour les plans Starter et Pro."],
    ["Mollie est-il obligatoire ?", "Non, Mollie est prevu pour la production, mais les devis et factures restent utilisables sans paiement en ligne."],
    ["Les appels IA sont-ils inclus ?", "Ils sont inclus dans Pro et Scale avec des limites d'usage configurables."],
    ["Peut-on ajouter un metier ?", "Oui, les copilotes marketplace sont declaratifs et extensibles."],
    ["Ou sont stockees les cles API ?", "Cote serveur uniquement, jamais dans le client."]
  ],
  support: [
    ["Chat support", "Temps moyen 4 min", "Ouvert"],
    ["Email support", "support@qualifyr-ai.fr", "Priorite Pro"],
    ["Onboarding accompagne", "Session 45 min", "Inclus Scale"],
    ["Base de connaissance", "42 articles", "Disponible"]
  ]
};

const subscriptionCenter = {
  currentPlan: {
    name: "Scale Automation",
    price: "299 EUR / mois",
    renewal: "01/08/2026",
    users: "4 utilisateurs actifs / 8 inclus",
    copilots: "12 copilotes inclus / 20",
    connections: "7 connexions incluses / 15",
    storage: "42 Go utilises / 100 Go",
    potential: 68
  },
  includedFeatures: ["Assistant IA", "Devis", "Factures", "Planning", "Google Calendar", "Gmail", "WhatsApp", "Documents", "Mes clients", "Relances simples"],
  premiumFeatures: [
    ["Telephone IA", "Repond aux appels quand vous etes occupe et cree le resume client.", "4 h / semaine", "Tres populaire", "Ne plus perdre les demandes urgentes."],
    ["WhatsApp IA avance", "Demande les photos, classe les messages et prepare les reponses.", "5 h / semaine", "Le plus installe", "Transformer les messages en devis plus vite."],
    ["Assistant Commercial IA", "Repere les opportunites et propose les meilleures relances.", "3 h / semaine", "Nouveau", "Signer plus de devis sans y penser."],
    ["Assistant Marketing IA", "Prepare publications, campagnes locales et offres saisonnieres.", "2 h / semaine", "Populaire", "Recevoir plus de demandes qualifiees."],
    ["Previsions IA", "Anticipe le chiffre d'affaires, la charge et les creux d'activite.", "1 h / semaine", "Pro", "Mieux organiser les prochaines semaines."],
    ["Analyse Business IA", "Explique les chiffres importants avec des actions simples.", "2 h / semaine", "Scale", "Savoir quoi ameliorer en premier."],
    ["Signature electronique", "Fait signer les devis en ligne et range les preuves.", "1 h / semaine", "Indispensable", "Faire accepter les devis plus rapidement."]
  ],
  optionShop: [
    ["Telephone IA", "+29 EUR / mois", "Repond aux appels et qualifie les urgences.", "4 h / semaine", "156 appels traites"],
    ["Avis Google IA", "+12 EUR / mois", "Demande les avis aux bons clients au bon moment.", "1 h / semaine", "15 avis obtenus"],
    ["Planning IA", "+15 EUR / mois", "Optimise les tournees et evite les oublis.", "2 h / semaine", "30 rendez-vous organises"],
    ["Marketing IA", "+39 EUR / mois", "Prepare publications, offres et campagnes locales.", "3 h / semaine", "12 contenus proposes"],
    ["Assistant Comptable IA", "+45 EUR / mois", "Suit les paiements, factures en retard et justificatifs.", "4 h / semaine", "35 factures suivies"]
  ],
  roi: {
    weeklySaved: "12 h 40",
    monthlySaved: "48 h 15",
    moneySaved: "1 860 EUR",
    prospectsRecovered: 18,
    callsHandled: 156,
    quotesFollowed: 24,
    reviewsWon: 10,
    tasksAutomated: 284,
    monthlyEstimate: "4 920 EUR / mois"
  },
  history: [
    ["Changement d'offre", "Passage vers Scale Automation", "01/07/2026"],
    ["Ajout d'un copilote", "WhatsApp IA avance active", "03/07/2026"],
    ["Paiement", "Facture abonnement reglee", "05/07/2026"],
    ["Facture", "QAI-SUB-2026-071 disponible", "05/07/2026"],
    ["Suppression", "Ancien acces invite retire", "08/07/2026"]
  ],
  licenses: [
    ["Dorian", "Administrateur", "Actif", "Tout l'espace"],
    ["Laura", "Manager", "Actif", "Clients, devis, planning"],
    ["Mathieu", "Terrain", "Actif", "Rendez-vous, photos"],
    ["Sophie", "Comptabilite", "Invitation envoyee", "Factures, paiements"]
  ],
  helpCenter: [
    ["FAQ", "Reponses simples aux questions frequentes.", "12 articles"],
    ["Tutoriels", "Guides pas a pas pour demarrer rapidement.", "8 videos"],
    ["Videos", "Demos courtes par metier et par objectif.", "14 contenus"],
    ["Support", "Aide humaine pour les reglages importants.", "Priorite Scale"],
    ["Documentation", "Parametres, facturation, equipes et securite.", "42 pages"]
  ],
  news: [
    ["Telephone IA", "Nouveau resume d'appel plus clair pour les urgences."],
    ["Planning IA", "Optimisation des trajets ajoutee aux rendez-vous."],
    ["Avis Google IA", "Filtre clients mecontents ameliore."],
    ["Devis IA", "Meilleure estimation de la main d'oeuvre."]
  ],
  ambassador: {
    link: "qualifyr.ai/invite/dorian-scale",
    invites: 7,
    rewards: "2 mois offerts + 50 EUR de credit"
  },
  rewards: [
    ["Temps gagne", "128 h", "Depuis votre inscription"],
    ["Entreprise autonome", "86%", "Niveau actuel"],
    ["Badges obtenus", "5", "Planning, Devis, Avis, Connexions, Relances"],
    ["Niveau actuel", "Performante", "Prochain niveau : Entreprise autonome"]
  ],
  recommendations: [
    ["Installer Telephone IA", "Vous manquez encore des appels pendant les interventions.", "4 h / semaine"],
    ["Activer Google Business", "Vous pouvez obtenir plus d'avis sans relance manuelle.", "2 h / semaine"],
    ["Creer une automatisation", "Vos devis en attente peuvent etre relances automatiquement.", "2 h / semaine"],
    ["Inviter votre collaborateur", "Une personne peut suivre les factures et documents.", "1 h / semaine"]
  ],
  paymentHistory: [
    ["QAI-SUB-2026-071", "05/07/2026", "299 EUR", "Payee"],
    ["QAI-SUB-2026-062", "05/06/2026", "149 EUR", "Payee"],
    ["QAI-OPTION-2026-061", "18/06/2026", "29 EUR", "Payee"],
    ["QAI-SUB-2026-052", "05/05/2026", "149 EUR", "Payee"]
  ],
  onboardingSteps: [
    ["Metier", "Plombier", "Les exemples et copilotes sont adaptes."],
    ["Objectifs", "Gagner du temps et signer plus de devis", "Les recommandations priorisent les relances."],
    ["Outils", "Google Calendar, Gmail, WhatsApp", "Les connexions utiles sont proposees en premier."],
    ["Niveau", "Equipe de 4 personnes", "Licences et roles prepares automatiquement."]
  ]
};

const clientSeeds = [
  ["Claire Martin", "SCI Les Tilleuls", "Plombier", "Appel", "Devis envoye", "18 rue Garibaldi, Lyon 6", "Fuite sous evier avec intervention souhaitee avant depart en vacances."],
  ["Hugo Perrin", "Atelier Perrin", "Garage automobile", "WhatsApp", "Contacte", "4 avenue Jean Jaures, Villeurbanne", "Automatiser les relances controle technique et remplir le planning atelier."],
  ["Benedicte Roux", "Roux Nettoyage Pro", "Societe de nettoyage", "Site", "Accepte", "22 chemin des Freres, Caluire", "Contrat mensuel bureaux 480 m2 avec preuves photos et planning equipe."],
  ["Nassim Belkacem", "Belkacem Paysage", "Paysagiste", "Instagram", "Relance", "9 route de Vienne, Saint-Priest", "Audit planning saisonnier et relance entretien espaces verts."],
  ["Julien Arnaud", "Arnaud Chauffage", "Chauffagiste", "Appel", "Client", "31 rue Paul Bert, Lyon 3", "Contrat entretien chaudiere et rappels saisonniers pour parc client."],
  ["Sophie Lacroix", "Cabinet Lacroix Dentaire", "Dentiste", "Email", "Contacte", "6 place Bellecour, Lyon 2", "Reduire les rendez-vous oublies et automatiser les rappels patients."],
  ["Karim Haddad", "Haddad Electricite", "Electricien", "Facebook", "Nouveau prospect", "12 rue des Martyrs, Bron", "Qualification des urgences tableau electrique et demandes de photos."],
  ["Marie Duval", "Restaurant Le Patio", "Restaurant", "Instagram", "Devis envoye", "15 quai Saint-Antoine, Lyon 2", "Gerer reservations groupes, avis Google et demandes privatisation."],
  ["Antoine Morel", "Morel Menuiserie", "Menuisier", "WhatsApp", "Accepte", "42 route de Grenoble, Saint-Priest", "Devis pose verriere, photos chantier et variantes materiaux."],
  ["Elena Garcia", "Garcia Immobilier", "Agence immobiliere", "Site", "Relance", "28 cours Vitton, Lyon 6", "Qualifier acheteurs, organiser visites et relancer les estimations."],
  ["Lucas Petit", "Petit Serrurerie", "Serrurier", "Appel", "Client", "7 rue de la Republique, Villeurbanne", "Urgences ouverture porte et devis remplacement serrure connectee."],
  ["Camille Bernard", "Bernard Piscines", "Pisciniste", "Google Business", "Contacte", "2 chemin du Moulin, Ecully", "Ouverture saison, hivernage et maintenance recurrente des bassins."],
  ["Thomas Leroy", "Leroy Couverture", "Couvreur", "Messenger", "Devis envoye", "18 rue des Canuts, Croix-Rousse", "Demande photos toiture, priorisation infiltration et devis rapide."],
  ["Ines Faure", "Faure Peinture", "Peintre", "Site", "Nouveau prospect", "5 rue Franklin, Oullins", "Chiffrage appartement 72 m2 avec planning travaux avant emménagement."],
  ["Victor Nguyen", "VN Carrosserie", "Carrossier", "Email", "Refuse", "66 avenue Franklin Roosevelt, Vaulx-en-Velin", "Demande devis carrosserie flotte utilitaire, budget reporte au trimestre prochain."],
  ["Amelie Perrier", "Perrier Maconnerie", "Macon", "Appel", "Accepte", "11 route de Genas, Meyzieu", "Reprise mur de cloture avec photos, plans et suivi intervention."],
  ["Olivier Mercier", "Mercier Nettoyage", "Societe de nettoyage", "Facebook", "Client", "3 rue de la Part-Dieu, Lyon 3", "Contrat entretien copropriete avec preuves photos hebdomadaires."],
  ["Nora Simon", "Simon Avocats", "Avocat", "Email", "Contacte", "21 rue Merciere, Lyon 2", "Automatiser qualification prospects et prise de rendez-vous cabinet."],
  ["Adrien Renaud", "Renaud Electricite", "Electricien", "WhatsApp", "Relance", "29 rue Baraban, Lyon 3", "Installer assistant telephone pour urgences soir et week-end."],
  ["Lea Marchand", "Boulangerie Marchand", "Restaurant", "Instagram", "Client", "8 rue Victor Hugo, Lyon 2", "Campagnes locales et demandes Google Business Profile."],
  ["Yanis Chevalier", "Chevalier Garage", "Garage automobile", "Appel", "Devis envoye", "47 rue Anatole France, Venissieux", "Reception appels atelier et relances devis pneus."],
  ["Manon Girard", "Girard Paysage", "Paysagiste", "Site", "Nouveau prospect", "14 chemin des Pins, Tassin", "Devis entretien annuel jardin et planning equipe."],
  ["Pierre Fontaine", "Fontaine Chauffage", "Chauffagiste", "Google Business", "Accepte", "71 rue Massena, Lyon 6", "Rappels entretien chaudiere et relances contrats annuels."],
  ["Sarah Michel", "Michel Architecture", "Autre", "Email", "Contacte", "19 quai Romain Rolland, Lyon 5", "Centraliser demandes clients et documents projet avant rendez-vous."],
  ["Romain Caron", "Caron Piscines", "Pisciniste", "WhatsApp", "Relance", "10 rue Pasteur, Caluire", "Photos bassin, devis robot piscine et maintenance estivale."],
  ["Eva Laurent", "Laurent Menuiserie", "Menuisier", "Appel", "Client", "33 rue Pierre Corneille, Lyon 6", "Suivi devis placards sur mesure et relance signature."],
  ["Mehdi Boucher", "Boucher Serrurerie", "Serrurier", "Messenger", "Nouveau prospect", "52 avenue Berthelot, Lyon 7", "Filtrer urgences et creer fiches clients automatiquement."],
  ["Chloe Vidal", "Vidal Couverture", "Couvreur", "Site", "Devis envoye", "6 montee de la Grande Cote, Lyon 1", "Infiltration toiture, photos drone et devis reparation."],
  ["Maxime Robin", "Robin Peinture", "Peintre", "Facebook", "Refuse", "24 rue Chevreul, Lyon 7", "Projet peinture local commercial reporte apres discussion budget."],
  ["Amina Collet", "Collet Immobilier", "Agence immobiliere", "Instagram", "Client", "39 cours Lafayette, Lyon 3", "Qualification acquereurs et rappels visites automatiques."],
  ["Damien Roche", "Roche Facades", "Macon", "Site", "Client", "12 rue Pasteur, Villeurbanne", "Ravalement facade, suivi chantier et documents avant reception."],
  ["Laura Millet", "Millet Nettoyage", "Societe de nettoyage", "Appel", "Accepte", "3 impasse des Iris, Bron", "Demande recurrente nettoyage cabinet medical avec planning fixe."],
  ["Samir Khelif", "Khelif Auto", "Garage automobile", "Google Business", "Devis envoye", "88 route de Vienne, Lyon 8", "Relances pneus hiver, appels atelier et suivi factures clients."],
  ["Pauline Gauthier", "Gauthier Piscines", "Pisciniste", "WhatsApp", "Contacte", "17 chemin Vert, Ecully", "Ouverture piscine familiale, photos bassin et devis traitement eau."],
  ["Noe Lambert", "Lambert Electricite", "Electricien", "Appel", "Nouveau prospect", "44 rue Marius Berliet, Lyon 8", "Urgence tableau electrique, besoin de rappel avant midi."],
  ["Maya Rolland", "Rolland Restaurant", "Restaurant", "Instagram", "Relance", "2 place Sathonay, Lyon 1", "Privatisation salle, devis groupe et demande acompte."],
  ["Quentin Borel", "Borel Couverture", "Couvreur", "Messenger", "Accepte", "6 rue des Alouettes, Caluire", "Reparation zinguerie, photos toiture et validation devis."],
  ["Fatou Diarra", "Diarra Menuiserie", "Menuisier", "Email", "Client", "27 rue Bossuet, Lyon 6", "Pose placards, suivi mesures et facture soldee."],
  ["Eliott Masson", "Masson Serrurerie", "Serrurier", "Facebook", "Devis envoye", "19 avenue Lacassagne, Lyon 3", "Remplacement serrure immeuble, devis envoye au syndic."],
  ["Helene Fabre", "Fabre Avocats", "Avocat", "Site", "Contacte", "10 rue President Carnot, Lyon 2", "Qualification prospects, rendez-vous cabinet et rappels email."]
];

const avatarPalette = ["#DCFCE7", "#F2EEE8", "#FFFFFF"];

const clients = clientSeeds.map(([name, company, profession, source, status, address, notes], index) => {
  const firstNameRaw = name.split(" ")[0];
  const lastNameRaw = name.split(" ").slice(1).join(" ");
  const firstName = firstNameRaw.toLowerCase();
  const lastName = lastNameRaw.replace(/\s+/g, ".").toLowerCase();
  const cityMatch = address.match(/,\s*(.+)$/);
  const city = cityMatch ? cityMatch[1] : "Lyon";
  const zipCodes = ["69001", "69002", "69003", "69006", "69100", "69500", "69600", "69800", "69130", "69200"];
  return {
    id: `c${index + 1}`,
    name,
    firstName: firstNameRaw,
    lastName: lastNameRaw,
    phone: `06 ${String(18 + index).padStart(2, "0")} ${String(42 + index).padStart(2, "0")} ${String(10 + index).padStart(2, "0")} ${String(70 + index).padStart(2, "0")}`,
    email: `${firstName}.${lastName}@${company.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}.fr`,
    address,
    city,
    postalCode: zipCodes[index % zipCodes.length],
    company,
    profession,
    source,
    status,
    notes,
    createdAt: `${String(1 + (index % 27)).padStart(2, "0")}/06/2026`,
    lastIntervention: `${String(1 + (index % 24)).padStart(2, "0")}/07/2026 - ${profession}`,
    nextAppointment: `${String(16 + (index % 10)).padStart(2, "0")}/07/2026 a ${String(8 + (index % 9)).padStart(2, "0")}:30`,
    quoteCount: 1 + (index % 5),
    totalBilled: 780 + index * 145,
    comments: [
      "Prefere les messages courts par WhatsApp.",
      "Disponible surtout en fin de journee.",
      "Souhaite recevoir les PDF par email."
    ][index % 3],
    archived: false,
    avatar: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='0 0 96 96'%3E%3Crect width='96' height='96' rx='24' fill='${encodeURIComponent(avatarPalette[index % avatarPalette.length])}'/%3E%3Ctext x='48' y='56' text-anchor='middle' font-family='Arial' font-size='28' font-weight='700' fill='%23111111'%3E${encodeURIComponent(name.split(" ").map((part) => part[0]).join(""))}%3C/text%3E%3C/svg%3E`,
    logo: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='96' viewBox='0 0 160 96'%3E%3Crect width='160' height='96' rx='22' fill='%23FFFFFF'/%3E%3Crect x='14' y='14' width='68' height='68' rx='18' fill='%23DCFCE7'/%3E%3Ctext x='48' y='58' text-anchor='middle' font-family='Arial' font-size='24' font-weight='700' fill='%23111111'%3E${encodeURIComponent(company.split(" ").map((part) => part[0]).slice(0, 2).join(""))}%3C/text%3E%3Cpath d='M96 34h42M96 48h30M96 62h36' stroke='%23111111' stroke-width='4' stroke-linecap='round'/%3E%3C/svg%3E`,
    history: [
      `${source} qualifie par Qualifyr AI`,
      `Fiche client enrichie avec metier ${profession}`,
      status === "Accepte" || status === "Client" ? "Devis signe et facture preparee" : "Prochaine action planifiee automatiquement"
    ],
    documents: [`Fiche-${company.replace(/\s+/g, "-")}.pdf`, `Devis-QAI-2026-${String(14 + index).padStart(3, "0")}.pdf`],
    photos: [`Photo chantier ${index + 1}`, `Document client ${index + 1}`]
  };
});

const prospects = clients.slice(0, 25).map((client, index) => ({
  id: `p${index + 1}`,
  name: client.name,
  company: client.company,
  phone: client.phone,
  email: client.email,
  city: client.city,
  source: client.source,
  need: client.notes,
  amount: 900 + index * 180,
  status: ["Nouveau", "A rappeler", "Devis envoye", "En attente", "Accepte", "Refuse", "Client"][index % 7],
  nextAction: ["Rappeler aujourd'hui", "Envoyer le devis", "Demander les photos", "Attendre validation", "Planifier intervention"][index % 5],
  createdAt: `${String(1 + (index % 20)).padStart(2, "0")}/07/2026`
}));

const quoteStatuses = ["Envoye", "Accepte", "Brouillon", "Relance", "Refuse"];
const quoteServices = [
  ["Diagnostic et qualification IA", 1, 120],
  ["Configuration assistant metier", 1, 290],
  ["Automatisation relance client", 1, 180],
  ["Synchronisation agenda", 1, 160],
  ["Generation devis et PDF", 1, 210],
  ["Workflow WhatsApp avec photos", 1, 240],
  ["Tableau de bord performance", 1, 190],
  ["Formation equipe 45 min", 1, 95]
];

const quotes = Array.from({ length: 60 }, (_, index) => {
  const client = clients[index % clients.length];
  const base = quoteServices[index % quoteServices.length];
  const second = quoteServices[(index + 3) % quoteServices.length];
  return {
    number: `QAI-2026-${String(index + 14).padStart(3, "0")}`,
    date: `${String(1 + (index % 28)).padStart(2, "0")}/07/2026`,
    client: client.name,
    status: quoteStatuses[index % quoteStatuses.length],
    signature: index % 5 === 1 ? "Signe electroniquement" : index % 5 === 2 ? "Non envoye" : "En attente",
    vat: index % 3 === 0 ? 10 : 20,
    labor: 120 + (index % 7) * 35,
    travel: 35 + (index % 4) * 15,
    discount: index % 6 === 0 ? 80 : 0,
    lines: [
      [base[0], base[1], base[2] + index * 8],
      [second[0], second[1], second[2] + index * 5],
      ["Suivi et support premium", 1, 79 + (index % 6) * 20]
    ]
  };
});

const appointments = Array.from({ length: 30 }, (_, index) => {
  const client = clients[index % clients.length];
  const hour = 8 + Math.floor(index / 2);
  const minute = index % 2 === 0 ? "00" : "30";
  const titles = ["Intervention client", "Audit automatisation", "Signature devis", "Configuration assistant", "Visite technique", "Point relance"];
  return [`${String(hour).padStart(2, "0")}:${minute}`, client.name, `${titles[index % titles.length]} - ${client.profession}`, `${12 + (index * 7) % 42} min trajet`, index % 3 === 0 ? "Outlook" : "Google Calendar"];
});

const invoices = Array.from({ length: 35 }, (_, index) => {
  const quote = quotes.filter((item) => item.status === "Accepte")[index % quotes.filter((item) => item.status === "Accepte").length];
  return {
    number: `F-2026-${String(index + 31).padStart(3, "0")}`,
    quote: quote.number,
    client: quote.client,
    status: ["Payee", "En attente", "En retard"][index % 3],
    amount: quoteSubtotal(quote),
    date: `${String(1 + (index % 28)).padStart(2, "0")}/07/2026`,
    dueDate: `${String(8 + (index % 20)).padStart(2, "0")}/08/2026`,
    payment: index % 3 === 0 ? "Virement recu" : index % 3 === 1 ? "Lien de paiement envoye" : "Relance prevue demain"
  };
});

const googleReviews = Array.from({ length: 10 }, (_, index) => {
  const client = clients[(index * 2) % clients.length];
  const ratings = [5, 5, 4, 5, 5, 4, 5, 3, 5, 4, 5, 5, 4, 5, 5];
  return {
    client: client.name,
    rating: ratings[index],
    text: ratings[index] >= 4 ? "Intervention rapide, suivi clair et devis tres professionnel." : "Client insatisfait detecte avant publication, rappel humain programme.",
    source: "Google Business Profile",
    date: `${String(1 + index).padStart(2, "0")}/07/2026`
  };
});

const conversations = Array.from({ length: 20 }, (_, index) => {
  const client = clients[(index * 3) % clients.length];
  const channels = ["Telephone", "WhatsApp", "Email", "Instagram", "Messenger"];
  return {
    client: client.name,
    channel: channels[index % channels.length],
    summary: `${client.profession} - besoin qualifie, prochaine action creee dans le CRM.`,
    lastMessage: index % 2 === 0 ? "Pouvez-vous me proposer un rendez-vous cette semaine ?" : "Je vous envoie les photos et dimensions dans la journee.",
    time: `Il y a ${index + 3} min`
  };
});

const documents = [
  ...clients.slice(0, 24).map((client, index) => ["Photo", `Photo-${client.company.replace(/\s+/g, "-")}-${index + 1}.jpg`, client.name, `Classe automatiquement dans ${client.profession}`]),
  ...invoices.map((invoice) => ["Facture", `${invoice.number}.pdf`, invoice.client, `${invoice.status} - liee au devis ${invoice.quote}`]),
  ...quotes.slice(0, 24).map((quote) => ["Devis", `${quote.number}.pdf`, quote.client, `Devis ${quote.status.toLowerCase()} avec TVA ${quote.vat}%`]),
  ["Contrat", "Contrat-maintenance-Roux-Nettoyage.pdf", "Benedicte Roux", "Contrat recurrent archive"],
  ["Plan", "Plan-bureaux-480m2.pdf", "Benedicte Roux", "Plan lie a l'intervention mensuelle"]
];

const notifications = Array.from({ length: 40 }, (_, index) => {
  const client = clients[index % clients.length];
  const types = ["Nouveau prospect", "Nouveau devis", "Relance", "Paiement", "Rendez-vous", "Document", "Avis Google", "Conversation"];
  const type = types[index % types.length];
  const messages = {
    "Nouveau prospect": `${client.name} vient d'etre qualifie depuis ${client.source}`,
    "Nouveau devis": `${quotes[index % quotes.length].number} prepare pour ${client.name}`,
    Relance: `${client.name} doit etre relance par ${index % 2 ? "WhatsApp" : "email"}`,
    Paiement: `${invoices[index % invoices.length].number} mis a jour : ${invoices[index % invoices.length].status}`,
    "Rendez-vous": `${appointments[index % appointments.length][2]} ajoute a ${appointments[index % appointments.length][4]}`,
    Document: `${documents[index % documents.length][1]} classe automatiquement`,
    "Avis Google": `Demande d'avis programmee pour ${client.name}`,
    Conversation: `${conversations[index % conversations.length].channel} resume dans l'historique client`
  };
  return [type, messages[type], index < 6 ? `Il y a ${4 + index * 7} min` : `Aujourd'hui ${String(9 + (index % 9)).padStart(2, "0")}:${index % 2 ? "15" : "45"}`];
});

const recentActivity = [
  ...notifications.slice(0, 12).map(([type, text, time]) => ({ type, text, time })),
  ...conversations.slice(0, 8).map((item) => ({ type: item.channel, text: `${item.client} - ${item.summary}`, time: item.time }))
];

const performanceStats = {
  newProspects: 37,
  estimatedRevenue: quotes.reduce((sum, quote) => sum + quoteSubtotal(quote), 0),
  signedRevenue: quotes.filter((quote) => quote.status === "Accepte").reduce((sum, quote) => sum + quoteSubtotal(quote), 0),
  conversion: 42,
  sentQuotes: quotes.filter((quote) => quote.status !== "Brouillon").length,
  acceptedQuotes: quotes.filter((quote) => quote.status === "Accepte").length,
  savedHours: 128,
  reviewsAverage: (googleReviews.reduce((sum, review) => sum + review.rating, 0) / googleReviews.length).toFixed(1).replace(".", ","),
  automations: 1847,
  savedMoney: 4860,
  chartRevenue: [6200, 7800, 6900, 9400, 11200, 10800, 13400, 15100],
  chartLeads: [14, 18, 16, 22, 28, 25, 31, 37]
};

function money(value, vat = 0) {
  const total = value * (1 + vat / 100);
  return `${Math.round(total).toLocaleString("fr-FR")} EUR`;
}

function quoteSubtotal(quote) {
  return quote.lines.reduce((sum, [, qty, price]) => sum + qty * price, 0);
}

function quoteTotal(quote) {
  const subtotal = quoteSubtotal(quote) + (quote.labor || 0) + (quote.travel || 0) - (quote.discount || 0);
  return subtotal * (1 + quote.vat / 100);
}

function getCopilotInsights() {
  const newProspects = clients.filter((client) => client.status === "Nouveau prospect").slice(0, 3);
  const quotesToFollow = quotes.filter((quote) => quote.status === "Relance").slice(0, 2);
  const todayAppointments = appointments.slice(0, 4);
  const unpaidInvoices = invoices.filter((invoice) => invoice.status === "En retard").slice(0, 1);
  const reviewsToManage = googleReviews.slice(0, 5);
  return {
    newProspects,
    quotesToFollow,
    todayAppointments,
    unpaidInvoices,
    reviewsToManage,
    recommended: [
      {
        title: `Relancer ${quotesToFollow[0]?.client || "le devis prioritaire"}`,
        reason: "Devis en attente avec forte probabilite de signature si relance dans la journee.",
        impact: "+1 240 EUR potentiel",
        view: "quotes"
      },
      {
        title: `Appeler ${newProspects[0]?.name || "le prospect le plus chaud"}`,
        reason: "Nouvelle demande non appelee, avec un besoin clair et une forte chance de rendez-vous.",
        impact: "RDV probable",
        view: "crm"
      },
      {
        title: "Optimiser la tournee de l'apres-midi",
        reason: "4 rendez-vous sont prevus, avec deux adresses proches qui peuvent etre mieux enchainees.",
        impact: "42 min gagnees",
        view: "calendar"
      },
      {
        title: `Traiter ${unpaidInvoices[0]?.number || "la facture impayee"}`,
        reason: "Une facture necessite une relance courte avec lien de paiement Mollie.",
        impact: "Encaissement accelere",
        view: "billing"
      },
      {
        title: "Envoyer les demandes d'avis Google",
        reason: "5 clients satisfaits sont eligibles apres intervention recente.",
        impact: "Reputation locale",
        view: "notifications"
      }
    ]
  };
}

function renderDashboard() {
  const copilot = getCopilotInsights();
  const attentionCards = [
    [copilot.newProspects.length, "Nouveaux clients", "A appeler ou classer aujourd'hui", "crm", "users"],
    [copilot.quotesToFollow.length, "Devis a envoyer", "Des demandes attendent une reponse", "quotes", "file"],
    [copilot.unpaidInvoices.length, "Facture en attente", "Un paiement peut etre recupere", "billing", "card"],
    [copilot.todayAppointments.length, "Rendez-vous", "Votre journee est deja organisee", "calendar", "calendar"],
    [copilot.reviewsToManage.length, "Avis Google", "De bons clients peuvent vous recommander", "notifications", "star"]
  ];
  const quickActions = [
    ["Ajouter un client", "crm", "users"],
    ["Creer un devis", "quotes", "file"],
    ["Planifier un rendez-vous", "calendar", "calendar"],
    ["Creer une facture", "billing", "card"],
    ["Installer une IA", "marketplace", "grid"],
    ["Demander a Qualifyr AI", "ai-center", "spark"]
  ];
  const assistantSuggestions = [
    ["Creer un devis pour M. Martin", "quotes"],
    ["Trouver le client Dupont", "crm"],
    ["Relancer mes devis", "quotes"],
    ["Ajouter un rendez-vous demain", "calendar"],
    ["Connecter WhatsApp", "integrations"],
    ["Voir mon planning", "calendar"],
    ["Creer un client", "crm"]
  ];
  const globalResults = [
    ...clients.slice(0, 4).map((client) => ["Client", client.name, `${client.phone} · ${client.address}`, "crm"]),
    ...prospects.slice(0, 3).map((prospect) => ["Prospect", prospect.name, `${prospect.status} · ${prospect.city}`, "crm"]),
    ...quotes.slice(0, 3).map((quote) => ["Devis", quote.number, `${quote.client} · ${money(quoteTotal(quote))}`, "quotes"]),
    ...invoices.slice(0, 3).map((invoice) => ["Facture", invoice.number, `${invoice.client} · ${invoice.status}`, "billing"])
  ];
  el("view-dashboard").innerHTML = `
    <div class="mobile-home">
      <div class="mobile-greeting">
        <p class="eyebrow">Accueil</p>
        <h2>Bonjour Dorian 👋</h2>
        <p>Aujourd'hui voici ce qui demande votre attention.</p>
      </div>
      <div class="mobile-summary-grid">
        ${attentionCards.slice(0, 4).map(([value, title, desc, view, icon]) => `<button class="card attention-card" data-view="${view}"><span>${svg(icon)}</span><strong>${value}</strong><b>${title}</b><small>${desc}</small></button>`).join("")}
      </div>
      <section class="mobile-section">
        <h3>Ce que je vous conseille</h3>
        ${copilot.recommended.slice(0, 4).map((action) => `<button class="mobile-list-card priority" data-view="${action.view}"><strong>${action.title}</strong><span>${action.reason}</span><small>${action.impact}</small></button>`).join("")}
      </section>
      <section class="mobile-section">
        <h3>Prochains rendez-vous</h3>
        ${copilot.todayAppointments.slice(0, 3).map(([time, client, title, travel]) => `<article class="mobile-list-card"><strong>${time}</strong><span>${title}</span><small>${client} · ${travel}</small></article>`).join("")}
      </section>
      <section class="mobile-section">
        <h3>Prospects recents</h3>
        ${copilot.newProspects.map((client) => `<button class="mobile-list-card client-row" data-client="${client.id}"><strong>${client.name}</strong><span>${client.notes}</span><small>${client.source} · ${client.phone}</small></button>`).join("")}
      </section>
      <section class="mobile-section">
        <h3>Notifications importantes</h3>
        ${notifications.slice(0, 3).map(([type, text, time]) => `<article class="mobile-list-card"><strong>${type}</strong><span>${text}</span><small>${time}</small></article>`).join("")}
      </section>
    </div>
    <section class="copilot-command">
      <div class="copilot-command-main">
        <p class="eyebrow">Accueil</p>
        <h2>Bonjour Dorian 👋</h2>
        <p>Aujourd'hui voici ce qui demande votre attention. Je vous montre seulement les actions utiles pour gagner du temps ou recuperer de l'argent.</p>
        <div class="copilot-today-grid">
          ${attentionCards.map(([value, title, desc, view, icon]) => `<button data-view="${view}"><span class="today-icon">${svg(icon)}</span><strong>${value}</strong><span>${title}</span><small>${desc}</small></button>`).join("")}
        </div>
      </div>
      <aside class="copilot-brain-card">
        <span class="status success">Pret a vous aider</span>
        <h3>Demander a Qualifyr AI</h3>
        <p>Faites une demande simple, comme si vous parliez a un employe.</p>
        <button class="primary-button big-ai-button" data-view="ai-center">${svg("spark")} ✨ Demander a Qualifyr AI</button>
      </aside>
    </section>

    <section class="section quick-actions-panel">
      <div class="section-header compact-header">
        <div>
          <p class="eyebrow">Boutons rapides</p>
          <h2>Que voulez-vous faire maintenant ?</h2>
        </div>
      </div>
      <div class="quick-action-grid">
        ${quickActions.map(([label, view, icon]) => `<button class="quick-action-card" data-view="${view}"><span>${svg(icon)}</span><strong>${label}</strong></button>`).join("")}
      </div>
    </section>

    <section class="section global-search-panel">
      <article class="card assistant-dialog">
        <p class="eyebrow">Recherche globale</p>
        <h2>Retrouver rapidement un client, un devis ou une facture.</h2>
        <div class="assistant-input-row">
          <input value="Martin, 06 18, QAI-2026, Lyon..." aria-label="Recherche globale">
          <button class="primary-button" data-view="crm">${svg("spark")} Rechercher</button>
        </div>
        <div class="global-result-grid">
          ${globalResults.map(([type, title, detail, view]) => `<button class="global-result-card" data-view="${view}"><span>${type}</span><strong>${title}</strong><small>${detail}</small></button>`).join("")}
        </div>
      </article>
    </section>

    <section class="section ai-conversation">
      <article class="card assistant-dialog">
        <p class="eyebrow">Mon assistant IA</p>
        <h2>Que puis-je faire pour vous aujourd'hui ?</h2>
        <div class="chat-bubble ai-bubble">
          <strong>Bonjour Dorian 👋</strong>
          <p>Aujourd'hui je te conseille de relancer le devis de M. Martin. Tu peux recuperer 2 400 EUR.</p>
        </div>
        <div class="chat-bubble ai-bubble">
          <p>Pense aussi a envoyer une demande d'avis Google a Dupont. Tu as gagne environ 2 h 35 cette semaine grace a mes actions.</p>
        </div>
        <div class="assistant-input-row">
          <input value="Ecrivez votre demande ici..." aria-label="Demander a Qualifyr AI">
          <button class="primary-button" data-view="crm">${svg("spark")} Demander</button>
        </div>
        <div class="suggestion-chips">
          ${assistantSuggestions.map(([text, view]) => `<button data-view="${view}">${text}</button>`).join("")}
        </div>
      </article>
    </section>

    <section class="section recommended-actions">
      <div class="section-header compact-header">
        <div>
          <p class="eyebrow">Actions recommandees</p>
          <h2>Ce que je vous conseille de faire aujourd'hui.</h2>
          <p>Les priorites sont choisies selon vos clients, vos devis, votre planning, vos factures et vos avis Google.</p>
        </div>
      </div>
      <div class="grid grid-3">
        ${copilot.recommended.map((action, index) => `
          <article class="card recommendation-card">
            <span class="status success">Priorite ${index + 1}</span>
            <h3>${action.title}</h3>
            <p>${action.reason}</p>
            <div class="list-row"><span>Impact estime</span><strong>${action.impact}</strong></div>
            <button class="secondary-button" data-view="${action.view}">Ouvrir</button>
          </article>
        `).join("")}
      </div>
    </section>
    <section class="section">
      <div class="section-header compact-header">
        <div>
          <p class="eyebrow">Mon activite</p>
          <h2>Ce qui s'est passe dans l'entreprise.</h2>
          <p>Devis crees, clients ajoutes, factures payees, rendez-vous deplaces et aides activees.</p>
        </div>
        <button class="secondary-button" data-view="notifications">Voir toutes les alertes</button>
      </div>
      <div class="card activity-timeline">
        ${[
          ["Devis cree", `${quotes[0].number} pour ${quotes[0].client}`, "Il y a 8 min"],
          ["Client ajoute", `${clients[clients.length - 1].name} ajoute depuis le site`, "Il y a 18 min"],
          ["Facture payee", `${invoices[0].number} reglee par virement`, "Il y a 32 min"],
          ["Rendez-vous deplace", `${appointments[2][1]} passe a ${appointments[2][0]}`, "Il y a 45 min"],
          ["Automatisation activee", "Relance devis en attente", "Il y a 1 h"],
          ...recentActivity.slice(0, 8).map((item) => [item.type, item.text, item.time])
        ].map(([type, text, time]) => `<div class="list-row"><span><strong>${type}</strong><br><small class="mini-muted">${text}</small></span><strong>${time}</strong></div>`).join("")}
      </div>
    </section>
  `;
}

function renderCrm() {
  const visibleClients = clients.filter((client) => !state.crmSearch || `${client.name} ${client.phone} ${client.email} ${client.company}`.toLowerCase().includes(state.crmSearch.toLowerCase()));
  const prospectStatuses = ["Nouveau", "A rappeler", "Devis envoye", "En attente", "Accepte", "Refuse", "Client"];
  el("view-crm").innerHTML = `
    <div class="section-header">
      <div>
        <p class="eyebrow">Mes clients</p>
        <h2>Je veux voir mes clients.</h2>
        <p>Recherchez une personne, retrouvez son telephone, son adresse, ses devis et ce qu'il faut faire ensuite.</p>
      </div>
      <button class="primary-button" id="addLead">${svg("users")} Ajouter un client</button>
    </div>
    <div class="grid grid-4">
      ${metric("Clients", clients.length, "Fiches actives")}
      ${metric("Prospects", prospects.length, "A suivre")}
      ${metric("Montant facture", money(clients.reduce((sum, client) => sum + client.totalBilled, 0)), "Historique clients")}
      ${metric("Doublons possibles", "3", "Fusion en attente")}
    </div>
    <div class="toolbar">
      <input id="crmSearch" class="search-input" value="${state.crmSearch || ""}" placeholder="Rechercher un nom, un telephone ou une entreprise" aria-label="Rechercher un client">
      <select id="crmFilter"><option>Tous les clients</option><option>Nouveaux prospects</option><option>Devis a suivre</option><option>Clients actifs</option></select>
      <select id="crmSort"><option>Trier par derniere intervention</option><option>Trier par ville</option><option>Trier par montant facture</option><option>Trier par date de creation</option></select>
      <button class="secondary-button" data-view="client-profile">Ouvrir une fiche client</button>
      <button class="secondary-button crm-bulk-action" data-action="archive">Archiver</button>
      <button class="secondary-button crm-bulk-action" data-action="merge">Fusionner les doublons</button>
      <button class="danger-button crm-bulk-action" data-action="delete">Supprimer</button>
    </div>
    <div class="section client-simple-grid">
      ${visibleClients.map((client, index) => {
        const appointment = appointments[index % appointments.length];
        const clientQuotes = quotes.filter((quote) => quote.client === client.name);
        const fallbackQuote = quotes[index % quotes.length];
        const invoice = invoices[index % invoices.length];
        const lastHistory = client.history[0] || client.notes;
        return `
          <button class="card client-simple-card client-row" data-client="${client.id}">
            <span class="client-identity"><img src="${client.avatar}" alt=""><span><strong>${client.name}</strong><small>${client.company}</small></span></span>
            <div class="client-simple-lines">
              <span><strong>Telephone</strong>${client.phone}</span>
              <span><strong>Email</strong>${client.email}</span>
              <span><strong>Adresse</strong>${client.address} · ${client.postalCode}</span>
              <span><strong>Date de creation</strong>${client.createdAt}</span>
              <span><strong>Derniere intervention</strong>${lastHistory}</span>
              <span><strong>Prochain rendez-vous</strong>${appointment ? `${appointment[0]} · ${appointment[2]}` : "A planifier"}</span>
              <span><strong>Devis</strong>${client.quoteCount} devis · ${clientQuotes[0]?.number || fallbackQuote.number}</span>
              <span><strong>Factures</strong>${money(client.totalBilled)} facture · ${invoice.status}</span>
              <span><strong>Documents</strong>${client.documents.length} fichiers · ${client.photos.length} photos</span>
              <span><strong>Commentaires</strong>${client.comments}</span>
            </div>
          </button>
        `;
      }).join("")}
    </div>
    <section class="section">
      <div class="section-header compact-header">
        <div>
          <p class="eyebrow">Mes prospects</p>
          <h2>Suivre les demandes avant qu'elles deviennent clientes.</h2>
        </div>
        <div class="section-actions">
          <button class="secondary-button">Vue liste</button>
          <button class="primary-button">Vue Kanban</button>
        </div>
      </div>
      <div class="toolbar">
        <input class="search-input" value="Rechercher un prospect" aria-label="Rechercher un prospect">
        <select><option>Tous les statuts</option>${prospectStatuses.map((status) => `<option>${status}</option>`).join("")}</select>
        <select><option>Toutes les sources</option><option>Site</option><option>WhatsApp</option><option>Appel</option><option>Instagram</option></select>
      </div>
      <div class="prospect-kanban">
        ${prospectStatuses.map((status) => `
          <section class="pipeline-column">
            <strong>${status}</strong>
            ${prospects.filter((prospect) => prospect.status === status).map((prospect) => `
              <article class="pipeline-card">
                <span class="status success">${prospect.source}</span>
                <h3>${prospect.name}</h3>
                <p>${prospect.need}</p>
                <div class="list-row"><span>${prospect.phone}</span><strong>${money(prospect.amount)}</strong></div>
                <small>${prospect.nextAction}</small>
              </article>
            `).join("")}
          </section>
        `).join("")}
      </div>
    </section>
  `;
}

function renderClientProfile() {
  const client = clients.find((item) => item.id === state.selectedClientId) || clients[0];
  const clientQuotes = quotes.filter((quote) => quote.client === client.name).slice(0, 6);
  const clientInvoices = invoices.filter((invoice) => invoice.client === client.name).slice(0, 4);
  const clientConversations = conversations.filter((conversation) => conversation.client === client.name).slice(0, 4);
  const clientReviews = googleReviews.filter((review) => review.client === client.name).slice(0, 3);
  const clientDocuments = documents.filter((document) => document[2] === client.name).slice(0, 6);
  const relatedAppointments = appointments.filter((appointment) => appointment[1] === client.name).slice(0, 3);
  el("view-client-profile").innerHTML = `
    <div class="client-profile-hero">
      <img class="client-avatar" src="${client.avatar}" alt="">
      <div>
        <p class="eyebrow">Fiche client</p>
        <h2>${client.name}</h2>
        <p>${client.company} · ${client.address} · ${client.phone}</p>
        <div class="tag-list"><span class="tag">${client.profession}</span><span class="tag">${client.source}</span><span class="status success">${client.status}</span></div>
      </div>
      <button class="secondary-button" data-view="crm">Retour aux clients</button>
    </div>
    <div class="grid grid-3">
      <article class="card"><h3>Coordonnees</h3><p>${client.email}<br>${client.phone}<br>${client.address}</p><img class="company-logo" src="${client.logo}" alt=""></article>
      <article class="card"><h3>Notes</h3><p>${client.notes}</p></article>
      <article class="card"><h3>Documents & photos</h3><p>${clientDocuments.length + client.documents.length} documents · ${client.photos.length} photos</p><button class="secondary-button" data-view="documents">Voir les fichiers</button></article>
    </div>
    <div class="section grid grid-2">
      <article class="card"><p class="eyebrow">Historique</p>${client.history.map((item) => `<div class="list-row"><span>${item}</span><strong>IA</strong></div>`).join("")}</article>
      <article class="card"><p class="eyebrow">Activite</p>
        <div class="list-row"><span>Appels</span><strong>${clientConversations.filter((item) => item.channel === "Telephone").length + 1}</strong></div>
        <div class="list-row"><span>Messages</span><strong>${clientConversations.length + 2}</strong></div>
        <div class="list-row"><span>Devis</span><strong>${clientQuotes.length}</strong></div>
        <div class="list-row"><span>Factures</span><strong>${clientInvoices.length}</strong></div>
        <div class="list-row"><span>Photos</span><strong>${client.photos.length}</strong></div>
        <div class="list-row"><span>Interventions</span><strong>${relatedAppointments.length}</strong></div>
      </article>
    </div>
    <div class="section grid grid-2">
      <article class="card"><p class="eyebrow">Conversations</p>${(clientConversations.length ? clientConversations : conversations.slice(0, 3)).map((item) => `<div class="list-row"><span><strong>${item.channel}</strong><br><small class="mini-muted">${item.lastMessage}</small></span><strong>${item.time}</strong></div>`).join("")}</article>
      <article class="card"><p class="eyebrow">Devis et factures</p>${clientQuotes.map((quote) => `<div class="list-row"><span>${quote.number} · ${quote.status}</span><strong>${money(quoteSubtotal(quote), quote.vat)}</strong></div>`).join("")}${clientInvoices.map((invoice) => `<div class="list-row"><span>${invoice.number} · ${invoice.status}</span><strong>${money(invoice.amount)}</strong></div>`).join("")}</article>
      <article class="card"><p class="eyebrow">Documents</p>${(clientDocuments.length ? clientDocuments : documents.slice(0, 4)).map(([type, name]) => `<div class="list-row"><span>${name}</span><strong>${type}</strong></div>`).join("")}</article>
      <article class="card"><p class="eyebrow">Avis Google</p>${(clientReviews.length ? clientReviews : googleReviews.slice(0, 3)).map((review) => `<div class="list-row"><span>${review.text}</span><strong>${review.rating}/5</strong></div>`).join("")}</article>
    </div>
  `;
}

function renderQuotes() {
  el("view-quotes").innerHTML = `
    <div class="section-header">
      <div>
        <p class="eyebrow">Mes devis</p>
        <h2>Je veux faire un devis.</h2>
        <p>${quotes.length} devis avec numero, date, TVA, prestations, main d'oeuvre, deplacement, remise, signature et statut.</p>
      </div>
      <div class="section-actions">
        <button class="secondary-button export-action" data-format="pdf">Exporter PDF</button>
        <button class="secondary-button export-action" data-format="excel">Exporter Excel</button>
        <button class="secondary-button export-action" data-format="csv">Exporter CSV</button>
        <button class="primary-button" id="updateQuote">${svg("file")} Creer un devis</button>
      </div>
    </div>
    <div class="grid grid-3">
      ${quotes.map((quote) => `
        <article class="card pricing-card">
          <p class="eyebrow">${quote.number} · ${quote.date}</p>
          <h3>${quote.client}</h3>
          <div class="price">${money(quoteTotal(quote))}</div>
          <span class="status ${quote.status === "Accepte" ? "success" : quote.status === "Brouillon" ? "warning" : "success"}">${quote.status}</span>
          ${quote.lines.map(([name, qty, price]) => `<div class="quote-line"><span>${qty} x ${name}</span><strong>${price} EUR</strong></div>`).join("")}
          <div class="quote-line"><span>Main d'oeuvre</span><strong>${quote.labor} EUR</strong></div>
          <div class="quote-line"><span>Deplacement</span><strong>${quote.travel} EUR</strong></div>
          <div class="quote-line"><span>Remise</span><strong>-${quote.discount} EUR</strong></div>
          <p class="mini-muted">TVA ${quote.vat}% · Signature : ${quote.signature}</p>
          <div class="hero-actions">
            <button class="secondary-button quote-action" data-action="edit">Modifier</button>
            <button class="secondary-button quote-action" data-action="duplicate">Dupliquer</button>
            <button class="secondary-button quote-action" data-action="send">Envoyer</button>
            <button class="secondary-button quote-action" data-action="pdf">Telecharger</button>
            <button class="primary-button quote-action" data-action="invoice">Transformer en facture</button>
          </div>
        </article>
      `).join("")}
    </div>
  `;
}

function renderCalendar() {
  el("view-calendar").innerHTML = `
    <div class="section-header">
      <div>
        <p class="eyebrow">Mon planning</p>
        <h2>Je veux voir mon planning.</h2>
        <p>${appointments.length} rendez-vous avec le client, l'adresse utile et le temps de trajet.</p>
      </div>
      <div class="section-actions">
        <button class="secondary-button">${svg("calendar")} Connecter mon agenda</button>
        <button class="primary-button">${svg("calendar")} Ajouter un rendez-vous</button>
      </div>
    </div>
    <div class="segmented planning-tabs"><button class="active">Aujourd'hui</button><button>Demain</button><button>Cette semaine</button></div>
    <div class="section calendar-list">
      ${appointments.map(([time, client, title, travel, source], index) => `
        <article class="card appointment">
          <strong>${time}</strong>
          <div><h3>${title}</h3><p>${client} · ${clients.find((item) => item.name === client)?.address || "Adresse client"} · ${travel} · Devis ${quotes[index % quotes.length]?.number || "a associer"} · ${source}</p></div>
          <span class="appointment-actions">
            <button class="secondary-button appointment-action" data-action="edit">Modifier</button>
            <button class="secondary-button appointment-action" data-action="move">Deplacer</button>
            <button class="danger-button appointment-action" data-action="delete">Supprimer</button>
          </span>
        </article>
      `).join("")}
    </div>
  `;
}

const digitalEmployees = [
  {
    icon: "📞",
    name: "Telephone IA",
    category: "📞 Communication",
    description: "Repond automatiquement aux appels, pose les bonnes questions, resume la conversation, cree un prospect et propose un rendez-vous.",
    savedTime: "8h / semaine",
    popularity: "96%",
    companies: "1 248 entreprises",
    rating: "4,9/5",
    status: "Installe",
    health: "🟢 Fonctionne parfaitement",
    capture: "Appels pris, resumes et rendez-vous proposes",
    example: "Un client appelle pour une fuite. Telephone IA qualifie l'urgence, note l'adresse et propose un creneau.",
    configuration: ["Horaires", "Questions metier", "Urgences", "Transfert humain"],
    stats: ["184 appels traites", "47 rendez-vous crees", "31 prospects ajoutes"],
    history: ["Appel Claire Martin resume", "Urgence Haddad priorisee", "RDV Julien Arnaud confirme"],
    features: ["Repond aux appels", "Detecte l'urgence", "Prend les coordonnees", "Cree un prospect", "Prend un rendez-vous"],
    compatibility: ["Plombier", "Garage", "Dentiste", "Restaurant"],
    faq: ["Peut-il transferer un appel urgent ?", "Oui, selon vos regles.", "Puis-je relire les resumes ?", "Oui, dans l'historique."]
  },
  {
    icon: "💬",
    name: "WhatsApp IA",
    category: "📞 Communication",
    description: "Repond automatiquement, qualifie le client, demande les informations utiles et cree automatiquement sa fiche.",
    savedTime: "6h / semaine",
    popularity: "93%",
    companies: "1 084 entreprises",
    rating: "4,8/5",
    status: "Installe",
    health: "🟢 Fonctionne parfaitement",
    capture: "Messages classes, photos demandees, clients crees",
    example: "Un client envoie une photo de toiture. WhatsApp IA demande l'adresse, le delai et prepare la fiche.",
    configuration: ["Ton des reponses", "Photos obligatoires", "Delais", "Validation humaine"],
    stats: ["326 messages traites", "63 photos recues", "28 clients crees"],
    history: ["Photo toiture recue", "Client Dupont qualifie", "Message garage repondu"],
    features: ["Repond automatiquement", "Demande les photos", "Qualifie la demande", "Cree le client"],
    compatibility: ["Artisans", "Garages", "Nettoyage", "Piscinistes"],
    faq: ["Repond-il sans validation ?", "Seulement si vous l'autorisez.", "Peut-il demander des photos ?", "Oui."]
  },
  {
    icon: "📧",
    name: "Email IA",
    category: "📞 Communication",
    description: "Classe les emails, repond aux demandes simples, cree les taches et propose des reponses pretes a envoyer.",
    savedTime: "4h / semaine",
    popularity: "82%",
    companies: "742 entreprises",
    rating: "4,7/5",
    status: "Disponible",
    health: "🟠 Necessite votre attention",
    capture: "Emails classes et reponses proposees",
    example: "Une demande de devis arrive par email. Email IA extrait le besoin et prepare une reponse claire.",
    configuration: ["Boite email", "Categories", "Signature", "Validation"],
    stats: ["27 emails classes", "19 reponses preparees", "11 taches creees"],
    history: ["Email cabinet classe", "Reponse restaurant proposee", "Tache chauffage creee"],
    features: ["Classe les emails", "Propose des reponses", "Cree des taches"],
    compatibility: ["Gmail", "Outlook", "Toutes PME"],
    faq: ["Envoie-t-il seul ?", "Non, vous pouvez valider avant envoi.", "Classe-t-il les pieces jointes ?", "Oui."]
  },
  {
    icon: "📄",
    name: "Devis IA",
    category: "📄 Commercial",
    description: "Prepare les devis, complete les informations, calcule les estimations et prepare le PDF.",
    savedTime: "5h / semaine",
    popularity: "94%",
    companies: "1 392 entreprises",
    rating: "4,9/5",
    status: "Installe",
    health: "🟢 Fonctionne parfaitement",
    capture: "Devis prepares avec TVA, lignes et PDF",
    example: "A partir d'un message WhatsApp, Devis IA propose les prestations, la main d'oeuvre et le total.",
    configuration: ["TVA", "Prestations", "Remises", "Signature"],
    stats: ["60 devis prepares", "12 acceptes", "18 a relancer"],
    history: ["Devis Martin prepare", "PDF Dupont genere", "Remise chantier appliquee"],
    features: ["Prepare les devis", "Calcule les estimations", "Prepare le PDF", "Rend tout modifiable"],
    compatibility: ["Tous metiers", "TVA", "PDF"],
    faq: ["Puis-je modifier le devis ?", "Oui, toujours.", "Le PDF est-il telechargeable ?", "Oui."]
  },
  {
    icon: "📅",
    name: "Planning IA",
    category: "📅 Organisation",
    description: "Optimise automatiquement les rendez-vous, reduit les deplacements et reorganise les journees.",
    savedTime: "7h / semaine",
    popularity: "88%",
    companies: "916 entreprises",
    rating: "4,8/5",
    status: "Installe",
    health: "🟢 Fonctionne parfaitement",
    capture: "Tournees optimisees et trajets reduits",
    example: "Planning IA regroupe deux rendez-vous proches pour eviter un aller-retour inutile.",
    configuration: ["Horaires", "Secteurs", "Duree trajet", "Temps tampon"],
    stats: ["30 rendez-vous suivis", "42 min gagnees aujourd'hui", "6 trajets optimises"],
    history: ["Tournee Lyon Est optimisee", "RDV 14h confirme", "Doublon evite"],
    features: ["Optimise les rendez-vous", "Reduit les trajets", "Evite les doublons"],
    compatibility: ["Google Calendar", "Outlook", "Equipe terrain"],
    faq: ["Peut-il deplacer un RDV ?", "Il propose, vous validez.", "Calcule-t-il les trajets ?", "Oui."]
  },
  {
    icon: "⭐",
    name: "Avis Google IA",
    category: "⭐ Reputation",
    description: "Envoie automatiquement les demandes d'avis, analyse les reponses et detecte les clients mecontents.",
    savedTime: "2h / semaine",
    popularity: "81%",
    companies: "688 entreprises",
    rating: "4,7/5",
    status: "Disponible",
    health: "🟠 Necessite votre attention",
    capture: "Avis demandes au bon moment",
    example: "Apres une intervention terminee, l'IA demande un avis au client satisfait et alerte si le client est mecontent.",
    configuration: ["Lien avis", "Filtre satisfaction", "Delai envoi", "Message"],
    stats: ["10 avis suivis", "6 demandes possibles", "2 clients rappeles"],
    history: ["Avis Claire demande", "Client insatisfait detecte", "Message Google prepare"],
    features: ["Demande les avis", "Detecte les problemes", "Suit la reputation"],
    compatibility: ["Google Business", "Artisans locaux", "Commerces"],
    faq: ["Evite-t-il les mauvais avis ?", "Il vous alerte avant publication.", "Le message est-il personnalisable ?", "Oui."]
  },
  {
    icon: "📸",
    name: "Reseaux Sociaux IA",
    category: "📸 Marketing",
    description: "Cree automatiquement des publications pour Facebook, Instagram, Google Business et LinkedIn.",
    savedTime: "6h / semaine",
    popularity: "84%",
    companies: "539 entreprises",
    rating: "4,7/5",
    status: "Disponible",
    health: "🔴 Configuration incomplete",
    capture: "Posts locaux crees depuis vos chantiers",
    example: "Une photo de chantier devient une publication Facebook, Instagram et Google Business.",
    configuration: ["Canaux", "Photos", "Ton", "Calendrier"],
    stats: ["21 contenus generes", "3 campagnes actives", "9 avis reutilises"],
    history: ["Post chaudiere cree", "Campagne printemps preparee", "Photo chantier transformee"],
    features: ["Cree des publications", "Adapte le ton", "Planifie les posts"],
    compatibility: ["Facebook", "Instagram", "Google Business", "LinkedIn"],
    faq: ["Publie-t-il seul ?", "Vous pouvez valider avant publication.", "Utilise-t-il les photos ?", "Oui."]
  },
  {
    icon: "💰",
    name: "Facturation IA",
    category: "💰 Finance",
    description: "Prepare les factures, suit les paiements et relance les impayes.",
    savedTime: "4h / semaine",
    popularity: "79%",
    companies: "604 entreprises",
    rating: "4,6/5",
    status: "Disponible",
    health: "🟠 Necessite votre attention",
    capture: "Factures suivies et impayes relances",
    example: "Une facture en retard est detectee. Facturation IA prepare un message court avec le lien de paiement.",
    configuration: ["TVA", "Paiement", "Delais", "Relances"],
    stats: ["35 factures suivies", "12 en retard", "11 payees"],
    history: ["Facture F-2026-031 suivie", "Relance impaye preparee", "Paiement marque"],
    features: ["Prepare les factures", "Suit les paiements", "Relance les impayes"],
    compatibility: ["Mollie", "PDF", "Comptabilite"],
    faq: ["Peut-il relancer automatiquement ?", "Oui, selon vos regles.", "Peut-il exporter ?", "Oui."]
  },
  {
    icon: "👥",
    name: "Relation Client IA",
    category: "⭐ IA Premium",
    description: "Suit les anciens clients, propose les relances, entretiens annuels, anniversaires et maintenances.",
    savedTime: "5h / semaine",
    popularity: "76%",
    companies: "512 entreprises",
    rating: "4,6/5",
    status: "Disponible",
    health: "🟢 Fonctionne parfaitement",
    capture: "Clients suivis apres intervention",
    example: "Un client chauffe-eau est relance un an apres l'installation pour l'entretien annuel.",
    configuration: ["Delais", "Types entretien", "Messages", "Offres"],
    stats: ["40 clients suivis", "18 relances proposees", "7 entretiens planifies"],
    history: ["Entretien Fontaine conseille", "Anniversaire client detecte", "Maintenance piscine proposee"],
    features: ["Suit les anciens clients", "Propose les relances", "Planifie la maintenance"],
    compatibility: ["Maintenance", "Contrats", "Clients recurrents"],
    faq: ["Peut-il relancer les anciens clients ?", "Oui.", "Peut-il proposer une maintenance ?", "Oui."]
  },
  {
    icon: "📈",
    name: "Performance IA",
    category: "🏢 Gestion",
    description: "Analyse l'activite, detecte les points faibles et donne des conseils simples.",
    savedTime: "3h / semaine",
    popularity: "73%",
    companies: "468 entreprises",
    rating: "4,8/5",
    status: "Premium",
    health: "🟢 Fonctionne parfaitement",
    capture: "Conseils simples pour mieux piloter",
    example: "Performance IA detecte que trop de devis restent sans reponse et conseille une relance automatique.",
    configuration: ["Objectifs", "Alertes", "Frequence", "Priorites"],
    stats: ["5 alertes utiles", "3 points faibles detectes", "12 conseils donnes"],
    history: ["Relance devis conseillee", "Agenda surcharge detecte", "Avis Google recommandes"],
    features: ["Analyse l'activite", "Detecte les points faibles", "Donne des conseils"],
    compatibility: ["Direction", "Equipe", "Abonnement superieur"],
    faq: ["Est-il reserve aux plans superieurs ?", "Oui.", "Donne-t-il des conseils simples ?", "Oui."]
  }
];

const businessPacks = [
  ["Pack Plombier", "Fuites, urgences, photos WhatsApp, tournee par secteur et relances devis.", "Telephone IA, WhatsApp IA, Devis IA, Planning IA", "11 h / semaine", "4 800 EUR / mois", 12],
  ["Pack Electricien", "Qualification securite, photos tableau, interventions urgentes et suivi clients.", "Telephone IA, Devis IA, Planning IA, Relation Client IA", "9 h / semaine", "3 900 EUR / mois", 10],
  ["Pack Chauffagiste", "Contrats entretien, rappels saisonniers, urgences panne et facturation.", "Telephone IA, Planning IA, Facturation IA, Relation Client IA", "10 h / semaine", "4 200 EUR / mois", 11],
  ["Pack Garage", "Appels atelier, controle technique, relances pneus, devis et planning equipe.", "Telephone IA, WhatsApp IA, Planning IA, Facturation IA", "12 h / semaine", "5 100 EUR / mois", 13],
  ["Pack Restaurant", "Reservations, groupes, avis Google, messages Instagram et relances evenements.", "WhatsApp IA, Reseaux Sociaux IA, Avis Google IA, Planning IA", "8 h / semaine", "3 200 EUR / mois", 9],
  ["Pack Paysagiste", "Saisonnalite, devis espaces verts, tournees, photos chantier et entretien recurrent.", "Planning IA, Devis IA, WhatsApp IA, Relation Client IA", "9 h / semaine", "3 700 EUR / mois", 10],
  ["Pack Nettoyage", "Contrats recurrents, preuves photos, planning equipe et factures mensuelles.", "Planning IA, Facturation IA, WhatsApp IA, Relation Client IA", "11 h / semaine", "4 600 EUR / mois", 12],
  ["Pack Dentiste", "Rendez-vous, rappels patients, emails, avis Google et suivi administratif.", "Email IA, Planning IA, Avis Google IA, Relation Client IA", "7 h / semaine", "2 900 EUR / mois", 8],
  ["Pack Immobilier", "Demandes visites, estimation, relances mandats, emails et planning.", "Email IA, Planning IA, Relation Client IA, Reseaux Sociaux IA", "10 h / semaine", "5 400 EUR / mois", 12],
  ["Pack Artisan", "Base complete pour appels, clients, devis, planning, documents et avis.", "Telephone IA, WhatsApp IA, Devis IA, Planning IA", "10 h / semaine", "4 100 EUR / mois", 11],
  ["Pack PME", "Pilotage equipe, facturation, performance, connexions et copilotes premium.", "Performance IA, Facturation IA, Email IA, Relation Client IA", "16 h / semaine", "7 800 EUR / mois", 16]
].map(([name, description, copilots, savedTime, roi, automations], index) => ({
  name,
  description,
  copilots,
  savedTime,
  roi,
  automations,
  scoreGain: 4 + (index % 5),
  models: "Devis, factures et tableaux de bord adaptes",
  connections: ["Google Calendar", "Gmail", "WhatsApp", "Mollie", "Google Business"][index % 5]
}));

const installationSteps = [
  ["1", "Presentation", "Qualifyr AI explique ce que le copilote va faire pour vous."],
  ["2", "Connexion des outils", "Les connexions recommandees sont proposees une par une."],
  ["3", "Configuration", "Les horaires, messages et regles sont pre-remplis selon votre metier."],
  ["4", "Premier test", "Une simulation montre exactement le resultat attendu."],
  ["5", "Validation", "Le copilote est active et pret a travailler."]
];

const productUpdates = [
  ["Nouveau copilote", "Telephone IA sait maintenant detecter une urgence avant de proposer un rendez-vous.", "Capture appels urgents", "Moins d'appels perdus"],
  ["Amelioration", "Planning IA regroupe mieux les adresses proches sur une meme tournee.", "Capture planning", "42 min gagnees aujourd'hui"],
  ["Fonction ajoutee", "Les packs metiers installent automatiquement devis, factures et recommandations.", "Capture pack", "Installation en moins de 2 min"],
  ["Correction", "Les demandes d'avis Google evitent mieux les clients insatisfaits.", "Capture reputation", "Avis plus qualitatifs"]
];

const aiModuleRecommendations = [
  ["Vous recevez beaucoup d'appels.", "Telephone IA est recommande.", "4 h / semaine", "marketplace"],
  ["Vous oubliez souvent les avis Google.", "Avis Google IA est recommande.", "2 h / semaine", "marketplace"],
  ["Vos devis restent trop longtemps sans reponse.", "Relance IA est recommandee.", "3 400 EUR recuperables", "automations"],
  ["Vos messages WhatsApp contiennent beaucoup de photos.", "WhatsApp IA avance est recommande.", "5 h / semaine", "marketplace"]
];

const tradeCopilots = [
  ["🔧", "Copilote Plombier", "Qualifie les urgences, demande photos, adresse, disponibilites et prepare le devis.", "Appels, WhatsApp, devis fuite, planning", "6 h / semaine", "149 EUR / mois", "Plombier"],
  ["⚡", "Copilote Electricien", "Trie les demandes, detecte les urgences securite et prepare les interventions.", "Photos tableau, urgence, devis, relance", "5 h / semaine", "149 EUR / mois", "Electricien"],
  ["🔥", "Copilote Chauffagiste", "Gere pannes, entretiens, rappels saisonniers et contrats de maintenance.", "Panne chaudiere, entretien, planning, facture", "7 h / semaine", "179 EUR / mois", "Chauffagiste"],
  ["🚗", "Copilote Garage", "Repond aux demandes atelier, organise les rendez-vous et relance les devis.", "Revision, pneus, devis, planning atelier", "8 h / semaine", "179 EUR / mois", "Garage"],
  ["🍽️", "Copilote Restaurant", "Gere reservations, messages, avis Google et publications locales.", "Reservations, avis, Instagram, evenements", "5 h / semaine", "129 EUR / mois", "Restaurant"],
  ["🦷", "Copilote Dentiste", "Prepare rappels patients, rendez-vous, messages et avis Google.", "Rappels, planning, emails, reputation", "4 h / semaine", "199 EUR / mois", "Dentiste"],
  ["🏡", "Copilote Immobilier", "Classe les demandes, propose visites, relance prospects et suit les mandats.", "Visites, leads, relances, dossiers", "7 h / semaine", "199 EUR / mois", "Immobilier"],
  ["🧼", "Copilote Nettoyage", "Gere demandes recurrentes, preuves photos, planning equipe et factures.", "Contrats, photos, planning, facture", "8 h / semaine", "179 EUR / mois", "Nettoyage"],
  ["🌿", "Copilote Paysagiste", "Prepare devis, tournees, entretiens saisonniers et suivi client.", "Photos jardin, devis, tournees, relances", "6 h / semaine", "149 EUR / mois", "Paysagiste"],
  ["🧱", "Copilote Macon", "Structure les demandes chantier, photos, metrage, devis et planning.", "Chantiers, photos, devis, interventions", "6 h / semaine", "149 EUR / mois", "Macon"],
  ["🪵", "Copilote Menuisier", "Qualifie les projets, collecte dimensions, photos et prepare les devis.", "Mesures, photos, devis, rendez-vous", "5 h / semaine", "149 EUR / mois", "Menuisier"],
  ["🤖", "Copilote sur mesure", "Un copilote adapte a votre metier, vos questions et votre facon de travailler.", "Formulaire, audit, configuration, test", "Sur mesure", "Sur devis", "Autre"]
].map(([emoji, name, description, includes, savedTime, price, profession]) => ({
  emoji,
  name,
  description,
  includes,
  savedTime,
  price,
  profession
}));

const copilotPlans = [
  ["Essentiel", "79 EUR / mois", "Pour tester un copilote sur un site vitrine.", ["Widget IA sur le site", "Formulaire intelligent", "Reception par email", "Historique des demandes"], "Recevoir par email"],
  ["Pro", "149 EUR / mois", "Le meilleur choix pour un artisan qui veut gagner du temps chaque semaine.", ["Copilote metier complet", "Ajout sur le site", "Espace Qualifyr AI", "Devis et relances", "Support prioritaire"], "Choisir Pro", true],
  ["Equipe", "299 EUR / mois", "Pour PME avec plusieurs utilisateurs, plusieurs canaux et besoin de suivi.", ["Plusieurs copilotes", "WhatsApp + email", "Planning et factures", "Statistiques avancees", "Onboarding personnalise"], "Parler a Qualifyr"]
].map(([name, price, description, features, cta, recommended]) => ({ name, price, description, features, cta, recommended }));

function renderCopilotLibrary(targetId) {
  const categories = ["📞 Communication", "📄 Commercial", "📅 Organisation", "💰 Finance", "⭐ Reputation", "📸 Marketing", "🏢 Gestion", "⭐ IA Premium", "🤖 IA personnalisees", "🛠️ IA sur mesure"];
  const installed = digitalEmployees.filter((item) => item.status === "Installe").length;
  const tasks = digitalEmployees.reduce((sum, item) => sum + Number((item.stats[0] || "0").match(/\d+/)?.[0] || 0), 0);
  const featured = digitalEmployees[0];
  const autonomyScore = 86;
  el(targetId).innerHTML = `
    <section class="trade-copilot-hero card">
      <div>
        <p class="eyebrow">Copilotes IA par metier</p>
        <h2>Un employe IA deja forme pour votre metier.</h2>
        <p>Le prospect choisit son metier, remplit un formulaire simple, puis il peut ajouter le copilote a son site ou recevoir chaque demande par email.</p>
        <div class="hero-actions">
          <button class="primary-button trade-scroll-form">${svg("spark")} Trouver mon copilote</button>
          <button class="secondary-button trade-scroll-pricing">Voir les tarifs</button>
        </div>
      </div>
      <div class="trade-widget-preview">
        <span>🤖</span>
        <strong>Bonjour, je suis l'assistant de votre entreprise.</strong>
        <small>Expliquez votre besoin, j'organise la suite.</small>
        <button class="primary-button">Demarrer</button>
      </div>
    </section>

    <section class="section trade-copilot-section">
      <div class="section-header compact-header">
        <div>
          <p class="eyebrow">Choisissez un metier</p>
          <h2>Le prospect comprend tout de suite ce qu'il achete.</h2>
          <p>Chaque copilote contient les questions, messages, devis et relances adaptes au metier.</p>
        </div>
      </div>
      <div class="trade-copilot-grid">
        ${tradeCopilots.map((copilot) => `
          <article class="card trade-copilot-card">
            <span class="trade-emoji">${copilot.emoji}</span>
            <h3>${copilot.name}</h3>
            <p>${copilot.description}</p>
            <div class="trade-includes">${copilot.includes}</div>
            <div class="trade-card-bottom">
              <span><strong>${copilot.savedTime}</strong><small>gagnees</small></span>
              <span><strong>${copilot.price}</strong><small>abonnement</small></span>
            </div>
            <div class="hero-actions">
              <button class="primary-button trade-copilot-install" data-trade="${copilot.profession}">Ajouter</button>
              <button class="secondary-button trade-copilot-email" data-trade="${copilot.profession}">Recevoir par email</button>
            </div>
          </article>
        `).join("")}
      </div>
    </section>

    <section class="section trade-lead-and-pricing">
      <article class="card trade-lead-form" id="tradeCopilotForm">
        <p class="eyebrow">Formulaire avant activation</p>
        <h2>Configurer le copilote en 2 minutes.</h2>
        <p>Le client donne les informations utiles. Qualifyr AI prepare ensuite le copilote sans reglages compliques.</p>
        <div class="trade-form-grid">
          <div class="field"><label>Metier</label><select><option>Plombier</option><option>Electricien</option><option>Garage</option><option>Restaurant</option><option>Dentiste</option><option>Autre</option></select></div>
          <div class="field"><label>Nom de l'entreprise</label><input value="Atelier Martin"></div>
          <div class="field"><label>Telephone</label><input value="06 18 42 90 15"></div>
          <div class="field"><label>Email</label><input value="contact@atelier-martin.fr"></div>
          <div class="field"><label>Ou installer le copilote ?</label><select><option>Sur mon site internet</option><option>Je veux le recevoir par email</option><option>Les deux</option></select></div>
          <div class="field"><label>Objectif principal</label><select><option>Ne plus perdre de demandes</option><option>Faire plus de devis</option><option>Gagner du temps au telephone</option><option>Relancer mes clients</option></select></div>
        </div>
        <button class="primary-button trade-form-submit">${svg("spark")} Preparer mon copilote</button>
      </article>
      <article class="card trade-marketing-card">
        <span class="status success">Formule conseillee</span>
        <h2>Vendre le copilote comme un employe IA.</h2>
        <p><strong>Promesse simple :</strong> “Votre assistant repond, qualifie et vous envoie les demandes pretes a traiter.”</p>
        <div class="list-row"><span>Prix d'appel</span><strong>79 EUR / mois</strong></div>
        <div class="list-row"><span>Offre recommandee</span><strong>149 EUR / mois</strong></div>
        <div class="list-row"><span>Positionnement</span><strong>Moins cher qu'un appel manque</strong></div>
      </article>
    </section>

    <section class="section trade-pricing-section" id="tradeCopilotPricing">
      <div class="section-header compact-header">
        <div>
          <p class="eyebrow">Abonnement mensuel</p>
          <h2>3 tarifs simples pour vendre sans expliquer.</h2>
          <p>Le meilleur compromis commercial est Pro a 149 EUR / mois : assez accessible pour un artisan, assez premium pour financer l'accompagnement.</p>
        </div>
      </div>
      <div class="trade-pricing-grid">
        ${copilotPlans.map((plan) => `
          <article class="card trade-plan-card ${plan.recommended ? "recommended" : ""}">
            ${plan.recommended ? `<span class="status success">Le plus vendu</span>` : ""}
            <h3>${plan.name}</h3>
            <strong class="trade-price">${plan.price}</strong>
            <p>${plan.description}</p>
            <ul>${plan.features.map((feature) => `<li>${feature}</li>`).join("")}</ul>
            <button class="${plan.recommended ? "primary-button" : "secondary-button"} trade-plan-select" data-plan="${plan.name}">${plan.cta}</button>
          </article>
        `).join("")}
      </div>
    </section>

    <div class="section-header">
      <div>
        <p class="eyebrow">✨ Bibliotheque des Copilotes</p>
        <h2>🤖 Mes copilotes IA</h2>
        <p>Choisissez les employes numeriques qui travailleront pour votre entreprise.</p>
      </div>
      <button class="secondary-button" data-view="custom-ai">IA sur mesure</button>
    </div>
    <div class="copilot-search-panel card">
      <div class="assistant-input-row">
        <input value="Repondre au telephone, creer des devis, WhatsApp, Google, emails..." aria-label="Rechercher un copilote">
        <button class="primary-button">${svg("spark")} Rechercher</button>
      </div>
      <div class="suggestion-chips">
        ${["Les plus populaires", "Les plus utilises", "Les nouveautes", "Recommandes pour vous"].map((filter) => `<button>${filter}</button>`).join("")}
      </div>
    </div>
    <div class="grid grid-4">
      ${metric("Copilotes installes", installed, "employes numeriques actifs")}
      ${metric("Temps economise", "54h", "par semaine")}
      ${metric("Taches realisees", tasks.toLocaleString("fr-FR"), "ce mois-ci")}
      ${metric("Argent economise", "8 420 EUR", "estimation mensuelle")}
    </div>

    <section class="section copilot-autonomy-hero">
      <div>
        <p class="eyebrow">Niveau de l'entreprise</p>
        <h2>Entreprise autonome : ${autonomyScore}/100</h2>
        <p>Chaque pack, copilote, mission automatique et connexion active augmente votre capacite a laisser Qualifyr AI travailler pour vous.</p>
        <div class="assistant-score-line"><span style="width:${autonomyScore}%"></span></div>
      </div>
      <div class="commercial-benefit-grid">
        <span><strong>54 h</strong><small>Temps gagne / semaine</small></span>
        <span><strong>${installed}</strong><small>Copilotes actifs</small></span>
        <span><strong>284</strong><small>Missions executees</small></span>
        <span><strong>7</strong><small>Connexions actives</small></span>
      </div>
    </section>

    <section class="section">
      <div class="section-header compact-header">
        <div>
          <p class="eyebrow">Packs metiers</p>
          <h2>Installez un metier complet en un clic.</h2>
          <p>Chaque pack active les copilotes IA, missions automatiques, connexions recommandees, parametres, modeles et tableaux de bord adaptes.</p>
        </div>
        <button class="primary-button pack-auto-install">${svg("spark")} ✨ Installer automatiquement</button>
      </div>
      <div class="business-pack-grid">
        ${businessPacks.map((pack) => `
          <article class="card business-pack-card">
            <span class="status success">+${pack.scoreGain} points autonomie</span>
            <h3>${pack.name}</h3>
            <p>${pack.description}</p>
            <div class="list-row"><span>Copilotes inclus</span><strong>${pack.copilots}</strong></div>
            <div class="list-row"><span>Missions automatiques</span><strong>${pack.automations}</strong></div>
            <div class="list-row"><span>Modeles inclus</span><strong>${pack.models}</strong></div>
            <div class="list-row"><span>Connexion recommandee</span><strong>${pack.connections}</strong></div>
            <div class="assistant-mini-grid">
              <span><strong>${pack.savedTime}</strong><small>Temps gagne</small></span>
              <span><strong>${pack.roi}</strong><small>ROI estime</small></span>
            </div>
            <div class="hero-actions">
              <button class="primary-button pack-install" data-pack="${pack.name}">Installer le pack</button>
              <button class="secondary-button pack-demo" data-pack="${pack.name}">Voir la demo</button>
            </div>
          </article>
        `).join("")}
      </div>
    </section>

    <section class="section grid grid-2">
      <article class="card demo-experience-card">
        <p class="eyebrow">Mode demonstration</p>
        <h2>Essayez un copilote avant de l'installer.</h2>
        <div class="digital-video">Simulation complete : appel entrant, qualification, devis prepare, rendez-vous cree.</div>
        <div class="assistant-mini-grid">
          <span><strong>3 scenarios</strong><small>Donnees fictives realistes</small></span>
          <span><strong>2 min</strong><small>Pour comprendre l'interet</small></span>
          <span><strong>100%</strong><small>Sans configuration technique</small></span>
        </div>
        <button class="primary-button demo-action">${svg("spark")} Lancer une demonstration</button>
      </article>
      <article class="card install-assistant-card">
        <p class="eyebrow">Assistant d'installation</p>
        <h2>Operationnel en moins de deux minutes.</h2>
        ${installationSteps.map(([step, title, description]) => `
          <div class="install-step">
            <strong>${step}</strong>
            <span><b>${title}</b><small>${description}</small></span>
          </div>
        `).join("")}
        <button class="primary-button pack-auto-install">${svg("spark")} ✨ Installer automatiquement</button>
      </article>
    </section>

    <section class="section">
      <div class="section-header compact-header">
        <div>
          <p class="eyebrow">Recommandations Qualifyr AI</p>
          <h2>Ce que votre entreprise devrait embaucher ensuite.</h2>
        </div>
      </div>
      <div class="grid grid-3">
        ${aiModuleRecommendations.map(([problem, action, impact, view]) => `<article class="card"><span class="module-icon">${svg("spark")}</span><h3>${problem}</h3><p>${action}</p><div class="list-row"><span>Impact estime</span><strong>${impact}</strong></div><button class="primary-button" data-view="${view}">${action}</button></article>`).join("")}
      </div>
    </section>
    <div class="copilot-category-tabs">
      ${categories.map((category) => `<button>${category}</button>`).join("")}
    </div>
    <article class="card premium-copilot-note">
      <span class="status warning">⭐ IA Premium</span>
      <strong>Reservee aux abonnements superieurs.</strong>
      <p>Ces copilotes analysent votre entreprise en profondeur et donnent des conseils de pilotage simples.</p>
    </article>
    <div class="copilot-library-grid">
      ${digitalEmployees.map((employee) => `
        <article class="card digital-employee-card">
          <div class="digital-shot">
            <span>${employee.icon}</span>
            <strong>${employee.capture}</strong>
            <small>${employee.name}</small>
          </div>
          <div class="module-head">
            <span class="module-icon ai-emoji">${employee.icon}</span>
            <span class="status ${employee.health.includes("🔴") ? "danger" : employee.health.includes("🟠") ? "warning" : "success"}">${employee.health}</span>
          </div>
          <p class="eyebrow">${employee.category}</p>
          <h3>${employee.name}</h3>
          <p>${employee.description}</p>
          <div class="assistant-stats">
            <span><strong>${employee.savedTime}</strong><small>Temps economise</small></span>
            <span><strong>${employee.popularity}</strong><small>Popularite</small></span>
            <span><strong>${employee.companies}</strong><small>Utilisation</small></span>
            <span><strong>${employee.rating}</strong><small>Avis</small></span>
          </div>
          <details open>
            <summary>Presentation</summary>
            <p>${employee.example}</p>
          </details>
          <details>
            <summary>Fonctionnement</summary>
            <div class="tag-list">${employee.features.map((feature) => `<span class="tag">${feature}</span>`).join("")}</div>
          </details>
          <details>
            <summary>Configuration</summary>
            <div class="tag-list">${employee.configuration.map((item) => `<span class="tag">${item}</span>`).join("")}</div>
          </details>
          <details open>
            <summary>ROI avant installation</summary>
            <div class="list-row"><span>Temps gagne estime</span><strong>${employee.savedTime}</strong></div>
            <div class="list-row"><span>Argent economise</span><strong>${employee.status === "Premium" ? "2 900 EUR / mois" : "1 850 EUR / mois"}</strong></div>
            <div class="list-row"><span>Prospects recuperes</span><strong>${employee.category.includes("Communication") ? "18 / mois" : "7 / mois"}</strong></div>
            <div class="list-row"><span>Taches automatisees</span><strong>${employee.stats[0]}</strong></div>
            <div class="list-row"><span>Retour sur investissement</span><strong>x${employee.status === "Premium" ? "5,8" : "4,6"}</strong></div>
          </details>
          <details>
            <summary>Compatible avec</summary>
            <div class="tag-list">${["Google", "WhatsApp", "Mollie", "Facebook", "Instagram", "Gmail", "Google Calendar", "Les autres copilotes", ...employee.compatibility].map((item) => `<span class="tag">${item}</span>`).join("")}</div>
          </details>
          <details>
            <summary>Statistiques et historique</summary>
            ${employee.stats.map((item) => `<div class="list-row"><span>${item}</span><strong>Stat</strong></div>`).join("")}
            ${employee.history.map((item) => `<div class="list-row"><span>${item}</span><strong>Fait</strong></div>`).join("")}
          </details>
          <div class="hero-actions">
            <button class="${employee.status === "Installe" ? "secondary-button" : "primary-button"} copilot-hire" data-employee="${employee.name}">${employee.status === "Installe" ? "Configurer" : employee.status === "Premium" ? "Debloquer" : "Installer"}</button>
            <button class="secondary-button copilot-demo" data-employee="${employee.name}">Demonstration</button>
            <button class="secondary-button copilot-configure" data-employee="${employee.name}">Configurer</button>
            <button class="danger-button copilot-remove" data-employee="${employee.name}">Desinstaller</button>
          </div>
        </article>
      `).join("")}
    </div>
    <section class="section grid grid-2">
      <article class="card copilot-detail-card">
        <p class="eyebrow">Page de details</p>
        <h2>${featured.icon} ${featured.name}</h2>
        <div class="digital-video">Video de demonstration - ${featured.capture}</div>
        <div class="grid grid-2">
          <div class="digital-image">Capture appels</div>
          <div class="digital-image">Historique client</div>
        </div>
        <h3>Pourquoi il est utile</h3>
        <p>${featured.description}</p>
        <div class="tag-list">${featured.compatibility.map((item) => `<span class="tag">${item}</span>`).join("")}</div>
        <div class="list-row"><span>Temps economise</span><strong>${featured.savedTime}</strong></div>
        <div class="list-row"><span>Questions frequentes</span><strong>${featured.faq[0]}</strong></div>
        <button class="primary-button copilot-hire" data-employee="${featured.name}">Installer ${featured.name}</button>
      </article>
      <article class="card form-grid">
        <p class="eyebrow">🛠️ IA sur mesure</p>
        <h2>Votre entreprise est unique. Votre IA aussi.</h2>
        <p>Nous developpons des copilotes entierement personnalises selon votre metier, vos logiciels et vos processus internes.</p>
        ${["Nom", "Entreprise", "Secteur", "Nombre d'employes", "Objectif", "Description", "Logiciels utilises", "Budget", "Documents", "Captures d'ecran", "PDF", "Videos", "Telephone", "Email"].map((label, index) => `<div class="field"><label>${label}</label><input value="${index < 2 ? ["Dorian", "Atelier Qualifyr Demo"][index] : ""}"></div>`).join("")}
        <button class="primary-button" id="customStudy">${svg("message")} Recevoir une etude personnalisee</button>
      </article>
    </section>

    <section class="section">
      <div class="section-header compact-header">
        <div>
          <p class="eyebrow">Centre des nouveautes</p>
          <h2>Ce que Qualifyr AI vient d'ameliorer.</h2>
        </div>
      </div>
      <div class="grid grid-4">
        ${productUpdates.map(([type, description, capture, impact]) => `
          <article class="card update-card">
            <span class="status success">${type}</span>
            <div class="digital-image">${capture}</div>
            <p>${description}</p>
            <div class="list-row"><span>Impact</span><strong>${impact}</strong></div>
            <button class="secondary-button update-discover">Decouvrir</button>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

function renderCopilots() {
  renderCopilotLibrary("view-copilots");
}

function findDigitalEmployee(name) {
  return digitalEmployees.find((employee) => employee.name === name) || digitalEmployees[0];
}

function copilotSetupProfile(employee) {
  const rules = [
    {
      match: ["Telephone"],
      missing: [
        ["Votre numero professionnel", "Pour repondre aux appels quand vous etes deja en intervention.", "A connecter", "3 h / semaine"],
        ["Vos horaires", "Pour savoir quand repondre seul et quand vous prevenir.", "Pre-rempli", "45 min / semaine"],
        ["Vos urgences", "Pour reconnaitre les demandes prioritaires et les clients a rappeler vite.", "A verifier", "1 h / semaine"]
      ],
      test: ["Appel entrant de Mme Lefevre", "Qualifyr AI pose les questions, detecte une urgence et propose un rendez-vous.", "Prospect cree avec resume et creneau propose."]
    },
    {
      match: ["WhatsApp"],
      missing: [
        ["WhatsApp Business", "Pour repondre aux messages et demander les photos sans que vous soyez disponible.", "A connecter", "5 h / semaine"],
        ["Vos questions habituelles", "Pour recuperer l'adresse, les photos, le delai et le besoin.", "Pre-rempli", "1 h / semaine"],
        ["Validation avant envoi", "Pour garder la main sur les messages importants.", "Activee", "Controle total"]
      ],
      test: ["Message WhatsApp avec photo", "Qualifyr AI demande l'adresse, classe la photo et prepare la fiche client.", "Client qualifie et devis pret a demarrer."]
    },
    {
      match: ["Email"],
      missing: [
        ["Gmail ou Outlook", "Pour classer les demandes, preparer les reponses et ne rien oublier.", "A connecter", "3 h / semaine"],
        ["Votre signature", "Pour envoyer des reponses propres et coherentes avec votre entreprise.", "Pre-rempli", "20 min / semaine"],
        ["Validation humaine", "Pour verifier les emails avant l'envoi.", "Activee", "Controle total"]
      ],
      test: ["Demande de devis par email", "Qualifyr AI extrait le besoin, cree une tache et propose une reponse.", "Reponse prete et client ajoute."]
    },
    {
      match: ["Devis"],
      missing: [
        ["Vos prestations", "Pour creer des devis complets avec vos prix habituels.", "Pre-rempli", "4 h / semaine"],
        ["Votre TVA", "Pour calculer automatiquement les montants.", "Verifiee", "Moins d'erreurs"],
        ["Votre modele de devis", "Pour garder une presentation professionnelle et modifiable.", "Pret", "Image premium"]
      ],
      test: ["Demande de M. Martin", "Qualifyr AI propose les lignes, quantites, main d'oeuvre et deplacement.", "Devis modifiable pret a envoyer."]
    },
    {
      match: ["Planning"],
      missing: [
        ["Google Calendar", "Pour voir vos rendez-vous et eviter les doublons.", "A connecter", "2 h / semaine"],
        ["Vos zones d'intervention", "Pour reduire les trajets et organiser les tournees.", "A verifier", "1 h / semaine"],
        ["Temps entre deux rendez-vous", "Pour garder une marge realiste dans la journee.", "Pre-rempli", "Jours plus calmes"]
      ],
      test: ["Deux rendez-vous proches", "Qualifyr AI les regroupe et propose un horaire plus logique.", "Tournee optimisee et trajet reduit."]
    },
    {
      match: ["Avis Google"],
      missing: [
        ["Google Business", "Pour demander des avis aux bons clients au bon moment.", "A connecter", "2 h / semaine"],
        ["Message d'avis", "Pour envoyer une demande simple et professionnelle.", "Pre-rempli", "Plus d'avis"],
        ["Filtre satisfaction", "Pour vous prevenir avant de demander un avis a un client mecontent.", "Actif", "Reputation protegee"]
      ],
      test: ["Intervention terminee", "Qualifyr AI detecte un client satisfait et prepare la demande d'avis.", "Avis Google demande au bon moment."]
    },
    {
      match: ["Reseaux"],
      missing: [
        ["Facebook et Instagram", "Pour publier vos chantiers et montrer votre travail.", "A connecter", "4 h / semaine"],
        ["Vos photos recentes", "Pour creer des publications a partir de vrais chantiers.", "Detectees", "Contenu regulier"],
        ["Votre ton", "Pour rester simple, local et professionnel.", "Pre-rempli", "Image coherente"]
      ],
      test: ["Photo de chantier", "Qualifyr AI ecrit une publication courte avec appel a l'action.", "Post pret a valider."]
    },
    {
      match: ["Facturation"],
      missing: [
        ["Mollie ou suivi manuel", "Pour voir les paiements et relancer les impayes.", "A connecter", "3 h / semaine"],
        ["Vos delais de paiement", "Pour savoir quand relancer sans etre trop insistant.", "Pre-rempli", "Tresorerie suivie"],
        ["Modele de relance", "Pour envoyer un message clair et professionnel.", "Pret", "Impayes reduits"]
      ],
      test: ["Facture en retard", "Qualifyr AI prepare une relance courte avec les informations de paiement.", "Message pret a envoyer."]
    }
  ];
  const found = rules.find((rule) => rule.match.some((word) => employee.name.includes(word)));
  return found || {
    missing: [
      ["Vos outils principaux", "Pour laisser Qualifyr AI travailler avec vos donnees du quotidien.", "A connecter", "2 h / semaine"],
      ["Vos habitudes", "Pour adapter les conseils a votre facon de travailler.", "Pre-rempli", "Moins de saisie"],
      ["Premier test", "Pour verifier le resultat avant activation.", "Pret", "Rassurant"]
    ],
    test: ["Demande client fictive", "Qualifyr AI comprend la demande et propose l'action utile.", "Action prete a valider."]
  };
}

function openCopilotSetup(name, mode = "install") {
  state.selectedCopilotName = name || state.selectedCopilotName;
  state.selectedCopilotMode = mode;
  renderCopilotSetup();
  showView("copilot-setup");
}

function renderCopilotSetup() {
  const root = el("view-copilot-setup");
  if (!root) return;
  const employee = findDigitalEmployee(state.selectedCopilotName);
  const profile = copilotSetupProfile(employee);
  const isDemo = state.selectedCopilotMode === "demo";
  const connectedCount = profile.missing.filter((item) => ["Pre-rempli", "Verifiee", "Pret", "Activee", "Actif", "Detectees"].includes(item[2])).length;
  root.innerHTML = `
    <section class="setup-hero card">
      <div>
        <button class="secondary-button setup-back" data-view="marketplace">${svg("grid")} Retour aux IA</button>
        <p class="eyebrow">${isDemo ? "Demo guidee" : "Installation guidee"}</p>
        <h2>${employee.icon} ${isDemo ? "Tester" : "Installer"} ${employee.name} sans configuration compliquee.</h2>
        <p>Qualifyr AI vous guide une seule etape a la fois. Vous voyez ce qui manque, pourquoi c'est utile et combien de temps vous pouvez gagner.</p>
        <div class="hero-actions">
          <button class="primary-button setup-auto">${svg("spark")} ✨ Configurer automatiquement</button>
          <button class="secondary-button setup-test">${svg("message")} Tester avec un faux client</button>
        </div>
      </div>
      <div class="setup-employee-panel">
        <span class="setup-big-icon">${employee.icon}</span>
        <strong>${employee.name}</strong>
        <p>${employee.description}</p>
        <div class="setup-progress-ring" style="--score: ${employee.status === "Installe" ? 86 : 58}">
          <span>${employee.status === "Installe" ? "86" : "58"}%</span>
        </div>
        <small>${employee.status === "Installe" ? "Deja installe, pret a optimiser" : "Pret a etre active"}</small>
      </div>
    </section>

    <div class="setup-summary-grid">
      <article class="card setup-summary-card"><span>${svg("spark")}</span><strong>${employee.savedTime}</strong><small>Temps gagne estime</small></article>
      <article class="card setup-summary-card"><span>${svg("calendar")}</span><strong>Moins de 2 min</strong><small>Pour le rendre operationnel</small></article>
      <article class="card setup-summary-card"><span>${svg("grid")}</span><strong>${connectedCount} / ${profile.missing.length}</strong><small>Elements deja prets</small></article>
      <article class="card setup-summary-card"><span>${svg("star")}</span><strong>${employee.rating}</strong><small>Avis des utilisateurs</small></article>
    </div>

    <section class="setup-layout">
      <article class="card setup-checklist-card">
        <p class="eyebrow">Ce qu'il faut pour demarrer</p>
        <h2>Qualifyr AI s'occupe de la partie compliquee.</h2>
        <p>Vous n'avez pas de reglage technique a faire. Le logiciel vous demande seulement les autorisations utiles.</p>
        <div class="setup-checklist">
          ${profile.missing.map(([title, description, status, gain], index) => `
            <div class="setup-check-row">
              <span class="setup-check-mark ${index === 0 && status.includes("connect") ? "pending" : "done"}">${index === 0 && status.includes("connect") ? "!" : "✓"}</span>
              <div>
                <strong>${title}</strong>
                <p>${description}</p>
                <small>Gain estime : ${gain}</small>
              </div>
              <button class="${status.includes("connect") ? "primary-button" : "secondary-button"} setup-configure" data-item="${title}">${status.includes("connect") ? "Connecter" : "Verifier"}</button>
            </div>
          `).join("")}
        </div>
      </article>

      <article class="card setup-steps-card">
        <p class="eyebrow">Assistant d'installation</p>
        <h2>Une seule action a la fois.</h2>
        <div class="setup-steps">
          ${installationSteps.map(([step, title, description], index) => `
            <div class="setup-step ${index < 2 ? "active" : ""}">
              <strong>${step}</strong>
              <span><b>${title}</b><small>${description}</small></span>
            </div>
          `).join("")}
        </div>
        <div class="setup-final-card">
          <strong>Aucune cle, aucun reglage technique.</strong>
          <p>Si une connexion reelle est necessaire, l'equipe Qualifyr finalise l'onboarding avec vous. Le prospect voit seulement les benefices.</p>
        </div>
      </article>
    </section>

    <section class="section setup-test-section">
      <article class="card setup-test-card">
        <div>
          <p class="eyebrow">Simulation avec un faux client</p>
          <h2>Avant d'activer, l'utilisateur voit le resultat.</h2>
          <p>Cette demo montre exactement ce que le copilote fera dans une vraie journee.</p>
        </div>
        <div class="fake-conversation">
          <div><small>Client fictif</small><strong>${profile.test[0]}</strong></div>
          <div><small>Qualifyr AI</small><strong>${profile.test[1]}</strong></div>
          <div><small>Resultat</small><strong>${profile.test[2]}</strong></div>
        </div>
        <div class="hero-actions">
          <button class="primary-button setup-test">${svg("spark")} Lancer le test</button>
          <button class="secondary-button setup-activate">${svg("star")} Activer ${employee.name}</button>
        </div>
      </article>
    </section>

    <section class="setup-layout">
      <article class="card">
        <p class="eyebrow">Retour sur investissement</p>
        <h2>Ce que ce copilote peut rapporter.</h2>
        <div class="setup-result-grid">
          <span><strong>${employee.savedTime}</strong><small>Temps gagne</small></span>
          <span><strong>${employee.category.includes("Communication") ? "18" : "7"}</strong><small>Demandes mieux traitees / mois</small></span>
          <span><strong>${employee.status === "Premium" ? "2 900 EUR" : "1 850 EUR"}</strong><small>Valeur estimee / mois</small></span>
          <span><strong>x${employee.status === "Premium" ? "5,8" : "4,6"}</strong><small>Retour estime</small></span>
        </div>
      </article>
      <article class="card">
        <p class="eyebrow">Compatible avec vos outils</p>
        <h2>Les connexions sont proposees automatiquement.</h2>
        <div class="tag-list">${employee.compatibility.concat(["Google", "WhatsApp", "Gmail", "Google Calendar", "Mollie"]).slice(0, 9).map((item) => `<span class="tag">${item}</span>`).join("")}</div>
        <button class="primary-button setup-help">${svg("help")} Me guider pas a pas</button>
      </article>
    </section>
  `;
}

function renderAiCenter() {
  const copilot = getCopilotInsights();
  const quotesWaiting = quotes.filter((quote) => ["Envoye", "Relance"].includes(quote.status));
  const quotesDraft = quotes.filter((quote) => quote.status === "Brouillon");
  const quotesSent = quotes.filter((quote) => quote.status === "Envoye");
  const quotesAccepted = quotes.filter((quote) => quote.status === "Accepte");
  const quotesRefused = quotes.filter((quote) => quote.status === "Refuse");
  const overdueInvoices = invoices.filter((invoice) => invoice.status === "En retard");
  const waitingInvoices = invoices.filter((invoice) => invoice.status === "En attente");
  const paidInvoices = invoices.filter((invoice) => invoice.status === "Payee");
  const reviewOpportunities = Math.max(6, googleReviews.filter((review) => review.rating >= 4).length);
  const signedYesterday = quotesAccepted.slice(0, 2).reduce((sum, quote) => sum + quoteTotal(quote), 0);
  const messageGroups = ["WhatsApp", "Email", "Messenger", "Instagram"].map((channel) => ({
    channel,
    count: conversations.filter((item) => item.channel === channel).length + (channel === "WhatsApp" ? 8 : channel === "Email" ? 5 : 2)
  }));
  const autonomyScore = 86;
  const businessHealth = [
    ["Clients", 88],
    ["Planning", 82],
    ["Facturation", 74],
    ["Automatisations", 91],
    ["Copilotes", 79],
    ["Connexions", 68],
    ["Avis Google", 84]
  ];
  const priorityActions = [
    ["Urgent", "Relancer Martin", "Vous pouvez recuperer 3 400 EUR.", "3 min", "Relancer", "quotes"],
    ["Important", "Envoyer le devis Dupont", "Le client attend une reponse depuis hier.", "6 min", "Creer le devis", "quotes"],
    ["Important", "Prevenir Bernard", "Son rendez-vous de 14h doit etre confirme.", "1 min", "Confirmer", "calendar"],
    ["Rapide", "Repondre au message WhatsApp", "Une photo vient d'arriver pour preparer le devis.", "2 min", "Repondre", "integrations"],
    ["Urgent", "Relancer une facture en retard", `${overdueInvoices[0]?.client || "Un client"} doit encore regler sa facture.`, "4 min", "Relancer", "billing"]
  ];
  const chatSuggestions = [
    ["Creer un devis", "quotes"],
    ["Trouver Martin", "crm"],
    ["Qui dois-je rappeler ?", "crm"],
    ["Ajouter un client", "crm"],
    ["Creer une facture", "billing"],
    ["Prepare ma journee", "ai-center"],
    ["Relance tous mes devis", "quotes"],
    ["Creer une publication Facebook", "integrations"],
    ["Installer WhatsApp IA", "marketplace"]
  ];
  const advice = [
    ["Installer WhatsApp IA", "Vous recevez beaucoup de demandes avec photos. Je peux les ranger et preparer les devis.", "5 h / semaine", "marketplace"],
    ["Creer une relance automatique", `${quotesWaiting.length} devis attendent une reponse. Une relance simple peut recuperer du chiffre d'affaires.`, "2 h / semaine", "automations"],
    ["Deplacer un rendez-vous", "Votre fin d'apres-midi est chargee. Je peux regrouper deux adresses proches.", "35 min", "calendar"],
    ["Demander des avis Google", "Plusieurs clients satisfaits n'ont pas encore recu de demande.", "10 min", "notifications"]
  ];
  const monthlyGoals = [
    ["CA du mois", performanceStats.signedRevenue, 42000, "quotes"],
    ["Prospects", prospects.length, 40, "crm"],
    ["Clients", clients.filter((client) => client.status === "Client").length, 18, "crm"],
    ["Avis Google", googleReviews.length, 20, "notifications"],
    ["Temps economise", performanceStats.savedHours, 180, "automations"]
  ];
  const opportunities = [
    [`${quotesWaiting.length} devis sans reponse`, "Vous pourriez recuperer 6 500 EUR.", "Relancer automatiquement", "quotes"],
    ["Appels manques cette semaine", "Telephone IA peut repondre quand vous etes en intervention.", "Installer Telephone IA", "marketplace"],
    ["Avis Google non demandes", "Vos derniers clients satisfaits peuvent renforcer votre reputation.", "Demander les avis", "notifications"]
  ];
  const preferences = [
    "Vous preferez WhatsApp pour les demandes avec photos.",
    "Vous travaillez principalement le matin.",
    "Vous envoyez vos devis rapidement apres un appel.",
    "Vous oubliez souvent les avis Google apres intervention.",
    "Vous validez les factures avant chaque envoi."
  ];
  const ideas = [
    ["Creer une carte fidelite", "Faire revenir les clients apres une intervention.", "25 min", "Moyen", "commercial"],
    ["Installer Telephone IA", "Ne plus perdre les appels pendant les chantiers.", "2 min", "Fort", "marketplace"],
    ["Creer une campagne Google", "Recevoir plus de demandes locales qualifiees.", "40 min", "Fort", "commercial"],
    ["Publier sur Facebook", "Montrer les interventions terminees cette semaine.", "10 min", "Moyen", "integrations"],
    ["Creer un nouveau service", "Vendre un forfait entretien recurrent.", "30 min", "Fort", "pricing"]
  ];
  const firstAppointment = appointments[0];
  const lastAppointment = appointments[copilot.todayAppointments.length - 1] || appointments[appointments.length - 1];
  el("view-ai-center").innerHTML = `
    <section class="assistant-hero">
      <div>
        <p class="eyebrow">🤖 Mon Assistant IA</p>
        <h2>Votre assistant personnel pour gerer l'entreprise.</h2>
        <p>Votre assistant personnel vous accompagne chaque jour dans la gestion de votre entreprise.</p>
        <button class="primary-button assistant-start-button" id="startDay">${svg("spark")} Commencer ma journee</button>
      </div>
      <div class="assistant-briefing">
        <span class="status warning">Briefing pret</span>
        <h3>Bonjour Dorian 👋</h3>
        <p>Aujourd'hui voici ce qui merite votre attention.</p>
        <ul>
          <li>${copilot.newProspects.length} nouveaux prospects</li>
          <li>${copilot.quotesToFollow.length} devis attendent une reponse</li>
          <li>${copilot.todayAppointments.length} rendez-vous aujourd'hui</li>
          <li>${overdueInvoices.length} facture impayee</li>
          <li>${reviewOpportunities} demandes d'avis Google possibles</li>
        </ul>
      </div>
    </section>

    <section class="section assistant-daily-grid">
      <article class="card assistant-info-card">
        <span>📅</span>
        <p class="eyebrow">Aujourd'hui</p>
        <h3>${copilot.todayAppointments.length} rendez-vous</h3>
        <div class="list-row"><span>Premier rendez-vous</span><strong>${firstAppointment[0]} - ${firstAppointment[1]}</strong></div>
        <div class="list-row"><span>Dernier rendez-vous</span><strong>${lastAppointment[0]} - ${lastAppointment[1]}</strong></div>
        <div class="list-row"><span>Temps de trajet</span><strong>1 h 45</strong></div>
        <div class="list-row"><span>Disponibilites restantes</span><strong>2 creneaux</strong></div>
      </article>
      <article class="card assistant-info-card">
        <span>👥</span>
        <p class="eyebrow">Nouveaux clients</p>
        <h3>${copilot.newProspects.length} a traiter</h3>
        ${copilot.newProspects.map((client, index) => `
          <div class="list-row">
            <span><strong>${client.name}</strong><small>${client.phone}</small></span>
            <strong>${index === 0 ? "Haute" : "Normale"}</strong>
          </div>
        `).join("")}
      </article>
      <article class="card assistant-info-card">
        <span>📄</span>
        <p class="eyebrow">Devis</p>
        <h3>${quotesWaiting.length} demandent une action</h3>
        <div class="assistant-mini-grid">
          <span><strong>${quotesDraft.length}</strong><small>A creer</small></span>
          <span><strong>${quotesSent.length}</strong><small>A envoyer</small></span>
          <span><strong>${quotes.filter((quote) => quote.status === "Relance").length}</strong><small>A relancer</small></span>
          <span><strong>${quotesAccepted.length}</strong><small>Acceptes</small></span>
          <span><strong>${quotesRefused.length}</strong><small>Refuses</small></span>
        </div>
      </article>
      <article class="card assistant-info-card">
        <span>💰</span>
        <p class="eyebrow">Factures</p>
        <h3>${overdueInvoices.length} en retard</h3>
        <div class="assistant-mini-grid">
          <span><strong>${waitingInvoices.length}</strong><small>A envoyer</small></span>
          <span><strong>${overdueInvoices.length}</strong><small>Impayees</small></span>
          <span><strong>${overdueInvoices.length}</strong><small>En retard</small></span>
          <span><strong>${paidInvoices.length}</strong><small>Payees</small></span>
        </div>
      </article>
      <article class="card assistant-info-card">
        <span>⭐</span>
        <p class="eyebrow">Avis Google</p>
        <h3>${reviewOpportunities} avis a demander</h3>
        <div class="list-row"><span>Obtenus</span><strong>${googleReviews.length}</strong></div>
        <div class="list-row"><span>Note moyenne</span><strong>${performanceStats.reviewsAverage}/5</strong></div>
      </article>
      <article class="card assistant-info-card">
        <span>💬</span>
        <p class="eyebrow">Messages</p>
        <h3>Toutes les demandes regroupees</h3>
        ${messageGroups.map((item) => `<div class="list-row"><span>${item.channel}</span><strong>${item.count}</strong></div>`).join("")}
      </article>
      <article class="card assistant-info-card assistant-priority-card">
        <span>🚨</span>
        <p class="eyebrow">Priorites</p>
        <h3>Ce que je ferais en premier.</h3>
        ${priorityActions.slice(0, 3).map(([, title, detail,, button, view]) => `
          <div class="list-row">
            <span><strong>${title}</strong><small>${detail}</small></span>
            <button class="secondary-button" data-view="${view}">${button}</button>
          </div>
        `).join("")}
      </article>
    </section>

    <section class="section assistant-priorities">
      <div class="section-header compact-header">
        <div>
          <p class="eyebrow">A faire aujourd'hui</p>
          <h2>Je vous conseille de commencer par ces actions.</h2>
        </div>
      </div>
      <div class="assistant-action-list">
        ${priorityActions.map(([priority, title, detail, time, button, view]) => `
          <article class="card assistant-action-card">
            <span class="status ${priority === "Urgent" ? "warning" : "success"}">${priority}</span>
            <div>
              <h3>${title}</h3>
              <p>${detail} Temps estime : ${time}</p>
            </div>
            <button class="primary-button" data-view="${view}">${button}</button>
          </article>
        `).join("")}
      </div>
    </section>

    <section class="section grid grid-2">
      <article class="card">
        <p class="eyebrow">✨ Ce que je vous conseille aujourd'hui</p>
        <h2>Les meilleures actions pour gagner du temps.</h2>
        ${advice.map(([title, detail, gain, view]) => `
          <div class="list-row">
            <span><strong>${title}</strong><small>${detail}</small></span>
            <button class="secondary-button" data-view="${view}">${gain}</button>
          </div>
        `).join("")}
      </article>
      <article class="card assistant-health-card">
        <p class="eyebrow">📈 Sante de votre entreprise</p>
        <h2>Entreprise optimisee : ${autonomyScore}%</h2>
        <div class="assistant-score-line"><span style="width:${autonomyScore}%"></span></div>
        ${businessHealth.map(([label, score]) => `
          <div class="health-row">
            <span>${label}</span>
            <i><b style="width:${score}%"></b></i>
            <strong>${score}/100</strong>
          </div>
        `).join("")}
        <div class="connection-levels">
          ${["Debutant", "En progression", "Optimisee", "Performante", "Entreprise autonome"].map((level, index) => `<span class="${index === 4 ? "active" : ""}">${level}</span>`).join("")}
        </div>
      </article>
    </section>

    <section class="section assistant-chat-shell">
      <article class="card assistant-dialog">
        <p class="eyebrow">🤖 Demander a Qualifyr AI</p>
        <h2>Que souhaitez-vous faire ?</h2>
        <div class="chat-bubble ai-bubble">
          <strong>Je peux m'occuper de cela.</strong>
          <p>Ecrivez naturellement votre demande. Je comprends l'intention et j'ouvre directement la bonne fonctionnalite.</p>
        </div>
        <div class="assistant-input-row">
          <input id="assistantPrompt" value="Exemple : relance mes devis ou trouve Martin" aria-label="Que souhaitez-vous faire ?">
          <button class="primary-button assistant-ask" data-input="assistantPrompt">${svg("spark")} Demander</button>
        </div>
        <div class="suggestion-chips">
          ${chatSuggestions.map(([label, view]) => `<button data-view="${view}">${label}</button>`).join("")}
        </div>
      </article>
    </section>

    <section class="section grid grid-2">
      <article class="card">
        <p class="eyebrow">🔥 Opportunites</p>
        <h2>De l'argent et du temps a recuperer.</h2>
        ${opportunities.map(([title, detail, action, view]) => `
          <div class="list-row">
            <span><strong>${title}</strong><br><small class="mini-muted">${detail}</small></span>
            <button class="secondary-button" data-view="${view}">${action}</button>
          </div>
        `).join("")}
      </article>
      <article class="card">
        <p class="eyebrow">Analyse du matin</p>
        <h2>Votre entreprise avance bien.</h2>
        <p>Hier : 12 nouveaux prospects, 4 devis envoyes, 2 devis acceptes et ${money(signedYesterday)} signes.</p>
        <p>Vous avez economise environ 2h40 grace aux automatisations. Je vous conseille de traiter les relances avant 11h.</p>
      </article>
    </section>

    <section class="section grid grid-2">
      <article class="card">
        <p class="eyebrow">Objectifs du mois</p>
        <h2>Votre progression.</h2>
        ${monthlyGoals.map(([label, value, target, view]) => {
          const progress = Math.min(100, Math.round((value / target) * 100));
          return `
            <button class="goal-row" data-view="${view}">
              <span><strong>${label}</strong><small>${typeof value === "number" && value > 1000 ? money(value) : value} / ${typeof target === "number" && target > 1000 ? money(target) : target}</small></span>
              <span class="goal-track"><i style="width:${progress}%"></i></span>
              <strong>${progress}%</strong>
            </button>
          `;
        }).join("")}
      </article>
      <article class="card assistant-saved-card">
        <p class="eyebrow">Temps economise</p>
        <h2>Qualifyr AI travaille deja pour vous.</h2>
        <div class="assistant-saved-grid">
          <span><strong>1h20</strong><small>Aujourd'hui</small></span>
          <span><strong>12h40</strong><small>Cette semaine</small></span>
          <span><strong>48h15</strong><small>Ce mois</small></span>
          <span><strong>128h</strong><small>Depuis votre inscription</small></span>
        </div>
      </article>
    </section>

    <section class="section grid grid-2">
      <article class="card">
        <p class="eyebrow">📚 Ce que j'ai appris sur votre entreprise</p>
        <h2>Mes conseils deviennent plus precis.</h2>
        ${preferences.map((item) => `
          <div class="list-row">
            <span>${item}</span>
            <strong>Memorise</strong>
          </div>
        `).join("")}
      </article>
      <article class="card">
        <p class="eyebrow">IA proactive</p>
        <h2>Je surveille ce qui peut vous faire perdre du temps.</h2>
        <div class="chat-bubble ai-bubble"><strong>Devis oublie</strong><p>Je vois que vous avez oublie d'envoyer un devis. Je peux le preparer pour vous.</p></div>
        <div class="chat-bubble ai-bubble"><strong>Planning charge</strong><p>Votre agenda est tres charge demain. Je peux reorganiser vos rendez-vous.</p></div>
        <div class="chat-bubble ai-bubble"><strong>Appels manques</strong><p>Vous avez perdu plusieurs appels cette semaine. Je recommande d'installer Telephone IA.</p></div>
      </article>
    </section>

    <section class="section">
      <div class="section-header compact-header">
        <div>
          <p class="eyebrow">💡 Idees pour developper mon entreprise</p>
          <h2>Des actions simples pour grandir.</h2>
        </div>
      </div>
      <div class="idea-grid">
        ${ideas.map(([title, why, time, impact, view]) => `
          <article class="card idea-card">
            <h3>${title}</h3>
            <p>${why}</p>
            <div class="list-row"><span>Temps estime</span><strong>${time}</strong></div>
            <div class="list-row"><span>Impact</span><strong>${impact}</strong></div>
            <button class="primary-button" data-view="${view}">Mettre en place</button>
          </article>
        `).join("")}
      </div>
    </section>

    <section class="section grid grid-2">
      <article class="card end-day-card">
        <p class="eyebrow">🎉 Resume de fin de journee</p>
        <h2>Terminer ma journee</h2>
        <p>Je prepare le bilan, les taches restantes et la journee de demain.</p>
        <div class="assistant-mini-grid">
          <span><strong>12h40</strong><small>Temps gagne</small></span>
          <span><strong>${money(signedYesterday)}</strong><small>CA signe</small></span>
          <span><strong>${copilot.newProspects.length}</strong><small>Clients ajoutes</small></span>
          <span><strong>4</strong><small>Devis envoyes</small></span>
          <span><strong>38</strong><small>Taches executees</small></span>
          <span><strong>5</strong><small>Taches restantes</small></span>
        </div>
        <button class="primary-button" id="endDay">${svg("spark")} Terminer ma journee</button>
      </article>
      <article class="card">
        <p class="eyebrow">Commandes rapides</p>
        <h2>L'utilisateur ne cherche plus dans les menus.</h2>
        <div class="quick-action-grid">
          ${[
            ["Creer un devis", "quotes", "file"],
            ["Ajouter un client", "crm", "users"],
            ["Creer une facture", "billing", "card"],
            ["Trouver Dupont", "crm", "users"],
            ["Installer une IA", "marketplace", "grid"],
            ["Ouvrir le planning", "calendar", "calendar"]
          ].map(([label, view, icon]) => `<button class="quick-action-card" data-view="${view}"><span>${svg(icon)}</span><strong>${label}</strong></button>`).join("")}
        </div>
      </article>
    </section>
  `;
}

function renderAutomations() {
  const simpleAutomations = [
    ["Relancer les devis en attente", "Qualifyr AI envoie un rappel poli aux clients qui n'ont pas encore repondu.", "Actif"],
    ["Demander un avis Google", "Apres une intervention terminee, le client recoit une demande d'avis au bon moment.", "Actif"],
    ["Creer un client apres un appel", "Les coordonnees sont rangees automatiquement des qu'une nouvelle demande arrive.", "Actif"],
    ["Preparer un devis apres WhatsApp", "Les photos et informations recues sont transformees en brouillon de devis.", "En pause"],
    ["Rappeler les factures en attente", "Un message court est prepare pour recuperer les paiements oublies.", "Actif"],
    ["Prevenir l'equipe", "Votre equipe recoit une alerte quand une demande urgente arrive.", "Actif"]
  ];
  el("view-automations").innerHTML = `
    <div class="section-header">
      <div>
        <p class="eyebrow">Mes automatisations</p>
        <h2>Les taches repetitives que Qualifyr AI fait pour vous.</h2>
        <p>Activez, modifiez ou mettez en pause chaque aide sans schema complique.</p>
      </div>
      <button class="primary-button" id="publishWorkflow">${svg("spark")} Creer une automatisation</button>
    </div>
    <div class="section data-table simple-automation-list">
      ${simpleAutomations.map(([name, description, status]) => `
        <article class="table-row">
          <span><strong>${name}</strong><small>${description}</small></span>
          <span class="status ${status === "Actif" ? "success" : "warning"}">${status}</span>
          <span class="automation-actions">
            <button class="secondary-button">Modifier</button>
            <button class="${status === "Actif" ? "danger-button" : "primary-button"}">${status === "Actif" ? "Desactiver" : "Activer"}</button>
          </span>
        </article>
      `).join("")}
    </div>
    <div class="card assistant-dialog section">
      <p class="eyebrow">Creation guidee</p>
      <h3>Qualifyr AI vous pose quelques questions.</h3>
      <p>Exemple : “Quand un nouveau client vous ecrit sur WhatsApp, voulez-vous creer sa fiche, demander des photos et preparer un devis ?”</p>
    </div>
  `;
}

function renderIntegrations() {
  const connections = [
    ["📅 Agenda", "GC", "Google Calendar", "Synchronise vos rendez-vous et evite les doubles saisies.", "Connecte", "Il y a 2 min", "Dans 15 min", "🟢 Fonctionne parfaitement", "2h / semaine", "Vos rendez-vous seront classes automatiquement."],
    ["📧 Emails", "GM", "Google Gmail", "Classe vos emails et prepare les reponses simples.", "Connecte", "Il y a 6 min", "Dans 24 min", "🟢 Fonctionne parfaitement", "3h / semaine", "Vos demandes clients arrivent directement au bon endroit."],
    ["📂 Stockage", "GD", "Google Drive", "Range automatiquement devis, factures, photos et contrats.", "Deconnecte", "Jamais", "Apres connexion", "🟠 Synchronisation en attente", "1h / semaine", "Vos documents seront retrouves plus rapidement."],
    ["💬 Communication", "GB", "Google Business Profile", "Suit vos avis et vos demandes locales.", "Deconnecte", "Jamais", "Apres connexion", "🟠 Synchronisation en attente", "2h / semaine", "Vous pourrez demander plus facilement des avis clients."],
    ["📅 Agenda", "MAP", "Google Maps", "Calcule les trajets entre vos rendez-vous.", "Deconnecte", "Jamais", "Apres connexion", "🟠 Synchronisation en attente", "1h30 / semaine", "Vos tournees seront plus simples a organiser."],
    ["🏢 Gestion", "CT", "Google Contacts", "Garde vos contacts clients a jour.", "Deconnecte", "Jamais", "Apres connexion", "🟠 Synchronisation en attente", "45 min / semaine", "Les coordonnees seront toujours propres."],
    ["📅 Agenda", "OC", "Microsoft Calendar", "Synchronise vos rendez-vous Microsoft.", "Deconnecte", "Jamais", "Apres connexion", "🟠 Synchronisation en attente", "2h / semaine", "Votre planning restera a jour partout."],
    ["📧 Emails", "OUT", "Microsoft Outlook", "Classe vos emails Outlook et propose les bonnes reponses.", "Deconnecte", "Jamais", "Apres connexion", "🟠 Synchronisation en attente", "3h / semaine", "Vous perdez moins de temps dans les emails."],
    ["📂 Stockage", "OD", "Microsoft OneDrive", "Archive vos documents importants.", "Deconnecte", "Jamais", "Apres connexion", "🟠 Synchronisation en attente", "1h / semaine", "Vos fichiers restent ranges par client."],
    ["💬 Communication", "WA", "WhatsApp Business", "Repond aux clients et demande les informations utiles.", "Deconnecte", "Jamais", "Apres connexion", "🔴 Connexion interrompue", "5h / semaine", "Vos messages clients seront traites plus vite."],
    ["💬 Communication", "MS", "Messenger", "Centralise les demandes Facebook.", "Deconnecte", "Jamais", "Apres connexion", "🟠 Synchronisation en attente", "2h / semaine", "Les demandes Facebook ne seront plus oubliees."],
    ["📱 Reseaux sociaux", "IG", "Instagram", "Recupere les messages et demandes entrantes.", "Deconnecte", "Jamais", "Apres connexion", "🟠 Synchronisation en attente", "2h / semaine", "Les messages Instagram deviendront des prospects."],
    ["📱 Reseaux sociaux", "FB", "Facebook", "Suit les messages, pages et publications.", "Deconnecte", "Jamais", "Apres connexion", "🟠 Synchronisation en attente", "2h / semaine", "Vos demandes Facebook seront mieux suivies."],
    ["💬 Communication", "GC", "Google Chat", "Previent votre equipe quand une action importante arrive.", "Deconnecte", "Jamais", "Apres connexion", "🟠 Synchronisation en attente", "30 min / semaine", "Votre equipe sera prevenue au bon moment."],
    ["💬 Communication", "SL", "Slack", "Envoie les alertes importantes a votre equipe.", "Deconnecte", "Jamais", "Apres connexion", "🟠 Synchronisation en attente", "30 min / semaine", "Les urgences seront partagees rapidement."],
    ["💳 Paiements", "MO", "Mollie", "Suit les paiements et les factures en retard.", "Deconnecte", "Jamais", "Apres connexion", "🔴 Connexion interrompue", "2h / semaine", "Vous saurez plus vite qui a paye."],
    ["💳 Paiements", "PP", "PayPal", "Suit les paiements PayPal.", "Deconnecte", "Jamais", "Apres connexion", "🟠 Synchronisation en attente", "45 min / semaine", "Vos paiements seront suivis automatiquement."],
    ["💳 Paiements", "SU", "SumUp", "Suit les encaissements terrain.", "Deconnecte", "Jamais", "Apres connexion", "🟠 Synchronisation en attente", "45 min / semaine", "Vos paiements sur place seront mieux ranges."],
    ["📊 Comptabilite", "QB", "QuickBooks", "Aide a suivre factures et comptabilite.", "Deconnecte", "Jamais", "Apres connexion", "🟠 Synchronisation en attente", "2h / semaine", "Votre suivi comptable sera plus simple."],
    ["📊 Comptabilite", "PE", "Pennylane", "Prepare les elements utiles a votre comptabilite.", "Deconnecte", "Jamais", "Apres connexion", "🟠 Synchronisation en attente", "2h / semaine", "Vos pieces seront mieux transmises."],
    ["📊 Comptabilite", "SE", "Sellsy", "Synchronise clients, devis et factures.", "Deconnecte", "Jamais", "Apres connexion", "🟠 Synchronisation en attente", "2h / semaine", "Vos ventes seront mieux suivies."],
    ["📂 Stockage", "DB", "Dropbox", "Archive automatiquement vos fichiers clients.", "Deconnecte", "Jamais", "Apres connexion", "🟠 Synchronisation en attente", "1h / semaine", "Vos documents seront classes par client."],
    ["⚙️ Automatisation", "ZA", "Zapier", "Relie Qualifyr AI a vos autres outils.", "Deconnecte", "Jamais", "Apres connexion", "🟠 Synchronisation en attente", "2h / semaine", "Vos outils travailleront mieux ensemble."],
    ["⚙️ Automatisation", "MK", "Make", "Cree des passages simples entre vos outils.", "Deconnecte", "Jamais", "Apres connexion", "🟠 Synchronisation en attente", "2h / semaine", "Vos actions repetitives seront reduites."],
    ["⚙️ Automatisation", "N8", "n8n", "Organise des actions avancees avec vos outils.", "Deconnecte", "Jamais", "Apres connexion", "🟠 Synchronisation en attente", "2h / semaine", "Vos processus pourront etre relies."],
    ["⚙️ Automatisation", "LI", "Lien automatique", "Permet de recevoir une information depuis un autre outil.", "Deconnecte", "Jamais", "Apres connexion", "🟠 Synchronisation en attente", "1h / semaine", "Vos informations pourront arriver au bon endroit."]
  ].map(([category, logo, name, description, state, lastSync, nextSync, health, savedTime, why], index) => ({
    id: `connection-${index + 1}`,
    category,
    logo,
    name,
    description,
    state,
    connected: state === "Connecte",
    lastSync,
    nextSync,
    health,
    savedTime,
    why,
    history: [
      state === "Connecte" ? "Connexion creee" : "Connexion recommandee",
      state === "Connecte" ? "Synchronisation reussie" : "En attente de connexion",
      health.includes("🔴") ? "Reconnexion conseillee" : "Aucun probleme detecte"
    ]
  }));
  const connectedCount = connections.filter((connection) => connection.connected).length;
  const errors = connections.filter((connection) => connection.health.includes("🔴")).length;
  const score = 68;
  const scoreLabel = score >= 80 ? "🟢 Excellent" : score >= 55 ? "🟠 A ameliorer" : "🔴 Prioritaire";
  const checklist = [
    ["Agenda connecte", true, "2h / semaine", "Votre planning se met a jour automatiquement.", "Google Calendar"],
    ["Gmail connecte", true, "3h / semaine", "Vos emails clients sont mieux classes.", "Google Gmail"],
    ["WhatsApp Business", false, "5h / semaine", "Vos messages clients peuvent etre traites automatiquement.", "WhatsApp Business"],
    ["Google Business Profile", false, "2h / semaine", "Vous pouvez demander plus facilement des avis.", "Google Business Profile"],
    ["Mollie", false, "2h / semaine", "Vos paiements et factures en retard seront mieux suivis.", "Mollie"],
    ["Google Drive", false, "1h / semaine", "Vos documents seront ranges par client.", "Google Drive"],
    ["Facebook", false, "2h / semaine", "Vos demandes Facebook seront centralisees.", "Facebook"],
    ["Instagram", false, "2h / semaine", "Vos messages Instagram deviendront des prospects.", "Instagram"]
  ];
  const roadmap = [
    ["1️⃣ Connecter Google Calendar", "1 minute", "2 heures / semaine", "integrations"],
    ["2️⃣ Installer Telephone IA", "2 minutes", "4 heures / semaine", "marketplace"],
    ["3️⃣ Activer Relance des devis", "30 secondes", "Augmenter votre taux de signature", "automations"]
  ];
  el("view-integrations").innerHTML = `
    <div class="section-header">
      <div>
        <p class="eyebrow">Mes connexions</p>
        <h2>🔗 Mes connexions</h2>
        <p>Connectez les outils que vous utilisez deja.</p>
      </div>
      <button class="primary-button connection-optimize">${svg("spark")} ✨ Connecter automatiquement mes outils</button>
    </div>

    <section class="diagnostic-hero">
      <div>
        <p class="eyebrow">✨ Diagnostic de votre entreprise</p>
        <h2>Qualifyr AI analyse votre entreprise et vous indique les connexions qui vous permettront de gagner le plus de temps.</h2>
        <p>Votre entreprise est optimisee a ${score}%.</p>
      </div>
      <div class="diagnostic-score">
        <div class="score-ring" style="--score:${score}%"><strong>${score}%</strong></div>
        <span class="status warning">${scoreLabel}</span>
      </div>
    </section>

    <div class="grid grid-4">
      ${metric("Entreprise connectee", `${connectedCount} / 12`, "objectif conseille")}
      ${metric("Copilotes installes", "5 / 10", "employes numeriques")}
      ${metric("Missions automatiques", "9", "actives")}
      ${metric("Temps economise", "11 h / semaine", "estimation")}
    </div>

    <section class="section grid grid-2">
      <article class="card">
        <p class="eyebrow">Checklist</p>
        <h2>Ce qui est connecte et ce qui manque.</h2>
        ${checklist.map(([label, ok, savedTime, why, tool]) => `
          <div class="connection-check-row">
            <span><strong>${ok ? "✅" : "❌"} ${label}</strong><small>${why}</small></span>
            <span class="tag">${savedTime}</span>
            <button class="${ok ? "secondary-button" : "primary-button"} connection-action" data-tool="${tool}">${ok ? "Configurer" : "Connecter"}</button>
          </div>
        `).join("")}
      </article>
      <article class="card">
        <p class="eyebrow">Analyse IA</p>
        <h2>Vos plus grandes opportunites aujourd'hui.</h2>
        <div class="list-row"><span><strong>Vous recevez beaucoup de demandes.</strong><br><small class="mini-muted">WhatsApp vous ferait gagner environ 5 heures par semaine.</small></span><button class="primary-button connection-action" data-tool="WhatsApp Business">Connecter</button></div>
        <div class="list-row"><span><strong>Vous gerez vos rendez-vous manuellement.</strong><br><small class="mini-muted">Google Calendar peut automatiser cette tache.</small></span><button class="primary-button connection-action" data-tool="Google Calendar">Connecter</button></div>
        <div class="list-row"><span><strong>Vos factures en retard demandent du suivi.</strong><br><small class="mini-muted">Mollie peut vous aider a suivre les paiements.</small></span><button class="primary-button connection-action" data-tool="Mollie">Connecter</button></div>
      </article>
    </section>

    <section class="section grid grid-2">
      <article class="card">
        <p class="eyebrow">Les prochaines etapes recommandees</p>
        <h2>Une seule action a la fois.</h2>
        ${roadmap.map(([title, time, gain, view]) => `
          <button class="roadmap-step" data-view="${view}">
            <span><strong>${title}</strong><small>Temps estime : ${time}<br>Gain estime : ${gain}</small></span>
            <span class="primary-button">Faire maintenant</span>
          </button>
        `).join("")}
      </article>
      <article class="card reward-card">
        <p class="eyebrow">Progression</p>
        <h2>🎉 Felicitations.</h2>
        <p>Votre entreprise est desormais optimisee a 68 %. Continuez les connexions recommandees pour debloquer le niveau suivant.</p>
        <div class="connection-levels">
          ${["Debutant", "En progression", "Optimisee", "Performante", "Exemplaire"].map((level, index) => `<span class="${index === 1 ? "active" : ""}">${level}</span>`).join("")}
        </div>
        <strong>Niveau actuel : Entreprise en progression.</strong>
      </article>
    </section>

    <section class="section">
      <div class="section-header compact-header">
        <div>
          <p class="eyebrow">Toutes mes connexions</p>
          <h2>${connections.length} outils prets a etre connectes.</h2>
        </div>
      </div>
      <div class="toolbar">
        <input class="search-input" value="Google, WhatsApp, Mollie, Meta..." aria-label="Rechercher une connexion">
        <select>${["📅 Agenda", "💬 Communication", "💳 Paiements", "📧 Emails", "📱 Reseaux sociaux", "📊 Comptabilite", "📂 Stockage", "⚙️ Automatisation"].map((category) => `<option>${category}</option>`).join("")}</select>
      </div>
      <div class="integrations-grid section">
        ${connections.map((integration) => `
        <article class="card integration-card">
          <div class="integration-top">
            <span class="integration-logo">${integration.logo}</span>
            <span class="status ${integration.connected ? "success" : integration.health.includes("🔴") ? "danger" : "warning"}">${integration.health}</span>
          </div>
          <div>
            <p class="eyebrow">${integration.category}</p>
            <h3>${integration.name}</h3>
            <p>${integration.description}</p>
          </div>
          <div class="integration-state">
            <strong>${integration.state}</strong>
            <span>Derniere synchronisation : ${integration.lastSync}</span>
          </div>
          <details open>
            <summary>Pourquoi le connecter</summary>
            <p>${integration.why}</p>
            <div class="tag-list"><span class="tag">${integration.savedTime}</span><span class="tag">Prochaine : ${integration.nextSync}</span></div>
          </details>
          <details>
            <summary>Historique</summary>
            ${integration.history.map((item) => `<div class="list-row"><span>${item}</span><strong>Fait</strong></div>`).join("")}
          </details>
          <div class="hero-actions">
            <button class="${integration.connected ? "secondary-button" : "primary-button"} connection-action" data-tool="${integration.name}">
              ${integration.connected ? "Configurer" : "Connecter"}
            </button>
            <button class="secondary-button connection-test" data-tool="${integration.name}">Tester</button>
            <button class="danger-button connection-disconnect" data-tool="${integration.name}">Deconnecter</button>
          </div>
        </article>
      `).join("")}
      </div>
    </section>

    <section class="section grid grid-2">
      <article class="card">
        <p class="eyebrow">Tableau de suivi</p>
        <h2>Synchronisations prevues.</h2>
        <div class="data-table compact-connection-table">
          ${connections.slice(0, 10).map((connection) => `<div class="table-row"><span><strong>${connection.name}</strong><small>${connection.category}</small></span><span>${connection.state}</span><span>${connection.lastSync}</span><span>${connection.nextSync}</span></div>`).join("")}
        </div>
      </article>
      <article class="card">
        <p class="eyebrow">Assistant de connexion</p>
        <h2>✨ Optimiser mon entreprise</h2>
        <p>Qualifyr AI vous guide et connecte un outil a la fois. Jamais plusieurs fenetres, jamais d'etape technique.</p>
        <div class="list-row"><span>Etape 1<br><small class="mini-muted">Connectez votre compte Google.</small></span><strong>1 min</strong></div>
        <div class="list-row"><span>Etape 2<br><small class="mini-muted">Autorisez Qualifyr AI simplement.</small></span><strong>30 s</strong></div>
        <div class="list-row"><span>Etape 3<br><small class="mini-muted">Vos rendez-vous seront synchronises automatiquement.</small></span><strong>Termine</strong></div>
        <button class="primary-button connection-optimize">${svg("spark")} ✨ Optimiser mon entreprise</button>
      </article>
    </section>

    <section class="section grid grid-2">
      <article class="card">
        <p class="eyebrow">Connexions recommandees</p>
        <h2>Selon votre activite.</h2>
        ${["Pour un plombier : Google Calendar, WhatsApp, Google Business, Mollie.", "Pour un garage : Google Calendar, WhatsApp, Facebook, Google Business.", "Pour votre entreprise aujourd'hui : WhatsApp, Mollie et Google Drive."].map((item) => `<div class="list-row"><span>${item}</span><strong>Conseil</strong></div>`).join("")}
      </article>
      <article class="card">
        <p class="eyebrow">Sante des connexions</p>
        <h2>Ce qui fonctionne et ce qui demande une action.</h2>
        <div class="list-row"><span>🟢 Fonctionne parfaitement</span><strong>${connections.filter((item) => item.health.includes("🟢")).length}</strong></div>
        <div class="list-row"><span>🟠 Synchronisation en attente</span><strong>${connections.filter((item) => item.health.includes("🟠")).length}</strong></div>
        <div class="list-row"><span>🔴 Connexion interrompue</span><strong>${errors}</strong></div>
      </article>
    </div>
  `;
}

function renderMarketplace() {
  renderCopilotLibrary("view-marketplace");
}

function renderCustomAi() {
  const software = ["Google Calendar", "Gmail", "Pennylane", "Sage", "Sellsy", "HubSpot", "Notion", "Excel", "WhatsApp Business"];
  el("view-custom-ai").innerHTML = `
    <div class="custom-ai-hero">
      <p class="eyebrow">Copilote IA sur mesure</p>
      <h2>Votre entreprise est unique.<br>Votre IA doit l'etre aussi.</h2>
      <p>Nous developpons des copilotes IA entierement personnalises selon vos processus metiers, vos logiciels et vos objectifs.</p>
    </div>
    <div class="split-layout section">
      <section class="card form-grid">
        <p class="eyebrow">Etude personnalisee</p>
        <h3>Decrivez votre besoin</h3>
        ${[
          ["Nom", "Dorian"],
          ["Entreprise", "Atelier Qualifyr Demo"],
          ["Secteur", state.profession],
          ["Nombre d'employes", "6"],
          ["Objectifs", "Gagner du temps sur les appels, devis et relances"],
          ["Budget", "300 - 800 EUR / mois"],
          ["Telephone", "06 12 34 56 78"],
          ["Email", "contact@qualifyr-ai.fr"]
        ].map(([label, value]) => `<div class="field"><label>${label}</label><input value="${value}"></div>`).join("")}
        <div class="field"><label>Description du besoin</label><textarea>Nous recevons beaucoup de demandes par telephone et WhatsApp. Nous voulons qualifier automatiquement les urgences, creer les clients, preparer les devis et relancer sans perdre le suivi.</textarea></div>
        <div class="field"><label>Logiciels utilises</label><select>${software.map((item) => `<option>${item}</option>`).join("")}</select></div>
        <div class="upload-zone">
          <strong>Ajouter des documents</strong>
          <span>Documents, captures d'ecran, PDF ou videos de vos processus actuels.</span>
        </div>
        <button class="primary-button" id="customStudy">${svg("message")} Recevoir une etude personnalisee</button>
      </section>
      <aside class="card">
        <p class="eyebrow">Ce que l'etude livre</p>
        ${["Liste de vos taches repetitives", "IA recommandees", "Actions prioritaires", "Estimation du temps gagne", "Budget de mise en place", "Plan de connexion a vos outils"].map((item) => `<div class="list-row"><span>${item}</span><strong>Inclus</strong></div>`).join("")}
      </aside>
    </div>
  `;
}

function renderNotifications() {
  el("view-notifications").innerHTML = `
    <div class="section-header">
      <div>
        <p class="eyebrow">Mes alertes</p>
        <h2>${notifications.length} choses importantes a ne pas oublier.</h2>
      </div>
      <div class="section-actions">
        <button class="secondary-button">Tout marquer comme lu</button>
        <button class="primary-button">Regler mes alertes</button>
      </div>
    </div>
    <div class="card">
      ${notifications.map(([type, text, time]) => `<div class="list-row"><span><strong>${type}</strong><br><small class="mini-muted">${text}</small></span><strong>${time}</strong></div>`).join("")}
    </div>
  `;
}

function renderDocuments() {
  el("view-documents").innerHTML = `
    <div class="section-header">
      <div>
        <p class="eyebrow">Mes documents</p>
        <h2>${documents.length} photos, contrats, factures, devis et PDF classes automatiquement.</h2>
      </div>
      <div class="section-actions">
        <button class="secondary-button export-action" data-format="pdf">Exporter PDF</button>
        <button class="secondary-button export-action" data-format="csv">Exporter CSV</button>
        <button class="primary-button">${svg("file")} Ajouter un document</button>
      </div>
    </div>
    <div class="toolbar">
      <input class="search-input" value="Rechercher un document, client ou facture" aria-label="Rechercher un document">
      <select><option>Tous les fichiers</option><option>Photos</option><option>Contrats</option><option>Factures</option><option>Devis</option><option>PDF</option></select>
      <select><option>Classement automatique</option><option>Par client</option><option>Par date</option><option>Par type</option></select>
    </div>
    <div class="grid grid-4">
      ${metric("Photos", documents.filter(([type]) => type === "Photo").length, "Chantiers")}
      ${metric("Factures", documents.filter(([type]) => type === "Facture").length, "Paiements")}
      ${metric("Devis", documents.filter(([type]) => type === "Devis").length, "Ventes")}
      ${metric("Contrats et plans", documents.filter(([type]) => ["Contrat", "Plan"].includes(type)).length, "Archives")}
    </div>
    <div class="data-table">
      ${documents.map(([type, name, client, classification]) => `<div class="table-row"><span><strong>${name}</strong><small>${type}</small></span><span>${client}</span><span>${classification}</span><span class="status success">Classe</span></div>`).join("")}
    </div>
  `;
}

function renderSettings() {
  el("view-settings").innerHTML = `
    <div class="section-header">
      <div>
        <p class="eyebrow">Mon entreprise</p>
        <h2>Les informations utiles pour travailler correctement.</h2>
      </div>
      <button class="primary-button">Enregistrer</button>
    </div>
    <div class="grid grid-2">
      <article class="card form-grid">
        ${["Entreprise", "Logo", "TVA", "Adresse", "Telephone", "Email", "Horaires"].map((label) => `<div class="field"><label>${label}</label><input value="${label === "Entreprise" ? "Qualifyr AI Demo - Artisan" : label === "TVA" ? "20%" : label === "Horaires" ? "Lun-Ven 08:00-18:30" : ""}"></div>`).join("")}
      </article>
      <article class="card">
        <p class="eyebrow">Abonnement et utilisateurs</p>
        ${["Plan Pro actif", "4 personnes dans l'equipe", "11 IA disponibles", "Bibliotheque d'IA active", "Paiement en ligne pret"].map((item) => `<div class="list-row"><span>${item}</span><strong>OK</strong></div>`).join("")}
      </article>
    </div>
  `;
}

function renderMore() {
  const moreItems = [
    ["quotes", "Mes devis", "Creer, modifier, signer et exporter en PDF", "file"],
    ["landing", "Page de presentation", "Presenter Qualifyr AI a de futurs clients", "spark"],
    ["pricing", "Tarifs", "Plans, essai gratuit, coupons et limites", "card"],
    ["commercial", "Mon abonnement", "Offre actuelle, options, ROI, licences et paiements", "shield"],
    ["documents", "Mes documents", "Photos, factures, contrats, plans et PDF", "file"],
    ["notifications", "Mes alertes", "Clients, paiements, relances et rendez-vous", "message"],
    ["integrations", "Mes connexions", "Google, Meta, Mollie et vos outils du quotidien", "grid"],
    ["ai-center", "Mon assistant IA", "Activer, regler ou arreter une IA", "spark"],
    ["marketplace", "Ajouter une IA", "Installer de nouvelles aides intelligentes", "grid"],
    ["custom-ai", "IA sur mesure", "Recevoir une etude personnalisee", "message"],
    ["settings", "Mon entreprise", "Entreprise, TVA, horaires et equipe", "shield"],
    ["billing", "Mes factures", "Factures, paiements, relances et exports", "card"],
    ["help", "Aide", "Guides simples et support", "help"]
  ];
  el("view-more").innerHTML = `
    <div class="mobile-more-head">
      <p class="eyebrow">Menu</p>
      <h2>Plus</h2>
      <p>Retrouvez les pages utiles que vous consultez moins souvent.</p>
    </div>
    <div class="ios-list">
      ${moreItems.map(([view, title, desc, icon]) => `
        <button class="ios-row" data-view="${view}">
          <span class="ios-icon">${svg(icon)}</span>
          <span><strong>${title}</strong><small>${desc}</small></span>
          <span class="ios-chevron">›</span>
        </button>
      `).join("")}
    </div>
  `;
}

function renderDashboard() {
  const copilot = getCopilotInsights();
  const todayActions = [
    {
      icon: "users",
      title: `${copilot.newProspects.length} nouveaux clients`,
      detail: "A appeler ou ranger aujourd'hui",
      view: "crm",
      cta: "Voir"
    },
    {
      icon: "file",
      title: `${copilot.quotesToFollow.length} devis a relancer`,
      detail: "De l'argent peut encore etre recupere",
      view: "quotes",
      cta: "Relancer"
    },
    {
      icon: "calendar",
      title: `${copilot.todayAppointments.length} rendez-vous`,
      detail: "Votre journee est deja organisee",
      view: "calendar",
      cta: "Planning"
    },
    {
      icon: "card",
      title: `${copilot.unpaidInvoices.length} facture en attente`,
      detail: "Un paiement peut etre suivi",
      view: "billing",
      cta: "Verifier"
    }
  ];
  const quickActions = [
    ["Ajouter un client", "crm", "users"],
    ["Faire un devis", "quotes", "file"],
    ["Voir mon planning", "calendar", "calendar"],
    ["Demander a Qualifyr", "ai-center", "spark"]
  ];
  const simpleAdvice = [
    ["Relancer le devis Martin", "Vous pouvez recuperer 3 400 EUR.", "Faire maintenant", "quotes"],
    ["Demander 5 avis Google", "De bons clients peuvent vous recommander.", "Envoyer", "notifications"],
    ["Installer WhatsApp IA", "Les demandes avec photos seront triees seules.", "Installer", "marketplace"]
  ];
  const wowProof = [
    ["+3 400 EUR", "A recuperer", "Qualifyr a repere un devis chaud a relancer maintenant.", "quotes"],
    ["2 h 35", "Gagnees cette semaine", "Les relances, messages et rendez-vous ont ete prepares pour vous.", "ai-center"],
    ["18", "Demandes traitees", "Les nouveaux messages ont ete classes avant meme votre ouverture.", "crm"]
  ];
  el("view-dashboard").innerHTML = `
    <section class="simple-home-hero">
      <article class="card simple-main-card">
        <span class="status warning">A faire aujourd'hui</span>
        <h2>Bonjour Dorian 👋</h2>
        <p>Voici les choses importantes. Cliquez sur une carte, Qualifyr AI vous emmene au bon endroit.</p>
        <div class="simple-attention-list">
          ${todayActions.map((item) => `
            <button class="simple-attention-row" data-view="${item.view}">
              <span class="simple-icon">${svg(item.icon)}</span>
              <span>
                <strong>${item.title}</strong>
                <small>${item.detail}</small>
              </span>
              <b>${item.cta}</b>
            </button>
          `).join("")}
        </div>
      </article>
      <aside class="card simple-ai-card">
        <span class="simple-ai-orb">✨</span>
        <h3>Demander a Qualifyr AI</h3>
        <p>Ecrivez comme a un employe. Exemple : “Fais un devis pour Martin”.</p>
        <div class="assistant-input-row">
          <input id="homeAssistantPrompt" value="Qui dois-je rappeler aujourd'hui ?" aria-label="Demander a Qualifyr AI">
          <button class="primary-button assistant-ask" data-input="homeAssistantPrompt">Demander</button>
        </div>
      </aside>
    </section>

    <section class="section simple-wow-section">
      <div class="simple-section-title">
        <span>Ce que Qualifyr a deja vu pour vous</span>
        <h2>Des gains visibles, pas des tableaux compliques</h2>
      </div>
      <div class="wow-proof-grid">
        ${wowProof.map(([value, title, detail, view]) => `
          <button class="card wow-proof-card" data-view="${view}">
            <strong>${value}</strong>
            <span>${title}</span>
            <small>${detail}</small>
          </button>
        `).join("")}
      </div>
    </section>

    <section class="section simple-section">
      <div class="simple-section-title">
        <span>Actions rapides</span>
        <h2>Que voulez-vous faire ?</h2>
      </div>
      <div class="simple-quick-grid">
        ${quickActions.map(([label, view, icon]) => `
          <button class="simple-quick-card" data-view="${view}">
            <span>${svg(icon)}</span>
            <strong>${label}</strong>
          </button>
        `).join("")}
      </div>
    </section>

    <section class="section simple-section">
      <div class="simple-section-title">
        <span>Conseils de l'assistant</span>
        <h2>Les 3 meilleures actions maintenant</h2>
      </div>
      <div class="simple-advice-grid">
        ${simpleAdvice.map(([title, detail, cta, view], index) => `
          <button class="card simple-advice-card" data-view="${view}">
            <span class="simple-rank">${index + 1}</span>
            <strong>${title}</strong>
            <small>${detail}</small>
            <b>${cta}</b>
          </button>
        `).join("")}
      </div>
    </section>

    <section class="section simple-section simple-two-col">
      <article class="card simple-list-card">
        <div class="simple-section-title">
          <span>Prochains rendez-vous</span>
          <h2>Aujourd'hui</h2>
        </div>
        ${copilot.todayAppointments.slice(0, 3).map(([time, client, title, travel]) => `
          <button class="simple-list-row" data-view="calendar">
            <strong>${time}</strong>
            <span>${title}<small>${client} · ${travel}</small></span>
          </button>
        `).join("")}
      </article>
      <article class="card simple-list-card">
        <div class="simple-section-title">
          <span>Nouveaux clients</span>
          <h2>A traiter</h2>
        </div>
        ${copilot.newProspects.slice(0, 3).map((client) => `
          <button class="simple-list-row client-row" data-client="${client.id}">
            <strong>${client.name.split(" ").slice(-1)[0]}</strong>
            <span>${client.notes}<small>${client.source} · ${client.phone}</small></span>
          </button>
        `).join("")}
      </article>
    </section>
  `;
}

function renderAll() {
  renderNav();
  renderBottomNav();
  renderDashboard();
  renderLanding();
  renderPricing();
  renderCommercial();
  renderOnboarding();
  renderModules();
  renderCrm();
  renderClientProfile();
  renderQuotes();
  renderCalendar();
  renderCopilots();
  renderAiCenter();
  renderAutomations();
  renderIntegrations();
  renderMarketplace();
  renderCopilotSetup();
  renderCustomAi();
  renderNotifications();
  renderDocuments();
  renderSettings();
  renderMore();
  renderAdmin();
  renderBilling();
  renderHelp();
  showView(state.view);
}

document.addEventListener("click", (event) => {
  const viewButton = event.target.closest("[data-view]");
  if (viewButton) {
    showView(viewButton.dataset.view);
    return;
  }

  const professionButton = event.target.closest("[data-profession]");
  if (professionButton) {
    state.profession = professionButton.dataset.profession;
    renderAll();
    showView("onboarding");
    return;
  }

  if (event.target.closest("#saveOnboarding")) {
    toast(`Playbook ${state.profession} active sur tous les modules.`);
  }

  const optionUnlock = event.target.closest(".option-unlock");
  if (optionUnlock) {
    toast(`${optionUnlock.dataset.option} : ROI calcule et option prete a etre debloquee.`);
    return;
  }

  if (event.target.closest(".license-action")) {
    toast("Invitation collaborateur preparee avec les bons droits.");
    return;
  }

  if (event.target.closest(".payment-action")) {
    toast("Espace paiement ouvert : factures et moyen de paiement prets.");
    return;
  }

  if (event.target.closest(".referral-action")) {
    toast("Lien ambassadeur copie. Une recompense sera suivie automatiquement.");
    return;
  }

  if (event.target.closest("#startDay")) {
    toast("Votre briefing est pret : Qualifyr AI a classe les priorites de la journee.");
    return;
  }

  if (event.target.closest("#endDay")) {
    toast("Resume prepare : demain est organise avec les taches restantes.");
    return;
  }

  const assistantAsk = event.target.closest(".assistant-ask");
  if (assistantAsk) {
    const input = el(assistantAsk.dataset.input);
    const targetView = viewFromAssistantPrompt(input ? input.value : "");
    showView(targetView);
    toast("Qualifyr AI a compris votre demande et ouvre la bonne page.");
    return;
  }

  if (event.target.closest("#addLead")) {
    toast("Client ajoute avec ses coordonnees, son historique et ses documents.");
  }

  const clientRow = event.target.closest("[data-client]");
  if (clientRow) {
    state.selectedClientId = clientRow.dataset.client;
    renderClientProfile();
    showView("client-profile");
    return;
  }

  const assistantToggle = event.target.closest(".assistant-toggle");
  if (assistantToggle) {
    const assistant = platformRegistry.assistants.find((item) => item.id === assistantToggle.dataset.assistant);
    if (assistant) {
      assistant.status = assistant.status === "Actif" ? "Inactif" : "Actif";
      assistant.history.unshift(`${assistant.status === "Actif" ? "Activation" : "Desactivation"} par administrateur`);
      renderAiCenter();
      toast(`${assistant.title} ${assistant.status.toLowerCase()}.`);
    }
    return;
  }

  const aiCenterToggle = event.target.closest(".ai-center-toggle");
  if (aiCenterToggle) {
    const copilot = platformRegistry.aiCenterCopilots.find((item) => item.id === aiCenterToggle.dataset.aiCopilot);
    if (copilot) {
      copilot.status = aiCenterToggle.dataset.nextState;
      copilot.history.unshift(`${copilot.status === "Actif" ? "Activation" : "Desactivation"} depuis Mon assistant IA`);
      renderAiCenter();
      toast(`${copilot.name} ${copilot.status.toLowerCase()}.`);
    }
    return;
  }

  const installButton = event.target.closest(".marketplace-install");
  if (installButton) {
    if (installButton.dataset.simpleAi) {
      if (installButton.dataset.simpleAi === "custom") {
        showView("custom-ai");
        toast("Decrivez votre besoin pour recevoir un devis personnalise.");
        return;
      }
      toast("Votre IA est installee. Vous pouvez l'activer quand vous voulez.");
      return;
    }
    const copilot = marketplaceCatalog.flatMap((category) => category.copilots).find((item) => item.id === installButton.dataset.copilot);
    if (copilot) {
      if (copilot.id === "custom") {
        showView("custom-ai");
        toast("Le copilote IA personnalise se configure via une etude sur devis.");
        return;
      }
      copilot.installed = true;
      renderMarketplace();
      toast(`Copilote ${copilot.name} installe dans votre espace.`);
    }
    return;
  }

  const copilotHire = event.target.closest(".copilot-hire");
  if (copilotHire) {
    openCopilotSetup(copilotHire.dataset.employee, "install");
    toast(`${copilotHire.dataset.employee} : Qualifyr AI vous guide etape par etape.`);
    return;
  }

  const tradeInstall = event.target.closest(".trade-copilot-install");
  if (tradeInstall) {
    const copilot = tradeCopilots.find((item) => item.profession === tradeInstall.dataset.trade);
    state.profession = tradeInstall.dataset.trade || state.profession;
    toast(`${copilot?.name || "Votre copilote"} est pret : formulaire, installation site et abonnement Pro recommandes.`);
    return;
  }

  const tradeEmail = event.target.closest(".trade-copilot-email");
  if (tradeEmail) {
    const copilot = tradeCopilots.find((item) => item.profession === tradeEmail.dataset.trade);
    toast(`${copilot?.name || "Le copilote"} sera configure pour recevoir les demandes par email.`);
    return;
  }

  if (event.target.closest(".trade-form-submit")) {
    toast("Formulaire recu : Qualifyr AI prepare le copilote et le lien d'installation.");
    return;
  }

  const tradePlan = event.target.closest(".trade-plan-select");
  if (tradePlan) {
    toast(`Formule ${tradePlan.dataset.plan} selectionnee : paiement mensuel et activation du copilote prepares.`);
    return;
  }

  if (event.target.closest(".trade-scroll-form")) {
    toast("Choisissez un metier, puis le formulaire prepare le copilote automatiquement.");
    return;
  }

  if (event.target.closest(".trade-scroll-pricing")) {
    toast("Tarifs : Essentiel 79 EUR, Pro 149 EUR recommande, Equipe 299 EUR par mois.");
    return;
  }

  const packInstall = event.target.closest(".pack-install");
  if (packInstall) {
    toast(`${packInstall.dataset.pack} installe : copilotes, missions, connexions, modeles et tableaux de bord sont prets.`);
    return;
  }

  const packDemo = event.target.closest(".pack-demo");
  if (packDemo) {
    toast(`Demo ${packDemo.dataset.pack} lancee avec donnees fictives et scenario complet.`);
    return;
  }

  if (event.target.closest(".pack-auto-install")) {
    toast("Installation automatique lancee : Qualifyr AI configure, connecte, active, teste et valide.");
    return;
  }

  const copilotDemo = event.target.closest(".copilot-demo");
  if (copilotDemo) {
    openCopilotSetup(copilotDemo.dataset.employee, "demo");
    toast(`Demonstration de ${copilotDemo.dataset.employee} ouverte avec un cas client fictif.`);
    return;
  }

  const setupAuto = event.target.closest(".setup-auto");
  if (setupAuto) {
    toast("Qualifyr AI configure automatiquement les reglages utiles. Une seule validation vous sera demandee.");
    return;
  }

  const setupTest = event.target.closest(".setup-test");
  if (setupTest) {
    toast("Test lance avec un faux client : vous voyez le resultat avant activation.");
    return;
  }

  const setupActivate = event.target.closest(".setup-activate");
  if (setupActivate) {
    toast(`${state.selectedCopilotName} est actif. Il peut maintenant travailler pour votre entreprise.`);
    return;
  }

  const setupConfigure = event.target.closest(".setup-configure");
  if (setupConfigure) {
    toast(`${setupConfigure.dataset.item} : Qualifyr AI ouvre une etape simple, sans reglage technique.`);
    return;
  }

  if (event.target.closest(".setup-help")) {
    toast("Guide pas a pas ouvert : Qualifyr AI vous demande une seule action a la fois.");
    return;
  }

  if (event.target.closest(".demo-action")) {
    toast("Mode demonstration ouvert : scenario complet avec donnees fictives.");
    return;
  }

  if (event.target.closest(".update-discover")) {
    toast("Nouveaute ouverte avec son impact et sa demonstration.");
    return;
  }

  const copilotConfigure = event.target.closest(".copilot-configure");
  if (copilotConfigure) {
    openCopilotSetup(copilotConfigure.dataset.employee, "configure");
    toast(`Configuration guidee de ${copilotConfigure.dataset.employee} ouverte.`);
    return;
  }

  const copilotRemove = event.target.closest(".copilot-remove");
  if (copilotRemove) {
    toast(`${copilotRemove.dataset.employee} est pret a etre desinstalle. Les donnees restent conservees.`);
    return;
  }

  const configureButton = event.target.closest(".marketplace-configure");
  if (configureButton) {
    const copilot = marketplaceCatalog.flatMap((category) => category.copilots).find((item) => item.id === configureButton.dataset.copilot);
    if (copilot) {
      if (copilot.id === "custom") {
        showView("custom-ai");
        toast("Decrivez votre besoin pour recevoir une etude personnalisee.");
        return;
      }
      toast(`Configuration du copilote ${copilot.name} prete avec ${copilot.automations} automatisations.`);
    }
    return;
  }

  const connectionAction = event.target.closest(".connection-action");
  if (connectionAction) {
    toast(`${connectionAction.dataset.tool} : l'assistant ouvre la connexion et vous guide etape par etape.`);
    return;
  }

  const connectionTest = event.target.closest(".connection-test");
  if (connectionTest) {
    toast(`${connectionTest.dataset.tool} fonctionne correctement.`);
    return;
  }

  const connectionDisconnect = event.target.closest(".connection-disconnect");
  if (connectionDisconnect) {
    toast(`${connectionDisconnect.dataset.tool} peut etre deconnecte. Vos donnees restent conservees.`);
    return;
  }

  if (event.target.closest(".connection-optimize")) {
    toast("Qualifyr AI lance l'assistant et vous propose une seule action a la fois.");
    return;
  }

  const integrationButton = event.target.closest(".integration-action");
  if (integrationButton) {
    const integration = integrationCatalog.find((item) => item.id === integrationButton.dataset.integration);
    if (integration) {
      integration.connected = true;
      integration.state = "Connecte";
      integration.history.unshift("Connexion demandee depuis Qualifyr AI");
      renderIntegrations();
      toast(`${integration.name} pret pour configuration backend.`);
    }
    return;
  }

  const trialButton = event.target.closest(".trial-action");
  if (trialButton) {
    toast(`Essai gratuit ${trialButton.dataset.plan} prepare. Le checkout Mollie sera cree cote serveur.`);
    return;
  }

  const copilotToggle = event.target.closest(".copilot-toggle");
  if (copilotToggle) {
    const title = copilotToggle.dataset.copilotTitle;
    const copilot = platformRegistry.copilotCategories.flatMap((category) => category.copilots).find((item) => item.title === title);
    if (copilot) {
      if (copilot.status === "Actif") {
        toast(`${copilot.title} ouvert en configuration.`);
      } else {
        copilot.status = "Actif";
        renderCopilots();
        renderAiCenter();
        toast(`${copilot.title} installe et active.`);
      }
    }
    return;
  }

  const copilotUninstall = event.target.closest(".copilot-uninstall");
  if (copilotUninstall) {
    const title = copilotUninstall.dataset.copilotTitle;
    const copilot = platformRegistry.copilotCategories.flatMap((category) => category.copilots).find((item) => item.title === title);
    if (copilot) {
      copilot.status = "Disponible";
      renderCopilots();
      renderAiCenter();
      toast(`${copilot.title} desinstalle. Les donnees restent conservees.`);
    }
    return;
  }

  if (event.target.closest("#customStudy")) {
    toast("Demande recue. Une etude personnalisee Qualifyr AI est preparee.");
    return;
  }

  const quoteAction = event.target.closest(".quote-action");
  if (quoteAction) {
    const labels = {
      edit: "Le devis est pret a etre modifie.",
      duplicate: "Devis duplique avec un nouveau numero automatique.",
      send: "Devis envoye au client avec suivi de lecture.",
      pdf: "Le devis est pret a etre telecharge.",
      invoice: "Le devis est transforme en facture."
    };
    toast(labels[quoteAction.dataset.action] || "Action devis executee.");
    return;
  }

  const invoiceAction = event.target.closest(".invoice-action");
  if (invoiceAction) {
    const labels = {
      edit: "La facture est prete a etre modifiee.",
      pdf: "Le PDF de la facture est pret.",
      payment: "Le lien de paiement est pret a etre envoye.",
      reminder: "La relance de facture est programmee."
    };
    toast(labels[invoiceAction.dataset.action] || "Action facture effectuee.");
    return;
  }

  const appointmentAction = event.target.closest(".appointment-action");
  if (appointmentAction) {
    const labels = {
      edit: "Le rendez-vous est pret a etre modifie.",
      move: "Le rendez-vous peut etre deplace dans le planning.",
      delete: "Le rendez-vous est marque pour suppression."
    };
    toast(labels[appointmentAction.dataset.action] || "Planning mis a jour.");
    return;
  }

  const exportAction = event.target.closest(".export-action");
  if (exportAction) {
    toast(`Export ${exportAction.dataset.format.toUpperCase()} prepare avec les donnees visibles.`);
    return;
  }

  const crmBulkAction = event.target.closest(".crm-bulk-action");
  if (crmBulkAction) {
    const labels = {
      archive: "Les fiches selectionnees sont archivees.",
      merge: "Les doublons detectes sont prets a fusionner.",
      delete: "La suppression demandera une confirmation."
    };
    toast(labels[crmBulkAction.dataset.action] || "Action client preparee.");
    return;
  }

  if (event.target.closest("#updateQuote") && el("quoteClient")) {
    state.quote.client = el("quoteClient").value;
    state.quote.need = el("quoteNeed").value;
    state.quote.urgency = el("quoteUrgency").value;
    state.quote.amount = Number(el("quoteAmount").value || 0);
    renderQuotes();
    toast("Devis regenere et pret a modifier.");
  }

  if (event.target.closest("#updateQuote") && !el("quoteClient")) {
    toast("Nouveau devis cree avec numerotation automatique QAI-2026-017.");
    return;
  }

  if (event.target.closest("#testWorkflow")) {
    toast("Simulation lancee : appel entrant, urgence detectee, rendez-vous cree.");
  }

  if (event.target.closest("#publishWorkflow")) {
    toast("Votre automatisation est prete.");
  }
});

el("menuToggle").addEventListener("click", () => {
  document.querySelector(".sidebar").classList.toggle("open");
});

document.addEventListener("input", (event) => {
  if (event.target.id === "crmSearch") {
    state.crmSearch = event.target.value;
    renderCrm();
    const search = el("crmSearch");
    search.focus();
    search.setSelectionRange(search.value.length, search.value.length);
  }
});

renderAll();
