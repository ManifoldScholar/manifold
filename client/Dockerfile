FROM node:16.20.2 AS base

WORKDIR /srv/app
COPY ./ /srv/app

RUN yarn

FROM base AS dev

  RUN yarn build:dev
  
  EXPOSE 3010 3011 3012

  CMD ["yarn", "run", "watch"]

FROM base AS prod

  RUN yarn build:prod

  CMD ["yarn", "run", "start-docker"]