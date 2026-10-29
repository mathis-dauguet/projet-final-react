export const MEDIA_TYPES = ["image", "video", "audio"] as const;
export type MediaType = (typeof MEDIA_TYPES)[number];

export interface Media {
  id: string;
  name: string;
  type: MediaType;
  size: number | null;
  path: string;
  thumbnail: string | null;
  author_id: string;
  created_at: Date;
  updated_at: Date;
}
