import { Pressable, Text } from "react-native";
import { useFavorites } from "@/hooks/useFavorites";

// Bouton étoile à mettre dans la carte d'un média (partie A)
export function FavoriteButton({ mediaId }: { mediaId: string }) {
  const { favoriteIds, toggleFavorite } = useFavorites();
  const isFavorite = favoriteIds.includes(mediaId);

  return (
    <Pressable onPress={() => toggleFavorite(mediaId)}>
      <Text style={{ fontSize: 24 }}>{isFavorite ? "★" : "☆"}</Text>
    </Pressable>
  );
}
