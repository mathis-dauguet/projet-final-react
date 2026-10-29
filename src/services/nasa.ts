import type { Media, MediaType } from "@/models/media";

const API_URL = "https://images-api.nasa.gov";

interface NasaItemData {
  nasa_id: string;
  title: string;
  media_type: MediaType;
  date_created: string;
  description?: string;
  center?: string;
  photographer?: string;
  secondary_creator?: string;
}

interface NasaItemLink {
  href: string;
  rel: string;
  size?: number;
}

interface NasaItem {
  href: string;
  data: NasaItemData[];
  links?: NasaItemLink[];
}

interface NasaSearchResponse {
  collection: {
    items: NasaItem[];
    metadata: { total_hits: number };
  };
}

export interface SearchParams {
  q: string;
  media_type?: MediaType;
  page?: number;
  page_size?: number;
}

function toMedia(item: NasaItem): Media {
  const data = item.data[0];
  const preview = item.links?.find((link) => link.rel === "preview");
  const canonical = item.links?.find((link) => link.rel === "canonical");
  const createdAt = new Date(data.date_created);

  return {
    id: data.nasa_id,
    source: "nasa",
    name: data.title,
    type: data.media_type,
    size: canonical?.size ?? null,
    path: encodeURI(canonical?.href ?? item.href),
    thumbnail: preview ? encodeURI(preview.href) : null,
    author_id: null,
    credit: data.photographer ?? data.secondary_creator ?? data.center ?? "NASA",
    created_at: createdAt,
    updated_at: createdAt,
  };
}

export async function searchMedias(
  { q, media_type, page = 1, page_size = 60 }: SearchParams,
  signal?: AbortSignal,
): Promise<Media[]> {
  const params = new URLSearchParams({ q, page: String(page), page_size: String(page_size) });
  if (media_type) {
    params.set("media_type", media_type);
  }

  const response = await fetch(`${API_URL}/search?${params}`, { signal });
  if (!response.ok) {
    throw new Error(`NASA API error: ${response.status}`);
  }

  const json: NasaSearchResponse = await response.json();
  return json.collection.items.map(toMedia);
}
