FROM node:18-alpine

# Instalar Nginx
RUN apk add --no-cache nginx

# Preparar backend
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install
COPY backend/ .

# Preparar frontend
WORKDIR /app
COPY frontend/package*.json frontend/
RUN cd frontend && npm install
COPY frontend/ frontend/
RUN cd frontend && npm run build

# Configurar Nginx
COPY nginx/nginx.conf /etc/nginx/http.d/default.conf

# Script de inicio
RUN echo '#!/bin/sh\nnginx -g "daemon off;" &\ncd /app/backend\nnode src/app.js' > /start.sh && chmod +x /start.sh

EXPOSE 80 3000

CMD ["/start.sh"]