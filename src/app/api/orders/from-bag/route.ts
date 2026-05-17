import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const API = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
  const { bagId, shippingAddress } = await req.json();
  if (!bagId) return NextResponse.json({ error: "bagId requerido" }, { status: 400 });

  try {
    const res = await fetch(`${API}/orders/from-bag/${bagId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ shippingAddress: shippingAddress || "" }),
      cache: "no-store",
    });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (e) {
    console.error("orders/from-bag POST error:", e);
    return NextResponse.json({ error: "Error de conexión" }, { status: 500 });
  }
}