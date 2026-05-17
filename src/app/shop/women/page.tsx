"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getProductById } from "@/api/product/route";
import { Product } from "@/api/types/product";
import ProductSlider from "@/components/Products/ProductSlider";
import CategoryShowcase from "@/components/shop/CategoryShowcase";

const womenCategories = [
    {
        title: "New Arrivals",
        href: "/search?category=women",
        image: "/collections/women/women-new.jpg",
        label: "Comprar",
    },
    {
        title: "Soft Essentials",
        href: "/search?category=essentials",
        image: "/collections/women/women-essentials.jpg",
        label: "Comprar",
    },
    {
        title: "Sneakers",
        href: "/search?category=sneakers",
        image: "/collections/women/women-sneakers.jpg",
        label: "Comprar",
    },
];

const firstSliderIds = [9, 10, 11, 12, 13, 14, 15, 16];
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

export default function WomenPage() {
    const [womenProducts, setWomenProducts] = useState<Product[]>([]);
    const [sneakerProducts, setSneakerProducts] = useState<Product[]>([]);

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const [womenData, sneakerData] = await Promise.all([
                    getProductsByIds(firstSliderIds),
                    getProductsByIds(secondSliderIds),
                ]);

                setWomenProducts(womenData);
                setSneakerProducts(sneakerData);
            } catch (error) {
                console.error("Error cargando productos de mujer", error);
            }
        };

        loadProducts();
    }, []);

    return (
        <main className="mb-10 bg-white text-black">
            <section className="px-5 pt-12 pb-16 text-center sm:pt-16">
                <p className="mb-4 text-sm font-medium uppercase tracking-[0.35em] text-neutral-500">
                    Kōra Women
                </p>

                <h1 className="text-5xl font-black uppercase leading-[0.9] tracking-tight sm:text-6xl lg:text-7xl">
                    Mujer
                </h1>

                <p className="mx-auto mt-5 max-w-xl text-sm text-neutral-600 sm:text-base">
                    Siluetas suaves, prendas versátiles y básicos elevados para crear
                    looks cómodos con estilo propio.
                </p>
            </section>

            <section className="relative h-[70vh] min-h-[520px] w-full overflow-hidden bg-neutral-100">
                <Image
                    src="/collections/women/women-hero.jpg"
                    alt="Colección de mujer Kōra"
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover"
                />

                <div className="absolute inset-0 bg-black/25" />

                <div className="absolute bottom-10 left-6 max-w-2xl text-white md:bottom-16 md:left-16">
                    <p className="mb-4 text-sm font-medium uppercase tracking-[0.35em] text-white/70">
                        Soft minimalism
                    </p>

                    <h2 className="text-4xl font-black uppercase leading-[0.9] tracking-tight sm:text-5xl lg:text-7xl">
                        Estilo sin esfuerzo
                    </h2>

                    <p className="mt-5 max-w-md text-sm text-white/80 sm:text-base">
                        Prendas ligeras, cómodas y cuidadas para construir un armario
                        limpio, moderno y funcional.
                    </p>
                </div>
            </section>

            <CategoryShowcase
                eyebrow="Collections"
                title="Explora mujer"
                viewAllHref="/search?category=women"
                cards={womenCategories}
            />

            <section className="mt-10">
                <div className="mb-4 px-5 sm:px-8 lg:px-12">
                    <p className="text-sm font-medium uppercase tracking-[0.3em] text-neutral-500">
                        Women essentials
                    </p>

                    <h2 className="mt-3 text-3xl font-black uppercase tracking-tight sm:text-4xl lg:text-5xl">
                        Lo último para mujer
                    </h2>
                </div>

                <ProductSlider products={womenProducts} />
            </section>

            <section className="relative mt-12 h-[34vw] min-h-[180px] w-full overflow-hidden bg-neutral-100 md:mt-20">
                <Image
                    src="/collections/women/women-banner.jpg"
                    alt="Banner colección mujer Kōra"
                    fill
                    sizes="100vw"
                    className="object-cover"
                />
            </section>

            <section className="mt-14">
                <div className="mb-4 px-5 sm:px-8 lg:px-12">
                    <p className="text-sm font-medium uppercase tracking-[0.3em] text-neutral-500">
                        Sneakers selection
                    </p>

                    <h2 className="mt-3 text-3xl font-black uppercase tracking-tight sm:text-4xl lg:text-5xl">
                        Completa el look
                    </h2>
                </div>

                <ProductSlider products={sneakerProducts} />
            </section>
        </main>
    );
}