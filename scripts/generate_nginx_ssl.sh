#!/bin/bash
openssl req -x509 -nodes -days 365 \
    -subj "/C=KR/L=Seoul/O=42Seoul/CN=42foryou" \
    -newkey rsa:2048 \
    -keyout /certs/nginx/42foryou.key \
    -out /certs/nginx/42foryou.crt;
