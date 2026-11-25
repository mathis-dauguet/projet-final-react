# Cosmos Gallery

Catalogue de médias (photos, vidéos, sons) qui réunit la **NASA Image and Video Library** et les publications des photographes de l'application.

Les visiteurs consultent le catalogue librement. Une fois connectés, ils peuvent mettre des médias en favoris. Les photographes publient leurs propres médias, et les administrateurs gèrent l'application.

## Membres et parties

| Partie | Propriétaire | Contenu |
|---|---|---|
| A | Adrien Leclere | Modèles, service API NASA, catalogue (filtres, pagination, grille/liste), **CRUD Médias** |
| B | Mathis Dauguet | CI (lint, déploiement), configuration Firebase, **Favoris** |
| C | Allan Decaux | Authentification, **CRUD Utilisateurs** |

Chaque membre commite sur sa propre partie, dans une branche par fonctionnalité.

## Fonctionnalités

- Recherche dans le catalogue NASA par mot-clé et par type de média (image, vidéo, audio), avec pagination
- Affichage en grille sur ordinateur et en liste sur téléphone
- Favoris partagés dans toute l'application (état global)
- Rôles `user`, `photographer` et `admin` : voir [_docs/roles-et-permissions.md](_docs/roles-et-permissions.md)

## Documentation

Toute la documentation est dans [`_docs/`](_docs/README.md) : architecture, rôles et règles de gestion de chaque CRUD.

## API utilisée

NASA Image and Video Library : `https://images-api.nasa.gov` (publique, sans clé)
- Documentation : https://images.nasa.gov/docs/images.nasa.gov_api_docs.pdf

## Démarrer

```bash
npm install
cp .env.example .env.local   # puis remplir les variables Firebase
npm start                    # ou : npm run web
```

| Variable | Rôle |
|---|---|
| `EXPO_PUBLIC_FIREBASE_*` | Configuration du projet Firebase (console Firebase → Paramètres du projet → app Web) |
| `NASA_KEY` | Inutilisée pour l'instant : seulement nécessaire pour les API de `api.nasa.gov` (APOD, NeoWs…) |

## Vérifications avant de pousser

```bash
npx tsc --noEmit   # typage
npm run lint       # lint (aussi lancé par la CI)
```

## Stack

Expo SDK 58, React Native, Expo Router, TypeScript, Firebase (Auth, Firestore), serveur Express (fichiers des médias publiés).
