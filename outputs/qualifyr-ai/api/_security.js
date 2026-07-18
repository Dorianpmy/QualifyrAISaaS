const crypto = require("crypto");

const SECRET_KEYS = /authorization|cookie|password|secret|token|api[-_]?key|access[-_]?token|refresh[-_]?token/i;
const PRIVATE_KEYS = /email|phone|address|content|message|payload|fact_value/i;

function correlationId(req = {}) {
  const supplied = String(req.headers?.["x-correlation-id"] || "");
  return /^[a-zA-Z0-9._:-]{8,100}$/.test(supplied) ? supplied : crypto.randomUUID();
}

function redact(value, key = "") {
  if (SECRET_KEYS.test(key)) return "[REDACTED]";
  if (PRIVATE_KEYS.test(key) && value != null) return "[PRIVATE]";
  if (Array.isArray(value)) return value.map((item) => redact(item));
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([childKey, child]) => [childKey, redact(child, childKey)]));
  }
  if (typeof value === "string") {
    return value
      .replace(/Bearer\s+[A-Za-z0-9._~-]+/gi, "Bearer [REDACTED]")
      .replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, "[EMAIL]")
      .replace(/(?:\+?\d[\s.()-]?){8,15}/g, "[PHONE]")
      .replace(/\b(?:EAA|ya29\.|sk-|ghp_|gho_)[A-Za-z0-9._-]{12,}\b/g, "[REDACTED]");
  }
  return value;
}

function auditLog(level, event, details = {}) {
  const record = { level, event, at: new Date().toISOString(), ...redact(details) };
  (level === "error" ? console.error : console.info)(JSON.stringify(record));
}

function applyPrivateHeaders(res, id) {
  res.setHeader("Cache-Control", "private, no-store, max-age=0");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Vary", "Authorization, Origin");
  if (id) res.setHeader("X-Correlation-ID", id);
}

function safeEqual(left = "", right = "") {
  const a = Buffer.from(String(left));
  const b = Buffer.from(String(right));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

function safePublicError(error, fallback = "Cette action n’a pas pu être terminée.") {
  const status = Number(error?.status || 500);
  if (status >= 400 && status < 500 && error?.publicMessage) return error.publicMessage;
  return fallback;
}

module.exports = { applyPrivateHeaders, auditLog, correlationId, redact, safeEqual, safePublicError };
