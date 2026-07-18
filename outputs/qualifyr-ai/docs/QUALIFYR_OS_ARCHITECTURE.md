# Qualifyr OS V1 — architecture modulaire

## Objectif

Qualifyr OS assemble l'infrastructure digitale d'une petite entreprise sans exposer la complexité technique. Le produit reste une application unique aujourd'hui, mais chaque capacité est décrite comme un module activable afin de pouvoir être extraite progressivement sans réécrire l'interface.

## Couches

1. **Core** : compte, entreprise, abonnement, CRM, automatisations, IA, statistiques, notifications, fichiers et réglages. Le Core est toujours disponible.
2. **Modules** : capacités visibles que l'utilisateur peut activer ou masquer. Leur état est conservé sans supprimer leurs données.
3. **Connecteurs** : Google, Microsoft, Meta, WhatsApp et Mollie. Les secrets restent dans les fonctions Vercel.
4. **Données** : Supabase conserve les comptes, connexions, devis, messages, exécutions IA, paiements et installations.
5. **Interface** : les vues existantes restent les implémentations métier. `qualifyr-os.js` devient le registre stable qui les relie.

## Contrat d'un module

Chaque entrée du registre contient :

- `id` : identifiant stable ;
- `name` : nom compréhensible par un novice ;
- `promise` : résultat concret pour l'entreprise ;
- `icon` : pictogramme existant réutilisé ;
- `route` : vue ouverte ;
- `group` : emplacement fonctionnel ;
- `defaultEnabled` : activation lors de la création de l'entreprise.

À terme, le contrat recevra aussi `permissions`, `events`, `dependencies`, `entitlements`, `settingsSchema` et `healthChecks`.

## Modules V1

| Groupe | Modules | Rôle |
| --- | --- | --- |
| Pilotage | Tableau de bord, Statistiques | Montrer l'essentiel et la prochaine action |
| Visibilité | Site internet, Pages de vente, Blog, Visibilité Google | Permettre à l'entreprise d'être trouvée |
| Acquisition | Formulaires, Prise de rendez-vous, Chat du site | Transformer une visite en demande |
| Organisation | Assistant IA | Préparer et classer le travail |
| Communication | Réseaux sociaux, Emails clients, SMS, Avis clients | Garder le contact sans répétition |
| Ventes | Suivi commercial, Devis, Factures | Transformer les demandes en chiffre d'affaires |

## Onboarding

Le parcours collecte le nom, l'activité, la ville, le téléphone, l'email, le site, le logo, la couleur et les objectifs. Il initialise un espace avec les modules essentiels activés. La V1 conserve cet état localement pour ne pas perturber l'authentification actuelle. La migration suivante déplacera cet objet vers des tables `workspaces`, `workspace_members`, `module_installations` et `onboarding_answers` dans Supabase.

## Règles de migration

- aucune vue existante n'est supprimée avant que son remplacement soit fonctionnel ;
- un module masqué conserve ses données ;
- les routes API existantes restent compatibles ;
- les nouveaux secrets restent côté serveur ;
- chaque nouvel écran doit expliquer le résultat, la prochaine étape et le contrôle laissé à l'utilisateur ;
- les données de démonstration doivent être remplacées par les données du workspace avant la mise en production multi-tenant.

## Prochaines étapes techniques

1. Remplacer l'authentification locale par Supabase Auth et introduire `workspace_id` partout.
2. Persister l'onboarding et les activations de modules dans Supabase.
3. Créer le moteur de pages du Website Builder et le stockage de fichiers.
4. Ajouter une file d'événements pour les automatisations et les notifications.
5. Ajouter les droits et limites d'abonnement par module.
6. Mesurer les coûts IA et les résultats par workspace.
