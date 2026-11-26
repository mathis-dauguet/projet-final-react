import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Dialog } from "@/components/admin/Dialog";
import { RolePicker } from "@/components/admin/RolePicker";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { COLORS } from "@/constants/theme";
import type { Role, User } from "@/models/user";
import { authErrorMessage } from "@/services/auth-service";
import { createUser, updateUser } from "@/services/users-service";

interface Props {
  // `null` : création, sinon modification de cet utilisateur
  user: User | null;
  // Le rôle ne peut pas être changé (soi-même ou dernier admin, RG-USR-12)
  roleLocked: boolean;
  onClose: () => void;
}

export function UserFormDialog({ user, roleLocked, onClose }: Props) {
  const editing = user !== null;
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>(user?.role ?? "user");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    if (!name.trim()) {
      setError("Le nom est obligatoire.");
      return;
    }
    setError("");
    setSaving(true);
    try {
      if (editing) await updateUser(user.id, { name, role });
      else await createUser({ email, password, name, role });
      onClose();
    } catch (e) {
      setError(authErrorMessage(e));
      setSaving(false);
    }
  };

  return (
    <Dialog visible title={editing ? "Modifier l'utilisateur" : "Nouvel utilisateur"} onClose={onClose}>
      <TextField label="Nom" value={name} onChangeText={setName} placeholder="Nom affiché" />
      <TextField
        label="E-mail"
        value={email}
        onChangeText={setEmail}
        placeholder="nom@exemple.com"
        keyboardType="email-address"
        autoCapitalize="none"
        editable={!editing}
        style={editing && styles.readonly}
      />
      {editing ? (
        <Text style={styles.hint}>L&apos;e-mail et le mot de passe sont gérés par l&apos;utilisateur.</Text>
      ) : (
        <TextField
          label="Mot de passe provisoire"
          value={password}
          onChangeText={setPassword}
          placeholder="6 caractères minimum"
          secureTextEntry
        />
      )}
      <RolePicker value={role} onChange={setRole} disabled={roleLocked} />
      {roleLocked && <Text style={styles.hint}>Vous ne pouvez pas modifier ce rôle (il faut au moins un admin).</Text>}
      {error !== "" && <Text style={styles.error}>{error}</Text>}
      <View style={styles.actions}>
        <Button label="Annuler" variant="ghost" onPress={onClose} />
        <Button label={editing ? "Enregistrer" : "Créer"} onPress={submit} loading={saving} />
      </View>
    </Dialog>
  );
}

const styles = StyleSheet.create({
  readonly: { opacity: 0.6 },
  hint: { color: COLORS.muted, fontSize: 12 },
  error: { color: COLORS.danger },
  actions: { flexDirection: "row", justifyContent: "flex-end", gap: 8, marginTop: 4 },
});
