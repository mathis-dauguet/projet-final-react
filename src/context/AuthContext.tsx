import { createContext, type ReactNode, useEffect, useState } from "react";
import type { AppUser } from "@/models/user";
import { subscribeToAuth } from "@/services/auth-service";

export type AuthContextValue = {
  user: AppUser | null;
  initializing: boolean;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToAuth((current) => {
      setUser(current);
      setInitializing(false);
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, initializing }}>
      {children}
    </AuthContext.Provider>
  );
}
