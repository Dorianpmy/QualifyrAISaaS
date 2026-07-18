# Qualifyr Brain — registre d’outils

| Outil | Type | Risque | Approbation | État V1 |
|---|---|---:|---:|---|
| `business.profile.read` | lecture | read | non | contexte interne |
| `dashboard.summary.read` | lecture | read | non | contexte interne |
| `crm.pipeline.read` | lecture | read | non | actif |
| `crm.tasks.read` | lecture | read | non | actif |
| `website.status.read` | lecture | read | non | actif |
| `content.status.read` | lecture | read | non | actif |
| `crm.task.create` | écriture interne | internal_write | oui | actif et idempotent |

Le registre est une liste fermée. Les arguments sont filtrés par schéma et tronqués. Un outil absent, un module inactif, un rôle non autorisé, un mode incorrect ou une approbation manquante bloque l’étape. Les sorties persistées dans `brain_tool_runs` sont expurgées : aucun jeton, e-mail, téléphone ni corps complet n’y est écrit.

Avant d’ajouter un outil : implémenter un service métier serveur partagé, définir l’idempotence, borner les lectures, déclarer le risque, exiger l’approbation pour toute écriture et ajouter les tests d’isolation workspace.
