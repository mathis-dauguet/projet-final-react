import { Stack } from "expo-router";
import Head from "expo-router/head";

export default function RootLayout() {
  return (
    <>
      <Head>
        <title>Cosmos Gallery</title>
      </Head>
      <Stack screenOptions={{ title: "Cosmos Gallery" }} />
    </>
  );
}
