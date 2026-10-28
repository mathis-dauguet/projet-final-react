import { FlatList, StyleSheet } from "react-native";
import { AlbumCard } from "@/components/album-card";
import { ALBUMS } from "@/data/albums";
import { useColumns } from "@/hooks/use-columns";

export default function Index() {
  const columns = useColumns();

  return (
    <FlatList
      key={columns}
      data={ALBUMS}
      keyExtractor={(album) => album.id}
      renderItem={({ item }) => <AlbumCard album={item} />}
      numColumns={columns}
      columnWrapperStyle={columns > 1 ? styles.row : undefined}
      contentContainerStyle={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    maxWidth: 1280,
    alignSelf: "center",
    gap: 12,
    padding: 12,
  },
  row: {
    gap: 12,
  },
});
