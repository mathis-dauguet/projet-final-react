import { Text, View, StyleSheet } from "react-native";
import { AlbumCard } from "@/components/album-card";
import { ALBUMS } from "@/data/albums";

export default function Index() {
  return (
    <View style={styles.container}>
      {ALBUMS.map((album) => (
        <AlbumCard key={album.id} album={album} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    padding: 12,
  },
});
