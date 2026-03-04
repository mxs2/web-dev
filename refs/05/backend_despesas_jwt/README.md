# Backend de Despesas – Base para Aula de Autenticação (JWT)

Este projeto é uma API de exemplo para gerenciar despesas, construída em **Node.js + Express + TypeScript + Prisma + PostgreSQL**.

Ele está **preparado** para a aula de autenticação/autorização via JWT:
- Toda a configuração de servidor, banco e rotas já está pronta.
- Os endpoints funcionam **públicos** (sem autenticação).
- Falta apenas implementar:
  - cadastro seguro (hash de senha),
  - login com JWT,
  - middleware de autenticação,
  - regras de autorização por usuário/role.

## Tecnologias

- Node.js + Express
- TypeScript
- PostgreSQL (via Docker)
- Prisma ORM

## Estrutura

- `docker-compose.yml` – sobe o Postgres.
- `prisma/schema.prisma` – modelos `User` e `Despesa`.
- `src/server.ts` – inicializa o servidor Express.
- `src/routes` – rotas de `/api/users` e `/api/despesas`.
- `src/controllers` – controllers chamando services.
- `src/services` – regras de aplicação (sem auth ainda).
- `src/lib/prisma.ts` – cliente Prisma.

## Como rodar

1. Crie um arquivo `.env` com base no `.env.example`:

   ```env
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/despesas_db?schema=public"
   PORT=3003
   ```

2. Suba o banco com Docker:

   ```bash
   docker-compose up -d
   ```

3. Instale as dependências:

   ```bash
   npm install
   ```

4. Gere o client Prisma e rode as migrations:

   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   ```

5. Inicie o servidor em modo dev:

   ```bash
   npm run dev
   ```

A API ficará acessível em: `http://localhost:3003`

## Endpoints atuais (sem autenticação)

Base: `/api`

### Usuários

- `GET /api/users` – lista usuários (sem senha).
- `POST /api/users` – cria novo usuário.

  ```json
  {
    "name": "Ana",
    "email": "ana@example.com",
    "password": "senha123",
    "role": "user"
  }
  ```

Vocês irão:
> - aplicar hash na senha;
> - criar rota de login;
> - gerar JWT.

### Despesas

- `GET /api/despesas` – lista despesas (todas ou por `userId` via query).
- `GET /api/despesas/:id` – busca despesa por id.
- `POST /api/despesas` – cria despesa.

  ```json
  {
    "descricao": "Supermercado",
    "valor": 150.5,
    "data": "2025-11-18T00:00:00.000Z",
    "categoria": "Alimentação",
    "userId": 1
  }
  ```

- `PUT /api/despesas/:id` – atualiza despesa.
- `DELETE /api/despesas/:id` – remove despesa.

## Próxima etapa (em aula)

Vocês deverão implementar:

1. **Hash de senha (bcrypt)** ao criar usuários.
2. Rota de **login** (`POST /api/login`) que:
   - valida credenciais,
   - gera um JWT com id/role do usuário.
3. **Middleware de autenticação** que:
   - lê o token do header `Authorization: Bearer <token>`,
   - valida o JWT,
   - injeta o usuário na requisição.
4. Regras de autorização:
   - usuário comum só acessa **suas** despesas,
   - admin pode ver/gerenciar todas.

