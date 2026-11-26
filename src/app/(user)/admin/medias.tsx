import { router } from "expo-router";
import Head from "expo-router/head";
import { useMemo, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";

import { MediaCard } from "@/components/MediaCard";
import { Button } from "@/components/ui/Button";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { COLORS, CONTENT_MAX_WIDTH, RADIUS } from "@/constants/theme";
import { useCommunityMedias } from "@/hooks/useCommunityMedias";
import { useUserRole } from "@/hooks/useUserRole";
import type { Media } from "@/models/media";

const DATE_FORMAT = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", year: "numeric" });

type Action = { kind: "delete" | "restore"; media: Media };

// Gestion admin : tous les médias de la communauté, y compris supprimés
export default function AdminMediasScreen() {
  const { role, loading: roleLoading } = useUserRole();
  const filters = useMemo(() => (role === "admin" ? { includeDeleted: true } : null), [role]);
  const { medias, loading, error, hasMore, loadingMore, loadMore, remove, restore } = useCommunityMedias(filters);
  const [action, setAction] = useState<Action | null>(null);
  const [running, setRunning] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const ask = (kind: Action["kind"], media: Media) => {
    setActionError(null);
    setAction({ kind, media });
  };

  const confirm = async () => {
    if (!action) return;
    setRunning(true);
    setActionError(null);
    try {
      if (action.kind === "delete") await remove(action.media.id);
      else await restore(action.media.id);
      setAction(null);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "L'opération a échoué. Réessayez.");
    } finally {
      setRunning(false);
    }
  };

  if (roleLoading) {
    return <ActivityIndicator style={styles.loader} size="large" color={COLORS.primary} />;
  }

  if (role !== "admin") {
    return (
      <View style={styles.container}>
        <View style={styles.list}>
          <Text style={styles.title}>Gestion des médias</Text>
          <Text style={styles.subtitle}>Cette page est réservée aux administrateurs.</Text>
        </View>
      </View>
    );
  }

  const deleting = action?.kind === "delete";

  return (
    <View style={styles.container}>
      <Head>
        <title>Gestion des médias · Cosmos Gallery</title>
      </Head>
      <FlatList
        data={medias}
        keyExtractor={(media) => media.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={styles.hero}>
            <Text style={styles.title}>Gestion des médias</Text>
            <Text style={styles.subtitle}>
              Tous les médias publiés par la communauté, y compris ceux qui ont été supprimés.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={[styles.item, item.deleted_at && styles.itemDeleted]}>
            <MediaCard media={item} variant="list" />
            <View style={styles.footer}>
              <Text style={item.deleted_at ? styles.statusDeleted : styles.status}>
                {item.deleted_at ? `Supprimé le ${DATE_FORMAT.format(item.deleted_at)}` : "Publié"}
              </Text>
              <View style={styles.actions}>
                {item.deleted_at ? (
                  <Button label="Restaurer" onPress={() => ask("restore", item)} />
                ) : (
                  <>
                    <Button
                      label="Modifier"
                      variant="secondary"
                      onPress={() => router.push({ pathname: "/medias/[id]/edit", params: { id: item.id } })}
                    />
                    <Button label="Supprimer" variant="danger" onPress={() => ask("delete", item)} />
                  </>
                )}
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator style={styles.loader} size="large" color={COLORS.primary} />
          ) : (
            <Text style={[styles.empty, error !== null && styles.error]}>
              {error ?? "Aucun média n'a encore été publié."}
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
        visible={action !== null}
        title={deleting ? "Supprimer ce média ?" : "Restaurer ce média ?"}
        message={
          deleting
            ? `« ${action?.media.name ?? ""} » ne sera plus visible dans le catalogue ni sur le profil de son auteur.`
            : `« ${action?.media.name ?? ""} » sera de nouveau visible dans le catalogue et sur le profil de son auteur.`
        }
        confirmLabel={deleting ? "Supprimer" : "Restaurer"}
        danger={deleting}
        loading={running}
        error={actionError}
        onConfirm={confirm}
        onCancel={() => setAction(null)}
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
  hero: { gap: 6, marginBottom: 8 },
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
  itemDeleted: { opacity: 0.7, borderStyle: "dashed" },
  footer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  status: { color: COLORS.muted, fontSize: 13 },
  statusDeleted: { color: COLORS.danger, fontSize: 13, fontWeight: "600" },
  actions: { flexDirection: "row", gap: 8 },
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
