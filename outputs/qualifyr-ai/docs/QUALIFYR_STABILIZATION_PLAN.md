# Plan de stabilisation Qualifyr

Ce plan n'est pas commencé par cet audit. L'ordre protège d'abord les données et rend ensuite le golden path démontrable.

## P0 — bloquants

1. **Fermer les IDOR historiques.** Exiger Bearer Supabase et dériver `workspace_id` sur connections, quotes, copilots et copilot-run; ne jamais accepter l'email comme autorisation. Migrer ensuite les données avec une migration versionnée et réversible.
   - Acceptation : tests workspace A/B sur lecture et mutation; aucune ressource B visible avec ID/email deviné.
2. **Sécuriser la création de compte.** Remplacer l'endpoint admin public par un flux signup approprié, confirmation email, limitation, anti-abus et réponses non énumérables.
   - Acceptation : tests abuse/rate-limit, confirmation et échec sans clé de service exposée.
3. **Construire le minimum d'automatisation durable.** Consommateur outbox idempotent, création de tâche interne, retries bornés, verrou, dead-letter et journal.
   - Acceptation : un événement de formulaire crée exactement une tâche, survit à un redémarrage et ne double pas au rejeu.
4. **Isoler ou désactiver l'assistant/WhatsApp.** Route authentifiée, quota, schéma de sortie, timeout, journal de coût et routage du numéro vers le bon workspace. Garder l'auto-réponse désactivée.
   - Acceptation : aucun contexte inter-tenant; timeout contrôlé; validation humaine obligatoire.
5. **Créer le test E2E du golden path sur une base Supabase locale/test.** Il devient le verrou de livraison.
   - Acceptation : étapes 1–15 documentées, premier échec nul, nettoyage des données de test.

## P1 — importants

1. Introduire des migrations versionnées, baseline du schéma actuel, vérification de dérive et rollback documenté.
2. Relier formulaire → qualification métier → tâche; conserver le message brut et la provenance.
3. Remplacer le rate limit mémoire du formulaire par un mécanisme partagé et ajouter idempotence/double-submit.
4. Tester OAuth par fournisseur; séparer « token obtenu » de « lecture testée » et « écriture testée ».
5. Feature flags serveur/UI pour masquer les modules non opérationnels.
6. Réconcilier l'ancien `localStorage`/`account_email` avec le modèle workspace, sans suppression avant migration.
7. Ajouter CI minimale : syntaxe/lint choisi, tests, schéma/migrations, E2E golden path, build/deploy preview.
8. Ajouter CSP au shell, règles explicites de secrets dans `.gitignore`, rétention des PII et journaux d'audit.
9. Rendre les webhooks idempotents et observables; ne plus avaler les échecs critiques.

## P2 — consolidation

- Réduire les N+1 de l'import CRM et remplacer les limites dashboard par agrégats DB.
- Tests accessibilité/responsive, concurrence/versioning, imports/exports et reprise après panne.
- Pipeline sécurisé d'upload : taille, MIME réel, antivirus, stockage privé, URLs signées et droits médias.
- Domaines personnalisés avec preuve DNS, allowlist et protection takeover.
- Nettoyer documentation, données demo, routes mortes et duplication de composants après migration.
- Publication/metrics de contenu uniquement après connecteurs contractuellement testés.

## Ordre et dépendances

`Isolation P0` → `baseline migrations` → `golden path E2E` → `worker minimal` → `qualification/tâche` → `feature flags` → `tests fournisseurs` → `performance et UX`.

## Commandes de validation à institutionnaliser

Le dépôt n'a actuellement aucun script officiel. La stabilisation devra définir, documenter et exécuter via CI des scripts uniques pour : tests unitaires, intégration Supabase locale, migrations dry-run/diff, E2E golden path, lint, build preview et scan de secrets. Jusqu'à leur création, le seul test existant reproductible est :

```sh
/Users/dorian/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --test outputs/qualifyr-ai/tests/*.test.js
```

Les chemins absolus locaux ne devront pas être conservés dans la future CI; un runtime Node déclaré par le projet sera requis.

## Première action recommandée

**Écrire d'abord les tests d'autorisation A/B qui reproduisent les IDOR de `connections`, `quotes`, `copilots` et `copilot-run`, puis fermer ces routes.** Ne pas commencer le worker ou une nouvelle intégration tant que cette frontière de sécurité n'est pas verrouillée.

