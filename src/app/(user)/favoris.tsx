import Head from "expo-router/head";
import { ActivityIndicator, SectionList, StyleSheet, Text, View } from "react-native";

import { FavoriteNote } from "@/components/FavoriteNote";
import { MediaCard, TYPE_LABELS } from "@/components/MediaCard";
import { COLORS, CONTENT_MAX_WIDTH, RADIUS } from "@/constants/theme";
import { useFavorites } from "@/hooks/useFavorites";
import { mediaKey } from "@/models/favorite";
import { groupMediasByType } from "@/models/media";

export default function Favoris() {
  const { favorites, loading, error } = useFavorites();
  const sections = groupMediasByType(favorites.map((favorite) => favorite.media));

  return (
    <View style={styles.container}>
      <Head>
        <title>Mes favoris · Cosmos Gallery</title>
      </Head>
      <SectionList
        sections={sections}
        keyExtractor={(media) => mediaKey(media)}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <MediaCard media={item} variant="list" />
            <FavoriteNote media={item} />
          </View>
        )}
        renderSectionHeader={({ section }) => (
          <Text style={styles.header}>
            {TYPE_LABELS[section.title]} <Text style={styles.count}>({section.data.length})</Text>
          </Text>
        )}
        ListHeaderComponent={
          <View style={styles.hero}>
            <Text style={styles.title}>Mes favoris</Text>
            <Text style={styles.subtitle}>Les médias que vous avez mis de côté, groupés par type.</Text>
          </View>
        }
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator style={styles.loader} size="large" color={COLORS.primary} />
          ) : (
            <Text style={[styles.empty, error !== null && styles.error]}>
              {error ?? "Aucun favori pour le moment."}
            </Text>
          )
        }
        contentContainerStyle={styles.list}
        stickySectionHeadersEnabled={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    gap: 12,
    padding: 12,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
  },
  loader: {
    marginTop: 40,
  },
  error: {
    color: COLORS.danger,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  list: {
    width: "100%",
    maxWidth: CONTENT_MAX_WIDTH,
    alignSelf: "center",
    padding: 16,
    paddingTop: 32,
    gap: 12,
  },
  hero: {
    marginBottom: 8,
    gap: 6,
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
  header: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: "600",
    marginTop: 16,
  },
  count: {
    color: COLORS.muted,
    fontWeight: "400",
  },
  empty: {
    textAlign: "center",
    marginTop: 24,
    paddingVertical: 40,
    paddingHorizontal: 16,
    color: COLORS.muted,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
  },
});
