# Qualifyr Autopilot

Autopilot est le chemin unique entre l’onboarding et les modules Qualifyr. Il recommande un manifeste métier versionné, affiche un aperçu, puis installe des ressources réelles avec des identifiants stables. Rejouer un plan ne duplique ni pipeline, ni formulaire, ni réglage.

États persistés : plan, exécution, étapes et erreurs techniques codifiées. En cas d’échec, seules les étapes incomplètes sont rejouées. Les anciennes opérations restent alimentées pour la compatibilité de l’interface.

Limite actuelle : aucun worker durable n’est présent dans le dépôt. L’installation s’exécute donc dans la requête serveur tout en enregistrant chaque étape. Les envois, réponses automatiques et publications externes restent désactivés.

Le test système est une simulation explicite : il ne crée aucun contact, opportunité, message, contenu commercial ou statistique réelle.
