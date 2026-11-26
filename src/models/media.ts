export const MEDIA_TYPES = ["image", "video", "audio"] as const;
export type MediaType = (typeof MEDIA_TYPES)[number];

export const MEDIA_SOURCES = ["nasa", "user"] as const;
export type MediaSource = (typeof MEDIA_SOURCES)[number];

export interface Media {
  id: string;
  source: MediaSource;
  name: string;
  type: MediaType;
  size: number | null;
  path: string;
  thumbnail: string | null;
  author_id: string | null;
  credit: string | null;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}

// Une section de SectionList : un titre + les médias du groupe
export interface MediaSection {
  title: MediaType;
  data: Media[];
}

// Fonction pure : regroupe les médias par type (image, vidéo, audio), sans les groupes vides
export function groupMediasByType(medias: Media[]): MediaSection[] {
  return MEDIA_TYPES.map((type) => ({
    title: type,
    data: medias.filter((media) => media.type === type),
  })).filter((section) => section.data.length > 0);
}
