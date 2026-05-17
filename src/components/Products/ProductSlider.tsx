"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/api/types/product";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import ProductCard from "./ProductCard";

export default function ProductSlider({ products }: { products: Product[] }) {
  //En caso de que no haya productos, no cargamos el slider
  if (!products || products.length === 0) {
    return null;
  }

  return (
    //Slider de productos, el ver más lleva al buscador
    <div className="w-full bg-white text-black">
      <div className="mb-6 flex items-center justify-end px-5 sm:px-8 lg:px-12">
        <Link href="/search" className="border-b border-gray-300 text-sm font-medium text-gray-500 hover:border-black hover:text-black">
          Ver más
        </Link>
      </div>

      <div className="px-5 sm:px-8 lg:px-12">
        <Swiper
          modules={[Navigation]}
          navigation
          spaceBetween={16}
          slidesPerView={1.2}
          breakpoints={{
            640: {
              slidesPerView: 2.2,
              spaceBetween: 18,
            },
            768: {
              slidesPerView: 3.2,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 4,
              spaceBetween: 24,
            },
          }}
        >
          {products.map((product) => (
            <SwiperSlide key={product.id}>
              <ProductCard product={product} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}