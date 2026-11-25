import { Pressable, StyleSheet, Text, View } from "react-native";
import { COLORS, RADIUS } from "@/constants/theme";

interface Props {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

function getPages(page: number, totalPages: number): (number | "…")[] {
  const pages: (number | "…")[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || Math.abs(i - page) <= 1) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "…") {
      pages.push("…");
    }
  }
  return pages;
}

export function Pagination({ page, totalPages, onChange }: Props) {
  if (totalPages <= 1) return null;

  return (
    <View style={styles.container}>
      <PageButton label="‹" disabled={page === 1} onPress={() => onChange(page - 1)} />
      {getPages(page, totalPages).map((value, index) =>
        value === "…" ? (
          <Text key={`dots-${index}`} style={styles.dots}>
            …
          </Text>
        ) : (
          <PageButton key={value} label={String(value)} active={value === page} onPress={() => onChange(value)} />
        ),
      )}
      <PageButton label="›" disabled={page === totalPages} onPress={() => onChange(page + 1)} />
    </View>
  );
}

interface PageButtonProps {
  label: string;
  onPress: () => void;
  active?: boolean;
  disabled?: boolean;
}

function PageButton({ label, onPress, active, disabled }: PageButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || active}
      style={[styles.button, active && styles.buttonActive, disabled && styles.buttonDisabled]}
    >
      <Text style={[styles.label, active && styles.labelActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    paddingVertical: 24,
  },
  button: {
    minWidth: 34,
    height: 33,
    paddingHorizontal: 10,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  label: {
    color: COLORS.muted,
    fontWeight: "600",
  },
  labelActive: {
    color: COLORS.text,
  },
  dots: {
    color: COLORS.muted,
    paddingHorizontal: 4,
  },
});
