# Architecture

## Organisation du code

Tout le code est dans `src/`. Seul `src/app/` contient des écrans : chaque fichier y est une route Expo Router.

| Dossier | Contenu | Exemple |
|---|---|---|
| `app/` | Écrans et layouts (routes Expo Router) | `catalogue.tsx`, `favoris.tsx`, `_layout.tsx` |
| `components/` | Composants d'interface réutilisables | `MediaCard`, `MediaFilters`, `Pagination` |
| `hooks/` | Logique réutilisable (état, appels, responsive) | `useMedias`, `useMediaFilters`, `useColumns` |
| `context/` | État global partagé par toute l'app | `FavoritesContext` |
| `services/` | Accès aux données externes (API, Firebase) | `nasa.ts` |
| `models/` | Types TypeScript des données | `Media`, `User` |
| `data/` | Données fictives (service factice du TP2) | `medias.ts` |
| `constants/` | Valeurs partagées | `theme.ts` (couleurs) |

`src/firebase.ts` initialise Firebase (Auth, Firestore) à partir des variables `EXPO_PUBLIC_FIREBASE_*`.

## Deux sources de médias

| | NASA | Communauté |
|---|---|---|
| `source` | `"nasa"` | `"user"` |
| Stockage | Aucun : appel en direct à `images-api.nasa.gov` | Firestore (données) + serveur de l'app (fichiers) |
| Modifiable | Non | Oui, par l'auteur et les admins |
| `author_id` | `null` | id de l'utilisateur qui a publié |
| `credit` | photographe ou centre NASA | `null` |

Notre base ne stocke que ce que produisent nos utilisateurs : comptes et médias publiés.

## Flux de l'écran catalogue

```
MediaFilters (saisie)
      │
useMediaFilters ── recherche texte (avec un délai de 400 ms) + type + page
      │              → params pour l'API, page remise à 1 si un filtre change
      ▼
useMedias ───────── appelle services/nasa.ts → searchMedias(params)
      │              annule la requête précédente si les params changent
      ▼
catalogue.tsx ───── chargement / erreur / liste
                    FlatList en grille (3–4 colonnes) ou en liste (1 colonne) selon useColumns
                    Pagination sous la liste
```

`services/nasa.ts` vérifie `response.ok`, type la réponse de l'API et convertit chaque résultat en `Media`.
