import { StyleSheet, Text, TextInput, View, type StyleProp, type TextInputProps, type ViewStyle } from "react-native";
import { COLORS, RADIUS } from "@/constants/theme";

interface Props extends TextInputProps {
  label: string;
  containerStyle?: StyleProp<ViewStyle>;
}

export function TextField({ label, containerStyle, style, ...inputProps }: Props) {
  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.label}>{label}</Text>
      <TextInput placeholderTextColor={COLORS.muted} style={[styles.input, style]} {...inputProps} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 6 },
  label: { color: COLORS.muted, fontSize: 12 },
  input: {
    backgroundColor: COLORS.surfaceAlt,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.sm,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: COLORS.text,
  },
});
