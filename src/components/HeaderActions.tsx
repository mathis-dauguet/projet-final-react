import { Link } from "expo-router";
import { StyleSheet, View } from "react-native";
import { AccountMenu } from "@/components/AccountMenu";
import { COLORS, RADIUS } from "@/constants/theme";
import { useAuth } from "@/hooks/useAuth";

export function HeaderActions() {
  const { user } = useAuth();

  if (user) return <AccountMenu />;

  return (
    <View style={styles.row}>
      <Link href="/sign-in" style={[styles.button, styles.ghost]}>
        Connexion
      </Link>
      <Link href="/sign-up" style={[styles.button, styles.primary]}>
        Inscription
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 8 },
  button: {
    color: COLORS.text,
    fontWeight: "600",
    fontSize: 14,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    overflow: "hidden",
  },
  ghost: { borderColor: COLORS.border, color: COLORS.muted },
  primary: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
});
