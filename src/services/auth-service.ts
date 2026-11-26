import { FirebaseError } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  User,
} from "firebase/auth";
import { auth } from "@/services/firebase";
import { ensureOwnProfile, getUser, updateOwnName } from "@/services/users-service";

export type AuthAccount = { uid: string; email: string };

const DISABLED_ACCOUNT = "app/account-disabled";

function toAccount(user: User): AuthAccount {
  return { uid: user.uid, email: user.email ?? "" };
}

export function subscribeToAuth(onChange: (account: AuthAccount | null) => void) {
  return onAuthStateChanged(auth, (user) => onChange(user ? toAccount(user) : null));
}

// RG-USR-01/02 : le profil créé à l'inscription a le rôle `user`
export async function signUp(email: string, password: string, name = "") {
  const { user } = await createUserWithEmailAndPassword(auth, email, password);
  await ensureOwnProfile(user.uid, email);
  if (name.trim()) await updateOwnName(user.uid, name);
}

// RG-USR-10 : un compte supprimé (deleted_at) ne peut plus se connecter
export async function signIn(email: string, password: string) {
  const { user } = await signInWithEmailAndPassword(auth, email, password);
  const profile = await getUser(user.uid);
  if (profile?.deleted_at) {
    await firebaseSignOut(auth);
    throw new FirebaseError(DISABLED_ACCOUNT, "Compte désactivé");
  }
}

export async function signOut() {
  await firebaseSignOut(auth);
}

export function authErrorMessage(error: unknown): string {
  const code = error instanceof FirebaseError ? error.code : "";
  switch (code) {
    case "auth/invalid-email":
      return "Adresse e-mail invalide.";
    case "auth/invalid-credential":
      return "E-mail ou mot de passe incorrect.";
    case "auth/email-already-in-use":
      return "Un compte existe déjà avec cette adresse.";
    case "permission-denied":
      return "Action non autorisée.";
    case DISABLED_ACCOUNT:
      return "Ce compte a été désactivé par un administrateur.";
    case "auth/weak-password":
      return "Mot de passe trop court : 6 caractères au moins.";
    default:
      return "Une erreur est survenue. Réessayez.";
  }
}
