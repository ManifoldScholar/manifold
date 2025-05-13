####################################################################################################
# Manifold Rails API
#
# Originally copied from:
# - github.com/ManifoldScholar/manifold-docker-build/blob/v8.1.1/dockerfiles/manifold-api/Dockerfile
####################################################################################################
FROM ruby:2.7.8 AS manifold-api
RUN apt-get -o Acquire::Check-Valid-Until=false update
RUN apt-get install -y libicu-dev postgresql-client nano curl software-properties-common ghostscript \
    vim less

# We need Node and Mammoth for Word text ingestion
RUN curl -sL https://deb.nodesource.com/setup_16.x | bash -
RUN apt-get install -y nodejs
RUN npm install -g mammoth@^1.4.16
ENV MAMMOTH_PATH=/usr/lib/node_modules/mammoth/bin/mammoth

RUN sed -i '/<policy domain="coder" rights="none" pattern="PDF" \/>/d' \
    /etc/ImageMagick-6/policy.xml

COPY api /opt/manifold/api
WORKDIR /opt/manifold/api
ENV RAILS_LOG_TO_STDOUT=1
RUN gem install bundler:2.2.19
RUN bundle install
COPY bin/start-and-run /opt/manifold/api/start-and-run

####################################################################################################
# Manifold Client
#
# Originally copied from:
# - github.com/ManifoldScholar/manifold-docker-build/blob/v8.1.1/dockerfiles/manifold-client/Dockerfile
####################################################################################################
FROM node:16.16.0 AS manifold-client
RUN apt-get -o Acquire::Check-Valid-Until=false update
RUN apt-get install -y vim less

COPY client /opt/manifold/client
WORKDIR /opt/manifold/client
RUN yarn install
RUN cat /dev/null > /opt/manifold/client/dist/manifold/ssr/ssr.config.js

# NOTE: These are production values. They get overwritten locally. They are required to
#       be in the image because `yarn run build` uses them to populate browser.config.js.
#       @see client/script/build-browser-config.js
ENV CLIENT_BROWSER_API_CABLE_URL="https://openpublishing.princeton.edu/cable"
ENV CLIENT_BROWSER_API_URL="https://openpublishing.princeton.edu"
ENV DOMAIN="openpublishing.princeton.edu"
ENV SSL_ENABLED="true"
RUN yarn run build

####################################################################################################
# Manifold nginx
#
# Originally copied from:
# - github.com/ManifoldScholar/manifold-docker-build/blob/v8.1.1/dockerfiles/manifold-nginx/Dockerfile
####################################################################################################
FROM nginx:1.25 AS manifold-nginx

RUN apt-get -o Acquire::Check-Valid-Until=false update
RUN apt-get install -y openssl

COPY nginx/config/default.conf.template /etc/nginx/templates/default.conf.template

COPY nginx/includes/manifold-client-local /etc/nginx/includes/manifold-client-local
COPY nginx/includes/manifold-server-local /etc/nginx/includes/manifold-server-local

COPY nginx/scripts/install-self-signed-cert /usr/local/bin/install-self-signed-cert
COPY nginx/scripts/start-nginx /usr/local/bin/start-nginx

VOLUME ["/manifold_sockets","/manifold_data"]

CMD [ "start-nginx" ]

EXPOSE 80 443
