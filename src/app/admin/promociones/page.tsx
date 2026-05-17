"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type DiscountType = "PERCENTAGE" | "FIXED";

type Promotion = {
  id: number;
  code: string;
  description: string;
  discountType: DiscountType;
  discountValue: number;
  minOrderAmount: number | null;
  maxUses: number | null;
  currentUses: number;
  startDate: string | null;
  endDate: string | null;
  active: boolean;
  applicableCategory: string | null;
};

const empty = (): Omit<Promotion, "id" | "currentUses"> => ({
  code: "",
  description: "",
  discountType: "PERCENTAGE",
  discountValue: 10,
  minOrderAmount: null,
  maxUses: null,
  startDate: null,
  endDate: null,
  active: true,
  applicableCategory: null,
});

function safeNum(v: number | null | undefined): number | "" {
  if (v === null || v === undefined) return "";
  if (isNaN(v)) return "";
  return v;
}

function fmtDate(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" });
}

export default function AdminPromocionesPage() {
  const router = useRouter();
  const [promos, setPromos] = useState<Promotion[]>([]);
  const [fetching, setFetching] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Promotion | null>(null);
  const [form, setForm] = useState(empty());
  const [saving, setSaving] = useState(false);
  const [toggling, setToggling] = useState<number | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);

  const load = () => {
    setFetching(true);
    fetch("/api/admin/promociones")
      .then(r => r.json())
      .then(data => setPromos(Array.isArray(data) ? data : []))
      .finally(() => setFetching(false));
  };

  useEffect(load, []);

  const openNew = () => {
    setEditing(null);
    setForm(empty());
    setShowForm(true);
  };

  const openEdit = (p: Promotion) => {
    setEditing(p);
    setForm({
      code: p.code,
      description: p.description ?? "",
      discountType: p.discountType,
      discountValue: p.discountValue,
      minOrderAmount: p.minOrderAmount,
      maxUses: p.maxUses,
      startDate: p.startDate,
      endDate: p.endDate,
      active: p.active,
      applicableCategory: p.applicableCategory,
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.code) { alert("El código es obligatorio"); return; }
    setSaving(true);
    try {
      const url  = editing ? `/api/admin/promociones/${editing.id}` : "/api/admin/promociones";
      const meth = editing ? "PUT" : "POST";
      const res  = await fetch(url, {
        method: meth,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const err = await res.json();
        alert(err.error || "Error guardando");
        return;
      }
      setShowForm(false);
      load();
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (p: Promotion) => {
    setToggling(p.id);
    try {
      const res = await fetch(`/api/admin/promociones/${p.id}`, { method: "PATCH" });
      if (!res.ok) throw new Error();
      const updated = await res.json();
      setPromos(prev => prev.map(x => x.id === p.id ? { ...x, active: updated.active } : x));
    } catch {
      alert("Error al cambiar estado");
    } finally {
      setToggling(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar esta promoción?")) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/promociones/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setPromos(prev => prev.filter(p => p.id !== id));
    } catch {
      alert("Error eliminando");
    } finally {
      setDeleting(null);
    }
  };

  const set = (k: string, v: unknown) => setForm(prev => ({ ...prev, [k]: v }));

  const activeCount = promos.filter(p => p.active).length;
  const totalUses   = promos.reduce((sum, p) => sum + (p.currentUses ?? 0), 0);

  if (fetching) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f7f7f5] text-black" style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>

      {/* Header */}
      <div className="border-b border-black/10 bg-white px-8 py-5 flex items-center justify-between sticky top-[70px] z-10">
        <div className="flex items-center gap-4">
          <button onClick={() => router.push("/admin")} className="text-xs text-black/40 hover:text-black transition-colors">← Admin</button>
          <div className="w-px h-4 bg-black/20" />
          <h1 className="text-lg font-black tracking-tight">Promociones</h1>
          <span className="text-xs bg-black text-white px-2 py-0.5 rounded-full font-bold">{promos.length}</span>
        </div>
        <button
          onClick={openNew}
          className="bg-black text-white text-xs font-bold tracking-widest uppercase px-5 py-2.5 hover:bg-black/80 transition-colors rounded-lg"
        >
          + Nueva promoción
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8">

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white border border-black/10 rounded-2xl p-5">
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-black/40 mb-1">Total</p>
            <p className="text-3xl font-black">{promos.length}</p>
          </div>
          <div className="bg-white border border-black/10 rounded-2xl p-5">
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-black/40 mb-1">Activas</p>
            <p className="text-3xl font-black text-green-600">{activeCount}</p>
          </div>
          <div className="bg-white border border-black/10 rounded-2xl p-5">
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-black/40 mb-1">Usos totales</p>
            <p className="text-3xl font-black">{totalUses}</p>
          </div>
        </div>

        {/* Tabla */}
        {promos.length === 0 ? (
          <div className="bg-white rounded-2xl border border-black/10 p-16 text-center">
            <p className="text-4xl mb-3">🏷️</p>
            <p className="text-black/40 text-sm">No hay promociones. Crea una para empezar.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-black/10 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-black/10 bg-black/[0.02]">
                  {["Código", "Descripción", "Descuento", "Usos", "Vigencia", "Estado", "Acciones"].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-[10px] font-bold tracking-[0.2em] uppercase text-black/40">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {promos.map(p => (
                  <tr key={p.id} className="border-b border-black/5 hover:bg-black/[0.01] transition-colors">
                    <td className="px-5 py-4">
                      <span className="font-mono font-bold text-sm bg-black/5 px-2 py-0.5 rounded">{p.code}</span>
                    </td>
                    <td className="px-5 py-4 text-black/60 text-xs max-w-[200px] truncate">{p.description || "—"}</td>
                    <td className="px-5 py-4 font-bold">
                      {p.discountType === "PERCENTAGE"
                        ? <span className="text-purple-700">-{p.discountValue}%</span>
                        : <span className="text-blue-700">-{p.discountValue}€</span>}
                    </td>
                    <td className="px-5 py-4 text-black/50">
                      {p.currentUses ?? 0}{p.maxUses ? `/${p.maxUses}` : ""}
                    </td>
                    <td className="px-5 py-4 text-xs text-black/50">
                      {p.startDate || p.endDate
                        ? `${fmtDate(p.startDate)} — ${fmtDate(p.endDate)}`
                        : <span className="text-green-600 font-semibold">Sin límite</span>}
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => handleToggle(p)}
                        disabled={toggling === p.id}
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full border transition-all ${
                          p.active
                            ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                            : "bg-black/5 text-black/40 border-black/10 hover:bg-black/10"
                        }`}
                      >
                        {toggling === p.id ? "..." : p.active ? "Activa" : "Inactiva"}
                      </button>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEdit(p)}
                          className="text-xs font-bold px-3 py-1.5 border border-black/20 rounded-lg hover:border-black hover:bg-black hover:text-white transition-all"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          disabled={deleting === p.id}
                          className="text-xs font-bold px-3 py-1.5 border border-red-200 text-red-400 rounded-lg hover:bg-red-500 hover:text-white hover:border-red-500 transition-all disabled:opacity-50"
                        >
                          {deleting === p.id ? "..." : "Eliminar"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal formulario */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-5 border-b border-black/10 flex items-center justify-between">
              <h2 className="text-base font-black tracking-tight">
                {editing ? "Editar promoción" : "Nueva promoción"}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-black/30 hover:text-black text-xl font-bold">×</button>
            </div>

            <div className="p-6 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold tracking-widest uppercase text-black/40 block mb-1.5">Código *</label>
                  <input
                    value={form.code}
                    onChange={e => set("code", e.target.value.toUpperCase())}
                    placeholder="VERANO25"
                    className="w-full border border-black/20 rounded-xl px-4 py-3 text-sm font-mono font-bold focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold tracking-widest uppercase text-black/40 block mb-1.5">Tipo</label>
                  <select
                    value={form.discountType}
                    onChange={e => set("discountType", e.target.value)}
                    className="w-full border border-black/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black"
                  >
                    <option value="PERCENTAGE">Porcentaje (%)</option>
                    <option value="FIXED">Fijo (€)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold tracking-widest uppercase text-black/40 block mb-1.5">Descripción</label>
                <input
                  value={form.description}
                  onChange={e => set("description", e.target.value)}
                  placeholder="25% de descuento en toda la tienda"
                  className="w-full border border-black/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold tracking-widest uppercase text-black/40 block mb-1.5">
                    Valor {form.discountType === "PERCENTAGE" ? "(%)" : "(€)"}
                  </label>
                  <input
                    type="number" min={0} step={0.01}
                    value={safeNum(form.discountValue)}
                    onChange={e => set("discountValue", e.target.value === "" ? 0 : parseFloat(e.target.value) || 0)}
                    className="w-full border border-black/20 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold tracking-widest uppercase text-black/40 block mb-1.5">Mínimo pedido (€)</label>
                  <input
                    type="number" min={0} step={0.01}
                    value={safeNum(form.minOrderAmount)}
                    onChange={e => set("minOrderAmount", e.target.value ? parseFloat(e.target.value) : null)}
                    placeholder="Sin mínimo"
                    className="w-full border border-black/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold tracking-widest uppercase text-black/40 block mb-1.5">Máx. usos</label>
                  <input
                    type="number" min={1}
                    value={safeNum(form.maxUses)}
                    onChange={e => set("maxUses", e.target.value ? parseInt(e.target.value) : null)}
                    placeholder="Ilimitado"
                    className="w-full border border-black/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold tracking-widest uppercase text-black/40 block mb-1.5">Categoría</label>
                  <select
                    value={form.applicableCategory ?? ""}
                    onChange={e => set("applicableCategory", e.target.value || null)}
                    className="w-full border border-black/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black"
                  >
                    <option value="">Toda la tienda</option>
                    <option value="men">Hombre</option>
                    <option value="women">Mujer</option>
                    <option value="kids">Kids</option>
                    <option value="sneakers">Sneakers</option>
                    <option value="essentials">Essentials</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold tracking-widest uppercase text-black/40 block mb-1.5">Fecha inicio</label>
                  <input
                    type="datetime-local"
                    value={form.startDate ?? ""}
                    onChange={e => set("startDate", e.target.value || null)}
                    className="w-full border border-black/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold tracking-widest uppercase text-black/40 block mb-1.5">Fecha fin</label>
                  <input
                    type="datetime-local"
                    value={form.endDate ?? ""}
                    onChange={e => set("endDate", e.target.value || null)}
                    className="w-full border border-black/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <div
                  onClick={() => set("active", !form.active)}
                  className={`w-11 h-6 rounded-full transition-colors relative ${form.active ? "bg-green-500" : "bg-black/20"}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${form.active ? "left-6" : "left-1"}`} />
                </div>
                <span className="text-sm font-semibold">{form.active ? "Activa" : "Inactiva"}</span>
              </label>

              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full bg-black text-white text-xs font-bold tracking-widest uppercase py-4 rounded-xl hover:bg-black/80 transition-colors disabled:opacity-50 mt-2"
              >
                {saving ? "Guardando..." : (editing ? "Guardar cambios" : "Crear promoción")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}