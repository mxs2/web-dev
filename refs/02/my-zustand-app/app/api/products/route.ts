import { NextResponse } from "next/server";

type Product = { id: string; name: string; price: number; favorite: boolean };

let DB: Product[] = [
  { id: "p1", name: "Teclado Mecânico", price: 399, favorite: false },
  { id: "p2", name: "Mouse Ergonômico", price: 249, favorite: false },
  { id: "p3", name: "Monitor 27” 144Hz", price: 1799, favorite: true  },
];

export async function GET() {
  await new Promise((r) => setTimeout(r, 300));
  return NextResponse.json(DB);
}

export async function PATCH(request: Request) {
  const body = (await request.json()) as { id: string; favorite: boolean };
  const idx = DB.findIndex((p) => p.id === body.id);
  if (idx === -1) return NextResponse.json({ error: "not found" }, { status: 404 });

  DB[idx] = { ...DB[idx], favorite: body.favorite };
  return NextResponse.json(DB[idx]);
}
