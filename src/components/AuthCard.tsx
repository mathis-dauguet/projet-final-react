import type { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { COLORS, RADIUS } from "@/constants/theme";

export function AuthCard({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <View style={styles.heading}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
        {children}
      </View>
    </View>
  );
}

export const authStyles = StyleSheet.create({
  link: { color: COLORS.primary, fontSize: 14, textAlign: "center" },
});

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 16,
    paddingTop: 48,
  },
  card: {
    width: "100%",
    maxWidth: 420,
    alignSelf: "center",
    padding: 24,
    gap: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
  },
  heading: { gap: 6 },
  title: { color: COLORS.text, fontSize: 26, fontWeight: "800" },
  subtitle: { color: COLORS.muted, fontSize: 14 },
});
