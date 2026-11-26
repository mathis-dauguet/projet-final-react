import { useEffect, useState } from "react";

import type { User } from "@/models/user";
import { subscribeToUsers } from "@/services/users-service";

export type UsersState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; users: User[] };

export function useUsers(): UsersState {
  const [state, setState] = useState<UsersState>({ status: "loading" });

  useEffect(() => {
    return subscribeToUsers(
      (users) => setState({ status: "success", users }),
      () => setState({ status: "error", message: "Impossible de charger les utilisateurs." }),
    );
  }, []);

  return state;
}
