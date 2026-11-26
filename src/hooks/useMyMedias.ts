import { useAuth } from "@/hooks/useAuth";
import { useAuthorMedias } from "@/hooks/useAuthorMedias";

// Médias publiés par l'utilisateur connecté
export function useMyMedias() {
  const { user } = useAuth();
  return useAuthorMedias(user?.uid ?? null);
}
