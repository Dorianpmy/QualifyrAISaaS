# Incident response runbook

1. Triage the alert, assign an incident lead and record time, affected environment and correlation IDs without copying secrets.
2. Contain: revoke exposed keys/tokens, disable the affected integration or route, stop workers, and preserve redacted evidence.
3. Determine impacted workspaces, data classes, time window and external processors. Never query unrelated tenants.
4. Eradicate the cause, rotate credentials, add a regression test and deploy through reviewed staging/production procedures.
5. Restore from a verified clean state and monitor failures, unauthorized access and replay attempts.
6. Escalate to the data-protection/legal owner for notification obligations and deadlines. Do not make legal conclusions in engineering logs.
7. Complete a blameless review with owner, root cause, timeline, affected records, corrective actions and due dates.

Emergency contacts and processor support channels must be maintained outside the repository.
