import { Pressable, StyleSheet, Text, View } from "react-native";

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
    gap: 6,
    paddingVertical: 16,
  },
  button: {
    minWidth: 36,
    height: 36,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#0b3d91",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonActive: {
    backgroundColor: "#0b3d91",
  },
  buttonDisabled: {
    opacity: 0.3,
  },
  label: {
    color: "#0b3d91",
    fontWeight: "600",
  },
  labelActive: {
    color: "#fff",
  },
  dots: {
    color: "#666",
    paddingHorizontal: 4,
  },
});
