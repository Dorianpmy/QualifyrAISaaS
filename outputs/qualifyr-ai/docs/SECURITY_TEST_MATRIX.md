# Security test matrix

| Area | Automated now | Still required |
|---|---|---|
| Authentication | anonymous API rejection | expired/revoked session integration |
| Tenant isolation | forged workspace tests on core modules | two real Supabase workspaces on every legacy route |
| Webhooks | missing/invalid/valid WhatsApp signature | durable replay and Mollie integration |
| Secrets/logs | redaction unit test and repository scan | hosted log sampling |
| XSS | escaped website engine unit tests | browser stored-XSS suite across CRM/Brain |
| CSRF/CORS | bearer-only same-origin design review | browser cross-origin tests |
| Rate limiting | public form in-process limiter | distributed limiter tests |
| AI | injection and tool approval unit tests | malicious document E2E |
| Privacy | schema/request design review | export, anonymization and deletion E2E |

Run: bundled Node executable with `node --test tests/*.test.js`. No lint, TypeScript, build or browser E2E command exists.
