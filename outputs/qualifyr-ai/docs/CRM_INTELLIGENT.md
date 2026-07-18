# CRM intelligent — Qualifyr OS étape 4

Le CRM est un module partagé par tous les packs métier. Il n’affiche aucune donnée de démonstration : les contacts, organisations, opportunités, tâches et activités proviennent du workspace Supabase authentifié.

## Modèle et isolation

- `crm_contacts` et `crm_organizations` constituent le carnet d’adresses commun.
- `crm_pipelines`, `crm_pipeline_stages` et `crm_opportunities` décrivent le parcours commercial. Les identifiants de modèles sont stables et l’installation est idempotente.
- `crm_tasks`, `crm_notes`, `crm_documents` et `crm_activities` forment l’historique opérationnel.
- `crm_custom_fields`, `crm_tags`, `crm_saved_views`, `crm_imports` et `crm_duplicate_candidates` rendent le socle extensible.
- Chaque ligne porte `workspace_id`. Le navigateur n’accède jamais directement aux tables : l’API vérifie le jeton Supabase et l’appartenance au workspace, puis utilise la clé serveur. Les rôles contrôlent création, export, fusion et personnalisation.

## Packs

- Artisan : demande → qualification → visite → devis → relance → gagné/perdu.
- Télécom : lead → éligibilité → audit → proposition → signature → activation.
- Immobilier : deux pipelines distincts pour les mandats et les acquéreurs.
- Services : lead → découverte → proposition → négociation → gagné/perdu.
- Générique : nouveau → qualification → proposition → gagné/perdu.

Les noms visibles peuvent évoluer sans modifier les clés internes. Une mise à jour de modèle n’écrase donc pas les personnalisations existantes.

## Règles métier

- La priorité est déterministe : échéance dépassée, prochaine action absente ou inactivité. Chaque recommandation contient ses raisons.
- Les déplacements de pipeline utilisent une version optimiste afin de détecter les modifications concurrentes.
- Les doublons sont signalés par email ou téléphone normalisé. La fusion est une fonction PostgreSQL atomique qui réaffecte les relations et archive le doublon.
- Les mutations écrivent une activité et un événement `outbox`, utilisable par les futures automatisations.
- Les montants sont stockés en centimes et les exports CSV neutralisent les formules dangereuses.

## API et exploitation

`GET /api/crm` charge la vue CRM paginée. `GET /api/crm?action=export` produit un CSV selon le rôle. `POST /api/crm` accepte les actions de création, déplacement, tâche, note, import, vue enregistrée, archivage/restauration et fusion.

Les migrations sont additives. Aucune table historique n’est supprimée. Après toute évolution : exécuter les tests Node, vérifier les conseillers Supabase, déployer sur Vercel et contrôler l’API authentifiée et non authentifiée.
