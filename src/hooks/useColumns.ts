import { useWindowDimensions } from "react-native";

export function useColumns() {
  const { width } = useWindowDimensions();

  if (width >= 1024) return 4;
  if (width >= 768) return 3;
  return 1;
}
