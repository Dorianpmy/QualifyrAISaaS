const test = require("node:test");
const assert = require("node:assert/strict");
const crypto = require("crypto");
const { redact, safeEqual } = require("../api/_security");
const whatsapp = require("../api/webhooks/whatsapp");
const connections = require("../api/connections");

function response() {
  return { statusCode: 0, headers: {}, setHeader(key, value) { this.headers[key] = value; }, end(value) { this.body = value; } };
}

test("redacts secrets and personal fields from logs", () => {
  const value = redact({ authorization: "Bearer abc.def", email: "client@example.com", nested: { refresh_token: "secret" } });
  assert.equal(value.authorization, "[REDACTED]");
  assert.equal(value.email, "[PRIVATE]");
  assert.equal(value.nested.refresh_token, "[REDACTED]");
});

test("redacts provider errors containing tokens, phone numbers and emails", () => {
  const value = redact("Meta failed EAAabcdefghijklmnop for +33 6 12 34 56 78 and client@example.com");
  assert.doesNotMatch(value, /EAAabcdefghijklmnop|client@example\.com|6 12 34 56 78/);
  assert.match(value, /\[REDACTED\]|\[PHONE\]|\[EMAIL\]/);
});

test("constant time comparison rejects different values", () => {
  assert.equal(safeEqual("same", "same"), true);
  assert.equal(safeEqual("same", "other"), false);
});

test("WhatsApp signature fails closed without an app secret", () => {
  const before = process.env.META_APP_SECRET;
  delete process.env.META_APP_SECRET;
  assert.equal(whatsapp.validSignature(Buffer.from("{}"), ""), false);
  if (before) process.env.META_APP_SECRET = before;
});

test("WhatsApp accepts only the matching HMAC", () => {
  const before = process.env.META_APP_SECRET;
  process.env.META_APP_SECRET = "test-secret";
  const raw = Buffer.from('{"entry":[]}');
  const signature = `sha256=${crypto.createHmac("sha256", "test-secret").update(raw).digest("hex")}`;
  assert.equal(whatsapp.validSignature(raw, signature), true);
  assert.equal(whatsapp.validSignature(raw, `${signature.slice(0, -1)}0`), false);
  if (before) process.env.META_APP_SECRET = before; else delete process.env.META_APP_SECRET;
});

test("connections endpoint rejects anonymous email enumeration", async () => {
  const req = { method: "GET", url: "/api/connections?email=victim@example.com", headers: {} };
  const res = response();
  await connections(req, res);
  assert.equal(res.statusCode, 401);
  assert.doesNotMatch(String(res.body), /victim@example\.com/);
});
