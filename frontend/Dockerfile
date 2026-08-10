# Etapa de construcción
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar package.json primero
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el código fuente
COPY . .

# Construir la aplicación
RUN npm run build

# Etapa de producción con Nginx
FROM nginx:alpine

# Copiar los archivos construidos
COPY --from=builder /app/build /usr/share/nginx/html

# Exponer puerto 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]