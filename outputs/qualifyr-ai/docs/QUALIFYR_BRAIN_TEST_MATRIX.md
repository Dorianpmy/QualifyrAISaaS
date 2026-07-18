# Qualifyr Brain — matrice de tests

| Domaine | Cas attendu |
|---|---|
| Modes | Comprendre reste read-only; Préparer crée un plan; Agir ne saute pas l’approbation |
| Registre | outil inconnu bloqué; rôle invalide bloqué; module requis contrôlé |
| Schémas | titre requis; clés non déclarées supprimées; tailles bornées |
| Approbation | écriture bloquée sans accord; accord lié au bon utilisateur/workspace |
| Idempotence | même plan/étape produit le même ID de tâche et de run |
| Isolation | workspace fourni par le client ignoré; toute requête filtre le workspace dérivé |
| Injections | demandes de prompt système, SQL ou contournement refusées |
| Observabilité | plan, run, tool run, activité CRM, activité workspace et outbox enregistrés |
| UI | états invité/chargement/erreur/vide; plan explicite; bouton séparé approuver/exécuter |
| Régression | tests CRM, dashboard, website, onboarding et contenu continuent de passer |

Les tests automatiques couvrent le moteur pur et l’API non authentifiée. Les tests avec une vraie base, les politiques RLS et le parcours navigateur authentifié nécessitent un environnement Supabase de test isolé; ils ne doivent jamais être lancés sur la production.
