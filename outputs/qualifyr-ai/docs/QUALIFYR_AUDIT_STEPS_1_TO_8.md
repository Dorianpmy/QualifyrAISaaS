# Audit Qualifyr — étapes 1 à 8

Date de l'audit : 18 juillet 2026. Périmètre : état local de `outputs/qualifyr-ai` sur `codex/qualifyr-os-step-5`, commit `9c61122`, avec l'étape 8 non commitée. Aucun code produit, dépendance, test, migration, déploiement ou service externe n'a été modifié ou appelé pendant cet audit.

## Résumé exécutif

**Classification globale : `partiellement construit`.** Qualifyr possède un noyau serveur crédible pour l'onboarding, le dashboard, le CRM, le Website Builder et le Studio de contenu. Le parcours site public → contact CRM → opportunité → activité existe dans le code. Il n'est toutefois pas démontré sur une base de test et s'arrête avant la qualification, la tâche et l'automatisation. Deux générations du produit coexistent : une application historique centrée sur `localStorage` et l'email, et un noyau Qualifyr OS authentifié et isolé par `workspace_id`.

Les risques les plus importants sont les endpoints historiques accessibles avec une simple adresse email, l'inscription qui crée un utilisateur confirmé via la clé de service sans limitation visible, et l'absence totale de worker d'automatisation. Les interfaces OAuth existent, mais aucun fournisseur n'a été testé pendant l'audit. Le contenu est généré par règles déterministes, pas par un modèle IA. Le copilote OpenAI est une route non authentifiée et non isolée par workspace.

## Point de restauration et secrets

- Branche : `codex/qualifyr-os-step-5`, synchronisée avec `origin/codex/qualifyr-os-step-5`.
- État : 7 fichiers modifiés et 5 fichiers non suivis, correspondant principalement à l'étape 8.
- Checkpoint non créé : un commit ou une branche aurait figé et potentiellement mélangé des changements produit non validés. Le répertoire `.git` est en outre en lecture seule dans l'environnement d'audit.
- Aucun `.env`, credential, export de données, base locale ou clé privée n'a été trouvé dans les fichiers suivis inspectés. `.env.example` contient uniquement des noms et placeholders.
- Risque P1 : `.gitignore` ignore seulement `.vercel` et `.DS_Store`; il doit ultérieurement exclure explicitement `.env*`, credentials, clés privées, bases et exports.
- Aucun `AGENTS.md` propre au dépôt n'existe. Le futur fichier devrait résumer structure, commandes réelles, isolation par workspace, règles de migration, sécurité, critères de fin et interdiction d'annoncer une intégration non testée.

## Architecture réellement observée

- Frontend : HTML/CSS/JavaScript sans framework ni bundler, principalement `index.html`, `app.js`, `styles.css`.
- Runtime API : fonctions CommonJS Node routées par Vercel via `api/[...route].js`.
- Données : appels REST directs à Supabase avec clé de service depuis le serveur; aucun ORM.
- Auth moderne : Supabase Auth, token Bearer, workspace déterministe dérivé du `user.id`.
- Auth historique : session et comptes dans `localStorage`, ressources indexées par `account_email`.
- Base : un unique fichier cumulatif `supabase/schema.sql`, 70 tables, sans historique de migrations versionnées.
- Déploiement : `vercel.json` avec rewrites et deux en-têtes de sécurité; aucune CI/CD déclarée.
- Asynchrone : tables outbox présentes, aucun worker, queue, cron ou consommateur.
- Fichiers : métadonnées prévues, aucun upload binaire ni URL signée opérationnelle.

## Matrice des étapes 1 à 8

| Étape | Fonction attendue | Statut | Fichiers / routes / données | Tests et preuve | Écart / priorité |
|---|---|---|---|---|---|
| 1 | Registre modulaire et navigation | `PARTIAL` | `qualifyr-os.js`, `app.js`, `workspace_modules` | Registre et activation présents | État local dupliqué avec Supabase; nombreux modules sans backend, P1 |
| 1 | Auth, workspace, membres et rôles | `PARTIAL` | `/api/auth`, `/api/onboarding`, `workspaces`, `workspace_members` | Rejet non authentifié testé indirectement | Signup admin auto-confirmé, pas de test DB/auth réel, P0/P1 |
| 1 | Billing | `PARTIAL` | `/api/checkout`, `/api/webhooks/payment`, `payments`, `subscriptions` | Implémentation Mollie statique | Non testé; modèle historique par email, P1 |
| 1 | Notifications, files, analytics core | `PLACEHOLDER` | vues HTML, tables partielles | Aucun test E2E | Pas de moteur de notification, upload ou pipeline analytics, P1 |
| 2 | Onboarding métier en étapes | `WORKING` | `onboarding-engine.js`, `/api/onboarding` | 9 tests moteur passent | API+DB non testés réellement, donc fonctionnement local seulement |
| 2 | Provisionnement idempotent du pack | `PARTIAL` | `provisioning_operations`, `workspace_*` | Idempotence moteur testée | Opérations séquentielles sans transaction globale; aucune reprise intégrée testée, P1 |
| 2 | Génération automatique de CRM/site/formulaire/calendrier/assistant | `PARTIAL` | config JSON, modules recommandés | Pack configuré | Site/CRM se créent ensuite à la demande; calendrier, assistant et automatisations ne sont pas provisionnés réellement, P1 |
| 3 | Dashboard métier et préférences | `WORKING` | `dashboard-engine.js`, `/api/dashboard`, `dashboard_preferences` | 11 tests moteur/API passent | Requêtes DB et rendu navigateur non testés |
| 3 | Métriques réelles | `PARTIAL` | agrégation CRM, quotes, website, content | Code calculé depuis tables | `quotes` reste joint par email et les limites à 500 faussent les grands comptes, P1/P2 |
| 4 | CRM contacts, organisations, opportunités, tâches | `WORKING` | `crm-engine.js`, `/api/crm`, tables `crm_*` | 23 tests passent | Aucun test Supabase authentifié ou multi-utilisateur réel |
| 4 | Imports, exports, doublons, activités | `PARTIAL` | `/api/crm`, RPC `crm_merge_contacts` | CSV protégé contre formules testé | RPC/migrations non exécutés en test; import N+1, P2 |
| 4 | Devis reliés au CRM | `DUPLICATED` | `/api/quotes`, table `quotes` | Aucun test | Ancien modèle `account_email`, sans auth/workspace, P0 |
| 5 | Génération/édition/version du site | `WORKING` | `website-engine.js`, `/api/website`, tables `website_*` | 16 tests passent | Pas de test DB ou navigateur réel |
| 5 | Publication publique | `PARTIAL` | `/api/site-public`, `/s/:slug` | Snapshot et validation unitaires | Domaine canonique codé en dur; publication réelle non testée, P1 |
| 5 | Formulaire → CRM | `PARTIAL` | POST `/api/site-public?...action=submit` | Preuve statique : contact, opportunité, activité | Pas de tâche, qualification ou E2E DB; rate limit mémoire, P0/P1 |
| 5 | Médias et domaines personnalisés | `PLACEHOLDER` | `website_media`, `website_domains` | Documentés comme préparés | Aucun upload, stockage, validation MIME ou DNS, P1 |
| 6 | Builder/persistance des automatisations | `PLACEHOLDER` | `localStorage`, `workspace_initial_configs.automations` | Aucun test | Aucun modèle d'exécution durable, P0 |
| 6 | Déclencheurs, attentes, reprises, idempotence | `MISSING` | `crm_outbox_events` seulement | Aucun consommateur | Les événements restent `pending`, P0 |
| 7 | Assistant commercial IA | `PARTIAL` | `_copilot-engine.js`, `/api/copilot-run` | Aucun test | Appel OpenAI possible, mais route sans auth/workspace, pas de timeout/retry/schéma strict, P0 |
| 7 | WhatsApp qualification | `PARTIAL` | `/api/webhooks/whatsapp` | Signature codée, aucun test réel | Compte global par variable env, pas de routage tenant; auto-réponse optionnelle dangereuse, P0 |
| 7 | Installation de copilotes | `PLACEHOLDER` | `/api/copilots`, `copilot_installations` | Aucun test | Change seulement un statut; aucune installation fonctionnelle, P1 |
| 8 | Idées, brouillons, adaptation, versions | `WORKING` | `content-engine.js`, `/api/content`, tables `content_*` | 29 tests passent | Génération déterministe, pas IA; DB non testée |
| 8 | Approbation et calendrier | `PARTIAL` | approvals, calendar entries | Validation moteur testée | Aucun worker de publication planifiée, P1 |
| 8 | Publication multicanale et métriques | `PLACEHOLDER` | `/api/content` | Export manuel explicite | Toute publication connectée renvoie 501; aucune synchronisation de métriques, P1 |

Synthèse indicative : étape 1 **45 %**, étape 2 **70 %**, étape 3 **75 %**, étape 4 **75 %**, étape 5 **70 %**, étape 6 **10 %**, étape 7 **25 %**, étape 8 **65 %**. Ces pourcentages résument la matrice; ils ne mesurent pas une couverture de production.

## Golden path audité

| Passage | Statut | Preuve |
|---|---|---|
| 1. Créer un compte | `PARTIAL` | `/api/auth` appelle Supabase Auth; aucun test réel et auto-confirmation serveur |
| 2. Terminer l'onboarding | `PARTIAL` | étapes persistées; moteur testé |
| 3. Créer le workspace | `PARTIAL` | ID dérivé du user et upsert; DB non testée |
| 4. Appliquer le pack | `PARTIAL` | opérations idempotentes et tables de config |
| 5. Accéder au dashboard | `PARTIAL` | route authentifiée et moteur testé |
| 6. Créer/publier le site | `PARTIAL` | snapshot publié dans Supabase; aucun E2E |
| 7. Soumettre une demande | `PARTIAL` | POST public, validation, honeypot et limite mémoire |
| 8. Créer/associer un contact | `PARTIAL` | upsert par email normalisé |
| 9. Créer une opportunité | `PARTIAL` | première étape du pipeline si disponible |
| 10. Qualifier la demande | `MISSING` | message seulement stocké dans note/payload; aucun moteur de qualification |
| 11. Créer une tâche | `MISSING` | aucune tâche créée par le formulaire |
| 12. Déclencher une automatisation | `MISSING` | aucun worker/outbox consumer |
| 13. Afficher l'activité CRM | `PARTIAL` | activité créée, UI non testée |
| 14. Actualiser le dashboard | `PARTIAL` | recalcul au prochain fetch, pas de realtime |
| 15. Traiter par un membre autorisé | `PARTIAL` | rôles codés, collaboration réelle non testée |

**Premier point d'échec fonctionnel : étape 10, qualification.** Les étapes 1–9 sont cohérentes statiquement mais restent non démontrées de bout en bout.

## Multi-tenant et sécurité

### P0

1. **IDOR par email** : `/api/connections`, `/api/quotes`, `/api/copilots` et `/api/copilot-run` n'exigent aucun token. Connaître une adresse permet de lire ou modifier des ressources. Les tables historiques ne portent pas de `workspace_id`.
2. **Copilote non isolé** : `/api/copilot-run` accepte email, contexte et société du client, appelle éventuellement OpenAI et écrit par email sans autorisation.
3. **WhatsApp mono-tenant** : tous les messages sont affectés à `WHATSAPP_ACCOUNT_EMAIL`; le numéro destinataire n'est pas résolu vers un workspace. Une future activation multi-client provoquerait mélange et actions erronées.
4. **Automatisations absentes** : l'outbox est durable, mais aucun consommateur; le produit annonce des automatisations qui ne peuvent pas s'exécuter.
5. **Signup exposé** : `/api/auth` utilise l'endpoint admin avec `email_confirm:true`, sans rate limit/CAPTCHA visibles. Risque d'abus et de création massive de comptes.

### P1

- Les routes modernes CRM, dashboard, website et content dérivent le workspace côté serveur et filtrent chaque requête; c'est le bon modèle. Il manque toutefois des tests A/B réels.
- La clé de service contourne RLS. Les tables modernes révoquent l'accès navigateur, mais toute erreur de filtre serveur devient critique.
- Le formulaire public limite par une `Map` mémoire : limite non partagée, perdue à chaque redémarrage et contournable via en-têtes IP.
- Pas de protection CSRF explicite sur les routes historiques; les routes Bearer modernes sont moins exposées aux cookies, mais l'OAuth start n'authentifie pas l'utilisateur Qualifyr.
- OAuth associe le compte à l'email signé fourni au démarrage, pas à une session Bearer; un attaquant peut initier une connexion pour un email tiers et pousser son propre compte fournisseur.
- La prévisualisation privée et les domaines existent dans le schéma sans route de sécurité démontrée.
- Les exports CSV modernes neutralisent les formules, mais les exports et journaux ne sont pas couverts par politique de rétention/RGPD.
- `site-public` a une CSP utile; le shell principal n'a ni CSP, ni HSTS, ni Permissions-Policy.

## Intégrations externes

| Fournisseur | Interface | Réalité | Webhook / lecture / écriture | Fallback | Classement |
|---|---|---|---|---|---|
| Supabase | Auth + REST | Implémenté | Non testé pendant l'audit | Certaines écritures historiques avalent les erreurs | `IMPLEMENTED_NOT_TESTED` |
| OpenAI | Copilote | Appel Responses API serveur | Non testé; pas de timeout/retry | Règles locales | `IMPLEMENTED_NOT_TESTED` |
| Google | OAuth | Échange de token et stockage chiffré | Aucune lecture/écriture métier testée | Interface de statut | `IMPLEMENTED_NOT_TESTED` |
| Microsoft | OAuth | Échange de token | Aucun calendrier/email métier | Interface | `IMPLEMENTED_NOT_TESTED` |
| Meta/WhatsApp | OAuth + webhook | Signature et envoi codés | Aucun test de webhook/production pendant l'audit | Mode dev accepte sans secret; règles IA | `IMPLEMENTED_NOT_TESTED` |
| Mollie | Checkout + webhook | Création/refetch paiement codés | Non testé; emails secondaires avalent les erreurs | 503 si clé absente | `IMPLEMENTED_NOT_TESTED` |
| Resend | Email paiement | Envoi serveur codé | Non testé | Échec silencieux | `IMPLEMENTED_NOT_TESTED` |
| Google Business/Drive/Gmail/Calendar | Cartes UI | Scopes OAuth seulement | Aucune action métier réelle | Test de configuration simulé | `INTERFACE_ONLY` |
| Réseaux sociaux du Studio | UI/export | Publication renvoie 501 si connecté | Aucune publication/métrique | Export manuel | `INTERFACE_ONLY` |

Aucune intégration ne peut être classée `REAL_AND_TESTED` sur les preuves de cet audit.

## Audit IA

- `_copilot-engine.js` peut appeler OpenAI côté serveur avec `OPENAI_API_KEY` et un modèle configurable. Le contexte complet fourni par le client est concaténé au prompt. Sortie JSON demandée mais non validée par schéma; parse impossible → texte non structuré. Aucun timeout, retry, contrôle de coût par workspace, quota, authentification ou protection robuste contre injection. Classement : **incomplet et dangereux tant que la route reste publique**.
- Sans clé, le copilote utilise des règles déterministes prudentes. Classement : **fallback seulement**.
- Le webhook WhatsApp peut appeler ce moteur puis auto-répondre si une variable est active. Signature Meta est prévue, mais routage mono-tenant et absence d'approbation humaine en mode auto : **incomplet/dangereux**.
- Le Studio de contenu n'appelle aucun modèle. `provider: deterministic`, `model: qualifyr-content-v1`; validation des faits et injections bien testée. Classement : **opérationnel local par règles, pas IA**.
- Le Website Builder est déterministe. Classement : **générateur de règles, pas IA**.

## Données et migrations

- Un seul `schema.sql` cumulatif; pas d'ordre de migration, de table d'historique ou de mécanisme de rollback. Impossible de prouver la compatibilité d'une base ancienne.
- 70 tables, toutes déclarées une fois. Les ensembles modernes ont clés étrangères, index et archivage globalement cohérents.
- Les tables historiques (`accounts`, `quotes`, `connections`, etc.) coexistent avec les tables workspace et dupliquent identité, billing et activité.
- Les blocs RLS modernes révoquent `anon, authenticated` et accordent au `service_role`; aucun accès client direct. Cela protège le navigateur mais concentre tout le risque dans les routes serveur.
- Les opérations d'onboarding sont idempotentes par ID, mais sans transaction globale. Les événements utilisent parfois `Date.now()` dans la clé, donc une reprise peut dupliquer un événement.
- Aucun seed formel. De nombreuses données de démonstration sont codées dans `app.js`.

## Performance, erreurs et dette

- Import CRM : une requête de détection par ligne, jusqu'à 500 lignes (N+1).
- Dashboard : plusieurs requêtes parallèles avec limites fixes à 500; métriques inexactes au-delà.
- Site public : rate limit en mémoire, non adapté au serverless distribué.
- Les webhooks et le checkout avalent plusieurs erreurs Supabase/email, pouvant afficher un succès partiel sans journal exploitable.
- Aucun observability, correlation généralisée, dead-letter queue, worker ou alerte.
- Pas de gestionnaire de dépendances : revue de versions/inutilisés non applicable. Le code dépend uniquement des API Node et `fetch` global.
- Documentation obsolète et contradictoire : README décrit encore un prototype, des routes « à créer » qui existent, et des modules comme s'ils étaient opérationnels.

## Commandes exécutées

Environnement : macOS sandbox, Node fourni par Codex. Aucun service réseau ni base externe utilisé.

| Commande exacte | Résultat | Durée observée | Tests/échecs/avertissements |
|---|---|---:|---|
| `/Users/dorian/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --test outputs/qualifyr-ai/tests/*.test.js` | succès | 0,29 s réel; runner 130,49 ms | 77 pass, 0 fail, 0 skipped |
| `git diff --check` | succès | 0,03 s | 0 erreur |
| `node --check` sur les fichiers retournés par `rg --files ... -g '*.js'` | succès diagnostic | 1 s | 36 fichiers, 0 échec |

Commandes **indisponibles** : installation, lint, TypeScript, build de production, migrations, intégration DB, E2E et navigateur. Le dépôt ne contient ni `package.json`, lockfile, script, tsconfig, config de build, migration versionnée ou suite E2E. Le check syntaxique est un diagnostic direct, pas une commande officielle du dépôt.

## Éléments non testables dans cet environnement

- Auth et isolation Supabase réelles, RPC et schéma appliqué.
- OAuth et actions Google/Microsoft/Meta/Mollie.
- Réception/envoi WhatsApp, paiement et email.
- Publication Vercel et formulaire sur URL publique.
- Responsive/accessibilité et parcours navigateur.
- Collaboration à plusieurs membres et conflits concurrents.
- Reprise après panne, idempotence webhook et volumes réels.

