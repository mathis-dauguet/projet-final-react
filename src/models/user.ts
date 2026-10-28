export const ROLES = ["user", "admin", "photographer"] as const;
export type Role = (typeof ROLES)[number];

export interface User {
  id: string;
  name: string;
  role: Role;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}
