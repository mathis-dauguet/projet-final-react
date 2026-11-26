import { createContext, type ReactNode, useEffect, useState } from "react";
import type { AppUser, User } from "@/models/user";
import { type AuthAccount, signOut, subscribeToAuth } from "@/services/auth-service";
import { ensureOwnProfile, subscribeToUser } from "@/services/users-service";

export type AuthContextValue = {
  user: AppUser | null;
  isAdmin: boolean;
  initializing: boolean;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

type ProfileState = { uid: string; profile: User | null };

export function AuthProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<AuthAccount | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [profileState, setProfileState] = useState<ProfileState | null>(null);
  const [booted, setBooted] = useState(false);

  useEffect(() => {
    return subscribeToAuth((current) => {
      setAccount(current);
      setAuthReady(true);
    });
  }, []);

  // Profil Firestore (rôle, nom) suivi en temps réel : un changement de rôle par un admin s'applique tout de suite
  useEffect(() => {
    if (!account) return;
    const { uid, email } = account;
    return subscribeToUser(
      uid,
      (profile) => {
        if (!profile) {
          // Compte créé avant l'ajout des rôles : on lui crée son profil `user`
          ensureOwnProfile(uid, email).catch(() => setProfileState({ uid, profile: null }));
          return;
        }
        if (profile.deleted_at) signOut();
        setProfileState({ uid, profile });
      },
      () => setProfileState({ uid, profile: null }),
    );
  }, [account]);

  const profile = account && profileState?.uid === account.uid ? profileState.profile : undefined;
  const profileLoading = account !== null && profile === undefined;

  // Le spinner plein écran ne s'affiche qu'au démarrage : à la connexion, l'écran reste monté
  // (sinon le message d'erreur du formulaire serait perdu)
  if (!booted && authReady && !profileLoading) setBooted(true);

  // Profil illisible (erreur réseau, règles) : on retombe sur le rôle le moins privilégié
  const user: AppUser | null =
    account && profile !== undefined && !profile?.deleted_at
      ? {
          uid: account.uid,
          email: account.email,
          name: profile?.name ?? "",
          role: profile?.role ?? "user",
        }
      : null;

  return (
    <AuthContext.Provider value={{ user, isAdmin: user?.role === "admin", initializing: !booted }}>
      {children}
    </AuthContext.Provider>
  );
}
