# Règles de gestion — Commentaires

Propriétaire : **Mathis** (partie B)

> À compléter par Mathis. Les règles ci-dessous ont déjà été décidées en équipe ou découlent des autres CRUD : elles servent de point de départ.

## Déjà décidées

| Règle | Description |
|---|---|
| RG-COM-01 | Seuls les rôles `user` et `photographer` connectés peuvent commenter. Un visiteur ou un admin ne le peuvent pas. |
| RG-COM-02 | On peut commenter n'importe quel média, NASA ou communauté. Le commentaire référence le média par `media_source` + `media_id`, sans copier le média en base. |
| RG-COM-03 | Un commentaire contient une description et une note (`rating`) de 1 à 5. |
| RG-COM-04 | L'admin gère les commentaires (modération). |

## À valider

| Règle | Description |
|---|---|
| RG-COM-10 | Un seul commentaire par utilisateur et par média : l'id du document est `{media_source}_{media_id}_{user_id}`. |
| RG-COM-11 | La suppression est logique (`deleted_at`), comme le prévoit le modèle `Comment`. |
| RG-COM-12 | Les commentaires d'un média supprimé sont masqués avec lui, et réapparaissent s'il est restauré (voir RG-MED-44). |

## Questions ouvertes

- L'auteur peut-il modifier son commentaire ? Supprimer son commentaire ?
- Contraintes sur la description (longueur minimale et maximale) ?
- Que voit-on d'un commentaire dont l'auteur a supprimé son compte ?
