import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";

import { Album } from "@/models/album";

type AlbumCardProps = {
  album: Album;
};

const priceFormatter = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
});

export function AlbumCard({ album }: AlbumCardProps) {
  return (
    <View style={styles.card}>
      <Image source={album.coverUrl} style={styles.cover} alt={album.title} />
      <Text style={styles.genre}>{album.genre}</Text>
      <Text style={styles.title}>{album.title}</Text>
      <Text style={styles.subtitle}>
        {album.artist} · {album.year}
      </Text>
      <Text style={styles.price}>{priceFormatter.format(album.price)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#fff",
    gap: 4,
    flex: 1,
  },
  cover: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 8,
    marginBottom: 8,
  },
  genre: {
    fontSize: 12,
    textTransform: "uppercase",
    color: "#888",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 14,
    color: "#555",
  },
  price: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 4,
  },
});
