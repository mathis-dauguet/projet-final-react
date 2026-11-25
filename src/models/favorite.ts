import type { Media } from "@/models/media";

export type Favorite = {
  id: string;
  media: Media;
  note: string;
  createdAt: number;
};

export function mediaKey(media: Pick<Media, "source" | "id">): string {
  return `${media.source}:${media.id}`;
}
