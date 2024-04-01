#!/bin/bash

set -e

host="$1"
port="$2"
shift 2
cmd="$@"

while [ ! -f /etc/nginx/ssl/42foryou.crt ]; do
  echo "Waiting for ssl-init to complete..."
  sleep 1
done

until nc -z "$host" "$port"; do
  >&2 echo "Backend is unavailable - sleeping"
  sleep 1
done

>&2 echo "Backend is up - executing command"
