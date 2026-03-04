import { NextResponse } from "next/server";
import { createCliente, listClientes } from "@/lib/clientes-db";

// GET /api/clientes?q=ana&ativo=true
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? undefined;
  const ativo = searchParams.get("ativo") ?? undefined;

  const data = listClientes({ q, ativo });
  return NextResponse.json({ data });
}

// POST /api/clientes
export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const created = createCliente(body);

  if ("error" in created) {
    return NextResponse.json(
      { error: created.error },
      { status: 400 }
    );
  }

  return NextResponse.json(created, { status: 201 });
}
