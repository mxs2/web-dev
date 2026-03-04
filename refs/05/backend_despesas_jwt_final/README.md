# Backend de Despesas – Versão Final com Autenticação (JWT)

API de rastreamento de despesas com:

- Node.js + Express + TypeScript
- PostgreSQL (Docker) + Prisma
- Autenticação com JWT
- Senhas com bcrypt
- Autorização por role (admin/user)
- Regras de acesso a despesas por usuário

## Como rodar

1. Crie `.env` baseado em `.env.example`:

2. Suba o banco:

   ```bash
   docker-compose up -d
   ```

3. Instale dependências:

   ```bash
   npm install
   ```

4. Gere client, rode migrations e seed:

   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   npm run prisma:seed
   ```

5. Inicie o servidor:

   ```bash
   npm run dev
   ```

A API estará em `http://localhost:3003`.

## Usuários de teste

- Admin
  - email: admin@despesas.com
  - senha: admin123

- Usuário comum
  - email: joao@teste.com
  - senha: 123456

## Fluxo

1. Login:

   `POST /api/auth/login`

2. Usar o token retornado no header:

   ```http
   Authorization: Bearer SEU_TOKEN_AQUI
   ```

3. Acessar rotas de `/api/despesas` e `/api/users` conforme regras de permissão.
