import { Stack } from "expo-router";

import { Header } from "@/components/header";
import { CartProvider } from "@/context/cart-context";

export default function RootLayout() {
  return (
    <CartProvider>
      <Stack screenOptions={{ header: () => <Header /> }} />
    </CartProvider>
  );
}
