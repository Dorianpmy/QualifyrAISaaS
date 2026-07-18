# Manifestes métier

Les manifestes sont définis dans `autopilot-engine.js`. Un manifeste contient une version sémantique, un niveau de maturité, les modules requis, le pipeline, le formulaire, le tableau de bord, l’assistant en mode sûr et uniquement des automatisations internes.

- `artisan` et `generic` : `production_ready`.
- `services`, `telecom`, `real_estate` : `beta`.

Une montée de version doit produire un diff, préserver les données commerciales et les personnalisations, puis demander confirmation avant application. Changer de pack ne supprime jamais les contacts, opportunités, tâches, documents, contenus ou historiques.
