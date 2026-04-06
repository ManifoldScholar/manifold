# Stage 1: Install dependencies and copy source
FROM node:22.17.1 AS base

WORKDIR /srv/app

COPY package.json yarn.lock .yarnrc.yml ./

RUN corepack enable && yarn install

COPY ./ /srv/app

# Stage 2: Development build
FROM base AS development

RUN yarn build:dev

EXPOSE 3010 3011 3012

CMD ["yarn", "run", "watch"]

# Stage 3: Production build on slim image
FROM base AS build

ENV BUILD_IN=""

RUN yarn build:prod

FROM node:22.17.1-slim AS production

WORKDIR /srv/app

RUN corepack enable

COPY --from=build /srv/app/node_modules /srv/app/node_modules
COPY --from=build /srv/app/dist /srv/app/dist
COPY --from=build /srv/app/script /srv/app/script
COPY --from=build /srv/app/webpack/helpers /srv/app/webpack/helpers
COPY --from=build /srv/app/webpack/transforms /srv/app/webpack/transforms
COPY --from=build /srv/app/webpack/templates /srv/app/webpack/templates
COPY --from=build /srv/app/src/config /srv/app/src/config
COPY --from=build /srv/app/package.json /srv/app/package.json
COPY --from=build /srv/app/yarn.lock /srv/app/yarn.lock
COPY --from=build /srv/app/.yarnrc.yml /srv/app/.yarnrc.yml

CMD ["yarn", "run", "start-docker"]
