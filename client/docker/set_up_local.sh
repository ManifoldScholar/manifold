#!/usr/bin/env bash

set -eu

ROOT="$(realpath "$(dirname "$0")/..")"

cd "$ROOT"

npm install --location=global yarn

yarn
