const {supabaseSelect,supabaseUpsert}=require("./_lib");
const brain=require("../brain-engine");
const clean=brain.clean;
const RESOURCE_FIELDS={contactId:["crm_contacts","contact_id"],organizationId:["crm_organizations","organization_id"],opportunityId:["crm_opportunities","opportunity_id"],pipelineId:["crm_pipelines","pipeline_id"],stageId:["crm_pipeline_stages","stage_id"],taskId:["crm_tasks","task_id"],ownerId:["workspace_members","owner_user_id"],userId:["workspace_members","user_id"],formId:["forms","form_id"],conversationId:["conversations","conversation_id"],documentId:["crm_documents","document_id"],tagId:["crm_tags","tag_id"]};
function resourceDenied(){return Object.assign(new Error("RESOURCE_NOT_FOUND"),{status:404,publicMessage:"Ressource introuvable."});}
async function requireWorkspaceResource(ctx,table,idValue){
  const value=clean(idValue);
  if(!value)return null;
  const idColumn=table==="workspace_members"?"user_id":"id";
  const row=(await supabaseSelect(table,`workspace_id=eq.${encodeURIComponent(ctx.wid)}&${idColumn}=eq.${encodeURIComponent(value)}&select=${idColumn},workspace_id&limit=1`)).data?.[0];
  if(!row)throw resourceDenied();
  return row;
}
async function validateResourceReferences(ctx,body,fields=Object.keys(RESOURCE_FIELDS)){
  const verified={};
  for(const field of fields){
    const mapping=RESOURCE_FIELDS[field];
    if(!mapping||body[field]==null||body[field]==="")continue;
    await requireWorkspaceResource(ctx,mapping[0],body[field]);
    verified[mapping[1]]=clean(body[field]);
  }
  if(verified.stage_id&&verified.pipeline_id){
    const stage=(await supabaseSelect("crm_pipeline_stages",`workspace_id=eq.${encodeURIComponent(ctx.wid)}&id=eq.${encodeURIComponent(verified.stage_id)}&pipeline_id=eq.${encodeURIComponent(verified.pipeline_id)}&select=id&limit=1`)).data?.[0];
    if(!stage)throw resourceDenied();
  }
  return verified;
}
async function createTask(ctx,body,{idempotencyKey}={}){
  if(!clean(body.title))return{status:400,payload:{ok:false,error:"Le titre de la tâche est requis."}};
  const refs=await validateResourceReferences(ctx,body,["contactId","organizationId","opportunityId","ownerId"]);
  const now=new Date().toISOString(),taskId=idempotencyKey?brain.stableId("task",`${ctx.wid}:${idempotencyKey}`):`task_${require("crypto").randomUUID()}`;
  const row={id:taskId,workspace_id:ctx.wid,title:clean(body.title,200),description:clean(body.description,1000),task_type:clean(body.type||"follow_up",60),priority:["low","normal","high","urgent"].includes(body.priority)?body.priority:"normal",status:"todo",due_at:body.dueAt||null,contact_id:refs.contact_id||null,organization_id:refs.organization_id||null,opportunity_id:refs.opportunity_id||null,owner_user_id:refs.owner_user_id||ctx.user.id,created_by:ctx.user.id,created_at:now,updated_at:now};
  await supabaseUpsert("crm_tasks",row);
  const source=idempotencyKey?"qualifyr_brain":"crm",activityId=brain.stableId("act",`${taskId}:created`),metadata={source,idempotency_key:idempotencyKey||null};
  await Promise.all([supabaseUpsert("crm_activities",{id:activityId,workspace_id:ctx.wid,actor_user_id:ctx.user.id,event_type:"crm.task.created",resource_type:"task",resource_id:taskId,summary:source==="qualifyr_brain"?"Tâche créée par Qualifyr Brain":"Tâche créée",metadata,created_at:now}),supabaseUpsert("workspace_activities",{id:activityId,workspace_id:ctx.wid,actor_user_id:ctx.user.id,event_type:"crm.task.created",resource_type:"task",resource_id:taskId,metadata,created_at:now}),supabaseUpsert("crm_outbox_events",{id:brain.stableId("evt",`${taskId}:created`),workspace_id:ctx.wid,event_type:"crm.task.created",resource_type:"task",resource_id:taskId,actor_user_id:ctx.user.id,metadata,idempotency_key:idempotencyKey||`crm.task.created:${taskId}`,status:"pending",created_at:now})]);
  return{status:201,payload:{ok:true,task:row}};
}
module.exports={createTask,requireWorkspaceResource,validateResourceReferences};
