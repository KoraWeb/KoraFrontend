import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

type UserPayload = { sub: string; role: string; exp: number };

export async function POST(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  let decoded: UserPayload;
  try {
    decoded = jwtDecode<UserPayload>(token);
    if (decoded.exp * 1000 < Date.now()) {
      return NextResponse.json({ error: "Sesión expirada" }, { status: 401 });
    }
  } catch {
    return NextResponse.json({ error: "Token inválido" }, { status: 401 });
  }

  if (decoded.role !== "ADMIN") {
    return NextResponse.json({ error: "Sin permisos" }, { status: 403 });
  }

  const body = await req.json();
  const { password } = body;
  if (!password) return NextResponse.json({ error: "Contraseña requerida" }, { status: 400 });

  const API = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

  try {
    const res = await fetch(`${API}/api/admin/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ password }),
      cache: "no-store",
    });
    if (res.ok) return NextResponse.json({ ok: true });
    return NextResponse.json({ error: "Verificación fallida" }, { status: 401 });
  } catch (e) {
    console.error("admin/verify error:", e);
    return NextResponse.json({ error: "Error de conexión" }, { status: 500 });
  }
}