"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getProductById } from "@/api/product/route";
import { Product } from "@/api/types/product";
import ProductSlider from "@/components/Products/ProductSlider";
import CategoryShowcase from "@/components/shop/CategoryShowcase";

const sneakerCategories = [
    {
        title: "Running",
        href: "/search?category=sneakers",
        image: "/collections/sneakers/snkrs-running.jpg",
        label: "Comprar",
    },
    {
        title: "Street",
        href: "/search?category=sneakers",
        image: "/collections/sneakers/snkrs-street.jpg",
        label: "Comprar",
    },
    {
        title: "Court",
        href: "/search?category=sneakers",
        image: "/collections/sneakers/snkrs-court.jpg",
        label: "Comprar",
    },
    {
        title: "New Drops",
        href: "/search?category=sneakers",
        image: "/collections/sneakers/snkrs-drops.jpg",
        label: "Ver lanzamientos",
    },
];

const firstSliderIds = [23, 24, 25, 26, 27, 28, 29, 30];
const secondSliderIds = [37, 23, 25, 27, 29, 24, 26, 30];

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

export default function SneakersPage() {
    const [sneakerProducts, setSneakerProducts] = useState<Product[]>([]);
    const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const [sneakersData, selectedData] = await Promise.all([
                    getProductsByIds(firstSliderIds),
                    getProductsByIds(secondSliderIds),
                ]);

                setSneakerProducts(sneakersData);
                setSelectedProducts(selectedData);
            } catch (error) {
                console.error("Error cargando productos SNKRS", error);
            }
        };

        loadProducts();
    }, []);

    return (
        <main className="mb-10 bg-white text-black">
            <section className="px-5 pt-12 pb-16 text-center sm:pt-16">
                <p className="mb-4 text-sm font-medium uppercase tracking-[0.35em] text-neutral-500">
                    Kōra Sneakers
                </p>

                <h1 className="text-5xl font-black uppercase leading-[0.9] tracking-tight sm:text-6xl lg:text-7xl">
                    SNKRS
                </h1>

                <p className="mx-auto mt-5 max-w-xl text-sm text-neutral-600 sm:text-base">
                    Zapatillas seleccionadas para completar cualquier look con comodidad,
                    diseño y actitud urbana.
                </p>
            </section>

            <section className="relative h-[70vh] min-h-[520px] w-full overflow-hidden bg-neutral-100">
                <Image
                    src="/collections/sneakers/snkrs-hero.jpg"
                    alt="Colección SNKRS Kōra"
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover"
                />

                <div className="absolute inset-0 bg-black/25" />

                <div className="absolute bottom-10 left-6 max-w-2xl text-white md:bottom-16 md:left-16">
                    <p className="mb-4 text-sm font-medium uppercase tracking-[0.35em] text-white/70">
                        New drops
                    </p>

                    <h2 className="text-4xl font-black uppercase leading-[0.9] tracking-tight sm:text-5xl lg:text-7xl">
                        Step into the future
                    </h2>

                    <p className="mt-5 max-w-md text-sm text-white/80 sm:text-base">
                        Sneakers limpias, versátiles y pensadas para moverse contigo cada día.
                    </p>
                </div>
            </section>

            <CategoryShowcase
                eyebrow="SNKRS categories"
                title="Explora sneakers"
                viewAllHref="/search?category=sneakers"
                cards={sneakerCategories}
            />

            <section className="mt-10">
                <div className="mb-4 px-5 sm:px-8 lg:px-12">
                    <p className="text-sm font-medium uppercase tracking-[0.3em] text-neutral-500">
                        Sneakers selection
                    </p>

                    <h2 className="mt-3 text-3xl font-black uppercase tracking-tight sm:text-4xl lg:text-5xl">
                        Últimos modelos
                    </h2>
                </div>

                <ProductSlider products={sneakerProducts} />
            </section>

            <section className="relative mt-12 h-[34vw] min-h-[180px] w-full overflow-hidden bg-neutral-100 md:mt-20">
                <Image
                    src="/collections/sneakers/snkrs-banner.jpg"
                    alt="Banner colección SNKRS Kōra"
                    fill
                    sizes="100vw"
                    className="object-cover"
                />
            </section>

            <section className="mt-14">
                <div className="mb-4 px-5 sm:px-8 lg:px-12">
                    <p className="text-sm font-medium uppercase tracking-[0.3em] text-neutral-500">
                        Selected drops
                    </p>

                    <h2 className="mt-3 text-3xl font-black uppercase tracking-tight sm:text-4xl lg:text-5xl">
                        Diseñadas para destacar
                    </h2>
                </div>

                <ProductSlider products={selectedProducts} />
            </section>
        </main>
    );
}