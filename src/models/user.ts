// Rôles disponibles pour l'instant. `photographer` sera ajouté plus tard (voir _docs/roles-et-permissions.md).
export const ROLES = ["user", "admin"] as const;
export type Role = (typeof ROLES)[number];

export const ROLE_LABELS: Record<Role, string> = {
  user: "Utilisateur",
  admin: "Administrateur",
};

export function isRole(value: unknown): value is Role {
  return typeof value === "string" && (ROLES as readonly string[]).includes(value);
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}

// Utilisateur connecté : compte Firebase Auth + profil Firestore (users/{uid})
export type AppUser = {
  uid: string;
  email: string;
  name: string;
  role: Role;
};
