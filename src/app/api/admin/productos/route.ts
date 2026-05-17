import { NextRequest, NextResponse } from "next/server";

const getAPI = () =>
  process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export async function POST(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const body = await req.json();

  try {
    const res = await fetch(`${getAPI()}/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
      cache: "no-store",
    });
    const text = await res.text();
    let data: unknown;
    try { data = JSON.parse(text); } catch { data = {}; }
    if (!res.ok) {
      console.error(`[POST /products] Backend ${res.status}:`, text.slice(0, 500));
    }
    return NextResponse.json(data, { status: res.status });
  } catch (e: any) {
    console.error("[POST /products] Network error:", e?.message);
    return NextResponse.json({ error: "Error creando producto" }, { status: 503 });
  }
}