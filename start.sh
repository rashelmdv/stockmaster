#!/bin/sh

# Iniciar Nginx en segundo plano
nginx -g "daemon off;" &

# Esperar 2 segundos para que Nginx arranque
sleep 2

# Iniciar el backend
echo "Iniciando backend..."
cd /app/backend
node src/app.js