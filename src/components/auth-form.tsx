import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { COLORS } from "@/constants/theme";
import { authErrorMessage } from "@/services/auth-service";

type AuthFormProps = {
  submitLabel: string;
  onSubmit: (email: string, password: string) => Promise<void>;
};

export function AuthForm({ submitLabel, onSubmit }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  const submit = async () => {
    setError("");
    setSending(true);
    try {
      await onSubmit(email.trim(), password);
    } catch (e) {
      setError(authErrorMessage(e));
    } finally {
      setSending(false);
    }
  };

  return (
    <View style={styles.form}>
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
