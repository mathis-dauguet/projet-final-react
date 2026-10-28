import { ShoppingCart } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";

import { useCart } from "@/context/cart-context";
import { formatPrice } from "@/utils/format-price";

export function Cart() {
  const { total } = useCart();

  return (
    <View style={styles.cart}>
      <ShoppingCart size={22} color="#111" />
      <Text style={styles.total}>{formatPrice(total)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  cart: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  total: {
    fontSize: 16,
    fontWeight: "600",
  },
});
