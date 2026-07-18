const { json, readBody } = require("./_lib");
const base = () => String(process.env.SUPABASE_URL || "").replace(/\/$/, "");
const key = () => process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || "";
async function call(path, options={}) {
  if(!base()||!key()) throw new Error("Authentification indisponible.");
  const response=await fetch(`${base()}${path}`,{...options,headers:{apikey:key(),"Content-Type":"application/json",...(options.headers||{})}});
  const payload=await response.json().catch(()=>({}));
  if(!response.ok) throw new Error(payload.msg||payload.error_description||payload.message||"Connexion refusée.");
  return payload;
}
module.exports=async function handler(req,res){
  if(req.method!=="POST") return json(res,405,{ok:false});
  try{
    const body=await readBody(req); const action=String(body.action||""); const email=String(body.email||"").trim().toLowerCase(); const password=String(body.password||"");
    if(!/^\S+@\S+\.\S+$/.test(email)||password.length<8) return json(res,400,{ok:false,error:"Email valide et mot de passe de 8 caractères minimum requis."});
    if(action==="signup"){
      await call("/auth/v1/admin/users",{method:"POST",headers:{Authorization:`Bearer ${key()}`},body:JSON.stringify({email,password,email_confirm:true,user_metadata:{name:String(body.name||"").slice(0,100)}})}).catch(async(error)=>{if(!/already|registered|exists/i.test(error.message)) throw error;});
    }
    if(!["signup","login"].includes(action)) return json(res,400,{ok:false,error:"Action inconnue."});
    const session=await call("/auth/v1/token?grant_type=password",{method:"POST",body:JSON.stringify({email,password})});
    return json(res,200,{ok:true,accessToken:session.access_token,refreshToken:session.refresh_token,expiresIn:session.expires_in,user:{id:session.user?.id,email:session.user?.email}});
  }catch(error){return json(res,401,{ok:false,error:error.message});}
};
