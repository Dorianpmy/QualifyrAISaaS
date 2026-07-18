const {json,readBody}=require("./_lib");
const service=require("./_autopilot-service");
const engine=require("../autopilot-engine");
const supabaseUrl=()=>String(process.env.SUPABASE_URL||"").replace(/\/$/,"");
const serviceKey=()=>process.env.SUPABASE_SECRET_KEY||process.env.SUPABASE_SERVICE_ROLE_KEY||"";
async function authenticatedUser(req){const authorization=String(req.headers.authorization||"");if(!authorization.startsWith("Bearer ")||!supabaseUrl()||!serviceKey())throw new Error("Connectez-vous pour continuer.");const response=await fetch(`${supabaseUrl()}/auth/v1/user`,{headers:{apikey:serviceKey(),Authorization:authorization}});const user=await response.json().catch(()=>({}));if(!response.ok||!user.id)throw new Error("Votre session a expiré. Reconnectez-vous.");return user;}
module.exports=async function handler(req,res){try{const user=await authenticatedUser(req);
 if(req.method==="GET"){const ctx=await service.assertMember(user),health=await service.healthForUser(user);return json(res,200,{ok:true,workspaceId:ctx.workspaceId,health,packs:Object.values(engine.manifests).map(({id,name,version,readiness,category})=>({id,name,version,readiness,category})),limitations:{durableWorker:false,externalAutomations:false,autoReply:false,contentPublishing:false}});}
 if(req.method!=="POST")return json(res,405,{ok:false,error:"Méthode non autorisée."});const body=await readBody(req);
 if(body.action==="provision"||body.action==="retry"||body.action==="fix") {const result=await service.provisionForUser(user,body.answers);return json(res,result.status,result.payload);}
 if(body.action==="health")return json(res,200,{ok:true,health:await service.healthForUser(user)});
 if(body.action==="system_test")return json(res,200,await service.systemTestForUser(user));
 if(body.action==="diagnostic")return json(res,200,{ok:true,diagnostic:await service.diagnosticForUser(user)});
 if(body.action==="preview"){const ctx=await service.loadForUser(user),plan=engine.buildPlan({workspaceId:ctx.workspaceId,userId:user.id,answers:{...ctx.answers,...(body.answers||{})}});return json(res,200,{ok:true,plan});}
 return json(res,400,{ok:false,error:"Action inconnue."});
 }catch(error){return json(res,/session|Connectez|accessible/i.test(error.message)?401:500,{ok:false,error:/Supabase/i.test(error.message)?"La configuration serveur doit être mise à jour avant de continuer.":error.message});}}
