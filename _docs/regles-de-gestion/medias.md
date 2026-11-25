# Règles de gestion — Médias

Propriétaire : **Adrien** (partie A)

Ces règles concernent les médias **publiés par les photographes** (`source: "user"`), dont les informations sont dans Firestore et les fichiers sur le serveur de l'application. Les médias de la NASA (`source: "nasa"`) sont lus en direct depuis l'API et ne sont jamais copiés en base.

## Identité d'un média

| Règle | Description |
|---|---|
| RG-MED-01 | Un média est identifié par le couple **`source` + `id`** (clé `${source}:${id}`), jamais par son `id` seul : un id NASA et un id Firestore pourraient coïncider. |
| RG-MED-02 | Les médias NASA sont en lecture seule : personne ne peut les modifier ni les supprimer. |

## Créer (publier)

| Règle | Description |
|---|---|
| RG-MED-10 | Seul un utilisateur connecté avec le rôle `photographer` peut publier. Un visiteur, un `user` ou un `admin` ne le peuvent pas. |
| RG-MED-11 | Types acceptés : `image`, `video`, `audio`. |
| RG-MED-12 | Taille maximale du fichier : **image 10 Mo**, **audio 20 Mo**, **vidéo 100 Mo**. Le fichier est refusé avant l'envoi s'il dépasse la limite. |
| RG-MED-13 | Formats acceptés : JPEG, PNG, WebP pour les images ; MP4 pour les vidéos ; MP3, M4A pour les sons. Les formats HEIC et MOV de l'iPhone ne sont pas acceptés. |
| RG-MED-14 | Le titre (`name`) est obligatoire, entre 3 et 100 caractères, espaces de début et de fin retirés. |
| RG-MED-15 | Le fichier est envoyé sur le serveur de l'application, dans `uploads/medias/{author_id}/{media_id}/`. `path` contient son URL publique. Le serveur refuse l'envoi si l'utilisateur n'est pas un `photographer` authentifié. |
| RG-MED-16 | Une vignette est générée à l'envoi : version réduite pour une image, image extraite pour une vidéo, aucune pour un son (`thumbnail: null`). |
| RG-MED-17 | Les champs suivants sont remplis automatiquement et ne sont jamais saisis par l'utilisateur : `source = "user"`, `author_id` = id de l'utilisateur connecté, `credit = null`, `size` = taille du fichier, `type` = déduit du fichier, `created_at` et `updated_at` = date du serveur. |
| RG-MED-18 | Le média est **publié immédiatement**, sans validation préalable par un admin. |

## Lire (consulter)

| Règle | Description |
|---|---|
| RG-MED-20 | Les médias de la communauté sont visibles par **tout le monde**, y compris les visiteurs non connectés. |
| RG-MED-21 | Ils apparaissent à trois endroits : dans le **catalogue** (avec les médias NASA, filtrables par source), dans la page **« Mes médias »** du photographe connecté, et sur la **page profil** de chaque photographe. |
| RG-MED-22 | Un média supprimé (`deleted_at` renseigné) n'apparaît nulle part. |
| RG-MED-23 | Un média dont l'auteur a un compte supprimé n'apparaît nulle part (voir RG-MED-43). |

## Modifier

| Règle | Description |
|---|---|
| RG-MED-30 | Peuvent modifier un média : **son auteur** (`author_id` = utilisateur connecté) et **les admins**. |
| RG-MED-31 | Champs modifiables : le titre (`name`, mêmes contraintes que RG-MED-14) et le **fichier**. |
| RG-MED-32 | Remplacer le fichier applique les mêmes règles qu'à la création (RG-MED-11 à RG-MED-13). L'ancien fichier et son ancienne vignette sont supprimés du serveur ; `path`, `thumbnail`, `size` et `type` sont recalculés. |
| RG-MED-33 | Champs jamais modifiables : `id`, `source`, `author_id`, `created_at`. |
| RG-MED-34 | Toute modification met à jour `updated_at`. |

## Supprimer

| Règle | Description |
|---|---|
| RG-MED-40 | Peuvent supprimer un média : **son auteur** et **les admins**. |
| RG-MED-41 | Une **fenêtre modale de confirmation** s'affiche avant toute suppression. |
| RG-MED-42 | La suppression est **logique** : `deleted_at` reçoit la date de suppression. Le document Firestore et le fichier sur le serveur sont conservés. |
| RG-MED-43 | Si le compte de l'auteur est supprimé, ses médias sont masqués avec lui, et réapparaissent si le compte est restauré. **(à confirmer avec Allan)** |
| RG-MED-45 | Seul un admin peut restaurer un média supprimé (remettre `deleted_at` à `null`). |

## Favoris sur un média

| Règle | Description |
|---|---|
| RG-MED-50 | Les rôles `user` et `photographer` peuvent mettre en favori **n'importe quel média**, NASA ou communauté, y compris les leurs. |
| RG-MED-51 | Un favori référence un média par `source` + `id` (RG-MED-01). |

## Impacts techniques

À faire dans la branche du CRUD Médias :

- modèle `Media` : ajouter `deleted_at: Date | null` (RG-MED-42) ;
- serveur (`server.mts`) : une route d'envoi qui vérifie le jeton Firebase et le rôle, et une route qui sert les fichiers envoyés ;
- déploiement : un **volume Docker** pour le dossier `uploads/`, sinon les fichiers sont perdus à chaque redéploiement, et une limite de taille d'envoi d'au moins 100 Mo sur le serveur et le reverse proxy ;
- app : une variable `EXPO_PUBLIC_API_URL` avec l'adresse du serveur.
