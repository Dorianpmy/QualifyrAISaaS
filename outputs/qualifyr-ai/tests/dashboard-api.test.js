const test=require("node:test");const assert=require("node:assert/strict");const handler=require("../api/dashboard");
function response(){return{statusCode:0,headers:{},setHeader(k,v){this.headers[k]=v},end(value){this.body=JSON.parse(value)}};}
test("refuse le dashboard sans authentification",async()=>{const res=response();await handler({method:"GET",headers:{}},res);assert.equal(res.statusCode,401);assert.match(res.body.error,/Connectez-vous/);});
test("n'accepte jamais un workspaceId client sans session",async()=>{const res=response();await handler({method:"POST",headers:{},[Symbol.asyncIterator]:async function*(){yield Buffer.from(JSON.stringify({workspaceId:"ws_other",action:"save_preferences"}))}},res);assert.equal(res.statusCode,401);});
