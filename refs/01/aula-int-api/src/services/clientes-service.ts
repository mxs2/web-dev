import type { Cliente } from "@/types/cliente";

type ClientePayload = {
  nome: string;
  email: string;
  ativo: boolean;
};

type FetchClientesParams = {
  q?: string;
  ativo?: "true" | "false";
};

export async function fetchClientes(params: FetchClientesParams = {}) {
  const sp = new URLSearchParams();
  // URLSearchParams é usado para montar parâmetros de URL (query string)
  // de forma automática e segura, evitando erros na concatenação manual.
  // Ex.: /api/clientes?q=joao&ativo=true

  if (params.q) sp.set("q", params.q);
  if (params.ativo) sp.set("ativo", params.ativo);

  const queryString = sp.toString();
  const url = queryString ? `/api/clientes?${queryString}` : "/api/clientes";

  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) {
    throw new Error("Falha ao carregar clientes");
  }

  const json = await res.json();
  return json.data as Cliente[];
}

export async function createCliente(payload: ClientePayload) {
  const res = await fetch("/api/clientes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const json = await res.json().catch(() => null);
    throw new Error(json?.error || "Falha ao criar cliente");
  }

  return res;
}

export async function updateCliente(id: number, payload: ClientePayload) {
  const res = await fetch(`/api/clientes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const json = await res.json().catch(() => null);
    throw new Error(json?.error || "Falha ao atualizar cliente");
  }

  return res;
}

export async function updateClienteStatus(id: number, ativo: boolean) {
  const res = await fetch(`/api/clientes/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ativo }),
  });

  if (!res.ok) {
    const json = await res.json().catch(() => null);
    throw new Error(json?.error || "Falha ao atualizar status");
  }

  return res;
}

export async function deleteClienteById(id: number) {
  const res = await fetch(`/api/clientes/${id}`, {
    method: "DELETE",
  });

  if (!res.ok && res.status !== 204) {
    const json = await res.json().catch(() => null);
    throw new Error(json?.error || "Falha ao excluir cliente");
  }

  return res;
}