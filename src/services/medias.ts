import { MEDIAS } from "@/data/medias";
import type { Media } from "@/models/media";

const FAKE_DELAY_MS = 500; //TIMEOUT POUR LA SIMULATION D'UN VRAI FETCH

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getMedias(): Promise<Media[]> {
  await wait(FAKE_DELAY_MS);
  return MEDIAS; //POUR LE LISTING DES MEDIAS
}

export async function getMediaById(id: string): Promise<Media | undefined> {
  await wait(FAKE_DELAY_MS);
  return MEDIAS.find((media) => media.id === id);
} //POUR LE SINGLE MEDIA
