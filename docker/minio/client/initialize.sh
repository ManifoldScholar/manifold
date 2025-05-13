#!/usr/bin/env bash

set -eu

mc alias set docker "${S3_ENDPOINT}" "${MINIO_ROOT_USER}" "${MINIO_ROOT_PASSWORD}"
echo "An error about a bucket already existing can be ignored:"
mc mb "docker/${UPLOAD_BUCKET}" || :
mc policy set download "docker/${UPLOAD_BUCKET}"
