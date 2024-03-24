#!/bin/bash

set -e

/scripts/generate_nginx_ssl.sh
/scripts/generate_backend_ssl.sh

