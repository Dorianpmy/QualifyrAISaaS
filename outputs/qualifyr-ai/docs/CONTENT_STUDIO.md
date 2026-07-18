# Studio de contenu — étape 8

Le Studio de contenu prépare, versionne, valide, planifie et exporte des contenus multicanaux sans simuler une publication externe.

## Parcours utilisateur

1. L’utilisateur choisit un sujet, un objectif, un format, un ton et un public.
2. Le moteur produit un brouillon structuré à partir des informations confirmées de l’entreprise.
3. Les sources utilisées et les affirmations sensibles sont visibles.
4. Toute modification crée une version et invalide l’ancienne approbation.
5. Un contenu doit être approuvé avant sa planification.
6. En l’absence d’une intégration officielle, l’action finale génère uniquement un export. Aucun faux succès de publication n’est affiché.
7. Les articles et sections compatibles peuvent être envoyés au **brouillon** du Website Builder. Le site publié ne change jamais automatiquement.

## Architecture

- `content-engine.js` : formats, packs métier, voix de marque, génération de secours déterministe, adaptation et validations.
- `api/content.js` : contrôle d’accès, quotas, versions, approbations, calendrier, export, provenance et événements.
- Tables `content_*` : stockage isolé par `workspace_id`, RLS activé, accès direct client révoqué.
- `content_events` et `crm_outbox_events` : événements durables pour les futurs consommateurs (notifications, automatisations et analytics).

## Sécurité et exactitude

- Le `workspace_id` est dérivé de l’utilisateur authentifié côté serveur.
- Les permissions sont vérifiées pour chaque action sensible.
- Les emails et téléphones sont exclus des faits utilisés par le générateur.
- Les instructions malveillantes, propriétés inconnues et affirmations non vérifiées sont bloquées ou signalées.
- Les métriques ne sont affichées que lorsqu’un fournisseur officiel les a réellement renvoyées.
- Les tokens et secrets de fournisseurs ne sont jamais stockés dans le navigateur.

## Publication future

Un connecteur officiel devra fournir une connexion valide, les autorisations du canal, l’idempotence, les reprises sur erreur et la récupération réelle des métriques. Avant cela, Qualifyr propose seulement l’export manuel.
