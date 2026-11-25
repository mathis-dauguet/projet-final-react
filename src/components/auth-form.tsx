import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
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
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="E-mail"
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        style={styles.input}
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Mot de passe"
        secureTextEntry
        style={styles.input}
      />
      {error !== "" && <Text style={styles.error}>{error}</Text>}
      <Pressable onPress={submit} disabled={sending} style={styles.button}>
        {sending ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonLabel}>{submitLabel}</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  form: { gap: 12 },
  input: {
    borderWidth: 1,
    borderColor: "#D9DCEA",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#FFFFFF",
  },
  error: { color: "#C2410C" },
  button: {
    backgroundColor: "#0B7A70",
    borderRadius: 8,
    padding: 14,
    alignItems: "center",
  },
  buttonLabel: { color: "#FFFFFF", fontWeight: "700", fontSize: 16 },
});
