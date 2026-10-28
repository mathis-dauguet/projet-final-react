import { useWindowDimensions } from "react-native";

export function useColumns() {
  const { width } = useWindowDimensions();

  if (width < 600) return 1;
  if (width < 900) return 2;
  if (width < 1200) return 3;
  
  return 4;
}
