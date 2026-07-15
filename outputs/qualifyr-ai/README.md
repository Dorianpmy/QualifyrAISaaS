# Qualifyr AI

Prototype SaaS premium pour un copilote IA modulaire dedie aux PME et artisans.

## Ouvrir l'application

- Serveur local actuel : http://127.0.0.1:4173/
- Fichier direct : `index.html`

## Architecture prevue pour la production

- `professions` et `professionPlaybooks` pilotent les metiers, questions, urgences et automatisations.
- `modules` centralise les modules activables sans refonte de l'interface.
- `connectors` prepare les integrations Google Calendar, Gmail, WhatsApp, Meta, Mollie, Google Sheets, Slack, Zapier, Webhook et API.
- `platformRegistry.assistants` declare les assistants IA activables individuellement avec etat, statistiques, couts, parametres et historique.
- `platformRegistry.copilots` declare les copilotes marketplace installables en un clic, avec modules embarques et promesses metier.
- `platformRegistry.copilotCategories` declare le coeur produit : Acquisition, Commercial, Planning, Clients, Marketing, Finance et Pilotage.
- `platformRegistry.extensionPoints` formalise les contrats d'extension a conserver lors du passage vers un backend.
- Les devis generes restent modifiables par l'utilisateur avant envoi.

## Principes produit

Avant chaque nouveau module, verifier qu'il respecte au moins un de ces criteres :

- usage reel pour un artisan ou une PME ;
- gain de temps mesurable ;
- gain de chiffre d'affaires ou meilleure conversion ;
- reduction d'une tache repetitive.

## Contrats d'extension

- `ModuleManifest` : nom, route, droits, composants, evenements et KPIs.
- `AssistantManifest` : tableau de bord, parametres, historique, statistiques, couts et etat.
- `CopilotManifest` : metier cible, assistants inclus, workflows, templates, prix et dependances.
- `CopilotCategoryManifest` : categorie produit, promesse metier, liste de copilotes, fonctionnalites, temps economise, popularite, avis et etat.
- `WorkflowTrigger` : evenements entrants comme appel, formulaire, email, paiement ou facture.
- `WorkflowAction` : actions comme creer client, devis, RDV, tache, notification, webhook ou API.
- `BillingEntitlement` : limites par plan et activation des modules payants.
- `BackendAdapter` : pont futur vers auth, base de donnees, webhooks et APIs tierces.

## A brancher cote serveur

- Authentification, organisations, roles et permissions.
- Appels IA via routes backend uniquement, jamais cote client.
- Secrets OAuth et cles API stockes cote serveur.
- Mollie Subscriptions, liens de paiement et portail client.
- Webhooks entrants WhatsApp, Meta, Mollie, Google et Microsoft.
- Stockage securise des photos, pieces jointes et documents de devis.
- Logs d'automatisation, audit admin et exports RGPD.
- Marketplace avec installation de copilotes, droits par abonnement et migration de configuration.
- Observabilite des couts IA par assistant, organisation, utilisateur et workflow.
- App Store interne pour installer, configurer ou desinstaller les copilotes.
- Formulaire IA sur mesure connecte a un futur CRM interne ou pipeline commercial Qualifyr.

## Extension

Pour ajouter un metier, ajouter une entree dans `professions`, puis un playbook dans `professionPlaybooks`.
Pour ajouter un module, ajouter une entree dans `modules`; l'interface se met a jour automatiquement.
Pour ajouter un assistant, ajouter une entree dans `platformRegistry.assistants`.
Pour ajouter un copilote marketplace, ajouter une entree dans `platformRegistry.copilots`.
Pour ajouter un copilote produit, ajouter une entree dans `platformRegistry.copilotCategories`.
