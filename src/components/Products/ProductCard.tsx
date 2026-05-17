"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/api/types/product";
import { useEffect, useState } from "react";
import HeartIcon from "@/components/Icons/HeartIcon";
import { useWishlist } from "@/app/context/WishlistContext";
import Cookies from "js-cookie";
import LoginModal from "../Modals/LoginModal";

export default function ProductCard({ product }: { product: Product }) {
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [open, setOpen] = useState(false);


  const { isInWishlist, toggleWishlist } = useWishlist();
  const liked = isInWishlist(product.id);

  //Funcion para añadir o eliminar de wishlist
  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (loading) return;

    setLoading(true);
    try {
      await toggleWishlist(product.id);
    } catch (error) {
      
    } finally {
      setLoading(false);
    }
  };

  // Verificamos si el usuario está logueado al cargar la pagina
  useEffect(() => {
    setIsLoggedIn(!!Cookies.get("token"));
  }, []);

  return (
    <div>
      <Link href={`/search/${product.id}`} className="group block">
        <div>
          <div className="relative aspect-[3/4] overflow-hidden bg-[#ececec]">
            {/* Si esta logueado se muestra el boton para poderlo añadir a la wishlist */}
            {isLoggedIn ? (
              <button
                onClick={handleWishlist}
                disabled={loading}
                className={`absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full transition hover:scale-110 active:scale-95 disabled:opacity-50
              ${liked ? "bg-white" : "bg-transparent hover:bg-white/80"}`}
              >
                <HeartIcon className={`text-lg transition ${liked ? "fill-[#C7A0DD] text-[#C7A0DD]" : "fill-none text-black"}`} />
              </button>
            ) : (
              <button onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setOpen(true);
              }} className={`absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full transition hover:scale-110 active:scale-95 disabled:opacity-50 "bg-transparent hover:bg-white/80"}`}>
                <HeartIcon className={`text-lg transition ${liked ? "fill-[#C7A0DD] text-[#C7A0DD]" : "fill-none text-black"}`} />
              </button>)}

            <Image
              src={product.images?.[0] || "/placeholder.png"}
              alt={product.name}
              fill
              className="object-contain p-4 transition duration-500 group-hover:scale-[1.04]"
            />
          </div>

          {/* Info del producto */}
          <div className="mt-3">
            <h3 className="line-clamp-2 text-[15px] font-bold leading-tight text-black sm:text-[17px]">
              {product.name}
            </h3>

            <p className="mt-1 text-sm text-black/50">
              {product.category}
            </p>

            <p className="mt-2 text-[16px] font-bold text-black">
              {product.price}€
            </p>
          </div>
        </div>
      </Link >
      <LoginModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
}