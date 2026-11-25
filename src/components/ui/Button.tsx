import { ActivityIndicator, Pressable, StyleSheet, Text, type StyleProp, type ViewStyle } from "react-native";
import { COLORS, RADIUS } from "@/constants/theme";

export type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";

interface Props {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function Button({ label, onPress, variant = "primary", disabled, loading, style }: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        (pressed || disabled) && styles.dimmed,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={COLORS.text} />
      ) : (
        <Text style={[styles.label, variant === "ghost" && styles.ghostLabel]}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  primary: { backgroundColor: COLORS.primary },
  secondary: { backgroundColor: COLORS.surfaceAlt, borderColor: COLORS.border },
  danger: { backgroundColor: COLORS.danger },
  ghost: { backgroundColor: "transparent", borderColor: COLORS.border },
  dimmed: { opacity: 0.7 },
  label: { color: COLORS.text, fontWeight: "600", fontSize: 14 },
  ghostLabel: { color: COLORS.muted },
});
