import { Pressable, StyleSheet, Text, View } from "react-native";

import { TYPE_LABELS } from "@/components/MediaCard";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { COLORS, RADIUS } from "@/constants/theme";
import type { TypeFilter } from "@/hooks/useMediaFilters";
import { MEDIA_TYPES } from "@/models/media";

const TYPE_FILTERS: TypeFilter[] = ["all", ...MEDIA_TYPES];

interface Props {
  search: string;
  onSearchChange: (value: string) => void;
  type: TypeFilter;
  onTypeChange: (value: TypeFilter) => void;
}

export function MediaFilters({ search, onSearchChange, type, onTypeChange }: Props) {
  const reset = () => {
    onSearchChange("");
    onTypeChange("all");
  };

  return (
    <View style={styles.container}>
      <TextField
        label="Recherche"
        containerStyle={styles.search}
        value={search}
        onChangeText={onSearchChange}
        placeholder="Mot-clé (lune, mars, galaxie…)"
        autoCorrect={false}
        clearButtonMode="while-editing"
      />
      <View style={styles.typeGroup}>
        <Text style={styles.label}>Type de média</Text>
        <View style={styles.chips}>
          {TYPE_FILTERS.map((value) => {
            const active = value === type;
            return (
              <Pressable
                key={value}
                onPress={() => onTypeChange(value)}
                style={[styles.chip, active && styles.chipActive]}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>
                  {value === "all" ? "Tous" : TYPE_LABELS[value]}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
      <Button label="Réinitialiser" variant="secondary" onPress={reset} style={styles.reset} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-end",
    gap: 16,
    padding: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
  },
  search: {
    flexGrow: 1,
    flexBasis: 240,
  },
  typeGroup: {
    gap: 6,
  },
  label: {
    color: COLORS.muted,
    fontSize: 12,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surfaceAlt,
  },
  chipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipText: {
    color: COLORS.muted,
    fontSize: 14,
  },
  chipTextActive: {
    color: COLORS.text,
    fontWeight: "600",
  },
  reset: {
    paddingVertical: 9,
  },
});
