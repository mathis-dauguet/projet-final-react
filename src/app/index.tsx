import { Stack } from "expo-router";
import Head from "expo-router/head";
import { useMemo } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";

import { HeaderActions } from "@/components/HeaderActions";
import { MediaCard } from "@/components/MediaCard";
import { MediaFilters } from "@/components/MediaFilters";
import { Pagination } from "@/components/Pagination";
import { Button } from "@/components/ui/Button";
import { COLORS, CONTENT_MAX_WIDTH } from "@/constants/theme";
import { useColumns } from "@/hooks/useColumns";
import { useCommunityMedias } from "@/hooks/useCommunityMedias";
import { useMediaFilters } from "@/hooks/useMediaFilters";
import { useMedias } from "@/hooks/useMedias";
import type { Media } from "@/models/media";

const COUNT_FORMAT = new Intl.NumberFormat("fr-FR");

function filterByName(medias: Media[], term: string): Media[] {
  return term ? medias.filter((media) => media.name.toLowerCase().includes(term)) : medias;
}

export default function Catalogue() {
  const { search, setSearch, type, setType, source, setSource, page, setPage, params, communitySearch } = useMediaFilters();
  const columns = useColumns();

  const nasa = useMedias(source === "user" ? null : params);
  const communityFilters = useMemo(
    () => (source === "nasa" ? null : { type: type === "all" ? undefined : type }),
    [source, type],
  );
  const community = useCommunityMedias(communityFilters);
  const communityMedias = useMemo(
    () => filterByName(community.medias, communitySearch),
    [community.medias, communitySearch],
  );

  // "Communauté" : liste Firestore. "Tous" et "NASA" : liste NASA paginée, avec en plus pour "Tous"
  // une section des derniers médias de la communauté en page 1.
  const communityOnly = source === "user";
  const loading = communityOnly ? community.loading : nasa.loading;
  const error = communityOnly ? community.error : nasa.error;
  const medias = communityOnly ? communityMedias : nasa.medias;
  const preview = source === "all" && page === 1 ? communityMedias.slice(0, Math.max(columns, 3)) : [];
  const cellStyle = columns > 1 ? [styles.cell, { maxWidth: `${100 / columns}%` as const }] : undefined;

  const header = (
    <View style={styles.header}>
      <View style={styles.hero}>
        <Text style={styles.title}>Explorez l&apos;univers en images</Text>
        <Text style={styles.subtitle}>
          Les médias de la NASA et ceux publiés par nos photographes : recherchez par mot-clé, type ou source.
        </Text>
      </View>
      <MediaFilters
        search={search}
        onSearchChange={setSearch}
        type={type}
        onTypeChange={setType}
        source={source}
        onSourceChange={setSource}
      />
      {preview.length > 0 && (
        <View style={styles.community}>
          <View style={styles.resultsHeader}>
            <Text style={styles.count}>Dernières publications de la communauté</Text>
            <Button label="Voir tout" variant="ghost" onPress={() => setSource("user")} />
          </View>
          <View style={columns > 1 ? styles.row : styles.column}>
            {preview.map((media) => (
              <View key={media.id} style={cellStyle}>
                <MediaCard media={media} variant={columns > 1 ? "grid" : "list"} />
              </View>
            ))}
          </View>
        </View>
      )}
      {!loading && !error && (
        <View style={styles.resultsHeader}>
          <Text style={styles.count}>
            {communityOnly
              ? `${COUNT_FORMAT.format(medias.length)}${community.hasMore ? "+" : ""} ${medias.length > 1 ? "médias" : "média"} de la communauté`
              : `${COUNT_FORMAT.format(nasa.totalHits)} ${nasa.totalHits > 1 ? "médias NASA trouvés" : "média NASA trouvé"}`}
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
          <View style={cellStyle}>
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
            {!loading && !error && !communityOnly && (
              <Pagination page={page} totalPages={nasa.totalPages} onChange={setPage} />
            )}
            {!loading && !error && communityOnly && community.hasMore && (
              <Button
                label="Afficher plus"
                variant="secondary"
                onPress={community.loadMore}
                loading={community.loadingMore}
                style={styles.more}
              />
            )}
            <Text style={styles.footer}>© 2026 Cosmos Gallery — Données NASA issues de l&apos;API images.nasa.gov</Text>
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
    flexDirection: "row",
    gap: 24,
  },
  column: {
    gap: 24,
  },
  cell: {
    flex: 1,
  },
  community: {
    gap: 16,
  },
  more: {
    alignSelf: "center",
    marginTop: 8,
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
