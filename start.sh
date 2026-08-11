#!/bin/sh

# Iniciar Nginx en segundo plano
nginx -g "daemon off;" &

# Iniciar el backend
cd /app/backend
node src/app.js