import Cookies from "js-cookie";
import { BagType, AddBagItemRequest } from "@/api/types/bag";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/bag`;

export function getBagIdFromCookie() {
  return Cookies.get("bagId");
}

export function removeBagIdCookie() {
  Cookies.remove("bagId");
}

export function setBagIdCookie(bagId: string) {
  Cookies.set("bagId", bagId, {
    expires: new Date(Date.now() + 30 * 60 * 1000),
    sameSite: "lax",
  });
}

export async function createGuestBag() {
  const res = await fetch(`${API_URL}/guest`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Error creando bolsa de invitado");
  return res.json();
}

export async function getBag(id: string) {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) throw new Error("Error obteniendo bolsa");
  return res.json();
}

export async function getMyBag() {
  const token = Cookies.get("token");
  if (!token) throw new Error("Usuario no autenticado");

  const res = await fetch(`${API_URL}/me`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Error obteniendo bolsa del usuario");

  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

export async function getOrCreateMyBag() {
  const token = Cookies.get("token");
  if (!token) throw new Error("Usuario no autenticado");

  const res = await fetch(`${API_URL}/me`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Error creando bolsa del usuario");
  return res.json();
}

export async function getCurrentBag() {
  const token = Cookies.get("token");

  if (token) {
    try { return await getMyBag(); } catch { return null; }
  }

  const bagId = getBagIdFromCookie();
  if (!bagId) return null;

  try {
    const bag = await getBag(bagId);
    if (bag.status !== "ACTIVE") { removeBagIdCookie(); return null; }
    return bag;
  } catch {
    removeBagIdCookie();
    return null;
  }
}

export async function getOrCreateBag() {
  const token = Cookies.get("token");
  const bagId = getBagIdFromCookie();

  if (token) return await getOrCreateMyBag();

  if (bagId) {
    try {
      const bag = await getBag(bagId);
      if (bag.status === "ACTIVE") return bag;
      removeBagIdCookie();
    } catch {
      removeBagIdCookie();
    }
  }

  const guestBag = await createGuestBag();
  if (!guestBag.id) throw new Error("Error al crear la bolsa");
  setBagIdCookie(String(guestBag.id));
  return guestBag;
}

export async function addBagItem(item: AddBagItemRequest): Promise<BagType | null> {
  const token = Cookies.get("token");
  const bag = await getOrCreateBag();

  if (!bag?.id) throw new Error("No se ha podido crear u obtener la bolsa");

  const res = await fetch(`${API_URL}/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({
      bagId: bag.id,
      productId: item.productId,
      sizeId: item.sizeId,
      quantity: item.quantity,
    }),
  });

  const text = await res.text();

  if (!res.ok) {
    let errorMsg = "Error añadiendo producto a la bolsa";
    try {
      const parsed = JSON.parse(text);
      errorMsg = parsed.message || parsed.error || text || errorMsg;
    } catch {
      errorMsg = text || errorMsg;
    }
    // Si la bolsa expiró, la limpiamos y reintentamos una vez
    if (errorMsg.includes("expirad") || errorMsg.includes("activa")) {
      removeBagIdCookie();
      const newBag = await getOrCreateBag();
      const retry = await fetch(`${API_URL}/items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          bagId: newBag.id,
          productId: item.productId,
          sizeId: item.sizeId,
          quantity: item.quantity,
        }),
      });
      const retryText = await retry.text();
      if (!retry.ok) throw new Error(retryText || "Error añadiendo producto a la bolsa");
      const retryBag: BagType | null = retryText ? JSON.parse(retryText) : null;
      if (!token && retryBag?.id) setBagIdCookie(String(retryBag.id));
      return retryBag;
    }
    throw new Error(errorMsg);
  }

  const updatedBag: BagType | null = text ? JSON.parse(text) : null;
  if (!token && updatedBag?.id) setBagIdCookie(String(updatedBag.id));
  return updatedBag;
}

export async function deleteBagItem(itemId: number) {
  const token = Cookies.get("token");

  const res = await fetch(`${API_URL}/items/${itemId}`, {
    method: "DELETE",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  const text = await res.text();
  if (!res.ok) throw new Error(text || "Error eliminando producto de la bolsa");

  const updatedBag = text ? JSON.parse(text) : null;
  if (!token && updatedBag?.status === "EXPIRED") removeBagIdCookie();
  return updatedBag;
}

export async function updateBagItemQuantity(itemId: number, quantity: number) {
  const token = Cookies.get("token");

  const res = await fetch(`${API_URL}/items/${itemId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ quantity }),
  });

  const text = await res.text();
  if (!res.ok) throw new Error(text || "Error actualizando cantidad");
  return text ? JSON.parse(text) : null;
}