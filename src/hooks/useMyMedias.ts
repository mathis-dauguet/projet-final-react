import type { QueryDocumentSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";

import { useAuth } from "@/hooks/useAuth";
import type { Media } from "@/models/media";
import { deleteMedia, listMedias } from "@/services/community-medias";

interface State {
  uid: string;
  medias: Media[];
  cursor: QueryDocumentSnapshot | null;
  error: string | null;
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Impossible de charger vos médias.";
}

// Médias publiés par l'utilisateur connecté, du plus récent au plus ancien, par pages
export function useMyMedias() {
  const { user } = useAuth();
  const uid = user?.uid ?? null;
  const [state, setState] = useState<State | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    if (!uid) return;
    let cancelled = false;
    listMedias({ authorId: uid })
      .then(({ medias, cursor }) => {
        if (!cancelled) setState({ uid, medias, cursor, error: null });
      })
      .catch((err: unknown) => {
        if (!cancelled) setState({ uid, medias: [], cursor: null, error: errorMessage(err) });
      });
    return () => {
      cancelled = true;
    };
  }, [uid]);

  const ready = uid !== null && state?.uid === uid;

  async function loadMore() {
    if (!uid || !state?.cursor || loadingMore) return;
    setLoadingMore(true);
    try {
      const page = await listMedias({ authorId: uid, cursor: state.cursor });
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
    loading: uid !== null && !ready,
    error: ready ? state.error : null,
    hasMore: ready && state.cursor !== null,
    loadingMore,
    loadMore,
    remove,
  };
}
