# Règles de gestion — Utilisateurs

Propriétaire : **Allan** (partie C)

> À compléter par Allan. Les règles ci-dessous ont déjà été décidées en équipe ou découlent des autres CRUD : elles servent de point de départ.

## Déjà décidées

| Règle | Description |
|---|---|
| RG-USR-01 | À l'inscription, l'utilisateur choisit son rôle : `user` ou `photographer`. |
| RG-USR-02 | Le rôle `admin` ne peut pas être choisi à l'inscription. Seul un admin peut le donner. |
| RG-USR-03 | Le premier admin est créé à la main dans la console Firebase. |
| RG-USR-04 | Le mot de passe est géré par Firebase Auth et n'est jamais stocké dans Firestore. |
| RG-USR-05 | L'admin gère les utilisateurs : il peut changer un rôle et supprimer un compte. |

## Implémentées (rôles `user` et `admin`)

| Règle | Description |
|---|---|
| RG-USR-06 | Chaque compte a un profil Firestore `users/{uid}` (`email`, `name`, `role`, `created_at`, `updated_at`, `deleted_at`). Un compte sans profil reçoit un profil `user` à sa prochaine connexion. |
| RG-USR-07 | L'admin gère les comptes depuis `/admin/users` : création (e-mail, mot de passe provisoire, nom, rôle), modification du nom et du rôle, suppression, restauration. |
| RG-USR-08 | L'e-mail et le mot de passe d'un compte existant ne sont pas modifiables par l'admin (gérés par Firebase Auth côté utilisateur). |
| RG-USR-10 | La suppression d'un compte est logique (`deleted_at`) : le compte ne peut plus se connecter et peut être restauré. |
| RG-USR-12 | Un admin ne peut ni modifier son propre rôle, ni supprimer son propre compte. Le dernier admin actif ne peut pas être rétrogradé ni supprimé. |

Les règles Firestore correspondantes sont dans [`firestore.rules`](../../firestore.rules).

## À valider

| Règle | Description |
|---|---|
| RG-USR-11 | Les médias d'un photographe dont le compte est supprimé sont masqués, et réapparaissent si le compte est restauré (voir RG-MED-43). |

## Questions ouvertes

- Un utilisateur peut-il changer lui-même de rôle après l'inscription (passer de `user` à `photographer`) ?
- Quels champs l'utilisateur peut-il modifier sur son profil (nom, e-mail) ?
- Contraintes sur le nom (longueur, unicité) ?
