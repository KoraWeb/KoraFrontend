import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { token, rememberMe } = await req.json();

  if (!token) {
    return NextResponse.json({ error: "Token requerido" }, { status: 400 });
  }

  const response = NextResponse.json({ ok: true });

  // Cookie httpOnly — JavaScript nunca puede leerla
  response.cookies.set("token", token, {
    httpOnly: true,           // ← invisible para JavaScript
    secure: process.env.NODE_ENV === "production", // solo HTTPS en producción
    sameSite: "strict",       // protección CSRF
    path: "/",
    maxAge: rememberMe
      ? 60 * 60 * 24 * 30    // 30 días si marcó "Recuérdame"
      : 60 * 60 * 24,        // 1 día por defecto
  });

  return response;
}