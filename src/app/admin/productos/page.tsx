"use client";

import { cloudinaryUrl } from "@/lib/cloudinary";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getProducts } from "@/api/product/route";
import { Product } from "@/api/types/product";
import Link from "next/link";

export default function AdminProductosPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [fetching, setFetching] = useState(true);
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState<number | null>(null);

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .finally(() => setFetching(false));
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar este producto? Esta acción no se puede deshacer.")) return;
    setDeleting(id);
    try {
      // Llama a la API Route server-side — el token nunca sale al cliente
      const res = await fetch(`/api/admin/productos?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch {
      alert("Error eliminando producto");
    } finally {
      setDeleting(null);
    }
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  if (fetching) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f7f7f5] text-black" style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>

      <div className="border-b border-black/10 bg-white px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => router.push("/admin")} className="text-xs text-black/40 hover:text-black transition-colors">← Admin</button>
          <div className="w-px h-4 bg-black/20" />
          <h1 className="text-lg font-black tracking-tight">Productos</h1>
          <span className="text-xs bg-black text-white px-2 py-0.5 rounded-full font-bold">{products.length}</span>
        </div>
        <Link
          href="/admin/productos/nuevo"
          className="bg-black text-white text-xs font-bold tracking-widest uppercase px-5 py-2.5 hover:bg-black/80 transition-colors rounded-lg"
        >
          + Nuevo producto
        </Link>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8">
        <div className="mb-6">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por nombre o categoría..."
            className="w-full max-w-sm border border-black/20 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-black transition-colors"
          />
        </div>

        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-black/10 p-16 text-center">
            <p className="text-black/40 text-sm">No hay productos{search ? " que coincidan" : ""}.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-black/10 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-black/10 bg-black/[0.02]">
                  <th className="text-left px-5 py-3 text-[10px] font-bold tracking-[0.2em] uppercase text-black/40">Imagen</th>
                  <th className="text-left px-5 py-3 text-[10px] font-bold tracking-[0.2em] uppercase text-black/40">Nombre</th>
                  <th className="text-left px-5 py-3 text-[10px] font-bold tracking-[0.2em] uppercase text-black/40">Categoría</th>
                  <th className="text-left px-5 py-3 text-[10px] font-bold tracking-[0.2em] uppercase text-black/40">Precio</th>
                  <th className="text-left px-5 py-3 text-[10px] font-bold tracking-[0.2em] uppercase text-black/40">Fotos</th>
                  <th className="text-left px-5 py-3 text-[10px] font-bold tracking-[0.2em] uppercase text-black/40">Tallas</th>
                  <th className="text-right px-5 py-3 text-[10px] font-bold tracking-[0.2em] uppercase text-black/40">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(product => (
                  <tr key={product.id} className="border-b border-black/5 hover:bg-black/[0.01] transition-colors">
                    <td className="px-5 py-3">
                      <div className="w-12 h-12 rounded-lg bg-[#f2f2f2] overflow-hidden flex items-center justify-center">
                        {product.images?.[0]
                          ? <img src={cloudinaryUrl(product.images[0], { width: 200, height: 250 })} alt={product.name} className="w-full h-full object-contain" onError={e => (e.target as HTMLImageElement).style.display = "none"} />
                          : <span className="text-black/20 text-xs">Sin foto</span>
                        }
                      </div>
                    </td>
                    <td className="px-5 py-3 font-semibold">{product.name}</td>
                    <td className="px-5 py-3 text-black/50">{product.category}</td>
                    <td className="px-5 py-3 font-bold">{product.price.toFixed(2)} €</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${product.images?.length ? "bg-green-50 text-green-700" : "bg-red-50 text-red-500"}`}>
                        {product.images?.length ?? 0} foto{(product.images?.length ?? 0) !== 1 ? "s" : ""}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-black/50">{product.sizes?.length ?? 0}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/productos/${product.id}`}
                          className="text-xs font-bold px-3 py-1.5 border border-black/20 rounded-lg hover:border-black hover:bg-black hover:text-white transition-all"
                        >
                          Editar
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id)}
                          disabled={deleting === product.id}
                          className="text-xs font-bold px-3 py-1.5 border border-red-200 text-red-400 rounded-lg hover:bg-red-500 hover:text-white hover:border-red-500 transition-all disabled:opacity-50"
                        >
                          {deleting === product.id ? "..." : "Eliminar"}
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
    </div>
  );
}