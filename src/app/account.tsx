import { StyleSheet, Text, View } from "react-native";
import { Button } from "@/components/ui/Button";
import { COLORS, RADIUS } from "@/constants/theme";
import { useAuth } from "@/hooks/useAuth";
import { signOut } from "@/services/auth-service";

export default function AccountScreen() {
  const { user } = useAuth();
  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <Text style={styles.title}>Mon compte</Text>
        <View style={styles.info}>
          <Text style={styles.label}>Connecté en tant que</Text>
          <Text style={styles.email}>{user?.email}</Text>
        </View>
        <Button label="Se déconnecter" variant="danger" onPress={signOut} style={styles.button} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background, padding: 16, paddingTop: 48 },
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
  title: { color: COLORS.text, fontSize: 26, fontWeight: "800" },
  info: { gap: 4 },
  label: { fontSize: 13, color: COLORS.muted },
  email: { fontSize: 17, fontWeight: "700", color: COLORS.text },
  button: { alignSelf: "flex-start" },
});
