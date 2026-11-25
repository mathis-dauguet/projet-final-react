import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";

import { FavoriteButton } from "@/components/FavoriteButton";
import { COLORS, RADIUS } from "@/constants/theme";
import { useAuth } from "@/hooks/useAuth";
import type { Media, MediaType } from "@/models/media";

export const TYPE_LABELS: Record<MediaType, string> = {
  image: "Image",
  video: "Vidéo",
  audio: "Audio",
};

const DATE_FORMAT = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", year: "numeric" });

interface Props {
  media: Media;
  variant: "grid" | "list";
}

export function MediaCard({ media, variant }: Props) {
  const { user } = useAuth();
  const isList = variant === "list";
  const thumbnailStyle = isList ? styles.thumbnailList : styles.thumbnailGrid;

  return (
    <View style={[styles.card, isList && styles.cardList]}>
      {media.thumbnail ? (
        <Image source={media.thumbnail} style={thumbnailStyle} contentFit="cover" transition={200} />
      ) : (
        <View style={[thumbnailStyle, styles.placeholder]}>
          <Text style={styles.placeholderText}>{TYPE_LABELS[media.type]}</Text>
        </View>
      )}
      <View style={styles.body}>
        <View style={styles.titleRow}>
          <Text style={[styles.title, !isList && styles.titleGrid]} numberOfLines={2}>
            {media.name}
          </Text>
          {user && <FavoriteButton media={media} />}
        </View>
        <Text style={styles.credit} numberOfLines={1}>
          {media.credit ?? TYPE_LABELS[media.type]}
        </Text>
        <Text style={styles.date}>
          {DATE_FORMAT.format(media.created_at)} · {TYPE_LABELS[media.type]}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardList: {
    flexDirection: "row",
    alignItems: "center",
  },
  thumbnailGrid: {
    width: "100%",
    aspectRatio: 310 / 190,
  },
  thumbnailList: {
    width: 96,
    height: 96,
  },
  placeholder: {
    backgroundColor: COLORS.placeholder,
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderText: {
    color: COLORS.text,
    fontWeight: "600",
  },
  body: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 4,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  title: {
    flex: 1,
    color: COLORS.text,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "600",
  },
  titleGrid: {
    minHeight: 40, // toujours 2 lignes réservées : cartes de même hauteur dans la grille
  },
  credit: {
    color: COLORS.muted,
    fontSize: 13,
  },
  date: {
    color: COLORS.muted,
    fontSize: 12,
    opacity: 0.8,
  },
});
