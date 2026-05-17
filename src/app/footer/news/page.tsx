"use client";

import KoraIcon from "@/components/Icons/KoraIcon";

export default function NewsPage() {
    return (
        <main className="min-h-screen bg-white text-black font-serif transition-all duration-300">
            <section className="mx-auto w-full max-w-[1500px] px-6 py-10 sm:px-10 md:px-16 lg:px-24 xl:px-32 2xl:px-40">
                <div className="mb-12 flex flex-col items-center gap-4 text-center md:mb-16 md:flex-row md:items-start md:text-left">
                    <KoraIcon className="h-12 w-12 shrink-0 sm:h-14 sm:w-14 md:h-[56px] md:w-[56px]" />

                    <div>
                        <h1 className="mt-0 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                            News
                        </h1>
                        <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-600 sm:text-base">
                            Descubre las últimas novedades de KÖRA: lanzamientos, colecciones,
                            mejoras de la plataforma y noticias relacionadas con nuestra marca.
                        </p>
                    </div>
                </div>

                <div className="mb-14 border-y border-black/10 py-8">
                    <p className="mb-3 text-xs uppercase tracking-[0.25em] text-neutral-500">
                        Última actualización
                    </p>

                    <h2 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
                        Nueva temporada: prendas esenciales para un estilo cómodo y actual
                    </h2>

                    <p className="mt-5 max-w-4xl text-sm leading-7 text-neutral-700 sm:text-base md:leading-8">
                        KÖRA presenta una selección renovada de productos pensados para el
                        día a día. La nueva colección combina siluetas limpias, colores
                        versátiles y prendas fáciles de integrar en cualquier armario,
                        manteniendo una estética moderna, minimalista y funcional.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    <article className="border-b border-black/10 pb-8 lg:border-b-0 lg:border-r lg:pr-8">
                        <p className="mb-3 text-xs uppercase tracking-[0.25em] text-neutral-500">
                            Colecciones
                        </p>

                        <h3 className="text-xl font-bold tracking-tight sm:text-2xl">
                            Nuevos básicos para hombre y mujer
                        </h3>

                        <p className="mt-4 text-sm leading-7 text-neutral-700 sm:text-base">
                            La tienda incorpora nuevas prendas básicas con cortes actuales,
                            tejidos cómodos y una gama de colores neutros. Esta línea está
                            pensada para crear looks sencillos, combinables y adaptados a
                            diferentes estilos.
                        </p>
                    </article>

                    <article className="border-b border-black/10 pb-8 lg:border-b-0 lg:border-r lg:px-8">
                        <p className="mb-3 text-xs uppercase tracking-[0.25em] text-neutral-500">
                            Plataforma
                        </p>

                        <h3 className="text-xl font-bold tracking-tight sm:text-2xl">
                            Mejoras en la experiencia de compra
                        </h3>

                        <p className="mt-4 text-sm leading-7 text-neutral-700 sm:text-base">
                            Hemos trabajado en una navegación más clara, una cesta más cómoda
                            y un proceso de checkout más fluido. El objetivo es que el usuario
                            pueda descubrir productos, añadirlos a la cesta y completar su
                            compra de forma sencilla.
                        </p>
                    </article>

                    <article className="pb-2 lg:pl-8">
                        <p className="mb-3 text-xs uppercase tracking-[0.25em] text-neutral-500">
                            Estilo
                        </p>

                        <h3 className="text-xl font-bold tracking-tight sm:text-2xl">
                            Inspiración minimalista para el día a día
                        </h3>

                        <p className="mt-4 text-sm leading-7 text-neutral-700 sm:text-base">
                            KÖRA apuesta por una estética limpia y atemporal. Las nuevas
                            propuestas buscan facilitar combinaciones prácticas, con prendas
                            que funcionan tanto en looks casuales como en outfits más cuidados.
                        </p>
                    </article>
                </div>

                <div className="mt-16 grid grid-cols-1 gap-8 text-left text-sm leading-7 sm:text-base md:leading-8 lg:grid-cols-2 lg:gap-12 lg:text-justify xl:gap-16">
                    <div className="flex flex-col gap-6">
                        <p>
                            La sección News nace como un espacio para comunicar las novedades
                            más importantes de KÖRA. Aquí se publicarán actualizaciones sobre
                            productos, nuevas categorías, campañas especiales, cambios en la
                            plataforma y contenidos relacionados con el universo de la marca.
                        </p>

                        <p>
                            También compartiremos información sobre futuras mejoras del
                            e-commerce, como nuevas funciones de usuario, ajustes en la
                            presentación de productos, optimización de la cesta, mejoras en el
                            buscador o cambios visuales pensados para ofrecer una experiencia
                            más cuidada.
                        </p>
                    </div>

                    <div className="flex flex-col gap-6">
                        <p>
                            Las noticias publicadas tienen carácter informativo y pueden
                            actualizarse con el tiempo. Algunos productos, colecciones o
                            promociones pueden estar sujetos a disponibilidad, cambios de stock
                            o modificaciones internas de la plataforma.
                        </p>

                        <p>
                            KÖRA seguirá evolucionando con nuevas propuestas visuales,
                            contenidos editoriales y mejoras técnicas orientadas a construir
                            una tienda online moderna, clara y cercana al usuario.
                        </p>
                    </div>
                </div>
            </section>
        </main>
    );
}