import type { QueryDocumentSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";

import type { Media, MediaType } from "@/models/media";
import { deleteMedia, listMedias } from "@/services/community-medias";

export interface CommunityFilters {
  authorId?: string;
  type?: MediaType;
}

interface State {
  key: string;
  medias: Media[];
  cursor: QueryDocumentSnapshot | null;
  error: string | null;
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Impossible de charger les médias.";
}

// Médias publiés par les photographes, du plus récent au plus ancien, par pages.
// Avec filters à null, rien n'est chargé (par exemple quand le catalogue n'affiche que la NASA).
// filters doit être mémorisé (useMemo) pour ne pas relancer la requête à chaque rendu.
export function useCommunityMedias(filters: CommunityFilters | null) {
  const key = filters ? JSON.stringify(filters) : null;
  const [state, setState] = useState<State | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    if (!key || !filters) return;
    let cancelled = false;
    listMedias(filters)
      .then(({ medias, cursor }) => {
        if (!cancelled) setState({ key, medias, cursor, error: null });
      })
      .catch((err: unknown) => {
        if (!cancelled) setState({ key, medias: [], cursor: null, error: errorMessage(err) });
      });
    return () => {
      cancelled = true;
    };
  }, [key, filters]);

  const ready = key !== null && state?.key === key;

  async function loadMore() {
    if (!filters || !state?.cursor || loadingMore) return;
    setLoadingMore(true);
    try {
      const page = await listMedias({ ...filters, cursor: state.cursor });
      setState((current) => current && { ...current, medias: [...current.medias, ...page.medias], cursor: page.cursor });
    } catch (err) {
      setState((current) => current && { ...current, error: errorMessage(err) });
    } finally {
      setLoadingMore(false);
    }
  }

  async function remove(id: string) {
    await deleteMedia(id);
    setState((current) => current && { ...current, medias: current.medias.filter((media) => media.id !== id) });
  }

  return {
    medias: ready ? state.medias : [],
    loading: key !== null && !ready,
    error: ready ? state.error : null,
    hasMore: ready && state.cursor !== null,
    loadingMore,
    loadMore,
    remove,
  };
}
