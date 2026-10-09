#!/bin/sh
set -e

BUCKET="${UPLOAD_BUCKET:-manifold-storage}"

weed server -s3 -dir=/data -s3.config=/etc/seaweedfs/s3.json -s3.allowedOrigins=* &
server_pid=$!

# weed shell exits 0 once it connects, so this retries until the master is up and
# runs once; an existing bucket on restart is a no-op rather than a failure.
until echo "s3.bucket.create -name ${BUCKET}" | weed shell >/dev/null 2>&1; do
  sleep 1
done

wait "$server_pid"
