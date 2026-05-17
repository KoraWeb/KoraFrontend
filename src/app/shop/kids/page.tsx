"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getProductById } from "@/api/product/route";
import { Product } from "@/api/types/product";
import ProductSlider from "@/components/Products/ProductSlider";
import CategoryShowcase from "@/components/shop/CategoryShowcase";

const kidsCategories = [
    {
        title: "New Arrivals",
        href: "/search?gender=KIDS",
        image: "/collections/kids/kids-new.jpg",
        label: "Comprar",
    },
    {
        title: "Essentials",
        href: "/search?gender=KIDS&category=essentials",
        image: "/collections/kids/kids-essentials.jpg",
        label: "Comprar",
    },
    {
        title: "Sneakers",
        href: "/search?gender=KIDS&category=sneakers",
        image: "/collections/kids/kids-sneakers.jpg",
        label: "Comprar",
    },
];

const firstSliderIds = [4, 8, 12, 16, 20, 28, 32, 36];
const secondSliderIds = [12, 28, 32, 36, 40];

async function getProductsByIds(ids: number[]) {
    const results = await Promise.allSettled(
        ids.map((id) => getProductById(id)),
    );

    return results
        .filter((result): result is PromiseFulfilledResult<Product> => {
            return result.status === "fulfilled";
        })
        .map((result) => result.value);
}

export default function KidsPage() {
    const [kidsProducts, setKidsProducts] = useState<Product[]>([]);
    const [sneakerProducts, setSneakerProducts] = useState<Product[]>([]);

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const [kidsData, sneakerData] = await Promise.all([
                    getProductsByIds(firstSliderIds),
                    getProductsByIds(secondSliderIds),
                ]);

                setKidsProducts(kidsData);
                setSneakerProducts(sneakerData);
            } catch (error) {
                console.error("Error cargando productos de kids", error);
            }
        };

        loadProducts();
    }, []);

    return (
        <main className="mb-10 bg-white text-black">
            <section className="px-5 pb-16 pt-12 text-center sm:pt-16">
                <p className="mb-4 text-sm font-medium uppercase tracking-[0.35em] text-neutral-500">
                    Kōra Kids
                </p>

                <h1 className="text-5xl font-black uppercase leading-[0.9] tracking-tight sm:text-6xl lg:text-7xl">
                    Kids
                </h1>

                <p className="mx-auto mt-5 max-w-xl text-sm text-neutral-600 sm:text-base">
                    Prendas cómodas, resistentes y fáciles de combinar para acompañar el
                    ritmo diario de los más pequeños.
                </p>
            </section>

            <section className="relative h-[70vh] min-h-[520px] w-full overflow-hidden bg-neutral-100">
                <Image
                    src="/collections/kids/kids-hero.jpg"
                    alt="Colección kids Kōra"
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover"
                />

                <div className="absolute inset-0 bg-black/25" />

                <div className="absolute bottom-10 left-6 max-w-2xl text-white md:bottom-16 md:left-16">
                    <p className="mb-4 text-sm font-medium uppercase tracking-[0.35em] text-white/70">
                        New season
                    </p>

                    <h2 className="text-4xl font-black uppercase leading-[0.9] tracking-tight sm:text-5xl lg:text-7xl">
                        Diseñado para jugar
                    </h2>

                    <p className="mt-5 max-w-md text-sm text-white/80 sm:text-base">
                        Ropa práctica, sneakers cómodas y básicos pensados para moverse con
                        libertad durante todo el día.
                    </p>
                </div>
            </section>

            <CategoryShowcase
                title="Explora kids"
                viewAllHref="/search?gender=KIDS"
                cards={kidsCategories}
            />

            <section className="mt-10">
                <div className="mb-4 px-5 sm:px-8 lg:px-12">
                    <h2 className="mt-3 text-3xl font-black uppercase tracking-tight sm:text-4xl lg:text-5xl">
                        Lo último para kids
                    </h2>
                </div>

                <ProductSlider products={kidsProducts} />
            </section>

            <section className="relative mt-12 h-[34vw] min-h-[180px] w-full overflow-hidden bg-neutral-100 md:mt-20">
                <Image
                    src="/collections/kids/kids-banner.jpg"
                    alt="Banner colección kids Kōra"
                    fill
                    sizes="100vw"
                    className="object-cover"
                />
            </section>

            <section className="mt-14">
                <div className="mb-4 px-5 sm:px-8 lg:px-12">
                    <h2 className="mt-3 text-3xl font-black uppercase tracking-tight sm:text-4xl lg:text-5xl">
                        Pequeños esenciales
                    </h2>
                </div>

                <ProductSlider products={sneakerProducts} />
            </section>
        </main>
    );
}