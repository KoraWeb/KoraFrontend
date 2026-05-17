import { WishlistProduct } from "@/api/types/wishlist";

export async function getWishlist(): Promise<WishlistProduct[]> {
  const res = await fetch("/api/wishlist", { cache: "no-store" });
  if (!res.ok) return [];
  const text = await res.text();
  return text ? JSON.parse(text) : [];
}

export async function addToWishlist(productId: number): Promise<WishlistProduct> {
  const res = await fetch(`/api/wishlist/${productId}`, { method: "POST" });
  if (res.status === 401) throw new Error("No hay token de usuario");
  const text = await res.text();
  if (!res.ok) throw new Error(`Error añadiendo a wishlist: ${res.status}`);
  return text ? JSON.parse(text) : ({} as WishlistProduct);
}

export async function removeFromWishlist(productId: number): Promise<void> {
  const res = await fetch(`/api/wishlist/${productId}`, { method: "DELETE" });
  if (res.status === 401) throw new Error("No hay token de usuario");
  if (!res.ok) throw new Error("Error eliminando de wishlist");
}