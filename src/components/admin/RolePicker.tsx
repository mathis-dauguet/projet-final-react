import { Pressable, StyleSheet, Text, View } from "react-native";
import { COLORS, RADIUS } from "@/constants/theme";
import { ROLE_LABELS, ROLES, type Role } from "@/models/user";

interface Props {
  value: Role;
  onChange: (role: Role) => void;
  disabled?: boolean;
}

export function RolePicker({ value, onChange, disabled }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Rôle</Text>
      <View style={[styles.row, disabled && styles.disabled]}>
        {ROLES.map((role) => {
          const active = role === value;
          return (
            <Pressable
              key={role}
              disabled={disabled}
              onPress={() => onChange(role)}
              accessibilityRole="radio"
              accessibilityState={{ selected: active, disabled }}
              style={[styles.option, active && styles.optionActive]}
            >
              <Text style={[styles.optionLabel, active && styles.optionLabelActive]}>{ROLE_LABELS[role]}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 6 },
  label: { color: COLORS.muted, fontSize: 12 },
  row: { flexDirection: "row", gap: 8 },
  disabled: { opacity: 0.5 },
  option: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surfaceAlt,
  },
  optionActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primary },
  optionLabel: { color: COLORS.muted, fontWeight: "600", fontSize: 14 },
  optionLabelActive: { color: COLORS.text },
});
