import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { COLORS } from "@/constants/theme";
import { useFavorites } from "@/hooks/useFavorites";
import type { Media } from "@/models/media";

export function FavoriteButton({ media }: { media: Media }) {
  const { isFavorite, isPending, toggleFavorite } = useFavorites();
  const [failed, setFailed] = useState(false);
  const active = isFavorite(media);
  const pending = isPending(media);

  const toggle = async () => {
    setFailed(false);
    try {
      await toggleFavorite(media);
    } catch {
      setFailed(true);
    }
  };

  return (
    <View style={styles.row}>
      {failed && <Text style={styles.error}>Échec</Text>}
      <Pressable
        onPress={toggle}
        disabled={pending}
        accessibilityLabel={active ? "Retirer des favoris" : "Ajouter aux favoris"}
        style={pending && styles.pending}
      >
        <Text style={[styles.star, { color: active ? COLORS.accent : COLORS.muted }]}>{active ? "★" : "☆"}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 6 },
  star: { fontSize: 22 },
  pending: { opacity: 0.4 },
  error: { color: COLORS.danger, fontSize: 12 },
});
