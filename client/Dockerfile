# Stage 1: Install dependencies and copy source
FROM node:22.17.1 AS base

WORKDIR /srv/app

COPY package.json yarn.lock .yarnrc.yml ./

ENV BROWSERSLIST_IGNORE_OLD_DATA=beQuiet

RUN corepack enable && yarn install

COPY ./ /srv/app

# Stage 2: Development build
FROM base AS development

ENV BROWSERSLIST_IGNORE_OLD_DATA=beQuiet

RUN yarn build:dev

EXPOSE 3010 3011 3012

CMD ["yarn", "run", "watch"]

# Stage 3: Production build on slim image
FROM base AS build

ENV BROWSERSLIST_IGNORE_OLD_DATA=beQuiet
ENV BUILD_IN=""

RUN yarn build:prod

FROM node:22.17.1-slim AS production

WORKDIR /srv/app

ENV BROWSERSLIST_IGNORE_OLD_DATA=beQuiet

RUN corepack enable

COPY --from=build /srv/app /srv/app

CMD ["./node_modules/.bin/npm-run-all", "_build:browser-config", "_serve:ssr"]
