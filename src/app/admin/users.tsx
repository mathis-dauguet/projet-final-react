import Head from "expo-router/head";
import { useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";

import { Dialog } from "@/components/admin/Dialog";
import { UserFormDialog } from "@/components/admin/UserFormDialog";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { COLORS, CONTENT_MAX_WIDTH, RADIUS } from "@/constants/theme";
import { useAuth } from "@/hooks/useAuth";
import { useUsers } from "@/hooks/useUsers";
import { ROLE_LABELS, type User } from "@/models/user";
import { authErrorMessage } from "@/services/auth-service";
import { deleteUser, isLastActiveAdmin, restoreUser } from "@/services/users-service";

type FormState = { mode: "create" } | { mode: "edit"; user: User } | null;

export default function AdminUsersScreen() {
  const { user: me } = useAuth();
  const state = useUsers();
  const users = state.status === "success" ? state.users : [];

  const [search, setSearch] = useState("");
  const [form, setForm] = useState<FormState>(null);
  const [toDelete, setToDelete] = useState<User | null>(null);
  const [actionError, setActionError] = useState("");
  const [busy, setBusy] = useState(false);

  const term = search.trim().toLowerCase();
  const visible = term
    ? users.filter((u) => u.name.toLowerCase().includes(term) || u.email.toLowerCase().includes(term))
    : users;

  // RG-USR-12 : pas de changement de son propre rôle, ni de rétrogradation / suppression du dernier admin
  const roleLocked = (target: User) => target.id === me?.uid || isLastActiveAdmin(users, target);
  const canDelete = (target: User) => target.id !== me?.uid && !isLastActiveAdmin(users, target);

  const run = async (action: () => Promise<void>) => {
    setActionError("");
    setBusy(true);
    try {
      await action();
    } catch (e) {
      setActionError(authErrorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    const target = toDelete;
    setToDelete(null);
    await run(() => deleteUser(target.id));
  };

  return (
    <View style={styles.container}>
      <Head>
        <title>Utilisateurs · Cosmos Gallery</title>
      </Head>
      <FlatList
        data={visible}
        keyExtractor={(u) => u.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={styles.hero}>
            <View style={styles.heroRow}>
              <View style={styles.heroText}>
                <Text style={styles.title}>Utilisateurs</Text>
                <Text style={styles.subtitle}>
                  {users.length} compte{users.length > 1 ? "s" : ""} · {users.filter((u) => u.deleted_at).length} supprimé(s)
                </Text>
              </View>
              <Button label="+ Nouvel utilisateur" onPress={() => setForm({ mode: "create" })} />
            </View>
            <TextField
              label="Rechercher"
              value={search}
              onChangeText={setSearch}
              placeholder="Nom ou e-mail"
              autoCapitalize="none"
            />
            {actionError !== "" && <Text style={styles.error}>{actionError}</Text>}
          </View>
        }
        ListEmptyComponent={
          state.status === "loading" ? (
            <ActivityIndicator style={styles.loader} size="large" color={COLORS.primary} />
          ) : (
            <Text style={[styles.empty, state.status === "error" && styles.error]}>
              {state.status === "error" ? state.message : "Aucun utilisateur trouvé."}
            </Text>
          )
        }
        renderItem={({ item }) => (
          <UserRow
            user={item}
            isMe={item.id === me?.uid}
            canDelete={canDelete(item)}
            busy={busy}
            onEdit={() => setForm({ mode: "edit", user: item })}
            onDelete={() => setToDelete(item)}
            onRestore={() => run(() => restoreUser(item.id))}
          />
        )}
      />

      {form && (
        <UserFormDialog
          key={form.mode === "edit" ? form.user.id : "new"}
          user={form.mode === "edit" ? form.user : null}
          roleLocked={form.mode === "edit" && roleLocked(form.user)}
          onClose={() => setForm(null)}
        />
      )}

      <Dialog visible={toDelete !== null} title="Supprimer ce compte ?" onClose={() => setToDelete(null)}>
        <Text style={styles.confirmText}>
          {toDelete?.name} ({toDelete?.email}) ne pourra plus se connecter. Le compte pourra être restauré.
        </Text>
        <View style={styles.actions}>
          <Button label="Annuler" variant="ghost" onPress={() => setToDelete(null)} />
          <Button label="Supprimer" variant="danger" onPress={confirmDelete} />
        </View>
      </Dialog>
    </View>
  );
}

interface RowProps {
  user: User;
  isMe: boolean;
  canDelete: boolean;
  busy: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onRestore: () => void;
}

function UserRow({ user, isMe, canDelete, busy, onEdit, onDelete, onRestore }: RowProps) {
  const deleted = user.deleted_at !== null;
  return (
    <View style={[styles.row, deleted && styles.rowDeleted]}>
      <View style={styles.rowInfo}>
        <Text style={styles.name} numberOfLines={1}>
          {user.name || "Sans nom"}
          {isMe && <Text style={styles.me}> (vous)</Text>}
        </Text>
        <Text style={styles.email} numberOfLines={1}>
          {user.email}
        </Text>
        <View style={styles.badges}>
          <Text style={[styles.badge, user.role === "admin" && styles.badgeAdmin]}>{ROLE_LABELS[user.role]}</Text>
          {deleted && <Text style={[styles.badge, styles.badgeDeleted]}>Supprimé</Text>}
          <Text style={styles.date}>Inscrit le {user.created_at.toLocaleDateString("fr-FR")}</Text>
        </View>
      </View>
      <View style={styles.rowActions}>
        {deleted ? (
          <Button label="Restaurer" variant="secondary" onPress={onRestore} disabled={busy} />
        ) : (
          <>
            <Button label="Modifier" variant="secondary" onPress={onEdit} disabled={busy} />
            {canDelete && <Button label="Supprimer" variant="danger" onPress={onDelete} disabled={busy} />}
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  list: { width: "100%", maxWidth: CONTENT_MAX_WIDTH, alignSelf: "center", padding: 16, gap: 10 },
  hero: { gap: 16, marginBottom: 8 },
  heroRow: { flexDirection: "row", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12 },
  heroText: { gap: 4 },
  title: { color: COLORS.text, fontSize: 26, fontWeight: "800" },
  subtitle: { color: COLORS.muted, fontSize: 14 },
  loader: { marginTop: 32 },
  empty: { color: COLORS.muted, textAlign: "center", marginTop: 32 },
  error: { color: COLORS.danger },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 12,
    padding: 14,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
  },
  rowDeleted: { opacity: 0.6 },
  rowInfo: { flex: 1, minWidth: 200, gap: 4 },
  name: { color: COLORS.text, fontSize: 16, fontWeight: "700" },
  me: { color: COLORS.muted, fontWeight: "400" },
  email: { color: COLORS.muted, fontSize: 13 },
  badges: { flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: 8, marginTop: 4 },
  badge: {
    color: COLORS.text,
    fontSize: 11,
    fontWeight: "700",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: COLORS.surfaceAlt,
  },
  badgeAdmin: { backgroundColor: COLORS.primary },
  badgeDeleted: { backgroundColor: COLORS.danger },
  date: { color: COLORS.muted, fontSize: 11 },
  rowActions: { flexDirection: "row", gap: 8 },
  confirmText: { color: COLORS.muted, fontSize: 14, lineHeight: 20 },
  actions: { flexDirection: "row", justifyContent: "flex-end", gap: 8 },
});
