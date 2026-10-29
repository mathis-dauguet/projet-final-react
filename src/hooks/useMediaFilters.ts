import { useMemo, useState } from "react";

import { useDebounce } from "@/hooks/useDebounce";
import type { MediaType } from "@/models/media";
import type { SearchParams } from "@/services/nasa";

export type TypeFilter = "all" | MediaType;

const DEFAULT_QUERY = "space";
const SEARCH_DELAY_MS = 400;

export function useMediaFilters() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState<TypeFilter>("all");
  const debouncedSearch = useDebounce(search.trim().toLowerCase(), SEARCH_DELAY_MS);

  const params = useMemo<SearchParams>(
    () => ({
      q: debouncedSearch || DEFAULT_QUERY,
      media_type: type === "all" ? undefined : type,
    }),
    [debouncedSearch, type],
  );

  return { search, setSearch, type, setType, params };
}
