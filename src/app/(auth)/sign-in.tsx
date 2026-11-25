import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { AuthForm } from "@/components/auth-form";
import { signIn } from "@/services/auth-service";

export default function SignInScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Connexion</Text>
      <AuthForm submitLabel="Se connecter" onSubmit={signIn} />
      <Link href="/sign-up" style={styles.link}>
        Pas encore de compte ? Créer un compte
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
