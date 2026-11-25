import { useContext } from "react";
import { FavoritesContext } from "@/context/FavoritesContext";

// Hook d'accès au Context des favoris
export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites doit être utilisé dans un FavoritesProvider");
  }
  return context;
}
