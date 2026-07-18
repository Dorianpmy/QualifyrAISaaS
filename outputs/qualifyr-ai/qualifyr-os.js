(function bootstrapQualifyrOS(global) {
  const core = [
    ["auth", "Compte et accès"], ["workspace", "Entreprise"], ["billing", "Abonnement"],
    ["crm", "Clients"], ["automations", "Automatisations"], ["ai", "Assistant IA"],
    ["analytics", "Statistiques"], ["notifications", "Notifications"], ["files", "Fichiers"], ["settings", "Réglages"]
  ].map(([id, name]) => ({ id, name, kind: "core", alwaysOn: true }));

  const modules = [
    { id: "dashboard", name: "Tableau de bord", promise: "Voir l'essentiel et savoir quoi faire.", icon: "dashboard", route: "dashboard", group: "Pilotage", defaultEnabled: true },
    { id: "website", name: "Site internet", promise: "Présenter votre activité et recevoir des demandes.", icon: "grid", route: "website", group: "Visibilité", defaultEnabled: true },
    { id: "landing-pages", name: "Pages de vente", promise: "Créer une page simple pour une offre.", icon: "file", route: "website", group: "Visibilité" },
    { id: "blog", name: "Blog", promise: "Publier des conseils qui attirent des clients.", icon: "file", route: "content", group: "Visibilité" },
    { id: "seo", name: "Visibilité Google", promise: "Être trouvé plus facilement dans votre ville.", icon: "star", route: "seo", group: "Visibilité", defaultEnabled: true },
    { id: "forms", name: "Formulaires", promise: "Transformer les visiteurs en demandes clients.", icon: "file", route: "forms", group: "Acquisition", defaultEnabled: true },
    { id: "booking", name: "Prise de rendez-vous", promise: "Laisser les clients réserver sans vous appeler.", icon: "calendar", route: "calendar", group: "Acquisition", defaultEnabled: true },
    { id: "ai-chatbot", name: "Chat du site", promise: "Répondre aux premières questions jour et nuit.", icon: "message", route: "marketplace", group: "Acquisition" },
    { id: "ai-assistant", name: "Assistant IA", promise: "Préparer votre travail à partir d'une simple demande.", icon: "spark", route: "ai-center", group: "Organisation", defaultEnabled: true },
    { id: "social-content", name: "Réseaux sociaux", promise: "Préparer des publications sans partir de zéro.", icon: "message", route: "content", group: "Communication" },
    { id: "email-marketing", name: "Emails clients", promise: "Informer et relancer vos contacts simplement.", icon: "message", route: "content", group: "Communication" },
    { id: "sms", name: "SMS", promise: "Confirmer et relancer au bon moment.", icon: "phone", route: "automations", group: "Communication" },
    { id: "reviews", name: "Avis clients", promise: "Demander plus d'avis et suivre votre réputation.", icon: "star", route: "reviews", group: "Communication", defaultEnabled: true },
    { id: "pipelines", name: "Suivi commercial", promise: "Voir où en est chaque demande.", icon: "workflow", route: "crm", group: "Ventes", defaultEnabled: true },
    { id: "quotes", name: "Devis", promise: "Créer, envoyer et relancer vos devis.", icon: "file", route: "quotes", group: "Ventes", defaultEnabled: true },
    { id: "invoices", name: "Factures", promise: "Suivre ce qui est payé ou en attente.", icon: "card", route: "billing", group: "Ventes", defaultEnabled: true },
    { id: "analytics", name: "Statistiques", promise: "Comprendre les résultats sans tableaux compliqués.", icon: "dashboard", route: "analytics", group: "Pilotage", defaultEnabled: true }
  ];

  const storageKey = "qualifyr_os_workspace_v1";
  const readWorkspace = () => {
    try { return JSON.parse(localStorage.getItem(storageKey) || "null"); } catch (_) { return null; }
  };
  const saveWorkspace = (workspace) => {
    const normalized = { version: 1, createdAt: new Date().toISOString(), ...readWorkspace(), ...workspace };
    localStorage.setItem(storageKey, JSON.stringify(normalized));
    return normalized;
  };
  const enabledModules = () => {
    const saved = readWorkspace()?.enabledModules;
    return Array.isArray(saved) ? saved : modules.filter((item) => item.defaultEnabled).map((item) => item.id);
  };
  const setModuleEnabled = (id, enabled) => {
    const current = new Set(enabledModules());
    enabled ? current.add(id) : current.delete(id);
    return saveWorkspace({ enabledModules: [...current] });
  };

  global.QualifyrOS = Object.freeze({ version: "1.0.0", core, modules, readWorkspace, saveWorkspace, enabledModules, setModuleEnabled });
})(window);
