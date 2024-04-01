#!/bin/bash

openssl req -x509 -nodes -days 365 \
    -subj "/C=KR/L=Seoul/O=42Seoul/CN=42seoul" \
    -newkey rsa:2048 \
    -keyout /certs/backend/backend.key \
    -out /certs/backend/backend.crt;