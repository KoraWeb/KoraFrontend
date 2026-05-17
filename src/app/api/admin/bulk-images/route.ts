import { NextRequest, NextResponse } from "next/server";

const getAPI = () =>
  process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export async function POST(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const preview = searchParams.get("preview") === "true";
  const body = await req.json();

  const endpoint = preview
    ? `${getAPI()}/api/admin/bulk-images/preview`
    : `${getAPI()}/api/admin/bulk-images`;

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
      cache: "no-store",
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (e: any) {
    console.error("[bulk-images] Network error:", e?.message);
    return NextResponse.json({ error: "Error de conexión" }, { status: 503 });
  }
}