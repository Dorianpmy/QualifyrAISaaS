const crypto = require("crypto");
const { supabaseSelect } = require("./_lib");

const base = () => String(process.env.SUPABASE_URL || "").replace(/\/$/, "");
const key = () => process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const ownerWorkspaceId = (userId) => `ws_${crypto.createHash("sha256").update(userId).digest("hex").slice(0, 24)}`;

async function requireWorkspace(req) {
  const authorization = String(req.headers?.authorization || "");
  if (!authorization.startsWith("Bearer ") || !base() || !key()) throw Object.assign(new Error("AUTH_REQUIRED"), { status: 401, publicMessage: "Connectez-vous pour continuer." });
  const response = await fetch(`${base()}/auth/v1/user`, { headers: { apikey: key(), Authorization: authorization } });
  const user = await response.json().catch(() => ({}));
  if (!response.ok || !user.id) throw Object.assign(new Error("AUTH_EXPIRED"), { status: 401, publicMessage: "Votre session a expiré." });
  const requestedWorkspace = String(req.headers?.["x-workspace-id"] || "").trim();
  const membershipQuery = requestedWorkspace
    ? `workspace_id=eq.${encodeURIComponent(requestedWorkspace)}&user_id=eq.${encodeURIComponent(user.id)}&select=workspace_id,role,status,invitation_status&limit=1`
    : `user_id=eq.${encodeURIComponent(user.id)}&select=workspace_id,role,status,invitation_status&order=updated_at.desc&limit=20`;
  const memberships = (await supabaseSelect("workspace_members", membershipQuery)).data || [];
  const member = memberships.find((candidate) => {
    const status = candidate.status || "active";
    const invitation = candidate.invitation_status || "accepted";
    return status === "active" && invitation === "accepted";
  });
  if (!member) throw Object.assign(new Error("WORKSPACE_DENIED"), { status: 403, publicMessage: "Cet espace ne vous est pas accessible." });
  const workspaceId = member.workspace_id || requestedWorkspace || ownerWorkspaceId(user.id);
  return { user, workspaceId, member };
}

module.exports = { ownerWorkspaceId, requireWorkspace };
