# bolao-starter

Template inicial para a atividade prática de Backend — Bolão da Copa do Mundo.

## Setup rápido

```bash
bash scripts/setup.sh
```

## Setup manual

```bash
cp .env.example .env
docker compose up -d
npm install
npm run prisma:generate
npm run prisma:migrate
npm run db:seed
npm run dev
```

API disponível em: http://localhost:3001/api
