import { router } from "expo-router";
import Head from "expo-router/head";
import { useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";

import { MediaCard } from "@/components/MediaCard";
import { Button } from "@/components/ui/Button";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { COLORS, CONTENT_MAX_WIDTH, RADIUS } from "@/constants/theme";
import { useAuth } from "@/hooks/useAuth";
import { useMyMedias } from "@/hooks/useMyMedias";
import { useUserRole } from "@/hooks/useUserRole";
import type { Media } from "@/models/media";

export default function MyMediasScreen() {
  const { user } = useAuth();
  const { role, loading: roleLoading } = useUserRole();
  const { medias, loading, error, hasMore, loadingMore, loadMore, remove } = useMyMedias();
  const [toDelete, setToDelete] = useState<Media | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const askDelete = (media: Media) => {
    setDeleteError(null);
    setToDelete(media);
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      await remove(toDelete.id);
      setToDelete(null);
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "La suppression a échoué. Réessayez.");
    } finally {
      setDeleting(false);
    }
  };

  if (roleLoading) {
    return <ActivityIndicator style={styles.loader} size="large" color={COLORS.primary} />;
  }

  if (role !== "photographer") {
    return (
      <View style={styles.container}>
        <View style={styles.list}>
          <Text style={styles.title}>Mes médias</Text>
          <Text style={styles.subtitle}>Seuls les comptes photographes peuvent publier des médias.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Head>
        <title>Mes médias · Cosmos Gallery</title>
      </Head>
      <FlatList
        data={medias}
        keyExtractor={(media) => media.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={styles.hero}>
            <View style={styles.heroText}>
              <Text style={styles.title}>Mes médias</Text>
              <Text style={styles.subtitle}>Les médias que vous avez publiés, du plus récent au plus ancien.</Text>
            </View>
            <View style={styles.heroActions}>
              {user && (
                <Button
                  label="Voir mon profil public"
                  variant="ghost"
                  onPress={() => router.push({ pathname: "/photographers/[id]", params: { id: user.uid } })}
                />
              )}
              <Button label="Publier un média" onPress={() => router.push("/medias/new")} />
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.item}>
            <MediaCard media={item} variant="list" />
            <View style={styles.actions}>
              <Button
                label="Modifier"
                variant="secondary"
                onPress={() => router.push({ pathname: "/medias/[id]/edit", params: { id: item.id } })}
              />
              <Button label="Supprimer" variant="danger" onPress={() => askDelete(item)} />
            </View>
          </View>
        )}
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator style={styles.loader} size="large" color={COLORS.primary} />
          ) : (
            <Text style={[styles.empty, error !== null && styles.error]}>
              {error ?? "Vous n'avez encore publié aucun média."}
            </Text>
          )
        }
        ListFooterComponent={
          hasMore ? (
            <Button label="Afficher plus" variant="secondary" onPress={loadMore} loading={loadingMore} style={styles.more} />
          ) : undefined
        }
      />

      <ConfirmModal
        visible={toDelete !== null}
        title="Supprimer ce média ?"
        message={`« ${toDelete?.name ?? ""} » ne sera plus visible dans le catalogue ni sur votre profil.`}
        confirmLabel="Supprimer"
        danger
        loading={deleting}
        error={deleteError}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  loader: { marginTop: 40 },
  list: {
    width: "100%",
    maxWidth: CONTENT_MAX_WIDTH,
    alignSelf: "center",
    padding: 16,
    paddingTop: 32,
    gap: 12,
  },
  hero: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 16,
    marginBottom: 8,
  },
  heroText: { gap: 6, flexShrink: 1 },
  heroActions: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  title: { color: COLORS.text, fontSize: 32, fontWeight: "800" },
  subtitle: { color: COLORS.muted, fontSize: 15 },
  item: {
    gap: 12,
    padding: 12,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
  },
  actions: { flexDirection: "row", justifyContent: "flex-end", gap: 8 },
  error: { color: COLORS.danger },
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
  more: { alignSelf: "center", marginTop: 8 },
});
