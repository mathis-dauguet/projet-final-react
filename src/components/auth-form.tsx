import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { COLORS } from "@/constants/theme";
import { authErrorMessage } from "@/services/auth-service";

type AuthFormProps = {
  submitLabel: string;
  onSubmit: (email: string, password: string, name: string) => Promise<void>;
  withName?: boolean;
};

export function AuthForm({ submitLabel, onSubmit, withName = false }: AuthFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  const submit = async () => {
    setError("");
    setSending(true);
    try {
      await onSubmit(email.trim(), password, name.trim());
    } catch (e) {
      setError(authErrorMessage(e));
    } finally {
      setSending(false);
    }
  };

  return (
    <View style={styles.form}>
      {withName && (
        <TextField label="Nom" value={name} onChangeText={setName} placeholder="Votre nom" autoComplete="name" />
      )}
      <TextField
        label="E-mail"
        value={email}
        onChangeText={setEmail}
        placeholder="nom@exemple.com"
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
      />
      <TextField
        label="Mot de passe"
        value={password}
        onChangeText={setPassword}
        placeholder="••••••••"
        secureTextEntry
        onSubmitEditing={submit}
      />
      {error !== "" && <Text style={styles.error}>{error}</Text>}
      <Button label={submitLabel} onPress={submit} loading={sending} style={styles.button} />
    </View>
  );
}

const styles = StyleSheet.create({
  form: { gap: 16 },
  error: { color: COLORS.danger },
  button: { paddingVertical: 12, marginTop: 4 },
});
