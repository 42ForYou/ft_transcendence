#!/bin/bash

BACKEND_URL="http://backend:8000"

while ! curl -s $BACKEND_URL > /dev/null; do
    echo "Waiting for backend service..."
    sleep 1
done

echo "Backend service is up!"

nginx -g 'daemon off;'
