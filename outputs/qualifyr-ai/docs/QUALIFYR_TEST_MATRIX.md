# Matrice de tests Qualifyr

## Couverture existante

| Fonction | Tests existants | Manque critique | Priorité | Test à ajouter |
|---|---|---|---|---|
| Onboarding/recommandation pack | 9 tests moteur | Persistance, reprise, rollback, concurrence | P1 | intégration Supabase |
| Dashboard | moteur + rejet sans auth | Agrégats DB, droits membre, limites >500, navigateur | P1 | intégration + E2E |
| CRM | moteur + rejet sans auth | CRUD DB complet, A/B tenant, RPC merge, concurrence | P0 | intégration sécurité |
| Website Builder | moteur + rejet sans auth | publication DB, restore, rendu navigateur | P1 | intégration + E2E |
| Formulaire public | validations moteur indirectes | spam, idempotence, contact/opportunité/activity réels | P0 | E2E golden path |
| Content Studio | 29 tests moteur/API auth | DB, quotas concurrents, approbation réelle | P1 | intégration Supabase |
| Automations | aucun | worker, reprise, retries, idempotence, dead-letter | P0 | intégration worker |
| Copilot OpenAI | aucun | auth, schéma, timeout, injection, coût, fallback | P0 | unit + contrat simulé |
| Quotes/connections/copilots | aucun | IDOR email, tenant, mutations | P0 | tests A/B |
| OAuth | aucun | state lié à session, callback, refresh, scopes | P1 | contrat fournisseur sandbox |
| WhatsApp | aucun | signature, replay, routage tenant, idempotence | P0 | fixtures webhook + sandbox |
| Mollie/Resend | aucun | rejeu webhook, échecs partiels, email | P1 | sandbox/contract |
| Upload/files | aucun | fonctionnalité absente | P1 | sécurité fichier avant activation |
| Rôles/membres | permissions moteur partielles | deux utilisateurs réels, révocation | P0 | intégration A/B |
| Migrations | aucun | baseline, dérive, upgrade ancienne DB | P1 | DB locale éphémère |
| UI/accessibilité | aucun | navigation, responsive, clavier, erreurs | P1 | Playwright/équivalent |

## Golden path : scénarios obligatoires

| # | Scénario | Attendu | Type | État |
|---:|---|---|---|---|
| 1 | Signup utilisateur test | session confirmée selon politique | intégration | manquant |
| 2 | Onboarding complet | workspace + membre + pack exactement une fois | intégration | manquant |
| 3 | Dashboard initial | widgets du pack, aucune donnée fictive | E2E | manquant |
| 4 | Générer/publier site | snapshot immuable et URL accessible | E2E | manquant |
| 5 | Soumettre formulaire | 201 puis protection double soumission | E2E | manquant |
| 6 | Associer contact existant | pas de doublon email | intégration | manquant |
| 7 | Ouvrir opportunité | première étape du bon pipeline | intégration | manquant |
| 8 | Qualifier | champs métier/provenance présents | intégration | fonctionnalité manquante |
| 9 | Créer tâche | une seule tâche, prochaine action visible | intégration | fonctionnalité manquante |
| 10 | Consommer outbox | exactement une fois malgré rejeu/redémarrage | intégration worker | fonctionnalité manquante |
| 11 | Dashboard actualisé | métriques concordantes avec DB | E2E | manquant |
| 12 | Membre autorisé | accès attendu; rôle limité bloqué | E2E multi-user | manquant |
| 13 | Workspace B | aucun accès aux IDs de A | sécurité | manquant |

## Tests de sécurité prioritaires

1. GET/POST/PATCH de quotes, connections, copilots et copilot-run avec email d'un autre utilisateur.
2. ID de contact/opportunité/site/contenu du workspace A utilisé avec token B.
3. OAuth start pour email tiers et callback rejoué.
4. Webhook WhatsApp sans signature, signature incorrecte, message rejoué et numéro non mappé.
5. Formulaire public : honeypot, rafale distribuée, payload trop grand, HTML, double-submit.
6. Export CSV avec `=`, `+`, `-`, `@`, formules et encodages.
7. Signup massif et énumération de comptes.

## Commandes actuelles

Commande réellement exécutée et verte :

```sh
/Users/dorian/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --test outputs/qualifyr-ai/tests/*.test.js
```

Résultat du 18 juillet 2026 : **77 réussis, 0 échec, 0 ignoré**, 0,29 s réel.

Diagnostics exécutés : `git diff --check` (succès, 0,03 s) et `node --check` sur 36 fichiers JS (0 échec, environ 1 s). Aucun script officiel n'existe pour lint, TypeScript, build, migrations, intégration ou E2E; ces commandes devront être définies avant de pouvoir être exigées en CI.

