import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = req.cookies.get("token")?.value;
  if (!token) return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  const { id } = await params;
  const API = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
  const body = await req.json();
  try {
    const res = await fetch(`${API}/api/admin/orders/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
      cache: "no-store",
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (e) {
    console.error("admin/pedidos/[id]/status PATCH error:", e);
    return NextResponse.json({ error: "Error de conexión" }, { status: 500 });
  }
}