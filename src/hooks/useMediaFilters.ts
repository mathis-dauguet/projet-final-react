import { useMemo, useState } from "react";

import type { Media, MediaType } from "@/models/media";

export type TypeFilter = "all" | MediaType;

export function useMediaFilters(medias: Media[]) {
  const [search, setSearch] = useState("");
  const [type, setType] = useState<TypeFilter>("all");

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return medias.filter(
      (media) =>
        (type === "all" || media.type === type) &&
        (term === "" || media.name.toLowerCase().includes(term)),
    );
  }, [medias, search, type]);

  return { search, setSearch, type, setType, filtered };
}
