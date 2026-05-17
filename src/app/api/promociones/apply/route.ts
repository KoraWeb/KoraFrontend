import { NextRequest, NextResponse } from "next/server";

const API = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export async function POST(req: NextRequest) {
  const body = await req.json();
  try {
    const res = await fetch(`${API}/api/promotions/apply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: "Error de conexión" }, { status: 500 });
  }
}