import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

import { Button } from "@/components/ui/Button";
import { COLORS, RADIUS } from "@/constants/theme";
import { useFavorites } from "@/hooks/useFavorites";
import type { Media } from "@/models/media";

export function FavoriteNote({ media }: { media: Media }) {
  const { isFavorite, noteOf, updateNote } = useFavorites();
  const [draft, setDraft] = useState<string | null>(null);
  const note = draft ?? noteOf(media);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  if (!isFavorite(media)) {
    return <Text style={styles.hint}>Ajoutez ce média à vos favoris pour l&apos;annoter.</Text>;
  }

  const save = async () => {
    setSaving(true);
    try {
      await updateNote(media, note.trim());
      setDraft(null);
      setMessage("Note enregistrée");
    } catch (e) {
      setMessage(e instanceof Error && e.message ? `Échec : ${e.message}` : "Échec de l'enregistrement");
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.box}>
      <Text style={styles.label}>Ma note</Text>
      <TextInput
        value={note}
        onChangeText={(value) => {
          setDraft(value);
          setMessage("");
        }}
        placeholder="Pourquoi ce média vous plaît…"
        placeholderTextColor={COLORS.muted}
        multiline
        maxLength={500}
        style={styles.input}
      />
      <View style={styles.footer}>
        <Button label="Enregistrer" onPress={save} loading={saving} />
        {message !== "" && <Text style={styles.hint}>{message}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { gap: 8 },
  label: { color: COLORS.muted, fontSize: 12 },
  input: {
    minHeight: 72,
    backgroundColor: COLORS.surfaceAlt,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.sm,
    padding: 12,
    fontSize: 14,
    color: COLORS.text,
    textAlignVertical: "top",
  },
  footer: { flexDirection: "row", alignItems: "center", gap: 12 },
  hint: { fontSize: 13, color: COLORS.muted },
});
