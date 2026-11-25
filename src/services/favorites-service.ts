import { randomUUID } from "expo-crypto";
import {
  collection,
  deleteDoc,
  doc,
  type DocumentData,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";

import type { Favorite } from "@/models/favorite";
import type { Media } from "@/models/media";
import { db } from "@/services/firebase";

function favoritesOf(uid: string) {
  return collection(db, "users", uid, "favorites");
}

function toMillis(date: Date): number | null {
  const time = date.getTime();
  return Number.isNaN(time) ? null : time;
}

function mediaToDocument(media: Media) {
  return {
    id: media.id,
    source: media.source,
    name: media.name,
    type: media.type,
    size: media.size,
    path: media.path,
    thumbnail: media.thumbnail,
    author_id: media.author_id,
    credit: media.credit,
    created_at: toMillis(media.created_at),
    updated_at: toMillis(media.updated_at),
  };
}

function toFavorite(id: string, data: DocumentData): Favorite {
  const media = data.media ?? {};
  const createdAt: number = data.createdAt ?? 0;
  const createdMs = typeof media.created_at === "number" ? media.created_at : createdAt;
  const updatedMs = typeof media.updated_at === "number" ? media.updated_at : createdMs;
  return {
    id,
    note: data.note ?? "",
    createdAt,
    media: {
      id: media.id ?? "",
      source: media.source ?? "nasa",
      name: media.name ?? "",
      type: media.type ?? "image",
      size: media.size ?? null,
      path: media.path ?? "",
      thumbnail: media.thumbnail ?? null,
      author_id: media.author_id ?? null,
      credit: media.credit ?? null,
      created_at: new Date(createdMs),
      updated_at: new Date(updatedMs),
    },
  };
}

export function subscribeToFavorites(uid: string, onChange: (favorites: Favorite[]) => void, onError: () => void) {
  const favoritesQuery = query(favoritesOf(uid), orderBy("createdAt", "desc"));
  return onSnapshot(
    favoritesQuery,
    (snapshot) => onChange(snapshot.docs.map((d) => toFavorite(d.id, d.data()))),
    onError,
  );
}

export async function addFavorite(uid: string, media: Media) {
  await setDoc(doc(favoritesOf(uid), randomUUID()), {
    media: mediaToDocument(media),
    note: "",
    createdAt: Date.now(),
  });
}

export async function updateFavoriteNote(uid: string, favoriteId: string, note: string) {
  await updateDoc(doc(favoritesOf(uid), favoriteId), { note });
}

export async function removeFavorite(uid: string, favoriteId: string) {
  await deleteDoc(doc(favoritesOf(uid), favoriteId));
}
