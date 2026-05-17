import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const API = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
  const { searchParams } = new URL(req.url);
  const year = searchParams.get("year");
  const url = year ? `${API}/orders?year=${year}` : `${API}/orders`;

  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (e) {
    console.error("orders GET error:", e);
    return NextResponse.json({ error: "Error de conexión" }, { status: 500 });
  }
}