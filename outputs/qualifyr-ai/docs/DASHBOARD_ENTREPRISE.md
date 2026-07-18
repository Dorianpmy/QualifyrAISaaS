# Dashboard entreprise — Étape 3

Le dashboard Qualifyr OS est alimenté par `GET /api/dashboard`. L’API authentifie le jeton Supabase, dérive l’identifiant du workspace depuis l’utilisateur vérifié et contrôle son appartenance via `workspace_members`.

## Widgets

Le registre `dashboard-engine.js` contient huit widgets stables : centre d’attention, indicateurs, journée, suivi commercial, activité récente, modules, recommandations et préparation. Les dispositions Artisan, Télécom, Immobilier, Services et Générique sont des configurations, pas des pages dupliquées.

Les données commerciales proviennent uniquement des lignes Supabase réellement associées à l’email professionnel vérifié du profil. Les rendez-vous et tâches restent à zéro avec un état vide tant qu’une source persistante dédiée n’existe pas. Aucune tendance n’est calculée sans historique.

## Personnalisation

L’ordre et les widgets masqués sont des préférences personnelles (`dashboard_preferences`, unicité workspace + utilisateur). Les widgets obligatoires ne peuvent pas être masqués. Les contrôles Monter, Descendre, Masquer et Restaurer sont utilisables au clavier.

## Activité et recommandations

`workspace_activities` conserve uniquement le type d’événement et les références strictement nécessaires. `workspace_recommendations` persiste les états masqué/terminé ; le contenu visible est produit par des règles déterministes dans `dashboard-engine.js`.

## Points d’extension

L’étape 4 pourra fournir les agrégats CRM au widget `commercial_overview` sans modifier sa composition. Les futurs modules fourniront de la même façon leurs données au service d’agrégation, sans ajouter de chiffres de démonstration.
