FROM ruby:2.7.8
RUN apt-get -o Acquire::Check-Valid-Until=false update
RUN apt-get install -y libicu-dev postgresql-client nano curl software-properties-common ghostscript

# We need Node and Mammoth for Word text ingestion
RUN curl -sL https://deb.nodesource.com/setup_16.x | bash -
RUN apt-get install -y nodejs
RUN npm install -g mammoth@^1.4.16

RUN sed -i '/<policy domain="coder" rights="none" pattern="PDF" \/>/d' \
    /etc/ImageMagick-6/policy.xml

COPY manifold-src /opt/manifold
WORKDIR /opt/manifold/api
ENV RAILS_LOG_TO_STDOUT=1
RUN gem install bundler:2.2.19
RUN bundle install
COPY dockerfiles/manifold-api/scripts/start-and-run /opt/manifold/api/start-and-run
