import { Stack } from "expo-router";
import Head from "expo-router/head";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";

import { MediaCard } from "@/components/MediaCard";
import { MediaFilters } from "@/components/MediaFilters";
import { Pagination } from "@/components/Pagination";
import { useColumns } from "@/hooks/useColumns";
import { useMediaFilters } from "@/hooks/useMediaFilters";
import { useMedias } from "@/hooks/useMedias";

export default function Catalogue() {
  const { search, setSearch, type, setType, page, setPage, params } = useMediaFilters();
  const { medias, totalPages, loading, error } = useMedias(params);
  const columns = useColumns();

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Catalogue" }} />
      <Head>
        <title>Catalogue · Cosmos Gallery</title>
      </Head>
      <MediaFilters search={search} onSearchChange={setSearch} type={type} onTypeChange={setType} />

      {loading ? (
        <ActivityIndicator style={styles.center} size="large" />
      ) : error ? (
        <Text style={[styles.center, styles.error]}>{error}</Text>
      ) : (
        <FlatList
          key={columns}
          data={medias}
          numColumns={columns}
          keyExtractor={(media) => `${media.source}:${media.id}`}
          contentContainerStyle={styles.list}
          columnWrapperStyle={columns > 1 ? styles.row : undefined}
          renderItem={({ item }) => (
            <View style={columns > 1 ? { flex: 1, maxWidth: `${100 / columns}%` } : undefined}>
              <MediaCard media={item} variant={columns > 1 ? "grid" : "list"} />
            </View>
          )}
          ListFooterComponent={<Pagination page={page} totalPages={totalPages} onChange={setPage} />}
          ListEmptyComponent={<Text style={styles.empty}>Aucun média ne correspond aux filtres.</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f5f7",
  },
  center: {
    marginTop: 40,
    alignSelf: "center",
  },
  error: {
    color: "#c62828",
  },
  list: {
    paddingHorizontal: 12,
    paddingBottom: 24,
    gap: 12,
  },
  row: {
    gap: 12,
  },
  empty: {
    textAlign: "center",
    marginTop: 40,
    color: "#666",
  },
});
