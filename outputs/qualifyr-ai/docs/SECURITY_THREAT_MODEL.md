# Security threat model

Assets include authentication tokens, workspace CRM records, messages, quotes, generated sites, files, business memory, billing metadata and provider credentials. Actors include owners, members, removed members, anonymous visitors, provider webhooks, support staff and attackers.

Trust boundaries are the browser/API boundary, API/Supabase service-role boundary, public form/API boundary, OAuth providers, AI provider and payment/message webhooks. Principal threats are tenant IDOR, stolen browser tokens, stored XSS, forged or replayed webhooks, OAuth state tampering, prompt injection, SSRF, excessive logging and destructive assistant tools.

Current controls: server-derived workspace identity on modern modules, membership checks, allowlisted tools, explicit approvals for Brain writes, escaped website rendering, signed OAuth state, encrypted provider tokens, webhook HMAC, redacted structured logging, no-store headers and service-role keys restricted to server code.

Residual high risk: legacy email-owned resources and admin authentication, non-durable rate limiting/replay storage, and unexecuted staging migration. These prevent controlled beta.
