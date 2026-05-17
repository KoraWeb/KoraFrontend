import { NextRequest, NextResponse } from "next/server";

const API = () => process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

function getToken(req: NextRequest) {
  return req.cookies.get("token")?.value;
}

export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const token = getToken(req);
  if (!token) return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  const { id } = await context.params;
  const body = await req.json();
  try {
    const res = await fetch(`${API()}/api/promotions/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
      cache: "no-store",
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: "Error de conexión" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const token = getToken(req);
  if (!token) return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  const { id } = await context.params;
  try {
    const res = await fetch(`${API()}/api/promotions/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (res.status === 204) return new NextResponse(null, { status: 204 });
    return NextResponse.json({}, { status: res.status });
  } catch {
    return NextResponse.json({ error: "Error de conexión" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const token = getToken(req);
  if (!token) return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  const { id } = await context.params;
  try {
    const res = await fetch(`${API()}/api/promotions/${id}/toggle`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: "Error de conexión" }, { status: 500 });
  }
}