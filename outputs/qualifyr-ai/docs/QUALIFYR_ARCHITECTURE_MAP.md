# Carte d'architecture Qualifyr

## Flux réel principal

```text
Navigateur
  ├─ Auth Supabase via /api/auth
  ├─ Onboarding → workspaces/workspace_members/business_profiles/workspace_*
  ├─ Dashboard → agrégats CRM + ancien quotes + website + content
  ├─ CRM → tables crm_* → crm_activities + crm_outbox_events
  ├─ Website Builder → tables website_* → snapshot website_publications
  └─ Content Studio → tables content_* → crm_outbox_events

Visiteur public
  └─ /s/:slug → /api/site-public
       └─ formulaire → crm_contacts → crm_opportunities → crm_activities
                                      └─ pas de qualification/tâche/worker
```

## Modules et dépendances réelles

| Module | UI | API/moteur | Données | Dépendances |
|---|---|---|---|---|
| Auth | modales `app.js` | `/api/auth` | Supabase Auth, localStorage session | Supabase service key |
| Workspace/onboarding | vue onboarding | `/api/onboarding`, `onboarding-engine.js` | `workspaces`, `workspace_*`, `business_profiles` | Auth |
| Dashboard | vue dashboard | `/api/dashboard`, `dashboard-engine.js` | CRM, website, content, quotes | Workspace + pack |
| CRM | vue CRM | `/api/crm`, `crm-engine.js` | `crm_*` | Workspace, membres, pack |
| Website | vue site | `/api/website`, `website-engine.js` | `website_*` | Workspace, CRM pour formulaires |
| Public site | HTML rendu serveur | `/api/site-public` | publication + CRM | Slug public, service key |
| Content | vue contenu | `/api/content`, `content-engine.js` | `content_*`, media website | Workspace, connections, website |
| Automations | écran historique | aucun moteur | JSON config + localStorage + outbox | Consommateur manquant |
| Assistant | écrans copilotes | `/api/copilot-run`, `_copilot-engine.js` | `copilot_runs` par email | OpenAI facultatif |
| Billing | abonnement/checkout | checkout + webhook Mollie | tables historiques | Mollie, Resend |
| Integrations | cartes connexions | connections + oauth + webhooks | `connections` par email | fournisseurs externes |
| Files/notifications | vues | aucun service complet | métadonnées partielles | manquant |

## Événements

Producteurs : CRM, Website Builder et Content écrivent dans `crm_outbox_events`; ils écrivent aussi leurs journaux spécialisés. Aucun consommateur, worker, ordonnanceur, retry ou dead-letter n'existe. Les entrées restent `pending`. Les tâches planifiées de contenu sont des lignes de calendrier sans exécuteur.

## Frontières de données

- **Moderne** : `workspace_id`, membre contrôlé, requêtes serveur filtrées, accès navigateur révoqué.
- **Historique** : `account_email`, session locale et endpoints publics. Tables concernées : accounts, quotes, connections, copilot_installations/runs, messages, subscriptions, payments.
- **Public** : publications de sites par slug et soumissions de formulaire. Le workspace vient de la publication, pas du client, ce qui est correct.

## Intégrations

OAuth prépare Google, Microsoft, Meta et Mollie et chiffre les tokens. Le statut « connected » signifie échange OAuth réussi, pas action métier validée. WhatsApp et Mollie ont des webhooks séparés. Resend est utilisé uniquement après paiement. Aucune intégration n'a de test contractuel dans le dépôt.

## Duplications structurantes

1. Session locale `qualifyrSession` vs Supabase Auth.
2. Comptes/leads historiques vs workspaces/membres/CRM.
3. Quotes par email vs opportunités/documents workspace.
4. Automations dans localStorage/config JSON vs outbox sans moteur.
5. Dashboard historique demo vs dashboard Supabase.
6. Copilotes « installés » par statut vs assistant réel non authentifié.

## Routes enregistrées

`admin-login`, `auth`, `checkout`, `connections`, `copilot-run`, `copilots`, `content`, `crm`, `dashboard`, `leads`, `oauth`, `onboarding`, `quotes`, `website`, `site-public`, `webhooks/payment`, `webhooks/whatsapp` via `api/[...route].js`.

## Déploiement

Vercel sert les fichiers statiques et les fonctions Node. `vercel.json` réécrit le site public et les routes catch-all. Aucun pipeline CI, build, lockfile, preview validation, cron ou worker n'est déclaré. Supabase est appelé directement par REST depuis les fonctions.

## Proposition courte pour un futur AGENTS.md

- Décrire `outputs/qualifyr-ai`, les fonctions API, moteurs, tests et schéma.
- Interdire toute confiance dans `workspaceId`/email venant du client; dériver le tenant depuis la session.
- Exiger migration versionnée, réversible et testée; aucune base de production pendant le développement.
- Aucun secret, PII, export ou base réelle dans Git/logs.
- Une intégration n'est « opérationnelle » qu'après test lecture/écriture/webhook documenté.
- Definition of done : tests unitaires + intégration + golden path E2E + build preview + documentation.

