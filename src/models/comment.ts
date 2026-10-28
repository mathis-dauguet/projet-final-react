export const RATINGS = [1, 2, 3, 4, 5] as const;
export type Rating = (typeof RATINGS)[number];

export interface Comment {
  id: string;
  description: string;
  rating: Rating;
  user_id: string;
  media_id: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}
