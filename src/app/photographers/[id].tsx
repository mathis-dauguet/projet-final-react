import { Stack, useLocalSearchParams } from "expo-router";
import Head from "expo-router/head";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";

import { HeaderActions } from "@/components/HeaderActions";
import { Logo } from "@/components/Logo";
import { MediaCard } from "@/components/MediaCard";
import { Button } from "@/components/ui/Button";
import { COLORS, CONTENT_MAX_WIDTH, RADIUS } from "@/constants/theme";
import { useAuthorMedias } from "@/hooks/useAuthorMedias";
import { useColumns } from "@/hooks/useColumns";
import { db } from "@/services/firebase";

const DEFAULT_NAME = "Photographe";

// Profil public d'un photographe : ses médias publiés, visibles par tout le monde
export default function PhotographerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { medias, loading, error, hasMore, loadingMore, loadMore } = useAuthorMedias(id);
  const [profile, setProfile] = useState<{ id: string; name: string } | null>(null);
  const columns = useColumns();

  useEffect(() => {
    let cancelled = false;
    getDoc(doc(db, "users", id))
      .then((snapshot) => {
        if (!cancelled) setProfile({ id, name: snapshot.get("name") || DEFAULT_NAME });
      })
      .catch(() => {
        if (!cancelled) setProfile({ id, name: DEFAULT_NAME });
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  const name = profile?.id === id ? profile.name : DEFAULT_NAME;

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: name,
          headerTitle: () => <Logo />,
          headerRight: () => (
            <View style={styles.headerRight}>
              <HeaderActions />
            </View>
          ),
        }}
      />
      <Head>
        <title>{`${name} · Cosmos Gallery`}</title>
      </Head>
      <FlatList
        key={columns}
        data={medias}
        numColumns={columns}
        keyExtractor={(media) => media.id}
        contentContainerStyle={styles.list}
        columnWrapperStyle={columns > 1 ? styles.row : undefined}
        ListHeaderComponent={
          <View style={styles.hero}>
            <Text style={styles.label}>Photographe</Text>
            <Text style={styles.title}>{name}</Text>
            <Text style={styles.subtitle}>Les médias publiés sur Cosmos Gallery, du plus récent au plus ancien.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={columns > 1 ? [styles.cell, { maxWidth: `${100 / columns}%` }] : undefined}>
            <MediaCard media={item} variant={columns > 1 ? "grid" : "list"} />
          </View>
        )}
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator style={styles.loader} size="large" color={COLORS.primary} />
          ) : (
            <Text style={[styles.empty, error !== null && styles.error]}>
              {error ?? "Ce photographe n'a encore publié aucun média."}
            </Text>
          )
        }
        ListFooterComponent={
          hasMore ? (
            <Button label="Afficher plus" variant="secondary" onPress={loadMore} loading={loadingMore} style={styles.more} />
          ) : undefined
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  headerRight: { marginRight: 12 },
  loader: { marginTop: 40 },
  list: {
    width: "100%",
    maxWidth: CONTENT_MAX_WIDTH,
    alignSelf: "center",
    padding: 16,
    paddingTop: 32,
    gap: 24,
  },
  row: { gap: 24 },
  cell: { flex: 1 },
  hero: { gap: 6 },
  label: { color: COLORS.accent, fontSize: 12, fontWeight: "700", textTransform: "uppercase", letterSpacing: 1 },
  title: { color: COLORS.text, fontSize: 32, fontWeight: "800" },
  subtitle: { color: COLORS.muted, fontSize: 15 },
  error: { color: COLORS.danger },
  empty: {
    textAlign: "center",
    paddingVertical: 40,
    paddingHorizontal: 16,
    color: COLORS.muted,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
  },
  more: { alignSelf: "center", marginTop: 8 },
});
