import { useEffect, useState } from "react";

import type { Media } from "@/models/media";
import { searchMedias, type SearchParams } from "@/services/nasa";

interface Result {
  key: string;
  medias: Media[];
  total_pages: number;
  total_hits: number;
  error: string | null;
}

function sortByDateDesc(medias: Media[]): Media[] {
  return [...medias].sort((a, b) => b.created_at.getTime() - a.created_at.getTime());
}

// Avec params à null, rien n'est chargé (par exemple quand le catalogue n'affiche que la communauté)
export function useMedias(params: SearchParams | null) {
  const key = params ? JSON.stringify(params) : null;
  const [result, setResult] = useState<Result | null>(null);

  useEffect(() => {
    if (!key || !params) return;
    const controller = new AbortController();

    searchMedias(params, controller.signal)
      .then(({ medias, total_pages, total_hits }) =>
        setResult({ key, medias: sortByDateDesc(medias), total_pages, total_hits, error: null }),
      )
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;
        setResult({ key, medias: [], total_pages: 0, total_hits: 0, error: err instanceof Error ? err.message : "Erreur inconnue" });
      });

    return () => controller.abort();
  }, [key, params]);

  return {
    medias: result?.medias ?? [],
    totalPages: result?.total_pages ?? 0,
    totalHits: result?.total_hits ?? 0,
    loading: key !== null && result?.key !== key,
    error: result?.error ?? null,
  };
}
