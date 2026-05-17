"use client";

import React from "react";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type OrderEntry = {
  id: number;
  date: string;
  total: number;
  status: "PENDING" | "SHIPPED" | "IN_TRANSIT" | "DELIVERED";
  deliveryDays: number;
  userName: string;
  userEmail: string;
  userAddress: string;
};

const STATUS_FLOW: OrderEntry["status"][] = ["PENDING", "SHIPPED", "IN_TRANSIT", "DELIVERED"];

const STATUS_LABELS: Record<OrderEntry["status"], string> = {
  PENDING: "Pendiente",
  SHIPPED: "Enviado",
  IN_TRANSIT: "En tránsito",
  DELIVERED: "Entregado",
};

const STATUS_COLORS: Record<OrderEntry["status"], string> = {
  PENDING: "bg-amber-50 text-amber-700 border border-amber-200",
  SHIPPED: "bg-blue-50 text-blue-700 border border-blue-200",
  IN_TRANSIT: "bg-purple-50 text-purple-700 border border-purple-200",
  DELIVERED: "bg-green-50 text-green-700 border border-green-200",
};

function nextStatus(s: OrderEntry["status"]): OrderEntry["status"] | null {
  const i = STATUS_FLOW.indexOf(s);
  return i < STATUS_FLOW.length - 1 ? STATUS_FLOW[i + 1] : null;
}

function fmtDate(d: string) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" });
}

export default function AdminPedidosPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<OrderEntry[]>([]);
  const [fetching, setFetching] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<OrderEntry["status"] | "ALL">("ALL");
  const [advancing, setAdvancing] = useState<number | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/admin/pedidos")
      .then((r) => r.json())
      .then((data) => setOrders(Array.isArray(data) ? data : []))
      .finally(() => setFetching(false));
  }, []);

  const handleAdvance = async (order: OrderEntry) => {
    const next = nextStatus(order.status);
    if (!next) return;
    setAdvancing(order.id);
    try {
      const res = await fetch(`/api/admin/pedidos/${order.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      if (!res.ok) throw new Error();
      const updated = await res.json();
      setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, status: updated.status } : o)));
    } catch {
      alert("Error actualizando el pedido");
    } finally {
      setAdvancing(null);
    }
  };

  const filtered = orders.filter((o) => {
    const q = search.toLowerCase();
    const matchesSearch =
      o.userName?.toLowerCase().includes(q) ||
      o.userEmail?.toLowerCase().includes(q) ||
      String(o.id).includes(q);
    const matchesStatus = filterStatus === "ALL" || o.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = STATUS_FLOW.reduce(
    (acc, s) => ({ ...acc, [s]: orders.filter((o) => o.status === s).length }),
    {} as Record<string, number>
  );

  if (fetching)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );

  return (
    <div className="min-h-screen bg-white text-black" style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
      {/* Header */}
      <div className="border-b border-black/10 bg-white px-8 py-5 flex items-center gap-4 sticky top-[70px] z-10">
        <button onClick={() => router.push("/admin")} className="text-xs text-black/40 hover:text-black transition-colors">
          ← Admin
        </button>
        <div className="w-px h-4 bg-black/20" />
        <h1 className="text-lg font-black tracking-tight">Pedidos</h1>
        <span className="text-xs bg-black text-white px-2 py-0.5 rounded-full font-bold">{orders.length}</span>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8">
        {/* Stats por estado */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {STATUS_FLOW.map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(filterStatus === s ? "ALL" : s)}
              className={`text-left bg-white border rounded-2xl p-5 transition-all hover:shadow-md ${
                filterStatus === s ? "border-black shadow-md" : "border-black/10"
              }`}
            >
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-black/40 mb-1">
                {STATUS_LABELS[s]}
              </p>
              <p className="text-3xl font-black">{stats[s] ?? 0}</p>
            </button>
          ))}
        </div>

        {/* Filtros */}
        <div className="flex items-center gap-4 mb-6 flex-wrap">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre, email o ID..."
            className="w-full max-w-xs border border-black/20 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-black transition-colors"
          />
          <div className="flex gap-2 flex-wrap">
            {(["ALL", ...STATUS_FLOW] as const).map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all ${
                  filterStatus === s
                    ? "bg-black text-white border-black"
                    : "border-black/20 text-black/50 hover:border-black hover:text-black"
                }`}
              >
                {s === "ALL" ? "Todos" : STATUS_LABELS[s]}
              </button>
            ))}
          </div>
        </div>

        {/* Tabla */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-black/10 p-16 text-center">
            <p className="text-black/40 text-sm">No hay pedidos{search ? " que coincidan" : ""}.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-black/10 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-black/10 bg-black/[0.02]">
                  {["Pedido", "Cliente", "Fecha", "Total", "Estado", "Progreso", "Acción"].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-[10px] font-bold tracking-[0.2em] uppercase text-black/40">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((o) => {
                  const next = nextStatus(o.status);
                  const stepIdx = STATUS_FLOW.indexOf(o.status);
                  const isExpanded = expandedId === o.id;
                  return (
                    <React.Fragment key={o.id}>
                      <tr
                        className="border-b border-black/5 hover:bg-black/[0.01] transition-colors cursor-pointer"
                        onClick={() => setExpandedId(isExpanded ? null : o.id)}
                      >
                        <td className="px-5 py-4 font-mono text-xs text-black/40">#{o.id}</td>
                        <td className="px-5 py-4">
                          <p className="font-semibold">{o.userName || "—"}</p>
                          <p className="text-xs text-black/40">{o.userEmail}</p>
                        </td>
                        <td className="px-5 py-4 text-black/50 text-xs">{fmtDate(o.date)}</td>
                        <td className="px-5 py-4 font-bold">{o.total?.toFixed(2)} €</td>
                        <td className="px-5 py-4">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_COLORS[o.status]}`}>
                            {STATUS_LABELS[o.status]}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          {/* Progress bar */}
                          <div className="flex gap-1">
                            {STATUS_FLOW.map((s, i) => (
                              <div
                                key={s}
                                className={`h-1.5 w-6 rounded-full transition-all ${
                                  i <= stepIdx ? "bg-black" : "bg-black/10"
                                }`}
                              />
                            ))}
                          </div>
                          <p className="text-[10px] text-black/30 mt-1">
                            {stepIdx + 1}/{STATUS_FLOW.length}
                          </p>
                        </td>
                        <td className="px-5 py-4">
                          {next ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAdvance(o);
                              }}
                              disabled={advancing === o.id}
                              className="text-xs font-bold px-3 py-1.5 border border-black rounded-lg hover:bg-black hover:text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
                            >
                              {advancing === o.id ? "..." : `→ ${STATUS_LABELS[next]}`}
                            </button>
                          ) : (
                            <span className="text-xs text-green-600 font-bold">✓ Completado</span>
                          )}
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr key={`${o.id}-detail`} className="bg-black/[0.01] border-b border-black/5">
                          <td colSpan={7} className="px-8 py-5">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                              {/* Timeline de estados */}
                              <div>
                                <p className="text-[10px] font-bold tracking-widest uppercase text-black/40 mb-3">
                                  Progreso del pedido
                                </p>
                                <div className="relative pl-4">
                                  {STATUS_FLOW.map((s, i) => {
                                    const done = i <= stepIdx;
                                    const current = i === stepIdx;
                                    return (
                                      <div key={s} className="flex items-start gap-3 mb-3 relative">
                                        <div
                                          className={`w-3 h-3 rounded-full mt-0.5 shrink-0 border-2 ${
                                            done
                                              ? "bg-black border-black"
                                              : "bg-white border-black/20"
                                          } ${current ? "ring-2 ring-black/20 ring-offset-1" : ""}`}
                                        />
                                        <div>
                                          <p className={`text-xs font-bold ${done ? "text-black" : "text-black/30"}`}>
                                            {STATUS_LABELS[s]}
                                          </p>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>

                              {/* Info cliente */}
                              <div>
                                <p className="text-[10px] font-bold tracking-widest uppercase text-black/40 mb-3">
                                  Cliente
                                </p>
                                <p className="text-sm font-semibold">{o.userName || "—"}</p>
                                <p className="text-xs text-black/50 mt-0.5">{o.userEmail}</p>
                              </div>

                              {/* Dirección */}
                              <div>
                                <p className="text-[10px] font-bold tracking-widest uppercase text-black/40 mb-3">
                                  Dirección de envío
                                </p>
                                <p className="text-xs text-black/70 leading-relaxed">
                                  {o.userAddress || "No especificada"}
                                </p>
                              </div>
                            </div>

                            {/* Avance rápido de estado */}
                            {next && (
                              <div className="mt-5 pt-4 border-t border-black/10 flex items-center gap-3">
                                <p className="text-xs text-black/40">Avanzar a:</p>
                                {STATUS_FLOW.slice(stepIdx + 1).map((s) => (
                                  <button
                                    key={s}
                                    disabled={advancing === o.id}
                                    onClick={async () => {
                                      setAdvancing(o.id);
                                      try {
                                        const res = await fetch(`/api/admin/pedidos/${o.id}/status`, {
                                          method: "PATCH",
                                          headers: { "Content-Type": "application/json" },
                                          body: JSON.stringify({ status: s }),
                                        });
                                        if (!res.ok) throw new Error();
                                        const updated = await res.json();
                                        setOrders((prev) =>
                                          prev.map((ord) => (ord.id === o.id ? { ...ord, status: updated.status } : ord))
                                        );
                                      } catch {
                                        alert("Error actualizando");
                                      } finally {
                                        setAdvancing(null);
                                      }
                                    }}
                                    className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all disabled:opacity-40 ${STATUS_COLORS[s]} hover:opacity-80`}
                                  >
                                    {STATUS_LABELS[s]}
                                  </button>
                                ))}
                              </div>
                            )}
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}