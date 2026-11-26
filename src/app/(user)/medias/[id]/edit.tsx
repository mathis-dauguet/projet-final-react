import { router, useLocalSearchParams } from "expo-router";
import Head from "expo-router/head";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";

import { MediaFilePreview } from "@/components/MediaFilePreview";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { MEDIA_NAME_MAX } from "@/constants/media-rules";
import { COLORS, RADIUS } from "@/constants/theme";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import type { Media } from "@/models/media";
import { getMedia, normalizeMediaName, updateMedia } from "@/services/community-medias";
import { pickAudio, pickImageOrVideo, replaceMediaFile, type PickedFile } from "@/services/media-upload";

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Une erreur est survenue. Réessayez.";
}

function goBack() {
  if (router.canGoBack()) router.back();
  else router.replace("/medias");
}

export default function EditMediaScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const { role, loading: roleLoading } = useUserRole();
  const [loaded, setLoaded] = useState<{ id: string; media: Media | null; error: string | null } | null>(null);
  const [name, setName] = useState("");
  const [file, setFile] = useState<PickedFile | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getMedia(id)
      .then((media) => {
        if (cancelled) return;
        setLoaded({ id, media, error: null });
        if (media) setName(media.name);
      })
      .catch((err: unknown) => {
        if (!cancelled) setLoaded({ id, media: null, error: errorMessage(err) });
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  const media = loaded?.id === id ? loaded.media : null;

  const choose = async (picker: () => Promise<PickedFile | null>) => {
    setError(null);
    try {
      const picked = await picker();
      if (picked) setFile(picked);
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  const save = async () => {
    if (!media) return;
    setSaving(true);
    setError(null);
    try {
      const cleanName = normalizeMediaName(name);
      if (file) await replaceMediaFile(media, file);
      if (cleanName !== media.name) await updateMedia(media.id, { name: cleanName });
      goBack();
    } catch (err) {
      setError(errorMessage(err));
      setSaving(false);
    }
  };

  if (roleLoading || loaded?.id !== id) {
    return <ActivityIndicator style={styles.loader} size="large" color={COLORS.primary} />;
  }

  const canEdit = media !== null && (media.author_id === user?.uid || role === "admin");
  const blocked = loaded.error
    ? loaded.error
    : !media
      ? "Ce média n'existe pas."
      : media.deleted_at
        ? "Ce média a été supprimé."
        : !canEdit
          ? "Vous ne pouvez modifier que vos médias."
          : null;

  if (blocked || !media) {
    return (
      <View style={styles.container}>
        <View style={[styles.card, styles.blockedCard]}>
          <Text style={styles.title}>Modifier un média</Text>
          <Text style={styles.subtitle}>{blocked}</Text>
          <Button label="Retour" variant="secondary" onPress={goBack} style={styles.action} />
        </View>
      </View>
    );
  }

  const unchanged = !file && name.trim() === media.name;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Head>
        <title>Modifier un média · Cosmos Gallery</title>
      </Head>
      <View style={styles.card}>
        <View style={styles.hero}>
          <Text style={styles.title}>Modifier un média</Text>
          <Text style={styles.subtitle}>Changez le titre et/ou remplacez le fichier. L&apos;ancien fichier sera supprimé.</Text>
        </View>

        <TextField
          label={`Titre (${name.trim().length}/${MEDIA_NAME_MAX})`}
          value={name}
          onChangeText={setName}
          maxLength={MEDIA_NAME_MAX}
        />

        {file ? (
          <MediaFilePreview
            caption="Nouveau fichier"
            imageUri={file.type === "image" ? file.uri : null}
            type={file.type}
            name={file.name}
            size={file.size}
          />
        ) : (
          <MediaFilePreview caption="Fichier actuel" imageUri={media.thumbnail} type={media.type} name={media.name} size={media.size} />
        )}

        <View style={styles.pickers}>
          <Button label="Remplacer par une image ou une vidéo" variant="secondary" onPress={() => choose(pickImageOrVideo)} />
          <Button label="Remplacer par un son" variant="secondary" onPress={() => choose(pickAudio)} />
          {file && <Button label="Garder le fichier actuel" variant="ghost" onPress={() => setFile(null)} />}
        </View>

        {error && <Text style={styles.error}>{error}</Text>}

        <View style={styles.actions}>
          <Button label="Annuler" variant="ghost" onPress={goBack} disabled={saving} />
          <Button label="Enregistrer" onPress={save} loading={saving} disabled={unchanged} />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 16, paddingTop: 32 },
  loader: { marginTop: 48 },
  card: {
    width: "100%",
    maxWidth: 640,
    alignSelf: "center",
    padding: 24,
    gap: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
  },
  blockedCard: { marginTop: 32 },
  hero: { gap: 6 },
  title: { color: COLORS.text, fontSize: 26, fontWeight: "800" },
  subtitle: { color: COLORS.muted, fontSize: 14 },
  pickers: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  error: { color: COLORS.danger },
  actions: { flexDirection: "row", justifyContent: "flex-end", gap: 12 },
  action: { alignSelf: "flex-start" },
});
