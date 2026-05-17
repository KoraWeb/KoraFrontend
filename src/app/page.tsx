"use client";

import { getProductById } from "@/api/product/route";
import { Product } from "@/api/types/product";
import HomeSlider from "@/components/shop/HomeSlider";
import ProductSlider from "@/components/Products/ProductSlider";
import Image from "next/image";
import { useEffect, useState } from "react";
import CategoryShowcase from "@/components/shop/CategoryShowcase";

export default function Home() {
  const homeCategories = [
    {
      title: "Men",
      href: "/shop/men",
      image: "/home/categories/men.jpg",
      label: "Ver colección",
    },
    {
      title: "Women",
      href: "/shop/women",
      image: "/home/categories/women.jpg",
      label: "Ver colección",
    },
    {
      title: "Kids",
      href: "/shop/kids",
      image: "/home/categories/kids.jpg",
      label: "Ver colección",
    }
  ];
  const [productsFirstSlider, setProductsFirstSlider] = useState<Product[]>([]);
  const [productsSecondSlider, setProductsSecondSlider] = useState<Product[]>([]);

  //cargamos los productos al cargar la pagina, los 8 primeros al primer slider y los otros 8 al segundo
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const selectedProductIds = [1, 3, 20, 4, 12, 21, 7, 11, 10, 25, 18, 22, 24, 5, 14, 2];
        const productsData = await Promise.all(
          selectedProductIds.map(id => getProductById(id)) // `getProductById(id)` ya devuelve una promesa
        );
        setProductsFirstSlider(productsData.slice(0, 8));
        setProductsSecondSlider(productsData.slice(8, 16));
      } catch (error) {
        
      }
    };

    loadProducts();
  }, []);

  return (
    //Home Page
    <div className="mb-10">
      <h2 className="h-[60px] text-[45px]/[90%] sm:text-[60px]/[90%] text-black text-center mt-[45px] mb-[65px] font-[700]">
        BIENVENID@ A KŌRA
      </h2>
      <HomeSlider />
      <div className="mt-10">
        <h3 className="text-black text-3xl sm:text-4xl lg:text-5xl font-black px-5 sm:px-8 lg:px-12">
          ¡LO ÚLTIMO EN KÖRA!
        </h3>
        <ProductSlider products={productsFirstSlider} />
      </div>
      <div className="relative mt-10 md:mt-20 h-[28vw] aspect-[277/78] w-full overflow-hidden">
        <Image
          src="/home/homeBanner.png"
          alt="Kora Logo"
          width={1777}
          height={488}
          className="w-full"
        />
      </div>
      <h3 className="text-black text-3xl sm:text-4xl mt-8 lg:text-5xl font-black px-5 sm:px-8 lg:px-12">
        DESTACADOS
      </h3>
      <ProductSlider products={productsSecondSlider} />
      <CategoryShowcase title="Explora por categoría" viewAllHref="/search" cards={homeCategories} />
    </div>
  );
}
