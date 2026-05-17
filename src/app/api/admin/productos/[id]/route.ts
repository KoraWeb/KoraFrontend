import { NextRequest, NextResponse } from "next/server";

const getAPI = () =>
  process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const token = req.cookies.get("token")?.value;
  if (!token) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const { id } = await context.params;
  const body = await req.json();

  try {
    const res = await fetch(`${getAPI()}/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
      cache: "no-store",
    });
    const text = await res.text();
    let data: unknown;
    try { data = JSON.parse(text); } catch { data = {}; }
    if (!res.ok) console.error(`[PUT /products/${id}] Backend ${res.status}:`, text.slice(0, 500));
    return NextResponse.json(data, { status: res.status });
  } catch (e: any) {
    console.error(`[PUT /products/${id}] Network error:`, e?.message);
    return NextResponse.json({ error: "Error guardando" }, { status: 503 });
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const token = req.cookies.get("token")?.value;
  if (!token) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const { id } = await context.params;

  try {
    const res = await fetch(`${getAPI()}/products/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (res.status === 204) return new NextResponse(null, { status: 204 });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (e: any) {
    console.error(`[DELETE /products/${id}] Network error:`, e?.message);
    return NextResponse.json({ error: "Error eliminando" }, { status: 503 });
  }
}