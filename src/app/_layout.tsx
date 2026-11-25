import { Stack } from "expo-router";
import Head from "expo-router/head";
import { FavoritesProvider } from "@/context/FavoritesContext";

export default function RootLayout() {
  return (
    <FavoritesProvider>
      <Head>
        <title>Cosmos Gallery</title>
      </Head>
      <Stack screenOptions={{ title: "Cosmos Gallery" }} />
    </FavoritesProvider>
  );
}
