import { Stack } from "expo-router";
import Head from "expo-router/head";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { HeaderActions } from "@/components/HeaderActions";
import { Logo } from "@/components/Logo";
import { COLORS } from "@/constants/theme";
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
        <StatusBar style="light" />
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
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        title: "Cosmos Gallery",
        headerStyle: { backgroundColor: COLORS.surface },
        headerTintColor: COLORS.text,
        headerTitleStyle: { fontWeight: "700" },
        headerShadowVisible: false,
        headerBackVisible: false,
        headerLeft: () => null,
        contentStyle: { backgroundColor: COLORS.background },
      }}
    >
      <Stack.Screen name="index" options={{ title: "Catalogue", headerTitle: () => <Logo /> }} />
      <Stack.Protected guard={user !== null}>
        <Stack.Screen
          name="(user)"
          options={{
            title: "Espace utilisateur",
            headerTitle: () => <Logo />,
            headerRight: () => (
              <View style={styles.headerRight}>
                <HeaderActions />
              </View>
            ),
          }}
        />
      </Stack.Protected>
      <Stack.Protected guard={user === null}>
        <Stack.Screen name="(auth)/sign-in" options={{ title: "Connexion", headerTitle: () => <Logo /> }} />
        <Stack.Screen name="(auth)/sign-up" options={{ title: "Inscription", headerTitle: () => <Logo /> }} />
      </Stack.Protected>
    </Stack>
  );
}

const styles = StyleSheet.create({
  headerRight: { marginRight: 12 },
  loading: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: COLORS.background },
});
