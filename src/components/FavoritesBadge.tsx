import { Link } from "expo-router";
import { Text, StyleSheet } from "react-native";
import { COLORS } from "@/constants/theme";
import { useFavorites } from "@/hooks/useFavorites";

// Lit l'état global sans recevoir de props ; un appui ouvre l'écran des favoris
export function FavoritesBadge() {
  const { favorites } = useFavorites();
  return (
    <Link href="/favoris" style={styles.badge}>
      <Text style={styles.star}>★ </Text>
      <Text style={styles.text}>{favorites.length} favoris</Text>
    </Link>
  );
}

// Même style que le bouton « Connexion » de la maquette
const styles = StyleSheet.create({
  badge: {
    marginHorizontal: 12,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  star: {
    color: COLORS.accent,
  },
  text: {
    color: COLORS.text,
    fontWeight: "600",
  },
});
