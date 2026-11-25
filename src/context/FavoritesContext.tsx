import { createContext, useState, type ReactNode } from "react";
import type { Media } from "@/models/media";

// Ce que le Context partage : les médias favoris et des fonctions pour les lire/modifier
export type FavoritesContextValue = {
  favorites: Media[];
  isFavorite: (media: Media) => boolean;
  toggleFavorite: (media: Media) => void;
};

// null par défaut : permet au hook de détecter qu'on est hors du Provider
export const FavoritesContext = createContext<FavoritesContextValue | null>(null);

// Un média est identifié par sa source + son id (comme la keyExtractor du catalogue)
function sameMedia(a: Media, b: Media) {
  return a.source === b.source && a.id === b.id;
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Media[]>([]);

  function isFavorite(media: Media) {
    return favorites.some((f) => sameMedia(f, media));
  }

  function toggleFavorite(media: Media) {
    setFavorites((list) =>
      list.some((f) => sameMedia(f, media))
        ? list.filter((f) => !sameMedia(f, media))
        : [...list, media]
    );
  }

  return (
    <FavoritesContext.Provider value={{ favorites, isFavorite, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}
