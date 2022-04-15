#!/bin/sh

echo -e "VUE_APP_HERMES_BACKEND_URL=${HERMES_BACKEND_URL}" > /app/.env
exec nginx -g 'daemon off;'
