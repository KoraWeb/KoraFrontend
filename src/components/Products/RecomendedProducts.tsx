"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/api/types/product";
import ProductCard from "./ProductCard";

type RecomendedProductsProps = {
  products: Product[];
};

export default function RecomendedProducts({ products }: RecomendedProductsProps) {
  if (!products || products.length === 0) return null;

  return (
    <div className="mt-20 border-t border-black/10 pt-10">
      <h2 className="text-3xl font-bold">También te puede interesar</h2>

      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}