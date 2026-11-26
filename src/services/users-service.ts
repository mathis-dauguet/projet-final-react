import { type FirebaseApp, initializeApp } from "firebase/app";
import {
  type Auth,
  createUserWithEmailAndPassword,
  initializeAuth,
  inMemoryPersistence,
  signOut as firebaseSignOut,
} from "firebase/auth";
import {
  collection,
  doc,
  type DocumentData,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  setDoc,
  updateDoc,
} from "firebase/firestore";

import { isRole, type Role, type User } from "@/models/user";
import { db, firebaseConfig } from "@/services/firebase";

const usersCol = collection(db, "users");

function userRef(uid: string) {
  return doc(usersCol, uid);
}

function toDate(value: unknown): Date | null {
  return typeof value === "number" ? new Date(value) : null;
}

export function toUser(id: string, data: DocumentData): User {
  const created = toDate(data.created_at) ?? new Date(0);
  return {
    id,
    email: data.email ?? "",
    name: data.name ?? "",
    role: isRole(data.role) ? data.role : "user",
    created_at: created,
    updated_at: toDate(data.updated_at) ?? created,
    deleted_at: toDate(data.deleted_at),
  };
}

function defaultName(email: string): string {
  return email.split("@")[0] ?? "";
}

function newProfile(email: string, name: string, role: Role) {
  const now = Date.now();
  return {
    email,
    name: name.trim() || defaultName(email),
    role,
    created_at: now,
    updated_at: now,
    deleted_at: null,
  };
}

// ---------- Profil de l'utilisateur connecté ----------

export async function getUser(uid: string): Promise<User | null> {
  const snapshot = await getDoc(userRef(uid));
  return snapshot.exists() ? toUser(snapshot.id, snapshot.data()) : null;
}

export function subscribeToUser(uid: string, onChange: (user: User | null) => void, onError: (error: Error) => void) {
  return onSnapshot(
    userRef(uid),
    (snapshot) => onChange(snapshot.exists() ? toUser(snapshot.id, snapshot.data()) : null),
    onError,
  );
}

// Crée le profil s'il n'existe pas encore (inscription, ou compte créé avant l'ajout des rôles).
// RG-USR-02 : un profil créé par l'utilisateur lui-même a toujours le rôle `user`.
export async function ensureOwnProfile(uid: string, email: string) {
  await runTransaction(db, async (tx) => {
    const snapshot = await tx.get(userRef(uid));
    if (!snapshot.exists()) tx.set(userRef(uid), newProfile(email, "", "user"));
  });
}

export async function updateOwnName(uid: string, name: string) {
  await updateDoc(userRef(uid), { name: name.trim(), updated_at: Date.now() });
}

// ---------- Administration (CRUD) ----------

export function subscribeToUsers(onChange: (users: User[]) => void, onError: (error: Error) => void) {
  return onSnapshot(
    query(usersCol, orderBy("created_at", "desc")),
    (snapshot) => onChange(snapshot.docs.map((d) => toUser(d.id, d.data()))),
    onError,
  );
}

// createUserWithEmailAndPassword connecte automatiquement le compte créé.
// On passe donc par une seconde instance Firebase, sans persistance, pour que l'admin reste connecté.
let secondary: { app: FirebaseApp; auth: Auth } | null = null;

function secondaryAuth(): Auth {
  if (!secondary) {
    const app = initializeApp(firebaseConfig, "admin-user-creation");
    secondary = { app, auth: initializeAuth(app, { persistence: inMemoryPersistence }) };
  }
  return secondary.auth;
}

export type UserInput = { email: string; password: string; name: string; role: Role };

export async function createUser({ email, password, name, role }: UserInput) {
  const auth = secondaryAuth();
  const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
  try {
    // Écrit par l'admin (instance principale) : les règles Firestore l'autorisent à choisir le rôle
    await setDoc(userRef(credential.user.uid), newProfile(email.trim(), name, role));
  } finally {
    await firebaseSignOut(auth);
  }
}

export async function updateUser(uid: string, changes: { name: string; role: Role }) {
  await updateDoc(userRef(uid), { name: changes.name.trim(), role: changes.role, updated_at: Date.now() });
}

// RG-USR-10 : suppression logique
export async function deleteUser(uid: string) {
  const now = Date.now();
  await updateDoc(userRef(uid), { deleted_at: now, updated_at: now });
}

export async function restoreUser(uid: string) {
  await updateDoc(userRef(uid), { deleted_at: null, updated_at: Date.now() });
}

// RG-USR-12 : on garde toujours au moins un admin actif, et un admin ne peut pas se rétrograder ni se supprimer
export function isLastActiveAdmin(users: User[], target: User): boolean {
  if (target.role !== "admin" || target.deleted_at) return false;
  return users.filter((u) => u.role === "admin" && !u.deleted_at).length <= 1;
}
