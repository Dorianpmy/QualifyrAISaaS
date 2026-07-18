const crypto=require("crypto");
const {json,readBody,supabaseSelect,supabaseUpsert}=require("./_lib");
const engine=require("../onboarding-engine");
const supabaseUrl=()=>String(process.env.SUPABASE_URL||"").replace(/\/$/,"");
const serviceKey=()=>process.env.SUPABASE_SECRET_KEY||process.env.SUPABASE_SERVICE_ROLE_KEY||"";
async function authenticatedUser(req){
  const authorization=String(req.headers.authorization||"");
  if(!authorization.startsWith("Bearer ")||!supabaseUrl()||!serviceKey()) throw new Error("Connectez-vous pour continuer.");
  const response=await fetch(`${supabaseUrl()}/auth/v1/user`,{headers:{apikey:serviceKey(),Authorization:authorization}});
  const user=await response.json().catch(()=>({}));
  if(!response.ok||!user.id) throw new Error("Votre session a expiré. Reconnectez-vous.");
  return user;
}
const workspaceId=(userId)=>`ws_${crypto.createHash("sha256").update(userId).digest("hex").slice(0,24)}`;
async function load(user){
  const wid=workspaceId(user.id);
  const [progress,profile,modules,config,operations]=await Promise.all([
    supabaseSelect("onboarding_progress",`user_id=eq.${user.id}&select=*&limit=1`),
    supabaseSelect("business_profiles",`workspace_id=eq.${wid}&select=*&limit=1`),
    supabaseSelect("workspace_modules",`workspace_id=eq.${wid}&select=*&order=module_id.asc`),
    supabaseSelect("workspace_initial_configs",`workspace_id=eq.${wid}&select=*&limit=1`),
    supabaseSelect("provisioning_operations",`workspace_id=eq.${wid}&select=*&order=position.asc`)
  ]);
  return {workspaceId:wid,progress:progress.data?.[0]||null,profile:profile.data?.[0]||null,modules:modules.data||[],config:config.data?.[0]||null,operations:operations.data||[]};
}
async function saveStep(user,body){
  const wid=workspaceId(user.id); const step=Math.min(7,Math.max(1,Number(body.step||1))); const data=body.data&&typeof body.data==="object"?body.data:{};
  const current=await load(user); const answers={...(current.progress?.answers||{}),...data};
  const errors=engine.validateStep(step,answers); if(Object.keys(errors).length) return {status:400,payload:{ok:false,error:"Vérifiez les informations indiquées.",fields:errors}};
  const now=new Date().toISOString();
  await supabaseUpsert("workspaces",{id:wid,owner_user_id:user.id,name:String(answers.companyName||current.profile?.company_name||"Mon entreprise").slice(0,140),status:"onboarding",created_at:current.progress?.started_at||now,updated_at:now});
  await supabaseUpsert("workspace_members",{id:`${wid}:${user.id}`,workspace_id:wid,user_id:user.id,role:"owner",created_at:now,updated_at:now});
  await supabaseUpsert("onboarding_progress",{id:`onboarding:${user.id}`,user_id:user.id,workspace_id:wid,status:"in_progress",current_step:Math.min(8,step+1),answers,started_at:current.progress?.started_at||now,updated_at:now,completed_at:null,last_error:null});
  return {status:200,payload:{ok:true,currentStep:Math.min(8,step+1),savedAt:now}};
}
async function provision(user){
  const current=await load(user); const wid=current.workspaceId; const answers=current.progress?.answers||{};
  if(!answers.companyName||!answers.tradeId) return {status:400,payload:{ok:false,error:"Terminez d’abord les étapes de configuration."}};
  const recommendation=engine.recommend({tradeId:answers.tradeId,size:answers.size,goals:answers.goals,website:answers.website});
  const tasks=[
    ["workspace",async()=>supabaseUpsert("workspaces",{id:wid,owner_user_id:user.id,name:String(answers.companyName).slice(0,140),status:"active",updated_at:new Date().toISOString()})],
    ["profile",async()=>supabaseUpsert("business_profiles",{id:`profile:${wid}`,workspace_id:wid,company_name:String(answers.companyName).slice(0,140),manager_name:String(answers.managerName||"").slice(0,140),description:String(answers.description||"").slice(0,500),company_size:answers.size||"independent",trade_id:answers.tradeId,custom_trade:String(answers.customTrade||"").slice(0,140),country_code:answers.countryCode||"FR",city:String(answers.city||"").slice(0,120),postal_code:String(answers.postalCode||"").slice(0,30),service_area:String(answers.serviceArea||"").slice(0,240),phone:String(answers.phone||"").slice(0,40),email:String(answers.email||user.email||"").slice(0,200),website:String(answers.website||"").slice(0,300),locale:answers.locale||"fr-FR",currency:answers.currency||"EUR",timezone:answers.timezone||"Europe/Paris",primary_color:answers.primaryColor||"#126044",secondary_color:answers.secondaryColor||"#EAF7EF",tagline:String(answers.tagline||"").slice(0,180),communication_tone:answers.tone||"accessible",updated_at:new Date().toISOString()})],
    ["pack",async()=>supabaseUpsert("workspace_packs",{id:`${wid}:${recommendation.pack.id}`,workspace_id:wid,pack_id:recommendation.pack.id,pack_version:1,status:"active",installed_at:new Date().toISOString(),updated_at:new Date().toISOString()})],
    ["crm",async()=>supabaseUpsert("workspace_initial_configs",{id:`config:${wid}`,workspace_id:wid,pack_id:recommendation.pack.id,crm_pipeline:recommendation.pack.pipeline,crm_fields:recommendation.pack.fields,forms:recommendation.pack.forms,dashboard_cards:recommendation.pack.dashboard,automations:recommendation.pack.automations,templates:recommendation.pack.templates,next_actions:recommendation.nextActions,updated_at:new Date().toISOString()})],
    ["modules",async()=>Promise.all([...new Set([...recommendation.enabledModules,...recommendation.recommendedModules])].map(moduleId=>supabaseUpsert("workspace_modules",{id:`${wid}:${moduleId}`,workspace_id:wid,module_id:moduleId,status:recommendation.enabledModules.includes(moduleId)?"enabled":"recommended",source:"onboarding",updated_at:new Date().toISOString()})))],
    ["goals",async()=>Promise.all((answers.goals||[]).map((goalId,index)=>supabaseUpsert("workspace_goals",{id:`${wid}:${goalId}`,workspace_id:wid,goal_id:goalId,priority:goalId===answers.primaryGoal?0:index+1,is_primary:goalId===answers.primaryGoal,created_at:new Date().toISOString()})))],
    ["finalize",async()=>supabaseUpsert("onboarding_progress",{id:`onboarding:${user.id}`,user_id:user.id,workspace_id:wid,status:"completed",current_step:9,answers,started_at:current.progress?.started_at||new Date().toISOString(),updated_at:new Date().toISOString(),completed_at:new Date().toISOString(),last_error:null})]
  ];
  await supabaseUpsert("onboarding_progress",{id:`onboarding:${user.id}`,user_id:user.id,workspace_id:wid,status:"provisioning",current_step:8,answers,started_at:current.progress?.started_at||new Date().toISOString(),updated_at:new Date().toISOString(),completed_at:null,last_error:null});
  const operations=[];
  for(let index=0;index<tasks.length;index++){
    const [key,run]=tasks[index]; const id=`${wid}:${key}`;
    const existing=(await supabaseSelect("provisioning_operations",`id=eq.${encodeURIComponent(id)}&select=*&limit=1`)).data?.[0];
    if(existing?.status==="completed"){operations.push(existing);continue;}
    await supabaseUpsert("provisioning_operations",{id,workspace_id:wid,operation_key:key,position:index+1,status:"running",attempts:Number(existing?.attempts||0)+1,updated_at:new Date().toISOString()});
    try{await run();const row={id,workspace_id:wid,operation_key:key,position:index+1,status:"completed",attempts:Number(existing?.attempts||0)+1,last_error:null,completed_at:new Date().toISOString(),updated_at:new Date().toISOString()};await supabaseUpsert("provisioning_operations",row);operations.push(row);}
    catch(error){await supabaseUpsert("provisioning_operations",{id,workspace_id:wid,operation_key:key,position:index+1,status:"failed",attempts:Number(existing?.attempts||0)+1,last_error:String(error.message).slice(0,500),updated_at:new Date().toISOString()});await supabaseUpsert("onboarding_progress",{id:`onboarding:${user.id}`,user_id:user.id,workspace_id:wid,status:"failed",current_step:8,answers,started_at:current.progress?.started_at||new Date().toISOString(),updated_at:new Date().toISOString(),last_error:"Une étape n’a pas pu être terminée."});return {status:500,payload:{ok:false,error:"Une étape n’a pas pu être terminée. Vous pouvez réessayer sans perdre votre progression.",operations}};}
  }
  return {status:200,payload:{ok:true,recommendation:{pack:recommendation.pack,enabledModules:recommendation.enabledModules,recommendedModules:recommendation.recommendedModules,nextActions:recommendation.nextActions},operations}};
}
module.exports=async function handler(req,res){
  try{const user=await authenticatedUser(req);if(req.method==="GET") return json(res,200,{ok:true,...await load(user),catalog:{trades:engine.tradeCategories,goals:engine.goals}});if(req.method!=="POST") return json(res,405,{ok:false});const body=await readBody(req);if(body.action==="save_step"){const result=await saveStep(user,body);return json(res,result.status,result.payload);}if(body.action==="provision"||body.action==="retry"){const result=await provision(user);return json(res,result.status,result.payload);}return json(res,400,{ok:false,error:"Action inconnue."});}catch(error){return json(res,/session|Connectez/i.test(error.message)?401:500,{ok:false,error:error.message});}
};
