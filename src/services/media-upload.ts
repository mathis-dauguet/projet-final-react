import * as DocumentPicker from "expo-document-picker";
import { ImageManipulator, SaveFormat } from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import * as VideoThumbnails from "expo-video-thumbnails";
import { Platform } from "react-native";

import { AUDIO_MIME_TYPES, MEDIA_FORMATS, MEDIA_MAX_SIZE } from "@/constants/media-rules";
import type { Media, MediaType } from "@/models/media";
import { createMedia, newMediaId, normalizeMediaName, updateMedia } from "@/services/community-medias";
import { auth } from "@/services/firebase";

// Vide sur le web en production : l'app et l'API sont servies par le même serveur
const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "";

const THUMBNAIL_WIDTH = 480;
const MB = 1024 * 1024;
const TYPE_LABELS: Record<MediaType, string> = { image: "une image", audio: "un son", video: "une vidéo" };

export interface PickedFile {
  uri: string;
  name: string;
  mimeType: string;
  type: MediaType;
  size: number | null;
  // Objet File du navigateur, seulement sur le web
  file?: File;
}

interface UploadResult {
  path: string;
  thumbnail: string | null;
  size: number;
  type: MediaType;
}

// Le type MIME n'est pas toujours fourni par le sélecteur : on le déduit alors de l'extension
function guessMimeType(name: string): string | undefined {
  const ext = name.split(".").pop()?.toLowerCase();
  if (ext === "jpeg") return "image/jpeg";
  return Object.keys(MEDIA_FORMATS).find((mime) => MEDIA_FORMATS[mime].ext === ext);
}

function toPickedFile(uri: string, name: string, mimeType: string | undefined, size: number | null, file?: File): PickedFile {
  const mime = mimeType || guessMimeType(name);
  const format = mime ? MEDIA_FORMATS[mime] : undefined;
  if (!mime || !format) {
    throw new Error("Format non accepté : JPEG, PNG, WebP, MP4, MP3 ou M4A.");
  }
  if (size !== null && size > MEDIA_MAX_SIZE[format.type]) {
    throw new Error(`Fichier trop lourd : ${MEDIA_MAX_SIZE[format.type] / MB} Mo maximum pour ${TYPE_LABELS[format.type]}.`);
  }
  return { uri, name, mimeType: mime, type: format.type, size, file };
}

function fileNameFromUri(uri: string): string {
  return decodeURIComponent(uri.split("/").pop() ?? "media");
}

// À appeler depuis un appui sur un bouton : sur le web, le navigateur bloque sinon l'ouverture
export async function pickImageOrVideo(): Promise<PickedFile | null> {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images", "videos"],
    quality: 1,
    preferredAssetRepresentationMode: ImagePicker.UIImagePickerPreferredAssetRepresentationMode.Compatible,
  });
  const asset = result.assets?.[0];
  if (result.canceled || !asset) return null;

  return toPickedFile(
    asset.uri,
    asset.fileName ?? asset.file?.name ?? fileNameFromUri(asset.uri),
    asset.mimeType,
    asset.fileSize ?? asset.file?.size ?? null,
    asset.file,
  );
}

export async function pickAudio(): Promise<PickedFile | null> {
  const result = await DocumentPicker.getDocumentAsync({
    type: AUDIO_MIME_TYPES,
    copyToCacheDirectory: true,
    base64: false,
  });
  const asset = result.assets?.[0];
  if (result.canceled || !asset) return null;

  return toPickedFile(asset.uri, asset.name, asset.mimeType, asset.size ?? null, asset.file);
}

// Image réduite pour une image, image extraite pour une vidéo (pas sur le web), rien pour un son.
// Un échec ne bloque pas la publication : le média est alors publié sans vignette.
async function createThumbnail(file: PickedFile): Promise<PickedFile | null> {
  try {
    let uri: string;
    if (file.type === "image") {
      const context = ImageManipulator.manipulate(file.uri);
      context.resize({ width: THUMBNAIL_WIDTH, height: null });
      const image = await context.renderAsync();
      ({ uri } = await image.saveAsync({ format: SaveFormat.JPEG, compress: 0.7 }));
    } else if (file.type === "video" && Platform.OS !== "web") {
      ({ uri } = await VideoThumbnails.getThumbnailAsync(file.uri, { time: 1000, quality: 0.7 }));
    } else {
      return null;
    }
    return { uri, name: "thumbnail.jpg", mimeType: "image/jpeg", type: "image", size: null };
  } catch {
    return null;
  }
}

async function appendFile(form: FormData, field: string, file: PickedFile) {
  if (Platform.OS === "web") {
    const blob = file.file ?? (await (await fetch(file.uri)).blob());
    form.append(field, new File([blob], file.name, { type: file.mimeType }));
  } else {
    // Sur mobile, React Native envoie le fichier à partir de son uri
    form.append(field, { uri: file.uri, name: file.name, type: file.mimeType } as unknown as Blob);
  }
}

async function uploadFile(mediaId: string, file: PickedFile, thumbnail: PickedFile | null): Promise<UploadResult> {
  const user = auth.currentUser;
  if (!user) throw new Error("Connectez-vous pour publier un média.");
  const token = await user.getIdToken();

  const form = new FormData();
  await appendFile(form, "file", file);
  if (thumbnail) await appendFile(form, "thumbnail", thumbnail);

  let response: Response;
  try {
    response = await fetch(`${API_URL}/api/medias/${mediaId}/file`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: form,
    });
  } catch {
    throw new Error("Impossible de joindre le serveur. Vérifiez votre connexion.");
  }

  const body = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(body?.error ?? `Erreur pendant l'envoi (${response.status}).`);
  }
  return body as UploadResult;
}

// Envoie le fichier sur le serveur, puis enregistre le média dans Firestore. Renvoie l'id du média.
export async function publishMedia(name: string, file: PickedFile): Promise<string> {
  const user = auth.currentUser;
  if (!user) throw new Error("Connectez-vous pour publier un média.");

  const cleanName = normalizeMediaName(name);
  const id = newMediaId();
  const thumbnail = await createThumbnail(file);
  const uploaded = await uploadFile(id, file, thumbnail);

  await createMedia(id, {
    name: cleanName,
    type: uploaded.type,
    size: uploaded.size,
    path: uploaded.path,
    thumbnail: uploaded.thumbnail ?? (uploaded.type === "image" ? uploaded.path : null),
    author_id: user.uid,
  });
  return id;
}

// Remplace le fichier d'un média existant : l'ancien est supprimé par le serveur
export async function replaceMediaFile(media: Media, file: PickedFile): Promise<void> {
  const thumbnail = await createThumbnail(file);
  const uploaded = await uploadFile(media.id, file, thumbnail);

  await updateMedia(media.id, {
    type: uploaded.type,
    size: uploaded.size,
    path: uploaded.path,
    thumbnail: uploaded.thumbnail ?? (uploaded.type === "image" ? uploaded.path : null),
  });
}
