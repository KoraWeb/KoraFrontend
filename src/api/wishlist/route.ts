import Cookies from "js-cookie";
import { WishlistProduct } from "@/api/types/wishlist";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/wishlist`;

function getAuthHeaders() {
  const token = Cookies.get("token");
  if (!token) throw new Error("No hay token de usuario");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function getWishlist(): Promise<WishlistProduct[]> {
  const token = Cookies.get("token");
  if (!token) return [];

  const res = await fetch(API_URL, {
    method: "GET",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error(`Error obteniendo wishlist: ${res.status}`);
  const text = await res.text();
  return text ? JSON.parse(text) : [];
}

export async function addToWishlist(productId: number): Promise<WishlistProduct> {
  const res = await fetch(`${API_URL}/${productId}`, {
    method: "POST",
    headers: getAuthHeaders(),
  });

  const text = await res.text();
  if (!res.ok) throw new Error(`Error añadiendo a wishlist: ${res.status}`);
  return text ? JSON.parse(text) : ({} as WishlistProduct);
}

export async function removeFromWishlist(productId: number): Promise<void> {
  const res = await fetch(`${API_URL}/${productId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Error eliminando de wishlist");
}
