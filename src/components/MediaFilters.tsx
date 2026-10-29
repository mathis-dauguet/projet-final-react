import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { TYPE_LABELS } from "@/components/MediaCard";
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
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={search}
        onChangeText={onSearchChange}
        placeholder="Rechercher un média…"
        autoCorrect={false}
        clearButtonMode="while-editing"
      />
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
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
    padding: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 15,
    backgroundColor: "#fff",
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#0b3d91",
  },
  chipActive: {
    backgroundColor: "#0b3d91",
  },
  chipText: {
    color: "#0b3d91",
  },
  chipTextActive: {
    color: "#fff",
  },
});
