"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProductCard from "@/components/Products/ProductCard";
import { getWishlist } from "@/api/wishlist/route";
import { WishlistProduct } from "@/api/types/wishlist";
import { useRouter } from "next/dist/client/components/navigation";
import Cookies from "js-cookie";

//Pagina de wishlist, donde guardar productos 
export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<WishlistProduct[]>([]);
  const router = useRouter();

  useEffect(() => {

    if (!Cookies.get("token")) {
      router.push("/auth");
      return;
    }

    const loadWishlist = async () => {
      try {
        const data = await getWishlist();
        setWishlist(data);
      } catch (error) {
        console.error(error);
        setWishlist([]);
      }
    };

    loadWishlist();
  }, []);



  //Si la wishlist esta vacia se muestra asi
  if (wishlist.length === 0) {
    return (
      <div className="flex min-h-[92vh] w-full flex-col items-center justify-start bg-white px-5 pt-[14vh] text-black sm:px-8">
        <div className="mb-10 flex flex-col items-center space-y-4 text-center md:mb-16">
          <h1 className="text-4xl font-medium tracking-tight sm:text-5xl md:text-7xl">
            Tu lista está vacía
          </h1>

          <p className="max-w-[340px] text-base font-light leading-relaxed text-gray-500 sm:max-w-md sm:text-lg md:max-w-lg md:text-2xl">
            Guarda tus productos favoritos para encontrarlos fácilmente más tarde.
          </p>
        </div>

        <div className="group relative w-full max-w-[320px] sm:max-w-[440px] md:max-w-[560px]">
          <div className="absolute left-0 top-0 z-0 h-full w-full -translate-x-2 -translate-y-2 bg-[#D9C2E6] sm:-translate-x-3 sm:-translate-y-3" />

          <Link
            href="/search"
            className="relative z-10 flex w-full items-center justify-center bg-[#C7A0DD] px-8 py-4 text-white transition-transform active:-translate-x-[2px] active:-translate-y-[2px]"
          >
            <span className="flex items-center gap-3 font-serif text-4xl tracking-wide sm:text-5xl md:gap-4 md:text-6xl">
              BUSCAR
              <span className="text-4xl font-light sm:text-5xl">→</span>
            </span>
          </Link>
        </div>
      </div>
    );
  }

  //Si la wishlist no esta vacia se muestra asi
  return (
    <div className="min-h-screen bg-white px-5 py-8 text-black md:px-8 md:py-10">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-[34px] font-bold leading-none md:text-[48px]">
              Lista de deseados
            </h1>

            <p className="mt-3 max-w-xl text-sm font-medium leading-relaxed text-black/45 md:text-base">
              Tus productos guardados para comprar más tarde.
            </p>
          </div>

        </div>

        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-8 sm:gap-y-14 md:grid-cols-3 md:gap-x-12 md:gap-y-16 xl:grid-cols-4">
          {/* Se muestran todos los productos en la wishlist */}
          {wishlist.map((product) => (
            <ProductCard
              key={product.productId}
              product={{
                id: product.productId,
                name: product.name,
                description: "",
                price: product.price,
                category: product.category,
                images: [product.image],
                sizes: [],
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}