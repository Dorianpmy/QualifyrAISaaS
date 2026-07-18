(function(root,factory){const api=factory();if(typeof module==="object"&&module.exports)module.exports=api;else root.QualifyrDashboard=api;})(typeof self!=="undefined"?self:this,function(){
  const registry={
    attention_center:{name:"À traiter maintenant",category:"action",required:true,modules:[]},
    primary_metrics:{name:"Les chiffres utiles",category:"metrics",required:true,modules:[]},
    today_schedule:{name:"Aujourd’hui",category:"operations",required:false,modules:["booking"]},
    commercial_overview:{name:"Suivi commercial",category:"sales",required:false,modules:["pipelines"]},
    recent_activity:{name:"Activité récente",category:"activity",required:false,modules:[]},
    active_modules:{name:"Outils de l’entreprise",category:"modules",required:false,modules:[]},
    business_recommendations:{name:"Pour avancer",category:"recommendations",required:false,modules:[]},
    workspace_readiness:{name:"Préparation de votre espace",category:"setup",required:false,modules:[]}
  };
  const layouts={
    artisan:["attention_center","primary_metrics","today_schedule","commercial_overview","recent_activity","active_modules","business_recommendations","workspace_readiness"],
    telecom:["attention_center","today_schedule","primary_metrics","commercial_overview","recent_activity","active_modules","business_recommendations","workspace_readiness"],
    real_estate:["attention_center","primary_metrics","today_schedule","commercial_overview","recent_activity","business_recommendations","active_modules","workspace_readiness"],
    services:["attention_center","primary_metrics","today_schedule","commercial_overview","recent_activity","business_recommendations","active_modules","workspace_readiness"],
    generic:["attention_center","today_schedule","primary_metrics","recent_activity","active_modules","business_recommendations","workspace_readiness"]
  };
  const routeByModule={pipelines:"crm",booking:"calendar",quotes:"quotes",forms:"forms",website:"website","ai-assistant":"ai-center",reviews:"reviews",analytics:"analytics"};
  function defaultLayout(packId="generic"){return [...(layouts[packId]||layouts.generic)];}
  function visibleWidgets(packId,modules=[],preferences={}){const enabled=new Set(modules.filter(m=>typeof m==="string"?true:m.status==="enabled").map(m=>typeof m==="string"?m:m.module_id));const base=defaultLayout(packId);const requested=Array.isArray(preferences.widget_order)?preferences.widget_order:base;const ordered=[...new Set([...requested,...base])].filter(id=>registry[id]);const hidden=new Set(preferences.hidden_widgets||[]);return ordered.filter(id=>registry[id].required||!hidden.has(id)).filter(id=>registry[id].modules.every(module=>enabled.has(module))||["today_schedule","commercial_overview"].includes(id));}
  function readiness({onboarding={},profile={},modules=[],metrics={}}={}){const enabled=modules.some(m=>(m.status||m)==="enabled");const checks=[
    ["onboarding","Onboarding terminé",onboarding.status==="completed"],
    ["company","Nom de l’entreprise",Boolean(profile.company_name)],
    ["trade","Métier choisi",Boolean(profile.trade_id||profile.custom_trade)],
    ["email","Email professionnel",Boolean(profile.email)],
    ["phone","Téléphone professionnel",Boolean(profile.phone)],
    ["logo","Logo ajouté",Boolean(profile.logo_url)],
    ["goal","Objectif principal",Boolean(metrics.primaryGoal)],
    ["module","Premier outil activé",enabled],
    ["first_contact","Premier contact ajouté",Number(metrics.totalProspects)>0]
  ];return {completed:checks.filter(c=>c[2]).length,total:checks.length,checks:checks.map(([id,label,complete])=>({id,label,complete})),next:checks.find(c=>!c[2])?.[1]||null};}
  function recommendations({profile={},modules=[],metrics={},goals=[]}={}){const enabled=new Set(modules.filter(m=>m.status==="enabled").map(m=>m.module_id));const items=[];const add=(id,priority,title,reason,benefit,view)=>items.push({id,priority,title,reason,benefit,view,status:"active"});
    if(!profile.phone)add("add_phone",3,"Ajoutez votre téléphone","Vos coordonnées ne sont pas complètes.","Vos clients sauront comment vous joindre.","settings");
    if(!profile.logo_url)add("add_logo",1,"Ajoutez votre logo","Votre identité visuelle est encore incomplète.","Votre espace et vos futurs supports seront reconnaissables.","settings");
    if(!enabled.has("forms"))add("enable_forms",2,"Préparez le formulaire de contact","Aucun formulaire actif n’est disponible.","Vous pourrez recevoir vos premières demandes.","forms");
    if(Number(metrics.totalProspects)===0)add("first_prospect",2,"Ajoutez votre premier contact","Votre suivi commercial est prêt mais encore vide.","Vous commencerez à centraliser vos échanges.","crm");
    if(goals.includes("more_appointments")&&!enabled.has("booking"))add("enable_booking",2,"Activez la prise de rendez-vous","Cet outil correspond à votre objectif principal.","Vos clients pourront réserver plus simplement.","calendar");
    return items.sort((a,b)=>b.priority-a.priority).slice(0,3);
  }
  function quickActions({packId="generic",modules=[],profile={},role="member"}={}){const enabled=new Set(modules.filter(m=>m.status==="enabled").map(m=>m.module_id));const actions=[];if(enabled.has("pipelines"))actions.push({id:"add_prospect",label:packId==="telecom"?"Ajouter une demande":"Ajouter un prospect",view:"crm"});if(enabled.has("booking"))actions.push({id:"plan",label:packId==="real_estate"?"Planifier une visite":"Planifier un rendez-vous",view:"calendar"});if(enabled.has("quotes"))actions.push({id:"quote",label:"Créer un devis",view:"quotes"});if(!profile.company_name&&role!=="member")actions.unshift({id:"profile",label:"Compléter le profil",view:"settings"});return actions.slice(0,3);}
  function periodBounds(days=30,timezone="UTC",now=new Date()){const safe=[7,30,90].includes(Number(days))?Number(days):30;const end=now.toISOString();const start=new Date(now.getTime()-safe*86400000).toISOString();return {days:safe,start,end,timezone};}
  function applyPreference(order,id,direction){const next=[...order];const i=next.indexOf(id);const j=direction==="up"?i-1:i+1;if(i<0||j<0||j>=next.length)return next;[next[i],next[j]]=[next[j],next[i]];return next;}
  return {registry,layouts,routeByModule,defaultLayout,visibleWidgets,readiness,recommendations,quickActions,periodBounds,applyPreference};
});
