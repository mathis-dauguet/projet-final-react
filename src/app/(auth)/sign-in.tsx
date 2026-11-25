import { Link } from "expo-router";
import { AuthCard, authStyles } from "@/components/AuthCard";
import { AuthForm } from "@/components/auth-form";
import { signIn } from "@/services/auth-service";

export default function SignInScreen() {
  return (
    <AuthCard title="Connexion" subtitle="Accédez au catalogue des médias de la NASA.">
      <AuthForm submitLabel="Se connecter" onSubmit={signIn} />
      <Link href="/sign-up" style={authStyles.link}>
        Pas encore de compte ? Créer un compte
      </Link>
    </AuthCard>
  );
}
