import { useEffect, useState } from "react";

import type { Media } from "@/models/media";
import { searchMedias } from "@/services/nasa";

const DEFAULT_QUERY = "space";

export function useMedias() {
  const [medias, setMedias] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    searchMedias({ q: DEFAULT_QUERY })
      .then((result) => {
        if (!cancelled) setMedias(result);
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Erreur inconnue");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { medias, loading, error };
}
