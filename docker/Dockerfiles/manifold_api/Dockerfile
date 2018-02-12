FROM ruby:2.3.5-alpine

WORKDIR /opt/manifold

ADD . /opt/manifold

RUN gem update --system && gem install bundler && apk add --update --no-cache build-base less tzdata git

ENV RAILS_LOG_TO_STDOUT=1 RAILS_SERVE_STATIC_FILES=1 RAILS_SERVER_SOCKET_DIR=/manifold_sockets RAILS_SERVER_SOCKET_PATH=/manifold_sockets/manifold-api

RUN apk add --no-cache nodejs postgresql-dev

RUN bundle install

RUN bundle install --gemfile=api/Gemfile

RUN mkdir -p /manifold_date/api/public

COPY ./api/public/* /manifold_data/api/public/

VOLUME ["/manifold_sockets","/manifold_data"]

CMD ["bin/manifold", "start", "api"]
