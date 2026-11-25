import { Pressable, Text } from "react-native";
import { COLORS } from "@/constants/theme";
import { useFavorites } from "@/hooks/useFavorites";
import type { Media } from "@/models/media";

// Bouton étoile pour ajouter/retirer un média des favoris
export function FavoriteButton({ media }: { media: Media }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const active = isFavorite(media);

  return (
    <Pressable onPress={() => toggleFavorite(media)}>
      <Text style={{ fontSize: 22, color: active ? COLORS.accent : COLORS.muted }}>
        {active ? "★" : "☆"}
      </Text>
    </Pressable>
  );
}
