import { router, Stack } from "expo-router";
import Head from "expo-router/head";
import { StyleSheet, Text, View } from "react-native";

import { HeaderActions } from "@/components/HeaderActions";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/Button";
import { COLORS } from "@/constants/theme";

export default function NotFound() {
  const goBack = () => (router.canGoBack() ? router.back() : router.replace("/"));

  return (
    <View style={styles.screen}>
      <Stack.Screen
        options={{
          title: "Page introuvable",
          headerTitle: () => <Logo />,
          headerRight: () => (
            <View style={styles.headerRight}>
              <HeaderActions />
            </View>
          ),
        }}
      />
      <Head>
        <title>Page introuvable · Cosmos Gallery</title>
      </Head>

      <Text style={styles.code}>404</Text>
      <Text style={styles.title}>Houston, nous avons un problème</Text>
      <Text style={styles.subtitle}>La page que vous cherchez a été perdue dans l&apos;espace.</Text>
      <View style={styles.actions}>
        <Button label="Retour au catalogue" onPress={() => router.replace("/")} />
        <Button label="Page précédente" variant="secondary" onPress={goBack} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: COLORS.background,
  },
  headerRight: {
    marginRight: 12,
  },
  code: {
    color: COLORS.accent,
    fontSize: 140,
    fontWeight: "800",
    letterSpacing: 4,
    lineHeight: 160,
  },
  title: {
    color: COLORS.text,
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 8,
  },
  subtitle: {
    color: COLORS.muted,
    fontSize: 15,
    textAlign: "center",
    marginTop: 12,
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 12,
    marginTop: 28,
  },
});
