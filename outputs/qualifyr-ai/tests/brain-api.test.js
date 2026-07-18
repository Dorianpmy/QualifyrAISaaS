const test=require("node:test");const assert=require("node:assert/strict");const handler=require("../api/brain");
function response(){return{headers:{},setHeader(k,v){this.headers[k]=v},end(body){this.body=body}}}
test("l’API Brain refuse une requête sans session",async()=>{const res=response();await handler({method:"GET",url:"/api/brain",headers:{}},res);assert.equal(res.statusCode,401);assert.match(JSON.parse(res.body).error,/Connectez/)});
test("un workspace client ne contourne pas l’authentification",async()=>{const res=response();await handler({method:"POST",url:"/api/brain",headers:{},[Symbol.asyncIterator]:async function*(){yield Buffer.from(JSON.stringify({action:"ask",workspaceId:"ws_other",message:"bonjour"}))}},res);assert.equal(res.statusCode,401)});
