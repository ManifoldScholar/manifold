#!/bin/bash

set -e

# Remove a potentially pre-existing server pid for rails
rm -f /srv/pids/server.pid
rm -f /srv/pids/cable.pid

gem install --no-document bundler:2.2.19

bundle check || bundle install

bundle binstubs --all --path="$BUNDLE_BIN"

# Then exec the container's main process
exec "$@"
