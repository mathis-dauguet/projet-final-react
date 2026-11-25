import {
  collection,
  doc,
  type DocumentData,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  type QueryConstraint,
  type QueryDocumentSnapshot,
  serverTimestamp,
  setDoc,
  startAfter,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";

import { MEDIA_NAME_MAX, MEDIA_NAME_MIN } from "@/constants/media-rules";
import type { Media } from "@/models/media";
import { db } from "@/services/firebase";

// Médias publiés par les photographes (source "user"), stockés dans la collection "medias".
// Les fichiers sont sur le serveur : Firestore ne garde que leurs URLs (path, thumbnail).

const PAGE_SIZE = 24;

const mediasCollection = collection(db, "medias");

// Champs fournis à la création ; source, credit et les dates sont remplis ici
export type NewMedia = Pick<Media, "name" | "type" | "size" | "path" | "thumbnail" | "author_id">;

// Champs modifiables ; id, source, author_id et created_at ne le sont jamais
export type MediaChanges = Partial<Pick<Media, "name" | "type" | "size" | "path" | "thumbnail">>;

export interface MediaPage {
  medias: Media[];
  // À repasser à la fonction de liste pour obtenir la page suivante ; null s'il n'y en a plus
  cursor: QueryDocumentSnapshot | null;
}

export interface ListOptions {
  authorId?: string;
  includeDeleted?: boolean;
  cursor?: QueryDocumentSnapshot | null;
}

// Juste après un serverTimestamp(), la date peut encore être absente en local
function toDate(value: unknown): Date {
  return value instanceof Timestamp ? value.toDate() : new Date();
}

function toMedia(id: string, data: DocumentData): Media {
  return {
    id,
    source: "user",
    name: data.name,
    type: data.type,
    size: data.size ?? null,
    path: data.path,
    thumbnail: data.thumbnail ?? null,
    author_id: data.author_id,
    credit: null,
    created_at: toDate(data.created_at),
    updated_at: toDate(data.updated_at),
    deleted_at: data.deleted_at ? toDate(data.deleted_at) : null,
  };
}

// Titre nettoyé des espaces, entre 3 et 100 caractères
export function normalizeMediaName(name: string): string {
  const trimmed = name.trim();
  if (trimmed.length < MEDIA_NAME_MIN || trimmed.length > MEDIA_NAME_MAX) {
    throw new Error(`Le titre doit contenir entre ${MEDIA_NAME_MIN} et ${MEDIA_NAME_MAX} caractères.`);
  }
  return trimmed;
}

// L'id est réservé avant l'envoi du fichier : il sert au chemin uploads/medias/{author_id}/{id}/
export function newMediaId(): string {
  return doc(mediasCollection).id;
}

export async function createMedia(id: string, media: NewMedia): Promise<void> {
  await setDoc(doc(mediasCollection, id), {
    ...media,
    name: normalizeMediaName(media.name),
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
    deleted_at: null,
  });
}

// Renvoie aussi un média supprimé : c'est à l'écran de décider s'il l'affiche (admin) ou non
export async function getMedia(id: string): Promise<Media | null> {
  const snapshot = await getDoc(doc(mediasCollection, id));
  return snapshot.exists() ? toMedia(snapshot.id, snapshot.data()) : null;
}

// Du plus récent au plus ancien, par pages. Sans includeDeleted, les médias supprimés sont exclus.
export async function listMedias({ authorId, includeDeleted = false, cursor = null }: ListOptions = {}): Promise<MediaPage> {
  const constraints: QueryConstraint[] = [];
  if (authorId) constraints.push(where("author_id", "==", authorId));
  if (!includeDeleted) constraints.push(where("deleted_at", "==", null));
  constraints.push(orderBy("created_at", "desc"));
  if (cursor) constraints.push(startAfter(cursor));
  constraints.push(limit(PAGE_SIZE));

  const snapshot = await getDocs(query(mediasCollection, ...constraints));
  const last = snapshot.docs[snapshot.docs.length - 1];

  return {
    medias: snapshot.docs.map((d) => toMedia(d.id, d.data())),
    cursor: snapshot.docs.length === PAGE_SIZE ? last : null,
  };
}

export async function updateMedia(id: string, changes: MediaChanges): Promise<void> {
  await updateDoc(doc(mediasCollection, id), {
    ...changes,
    ...(changes.name !== undefined && { name: normalizeMediaName(changes.name) }),
    updated_at: serverTimestamp(),
  });
}

// Suppression logique : le document et le fichier sont conservés
export async function deleteMedia(id: string): Promise<void> {
  await updateDoc(doc(mediasCollection, id), {
    deleted_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  });
}

// Réservé à l'admin (vérifié par l'écran et par les règles Firestore)
export async function restoreMedia(id: string): Promise<void> {
  await updateDoc(doc(mediasCollection, id), {
    deleted_at: null,
    updated_at: serverTimestamp(),
  });
}
