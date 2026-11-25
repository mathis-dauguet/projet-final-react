import { Stack } from "expo-router";
import Head from "expo-router/head";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";

import { HeaderActions } from "@/components/HeaderActions";
import { MediaCard } from "@/components/MediaCard";
import { MediaFilters } from "@/components/MediaFilters";
import { Pagination } from "@/components/Pagination";
import { COLORS, CONTENT_MAX_WIDTH } from "@/constants/theme";
import { useColumns } from "@/hooks/useColumns";
import { useMediaFilters } from "@/hooks/useMediaFilters";
import { useMedias } from "@/hooks/useMedias";

const COUNT_FORMAT = new Intl.NumberFormat("fr-FR");

export default function Catalogue() {
  const { search, setSearch, type, setType, page, setPage, params } = useMediaFilters();
  const { medias, totalPages, totalHits, loading, error } = useMedias(params);
  const columns = useColumns();

  const header = (
    <View style={styles.header}>
      <View style={styles.hero}>
        <Text style={styles.title}>Explorez l&apos;univers en images</Text>
        <Text style={styles.subtitle}>
          Le catalogue des médias de la NASA : recherchez par mot-clé ou par type de média.
        </Text>
      </View>
      <MediaFilters search={search} onSearchChange={setSearch} type={type} onTypeChange={setType} />
      {!loading && !error && (
        <View style={styles.resultsHeader}>
          <Text style={styles.count}>
            {COUNT_FORMAT.format(totalHits)} {totalHits > 1 ? "médias trouvés" : "média trouvé"}
          </Text>
          <Text style={styles.sort}>Triés par : plus récents</Text>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerRight: () => (
            <View style={styles.headerRight}>
              <HeaderActions />
            </View>
          ),
        }}
      />
      <Head>
        <title>Catalogue · Cosmos Gallery</title>
      </Head>

      <FlatList
        key={columns}
        data={loading || error ? [] : medias}
        numColumns={columns}
        keyExtractor={(media) => `${media.source}:${media.id}`}
        contentContainerStyle={styles.list}
        columnWrapperStyle={columns > 1 ? styles.row : undefined}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={header}
        renderItem={({ item }) => (
          <View style={columns > 1 ? { flex: 1, maxWidth: `${100 / columns}%` } : undefined}>
            <MediaCard media={item} variant={columns > 1 ? "grid" : "list"} />
          </View>
        )}
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator style={styles.center} size="large" color={COLORS.primary} />
          ) : error ? (
            <Text style={[styles.center, styles.error]}>{error}</Text>
          ) : (
            <Text style={styles.empty}>Aucun média ne correspond aux filtres.</Text>
          )
        }
        ListFooterComponent={
          <View>
            {!loading && !error && <Pagination page={page} totalPages={totalPages} onChange={setPage} />}
            <Text style={styles.footer}>© 2026 Cosmos Gallery — Données issues de l&apos;API images.nasa.gov</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerRight: {
    marginRight: 12,
  },
  list: {
    width: "100%",
    maxWidth: CONTENT_MAX_WIDTH,
    alignSelf: "center",
    paddingHorizontal: 16,
    gap: 24,
  },
  header: {
    gap: 24,
    paddingTop: 32,
  },
  hero: {
    gap: 10,
  },
  title: {
    color: COLORS.text,
    fontSize: 32,
    fontWeight: "800",
  },
  subtitle: {
    color: COLORS.muted,
    fontSize: 15,
  },
  resultsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
  },
  count: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "700",
  },
  sort: {
    color: COLORS.muted,
    fontSize: 13,
  },
  row: {
    gap: 24,
  },
  center: {
    marginTop: 40,
    alignSelf: "center",
  },
  error: {
    color: COLORS.danger,
  },
  empty: {
    textAlign: "center",
    marginTop: 40,
    color: COLORS.muted,
  },
  footer: {
    textAlign: "center",
    color: COLORS.muted,
    fontSize: 12,
    paddingVertical: 24,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
});
