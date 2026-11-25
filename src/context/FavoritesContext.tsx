import { createContext, useRef, useState, type ReactNode } from "react";

import { useAuth } from "@/hooks/useAuth";
import { useRealtimeFavorites } from "@/hooks/useRealtimeFavorites";
import { type Favorite, mediaKey } from "@/models/favorite";
import type { Media } from "@/models/media";
import { addFavorite, removeFavorite, updateFavoriteNote } from "@/services/favorites-service";

export type FavoritesContextValue = {
  favorites: Favorite[];
  loading: boolean;
  error: string | null;
  isFavorite: (media: Media) => boolean;
  isPending: (media: Media) => boolean;
  noteOf: (media: Media) => string;
  toggleFavorite: (media: Media) => Promise<void>;
  updateNote: (media: Media, note: string) => Promise<void>;
};

export const FavoritesContext = createContext<FavoritesContextValue | null>(null);

function uniqueByMedia(list: Favorite[]): Favorite[] {
  const seen = new Set<string>();
  return list.filter((favorite) => {
    const key = mediaKey(favorite.media);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const state = useRealtimeFavorites(user ? user.uid : null);
  const all = user && state.status === "success" ? state.favorites : [];
  const favorites = uniqueByMedia(all);

  const pendingRef = useRef(new Set<string>());
  const [pending, setPending] = useState<ReadonlySet<string>>(new Set());
  const setPendingKey = (key: string, value: boolean) => {
    if (value) pendingRef.current.add(key);
    else pendingRef.current.delete(key);
    setPending(new Set(pendingRef.current));
  };

  const find = (media: Media) => favorites.find((f) => mediaKey(f.media) === mediaKey(media));
  const isFavorite = (media: Media) => find(media) !== undefined;
  const isPending = (media: Media) => pending.has(mediaKey(media));
  const noteOf = (media: Media) => find(media)?.note ?? "";

  const toggleFavorite = async (media: Media) => {
    if (!user) throw new Error("Connectez-vous pour gérer vos favoris");
    const key = mediaKey(media);
    if (pendingRef.current.has(key)) return;

    setPendingKey(key, true);
    try {
      const copies = all.filter((f) => mediaKey(f.media) === key);
      if (copies.length > 0) await Promise.all(copies.map((f) => removeFavorite(user.uid, f.id)));
      else await addFavorite(user.uid, media);
    } finally {
      setPendingKey(key, false);
    }
  };

  const updateNote = async (media: Media, note: string) => {
    if (!user) throw new Error("Connectez-vous pour annoter vos favoris");
    const favorite = find(media);
    if (!favorite) throw new Error("Ce média n'est plus dans vos favoris");
    await updateFavoriteNote(user.uid, favorite.id, note);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        loading: user !== null && state.status === "loading",
        error: user && state.status === "error" ? state.message : null,
        isFavorite,
        isPending,
        noteOf,
        toggleFavorite,
        updateNote,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}
