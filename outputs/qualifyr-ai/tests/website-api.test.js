const test=require("node:test"),assert=require("node:assert/strict"),handler=require("../api/website");
function response(){return{headers:{},setHeader(k,v){this.headers[k]=v},end(v){this.body=v}}}
test("refuse le Website Builder sans session",async()=>{const req={method:"GET",headers:{},url:"/api/website",[Symbol.asyncIterator]:async function*(){}},res=response();await handler(req,res);assert.equal(res.statusCode,401);assert.match(res.body,/Connectez-vous/);});
test("ignore tout workspaceId envoyé par le navigateur",async()=>{const req={method:"POST",headers:{},url:"/api/website",[Symbol.asyncIterator]:async function*(){yield Buffer.from(JSON.stringify({action:"generate",workspaceId:"ws_victime"}))}},res=response();await handler(req,res);assert.equal(res.statusCode,401);});
