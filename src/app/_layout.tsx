import { Stack } from "expo-router";
import Head from "expo-router/head";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { AuthProvider } from "@/context/AuthContext";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { useAuth } from "@/hooks/useAuth";

export default function RootLayout() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <Head>
          <title>Cosmos Gallery</title>
        </Head>
        <RootStack />
      </FavoritesProvider>
    </AuthProvider>
  );
}

function RootStack() {
  const { user, initializing } = useAuth();

  if (initializing) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ title: "Cosmos Gallery" }}>
      <Stack.Protected guard={user !== null}>
        <Stack.Screen name="index" />
        <Stack.Screen name="catalogue" />
        <Stack.Screen name="account" options={{ title: "Compte" }} />
      </Stack.Protected>
      <Stack.Protected guard={user === null}>
        <Stack.Screen name="(auth)/sign-in" options={{ title: "Connexion" }} />
        <Stack.Screen name="(auth)/sign-up" options={{ title: "Inscription" }} />
      </Stack.Protected>
    </Stack>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, alignItems: "center", justifyContent: "center" },
});
