# Data inventory and flows

| Category | Examples | Classification | Source | Destination |
|---|---|---|---|---|
| Identity | email, user id, membership | Confidential | user/Supabase Auth | API, Supabase |
| CRM | name, phone, notes, opportunities | Confidential | user/public form | Supabase, selected AI context |
| Business memory | confirmed facts, instructions | Confidential | workspace users | Supabase, AI context when needed |
| Messages and documents | content, attachments | Highly sensitive | integrations/users | Supabase/storage, selected AI tools |
| Billing | payment ID, plan, status | Confidential | Mollie | API, Supabase |
| Credentials | API keys, OAuth refresh tokens | Secret | operators/providers | server environment/encrypted DB value |
| Diagnostics | event type, correlation ID | Internal | API | logs/audit tables |

The browser sends bearer authentication to same-origin APIs. APIs verify the user, derive workspace identity, and use a server-only Supabase key. External data flows include Supabase, OpenAI, Meta/WhatsApp, Google, Microsoft, Mollie and Resend, only when configured.
