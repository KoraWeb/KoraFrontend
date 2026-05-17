import { NextRequest, NextResponse } from "next/server";

const API =
  process.env.NEXT_PUBLIC_API_URL;

  

type RouteContext = {
  params: Promise<{
    productId: string;
  }>;
};

function parseJson(text: string) {
  try {
    return text ? JSON.parse(text) : { ok: true };
  } catch {
    return { message: text };
  }
}

export async function POST(req: NextRequest, { params }: RouteContext) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  try {
    const { productId } = await params;

    const res = await fetch(`${API}/wishlist/${productId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const text = await res.text();
    const data = parseJson(text);

    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("wishlist POST error:", error);

    return NextResponse.json(
      { error: "Error de conexión" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: RouteContext) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  try {
    const { productId } = await params;

    const res = await fetch(`${API}/wishlist/${productId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const text = await res.text();
    const data = parseJson(text);

    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("wishlist DELETE error:", error);

    return NextResponse.json(
      { error: "Error de conexión" },
      { status: 500 }
    );
  }
}