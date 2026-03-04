# Backend Class Starter (Node + TS + Express + Prisma + PostgreSQL)

Projeto base para a aula de backend com **Node.js + TypeScript + Express + Prisma** conectado a **PostgreSQL**.

## Estrutura

```
backend-class-starter/
├── docker-compose.yml
├── package.json
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── src/
│   ├── server.ts
│   ├── shared/env.ts
│   ├── infrastructure/
│   │   ├── prisma.ts
│   │   └── http/app.ts
│   └── application/
│       ├── routes/
│       │   ├── index.ts
│       │   ├── product.routes.ts
│       │   └── category.routes.ts
│       └── controllers/
│           ├── ProductController.ts
│           └── CategoryController.ts
└── scripts/
    └── setup.sh
```

## Passo a passo (do zero ao CRUD rodando)

1. **Pré-requisitos**
   - Node 20+
   - Docker Desktop (ou um Postgres local)
   - PNPM/NPM/Yarn (à sua escolha)

2. **Suba o PostgreSQL com Docker**
   ```bash
   docker compose up -d
   ```

3. **Copie o `.env.example` para `.env` e ajuste se necessário**
   ```bash
   cp .env.example .env
   ```

4. **Instale as dependências**
   ```bash
   npm install
   ```

5. **Gere o cliente Prisma e rode a primeira migration**
   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   ```

6. **Popule a base com dados de exemplo**
   ```bash
   npm run db:seed
   ```

7. **Rode o servidor em modo dev**
   ```bash
   npm run dev
   ```

8. **Teste os endpoints**
   - `GET http://localhost:3001/health`
   - `GET http://localhost:3001/api/categories`
   - `POST http://localhost:3001/api/categories { "name": "Toys" }`
   - `GET http://localhost:3001/api/products`
   - `POST http://localhost:3001/api/products` com corpo
     ```json
     { "name":"Ball", "sku":"TOY-001", "priceCents":990, "categoryId":1 }
     ```
   - `GET http://localhost:3001/api/products/1`
   - `PUT http://localhost:3001/api/products/1` com corpo
     ```json
     { "priceCents": 1490 }
     ```
   - `DELETE http://localhost:3001/api/products/1`

## Convenções didáticas

- **Camadas**: rotas → controllers → repositories → Prisma.
- **Validação**: `zod` na borda HTTP.
- **Migrations**: `prisma migrate` versiona o schema do banco.
- **Seed**: `prisma/seed.ts` para massa de teste.

## Dicas de troubleshooting

- Erro `Can't reach database server`: verifique se o container está rodando e a `DATABASE_URL`.
- Alterou o schema? Rode novamente `npm run prisma:migrate` (ou `prisma db push` para dev).
- Porta em uso? Ajuste `PORT` no `.env` e na chamada dos endpoints.
