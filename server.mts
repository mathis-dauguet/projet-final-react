import { randomUUID } from 'node:crypto';
import { mkdir, readdir, rename, rm } from 'node:fs/promises';
import path from 'node:path';
import compression from 'compression';
import express, { type NextFunction, type Request, type Response } from 'express';
import { cert, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import morgan from 'morgan';
import multer from 'multer';

const BUILD_DIR = path.join(process.cwd(), 'dist');
const INDEX_HTML = path.join(BUILD_DIR, 'index.html');
const UPLOADS_DIR = process.env.UPLOADS_DIR || path.join(process.cwd(), 'uploads');
const MEDIAS_DIR = path.join(UPLOADS_DIR, 'medias');
const TMP_DIR = path.join(UPLOADS_DIR, 'tmp');
const port = Number(process.env.PORT) || 3000;

const MB = 1024 * 1024;

type MediaType = 'image' | 'video' | 'audio';

// Formats acceptés, et extension utilisée pour enregistrer le fichier
const FORMATS: Record<string, { type: MediaType; ext: string }> = {
  'image/jpeg': { type: 'image', ext: 'jpg' },
  'image/png': { type: 'image', ext: 'png' },
  'image/webp': { type: 'image', ext: 'webp' },
  'video/mp4': { type: 'video', ext: 'mp4' },
  'audio/mpeg': { type: 'audio', ext: 'mp3' },
  'audio/mp4': { type: 'audio', ext: 'm4a' },
  'audio/x-m4a': { type: 'audio', ext: 'm4a' },
};

const MAX_SIZE: Record<MediaType, number> = { image: 10 * MB, audio: 20 * MB, video: 100 * MB };
const TYPE_LABELS: Record<MediaType, string> = { image: 'une image', audio: 'un son', video: 'une vidéo' };

const UNSUPPORTED_FORMAT = 'UNSUPPORTED_FORMAT';

// Sans compte de service, le serveur démarre quand même mais refuse les envois
const firebase = process.env.FIREBASE_SERVICE_ACCOUNT
  ? initializeApp({ credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)) })
  : null;

const app = express();
app.disable('x-powered-by');
// Derrière le proxy de Coolify : req.protocol et req.host viennent des en-têtes X-Forwarded-*
app.set('trust proxy', true);
app.use(compression());
app.use(morgan('tiny'));

// En développement, l'app (Metro) et l'API ne sont pas sur le même port
if (process.env.CORS_ORIGIN) {
  app.use('/api', (req, res, next) => {
    res.set({
      'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Authorization, Content-Type',
    });
    if (req.method === 'OPTIONS') return res.sendStatus(204);
    next();
  });
}

async function authenticate(req: Request, res: Response, next: NextFunction) {
  if (!firebase) {
    return res.status(503).json({ error: "Envoi indisponible : Firebase n'est pas configuré sur le serveur." });
  }
  const token = req.headers.authorization?.match(/^Bearer (.+)$/)?.[1];
  if (!token) return res.status(401).json({ error: 'Connexion requise.' });

  try {
    const { uid } = await getAuth(firebase).verifyIdToken(token);
    const user = await getFirestore(firebase).doc(`users/${uid}`).get();
    res.locals.uid = uid;
    res.locals.role = user.get('role');
  } catch {
    return res.status(401).json({ error: 'Session expirée, reconnectez-vous.' });
  }
  next();
}

// Nouveau média : seul un photographe peut l'envoyer. Média existant : son auteur ou un admin peut remplacer le fichier.
async function authorize(req: Request, res: Response, next: NextFunction) {
  const mediaId = String(req.params.mediaId);
  if (!/^[A-Za-z0-9]{1,40}$/.test(mediaId)) return res.status(400).json({ error: 'Identifiant de média invalide.' });

  const { uid, role } = res.locals;
  const media = await getFirestore(firebase!).doc(`medias/${mediaId}`).get();

  if (media.exists) {
    const authorId = media.get('author_id');
    if (authorId !== uid && role !== 'admin') return res.status(403).json({ error: "Vous ne pouvez modifier que vos médias." });
    res.locals.authorId = authorId;
  } else {
    if (role !== 'photographer') return res.status(403).json({ error: 'Seuls les photographes peuvent publier.' });
    res.locals.authorId = uid;
  }
  res.locals.mediaId = mediaId;
  next();
}

const upload = multer({
  dest: TMP_DIR,
  limits: { fileSize: MAX_SIZE.video, files: 2 },
  fileFilter: (_req, file, cb) => {
    const format = FORMATS[file.mimetype];
    const accepted = file.fieldname === 'thumbnail' ? format?.type === 'image' : Boolean(format);
    if (accepted) cb(null, true);
    else cb(new Error(UNSUPPORTED_FORMAT));
  },
}).fields([
  { name: 'file', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 },
]);

// Reçoit le fichier d'un média (champ "file") et sa vignette facultative (champ "thumbnail").
// Les infos du média sont ensuite enregistrées dans Firestore par l'app.
app.post('/api/medias/:mediaId/file', authenticate, authorize, upload, async (req, res) => {
  const files = (req.files ?? {}) as Record<string, Express.Multer.File[]>;
  const file = files.file?.[0];
  const thumbnail = files.thumbnail?.[0];

  try {
    if (!file) return res.status(400).json({ error: 'Aucun fichier reçu.' });

    const format = FORMATS[file.mimetype];
    if (file.size > MAX_SIZE[format.type]) {
      return res.status(413).json({ error: `Fichier trop lourd : ${MAX_SIZE[format.type] / MB} Mo maximum pour ${TYPE_LABELS[format.type]}.` });
    }
    if (thumbnail && thumbnail.size > MAX_SIZE.image) {
      return res.status(413).json({ error: `Vignette trop lourde : ${MAX_SIZE.image / MB} Mo maximum.` });
    }

    const { authorId, mediaId } = res.locals;
    const dir = path.join(MEDIAS_DIR, authorId, mediaId);
    await mkdir(dir, { recursive: true });

    // Nom unique à chaque envoi : un fichier remplacé n'est jamais resservi depuis le cache du navigateur
    const name = randomUUID();
    const fileName = `${name}.${format.ext}`;
    const thumbnailName = thumbnail ? `${name}-thumb.${FORMATS[thumbnail.mimetype].ext}` : null;

    await rename(file.path, path.join(dir, fileName));
    if (thumbnail && thumbnailName) await rename(thumbnail.path, path.join(dir, thumbnailName));

    // Remplacement : l'ancien fichier et l'ancienne vignette sont supprimés
    const kept = new Set([fileName, thumbnailName]);
    for (const entry of await readdir(dir)) {
      if (!kept.has(entry)) await rm(path.join(dir, entry), { force: true });
    }

    const baseUrl = `${process.env.PUBLIC_URL || `${req.protocol}://${req.host}`}/uploads/medias/${authorId}/${mediaId}`;
    res.status(201).json({
      path: `${baseUrl}/${fileName}`,
      thumbnail: thumbnailName ? `${baseUrl}/${thumbnailName}` : null,
      size: file.size,
      type: format.type,
    });
  } finally {
    // Fichiers temporaires restants (envoi refusé) ; sans effet sur ceux déjà déplacés
    await Promise.all([file, thumbnail].map((f) => f && rm(f.path, { force: true })));
  }
});

app.use('/api', (_req, res) => {
  res.status(404).json({ error: 'Route inconnue.' });
});

app.use('/api', (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ error: `Fichier trop lourd : ${MAX_SIZE.video / MB} Mo maximum.` });
  }
  if (err.message === UNSUPPORTED_FORMAT) {
    return res.status(415).json({ error: 'Format non accepté : JPEG, PNG, WebP, MP4, MP3 ou M4A.' });
  }
  console.error(err);
  res.status(500).json({ error: "Erreur du serveur pendant l'envoi." });
});

app.use('/uploads/medias', express.static(MEDIAS_DIR, { maxAge: '7d', fallthrough: false }));

app.use(
  express.static(BUILD_DIR, {
    maxAge: '1h',
    setHeaders: (res, filePath) => {
      if (filePath === INDEX_HTML) res.setHeader('Cache-Control', 'no-cache');
    },
  }),
);

app.get('/{*all}', (_req, res) => {
  res.setHeader('Cache-Control', 'no-cache');
  res.sendFile(INDEX_HTML);
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
