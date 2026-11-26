import { Link, usePathname, type Href } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { COLORS, RADIUS } from "@/constants/theme";
import { useAuth } from "@/hooks/useAuth";
import { useFavorites } from "@/hooks/useFavorites";

type Item = { href: Href; path: string; icon: string; label: string; count?: number };

export function UserSidebar({ compact }: { compact: boolean }) {
  const { user, isAdmin } = useAuth();
  const { favorites } = useFavorites();
  const pathname = usePathname();

  const items: Item[] = [
    { href: "/account", path: "/account", icon: "◉", label: "Mon compte" },
    { href: "/favoris", path: "/favoris", icon: "★", label: "Mes favoris", count: favorites.length },
    ...(isAdmin ? [{ href: "/admin/users", path: "/admin/users", icon: "⚙", label: "Utilisateurs" } as Item] : []),
  ];

  return (
    <View style={[styles.sidebar, compact && styles.sidebarCompact]}>
      {!compact && (
        <View style={styles.profile}>
          <Text style={styles.section}>{isAdmin ? "Administrateur" : "Espace utilisateur"}</Text>
          <Text style={styles.email} numberOfLines={1}>
            {user?.email}
          </Text>
        </View>
      )}
      <View style={[styles.nav, compact && styles.navCompact]}>
        {items.map((item) => {
          const active = pathname === item.path;
          return (
            <Link key={item.path} href={item.href} replace style={[styles.item, active && styles.itemActive]}>
              <Text style={[styles.icon, active && styles.iconActive]}>{item.icon} </Text>
              <Text style={[styles.label, active && styles.labelActive]}>{item.label}</Text>
              {item.count !== undefined && <Text style={styles.count}> {item.count}</Text>}
            </Link>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    width: 240,
    padding: 16,
    gap: 24,
    backgroundColor: COLORS.surface,
    borderRightWidth: 1,
    borderRightColor: COLORS.border,
  },
  sidebarCompact: {
    width: "100%",
    paddingVertical: 8,
    borderRightWidth: 0,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  profile: { gap: 4, paddingHorizontal: 8 },
  section: { color: COLORS.muted, fontSize: 12, textTransform: "uppercase", letterSpacing: 1 },
  email: { color: COLORS.text, fontSize: 14, fontWeight: "600" },
  nav: { gap: 4 },
  navCompact: { flexDirection: "row", gap: 8 },
  item: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: RADIUS.sm,
  },
  itemActive: { backgroundColor: COLORS.surfaceAlt },
  icon: { color: COLORS.muted },
  iconActive: { color: COLORS.accent },
  label: { color: COLORS.muted, fontSize: 14, fontWeight: "600" },
  labelActive: { color: COLORS.text },
  count: { color: COLORS.muted, fontSize: 12 },
});
