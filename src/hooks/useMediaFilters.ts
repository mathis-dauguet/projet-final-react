import { useMemo, useState } from "react";

import { useDebounce } from "@/hooks/useDebounce";
import type { MediaType } from "@/models/media";
import { PAGE_SIZE, type SearchParams } from "@/services/nasa";

export type TypeFilter = "all" | MediaType;

const DEFAULT_QUERY = "space";
const SEARCH_DELAY_MS = 400;

export function useMediaFilters() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState<TypeFilter>("all");
  const debouncedSearch = useDebounce(search.trim().toLowerCase(), SEARCH_DELAY_MS);

  // La page est liée aux filtres : si un filtre change, on revient à la page 1
  const filtersKey = `${debouncedSearch}|${type}`;
  const [pageState, setPageState] = useState({ filtersKey, page: 1 });
  const page = pageState.filtersKey === filtersKey ? pageState.page : 1;
  const setPage = (value: number) => setPageState({ filtersKey, page: value });

  const params = useMemo<SearchParams>(
    () => ({
      q: debouncedSearch || DEFAULT_QUERY,
      media_type: type === "all" ? undefined : type,
      page,
      page_size: PAGE_SIZE,
    }),
    [debouncedSearch, type, page],
  );

  return { search, setSearch, type, setType, page, setPage, params };
}
