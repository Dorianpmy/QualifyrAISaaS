const test=require("node:test"),assert=require("node:assert/strict"),handler=require("../api/content");
function response(){return{statusCode:0,headers:{},setHeader(k,v){this.headers[k]=v},end(value){this.body=value}}}
test("content API rejects unauthenticated reads",async()=>{const res=response();await handler({method:"GET",headers:{},url:"/api/content"},res);assert.equal(res.statusCode,401);assert.match(JSON.parse(res.body).error,/Connectez-vous/)});
test("content API ignores a forged workspace id before authentication",async()=>{const res=response();await handler({method:"POST",headers:{"content-type":"application/json"},url:"/api/content",body:{workspaceId:"ws_other",action:"ideas"}},res);assert.equal(res.statusCode,401)});

