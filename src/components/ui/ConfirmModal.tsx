import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

import { Button } from "@/components/ui/Button";
import { COLORS, RADIUS } from "@/constants/theme";

interface Props {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  danger?: boolean;
  loading?: boolean;
  error?: string | null;
}

export function ConfirmModal({ visible, title, message, confirmLabel, onConfirm, onCancel, danger, loading, error }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={loading ? undefined : onCancel} />
        <View style={styles.dialog}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          {error && <Text style={styles.error}>{error}</Text>}
          <View style={styles.actions}>
            <Button label="Annuler" variant="ghost" onPress={onCancel} disabled={loading} />
            <Button label={confirmLabel} variant={danger ? "danger" : "primary"} onPress={onConfirm} loading={loading} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  dialog: {
    width: "100%",
    maxWidth: 420,
    padding: 24,
    gap: 16,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
  },
  title: { color: COLORS.text, fontSize: 20, fontWeight: "800" },
  message: { color: COLORS.muted, fontSize: 14, lineHeight: 20 },
  error: { color: COLORS.danger },
  actions: { flexDirection: "row", justifyContent: "flex-end", gap: 12 },
});
