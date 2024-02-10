#!/bin/bash

set -e

echo $BACKEND_HOST $BACKEND_PORT

# backend 서비스가 준비될 때까지 대기
/scripts/wait-for-backend.sh $BACKEND_HOST $BACKEND_PORT -- 

# nginx 실행
exec nginx -g 'daemon off;'
