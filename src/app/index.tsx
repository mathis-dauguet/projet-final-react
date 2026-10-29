import { Link } from "expo-router";
import { Text, View, StyleSheet } from "react-native";

export default function Index() {
  return (
    <View style={styles.container}>
      <Link href="/catalogue" style={styles.link}>
        <Text style={styles.linkText}>Voir le catalogue</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  link: {
    backgroundColor: "#0b3d91",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  linkText: {
    color: "#fff",
    fontWeight: "600",
  },
});
