import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "@/constants/theme";

export function Logo() {
  return (
    <View style={styles.row}>
      <View style={styles.dot} />
      <Text style={styles.name}>Cosmos Gallery</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 10 },
  dot: { width: 24, height: 24, borderRadius: 12, backgroundColor: COLORS.accent },
  name: { color: COLORS.text, fontSize: 17, fontWeight: "700" },
});
