const handlers={
 "admin-login":require("../server/api/admin-login"),auth:require("../server/api/auth"),checkout:require("../server/api/checkout"),
 connections:require("../server/api/connections"),"copilot-run":require("../server/api/copilot-run"),copilots:require("../server/api/copilots"),
 crm:require("../server/api/crm"),dashboard:require("../server/api/dashboard"),leads:require("../server/api/leads"),oauth:require("../server/api/oauth"),
 onboarding:require("../server/api/onboarding"),quotes:require("../server/api/quotes"),
 website:require("../server/api/website"),"site-public":require("../server/api/site-public"),
 "webhooks/payment":require("../server/api/webhooks/payment"),"webhooks/whatsapp":require("../server/api/webhooks/whatsapp")
};
module.exports=async function route(req,res){
 const pathname=new URL(req.url,"http://localhost").pathname.replace(/^\/api\//,"").replace(/\/$/,"");
 const handler=handlers[pathname];
 if(!handler){res.statusCode=404;res.setHeader("Content-Type","application/json");return res.end(JSON.stringify({ok:false,error:"Route API introuvable."}));}
 return handler(req,res);
};
