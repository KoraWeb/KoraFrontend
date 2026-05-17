"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { addToWishlist, getWishlist, removeFromWishlist } from "@/api/wishlist/route";

type WishlistContextType = {
  wishlistIds: number[];
  isInWishlist: (productId: number) => boolean;
  toggleWishlist: (productId: number) => Promise<void>;
};

const WishlistContext = createContext<WishlistContextType | null>(null);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlistIds, setWishlistIds] = useState<number[]>([]);

  useEffect(() => {
    getWishlist()
      .then((data) => setWishlistIds(data.map((item) => item.productId)))
      .catch(() => {});
  }, []);

  const isInWishlist = (productId: number) => wishlistIds.includes(productId);

  const toggleWishlist = async (productId: number) => {
    if (wishlistIds.includes(productId)) {
      await removeFromWishlist(productId);
      setWishlistIds((prev) => prev.filter((id) => id !== productId));
    } else {
      await addToWishlist(productId);
      setWishlistIds((prev) => [...prev, productId]);
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
