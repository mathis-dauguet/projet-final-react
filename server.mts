import path from 'node:path';
import compression from 'compression';
import express from 'express';
import { createRequire } from 'node:module';
import morgan from 'morgan';
import type * as ExpressAdapter from 'expo-server/adapter/express';

const require = createRequire(import.meta.url);
const { createRequestHandler } = require('expo-server/adapter/express') as typeof ExpressAdapter;

const CLIENT_BUILD_DIR = path.join(process.cwd(), 'dist/client');
const SERVER_BUILD_DIR = path.join(process.cwd(), 'dist/server');
const port = Number(process.env.PORT) || 3000;

process.env.NODE_ENV = 'production';

const app = express();
app.disable('x-powered-by');
app.use(compression());

app.use(express.static(CLIENT_BUILD_DIR, { maxAge: '1h', extensions: ['html'] }));

app.use(morgan('tiny'));

app.all('/{*all}', createRequestHandler({ build: SERVER_BUILD_DIR }));

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
