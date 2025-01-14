#!/usr/bin/env bash

set -eu

ROOT="$(realpath "$(dirname "$0")/..")"

CLIENT="${ROOT}/client"

# Copy our .env file configured for the local environment
# that will inform the client how to operate
cp "${ROOT}/docker/local.env" "${ROOT}/.env"

docker-compose up -d

(cd $CLIENT && bash "${CLIENT}/docker/set_up_local.sh")
