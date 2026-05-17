"use client";

import { cloudinaryUrl } from "@/lib/cloudinary";

import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Order } from "@/api/order/route";
import KoraIcon from "@/components/Icons/KoraIcon";
import styles from "@/styles/buttons.module.css";

const STATUS_LABEL: Record<string, string> = {
  PENDING: "Realizado", SHIPPED: "Enviado", IN_TRANSIT: "En camino", DELIVERED: "Entregado",
};
const STATUS_STEPS: Record<string, number> = {
  PENDING: 0, SHIPPED: 1, IN_TRANSIT: 2, DELIVERED: 3,
};
const STATUS_COLOR: Record<string, string> = {
  PENDING: "#f59e0b", SHIPPED: "#3b82f6", IN_TRANSIT: "#8b5cf6", DELIVERED: "#10b981",
};

// Proporción del tiempo consumido según el estado del pedido
const STATUS_ELAPSED: Record<string, number> = {
  PENDING:    0,
  SHIPPED:    0.35,
  IN_TRANSIT: 0.70,
  DELIVERED:  1,
};

function getDeliveryProgress(order: Order) {
  const totalDays = order.deliveryDays ?? 7;
  const elapsedRatio = STATUS_ELAPSED[order.status] ?? 0;
  const elapsedDays = Math.round(elapsedRatio * totalDays);
  const daysLeft = Math.max(0, totalDays - elapsedDays);
  const percent = Math.round(elapsedRatio * 100);
  const isOverdue = false; // Con este sistema nunca hay retraso visible
  return { daysLeft, percent, isOverdue };
}

export default function ProfilePage() {
  const { logout, name, username, email, logged, loading, setName, setUsername, setEmail, photoUrl, setPhotoUrl } = useAuth();
  const router = useRouter();

  const [image, setImage] = useState<string | null>(photoUrl || null);
  const [editing, setEditing] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: name || "", username: username || "", email: email || "", photoUrl: photoUrl || "" });

  useEffect(() => { if (!loading && !logged) router.push("/auth"); }, [loading, logged, router]);
  useEffect(() => { setForm({ name: name || "", username: username || "", email: email || "", photoUrl: photoUrl || "" }); }, [name, username, email, photoUrl]);

  useEffect(() => {
    if (loading || !logged) return;
    setOrdersLoading(true);
    fetch("/api/orders")
      .then(r => r.json())
      .then((data) => {
        if (!Array.isArray(data)) return;
        setOrders(data.filter((o: Order) => o.status !== "DELIVERED"));
      })
      .catch(() => setOrders([]))
      .finally(() => setOrdersLoading(false));
  }, [loading, logged]);

  useEffect(() => {
    if (!logged) return;
    fetch("/api/auth/me")
      .then(r => r.json())
      .then((data) => {
        if (!data.logged) return;
        setImage(data.photoUrl || null);
        setForm(prev => ({ ...prev, username: data.username || "", photoUrl: data.photoUrl || "" }));
      })
      .catch(console.error);
  }, [logged]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);
    fd.append("upload_preset", "Kora-Proyect");
    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/dpllhvudg/image/upload", { method: "POST", body: fd });
      const data = await res.json();
      setImage(data.secure_url);
      setForm(prev => ({ ...prev, photoUrl: data.secure_url }));
    } catch { console.error("Error subiendo imagen"); }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async () => {
    setSaving(true); setSaveError(null);
    try {
      const res = await fetch("/api/users/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, username: form.username, email: form.email, photoURL: form.photoUrl }),
      });
      if (res.status === 409) throw new Error("USERNAME_TAKEN");
      if (!res.ok) throw new Error("Error");
      setName(form.name); setUsername(form.username); setEmail(form.email); setPhotoUrl(form.photoUrl);
      setSaveSuccess(true); setEditing(false);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      setSaveError(err.message === "USERNAME_TAKEN" ? "Ese nombre de usuario ya está en uso" : "Error guardando los datos");
    } finally { setSaving(false); }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f5f5]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-2 border-[#CDB4DB] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-400 tracking-widest uppercase">Cargando</p>
      </div>
    </div>
  );

  if (!logged) return null;

  return (
    <div className="min-h-screen w-full bg-[#f5f5f5] text-black" style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>

      {/* HEADER */}
      <div className="w-full bg-white border-b border-gray-200 px-4 sm:px-8 md:px-16 py-6 sm:py-8 flex items-center gap-4 sm:gap-6">
        <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-28 md:h-28 rounded-full overflow-hidden border-2 border-[#CDB4DB] flex items-center justify-center bg-gray-100 relative shrink-0">
          {image
            ? <img src={image} className="w-full h-full object-cover" alt="avatar" />
            : <span className="text-3xl sm:text-4xl"></span>
          }
          {editing && (
            <label className="absolute inset-0 flex items-center justify-center bg-black/40 text-white text-xs cursor-pointer font-semibold tracking-wider">
              CAMBIAR
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
          )}
        </div>
        <div>
          <p className="text-[10px] sm:text-xs text-gray-400 tracking-widest uppercase mb-1">Mi cuenta</p>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">{form.username || "usuario"}</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">{form.email}</p>
        </div>
      </div>

      {/* CONTENIDO */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-10 py-6 sm:py-10 grid grid-cols-1 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px] gap-8">

        {/* PEDIDOS — columna izquierda */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-sm font-bold tracking-[0.2em] uppercase text-gray-500">Pedidos en curso</h2>
              {orders.length > 0 && <p className="text-xs text-gray-400 mt-1">Se mostrarán hasta que sean entregados</p>}
            </div>
            <button onClick={() => router.push("/pedidos")} className="text-sm font-bold tracking-widest uppercase text-[#CDB4DB] hover:text-[#a66fc6] transition-colors whitespace-nowrap">
              Todos los pedidos →
            </button>
          </div>

          {ordersLoading ? (
            <div className="flex items-center gap-3 py-10">
              <div className="w-5 h-5 border-2 border-[#CDB4DB] border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-gray-400">Cargando pedidos...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-xl p-12 flex flex-col items-center gap-4 text-center">
              <div className="w-20 h-20 opacity-20"><KoraIcon className="w-full h-full" /></div>
              <p className="text-base text-gray-400 tracking-wide">No tienes pedidos en curso</p>
              <p className="text-sm text-gray-300">Los pedidos entregados los encontrarás en "Todos los pedidos"</p>
              <button onClick={() => router.push("/search")} className={`mt-2 px-8 py-3 text-sm font-bold tracking-widest uppercase rounded ${styles.btnBasic}`}>
                Explorar tienda
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {orders.map((order) => {
                const stepIndex = STATUS_STEPS[order.status] ?? 0;
                const firstImage = order.items?.[0]?.productImage;
                const { daysLeft, percent, isOverdue } = getDeliveryProgress(order);
                const statusColor = STATUS_COLOR[order.status] || "#CDB4DB";
                return (
                  <button
                    key={order.id}
                    onClick={() => router.push(`/pedidos/${order.id}`)}
                    className="w-full bg-white border border-gray-200 rounded-2xl p-6 hover:border-[#CDB4DB] hover:shadow-lg transition-all duration-200 text-left flex flex-col gap-5"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 rounded-xl bg-[#f0eaf5] flex items-center justify-center shrink-0 overflow-hidden">
                        {firstImage
                          ? <img src={cloudinaryUrl(firstImage, { width: 200, height: 250 })} alt="Producto" className="w-full h-full object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                          : <div className="w-10 h-10 opacity-20"><KoraIcon className="w-full h-full" /></div>
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-400 tracking-widest uppercase mb-0.5">Pedido</p>
                        <p className="text-2xl font-bold text-black">#{order.id}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(order.date).toLocaleDateString("es-ES", { day: "2-digit", month: "long", year: "numeric" })}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xl font-bold text-black">{order.total.toFixed(2)} €</p>
                        <p className="text-sm font-semibold mt-1" style={{ color: statusColor }}>
                          {STATUS_LABEL[order.status]}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {["Realizado", "Enviado", "En camino", "Entregado"].map((step, i) => (
                        <div key={step} className="flex-1 flex flex-col items-center gap-1">
                          <div className={`h-1.5 w-full rounded-full ${i <= stepIndex ? "bg-[#CDB4DB]" : "bg-gray-100"}`} />
                          <span className={`text-[10px] font-medium ${i <= stepIndex ? "text-[#CDB4DB]" : "text-gray-300"}`}>{step}</span>
                        </div>
                      ))}
                    </div>

                    <div className="bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold tracking-widest uppercase text-gray-400">
                          {isOverdue ? "Pendiente de llegada" : "Entrega estimada"}
                        </span>
                        <span className={`text-xs font-bold ${isOverdue ? "text-amber-500" : "text-gray-500"}`}>
                          {isOverdue ? "Pendiente" : daysLeft === 0 ? "Hoy" : `${daysLeft} día${daysLeft !== 1 ? "s" : ""}`}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${percent}%`,
                            background: isOverdue ? "#f59e0b" : "linear-gradient(90deg, #CDB4DB, #a66fc6)",
                          }}
                        />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* SIDEBAR DERECHA */}
        <div className="flex flex-col gap-5">
          <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-7">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm font-bold tracking-[0.2em] uppercase text-gray-500">Datos personales</h2>
              {saveSuccess && <span className="text-sm text-green-500 font-semibold">Guardado</span>}
            </div>
            <div className="flex flex-col gap-5">
              <div>
                <label className="text-xs font-bold tracking-[0.15em] uppercase text-gray-400 block mb-1.5">Nombre de usuario</label>
                <input name="username" value={form.username} onChange={handleChange} disabled={!editing} placeholder="kora_user123"
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-black bg-[#fafafa] disabled:opacity-60 focus:outline-none focus:border-[#CDB4DB] transition-colors" />
              </div>
              <div>
                <label className="text-xs font-bold tracking-[0.15em] uppercase text-gray-400 block mb-1.5">Nombre real</label>
                <input name="name" value={form.name} onChange={handleChange} disabled={!editing}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-black bg-[#fafafa] disabled:opacity-60 focus:outline-none focus:border-[#CDB4DB] transition-colors" />
              </div>
              <div>
                <label className="text-xs font-bold tracking-[0.15em] uppercase text-gray-400 block mb-1.5">Correo electronico</label>
                <input name="email" value={form.email} onChange={handleChange} disabled={!editing}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-black bg-[#fafafa] disabled:opacity-60 focus:outline-none focus:border-[#CDB4DB] transition-colors" />
              </div>
            </div>
            {saveError && <p className="text-red-500 text-sm mt-3">{saveError}</p>}
            <div className="mt-6 flex flex-col gap-3">
              {!editing ? (
                <button onClick={() => setEditing(true)} className={`w-full py-3 text-sm font-bold tracking-widest uppercase rounded-lg ${styles.btnBasic}`}>
                  Editar datos
                </button>
              ) : (
                <div className="flex gap-3">
                  <button onClick={() => { setEditing(false); setSaveError(null); }} className={`w-full py-3 text-sm font-bold tracking-widest uppercase rounded-lg ${styles.btnExternal}`}>
                    Cancelar
                  </button>
                  <button onClick={handleSave} disabled={saving} className={`w-full py-3 text-sm font-bold tracking-widest uppercase rounded-lg disabled:opacity-50 ${styles.btnBasic}`}>
                    {saving ? "Guardando..." : "Guardar"}
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-7">
            <h2 className="text-sm font-bold tracking-[0.2em] uppercase text-gray-500 mb-5">Seguridad</h2>
            <button onClick={() => router.push("/change-password")} className={`w-full py-3 text-sm font-bold tracking-widest uppercase rounded-lg ${styles.btnExternal}`}>
              Cambiar contrasena →
            </button>
          </div>

          <button onClick={logout} className="w-full py-3.5 border border-red-200 rounded-xl text-sm font-bold tracking-widest uppercase text-red-400 hover:bg-red-50 hover:border-red-300 transition-colors">
            Cerrar sesion
          </button>
        </div>

      </div>
    </div>
  );
}