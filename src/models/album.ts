export type Genre  = "jazz" | "electro" | "rock" | "hip-hop" | "pop";

export interface Album {
  id: string;
  title: string;
  artist: string;
  year: number;
  genre: Genre;
  price: number;
  inStock: boolean;
  coverUrl: string;
}

const GENRES: Genre[] = ["jazz", "electro", "rock", "hip-hop", "pop"];