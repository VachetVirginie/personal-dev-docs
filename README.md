# DevDocs - Documentation Personnelle

Une application web moderne pour gérer votre documentation personnelle et suivre vos activités d'apprentissage.

## Fonctionnalités

- **Gestion de documents** : Créez, modifiez et organisez vos notes et documents techniques
- **Support Markdown** : Écrivez vos documents en Markdown avec prévisualisation en temps réel
- **Tags et recherche** : Organisez vos documents avec des tags et retrouvez-les facilement
- **Tracker d'activités** : Suivez vos activités quotidiennes (comme la programmation, la lecture, etc.)
- **Interface moderne** : Design responsive et esthétique pour une expérience utilisateur agréable

## Technologies utilisées

- Vue.js 3 avec Composition API
- TypeScript
- Pinia pour la gestion d'état
- Marked pour le rendu Markdown
- Highlight.js pour la coloration syntaxique
- Date-fns pour la manipulation des dates

## Installation

```sh
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Compiler pour la production
npm run build
```

## Stockage des données

Les données sont actuellement stockées dans le localStorage du navigateur. Pour une persistance plus robuste, vous pouvez :

1. Utiliser une base de données locale comme IndexedDB
2. Intégrer un backend avec une API REST
3. Utiliser des services de stockage cloud

## Personnalisation

Vous pouvez personnaliser l'application en modifiant :

- Les types d'activités dans le tracker
- Les styles et thèmes de l'interface
- Les formats de date et autres préférences locales

## Licence

MIT
