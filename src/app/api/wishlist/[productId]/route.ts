import { NextRequest, NextResponse } from "next/server";

const API = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export async function POST(
  req: NextRequest,
  { params }: { params: { productId: string } }
) {
  const token = req.cookies.get("token")?.value;
  if (!token) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  try {
    const res = await fetch(`${API}/wishlist/${params.productId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });
    const text = await res.text();
    const data = text ? JSON.parse(text) : {};
    return NextResponse.json(data, { status: res.status });
  } catch (e) {
    console.error("wishlist POST error:", e);
    return NextResponse.json({ error: "Error de conexión" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { productId: string } }
) {
  const token = req.cookies.get("token")?.value;
  if (!token) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  try {
    const res = await fetch(`${API}/wishlist/${params.productId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    return new NextResponse(null, { status: res.status });
  } catch (e) {
    console.error("wishlist DELETE error:", e);
    return NextResponse.json({ error: "Error de conexión" }, { status: 500 });
  }
}