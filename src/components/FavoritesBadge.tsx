import { Text, StyleSheet } from "react-native";
import { useFavorites } from "@/hooks/useFavorites";

// Lit l'état global sans recevoir de props
export function FavoritesBadge() {
  const { favoriteIds } = useFavorites();
  return <Text style={styles.badge}>★ {favoriteIds.length} favoris</Text>;
}

const styles = StyleSheet.create({
  badge: {
    fontWeight: "bold",
    marginHorizontal: 12,
  },
});
