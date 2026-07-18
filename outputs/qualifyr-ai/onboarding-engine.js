(function initOnboardingEngine(root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.QualifyrOnboarding = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function createOnboardingEngine() {
  const tradeCategories = [
    ["building", "Artisans et bâtiment", [["plumber","Plombier"],["electrician","Électricien"],["mason","Maçon"],["painter","Peintre"],["carpenter","Menuisier"],["roofer","Couvreur"],["locksmith","Serrurier"],["heating_engineer","Chauffagiste"],["hvac_company","Climaticien"],["general_contractor","Entreprise générale du bâtiment"]]],
    ["telecom", "Fibre, télécom et terrain", [["fiber_optic_company","Entreprise de fibre optique"],["telecom_subcontractor","Sous-traitant télécom"],["network_installer","Installation réseau"],["telecom_maintenance","Maintenance télécom"],["telecom_civil_engineering","Génie civil télécom"],["field_service_company","Entreprise d’intervention terrain"]]],
    ["real_estate", "Immobilier", [["independent_real_estate_agent","Agent immobilier indépendant"],["real_estate_mandatary","Mandataire immobilier"],["real_estate_agency","Agence immobilière"],["property_management","Gestion locative"],["property_finder","Chasseur immobilier"]]],
    ["local_services", "Services locaux", [["cleaning_company","Entreprise de nettoyage"],["landscaper","Paysagiste"],["car_garage","Garage automobile"],["repair_service","Dépannage"],["photographer","Photographe"],["hair_salon","Salon de coiffure"],["beauty_institute","Institut de beauté"]]],
    ["professional_services", "Services professionnels", [["consultant","Consultant"],["coach","Coach"],["trainer","Formateur"],["freelancer","Freelance"],["agency","Agence"],["service_firm","Cabinet de services"]]]
  ].map(([id,name,trades]) => ({ id,name,trades:trades.map(([tradeId,label]) => ({ id:tradeId,label,category:id })) }));
  const allTrades = tradeCategories.flatMap((category) => category.trades);

  const packs = {
    artisan: { id:"artisan", name:"Pack Artisan", category:"Artisans", trades:tradeCategories[0].trades.map(t=>t.id), modules:["crm","forms","booking","quotes","automations","website","reviews"], pipeline:["Nouveau prospect","À contacter","Visite ou diagnostic","Devis à préparer","Devis envoyé","Relance","Accepté","Chantier planifié","Terminé","Perdu"], fields:["urgence","type_intervention","adresse_chantier","photos"], forms:["Demande d'intervention","Visite technique"], automations:["Répondre aux nouvelles demandes","Relancer un devis après 3 jours","Rappeler un rendez-vous la veille"], templates:["Devis intervention","Confirmation de rendez-vous"], dashboard:["Nouvelles demandes","Devis à relancer","Rendez-vous","Temps gagné"], nextActions:["Connecter votre agenda","Créer votre premier formulaire"] },
    telecom: { id:"telecom", name:"Pack Fibre et Télécom", category:"Télécom", trades:tradeCategories[1].trades.map(t=>t.id), modules:["crm","booking","files","forms","automations","quotes","invoices"], pipeline:["Nouvelle demande","À qualifier","Intervention à planifier","Technicien assigné","Intervention en cours","Compte rendu requis","Photos à vérifier","Intervention terminée","Facturation","Clôturé"], fields:["type_intervention","technicien","référence_chantier","photos","compte_rendu"], forms:["Compte rendu d'intervention","Contrôle photos"], automations:["Alerter sur une intervention non assignée","Demander le compte rendu","Préparer la facturation"], templates:["Fiche intervention","Compte rendu terrain"], dashboard:["Interventions à planifier","Interventions en cours","Comptes rendus manquants","Facturation"], nextActions:["Créer les membres de l'équipe","Configurer le planning"] },
    real_estate: { id:"real_estate", name:"Pack Immobilier", category:"Immobilier", trades:tradeCategories[2].trades.map(t=>t.id), modules:["crm","booking","forms","website","automations","email-marketing","social-content","files"], pipeline:["Nouveau contact","À qualifier","Estimation à organiser","Mandat potentiel","Mandat signé","Bien à préparer","Visites","Offre reçue","Transaction en cours","Finalisé","Perdu"], fields:["type_contact","type_bien","secteur","budget","projet"], forms:["Demande d'estimation","Recherche de bien"], automations:["Relancer une estimation","Confirmer une visite","Suivre un mandat potentiel"], templates:["Confirmation de visite","Suivi estimation"], dashboard:["Nouveaux contacts","Estimations","Visites","Mandats potentiels"], nextActions:["Ajouter votre zone immobilière","Connecter votre agenda"] },
    services: { id:"services", name:"Pack Services", category:"Services", trades:[...tradeCategories[3].trades,...tradeCategories[4].trades].map(t=>t.id), modules:["crm","booking","forms","automations","website","social-content","reviews"], pipeline:["Nouveau prospect","À contacter","Besoin identifié","Proposition envoyée","Relance","Rendez-vous planifié","Client actif","Terminé","Perdu"], fields:["type_besoin","budget","échéance"], forms:["Demande de contact","Prise de rendez-vous"], automations:["Répondre à une demande","Relancer une proposition","Demander un avis"], templates:["Proposition commerciale","Message de suivi"], dashboard:["Nouveaux prospects","Propositions","Rendez-vous","Avis"], nextActions:["Publier votre formulaire","Ajouter vos services"] },
    generic: { id:"generic", name:"Pack Essentiel", category:"Générique", trades:[], modules:["crm","forms","booking","automations","website"], pipeline:["Nouveau","À contacter","En cours","Proposition","Relance","Gagné","Perdu"], fields:["besoin","priorité","échéance"], forms:["Demande de contact"], automations:["Répondre à une demande","Relancer un contact"], templates:["Message de bienvenue"], dashboard:["Nouvelles demandes","À faire","Rendez-vous","Résultats"], nextActions:["Créer votre premier formulaire"] }
  };
  const goals = [
    ["find_clients","Trouver plus de clients"],["organize_prospects","Mieux organiser les prospects"],["website","Créer ou améliorer un site internet"],["automate","Automatiser les tâches répétitives"],["save_time","Gagner du temps"],["booking","Gérer les rendez-vous"],["follow_up","Améliorer les relances"],["quotes","Générer des devis"],["seo","Améliorer le référencement"],["content","Publier du contenu"],["centralize","Centraliser les outils de l’entreprise"]
  ].map(([id,label])=>({id,label}));
  const packForTrade = (tradeId) => Object.values(packs).find((pack)=>pack.id!=="generic" && pack.trades.includes(tradeId)) || packs.generic;
  const recommend = ({ tradeId="other", size="independent", goals:selectedGoals=[], website="" }={}) => {
    const pack=packForTrade(tradeId); const enabled=new Set(pack.modules); const recommended=new Set(pack.modules);
    const add=(...ids)=>ids.forEach(id=>recommended.add(id));
    selectedGoals.forEach(goal=>{
      if(goal==="find_clients") add("crm","forms","website","automations");
      if(goal==="booking") add("booking","forms","automations");
      if(goal==="automate"||goal==="save_time") add("automations","ai-assistant");
      if(goal==="seo") add("website","seo","social-content");
      if(goal==="content") add("social-content","email-marketing");
      if(goal==="quotes") add("quotes","invoices");
    });
    if(!website) enabled.add("website");
    if(size!=="independent" && pack.id==="telecom") add("booking","files");
    return { pack, enabledModules:[...enabled], recommendedModules:[...recommended], nextActions:pack.nextActions };
  };
  const validateStep = (step,data={}) => {
    const errors={};
    if(step===2 && !String(data.companyName||"").trim()) errors.companyName="Indiquez le nom de l’entreprise.";
    if(step===3 && !data.tradeId) errors.tradeId="Choisissez votre activité.";
    if(step===3 && data.tradeId==="other" && !String(data.customTrade||"").trim()) errors.customTrade="Précisez votre activité.";
    if(step===4 && (!Array.isArray(data.goals)||!data.goals.length)) errors.goals="Choisissez au moins un objectif.";
    if(step===4 && !data.goals?.includes(data.primaryGoal)) errors.primaryGoal="Choisissez votre objectif principal.";
    if(step===5 && !String(data.email||"").includes("@")) errors.email="Indiquez un email professionnel valide.";
    return errors;
  };
  const resumeStep = (progress={}) => progress.status==="completed" ? 9 : Math.min(9,Math.max(1,Number(progress.currentStep||1)));
  return { tradeCategories, allTrades, packs, goals, packForTrade, recommend, validateStep, resumeStep };
});
