"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { addToWishlist, getWishlist, removeFromWishlist } from "@/api/wishlist/route";
import { useAuth } from "./AuthContext";

type WishlistContextType = {
  wishlistIds: number[];
  isInWishlist: (productId: number) => boolean;
  toggleWishlist: (productId: number) => Promise<void>;
};

const WishlistContext = createContext<WishlistContextType | null>(null);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlistIds, setWishlistIds] = useState<number[]>([]);
  const { logged, loading } = useAuth();

  useEffect(() => {
    if (loading) return; // Espera a que auth esté listo

    if (logged) {
      getWishlist()
        .then((data) => setWishlistIds(data.map((item) => item.productId)))
        .catch(() => {});
    } else {
      setWishlistIds([]); // Limpia al cerrar sesión
    }
  }, [logged, loading]); // Se ejecuta cuando cambia el estado de auth

  const isInWishlist = (productId: number) => wishlistIds.includes(productId);

  const toggleWishlist = async (productId: number) => {
    try {
      if (wishlistIds.includes(productId)) {
        await removeFromWishlist(productId);
        setWishlistIds((prev) => prev.filter((id) => id !== productId));
      } else {
        await addToWishlist(productId);
        setWishlistIds((prev) => [...prev, productId]);
      }
    } catch (err) {
      // Rollback si la API falla
      console.error("Error al actualizar wishlist:", err);
    }
  };

  return (
    <WishlistContext.Provider value={{ wishlistIds, isInWishlist, toggleWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist debe usarse dentro de WishlistProvider");
  return context;
}