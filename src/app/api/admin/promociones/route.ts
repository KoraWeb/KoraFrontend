import { NextRequest, NextResponse } from "next/server";

const API = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

function getToken(req: NextRequest) {
  return req.cookies.get("token")?.value;
}

export async function GET(req: NextRequest) {
  const token = getToken(req);
  if (!token) return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  try {
    const res = await fetch(`${API}/api/promotions`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (e) {
    console.error("promociones GET error:", e);
    return NextResponse.json({ error: "Error de conexión" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const token = getToken(req);
  if (!token) return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  const body = await req.json();
  try {
    const res = await fetch(`${API}/api/promotions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
      cache: "no-store",
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (e) {
    console.error("promociones POST error:", e);
    return NextResponse.json({ error: "Error de conexión" }, { status: 500 });
  }
}