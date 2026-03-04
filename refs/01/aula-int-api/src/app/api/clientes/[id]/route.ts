import { NextResponse } from "next/server";
import {
  deleteCliente,
  getCliente,
  patchCliente,
  replaceCliente,
} from "@/lib/clientes-db";


// Tipo que representa os parâmetros da rota dinâmica.
// Neste caso, a rota é algo como: /api/clientes/1
type RouteContext = {
  params: {
    id: string;
  };
};


// Tipo básico para o corpo recebido nas requisições PUT e PATCH.
// Como os alunos ainda não viram backend a fundo, mantemos simples:
// um objeto com chaves string e valores desconhecidos.
type RequestBody = Record<string, unknown>;


// Função auxiliar para converter o parâmetro "id" da URL em número.
// Exemplo:
// "5"   -> 5
// "abc" -> null
// "-2"  -> null
//
// Isso ajuda a validar o ID antes de tentar buscar ou alterar um cliente.
function parseId(param: string): number | null {
  const id = Number(param);

  // Verifica se o valor convertido é um número válido e maior que zero.
  if (!Number.isFinite(id) || id <= 0) {
    return null;
  }

  return id;
}


// Função auxiliar para padronizar respostas de erro.
// Assim evitamos repetir NextResponse.json(...) várias vezes.
function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}


// Função auxiliar para ler o corpo da requisição com segurança.
// Se o corpo vier inválido ou vazio, retornamos null.
// Isso evita que a API quebre ao tentar fazer req.json().
async function readJsonBody(req: Request): Promise<RequestBody | null> {
  try {
    const body = await req.json();

    // Garante que o corpo seja um objeto.
    // Ex.: aceita { nome: "Ana" }
    // Ex.: não aceita null, array ou string
    if (typeof body !== "object" || body === null || Array.isArray(body)) {
      return null;
    }

    return body as RequestBody;
  } catch {
    return null;
  }
}


/*
  GET /api/clientes/:id

  Objetivo:
  Buscar um cliente específico pelo ID informado na URL.
*/
export async function GET(_req: Request, ctx: RouteContext) {
  // Pega o id da rota e converte para número.
  const id = parseId(ctx.params.id);

  // Se o ID não for válido, retorna erro 400 (Bad Request).
  if (!id) {
    return jsonError("ID inválido", 400);
  }

  // Busca o cliente no "banco" simulado.
  const cliente = getCliente(id);

  // Se não encontrou, retorna erro 404 (Not Found).
  if (!cliente) {
    return jsonError("Não encontrado", 404);
  }

  // Se encontrou, retorna os dados do cliente em JSON.
  return NextResponse.json(cliente);
}


/*
  PUT /api/clientes/:id

  Objetivo:
  Substituir completamente os dados de um cliente existente.

  Em geral:
  - PUT espera um objeto completo
  - ele "troca" o recurso inteiro
*/
export async function PUT(req: Request, ctx: RouteContext) {
  const id = parseId(ctx.params.id);

  if (!id) {
    return jsonError("ID inválido", 400);
  }

  // Lê o corpo da requisição.
  const body = await readJsonBody(req);

  // Se o corpo não for um JSON válido, retorna erro 400.
  if (!body) {
    return jsonError("Corpo da requisição inválido", 400);
  }

  // Tenta substituir completamente o cliente.
  const updated = replaceCliente(id, body);

  // Se o cliente não existir, retorna 404.
  if (updated === null) {
    return jsonError("Não encontrado", 404);
  }

  // Em alguns casos, a função pode devolver um objeto com erro de validação.
  // Exemplo: campos obrigatórios ausentes.
  if ("error" in updated) {
    return NextResponse.json(updated, { status: 400 });
  }

  // Se deu tudo certo, retorna o cliente atualizado.
  return NextResponse.json(updated);
}


/*
  PATCH /api/clientes/:id

  Objetivo:
  Atualizar apenas parte dos dados de um cliente.

  Em geral:
  - PATCH altera parcialmente
  - ex.: mudar só o nome ou só o email
*/
export async function PATCH(req: Request, ctx: RouteContext) {
  const id = parseId(ctx.params.id);

  if (!id) {
    return jsonError("ID inválido", 400);
  }

  const body = await readJsonBody(req);

  if (!body) {
    return jsonError("Corpo da requisição inválido", 400);
  }

  // Tenta aplicar atualização parcial no cliente.
  const updated = patchCliente(id, body);

  if (updated === null) {
    return jsonError("Não encontrado", 404);
  }

  // Caso sua função patchCliente também possa retornar erro de validação,
  // esse bloco pode ser mantido para deixar a API mais consistente.
  if ("error" in updated) {
    return NextResponse.json(updated, { status: 400 });
  }

  return NextResponse.json(updated);
}


/*
  DELETE /api/clientes/:id

  Objetivo:
  Remover um cliente pelo ID.
*/
export async function DELETE(_req: Request, ctx: RouteContext) {
  const id = parseId(ctx.params.id);

  if (!id) {
    return jsonError("ID inválido", 400);
  }

  // Tenta remover o cliente.
  const deleted = deleteCliente(id);

  // Se não encontrou o cliente, retorna 404.
  if (!deleted) {
    return jsonError("Não encontrado", 404);
  }

  // 204 = sucesso, sem conteúdo de resposta.
  return new NextResponse(null, { status: 204 });
}