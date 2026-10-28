import path from 'node:path';
import compression from 'compression';
import express from 'express';
import morgan from 'morgan';

const BUILD_DIR = path.join(process.cwd(), 'dist');
const INDEX_HTML = path.join(BUILD_DIR, 'index.html');
const port = Number(process.env.PORT) || 3000;

const app = express();
app.disable('x-powered-by');
app.use(compression());
app.use(morgan('tiny'));

// Fichiers du build (JS, images…). index.html n'est pas mis en cache pour récupérer chaque nouveau déploiement.
app.use(
  express.static(BUILD_DIR, {
    maxAge: '1h',
    setHeaders: (res, filePath) => {
      if (filePath === INDEX_HTML) res.setHeader('Cache-Control', 'no-cache');
    },
  }),
);

// SPA : toute autre route renvoie index.html, Expo Router gère le routage côté client.
app.get('/{*all}', (_req, res) => {
  res.setHeader('Cache-Control', 'no-cache');
  res.sendFile(INDEX_HTML);
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
