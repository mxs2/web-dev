#!/usr/bin/env bash
set -e

echo "→ Criando .env..."
cp .env.example .env

echo "→ Subindo PostgreSQL com Docker..."
docker compose up -d

echo "→ Aguardando banco ficar pronto..."
sleep 5

echo "→ Instalando dependências..."
npm install

echo "→ Gerando Prisma Client..."
npm run prisma:generate

echo "→ Aplicando migrations..."
npm run prisma:migrate

echo "→ Rodando seed..."
npm run db:seed

echo ""
echo "✅ Setup completo! Iniciando servidor..."
echo "   API disponível em http://localhost:3001/api"
echo ""
npm run dev
