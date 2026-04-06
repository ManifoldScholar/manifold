#!/bin/bash

set -e

# Remove a potentially pre-existing server pid for rails
rm -f /srv/pids/server.pid

bundle check || bundle install

bundle config set bin "$BUNDLE_BIN"

bundle binstubs --all

# Then exec the container's main process
exec "$@"
