const crypto = require("crypto");
const { json, methodNotAllowed, readBody } = require("./_lib");

function safeEqual(a = "", b = "") {
  const left = Buffer.from(String(a));
  const right = Buffer.from(String(b));
  if (left.length !== right.length) return false;
  return crypto.timingSafeEqual(left, right);
}

function signToken(payload, secret) {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto.createHmac("sha256", secret).update(body).digest("base64url");
  return `${body}.${signature}`;
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") return methodNotAllowed(res);

  const adminEmail = String(process.env.ADMIN_EMAIL || "contact@qualifyragence.com").trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD;
  const sessionSecret = process.env.ADMIN_SESSION_SECRET || adminPassword;

  if (!adminPassword || !sessionSecret) {
    return json(res, 503, {
      ok: false,
      error: "Connexion admin non configuree. Ajoutez ADMIN_PASSWORD dans Vercel."
    });
  }

  const body = await readBody(req);
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");

  if (!safeEqual(email, adminEmail) || !safeEqual(password, adminPassword)) {
    return json(res, 401, {
      ok: false,
      error: "Email admin ou mot de passe incorrect."
    });
  }

  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 8).toISOString();
  const token = signToken({ email: adminEmail, role: "admin", exp: expiresAt }, sessionSecret);

  return json(res, 200, {
    ok: true,
    admin: {
      role: "admin",
      name: "Dorian",
      company: "Qualifyr Agence",
      email: adminEmail,
      token,
      expiresAt
    }
  });
};
