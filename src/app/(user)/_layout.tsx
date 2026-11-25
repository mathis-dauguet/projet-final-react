import { Slot } from "expo-router";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import { UserSidebar } from "@/components/UserSidebar";
import { COLORS } from "@/constants/theme";

const SIDEBAR_BREAKPOINT = 768;

export default function UserSpaceLayout() {
  const { width } = useWindowDimensions();
  const compact = width < SIDEBAR_BREAKPOINT;

  return (
    <View style={[styles.container, !compact && styles.row]}>
      <UserSidebar compact={compact} />
      <View style={styles.content}>
        <Slot />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  row: { flexDirection: "row" },
  content: { flex: 1 },
});
