# Périmètre MVP Qualifyr

## Positionnement

**Qualifyr est le système commercial IA des entreprises de services et d'intervention.** Il transforme une demande entrante en un dossier clair, une prochaine action et un suivi humain. Le MVP ne cherche pas à remplacer tous les logiciels de l'entreprise.

## Cible et problème

Artisans, entreprises d'intervention, indépendants et petites équipes de services perdent des demandes entre leur site, leur téléphone et leurs messages. Ils ont besoin de savoir qui répondre, quoi demander et quelle action effectuer, sans apprendre un CRM complexe.

## Golden path unique

1. L'entreprise crée son compte et choisit son métier.
2. Qualifyr installe un workspace, un pipeline simple et un tableau de bord.
3. L'entreprise publie un site ou formulaire Qualifyr.
4. Un prospect envoie une demande.
5. Qualifyr crée ou associe le contact et ouvre une opportunité.
6. La demande est qualifiée avec des champs métier explicites.
7. Une tâche ou un rendez-vous est proposé, puis validé par un humain.
8. Une automatisation interne limitée journalise la prochaine action.
9. Le CRM et le dashboard reflètent l'état réel.

## Fonctions conservées au premier plan

- Auth Supabase et onboarding métier.
- Un workspace par compte, membres et rôles simples.
- Dashboard commercial sans métrique inventée.
- CRM : contacts, opportunités, tâches, activité et pipeline.
- Website Builder limité à génération, édition, validation, publication et formulaire.
- Réception/qualification assistée avec validation humaine.
- Automatisations internes limitées et durables : création de tâche, rappel interne, journal d'activité.
- Notifications internes essentielles.
- Mesures essentielles : nouvelles demandes, dossiers sans action, tâches en retard, conversion.

## Fonctions secondaires

- Studio de contenu limité aux brouillons et exports.
- Édition avancée du site, versions et thèmes supplémentaires.
- Calendrier, email et WhatsApp après preuve E2E fournisseur.
- Import/export et détection de doublons avancés.

## Fonctions à masquer par feature flag

Le code est conservé, sans suppression : installation de copilotes, publication sociale, médias/domaines personnalisés, abonnements avancés, Google Business/Drive/Gmail, assistant multi-canal, analytics de contenu. L'interface doit les annoncer uniquement comme « bêta » ou « bientôt disponible » tant que leurs tests contractuels et E2E ne passent pas.

## Fonctions reportées

Marketplace, Hub public, agents multiples, comptabilité, paie, stock, e-commerce, ERP, générateur marketing généraliste et catalogue de centaines de modules.

## Limites explicites du MVP

- Une entreprise de services/intervention; pas d'ERP universel.
- Une qualification assistée et contrôlée par humain; aucune promesse ou prix envoyé automatiquement.
- Une poignée d'automatisations internes auditées; pas de workflow builder libre.
- Aucune intégration déclarée opérationnelle avant un test réel en environnement de test.
- Pas de publication sociale automatisée dans le MVP.
- Pas d'upload ou domaine personnalisé avant sécurisation du stockage et du DNS.

## Critère de démonstration

Un test E2E doit pouvoir créer un utilisateur de test, finir l'onboarding, publier un formulaire, envoyer une demande fictive, constater contact + opportunité + qualification + tâche + activité, puis voir les mêmes informations au dashboard avec un second membre autorisé et sans accès depuis un autre workspace.

