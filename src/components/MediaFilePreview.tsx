import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";

import { TYPE_LABELS } from "@/components/MediaCard";
import { COLORS, RADIUS } from "@/constants/theme";
import type { MediaType } from "@/models/media";

function formatSize(bytes: number | null): string {
  if (bytes === null) return "taille inconnue";
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}

interface Props {
  // Image à afficher : le fichier lui-même pour une image, la vignette sinon
  imageUri: string | null;
  type: MediaType;
  name: string;
  size: number | null;
  caption?: string;
}

export function MediaFilePreview({ imageUri, type, name, size, caption }: Props) {
  return (
    <View style={styles.preview}>
      {caption && <Text style={styles.caption}>{caption}</Text>}
      {imageUri ? (
        <Image source={imageUri} style={styles.image} contentFit="contain" />
      ) : (
        <View style={[styles.image, styles.placeholder]}>
          <Text style={styles.placeholderText}>{TYPE_LABELS[type]}</Text>
        </View>
      )}
      <Text style={styles.name} numberOfLines={1}>
        {name}
      </Text>
      <Text style={styles.meta}>
        {TYPE_LABELS[type]} · {formatSize(size)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  preview: {
    gap: 6,
    padding: 12,
    backgroundColor: COLORS.surfaceAlt,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
  },
  caption: { color: COLORS.muted, fontSize: 12 },
  image: { width: "100%", height: 240, borderRadius: RADIUS.sm },
  placeholder: { backgroundColor: COLORS.placeholder, alignItems: "center", justifyContent: "center" },
  placeholderText: { color: COLORS.text, fontWeight: "700", fontSize: 18 },
  name: { color: COLORS.text, fontWeight: "600" },
  meta: { color: COLORS.muted, fontSize: 13 },
});
