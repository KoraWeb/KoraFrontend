import { NextRequest, NextResponse } from "next/server";

const API = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) return NextResponse.json([], { status: 200 });

  try {
    const res = await fetch(`${API}/wishlist`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (e) {
    console.error("wishlist GET error:", e);
    return NextResponse.json({ error: "Error de conexión" }, { status: 500 });
  }
}