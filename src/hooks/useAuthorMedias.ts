import { useMemo } from "react";

import { useCommunityMedias } from "@/hooks/useCommunityMedias";

// Médias publiés par un photographe
export function useAuthorMedias(authorId: string | null) {
  const filters = useMemo(() => (authorId ? { authorId } : null), [authorId]);
  return useCommunityMedias(filters);
}
