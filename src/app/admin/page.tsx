"use client";

import Link from "next/link";

const sections = [
  {
    href: "/admin/productos",
    emoji: "📦",
    title: "Productos",
    desc: "Gestionar catálogo, precios, tallas e imágenes con Cloudinary",
    cta: "Ir al catálogo →",
    active: true,
  },
  {
    href: "/admin/usuarios",
    emoji: "👥",
    title: "Usuarios",
    desc: "Ver usuarios registrados y actividad reciente",
    cta: "Ver usuarios →",
    active: true,
  },
  {
    href: "/admin/pedidos",
    emoji: "🛍️",
    title: "Pedidos",
    desc: "Gestionar pedidos y alertar al usuario por email automáticamente",
    cta: "Ver pedidos →",
    active: true,
  },
  {
    href: "/admin/promociones",
    emoji: "🏷️",
    title: "Promociones",
    desc: "Crear y gestionar códigos de descuento por porcentaje o importe fijo",
    cta: "Gestionar promociones →",
    active: true,
  },
  {
    href: "/admin/reportes",
    emoji: "📬",
    title: "Reportes",
    desc: "Ver y responder mensajes de contacto enviados por los clientes",
    cta: "Ver reportes →",
    active: true,
  },
  {
    href: "/admin/fotos",
    emoji: "📸",
    title: "Galería de fotos",
    desc: "Subir imágenes masivamente a Cloudinary y asignarlas a productos",
    cta: "Gestionar fotos →",
    active: true,
  },
];

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-white text-black" style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
      <div className="border-b border-black/10 bg-white px-8 py-6">
        <p className="text-[10px] tracking-[0.3em] uppercase text-black/40 mb-1">Panel de administración</p>
        <h1 className="text-3xl font-black tracking-tight">KORA Admin</h1>
      </div>
      <div className="max-w-4xl mx-auto px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((s) =>
            s.active ? (
              <Link
                key={s.href}
                href={s.href}
                className="group bg-white border border-black/10 rounded-2xl p-8 hover:border-black transition-all hover:shadow-xl"
              >
                <div className="text-4xl mb-4">{s.emoji}</div>
                <h2 className="text-xl font-bold mb-1">{s.title}</h2>
                <p className="text-sm text-black/50">{s.desc}</p>
                <div className="mt-6 text-xs font-bold tracking-widest uppercase text-black/30 group-hover:text-black transition-colors">
                  {s.cta}
                </div>
              </Link>
            ) : (
              <div key={s.href} className="bg-white border border-black/10 rounded-2xl p-8 opacity-40 cursor-not-allowed">
                <div className="text-4xl mb-4">{s.emoji}</div>
                <h2 className="text-xl font-bold mb-1">{s.title}</h2>
                <p className="text-sm text-black/50">{s.desc}</p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}