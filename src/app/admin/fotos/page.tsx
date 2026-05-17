"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Product } from "@/api/types/product";
import { getProducts } from "@/api/product/route";

type Tab = "upload" | "bulk";
type UploadEntry = { id: string; file: File; preview: string; status: "pending"|"uploading"|"done"|"error"; url?: string; assignedProductId?: number; };
type BulkEntry = { productId: number; urls: string[]; replace?: boolean };
type PreviewRow = { productId: number; productName: string; urlCount: number; currentImages: number; found: boolean };
type PreviewResult = { totalUrls: number; productsNotFound: number; detail: PreviewRow[] };
type InsertResult = { inserted: number; skipped: number; errors: string[]; ok: boolean };

function parseJSON(text: string): BulkEntry[] {
  const data = JSON.parse(text);
  if (!Array.isArray(data)) throw new Error("El JSON debe ser un array");
  return data.map((d: any) => ({ productId: Number(d.productId), urls: Array.isArray(d.urls) ? d.urls : [], replace: Boolean(d.replace) }));
}

function parseCSV(text: string): BulkEntry[] {
  const lines = text.split("\n").map((l: string) => l.trim()).filter(Boolean);
  const map: Record<number, string[]> = {};
  for (const line of lines) {
    if (line.startsWith("productId") || line.startsWith("#")) continue;
    const [idStr, ...rest] = line.split(",");
    const url = rest.join(",").trim();
    const id = Number(idStr.trim());
    if (!id || !url) continue;
    if (!map[id]) map[id] = [];
    map[id].push(url);
  }
  return Object.entries(map).map(([id, urls]) => ({ productId: Number(id), urls }));
}

const EX_JSON = `[\n  {\n    "productId": 1,\n    "urls": [\n      "https://res.cloudinary.com/.../foto1.jpg",\n      "https://res.cloudinary.com/.../foto2.jpg"\n    ],\n    "replace": false\n  },\n  {\n    "productId": 2,\n    "urls": ["https://res.cloudinary.com/.../foto1.jpg"]\n  }\n]`;
const EX_CSV = `productId,url\n1,https://res.cloudinary.com/.../foto1.jpg\n1,https://res.cloudinary.com/.../foto2.jpg\n2,https://res.cloudinary.com/.../foto1.jpg`;

export default function AdminFotosPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bulkFileRef = useRef<HTMLInputElement>(null);
  const [tab, setTab] = useState<Tab>("upload");
  const [products, setProducts] = useState<Product[]>([]);

  // Upload state
  const [entries, setEntries] = useState<UploadEntry[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [defaultProduct, setDefaultProduct] = useState<number|"">("");
  const [uploadingAll, setUploadingAll] = useState(false);

  // Bulk state
  const [bulkMode, setBulkMode] = useState<"json"|"csv">("json");
  const [bulkText, setBulkText] = useState("");
  const [bulkReplace, setBulkReplace] = useState(false);
  const [bulkEntries, setBulkEntries] = useState<BulkEntry[]|null>(null);
  const [bulkParseError, setBulkParseError] = useState("");
  const [bulkPreview, setBulkPreview] = useState<PreviewResult|null>(null);
  const [bulkResult, setBulkResult] = useState<InsertResult|null>(null);
  const [bulkStep, setBulkStep] = useState<"input"|"preview"|"done">("input");
  const [bulkLoading, setBulkLoading] = useState(false);

  useEffect(() => { getProducts().then(setProducts); }, []);

  // Upload handlers
  const addFiles = useCallback((files: File[]) => {
    const imgs = files.filter(f => f.type.startsWith("image/"));
    setEntries(prev => [...prev, ...imgs.map(file => ({
      id: `${Date.now()}_${Math.random()}`, file,
      preview: URL.createObjectURL(file), status: "pending" as const,
      assignedProductId: defaultProduct ? Number(defaultProduct) : undefined,
    }))]);
  }, [defaultProduct]);

  const handleDrop = (e: React.DragEvent) => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files) addFiles(Array.from(e.dataTransfer.files)); };
  const handleFilePick = (e: React.ChangeEvent<HTMLInputElement>) => { if (e.target.files) addFiles(Array.from(e.target.files)); e.target.value = ""; };
  const setAssignment = (id: string, pid: number|undefined) => setEntries(prev => prev.map(e => e.id === id ? { ...e, assignedProductId: pid } : e));
  const removeEntry = (id: string) => setEntries(prev => prev.filter(e => e.id !== id));

  const uploadEntry = async (entry: UploadEntry) => {
    if (!entry.assignedProductId) return;
    setEntries(prev => prev.map(e => e.id === entry.id ? { ...e, status: "uploading" } : e));
    try {
      const fd = new FormData(); fd.append("files", entry.file);
      const res = await fetch(`/api/admin/productos/${entry.assignedProductId}/images`, { method: "POST", body: fd });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setEntries(prev => prev.map(e => e.id === entry.id ? { ...e, status: "done", url: data.images?.[data.images.length-1] ?? "" } : e));
    } catch { setEntries(prev => prev.map(e => e.id === entry.id ? { ...e, status: "error" } : e)); }
  };

  const uploadPending = async () => {
    const toUpload = entries.filter(e => e.status === "pending" && e.assignedProductId);
    setUploadingAll(true);
    for (let i = 0; i < toUpload.length; i += 3) await Promise.all(toUpload.slice(i, i+3).map(uploadEntry));
    setUploadingAll(false);
  };

  const pending = entries.filter(e => e.status === "pending").length;
  const uploading = entries.filter(e => e.status === "uploading").length;
  const done = entries.filter(e => e.status === "done").length;
  const errored = entries.filter(e => e.status === "error").length;
  const ready = entries.filter(e => e.status === "pending" && e.assignedProductId).length;

  // Bulk handlers
  const handleBulkFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setBulkMode(file.name.endsWith(".csv") ? "csv" : "json");
    new FileReader().addEventListener("load", ev => setBulkText(ev.target?.result as string ?? ""));
    const reader = new FileReader(); reader.onload = ev => setBulkText(ev.target?.result as string ?? ""); reader.readAsText(file);
    e.target.value = "";
  };

  // Parse + preview en una sola función para evitar el problema de state asíncrono
  const handleBulkParseAndPreview = async () => {
    setBulkParseError(""); setBulkEntries(null); setBulkPreview(null); setBulkResult(null);
    let parsed: BulkEntry[];
    try {
      parsed = bulkMode === "json" ? parseJSON(bulkText) : parseCSV(bulkText);
      if (!parsed.length) { setBulkParseError("No se encontraron entradas válidas."); return; }
    } catch (e: any) { setBulkParseError(e.message || "Error al parsear"); return; }

    const entries = parsed.map(e => ({ ...e, replace: bulkReplace }));
    setBulkEntries(entries);
    setBulkLoading(true);
    try {
      const res = await fetch("/api/admin/bulk-images?preview=true", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entries),
      });
      setBulkPreview(await res.json());
      setBulkStep("preview");
    } catch { setBulkParseError("Error conectando con el servidor."); }
    finally { setBulkLoading(false); }
  };


  const handleBulkApply = async () => {
    if (!bulkEntries) return; setBulkLoading(true);
    try { const res = await fetch("/api/admin/bulk-images", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(bulkEntries) }); setBulkResult(await res.json()); setBulkStep("done"); }
    finally { setBulkLoading(false); }
  };

  const resetBulk = () => { setBulkText(""); setBulkEntries(null); setBulkPreview(null); setBulkResult(null); setBulkParseError(""); setBulkStep("input"); };

  return (
    <div className="min-h-screen bg-[#f7f7f5] text-black" style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
      {/* Header */}
      <div className="border-b border-black/10 bg-white px-8 py-5 flex items-center justify-between sticky top-[70px] z-10">
        <div className="flex items-center gap-4">
          <button onClick={() => router.push("/admin")} className="text-xs text-black/40 hover:text-black transition-colors">← Admin</button>
          <div className="w-px h-4 bg-black/20" />
          <h1 className="text-lg font-black tracking-tight">Galería de fotos</h1>
        </div>
        <div className="flex items-center gap-1 bg-black/5 rounded-xl p-1">
          <button onClick={() => setTab("upload")} className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${tab==="upload" ? "bg-white shadow-sm text-black" : "text-black/40 hover:text-black"}`}>🖼️ Subir fotos</button>
          <button onClick={() => setTab("bulk")} className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${tab==="bulk" ? "bg-white shadow-sm text-black" : "text-black/40 hover:text-black"}`}>⚡ Insert masivo</button>
        </div>
        <div className="flex items-center gap-3" style={{minWidth: 160}}>
          {tab==="upload" && done > 0 && <button onClick={() => setEntries(p => p.filter(e => e.status !== "done"))} className="text-xs text-black/40 hover:text-black transition-colors">Limpiar ({done})</button>}
          {tab==="upload" && ready > 0 && <button onClick={uploadPending} disabled={uploadingAll} className="bg-black text-white text-xs font-bold tracking-widest uppercase px-4 py-2.5 hover:bg-black/80 rounded-lg disabled:opacity-50">{uploadingAll ? "Subiendo..." : `↑ Subir ${ready}`}</button>}
          {tab==="bulk" && bulkStep !== "input" && <button onClick={resetBulk} className="text-xs font-bold px-4 py-2 border border-black/20 rounded-lg hover:border-black transition-colors">Nuevo insert</button>}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8">

        {/* TAB UPLOAD */}
        {tab === "upload" && (
          <div>
            <div className="mb-6 grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4">
              <label onDragOver={e => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)} onDrop={handleDrop}
                className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl py-12 cursor-pointer transition-all bg-white ${dragOver ? "border-black bg-black/5" : "border-black/20 hover:border-black/40"}`}>
                <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={handleFilePick} className="hidden" />
                <p className="text-3xl mb-3">🖼️</p>
                <p className="text-sm font-bold text-black/60">Arrastra fotos aquí o haz clic</p>
                <p className="text-xs text-black/30 mt-1">JPG, PNG, WEBP — varias a la vez</p>
              </label>
              <div className="bg-white border border-black/10 rounded-2xl p-5 flex flex-col gap-4">
                <div>
                  <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-black/40 mb-2">Producto por defecto</p>
                  <select value={defaultProduct} onChange={e => setDefaultProduct(e.target.value ? Number(e.target.value) : "")} className="w-full border border-black/20 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-black">
                    <option value="">Sin asignación</option>
                    {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
                {entries.length > 0 && <>
                  <div>
                    <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-black/40 mb-2">Asignar todas a</p>
                    <select onChange={e => { if (e.target.value) setEntries(prev => prev.map(en => ({ ...en, assignedProductId: Number(e.target.value) }))); }} defaultValue="" className="w-full border border-black/20 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-black">
                      <option value="">Seleccionar...</option>
                      {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-black/5">
                    <div className="text-center"><p className="text-xs text-black/40">Pendientes</p><p className="text-xl font-black">{pending}</p></div>
                    <div className="text-center"><p className="text-xs text-black/40">Subidas</p><p className="text-xl font-black text-green-600">{done}</p></div>
                    {uploading > 0 && <p className="col-span-2 text-center text-xs text-blue-600 font-bold animate-pulse">⬆ Subiendo {uploading}...</p>}
                    {errored > 0 && <p className="col-span-2 text-center text-xs text-red-500 font-bold">{errored} error{errored !== 1 ? "es" : ""}</p>}
                  </div>
                </>}
              </div>
            </div>
            {entries.length === 0 ? (
              <div className="bg-white rounded-2xl border border-black/10 p-16 text-center"><p className="text-4xl mb-3">📂</p><p className="text-black/40 text-sm">Arrastra fotos o haz clic para empezar</p></div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {entries.map(entry => (
                  <div key={entry.id} className="group relative bg-white rounded-xl overflow-hidden border border-black/10 hover:shadow-md transition-all">
                    <div className="aspect-square relative bg-[#f2f2f2]">
                      <img src={entry.preview} alt={entry.file.name} className="w-full h-full object-cover" />
                      {entry.status === "uploading" && <div className="absolute inset-0 bg-black/40 flex items-center justify-center"><div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" /></div>}
                      {entry.status === "done" && <div className="absolute inset-0 bg-green-500/30 flex items-center justify-center"><span className="text-white text-2xl">✓</span></div>}
                      {entry.status === "error" && <div className="absolute inset-0 bg-red-500/30 flex items-center justify-center"><span className="text-white text-2xl">✕</span></div>}
                      {entry.status !== "uploading" && <button onClick={() => removeEntry(entry.id)} className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-500 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center font-bold hover:bg-red-600">×</button>}
                    </div>
                    <div className="p-2">
                      <p className="text-[10px] text-black/40 truncate mb-1.5">{entry.file.name}</p>
                      {entry.status === "pending" && <>
                        <select value={entry.assignedProductId ?? ""} onChange={e => setAssignment(entry.id, e.target.value ? Number(e.target.value) : undefined)} className="w-full border border-black/20 rounded-lg px-2 py-1.5 text-[10px] focus:outline-none focus:border-black">
                          <option value="">Sin producto</option>
                          {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                        {entry.assignedProductId && <button onClick={() => uploadEntry(entry)} className="mt-1.5 w-full bg-black text-white text-[9px] font-bold py-1.5 rounded-lg hover:bg-black/80">Subir</button>}
                      </>}
                      {entry.status === "done" && <p className="text-[10px] text-green-600 font-bold text-center">✓ Subida</p>}
                      {entry.status === "error" && <button onClick={() => uploadEntry(entry)} className="w-full text-[9px] font-bold text-red-500 py-1 hover:underline">Reintentar</button>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB BULK */}
        {tab === "bulk" && (
          <div className="flex flex-col gap-6">
            {bulkStep === "input" && (
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-6">
                <div className="bg-white border border-black/10 rounded-2xl p-6 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-black/40">Pega tu JSON o CSV</h2>
                    <div className="flex gap-2">
                      {(["json","csv"] as const).map(f => (
                        <button key={f} onClick={() => { setBulkMode(f); setBulkText(""); }} className={`px-3 py-1 text-[10px] font-bold rounded-lg border uppercase tracking-widest transition-all ${bulkMode===f ? "bg-black text-white border-black" : "border-black/20 text-black/40 hover:border-black hover:text-black"}`}>{f}</button>
                      ))}
                    </div>
                  </div>
                  <textarea value={bulkText} onChange={e => setBulkText(e.target.value)} placeholder={bulkMode==="json" ? '[{"productId": 1, "urls": ["https://..."], "replace": false}]' : "productId,url\n1,https://...\n2,https://..."} rows={12} className="w-full border border-black/20 rounded-xl px-4 py-3 text-xs font-mono focus:outline-none focus:border-black resize-none" />
                  <div className="flex items-center gap-3 flex-wrap">
                    <button onClick={() => bulkFileRef.current?.click()} className="text-xs font-bold px-4 py-2.5 border border-black/20 rounded-lg hover:border-black transition-colors">📂 Subir archivo</button>
                    <input ref={bulkFileRef} type="file" accept=".json,.csv" onChange={handleBulkFile} className="hidden" />
                    <button onClick={() => setBulkText(bulkMode==="json" ? EX_JSON : EX_CSV)} className="text-xs text-black/40 hover:text-black underline transition-colors">Ver ejemplo</button>
                    {bulkText && <button onClick={() => setBulkText("")} className="text-xs text-black/30 hover:text-black transition-colors">Limpiar</button>}
                  </div>
                  {bulkParseError && <p className="text-xs text-red-500 font-semibold">{bulkParseError}</p>}
                  <button onClick={handleBulkParseAndPreview} disabled={!bulkText.trim() || bulkLoading} className="w-full bg-black text-white text-xs font-bold tracking-widest uppercase py-3.5 rounded-xl hover:bg-black/80 transition-colors disabled:opacity-30">{bulkLoading ? "Analizando..." : "Analizar y previsualizar"}</button>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="bg-white border border-black/10 rounded-2xl p-5">
                    <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-black/40 mb-3">Modo</p>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <div onClick={() => setBulkReplace(!bulkReplace)} className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${bulkReplace ? "bg-red-500" : "bg-black/20"}`}>
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${bulkReplace ? "left-6" : "left-1"}`} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{bulkReplace ? "Reemplazar" : "Añadir"}</p>
                        <p className="text-[10px] text-black/40">{bulkReplace ? "Borra las fotos actuales" : "Suma a las existentes"}</p>
                      </div>
                    </label>
                  </div>
                  <div className="bg-white border border-black/10 rounded-2xl p-5">
                    <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-black/40 mb-3">IDs de productos</p>
                    <div className="flex flex-col gap-1.5 max-h-72 overflow-y-auto">
                      {products.map(p => (
                        <div key={p.id} className="flex items-center gap-2 bg-[#f7f7f5] rounded-lg px-3 py-1.5">
                          <span className="font-mono font-bold text-xs text-black/50 shrink-0">#{p.id}</span>
                          <span className="text-xs text-black/60 truncate">{p.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {bulkStep === "preview" && bulkPreview && (
              <div className="bg-white border border-black/10 rounded-2xl p-6">
                <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-black/40 mb-5">Preview — qué se va a insertar</h2>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-[#f7f7f5] rounded-xl p-4 text-center"><p className="text-[10px] font-bold tracking-widest uppercase text-black/40 mb-1">URLs</p><p className="text-3xl font-black">{bulkPreview.totalUrls}</p></div>
                  <div className="bg-[#f7f7f5] rounded-xl p-4 text-center"><p className="text-[10px] font-bold tracking-widest uppercase text-black/40 mb-1">Productos</p><p className="text-3xl font-black">{bulkPreview.detail.length}</p></div>
                  <div className={`rounded-xl p-4 text-center ${bulkPreview.productsNotFound > 0 ? "bg-red-50" : "bg-green-50"}`}>
                    <p className="text-[10px] font-bold tracking-widest uppercase text-black/40 mb-1">No encontrados</p>
                    <p className={`text-3xl font-black ${bulkPreview.productsNotFound > 0 ? "text-red-500" : "text-green-600"}`}>{bulkPreview.productsNotFound}</p>
                  </div>
                </div>
                <div className="rounded-xl border border-black/10 overflow-hidden mb-6">
                  <table className="w-full text-sm">
                    <thead><tr className="bg-black/[0.02] border-b border-black/10">{["ID","Producto","Fotos actuales","A insertar","Estado"].map(h => <th key={h} className="text-left px-4 py-3 text-[10px] font-bold tracking-[0.2em] uppercase text-black/40">{h}</th>)}</tr></thead>
                    <tbody>
                      {bulkPreview.detail.map(row => (
                        <tr key={row.productId} className="border-b border-black/5">
                          <td className="px-4 py-3 font-mono text-xs text-black/40">#{row.productId}</td>
                          <td className="px-4 py-3 font-semibold">{row.productName}</td>
                          <td className="px-4 py-3 text-black/50 text-xs">{row.found ? row.currentImages : "—"}</td>
                          <td className="px-4 py-3 font-bold">{row.urlCount}</td>
                          <td className="px-4 py-3">{row.found ? <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200">✓ Listo</span> : <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-500 border border-red-200">No encontrado</span>}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setBulkStep("input")} className="flex-1 py-3 text-xs font-bold border border-black/20 rounded-xl hover:border-black transition-colors">← Volver</button>
                  <button onClick={handleBulkApply} disabled={bulkLoading || bulkPreview.totalUrls === 0} className="flex-1 bg-black text-white text-xs font-bold tracking-widest uppercase py-3 rounded-xl hover:bg-black/80 disabled:opacity-40">{bulkLoading ? "Insertando..." : `✓ Aplicar ${bulkPreview.totalUrls} imágenes`}</button>
                </div>
              </div>
            )}

            {bulkStep === "done" && bulkResult && (
              <div className="bg-white border border-black/10 rounded-2xl p-8 text-center">
                <p className="text-5xl mb-4">{bulkResult.ok ? "✅" : "⚠️"}</p>
                <h2 className="text-2xl font-black mb-2">{bulkResult.ok ? "Insert completado" : "Completado con errores"}</h2>
                <p className="text-black/50 text-sm mb-6">{bulkResult.inserted} imagen{bulkResult.inserted !== 1 ? "es" : ""} insertada{bulkResult.inserted !== 1 ? "s" : ""}{bulkResult.skipped > 0 ? ` · ${bulkResult.skipped} omitidas` : ""}</p>
                {bulkResult.errors.length > 0 && <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-6 text-left">{bulkResult.errors.map((e,i) => <p key={i} className="text-xs text-red-500">{e}</p>)}</div>}
                <div className="flex gap-3 justify-center">
                  <button onClick={resetBulk} className="px-6 py-3 text-xs font-bold border border-black/20 rounded-xl hover:border-black transition-colors">Nuevo insert</button>
                  <button onClick={() => router.push("/admin/productos")} className="px-6 py-3 bg-black text-white text-xs font-bold rounded-xl hover:bg-black/80 transition-colors">Ver productos →</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}