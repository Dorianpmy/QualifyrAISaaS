# Privacy by design

Collect only data required for the selected module. Do not place access tokens, passwords, full payloads, contact content or AI prompts in logs. The redaction helper removes common secret and personal fields. Browser sessions are non-persistent (`sessionStorage`), while onboarding drafts must be treated as device-local convenience data.

AI context must be scoped to the active workspace and task, excluding unrelated contacts and documents. Memory facts remain confirmable, correctable and archivable. External and destructive tool calls require explicit approval. Generated text is not a factual source.

Consent wording, lawful basis, processor contracts, international transfers and legal retention exceptions require owner/legal validation; code cannot establish those decisions.
