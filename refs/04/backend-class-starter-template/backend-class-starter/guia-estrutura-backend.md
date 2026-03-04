
# Guia de Estrutura do Projeto — Node.js + TypeScript + Express + Prisma (PostgreSQL)

Este documento explica a estrutura do projeto entregue para a prática em sala, o fluxo de execução a partir do `server.ts`, e a organização das camadas. O objetivo é orientar o desenvolvimento incremental, mantendo responsabilidades claras entre arquivos e pastas.

---

## 1. Visão da Arquitetura

O projeto segue a organização em camadas:

```
HTTP (Express/Rotas)
  → Controllers (camada de orquestração HTTP)
    → Repositories (acesso a dados)
      → Prisma Client (ORM)
        → Banco de dados (PostgreSQL)
```

Princípios adotados:
- Separação de responsabilidades por camada.
- Entrada/validação na borda HTTP.
- Repositórios encapsulam o Prisma (isolando a infraestrutura de dados do restante da aplicação).
- Arquivos pequenos, funções coesas e nomes explícitos.

---

## 2. Fluxo de Execução a partir do `server.ts`

1. **`src/server.ts`** cria a aplicação e inicia o servidor HTTP.
   - Importa `createApp` e lê as variáveis de ambiente.
   - Executa `app.listen(PORT)`. A partir deste ponto a API passa a responder requisições.

2. **`src/infrastructure/http/app.ts`** monta a aplicação Express:
   - Registra middlewares de segurança (`helmet`), CORS, `express.json()` e `morgan` (logs).
   - Define rota de health check.
   - Conecta o roteador principal em `/api`.
   - Define tratadores para 404 e para erros não tratados.

3. **`src/application/routes`** registra as rotas de recurso:
   - Ex.: `product.routes.ts` e `category.routes.ts` mapeiam caminhos HTTP para métodos de controllers.

4. **`src/application/controllers`** executa a lógica coordenando validação, serviços/repositórios e respostas HTTP:
   - Recebe `Request`/`Response` do Express.
   - Valida a entrada (ex.: Zod).
   - Chama repositórios para ler/gravar dados.
   - Constrói o formato de resposta e status code.

5. **`src/infrastructure/repositories`** acessa o banco via **Prisma Client**:
   - Não conhece `Request`/`Response`.
   - Implementa operações como `findMany`, `findUnique`, `create`, `update`, `delete`.
   - Retorna dados de domínio para a camada superior.

6. **`src/infrastructure/prisma.ts`** expõe **uma instância única** do `PrismaClient`:
   - Evita excesso de conexões em desenvolvimento (hot reload).
   - Pode centralizar logs e configurações do client.

7. **Banco de dados**:
   - **`prisma/schema.prisma`** define modelos e relacionamentos.
   - **Migrations** são geradas e aplicadas com `prisma migrate`.
   - **`prisma/seed.ts`** insere dados iniciais para testes.

---

## 3. Estrutura de Pastas e Arquivos

Árvore relevante (simplificada):

```
backend-class-starter/
├── docker-compose.yml
├── package.json
├── .env.example
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── src/
│   ├── server.ts
│   ├── shared/
│   │   └── env.ts
│   ├── infrastructure/
│   │   ├── http/
│   │   │   └── app.ts
│   │   ├── prisma.ts
│   │   └── repositories/
│   │       ├── ProductRepository.ts
│   │       └── CategoryRepository.ts
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

### 3.1 Raiz do repositório
- **`docker-compose.yml`**: provisiona o Postgres local para desenvolvimento.
- **`package.json`**: scripts e dependências do projeto.
- **`.env.example`**: modelo de configuração (copiar para `.env`).
- **`.gitignore`**: ignora artefatos de build e arquivos locais de ambiente.

### 3.2 `prisma/`
- **`schema.prisma`**: modelos de dados, índices e relacionamentos. É a fonte de verdade do domínio persistido.
- **`seed.ts`**: script de povoamento da base para testes manuais. Útil para garantir dados mínimos após `migrate`.

### 3.3 `src/server.ts`
Responsável por iniciar o servidor HTTP.
Exemplo abreviado:
```ts
import { createApp } from "./infrastructure/http/app";
import { env } from "./shared/env";

const app = createApp();
app.listen(env.PORT, () => {
  console.log(`[server] up on port ${env.PORT}`);
});
```

### 3.4 `src/shared/env.ts`
Carrega variáveis de ambiente (via `dotenv`) e expõe um objeto `env`. Centraliza configuração de porta, `DATABASE_URL`, `NODE_ENV`.

### 3.5 `src/infrastructure/http/app.ts`
Cria e configura a instância Express:
- Middlewares: segurança, CORS, JSON e logs.
- Rotas de infraestrutura: `/health`.
- Roteador principal: `app.use("/api", router)`.
- Tratadores de 404 e erro padrão.

### 3.6 `src/application/routes/`
- **`index.ts`**: agrega sub-roteadores.
- **`*.routes.ts`**: define endpoints por recurso e mapeia para o controller correspondente.
  - Ex.: `productRouter.get("/", controller.list)`.

### 3.7 `src/application/controllers/`
- **Responsabilidade**: orquestrar a requisição HTTP.
- **Tarefas típicas**:
  - Extrair parâmetros, query e body.
  - Validar dados de entrada (ex.: Zod).
  - Chamar repositórios (sem lógica de SQL).
  - Construir respostas com status code adequado.
- **Exemplo**: `ProductController` com métodos `list`, `getById`, `create`, `update`, `remove`.

### 3.8 `src/infrastructure/repositories/`
- **Responsabilidade**: encapsular o acesso a dados via Prisma.
- **Padrões**:
  - Tipos DTO simples para `create` e `update`.
  - Nenhum conhecimento de HTTP.
  - Retorno de entidades ou estruturas prontas para o controller.
- **Exemplos**:
  - `ProductRepository` com operações CRUD e `include` de relações.
  - `CategoryRepository` com listagem e criação.

### 3.9 `src/infrastructure/prisma.ts`
- Cria uma única instância do `PrismaClient`.
- Em desenvolvimento, reutiliza a instância em hot reload.
- Pode registrar logs de consultas (`prisma.$on("query", ...)`) para inspeção.

### 3.10 `scripts/setup.sh`
Script shell para padronizar a preparação do ambiente:
- Copia `.env` se ausente.
- Sobe o Postgres com Docker.
- Instala dependências.
- Gera client do Prisma, aplica migrations e roda seed.
- Inicia o servidor em modo desenvolvimento.

---

## 4. Ciclo de Desenvolvimento

1. Ajustar o domínio em `prisma/schema.prisma`.
2. Rodar `npm run prisma:migrate` para criar/aplicar migrations.
3. Rodar `npm run prisma:generate` para atualizar o client.
4. Implementar/ajustar repositórios para refletir as mudanças.
5. Consumir repositórios nos controllers e expor pelas rotas.
6. Testar com HTTP client (Insomnia, Postman ou `.http`).

Observação: para massa de dados, use `npm run db:seed`.

---

## 5. Diretrizes por Camada

- **Rotas (`application/routes`)**: definem endpoints e mapeiam para controllers.
- **Controllers (`application/controllers`)**: validação e orquestração HTTP. Não contêm lógica de acesso a dados.
- **Repositórios (`infrastructure/repositories`)**: acesso a dados com Prisma. Não conhecem Express.
- **Infraestrutura HTTP (`infrastructure/http`)**: inicialização de app, middlewares e tratadores de erro.
- **Prisma (`infrastructure/prisma.ts` e `prisma/`)**: configuração do ORM, definição de schema e scripts de seed.
- **Shared (`shared/`)**: utilitários transversais, como variáveis de ambiente e helpers puros.

---

## 6. Referências de Comandos Úteis

- `npm run dev` — inicia o servidor com hot reload.
- `npm run prisma:migrate` — cria/aplica migrations com base no schema.
- `npm run prisma:generate` — (re)gera o Prisma Client tipado.
- `npm run db:seed` — popula a base com dados de exemplo.
- `npx prisma studio` — interface web para visualizar e editar dados.

---

## 7. Exemplo de Fluxo de uma Requisição

1. `GET /api/products` chega ao Express.
2. Rota `product.routes.ts` chama `ProductController.list`.
3. Controller chama `ProductRepository.list()`.
4. Repositório executa `prisma.product.findMany(...)`.
5. Prisma executa SQL no Postgres e retorna os dados.
6. Controller retorna `200 OK` com JSON para o cliente.

Este fluxo se repete para as demais operações (consulta por id, criação, atualização e remoção), variando apenas a combinação de validação/DTOs e métodos do repositório.
