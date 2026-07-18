# Website Builder Qualifyr OS — étape 5

## Architecture

Le builder utilise un seul registre versionné dans `website-engine.js`. L’éditeur, l’API et le rendu public n’acceptent que ses blocs et propriétés. Aucun HTML, CSS, JavaScript ou composant généré librement n’est exécuté.

Le parcours repose sur trois états distincts : contenu brouillon dans `website_pages`, révisions de travail dans `website_revisions`, puis snapshots publiés immuables dans `website_publications`. Une modification du brouillon ne modifie jamais le site visible. Restaurer une révision crée un nouveau brouillon.

## Ajouter un bloc

1. Déclarer son identifiant stable, ses champs et variantes dans `blockTypes`.
2. Ajouter sa validation/sanitation dans `validateBlock` sans autoriser de propriété inconnue.
3. Ajouter son rendu d’aperçu dans `app.js` et son rendu public sémantique dans `api/site-public.js`.
4. Définir son comportement lorsque les données manquent.
5. Ajouter les tests de schéma, sécurité, responsive et accessibilité.

Les blocs sensibles (`verified_testimonials`, chiffres, logos, réalisations) ne doivent être créés que depuis des données explicitement confirmées. Ils ne figurent pas dans la génération par défaut.

## Packs, thèmes et génération

Les modèles Artisan, Télécom, Immobilier, Services et Générique partagent le même moteur. Le pack sélectionne les pages ; l’objectif sélectionne l’appel à l’action et le formulaire. Les thèmes sont des jetons contrôlés et versionnés. Ajouter un thème consiste à ajouter une entrée validée à `themes`, jamais du CSS utilisateur.

La V1 utilise le fournisseur `deterministic`. L’interface d’une future IA devra produire exactement la même structure, avec validation stricte et repli déterministe. Aucun appel IA externe n’est actuellement effectué ou prétendu fonctionnel.

## Publication et rendu public

`POST /api/website` valide puis crée un snapshot immuable. Le site public est rendu par `GET /api/site-public` uniquement depuis `published_version_id`. Les routes `/s/:slug` et `/s/:slug/:page` sont réécrites par Vercel. Le sitemap est disponible à `/s/:slug/sitemap.xml`.

Le rendu encode tous les textes, refuse les URL dangereuses et les blocs inconnus, applique une CSP, ne charge ni CRM ni IA et ne révèle aucune donnée privée.

## Formulaires et CRM

Une soumission publique résout le workspace depuis le site publié, jamais depuis un identifiant fourni par le visiteur. Elle valide la taille des champs, vérifie le consentement, utilise un honeypot et une limitation de débit, déduplique le contact par email, enregistre la source `website`, crée une opportunité lorsque le pipeline existe, puis écrit l’activité CRM. Aucun email ou SMS commercial n’est envoyé.

## Sécurité et médias

Toutes les tables privées ont RLS activé et leurs droits navigateur sont révoqués. Seule l’API serveur utilise la clé secrète. `website_media.publishable` sépare les ressources destinées au site des documents CRM privés. L’upload binaire et les domaines personnalisés sont préparés dans le modèle de données mais ne sont pas annoncés comme connectés dans la V1.

## Limites actuelles

- URL Qualifyr réelle disponible ; domaine personnalisé préparé, pas encore provisionné chez un fournisseur DNS.
- Prévisualisation du brouillon réalisée dans la session authentifiée de l’éditeur, sans URL partageable.
- Génération déterministe opérationnelle ; fournisseur IA externe non activé.
- Pas d’import de site existant, de code personnalisé, de blog complet, d’e-commerce ou de trackers tiers.
