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

## À valider

| Règle | Description |
|---|---|
| RG-USR-10 | La suppression d'un compte est logique (`deleted_at`), comme le prévoit le modèle `User`. |
| RG-USR-11 | Les médias d'un photographe dont le compte est supprimé sont masqués, et réapparaissent si le compte est restauré (voir RG-MED-43). |
| RG-USR-12 | Un admin ne peut pas se retirer le rôle admin ni supprimer son compte s'il est le dernier admin. |

## Questions ouvertes

- Un utilisateur peut-il changer lui-même de rôle après l'inscription (passer de `user` à `photographer`) ?
- Quels champs l'utilisateur peut-il modifier sur son profil (nom, e-mail) ?
- Contraintes sur le nom (longueur, unicité) ?
