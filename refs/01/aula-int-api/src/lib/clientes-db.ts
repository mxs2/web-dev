import type { Cliente } from "@/types/cliente";

let seq = 3;
const now = () => new Date().toISOString();

let clientes: Cliente[] = [
  { id: 1, nome: "Ana Silva",  email: "ana@exemplo.com",  ativo: true,  criadoEm: now() },
  { id: 2, nome: "Bruno Lima", email: "bruno@exemplo.com", ativo: false, criadoEm: now() },
  { id: 3, nome: "Carla Souza", email: "carla@exemplo.com", ativo: true, criadoEm: now() },
];

export function listClientes(query?: { ativo?: string; q?: string }) {
  let data = [...clientes];

  if (query?.ativo === "true" || query?.ativo === "false") {
    const flag = query.ativo === "true";
    data = data.filter((c) => c.ativo === flag);
  }
  if (query?.q) {
    const q = query.q.toLowerCase();
    data = data.filter((c) => c.nome.toLowerCase().includes(q) || c.email.toLowerCase().includes(q));
  }
  return data;
}

export function getCliente(id: number) {
  return clientes.find((c) => c.id === id) || null;
}

export function createCliente(input: Partial<Cliente>) {
  if (!input.nome || !input.email) {
    return { error: "Campos obrigatórios: nome, email" } as const;
  }
  const novo: Cliente = {
    id: ++seq,
    nome: String(input.nome),
    email: String(input.email),
    ativo: input.ativo ?? true,
    criadoEm: now(),
  };
  clientes.push(novo);
  return novo;
}

export function replaceCliente(id: number, input: Partial<Cliente>) {
  const idx = clientes.findIndex((c) => c.id === id);
  if (idx === -1) return null;
  if (!input.nome || !input.email || typeof input.ativo !== "boolean") {
    return { error: "PUT requer: nome, email, ativo" } as const;
  }
  const updated: Cliente = {
    id,
    nome: String(input.nome),
    email: String(input.email),
    ativo: Boolean(input.ativo),
    criadoEm: clientes[idx].criadoEm,
  };
  clientes[idx] = updated;
  return updated;
}

export function patchCliente(id: number, input: Partial<Cliente>) {
  const idx = clientes.findIndex((c) => c.id === id);
  if (idx === -1) return null;
  const current = clientes[idx];
  const updated: Cliente = {
    ...current,
    ...(input.nome !== undefined ? { nome: String(input.nome) } : {}),
    ...(input.email !== undefined ? { email: String(input.email) } : {}),
    ...(input.ativo !== undefined ? { ativo: Boolean(input.ativo) } : {}),
  };
  clientes[idx] = updated;
  return updated;
}

export function deleteCliente(id: number) {
  const before = clientes.length;
  clientes = clientes.filter((c) => c.id !== id);
  return clientes.length < before;
}
