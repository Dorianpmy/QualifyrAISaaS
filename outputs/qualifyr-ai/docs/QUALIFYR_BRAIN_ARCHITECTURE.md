# Qualifyr Brain — architecture

Qualifyr Brain est l’orchestrateur central de Qualifyr OS. Il n’est ni un accès direct à la base ni un agent autonome. Le chemin obligatoire est : **demande → contexte limité au workspace → plan structuré → approbation humaine → outil enregistré → activité et historique**.

## Composants

- `brain-engine.js` : classification des trois modes, registre, validation, politiques, brief et plans déterministes.
- `api/brain.js` : authentification, isolation du workspace, sessions, plans, approbations, exécutions et traces.
- `api/_crm-service.js` : même service contrôlé utilisé par le CRM et Brain pour créer une tâche.
- Tables `brain_*` : mémoire conversationnelle, plans, approbations, exécutions, outils, recommandations, coût et événements.
- `view-ai-center` : identité unique « Qualifyr », brief, modes Comprendre/Préparer/Agir, plan et historique.

## Flux V1 réellement disponible

1. L’utilisateur demande de préparer le suivi de ses prospects.
2. L’API dérive le workspace de l’utilisateur authentifié et charge un contexte CRM borné.
3. Brain produit un plan JSON composé uniquement de `crm.task.create`.
4. Le plan reste `pending_approval` et ne modifie rien.
5. L’utilisateur approuve explicitement le plan.
6. Une seconde action explicite lance l’exécution.
7. Le service CRM crée la tâche avec une clé idempotente, une activité CRM, une activité workspace et un événement outbox.
8. Le run, chaque étape et le résultat sont visibles dans l’historique Brain; le CRM et le dashboard relisent la vraie tâche.

## Limites honnêtes de la V1

- Le moteur de langage est déterministe : aucun fournisseur LLM n’est appelé dans ce lot.
- Aucune publication, suppression, transaction financière, notification ou message externe n’est disponible.
- Le traitement asynchrone durable de l’outbox appartient au module Automations; Brain journalise l’événement mais ne simule aucun worker.
- Le fichier `supabase/schema.sql` est la source SQL existante du dépôt. Il n’existe pas encore de système de migrations versionnées; ce lot n’exécute donc rien en production.

## Extension

Un nouveau module s’intègre par un outil enregistré avec schéma, risque, rôles, module requis, implémentation serveur idempotente et matrice de tests. Aucun nom d’outil fourni par le modèle ne doit être exécuté s’il n’est pas dans le registre.
