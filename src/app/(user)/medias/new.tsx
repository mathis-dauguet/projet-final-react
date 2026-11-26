import { Image } from "expo-image";
import { router } from "expo-router";
import Head from "expo-router/head";
import { useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";

import { TYPE_LABELS } from "@/components/MediaCard";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { MEDIA_NAME_MAX } from "@/constants/media-rules";
import { COLORS, RADIUS } from "@/constants/theme";
import { useUserRole } from "@/hooks/useUserRole";
import { pickAudio, pickImageOrVideo, publishMedia, type PickedFile } from "@/services/media-upload";

function formatSize(bytes: number | null): string {
  if (bytes === null) return "taille inconnue";
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Une erreur est survenue. Réessayez.";
}

export default function NewMediaScreen() {
  const { role, loading: roleLoading } = useUserRole();
  const [name, setName] = useState("");
  const [file, setFile] = useState<PickedFile | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const choose = async (picker: () => Promise<PickedFile | null>) => {
    setError(null);
    try {
      const picked = await picker();
      if (picked) setFile(picked);
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  const publish = async () => {
    if (!file) return;
    setPublishing(true);
    setError(null);
    try {
      await publishMedia(name, file);
      router.replace("/medias");
    } catch (err) {
      setError(errorMessage(err));
      setPublishing(false);
    }
  };

  if (roleLoading) {
    return <ActivityIndicator style={styles.loader} size="large" color={COLORS.primary} />;
  }

  if (role !== "photographer") {
    return (
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Publier un média</Text>
          <Text style={styles.subtitle}>Seuls les comptes photographes peuvent publier des médias.</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Head>
        <title>Publier un média · Cosmos Gallery</title>
      </Head>
      <View style={styles.card}>
        <View style={styles.hero}>
          <Text style={styles.title}>Publier un média</Text>
          <Text style={styles.subtitle}>Image (JPEG, PNG, WebP, 10 Mo), vidéo (MP4, 100 Mo) ou son (MP3, M4A, 20 Mo).</Text>
        </View>

        <TextField
          label={`Titre (${name.trim().length}/${MEDIA_NAME_MAX})`}
          value={name}
          onChangeText={setName}
          maxLength={MEDIA_NAME_MAX}
          placeholder="Lever de Lune sur la mer"
        />

        <View style={styles.pickers}>
          <Button label="Choisir une image ou une vidéo" variant="secondary" onPress={() => choose(pickImageOrVideo)} />
          <Button label="Choisir un son" variant="secondary" onPress={() => choose(pickAudio)} />
        </View>

        {file && (
          <View style={styles.preview}>
            {file.type === "image" ? (
              <Image source={file.uri} style={styles.previewImage} contentFit="contain" />
            ) : (
              <View style={[styles.previewImage, styles.placeholder]}>
                <Text style={styles.placeholderText}>{TYPE_LABELS[file.type]}</Text>
              </View>
            )}
            <Text style={styles.fileName} numberOfLines={1}>
              {file.name}
            </Text>
            <Text style={styles.fileMeta}>
              {TYPE_LABELS[file.type]} · {formatSize(file.size)}
            </Text>
          </View>
        )}

        {error && <Text style={styles.error}>{error}</Text>}

        <Button
          label="Publier"
          onPress={publish}
          loading={publishing}
          disabled={!file || name.trim().length === 0}
          style={styles.publish}
        />
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
  hero: { gap: 6 },
  title: { color: COLORS.text, fontSize: 26, fontWeight: "800" },
  subtitle: { color: COLORS.muted, fontSize: 14 },
  pickers: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  preview: {
    gap: 6,
    padding: 12,
    backgroundColor: COLORS.surfaceAlt,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
  },
  previewImage: { width: "100%", height: 240, borderRadius: RADIUS.sm },
  placeholder: { backgroundColor: COLORS.placeholder, alignItems: "center", justifyContent: "center" },
  placeholderText: { color: COLORS.text, fontWeight: "700", fontSize: 18 },
  fileName: { color: COLORS.text, fontWeight: "600" },
  fileMeta: { color: COLORS.muted, fontSize: 13 },
  error: { color: COLORS.danger },
  publish: { alignSelf: "flex-start", paddingHorizontal: 24 },
});
