FROM node:18-alpine

# Instalar Nginx
RUN apk add --no-cache nginx

# Preparar backend
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install
COPY backend/ .

# Preparar frontend (SOLO PARA INSTALAR DEPENDENCIAS, NO PARA CONSTRUIR)
WORKDIR /app
COPY frontend/package*.json frontend/
RUN cd frontend && npm install
COPY frontend/ frontend/

# Configurar Nginx
COPY nginx/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80 3000

# ELIMINAMOS start.sh y usamos CMD directamente:
CMD ["/bin/sh", "-c", "nginx -g 'daemon off;' & cd /app/backend && node src/app.js"]