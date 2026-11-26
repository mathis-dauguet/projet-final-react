import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";

import { useAuth } from "@/hooks/useAuth";
import { ROLES, type Role } from "@/models/user";
import { db } from "@/services/firebase";

// Lit le rôle de l'utilisateur connecté dans users/{uid}, en temps réel.
// À remplacer par le rôle fourni par useAuth() quand l'inscription l'enregistrera.
export function useUserRole(): { role: Role | null; loading: boolean } {
  const { user } = useAuth();
  const uid = user?.uid ?? null;
  const [state, setState] = useState<{ uid: string; role: Role | null } | null>(null);

  useEffect(() => {
    if (!uid) return;
    return onSnapshot(
      doc(db, "users", uid),
      (snapshot) => {
        const role = snapshot.get("role");
        setState({ uid, role: ROLES.includes(role) ? role : null });
      },
      () => setState({ uid, role: null }),
    );
  }, [uid]);

  if (!uid) return { role: null, loading: false };
  const ready = state?.uid === uid;
  return { role: ready ? state.role : null, loading: !ready };
}
