#!/usr/bin/env bash

set -eu

ROOT="$(realpath "$(dirname "$0")/..")"

cd "$ROOT"

yarn
