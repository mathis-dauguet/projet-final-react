import { Stack } from "expo-router";
import { SectionList, StyleSheet, Text, View } from "react-native";

import { MediaCard, TYPE_LABELS } from "@/components/MediaCard";
import { COLORS, CONTENT_MAX_WIDTH } from "@/constants/theme";
import { useFavorites } from "@/hooks/useFavorites";
import { groupMediasByType } from "@/models/media";

export default function Favoris() {
  const { favorites } = useFavorites();
  const sections = groupMediasByType(favorites);

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Mes favoris",
        }}
      />
      <SectionList
        sections={sections}
        keyExtractor={(media) => `${media.source}:${media.id}`}
        renderItem={({ item }) => <MediaCard media={item} variant="list" />}
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
        ListEmptyComponent={<Text style={styles.empty}>Aucun favori pour le moment.</Text>}
        contentContainerStyle={styles.list}
        stickySectionHeadersEnabled={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
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
    marginTop: 40,
    color: COLORS.muted,
  },
});
