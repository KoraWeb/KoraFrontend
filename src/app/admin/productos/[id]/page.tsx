"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { Product } from "@/api/types/product";

type UploadingFile = { file: File; preview: string; done: boolean; error: boolean };

export default function AdminProductoEditPage() {
  const router = useRouter();
  const params = useParams();
  const isNew = params.id === "nuevo";
  const productId = isNew ? null : Number(params.id);

  const [fetching, setFetching] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [saveOk, setSaveOk] = useState(false);
  const [saveError, setSaveError] = useState("");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [sizes, setSizes] = useState<{ size: string; stock: number }[]>([{ size: "", stock: 0 }]);
  const [uploading, setUploading] = useState<UploadingFile[]>([]);
  const [dragOver, setDragOver] = useState(false);

  // Cargar producto existente — GET es público, no necesita auth
  useEffect(() => {
    if (isNew || !productId) { setFetching(false); return; }
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${productId}`)
      .then(r => r.json())
      .then((data: Product) => {
        setName(data.name);
        setDescription(data.description);
        setPrice(String(data.price));
        setCategory(data.category);
        setImages(data.images ?? []);
        setSizes(data.sizes?.map(s => ({ size: s.size, stock: s.stock })) ?? [{ size: "", stock: 0 }]);
      })
      .finally(() => setFetching(false));
  }, [productId, isNew]);

  // ─── SUBIDA DE IMÁGENES — via API Route server-side ────────────────────────

  const uploadFiles = useCallback(async (files: File[]) => {
    const imageFiles = files.filter(f => f.type.startsWith("image/"));
    if (!imageFiles.length) return;

    const entries: UploadingFile[] = imageFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      done: false,
      error: false,
    }));
    setUploading(prev => [...prev, ...entries]);

    const BATCH = 5;
    for (let i = 0; i < imageFiles.length; i += BATCH) {
      const batch = imageFiles.slice(i, i + BATCH);
      await Promise.all(batch.map(async (file, batchIdx) => {
        const globalIdx = uploading.length + i + batchIdx;
        try {
          const fd = new FormData();
          fd.append("files", file);

          // Llama a la API Route server-side — el token lo pone el servidor
          const res = await fetch(`/api/admin/productos/${productId}/images`, {
            method: "POST",
            body: fd,
          });

          if (!res.ok) throw new Error("Error subiendo imagen");
          const data = await res.json();
          const url = data.images?.[data.images.length - 1] ?? "";
          setImages(prev => [...prev, url]);
          setUploading(prev => prev.map((u, idx) =>
            idx === globalIdx ? { ...u, done: true } : u
          ));
        } catch {
          setUploading(prev => prev.map((u, idx) =>
            idx === globalIdx ? { ...u, error: true, done: true } : u
          ));
        }
      }));
    }
  }, [productId, uploading.length]);

  const handleFilePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) uploadFiles(Array.from(e.target.files));
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files) uploadFiles(Array.from(e.dataTransfer.files));
  };

  const removeImage = async (url: string) => {
    setImages(prev => prev.filter(u => u !== url));
    if (productId) {
      // API Route server-side
      await fetch(`/api/admin/productos/${productId}/images`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
    }
  };

  // ─── TALLAS ────────────────────────────────────────────────────────────────

  const addSize = () => setSizes(prev => [...prev, { size: "", stock: 0 }]);
  const removeSize = (i: number) => setSizes(prev => prev.filter((_, idx) => idx !== i));
  const updateSize = (i: number, field: "size" | "stock", value: string | number) =>
    setSizes(prev => prev.map((s, idx) => idx === i ? { ...s, [field]: value } : s));

  // ─── GUARDAR — via API Route server-side ───────────────────────────────────

  const handleSave = async () => {
    if (!name || !price || !category) { setSaveError("Nombre, precio y categoría son obligatorios."); setTimeout(() => setSaveError(""), 4000); return; }
    setSaving(true);
    try {
      const body = {
        name, description, price: parseFloat(price), category,
        images,
        sizes: sizes.filter(s => s.size.trim()).map(s => ({ size: s.size, stock: Number(s.stock) })),
      };

      const res = await fetch(
        isNew ? "/api/admin/productos" : `/api/admin/productos/${productId}`,
        {
          method: isNew ? "POST" : "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      if (!res.ok) {
        setSaveError("No se pudo guardar el producto. Inténtalo de nuevo.");
        setTimeout(() => setSaveError(""), 4000);
        return;
      }
      const data = await res.json();
      setSaveOk(true);
      setSaveError("");
      setTimeout(() => setSaveOk(false), 3000);
      if (isNew) router.push(`/admin/productos/${data.id}`);
    } catch {
      setSaveError("No se pudo guardar el producto. Inténtalo de nuevo.");
      setTimeout(() => setSaveError(""), 4000);
    } finally {
      setSaving(false);
    }
  };

  if (fetching) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f7f7f5] text-black" style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>

      <div className="border-b border-black/10 bg-white px-8 py-5 flex items-center justify-between sticky top-[70px] z-10">
        <div className="flex items-center gap-4">
          <button onClick={() => router.push("/admin/productos")} className="text-xs text-black/40 hover:text-black transition-colors">
            ← Productos
          </button>
          <div className="w-px h-4 bg-black/20" />
          <h1 className="text-lg font-black tracking-tight">
            {isNew ? "Nuevo producto" : (name || "Editar producto")}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          {saveOk && <span className="text-xs text-green-600 font-semibold">✓ Guardado</span>}
          {saveError && <span className="text-xs text-red-500 font-semibold">{saveError}</span>}
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-black text-white text-xs font-bold tracking-widest uppercase px-6 py-2.5 hover:bg-black/80 transition-colors rounded-lg disabled:opacity-50"
          >
            {saving ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">

        <div className="flex flex-col gap-6">

          {/* IMÁGENES */}
          <div className="bg-white rounded-2xl border border-black/10 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-black/40">Imágenes del producto</h2>
              <span className="text-xs text-black/40">{images.length} foto{images.length !== 1 ? "s" : ""}</span>
            </div>

            {isNew && (
              <div className="mb-4 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                <p className="text-xs text-amber-700 font-medium">Guarda el producto primero antes de subir imágenes.</p>
              </div>
            )}

            {!isNew && (
              <label
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl py-10 cursor-pointer transition-all ${
                  dragOver ? "border-black bg-black/5" : "border-black/20 hover:border-black/40 hover:bg-black/[0.02]"
                }`}
              >
                <input type="file" multiple accept="image/*" onChange={handleFilePick} className="hidden" />
                <p className="text-sm font-semibold text-black/60">Arrastra fotos aquí o haz clic</p>
                <p className="text-xs text-black/30 mt-1">JPG, PNG, WEBP — sin límite de cantidad</p>
              </label>
            )}

            {uploading.filter(u => !u.done).length > 0 && (
              <div className="mt-4 flex flex-col gap-2">
                {uploading.filter(u => !u.done).map((u, i) => (
                  <div key={i} className="flex items-center gap-3 bg-black/[0.02] rounded-lg px-3 py-2">
                    <img src={u.preview} className="w-8 h-8 rounded object-cover" alt="" />
                    <div className="flex-1">
                      <p className="text-xs font-medium truncate">{u.file.name}</p>
                      <div className="mt-1 h-1 bg-black/10 rounded-full overflow-hidden">
                        <div className="h-full bg-black rounded-full animate-pulse w-3/5" />
                      </div>
                    </div>
                    <span className="text-[10px] text-black/30">Subiendo...</span>
                  </div>
                ))}
              </div>
            )}

            {images.length > 0 && (
              <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {images.map((url, i) => (
                  <div key={url} className="group relative aspect-square rounded-xl overflow-hidden bg-[#f2f2f2] border border-black/10">
                    <img src={url} alt={`Foto ${i + 1}`} className="w-full h-full object-contain p-2" />
                    {i === 0 && (
                      <div className="absolute top-1.5 left-1.5 bg-black text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                        Portada
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      {i > 0 && (
                        <button
                          onClick={() => setImages(prev => {
                            const arr = [...prev];
                            [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]];
                            return arr;
                          })}
                          className="bg-white/90 text-black text-xs font-bold w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white"
                        >←</button>
                      )}
                      <button
                        onClick={() => removeImage(url)}
                        className="bg-red-500 text-white text-xs font-bold w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-600"
                      >X</button>
                      {i < images.length - 1 && (
                        <button
                          onClick={() => setImages(prev => {
                            const arr = [...prev];
                            [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
                            return arr;
                          })}
                          className="bg-white/90 text-black text-xs font-bold w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white"
                        >→</button>
                      )}
                    </div>
                    <div className="absolute bottom-1.5 right-1.5 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded font-bold">
                      {i + 1}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* TALLAS */}
          <div className="bg-white rounded-2xl border border-black/10 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-black/40">Tallas y stock</h2>
              <button onClick={addSize} className="text-xs font-bold bg-black text-white px-3 py-1.5 rounded-lg hover:bg-black/80 transition-colors">
                + Añadir talla
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {sizes.map((s, i) => (
                <div key={i} className="flex items-center gap-3">
                  <input
                    value={s.size}
                    onChange={e => updateSize(i, "size", e.target.value)}
                    placeholder="XS, S, M, L, XL..."
                    className="flex-1 border border-black/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black"
                  />
                  <div className="flex items-center gap-1 border border-black/20 rounded-lg px-3 py-2">
                    <span className="text-xs text-black/40">Stock:</span>
                    <input
                      type="number"
                      min={0}
                      value={s.stock}
                      onChange={e => updateSize(i, "stock", e.target.value)}
                      className="w-16 text-sm font-bold text-right focus:outline-none"
                    />
                  </div>
                  <button
                    onClick={() => removeSize(i)}
                    className="w-8 h-8 rounded-lg border border-red-200 text-red-400 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all text-xs font-bold flex items-center justify-center"
                  >X</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* DATOS */}
        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-2xl border border-black/10 p-6 flex flex-col gap-4 sticky top-[130px]">
            <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-black/40">Datos del producto</h2>

            <div>
              <label className="text-[10px] font-bold tracking-widest uppercase text-black/40 block mb-1.5">Nombre *</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Nombre del producto"
                className="w-full border border-black/20 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-black transition-colors" />
            </div>

            <div>
              <label className="text-[10px] font-bold tracking-widest uppercase text-black/40 block mb-1.5">Descripción</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Descripción del producto..." rows={4}
                className="w-full border border-black/20 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:border-black transition-colors" />
            </div>

            <div>
              <label className="text-[10px] font-bold tracking-widest uppercase text-black/40 block mb-1.5">Precio (€) *</label>
              <input type="number" min={0} step={0.01} value={price} onChange={e => setPrice(e.target.value)} placeholder="0.00"
                className="w-full border border-black/20 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-black transition-colors" />
            </div>

            <div>
              <label className="text-[10px] font-bold tracking-widest uppercase text-black/40 block mb-1.5">Categoría *</label>
              <input value={category} onChange={e => setCategory(e.target.value)} placeholder="camisetas, pantalones, zapatos..."
                className="w-full border border-black/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors" />
            </div>

            <button onClick={handleSave} disabled={saving}
              className="w-full bg-black text-white text-xs font-bold tracking-widest uppercase py-4 rounded-xl hover:bg-black/80 transition-colors disabled:opacity-50 mt-2">
              {saving ? "Guardando..." : (isNew ? "Crear producto" : "Guardar cambios")}
            </button>

            {!isNew && (
              <a href={`/search/${productId}`} target="_blank"
                className="text-center text-xs text-black/40 hover:text-black transition-colors">
                Ver en tienda →
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}