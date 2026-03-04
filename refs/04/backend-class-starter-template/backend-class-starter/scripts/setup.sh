#!/usr/bin/env bash
set -euo pipefail

# Setup script objetivo para preparar o projeto localmente.

# 1) Verificar dependências básicas
command -v node >/dev/null 2>&1 || { echo "Node não encontrado. Instale Node 20+."; exit 1; }
command -v npm >/dev/null 2>&1 || { echo "npm não encontrado. Instale o Node que inclui npm."; exit 1; }
command -v docker >/dev/null 2>&1 || { echo "Docker não encontrado. Instale o Docker Desktop."; exit 1; }

# 2) Copiar .env se não existir
if [ ! -f ".env" ]; then
  cp .env.example .env
  echo "[setup] .env criado a partir de .env.example"
fi

# 3) Subir Postgres via Docker
docker compose up -d
echo "[setup] PostgreSQL iniciado via Docker."

# 4) Instalar deps
npm install
echo "[setup] Dependências instaladas."

# 5) Gerar Prisma Client e migrar
npm run prisma:generate
npm run prisma:migrate
echo "[setup] Prisma Client gerado e migrations aplicadas."

# 6) Seed
npm run db:seed
echo "[setup] Base populada com dados de exemplo."

# 7) Iniciar servidor em dev
npm run dev
