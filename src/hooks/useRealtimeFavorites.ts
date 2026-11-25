import { useEffect, useState } from "react";

import type { Favorite } from "@/models/favorite";
import { subscribeToFavorites } from "@/services/favorites-service";

export type FavoritesState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; favorites: Favorite[] };

export function useRealtimeFavorites(uid: string | null): FavoritesState {
  const [result, setResult] = useState<{ uid: string; state: FavoritesState } | null>(null);

  useEffect(() => {
    if (!uid) return;
    const unsubscribe = subscribeToFavorites(
      uid,
      (favorites) => setResult({ uid, state: { status: "success", favorites } }),
      () => setResult({ uid, state: { status: "error", message: "Favoris indisponibles" } }),
    );
    return unsubscribe;
  }, [uid]);

  return result !== null && result.uid === uid ? result.state : { status: "loading" };
}
