import { Link } from "expo-router";
import { AuthCard, authStyles } from "@/components/AuthCard";
import { AuthForm } from "@/components/auth-form";
import { signUp } from "@/services/auth-service";

export default function SignUpScreen() {
  return (
    <AuthCard title="Créer un compte" subtitle="Enregistrez vos médias favoris de l'univers.">
      <AuthForm submitLabel="S'inscrire" onSubmit={signUp} />
      <Link href="/sign-in" style={authStyles.link}>
        Déjà un compte ? Se connecter
      </Link>
    </AuthCard>
  );
}
