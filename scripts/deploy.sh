#!/bin/bash

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Iniciando despliegue de StockMaster...${NC}"

# 1. Verificar dependencias
echo -e "${YELLOW}📋 Verificando dependencias...${NC}"
command -v docker >/dev/null 2>&1 || { echo -e "${RED}❌ Docker no está instalado${NC}" >&2; exit 1; }
command -v docker-compose >/dev/null 2>&1 || { echo -e "${RED}❌ Docker Compose no está instalado${NC}" >&2; exit 1; }

# 2. Detener contenedores anteriores
echo -e "${YELLOW}🛑 Deteniendo contenedores anteriores...${NC}"
docker-compose down

# 3. Construir imágenes
echo -e "${YELLOW}🔨 Construyendo imágenes Docker...${NC}"
docker-compose build

# 4. Ejecutar pruebas
echo -e "${YELLOW}🧪 Ejecutando pruebas...${NC}"
docker-compose run --rm backend npm test
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Las pruebas fallaron. Abortando despliegue.${NC}"
    exit 1
fi

# 5. Iniciar servicios
echo -e "${YELLOW}🚀 Iniciando servicios...${NC}"
docker-compose up -d

# 6. Esperar a que los servicios estén listos
echo -e "${YELLOW}⏳ Esperando a que los servicios estén listos...${NC}"
sleep 10

# 7. Verificar estado
echo -e "${YELLOW}🔍 Verificando estado...${NC}"
curl -s http://localhost:3000/health > /dev/null
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Despliegue completado exitosamente!${NC}"
    echo -e "${GREEN}🌐 Aplicación disponible en: http://localhost:80${NC}"
    echo -e "${GREEN}📊 API disponible en: http://localhost:3000${NC}"
else
    echo -e "${RED}❌ Error: La aplicación no responde${NC}"
    docker-compose logs
    exit 1
fi

# 8. Mostrar logs
echo -e "${YELLOW}📋 Mostrando logs...${NC}"
docker-compose logs --tail=20