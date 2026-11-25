import { router, type Href } from "expo-router";
import { useRef, useState, type ComponentRef, type ReactNode } from "react";
import { Dimensions, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { COLORS, RADIUS } from "@/constants/theme";
import { useFavorites } from "@/hooks/useFavorites";
import { signOut } from "@/services/auth-service";

interface Anchor {
  top: number;
  right: number;
}

export function AccountMenu() {
  const { favorites } = useFavorites();
  const buttonRef = useRef<ComponentRef<typeof Pressable>>(null);
  const [anchor, setAnchor] = useState<Anchor | null>(null);

  const open = () => {
    buttonRef.current?.measureInWindow((x, y, width, height) => {
      const windowWidth = Dimensions.get("window").width;
      setAnchor({ top: y + height + 6, right: windowWidth - (x + width) });
    });
  };
  const close = () => setAnchor(null);

  const go = (href: Href) => {
    close();
    router.push(href);
  };

  return (
    <>
      <Pressable ref={buttonRef} onPress={open} style={styles.button}>
        <Text style={styles.buttonLabel}>Compte</Text>
        <Text style={styles.caret}>{anchor ? "▴" : "▾"}</Text>
      </Pressable>

      <Modal visible={anchor !== null} transparent animationType="fade" onRequestClose={close}>
        <Pressable style={StyleSheet.absoluteFill} onPress={close} />
        {anchor && (
          <View style={[styles.menu, anchor]}>
            <MenuItem onPress={() => go("/favoris")}>
              <Text style={styles.star}>★ </Text>
              <Text style={styles.itemLabel}>Mes favoris</Text>
              <Text style={styles.count}>{favorites.length}</Text>
            </MenuItem>
            <MenuItem onPress={() => go("/account")}>
              <Text style={styles.itemLabel}>Mon compte</Text>
            </MenuItem>
            <View style={styles.divider} />
            <MenuItem
              onPress={() => {
                close();
                signOut();
              }}
            >
              <Text style={[styles.itemLabel, styles.danger]}>Se déconnecter</Text>
            </MenuItem>
          </View>
        )}
      </Modal>
    </>
  );
}

function MenuItem({ onPress, children }: { onPress: () => void; children: ReactNode }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.item, pressed && styles.itemPressed]}>
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: COLORS.primary,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: RADIUS.sm,
  },
  buttonLabel: { color: COLORS.text, fontWeight: "600" },
  caret: { color: COLORS.text, fontSize: 11 },
  menu: {
    position: "absolute",
    minWidth: 200,
    paddingVertical: 6,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  itemPressed: { backgroundColor: COLORS.surfaceAlt },
  itemLabel: { flex: 1, color: COLORS.text, fontSize: 14 },
  star: { color: COLORS.accent },
  count: {
    color: COLORS.muted,
    fontSize: 12,
    fontWeight: "600",
    backgroundColor: COLORS.surfaceAlt,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    overflow: "hidden",
  },
  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: 6 },
  danger: { color: COLORS.danger },
});
