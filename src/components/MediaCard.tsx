import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";

import type { Media, MediaType } from "@/models/media";

export const TYPE_LABELS: Record<MediaType, string> = {
  image: "Image",
  video: "Vidéo",
  audio: "Audio",
};

interface Props {
  media: Media;
  variant: "grid" | "list";
}

export function MediaCard({ media, variant }: Props) {
  const isList = variant === "list";

  return (
    <View style={[styles.card, isList && styles.cardList]}>
      {media.thumbnail ? (
        <Image
          source={media.thumbnail}
          style={isList ? styles.thumbnailList : styles.thumbnailGrid}
          contentFit="cover"
          transition={200}
        />
      ) : (
        <View style={[isList ? styles.thumbnailList : styles.thumbnailGrid, styles.placeholder]}>
          <Text style={styles.placeholderText}>{TYPE_LABELS[media.type]}</Text>
        </View>
      )}
      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={2}>
          {media.name}
        </Text>
        <Text style={styles.meta} numberOfLines={1}>
          {TYPE_LABELS[media.type]} · {media.author_id}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#ddd",
  },
  cardList: {
    flexDirection: "row",
    alignItems: "center",
  },
  thumbnailGrid: {
    width: "100%",
    aspectRatio: 4 / 3,
  },
  thumbnailList: {
    width: 88,
    height: 88,
  },
  placeholder: {
    backgroundColor: "#0b3d91",
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderText: {
    color: "#fff",
    fontWeight: "600",
  },
  body: {
    flex: 1,
    padding: 10,
    gap: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
  },
  meta: {
    fontSize: 13,
    color: "#666",
  },
});
