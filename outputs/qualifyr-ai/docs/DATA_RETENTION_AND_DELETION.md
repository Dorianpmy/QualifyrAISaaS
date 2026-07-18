# Data retention and deletion

Proposed defaults, pending legal validation: security logs 90 days; webhook receipts 30 days; failed provisioning diagnostics 30 days; AI raw messages 90 days unless the customer keeps them; unconfirmed memory facts 90 days; inactive public-form submissions 24 months; billing records according to applicable accounting law.

Contact deletion should anonymize direct identifiers while preserving aggregate commercial totals where required. Workspace deletion must create an auditable request, revoke access immediately, stop integrations, then delete workspace-scoped rows and files after a cooling-off period. Backups expire on the infrastructure schedule and are not selectively rewritten; restored data must re-enter the deletion queue.

The migration creates an auditable request table but no destructive worker. This is intentionally not operational until staging tests, authorization review and backup/restore verification are complete.
# Exécution durable des demandes

Les demandes sont persistées dans `privacy_requests`, puis exécutées depuis `privacy_request_jobs` par `/api/privacy-worker`. La prise d’un job utilise `FOR UPDATE SKIP LOCKED`, un verrou daté et une clé d’idempotence. Un job bloqué depuis plus de quinze minutes peut être repris, avec cinq tentatives maximum et un délai exponentiel.

Une demande ne passe à `completed` qu’après une lecture de contrôle des ressources concernées. Les résultats partiels restent `partially_completed` avec un code non sensible. Les opérations destructrices exigent le statut `verification_required`, puis une approbation explicite par un propriétaire ou administrateur.

Les exports sont conservés sept jours au maximum dans `privacy_exports`. Le worker supprime leur charge utile après expiration. Les paramètres de connexion, tokens, secrets, mots de passe et clés ne sont jamais inclus dans un export.

La fermeture d’un workspace retire d’abord les objets Storage connus, révoque les sessions, efface les secrets locaux des connexions, supprime les exports, puis supprime le workspace et vérifie l’absence de lignes résiduelles. La demande et son résultat restent conservés sans dépendance destructive au workspace supprimé.

La suppression d’un utilisateur Auth est optionnelle et n’est tentée que si la demande le prévoit explicitement et si aucun autre membership actif ne subsiste. Les documents de facturation ou éléments soumis à une obligation de conservation ne doivent pas être supprimés sans politique juridique validée.

Cette implémentation fournit des mécanismes techniques. Elle ne constitue pas une garantie de conformité juridique complète.
