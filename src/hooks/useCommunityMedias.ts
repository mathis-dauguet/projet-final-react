import type { QueryDocumentSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";

import type { Media } from "@/models/media";
import { deleteMedia, listMedias } from "@/services/community-medias";

interface State {
  authorId: string;
  medias: Media[];
  cursor: QueryDocumentSnapshot | null;
  error: string | null;
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Impossible de charger les médias.";
}

// Médias publiés par un photographe, du plus récent au plus ancien, par pages
export function useAuthorMedias(authorId: string | null) {
  const [state, setState] = useState<State | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    if (!authorId) return;
    let cancelled = false;
    listMedias({ authorId })
      .then(({ medias, cursor }) => {
        if (!cancelled) setState({ authorId, medias, cursor, error: null });
      })
      .catch((err: unknown) => {
        if (!cancelled) setState({ authorId, medias: [], cursor: null, error: errorMessage(err) });
      });
    return () => {
      cancelled = true;
    };
  }, [authorId]);

  const ready = authorId !== null && state?.authorId === authorId;

  async function loadMore() {
    if (!authorId || !state?.cursor || loadingMore) return;
    setLoadingMore(true);
    try {
      const page = await listMedias({ authorId, cursor: state.cursor });
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
    loading: authorId !== null && !ready,
    error: ready ? state.error : null,
    hasMore: ready && state.cursor !== null,
    loadingMore,
    loadMore,
    remove,
  };
}
