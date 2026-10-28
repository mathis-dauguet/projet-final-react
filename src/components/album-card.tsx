import { Image } from "expo-image";
import { ShoppingCartPlus } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useCart } from "@/context/cart-context";
import { Album } from "@/models/album";
import { formatPrice } from "@/utils/format-price";

type AlbumCardProps = {
  album: Album;
};

export function AlbumCard({ album }: AlbumCardProps) {
  const { addToCart } = useCart();

  return (
    <View style={styles.card}>
      <Image source={album.coverUrl} style={styles.cover} alt={album.title} />
      <Text style={styles.genre}>{album.genre}</Text>
      <Text style={styles.title}>{album.title}</Text>
      <Text style={styles.subtitle}>
        {album.artist} · {album.year}
      </Text>
      <View style={styles.footer}>
        <Text style={styles.price}>{formatPrice(album.price)}</Text>
        <Pressable
          onPress={() => addToCart(album)}
          disabled={!album.inStock}
          accessibilityLabel={`Ajouter ${album.title} au panier`}
          style={[styles.addButton, !album.inStock && styles.addButtonDisabled]}
        >
          <ShoppingCartPlus size={20} color="#fff" />
        </Pressable>
      </View>
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
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: "600",
  },
  addButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#111",
  },
  addButtonDisabled: {
    backgroundColor: "#ccc",
  },
});
