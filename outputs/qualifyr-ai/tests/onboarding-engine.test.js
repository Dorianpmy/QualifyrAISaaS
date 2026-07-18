const assert=require("node:assert/strict");
const engine=require("../onboarding-engine");
function test(name,fn){try{fn();console.log(`✓ ${name}`);}catch(error){console.error(`✗ ${name}`);throw error;}}
test("associe un plombier au pack Artisan",()=>assert.equal(engine.packForTrade("plumber").id,"artisan"));
test("associe la fibre au pack Télécom",()=>assert.equal(engine.packForTrade("fiber_optic_company").id,"telecom"));
test("associe une agence immobilière au pack Immobilier",()=>assert.equal(engine.packForTrade("real_estate_agency").id,"real_estate"));
test("utilise le pack générique pour une autre activité",()=>assert.equal(engine.packForTrade("other").id,"generic"));
test("les objectifs influencent les modules",()=>{const r=engine.recommend({tradeId:"consultant",goals:["seo","automate"],website:""});assert(r.recommendedModules.includes("seo"));assert(r.recommendedModules.includes("ai-assistant"));assert(r.enabledModules.includes("website"));});
test("une entreprise fibre avec équipe recommande fichiers et planning",()=>{const r=engine.recommend({tradeId:"fiber_optic_company",size:"6_20",goals:[]});assert(r.recommendedModules.includes("files"));assert(r.recommendedModules.includes("booking"));});
test("valide les champs indispensables",()=>{assert(engine.validateStep(2,{}).companyName);assert(engine.validateStep(3,{tradeId:"other"}).customTrade);assert(engine.validateStep(4,{goals:[]}).goals);assert(engine.validateStep(5,{email:"incorrect"}).email);});
test("reprend la dernière étape incomplète",()=>{assert.equal(engine.resumeStep({status:"in_progress",currentStep:5}),5);assert.equal(engine.resumeStep({status:"completed",currentStep:5}),9);});
test("le moteur est déterministe et idempotent",()=>{const input={tradeId:"plumber",size:"2_5",goals:["quotes","booking"]};assert.deepEqual(engine.recommend(input),engine.recommend(input));});
console.log("9 tests réussis.");
