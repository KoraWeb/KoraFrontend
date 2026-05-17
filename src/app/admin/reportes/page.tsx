"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type ReportStatus = "PENDING" | "READ" | "REPLIED" | "CLOSED";

type Report = {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: ReportStatus;
  createdAt: string;
  adminReply: string | null;
  repliedAt: string | null;
};

const STATUS_LABELS: Record<ReportStatus, string> = {
  PENDING: "Pendiente",
  READ: "Leído",
  REPLIED: "Respondido",
  CLOSED: "Cerrado",
};

const STATUS_COLORS: Record<ReportStatus, string> = {
  PENDING: "bg-amber-50 text-amber-700 border border-amber-200",
  READ: "bg-blue-50 text-blue-700 border border-blue-200",
  REPLIED: "bg-green-50 text-green-700 border border-green-200",
  CLOSED: "bg-black/5 text-black/40 border border-black/10",
};

function fmtDate(d: string) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function AdminReportesPage() {
  const router = useRouter();
  const [reports, setReports] = useState<Report[]>([]);
  const [fetching, setFetching] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<ReportStatus | "ALL">("ALL");
  const [expanded, setExpanded] = useState<number | null>(null);
  const [replyText, setReplyText] = useState<Record<number, string>>({});
  const [sending, setSending] = useState<number | null>(null);
  const [statusChanging, setStatusChanging] = useState<number | null>(null);

  const load = () => {
    setFetching(true);
    fetch("/api/admin/reportes")
      .then(r => r.json())
      .then(data => setReports(Array.isArray(data) ? data : []))
      .finally(() => setFetching(false));
  };

  useEffect(load, []);

  // Marcar como leído al expandir
  const handleExpand = async (r: Report) => {
    if (expanded === r.id) { setExpanded(null); return; }
    setExpanded(r.id);
    if (r.status === "PENDING") {
      try {
        const res = await fetch(`/api/admin/reportes/${r.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "READ" }),
        });
        if (res.ok) {
          const updated = await res.json();
          setReports(prev => prev.map(x => x.id === r.id ? { ...x, status: updated.status } : x));
        }
      } catch {}
    }
  };

  const handleStatusChange = async (r: Report, status: ReportStatus) => {
    setStatusChanging(r.id);
    try {
      const res = await fetch(`/api/admin/reportes/${r.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        const updated = await res.json();
        setReports(prev => prev.map(x => x.id === r.id ? { ...x, status: updated.status } : x));
      }
    } catch { alert("Error cambiando estado"); }
    finally { setStatusChanging(null); }
  };

  const handleReply = async (r: Report) => {
    const reply = replyText[r.id];
    if (!reply?.trim()) { alert("Escribe una respuesta"); return; }
    setSending(r.id);
    try {
      const res = await fetch(`/api/admin/reportes/${r.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reply }),
      });
      if (!res.ok) throw new Error();
      const updated = await res.json();
      setReports(prev => prev.map(x => x.id === r.id ? updated : x));
      setReplyText(prev => ({ ...prev, [r.id]: "" }));
    } catch { alert("Error enviando respuesta"); }
    finally { setSending(null); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar este reporte?")) return;
    try {
      await fetch(`/api/admin/reportes/${id}`, { method: "DELETE" });
      setReports(prev => prev.filter(r => r.id !== id));
      if (expanded === id) setExpanded(null);
    } catch { alert("Error eliminando"); }
  };

  const filtered = reports.filter(r => {
    const q = search.toLowerCase();
    const matchSearch = r.name?.toLowerCase().includes(q) || r.email?.toLowerCase().includes(q) || r.subject?.toLowerCase().includes(q);
    const matchStatus = filterStatus === "ALL" || r.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const pending = reports.filter(r => r.status === "PENDING").length;

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
          <h1 className="text-lg font-black tracking-tight">Reportes y contacto</h1>
          <span className="text-xs bg-black text-white px-2 py-0.5 rounded-full font-bold">{reports.length}</span>
          {pending > 0 && (
            <span className="text-xs bg-amber-500 text-white px-2 py-0.5 rounded-full font-bold animate-pulse">
              {pending} sin leer
            </span>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 py-8">

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {(["ALL", "PENDING", "REPLIED", "CLOSED"] as const).map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s === "ALL" ? "ALL" : s as ReportStatus)}
              className={`text-left bg-white border rounded-2xl p-5 transition-all hover:shadow-md ${
                filterStatus === s ? "border-black shadow-md" : "border-black/10"
              }`}
            >
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-black/40 mb-1">
                {s === "ALL" ? "Total" : STATUS_LABELS[s as ReportStatus]}
              </p>
              <p className="text-2xl font-black">
                {s === "ALL"
                  ? reports.length
                  : reports.filter(r => r.status === s).length}
              </p>
            </button>
          ))}
        </div>

        {/* Filtros */}
        <div className="flex items-center gap-4 mb-6 flex-wrap">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por nombre, email o asunto..."
            className="w-full max-w-sm border border-black/20 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-black transition-colors"
          />
          <div className="flex gap-2 flex-wrap">
            {(["ALL", "PENDING", "READ", "REPLIED", "CLOSED"] as const).map(s => (
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

        {/* Lista */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-black/10 p-16 text-center">
            <p className="text-4xl mb-3">📬</p>
            <p className="text-black/40 text-sm">No hay reportes{search ? " que coincidan" : ""}.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map(r => {
              const isExpanded = expanded === r.id;
              return (
                <div key={r.id} className="bg-white border border-black/10 rounded-2xl overflow-hidden transition-all hover:shadow-sm">
                  {/* Row */}
                  <div
                    className="px-6 py-4 flex items-center gap-4 cursor-pointer"
                    onClick={() => handleExpand(r)}
                  >
                    {/* Dot */}
                    <div className={`w-2 h-2 rounded-full shrink-0 ${r.status === "PENDING" ? "bg-amber-500" : "bg-transparent"}`} />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className={`text-sm font-bold truncate ${r.status === "PENDING" ? "" : "text-black/70"}`}>
                          {r.subject || "Sin asunto"}
                        </p>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0 ${STATUS_COLORS[r.status]}`}>
                          {STATUS_LABELS[r.status]}
                        </span>
                      </div>
                      <p className="text-xs text-black/40 truncate">
                        {r.name || "Anónimo"} · {r.email}
                      </p>
                    </div>

                    <p className="text-xs text-black/30 shrink-0 hidden sm:block">{fmtDate(r.createdAt)}</p>
                    <span className="text-black/30 text-sm">{isExpanded ? "▲" : "▼"}</span>
                  </div>

                  {/* Expanded */}
                  {isExpanded && (
                    <div className="border-t border-black/5 px-6 py-5 flex flex-col gap-5">

                      {/* Mensaje */}
                      <div>
                        <p className="text-[10px] font-bold tracking-widest uppercase text-black/40 mb-2">Mensaje</p>
                        <div className="bg-[#f7f7f5] rounded-xl px-4 py-3 text-sm text-black/70 leading-relaxed whitespace-pre-wrap">
                          {r.message}
                        </div>
                      </div>

                      {/* Respuesta anterior */}
                      {r.adminReply && (
                        <div>
                          <p className="text-[10px] font-bold tracking-widest uppercase text-black/40 mb-2">
                            Respuesta enviada — {fmtDate(r.repliedAt ?? "")}
                          </p>
                          <div className="bg-green-50 border border-green-100 rounded-xl px-4 py-3 text-sm text-green-800 leading-relaxed whitespace-pre-wrap">
                            {r.adminReply}
                          </div>
                        </div>
                      )}

                      {/* Responder */}
                      <div>
                        <p className="text-[10px] font-bold tracking-widest uppercase text-black/40 mb-2">
                          {r.adminReply ? "Enviar otra respuesta" : "Responder"}
                        </p>
                        <textarea
                          value={replyText[r.id] ?? ""}
                          onChange={e => setReplyText(prev => ({ ...prev, [r.id]: e.target.value }))}
                          placeholder="Escribe tu respuesta... Se enviará por email al cliente."
                          rows={3}
                          className="w-full border border-black/20 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:border-black transition-colors"
                        />
                        <button
                          onClick={() => handleReply(r)}
                          disabled={sending === r.id || !replyText[r.id]?.trim()}
                          className="mt-2 bg-black text-white text-xs font-bold tracking-widest uppercase px-5 py-2.5 rounded-lg hover:bg-black/80 transition-colors disabled:opacity-40"
                        >
                          {sending === r.id ? "Enviando..." : "✉ Enviar respuesta por email"}
                        </button>
                      </div>

                      {/* Acciones */}
                      <div className="flex items-center gap-3 pt-2 border-t border-black/5 flex-wrap">
                        <p className="text-xs text-black/40">Cambiar estado:</p>
                        {(["PENDING", "READ", "REPLIED", "CLOSED"] as ReportStatus[])
                          .filter(s => s !== r.status)
                          .map(s => (
                            <button
                              key={s}
                              onClick={() => handleStatusChange(r, s)}
                              disabled={statusChanging === r.id}
                              className={`text-[10px] font-bold px-2.5 py-1 rounded-full border transition-all ${STATUS_COLORS[s]} hover:opacity-80`}
                            >
                              {STATUS_LABELS[s]}
                            </button>
                          ))}
                        <div className="flex-1" />
                        <button
                          onClick={() => handleDelete(r.id)}
                          className="text-xs font-bold px-3 py-1.5 border border-red-200 text-red-400 rounded-lg hover:bg-red-500 hover:text-white hover:border-red-500 transition-all"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}