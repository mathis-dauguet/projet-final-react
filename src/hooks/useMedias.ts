import { useEffect, useState } from "react";

import type { Media } from "@/models/media";
import { searchMedias, type SearchParams } from "@/services/nasa";

interface Result {
  key: string;
  medias: Media[];
  total_pages: number;
  error: string | null;
}

function sortByDateDesc(medias: Media[]): Media[] {
  return [...medias].sort((a, b) => b.created_at.getTime() - a.created_at.getTime());
}

export function useMedias(params: SearchParams) {
  const key = JSON.stringify(params);
  const [result, setResult] = useState<Result | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    searchMedias(params, controller.signal)
      .then(({ medias, total_pages }) =>
        setResult({ key, medias: sortByDateDesc(medias), total_pages, error: null }),
      )
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;
        setResult({ key, medias: [], total_pages: 0, error: err instanceof Error ? err.message : "Erreur inconnue" });
      });

    return () => controller.abort();
  }, [key, params]);

  return {
    medias: result?.medias ?? [],
    totalPages: result?.total_pages ?? 0,
    loading: result?.key !== key,
    error: result?.error ?? null,
  };
}
