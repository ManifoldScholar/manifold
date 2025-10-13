FROM ruby:3.2-bullseye AS base

RUN mkdir -pv /bundle/bin

ENV BUNDLE_PATH=/bundle \
    BUNDLE_BIN=/bundle/bin \
    GEM_HOME=/bundle \
    RACK_ENV=development \
    RAILS_ENV=development \
    RAILS_LOG_TO_STDOUT=true \
    RAILS_SERVE_STATIC_FILES=true \
    RAILS_MIN_THREADS=16 \
    RAILS_MAX_THREADS=16 \
    WORKER_COUNT=0

COPY docker/install_node_16.sh /usr/local/src/install_node_16.sh

RUN bash /usr/local/src/install_node_16.sh

RUN apt-get update -qq && apt-get install -y -qq --no-install-recommends \
    build-essential \
    ca-certificates \
    curl \
    ghostscript \
    gnupg gnupg2 \
    imagemagick \
    libglib2.0-0 libglib2.0-dev \
    libicu-dev \
    libjemalloc2 \
    libpoppler-glib8 \
    librsvg2-bin \
    libsndfile1-dev \
    libvips \
    libvips-dev \
    mediainfo \
    nodejs \
    postgresql-common \
    pandoc

RUN DEBIAN_FRONTEND=noninteractive /usr/share/postgresql-common/pgdg/apt.postgresql.org.sh -y

RUN apt-get update -qq && apt-get install -y -qq --no-install-recommends postgresql-client-13

RUN npm install -g mammoth@^1.4.16 wscat@^6.0.1

RUN sed -i '/<policy domain="coder" rights="none" pattern="PDF" \/>/d' /etc/ImageMagick-6/policy.xml

COPY ./ /srv/app/

WORKDIR /srv/app
COPY Gemfile /srv/app/Gemfile
COPY Gemfile.lock /srv/app/Gemfile.lock

COPY docker/entrypoint.sh /usr/bin/
RUN chmod +x /usr/bin/entrypoint.sh
ENTRYPOINT ["entrypoint.sh"]

ENV MAMMOTH_PATH=/usr/bin/mammoth
ENV PATH="${BUNDLE_BIN}:${PATH}"
ENV LD_PRELOAD=libjemalloc.so.2

RUN bundle install

CMD ["bin/puma", "-C", "config/puma.rb"]

# There are currently no differences between dev and prod Dockerfiles, but these are here to provide parity with the client Dockerfile
FROM base AS dev

FROM base AS prod