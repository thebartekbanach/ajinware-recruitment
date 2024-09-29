FROM node:20.17.0 AS base
WORKDIR /app


# development build
FROM base AS dev

ENV NODE_ENV development

COPY package*.json ./
RUN npm install

COPY nest-cli.json tsconfig.json tsconfig.*.json ./

# source code is mounted as a volume

ENTRYPOINT ["npm", "run", "start:debug"]


# production builder
FROM base AS builder

ENV NODE_ENV development

COPY --chown=node:node package*.json ./
RUN npm install

COPY --chown=node:node tsconfig*.json nest-cli.json ./
COPY --chown=node:node ./src ./src

RUN npm run build


# production build
FROM node:20.17.0-slim AS prod
WORKDIR /app

ENV NODE_ENV production

# Install curl for healthcheck
RUN apt-get update && \
    apt-get install -y --no-install-recommends curl && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

COPY --chown=node:node package*.json ./
RUN npm ci

COPY --from=builder --chown=node:node /app/dist ./dist

# this is only recruitment task, in normal case we want to run it as non-root user
# USER node

CMD ["npm", "run", "start:prod"]
