#!/bin/bash

set -e

# Instalar Docker si no está
if ! command -v docker &> /dev/null; then
  echo "Instalando Docker..."
  curl -fsSL https://get.docker.com -o get-docker.sh
  sh get-docker.sh
fi

# Instalar Docker Compose v2 manualmente si no existe
if ! docker compose version &> /dev/null; then
  echo "Instalando Docker Compose v2..."
  DOCKER_COMPOSE_VERSION="2.24.5"
  mkdir -p ~/.docker/cli-plugins/
  curl -SL https://github.com/docker/compose/releases/download/v${DOCKER_COMPOSE_VERSION}/docker-compose-linux-x86_64 -o ~/.docker/cli-plugins/docker-compose
  chmod +x ~/.docker/cli-plugins/docker-compose
fi

# Clonar el repositorio si no existe
REPO_URL="TU_REPO_CLIENTE"
DIR="clienteweb-main"

if [ ! -d "$DIR" ]; then
  git clone "$REPO_URL" "$DIR"
else
  echo "Directorio '$DIR' ya existe. No se vuelve a clonar."
fi

cd "$DIR"
docker compose up -d --build

echo "✅ Cliente desplegado. Accede a http://172.20.0.20/"