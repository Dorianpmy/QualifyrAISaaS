const test=require("node:test");const assert=require("node:assert/strict");const handler=require("../api/crm");
function res(){return{statusCode:0,headers:{},setHeader(k,v){this.headers[k]=v},end(v){this.raw=v;try{this.body=JSON.parse(v)}catch{}}};}
test("refuse la lecture CRM sans session",async()=>{const r=res();await handler({method:"GET",url:"/api/crm",headers:{}},r);assert.equal(r.statusCode,401);});
test("ignore un workspaceId client sans authentification",async()=>{const r=res();await handler({method:"POST",url:"/api/crm",headers:{},[Symbol.asyncIterator]:async function*(){yield Buffer.from('{"workspaceId":"ws_other","action":"create_contact"}')}},r);assert.equal(r.statusCode,401);});
