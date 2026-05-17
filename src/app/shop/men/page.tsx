"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getProductById } from "@/api/product/route";
import { Product } from "@/api/types/product";
import ProductSlider from "@/components/Products/ProductSlider";
import CategoryShowcase from "@/components/shop/CategoryShowcase";

const menCategories = [
    {
        title: "New Arrivals",
        href: "/search?category=men",
        image: "/collections/men/men-new.jpg",
        label: "Comprar",
    },
    {
        title: "Essentials",
        href: "/search?category=essentials",
        image: "/collections/men/men-essentials.jpg",
        label: "Comprar",
    },
    {
        title: "Sneakers",
        href: "/search?category=sneakers",
        image: "/collections/men/men-sneakers.jpg",
        label: "Comprar",
    },
];

const firstSliderIds = [1, 2, 3, 4, 5, 6, 7, 8];
const secondSliderIds = [23, 24, 25, 26, 27, 28, 29, 30];

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

export default function MenPage() {
    const [menProducts, setMenProducts] = useState<Product[]>([]);
    const [sneakerProducts, setSneakerProducts] = useState<Product[]>([]);

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const [menData, sneakerData] = await Promise.all([
                    getProductsByIds(firstSliderIds),
                    getProductsByIds(secondSliderIds),
                ]);

                setMenProducts(menData);
                setSneakerProducts(sneakerData);
            } catch (error) {
                console.error("Error cargando productos de hombre", error);
            }
        };

        loadProducts();
    }, []);

    return (
        <main className="mb-10 bg-white text-black">
            <section className="px-5 pt-12 pb-16 text-center sm:pt-16">
                <p className="mb-4 text-sm font-medium uppercase tracking-[0.35em] text-neutral-500">
                    Kōra Men
                </p>

                <h1 className="text-5xl font-black uppercase leading-[0.9] tracking-tight sm:text-6xl lg:text-7xl">
                    Hombre
                </h1>

                <p className="mx-auto mt-5 max-w-xl text-sm text-neutral-600 sm:text-base">
                    Prendas limpias, sneakers y básicos diseñados para un estilo cómodo,
                    urbano y actual.
                </p>
            </section>

            <section className="relative h-[70vh] min-h-[520px] w-full overflow-hidden bg-neutral-100">
                <Image
                    src="/collections/men/men-hero.jpg"
                    alt="Colección de hombre Kōra"
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
                        Diseñado para moverse
                    </h2>

                    <p className="mt-5 max-w-md text-sm text-white/80 sm:text-base">
                        Siluetas versátiles, materiales cómodos y una estética minimalista
                        para el día a día.
                    </p>
                </div>
            </section>

            <CategoryShowcase
                title="Explora hombre"
                viewAllHref="/search?category=men"
                cards={menCategories}
            />

            <section className="mt-10">
                <div className="mb-4 px-5 sm:px-8 lg:px-12">


                    <h2 className="mt-3 text-3xl font-black uppercase tracking-tight sm:text-4xl lg:text-5xl">
                        Lo último para hombre
                    </h2>
                </div>

                <ProductSlider products={menProducts} />
            </section>

            <section className="relative mt-12 h-[34vw] min-h-[180px] w-full overflow-hidden bg-neutral-100 md:mt-20">
                <Image
                    src="/collections/men/men-banner.jpg"
                    alt="Banner colección hombre Kōra"
                    fill
                    sizes="100vw"
                    className="object-cover"
                />
            </section>

            <section className="mt-14">
                <div className="mb-4 px-5 sm:px-8 lg:px-12">

                    <h2 className="mt-3 text-3xl font-black uppercase tracking-tight sm:text-4xl lg:text-5xl">
                        Completa el look
                    </h2>
                </div>

                <ProductSlider products={sneakerProducts} />
            </section>
        </main>
    );
}