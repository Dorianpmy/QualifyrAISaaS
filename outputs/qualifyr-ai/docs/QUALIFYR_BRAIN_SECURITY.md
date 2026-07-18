# Qualifyr Brain — sécurité

## Frontières

- Le token Supabase identifie l’utilisateur; le serveur dérive son `workspace_id`. Un identifiant workspace reçu du navigateur est ignoré.
- Chaque requête métier contient `workspace_id=eq.<workspace dérivé>` et vérifie `workspace_members`.
- Les tables Brain ont RLS activé, aucun privilège `anon` ou `authenticated`, et sont accessibles uniquement au rôle serveur derrière les API contrôlées.
- Le modèle n’a aucun client SQL, aucune clé Supabase et aucun accès au réseau ou aux secrets.

## Approbation et exécution

- Comprendre est en lecture seule. Préparer produit un brouillon/plan. Agir exige un plan, une approbation persistée et une seconde confirmation d’exécution.
- L’approbation est liée au plan, au workspace et à l’utilisateur.
- L’outil est revalidé juste avant l’exécution; le résultat d’une génération précédente n’est jamais considéré comme une permission.
- L’idempotency key stable empêche un double clic de créer deux tâches.

## Données et injections

- Les entrées sont nettoyées, limitées en taille et les motifs évidents de contournement/injection sont refusés.
- Les sources externes sont des données non fiables, jamais des instructions.
- Les traces d’outils sont redacted. Les secrets, tokens et contenus sensibles ne doivent jamais être ajoutés aux métadonnées.
- Les erreurs côté client restent génériques; les statuts détaillés restent dans les tables d’audit.

## Actions interdites dans la V1

SQL arbitraire, exécution de code, publication, e-mail/SMS/WhatsApp, paiement, suppression, modification en masse et action inter-workspace.
