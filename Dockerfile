FROM node:24-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npx expo export -p web

FROM node:24-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev --ignore-scripts

FROM node:24-alpine AS runtime
WORKDIR /app

ENV NODE_ENV=production \
    PORT=3000

COPY --from=deps --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/dist ./dist
COPY --chown=node:node package.json server.mts ./

USER node
EXPOSE 3000

CMD ["node", "server.mts"]
