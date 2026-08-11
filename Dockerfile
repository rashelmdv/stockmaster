FROM docker/compose:latest

WORKDIR /app

# Copia todo el proyecto
COPY . .

# Expone el puerto de Nginx (el que usa tu frontend)
EXPOSE 80 443

# Comando para iniciar todos los servicios
CMD ["docker-compose", "up"]