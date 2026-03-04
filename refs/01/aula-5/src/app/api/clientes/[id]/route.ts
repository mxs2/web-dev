import { NextResponse } from "next/server";
import { deleteCliente, getCliente, patchCliente, replaceCliente } from "@/lib/clientes-db";

function parseId(param: string | null): number | null {
  const n = Number(param);
  return Number.isFinite(n) && n > 0 ? n : null;
}

// GET /api/clientes/:id
export async function GET(_req: Request, ctx: { params: { id: string } }) {
  const id = parseId(ctx.params?.id ?? null);
  if (!id) return NextResponse.json({ error: "ID inválido" }, { status: 400 });

  const cliente = getCliente(id);
  if (!cliente) return NextResponse.json({ error: "Não encontrado" }, { status: 404 });

  return NextResponse.json(cliente);
}

// PUT /api/clientes/:id
export async function PUT(req: Request, ctx: { params: { id: string } }) {
  const id = parseId(ctx.params?.id ?? null);
  if (!id) return NextResponse.json({ error: "ID inválido" }, { status: 400 });

  const body = await req.json().catch(() => ({}));
  const updated = replaceCliente(id, body as any);
  if (updated === null) return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
  if ("error" in (updated as any)) return NextResponse.json(updated, { status: 400 });

  return NextResponse.json(updated);
}

// PATCH /api/clientes/:id
export async function PATCH(req: Request, ctx: { params: { id: string } }) {
  const id = parseId(ctx.params?.id ?? null);
  if (!id) return NextResponse.json({ error: "ID inválido" }, { status: 400 });

  const body = await req.json().catch(() => ({}));
  const updated = patchCliente(id, body as any);
  if (updated === null) return NextResponse.json({ error: "Não encontrado" }, { status: 404 });

  return NextResponse.json(updated);
}

// DELETE /api/clientes/:id
export async function DELETE(_req: Request, ctx: { params: { id: string } }) {
  const id = parseId(ctx.params?.id ?? null);
  if (!id) return NextResponse.json({ error: "ID inválido" }, { status: 400 });

  const ok = deleteCliente(id);
  if (!ok) return NextResponse.json({ error: "Não encontrado" }, { status: 404 });

  return NextResponse.json({ ok: true }, { status: 204 });
}
