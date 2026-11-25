import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { AuthForm } from "@/components/auth-form";
import { signUp } from "@/services/auth-service";

export default function SignUpScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Créer un compte</Text>
      <AuthForm submitLabel="S'inscrire" onSubmit={signUp} />
      <Link href="/sign-in" style={styles.link}>
        Déjà un compte ? Se connecter
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    width: "100%",
    maxWidth: 420,
    alignSelf: "center",
    padding: 24,
    gap: 16,
  },
  title: { fontSize: 24, fontWeight: "800" },
  link: { color: "#0B7A70", fontSize: 16 },
});
