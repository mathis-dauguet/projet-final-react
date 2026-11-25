import { createContext, useState, type ReactNode } from "react";

// Ce que le Context partage : la liste des ids favoris et une fonction pour ajouter/retirer
export type FavoritesContextValue = {
  favoriteIds: string[];
  toggleFavorite: (id: string) => void;
};

// null par défaut : permet au hook de détecter qu'on est hors du Provider
export const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  function toggleFavorite(id: string) {
    setFavoriteIds((ids) =>
      ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]
    );
  }

  return (
    <FavoritesContext.Provider value={{ favoriteIds, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}
