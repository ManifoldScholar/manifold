#!/usr/bin/env bash

set -eu

ROOT="$(realpath "$(dirname "$0")/..")"

declare -a ARCHIVE_PATHS=(data public/system)

PROJECT_ROOT="${ROOT}/api"
BACKUP_FILE="backup-local-$(date +"%Y-%m-%d-%s").tar"
SQL_FILE=dump.sql

perform_local_backup() {
  cd "$PROJECT_ROOT"

  pg_dump -O -x --clean --if-exists -w -d manifold_development -f $SQL_FILE

  tar --no-xattrs -chf "${ROOT}/$BACKUP_FILE" "$SQL_FILE" "${ARCHIVE_PATHS[@]}"

  if [ -f "$SQL_FILE" ]; then
    rm "$SQL_FILE"
  fi

  echo "Created local backup to "${PROJECT_ROOT}/${BACKUP_FILE}
}

restore_local_backup() {
  cd "$PROJECT_ROOT"

  docker compose cp "${ROOT}/${BACKUP_FILE}" "web:/srv/${BACKUP_FILE}"

  bin/restore "/srv/${BACKUP_FILE}"
}

set -x

perform_local_backup

restore_local_backup
