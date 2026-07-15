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

- Vercel pour publier l'interface publique et connecter le domaine.
- Supabase pour stocker comptes, entreprises, prospects, copilotes installes, abonnements, demandes et historiques.
- Mollie ou PayPlug pour le paiement mensuel. Les cles restent cote serveur.
- Resend ou Brevo pour les emails transactionnels : bienvenue, demande recue, paiement confirme, installation du copilote.
- Cal.com ou Calendly pour le bouton "Parler a Qualifyr" si le prospect veut un rendez-vous humain.
- Plausible ou PostHog pour mesurer les pages vues, clics, conversions et abandons.
- Crisp ou Tawk.to pour le support public.
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

## Etat actuel du passage SaaS

- Deploiement Vercel public actif.
- Formulaires prospects interactifs.
- Creation de comptes clients cote interface.
- Session client/admin conservee localement.
- Espace client avec formule, metier, demandes et installation.
- Admin Qualifyr avec demandes entrantes, qualification, paiement et activation client.
- Les donnees sont pretes a etre remplacees par Supabase : les points d'entree sont `saveLead`, `saveAccount`, `setSession` et `upsertLeadStatus`.

## Parcours commercial prioritaire

1. Le plombier arrive sur la page publique.
2. Il choisit son metier.
3. Qualifyr affiche uniquement les copilotes utiles pour ce metier.
4. Il remplit le formulaire simple : entreprise, telephone, email, site, objectif.
5. Il choisit : ajouter le copilote au site, recevoir les demandes par email, ou les deux.
6. Il choisit une formule : Essentiel 79 EUR/mois, Pro 149 EUR/mois recommande, Equipe 299 EUR/mois.
7. Le paiement cree l'abonnement.
8. Le webhook paiement active le copilote.
9. Le prospect recoit un email avec le recapitulatif, le lien de connexion et le script widget.
10. Qualifyr peut finaliser l'installation en mode concierge au debut, puis automatiser progressivement.

## Routes API a creer lors du passage backend

- `POST /api/leads` : enregistrer une demande prospect.
- `POST /api/checkout` : creer un paiement Mollie ou PayPlug cote serveur.
- `POST /api/webhooks/payment` : valider le paiement et activer l'abonnement.
- `POST /api/onboarding` : enregistrer metier, objectifs, outils et preferences.
- `GET /api/copilots/recommend` : recommander les copilotes selon metier, budget et objectifs.
- `POST /api/contact` : envoyer une demande a l'equipe Qualifyr.
- `POST /api/widget/install` : generer le script d'installation du copilote.

## Tables de donnees recommandees

- `users`
- `companies`
- `leads`
- `subscriptions`
- `payments`
- `copilots`
- `copilot_installations`
- `onboarding_answers`
- `assistant_events`
- `competitor_audits`
- `support_requests`

## Extension

Pour ajouter un metier, ajouter une entree dans `professions`, puis un playbook dans `professionPlaybooks`.
Pour ajouter un module, ajouter une entree dans `modules`; l'interface se met a jour automatiquement.
Pour ajouter un assistant, ajouter une entree dans `platformRegistry.assistants`.
Pour ajouter un copilote marketplace, ajouter une entree dans `platformRegistry.copilots`.
Pour ajouter un copilote produit, ajouter une entree dans `platformRegistry.copilotCategories`.
