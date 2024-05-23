####################################################################################################
# Manifold Rails API
#
# Originally copied from:
# - github.com/ManifoldScholar/manifold-docker-build/blob/v8.1.1/dockerfiles/manifold-api/Dockerfile
####################################################################################################
FROM ruby:2.7.8
RUN apt-get -o Acquire::Check-Valid-Until=false update
RUN apt-get install -y libicu-dev postgresql-client nano curl software-properties-common ghostscript

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
RUN gem install bundler:2.2.17
RUN bundle install
COPY bin/start-and-run /opt/manifold/api/start-and-run

####################################################################################################
# Manifold Client
#
# Originally copied from:
# - github.com/ManifoldScholar/manifold-docker-build/blob/v8.1.1/dockerfiles/manifold-client/Dockerfile
####################################################################################################
FROM node:16.16.0
COPY client /opt/manifold/client
WORKDIR /opt/manifold/client
RUN yarn install
RUN cat /dev/null > /opt/manifold/client/dist/manifold/ssr/ssr.config.js

####################################################################################################
# Manifold nginx
#
# Originally copied from:
# - github.com/ManifoldScholar/manifold-docker-build/blob/v8.1.1/dockerfiles/manifold-nginx/Dockerfile
####################################################################################################
FROM nginx:1.25

RUN apt-get -o Acquire::Check-Valid-Until=false update
RUN apt-get install -y openssl

COPY dockerfiles/manifold-nginx/config/default.conf /etc/nginx/conf.d/default.conf

COPY dockerfiles/manifold-nginx/includes/manifold-client-local /etc/nginx/includes/manifold-client-local
COPY dockerfiles/manifold-nginx/includes/manifold-server-local /etc/nginx/includes/manifold-server-local

COPY dockerfiles/manifold-nginx/scripts/install-self-signed-cert /usr/local/bin/install-self-signed-cert
COPY dockerfiles/manifold-nginx/scripts/start-nginx /usr/local/bin/start-nginx

VOLUME ["/manifold_sockets","/manifold_data"]

EXPOSE 80 443
