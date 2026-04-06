# Stage 1: Build gems with native extensions
FROM ruby:3.4-bookworm AS builder

RUN mkdir -pv /bundle/bin

ENV BUNDLE_PATH=/bundle \
    BUNDLE_BIN=/bundle/bin \
    GEM_HOME=/bundle

RUN apt-get update -qq && apt-get install -y -qq --no-install-recommends \
    build-essential \
    libglib2.0-dev \
    libicu-dev \
    libsndfile1-dev \
    libvips-dev \
    && rm -rf /var/lib/apt/lists/*

COPY Gemfile /srv/app/Gemfile
COPY Gemfile.lock /srv/app/Gemfile.lock
WORKDIR /srv/app

RUN gem update --system 4.0.9 && bundle install

# Strip build artifacts from gems to reduce size
RUN find /bundle -name "*.c" -delete \
    && find /bundle -name "*.o" -delete \
    && rm -rf /bundle/cache/*.gem

# Stage 2: Slim runtime image (production target)
FROM ruby:3.4-slim-bookworm AS base

RUN mkdir -pv /bundle/bin

ENV BUNDLE_PATH=/bundle \
    BUNDLE_BIN=/bundle/bin \
    GEM_HOME=/bundle \
    RAILS_LOG_TO_STDOUT=true \
    RAILS_SERVE_STATIC_FILES=true \
    RAILS_MIN_THREADS=16 \
    RAILS_MAX_THREADS=16 \
    WORKER_COUNT=0

COPY docker/install_node.sh /usr/local/src/install_node.sh

RUN bash /usr/local/src/install_node.sh

RUN apt-get update -qq && apt-get install -y -qq --no-install-recommends \
    ca-certificates \
    curl \
    ghostscript \
    imagemagick \
    libglib2.0-0 \
    libicu72 \
    libjemalloc2 \
    libpoppler-glib8 \
    librsvg2-bin \
    libsndfile1 \
    libvips42 \
    mediainfo \
    nodejs \
    pandoc \
    postgresql-common \
    && rm -rf /var/lib/apt/lists/*

RUN DEBIAN_FRONTEND=noninteractive /usr/share/postgresql-common/pgdg/apt.postgresql.org.sh -y

RUN apt-get update -qq && apt-get install -y -qq --no-install-recommends \
    postgresql-client-13 \
    && rm -rf /var/lib/apt/lists/*

RUN npm install -g mammoth@^1.4.16

RUN gem update --system 4.0.9

RUN sed -i '/<policy domain="coder" rights="none" pattern="PDF" \/>/d' /etc/ImageMagick-6/policy.xml

# Copy compiled gems from builder
COPY --from=builder /bundle /bundle

COPY ./ /srv/app/

WORKDIR /srv/app

COPY docker/entrypoint.sh /usr/bin/
RUN chmod +x /usr/bin/entrypoint.sh
ENTRYPOINT ["entrypoint.sh"]

ENV MAMMOTH_PATH=/usr/bin/mammoth
ENV PATH="${BUNDLE_BIN}:${PATH}"
ENV LD_PRELOAD=libjemalloc.so.2

CMD ["bin/puma", "-C", "config/puma.rb"]

# Stage 3: Development image (adds build tools for bundle install in entrypoint)
FROM base AS development

RUN apt-get update -qq && apt-get install -y -qq --no-install-recommends \
    build-essential \
    libglib2.0-dev \
    libicu-dev \
    libsndfile1-dev \
    libvips-dev \
    && rm -rf /var/lib/apt/lists/*

FROM base AS production
