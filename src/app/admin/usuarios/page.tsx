"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type UserEntry = {
  id: number;
  name: string;
  username: string;
  email: string;
  role: string;
  address: string | null;
  photoUrl: string | null;
};

export default function AdminUsuariosPage() {
  const router = useRouter();
  const [users, setUsers] = useState<UserEntry[]>([]);
  const [fetching, setFetching] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/admin/usuarios")
      .then((r) => r.json())
      .then((data) => setUsers(Array.isArray(data) ? data : []))
      .finally(() => setFetching(false));
  }, []);

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    return (
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.username?.toLowerCase().includes(q)
    );
  });

  const stats = {
    total: users.length,
    admins: users.filter((u) => u.role === "ADMIN").length,
    withAddress: users.filter((u) => u.address && u.address.length > 2).length,
  };

  if (fetching)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );

  return (
    <div className="min-h-screen bg-white text-black" style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
      <div className="border-b border-black/10 bg-white px-8 py-5 flex items-center gap-4 sticky top-[70px] z-10">
        <button onClick={() => router.push("/admin")} className="text-xs text-black/40 hover:text-black transition-colors">
          ← Admin
        </button>
        <div className="w-px h-4 bg-black/20" />
        <h1 className="text-lg font-black tracking-tight">Usuarios</h1>
        <span className="text-xs bg-black text-white px-2 py-0.5 rounded-full font-bold">{users.length}</span>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8">
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Total usuarios", value: stats.total },
            { label: "Administradores", value: stats.admins },
            { label: "Con dirección guardada", value: stats.withAddress },
          ].map((s) => (
            <div key={s.label} className="bg-white border border-black/10 rounded-2xl p-6">
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-black/40 mb-2">{s.label}</p>
              <p className="text-4xl font-black">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="mb-6">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre, email o usuario..."
            className="w-full max-w-sm border border-black/20 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-black transition-colors"
          />
        </div>

        <div className="bg-white rounded-2xl border border-black/10 overflow-hidden">
          {filtered.length === 0 ? (
            <div className="p-16 text-center">
              <p className="text-black/40 text-sm">No hay usuarios{search ? " que coincidan" : ""}.</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-black/10 bg-black/[0.02]">
                  {["ID", "Nombre", "Usuario", "Email", "Rol", "Dirección"].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-[10px] font-bold tracking-[0.2em] uppercase text-black/40">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={u.id} className="border-b border-black/5 hover:bg-black/[0.01] transition-colors">
                    <td className="px-5 py-3 text-black/30 font-mono text-xs">#{u.id}</td>
                    <td className="px-5 py-3 font-semibold">{u.name || "—"}</td>
                    <td className="px-5 py-3 text-black/50">@{u.username || "—"}</td>
                    <td className="px-5 py-3 text-black/70">{u.email}</td>
                    <td className="px-5 py-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wider uppercase ${
                        u.role === "ADMIN" ? "bg-black text-white" : "bg-black/5 text-black/50"
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      {u.address && u.address.length > 2 ? (
                        <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-bold">Sí</span>
                      ) : (
                        <span className="text-xs text-black/20">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
