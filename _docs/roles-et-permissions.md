# Rôles et permissions

Quatre profils existent : le **visiteur** (non connecté) et les trois rôles du modèle `User` (`user`, `photographer`, `admin`).

- **user** : consulte, met en favoris et commente.
- **photographer** : fait tout ce que fait un `user`, et publie ses propres médias.
- **admin** : gère l'application (médias, commentaires, utilisateurs). Il ne publie pas, ne commente pas et ne met pas en favoris.

## Tableau des permissions

| Action | Visiteur | user | photographer | admin |
|---|:-:|:-:|:-:|:-:|
| Consulter le catalogue (NASA + communauté) | ✅ | ✅ | ✅ | ✅ |
| Voir le profil d'un photographe | ✅ | ✅ | ✅ | ✅ |
| Mettre un média en favori | ❌ | ✅ | ✅ | ❌ |
| Commenter et noter un média | ❌ | ✅ | ✅ | ❌ |
| Publier un média | ❌ | ❌ | ✅ | ❌ |
| Modifier / supprimer **ses** médias | ❌ | ❌ | ✅ | — |
| Modifier / supprimer **n'importe quel** média de la communauté | ❌ | ❌ | ❌ | ✅ |
| Gérer les commentaires (modération) | ❌ | ❌ | ❌ | ✅ |
| Gérer les utilisateurs (rôles, suppression) | ❌ | ❌ | ❌ | ✅ |

Les médias de la NASA sont en **lecture seule pour tout le monde**, admin compris : ils ne sont pas stockés dans notre base.

## Attribution des rôles

- À l'inscription, l'utilisateur choisit `user` ou `photographer`.
- Le rôle `admin` ne peut pas être choisi à l'inscription : seul un admin peut le donner.
- Le premier admin est créé à la main dans la console Firebase.

Le détail est dans [regles-de-gestion/utilisateurs.md](regles-de-gestion/utilisateurs.md).

## Où sont appliquées ces règles

Une règle de permission doit être appliquée **à deux endroits** :

1. **Dans l'app** : on cache les boutons qu'un rôle ne peut pas utiliser. C'est du confort, pas de la sécurité.
2. **Côté données** : dans les Security Rules de Firestore, et dans les routes du serveur pour l'envoi de fichiers. C'est là que l'accès est réellement bloqué, car n'importe qui peut contourner l'app et appeler Firebase ou le serveur directement.
