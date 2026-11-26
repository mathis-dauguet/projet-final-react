import type { MediaType } from "@/models/media";

export const MEDIA_NAME_MIN = 3;
export const MEDIA_NAME_MAX = 100;

const MB = 1024 * 1024;

// Formats acceptés, avec l'extension correspondante (mêmes règles que server.mts)
export const MEDIA_FORMATS: Record<string, { type: MediaType; ext: string }> = {
  "image/jpeg": { type: "image", ext: "jpg" },
  "image/png": { type: "image", ext: "png" },
  "image/webp": { type: "image", ext: "webp" },
  "video/mp4": { type: "video", ext: "mp4" },
  "audio/mpeg": { type: "audio", ext: "mp3" },
  "audio/mp4": { type: "audio", ext: "m4a" },
  "audio/x-m4a": { type: "audio", ext: "m4a" },
};

export const MEDIA_MAX_SIZE: Record<MediaType, number> = {
  image: 10 * MB,
  audio: 20 * MB,
  video: 100 * MB,
};

export const AUDIO_MIME_TYPES = Object.keys(MEDIA_FORMATS).filter((mime) => MEDIA_FORMATS[mime].type === "audio");
