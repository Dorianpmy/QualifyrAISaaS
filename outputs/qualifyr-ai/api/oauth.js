const crypto = require("crypto");
const { appUrl, badRequest, json, supabaseSelect, supabaseUpsert } = require("./_lib");
const { requireWorkspace } = require("./_auth");

const PROVIDERS = {
  google: {
    authorize: "https://accounts.google.com/o/oauth2/v2/auth",
    token: "https://oauth2.googleapis.com/token",
    clientId: "GOOGLE_CLIENT_ID",
    clientSecret: "GOOGLE_CLIENT_SECRET",
    scopes: "openid email profile https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/gmail.modify https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/business.manage",
    extra: { access_type: "offline", prompt: "consent" }
  },
  microsoft: {
    authorize: "https://login.microsoftonline.com/common/oauth2/v2.0/authorize",
    token: "https://login.microsoftonline.com/common/oauth2/v2.0/token",
    clientId: "MICROSOFT_CLIENT_ID",
    clientSecret: "MICROSOFT_CLIENT_SECRET",
    scopes: "openid email profile offline_access Calendars.ReadWrite Mail.ReadWrite"
  },
  meta: {
    authorize: "https://www.facebook.com/v21.0/dialog/oauth",
    token: "https://graph.facebook.com/v21.0/oauth/access_token",
    clientId: "META_APP_ID",
    clientSecret: "META_APP_SECRET",
    scopes: "business_management whatsapp_business_management whatsapp_business_messaging pages_manage_posts instagram_basic instagram_content_publish"
  },
  mollie: {
    authorize: "https://www.mollie.com/oauth2/authorize",
    token: "https://api.mollie.com/oauth2/tokens",
    clientId: "MOLLIE_CLIENT_ID",
    clientSecret: "MOLLIE_CLIENT_SECRET",
    scopes: "organizations.read payments.read payments.write profiles.read"
  }
};

const cleanEmail = (value) => {
  const email = String(value || "").trim().toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : "";
};
const base64url = (value) => Buffer.from(value).toString("base64url");
const stateSecret = () => process.env.OAUTH_STATE_SECRET || process.env.SUPABASE_SECRET_KEY || "";
const signState = (payload) => {
  const encoded = base64url(JSON.stringify(payload));
  const signature = crypto.createHmac("sha256", stateSecret()).update(encoded).digest("base64url");
  return `${encoded}.${signature}`;
};
const verifyState = (value) => {
  const [encoded, signature] = String(value || "").split(".");
  if (!encoded || !signature || !stateSecret()) throw new Error("Etat OAuth invalide.");
  const expected = crypto.createHmac("sha256", stateSecret()).update(encoded).digest("base64url");
  if (signature.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) throw new Error("Etat OAuth invalide.");
  const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8"));
  if (!payload.exp || payload.exp < Date.now()) throw new Error("La demande de connexion a expire.");
  return payload;
};
const encryptionKey = () => crypto.createHash("sha256").update(process.env.CONNECTION_ENCRYPTION_KEY || stateSecret()).digest();
const encrypt = (value) => {
  if (!value) return null;
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", encryptionKey(), iv);
  const encrypted = Buffer.concat([cipher.update(String(value), "utf8"), cipher.final()]);
  return `${iv.toString("base64url")}.${cipher.getAuthTag().toString("base64url")}.${encrypted.toString("base64url")}`;
};

function providerReady(provider) {
  const config = PROVIDERS[provider];
  return Boolean(config && process.env[config.clientId] && process.env[config.clientSecret] && stateSecret());
}

module.exports = async function handler(req, res) {
  try {
    const url = new URL(req.url, appUrl(req));
    const action = url.searchParams.get("action") || "status";
    const provider = url.searchParams.get("provider") || "";

    if (action === "status") {
      return json(res, 200, {
        ok: true,
        providers: Object.fromEntries(Object.keys(PROVIDERS).map((key) => [key, { ready: providerReady(key) }]))
      });
    }
    if (!PROVIDERS[provider]) return badRequest(res, "Fournisseur inconnu.");

    if (action === "start") {
      const context = await requireWorkspace(req);
      const email = cleanEmail(context.user.email);
      if (!email) return badRequest(res, "Connectez-vous d'abord a votre compte Qualifyr.");
      if (!providerReady(provider)) {
        return json(res, 503, { ok: false, code: "provider_not_configured", error: `La connexion ${provider} attend les identifiants administrateur Qualifyr.` });
      }
      const callback = `${appUrl(req)}/api/oauth?action=callback&provider=${encodeURIComponent(provider)}`;
      const config = PROVIDERS[provider];
      const returnTo = String(url.searchParams.get("returnTo") || "/#copilot-setup");
      const safeReturnTo = /^\/[A-Za-z0-9/_#?&=.-]*$/.test(returnTo) ? returnTo : "/#copilot-setup";
      const state = signState({ workspaceId: context.workspaceId, userId: context.user.id, provider, returnTo: safeReturnTo, nonce: crypto.randomUUID(), exp: Date.now() + 10 * 60 * 1000 });
      const params = new URLSearchParams({
        client_id: process.env[config.clientId], redirect_uri: callback, response_type: "code", scope: config.scopes, state, ...(config.extra || {})
      });
      return json(res, 200, { ok: true, authorizeUrl: `${config.authorize}?${params}` });
    }

    if (action === "callback") {
      const state = verifyState(url.searchParams.get("state"));
      if (state.provider !== provider) throw new Error("Fournisseur OAuth incoherent.");
      const membership = (await supabaseSelect("workspace_members", `workspace_id=eq.${encodeURIComponent(state.workspaceId)}&user_id=eq.${encodeURIComponent(state.userId)}&status=eq.active&invitation_status=eq.accepted&select=role&limit=1`)).data?.[0];
      if (!membership) throw Object.assign(new Error("WORKSPACE_DENIED"), { status: 403, publicMessage: "Cet espace ne vous est plus accessible." });
      const code = url.searchParams.get("code");
      if (!code) throw new Error(url.searchParams.get("error_description") || "Autorisation refusee.");
      const config = PROVIDERS[provider];
      const callback = `${appUrl(req)}/api/oauth?action=callback&provider=${encodeURIComponent(provider)}`;
      const tokenResponse = await fetch(config.token, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json" },
        body: new URLSearchParams({ grant_type: "authorization_code", code, redirect_uri: callback, client_id: process.env[config.clientId], client_secret: process.env[config.clientSecret] })
      });
      const tokens = await tokenResponse.json().catch(() => ({}));
      if (!tokenResponse.ok) throw new Error("OAUTH_TOKEN_EXCHANGE_FAILED");
      const now = new Date().toISOString();
      const id = `${state.workspaceId}:${provider}`;
      const current = await supabaseSelect("connections", `workspace_id=eq.${encodeURIComponent(state.workspaceId)}&id=eq.${encodeURIComponent(id)}&select=*&limit=1`);
      const existing = current.data?.[0] || {};
      await supabaseUpsert("connections", {
        id, workspace_id: state.workspaceId, account_email: existing.account_email || `${state.userId}@identity.local`, provider, status: "configured",
        settings: { ...(existing.settings || {}), access_token_encrypted: encrypt(tokens.access_token), refresh_token_encrypted: encrypt(tokens.refresh_token), expires_in: tokens.expires_in || null, scope: tokens.scope || config.scopes },
        last_test_status: "not_tested", last_tested_at: null, created_at: existing.created_at || now, updated_at: now
      });
      res.statusCode = 302;
      res.setHeader("Location", `${appUrl(req)}${state.returnTo.includes("?") ? "&" : "?"}oauth=success&provider=${encodeURIComponent(provider)}`);
      return res.end();
    }
    return badRequest(res, "Action OAuth inconnue.");
  } catch (error) {
    return json(res, error.status || 500, { ok: false, error: error.publicMessage || "La connexion securisee n'a pas pu aboutir." });
  }
};
