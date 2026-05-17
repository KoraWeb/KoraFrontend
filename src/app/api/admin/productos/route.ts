import { NextRequest, NextResponse } from "next/server";

const getAPI = () =>
  process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// POST /api/admin/productos          → crear producto nuevo
// POST /api/admin/productos?images=1&id=X → subir imágenes
export async function POST(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const url = new URL(req.url);
  const isImages = url.searchParams.get("images") === "1";
  const id = url.searchParams.get("id");

  if (isImages) {
    if (!id) return NextResponse.json({ error: "id requerido" }, { status: 400 });
    const formData = await req.formData();
    try {
      const res = await fetch(`${getAPI()}/products/${id}/images`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      return NextResponse.json(data, { status: res.status });
    } catch (e: any) {
      console.error("images POST error:", e?.message);
      return NextResponse.json({ error: "Error de conexión" }, { status: 500 });
    }
  }

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
    if (!res.ok) console.error(`[POST /products] Backend ${res.status}:`, text.slice(0, 500));
    return NextResponse.json(data, { status: res.status });
  } catch (e: any) {
    console.error("[POST /products] Network error:", e?.message);
    return NextResponse.json({ error: "Error creando producto" }, { status: 503 });
  }
}

// PUT /api/admin/productos?id=1  → actualizar producto
export async function PUT(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id requerido" }, { status: 400 });

  const body = await req.json();
  try {
    const res = await fetch(`${getAPI()}/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
      cache: "no-store",
    });
    const text = await res.text();
    let data: unknown;
    try { data = JSON.parse(text); } catch { data = {}; }
    if (!res.ok) console.error(`[PUT /products/${id}] Backend ${res.status}:`, text.slice(0, 500));
    return NextResponse.json(data, { status: res.status });
  } catch (e: any) {
    console.error(`[PUT /products/${id}] Network error:`, e?.message);
    return NextResponse.json({ error: "Error guardando" }, { status: 503 });
  }
}

// DELETE /api/admin/productos?id=1           → eliminar producto
// DELETE /api/admin/productos?images=1&id=X  → eliminar imagen
export async function DELETE(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const url = new URL(req.url);
  const isImages = url.searchParams.get("images") === "1";
  const id = url.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id requerido" }, { status: 400 });

  if (isImages) {
    const body = await req.json();
    try {
      const res = await fetch(`${getAPI()}/products/${id}/images`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      return NextResponse.json(data, { status: res.status });
    } catch (e: any) {
      console.error("images DELETE error:", e?.message);
      return NextResponse.json({ error: "Error de conexión" }, { status: 500 });
    }
  }

  try {
    const res = await fetch(`${getAPI()}/products/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (res.status === 204) return new NextResponse(null, { status: 204 });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (e: any) {
    console.error(`[DELETE /products/${id}] Network error:`, e?.message);
    return NextResponse.json({ error: "Error eliminando" }, { status: 503 });
  }
}