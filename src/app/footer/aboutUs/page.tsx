"use client";

import KoraIcon from "@/components/Icons/KoraIcon";

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-white text-black font-serif transition-all duration-300">
            <section className="mx-auto w-full max-w-[1500px] px-6 py-10 sm:px-10 md:px-16 lg:px-24 xl:px-32 2xl:px-40">
                <div className="mb-10 flex flex-col items-center gap-4 text-center md:mb-14 md:flex-row md:items-start md:text-left">
                    <KoraIcon className="h-12 w-12 shrink-0 sm:h-14 sm:w-14 md:h-[56px] md:w-[56px]" />

                    <h1 className="mt-0 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                        Sobre nosotros
                    </h1>
                </div>

                <div className="grid grid-cols-1 gap-8 text-left text-sm leading-7 sm:text-base md:leading-8 lg:grid-cols-2 lg:gap-12 lg:text-justify xl:gap-16 2xl:text-lg">
                    <div className="flex flex-col gap-6">
                        <p>
                            KÖRA nace como una marca digital de moda pensada para ofrecer una
                            experiencia de compra moderna, clara y cuidada. Nuestro objetivo es
                            unir diseño, funcionalidad y estilo en una plataforma sencilla de
                            utilizar, donde cada usuario pueda descubrir productos de forma
                            cómoda y visual.
                        </p>

                        <p>
                            La identidad de KÖRA se inspira en una estética minimalista,
                            limpia y actual. Apostamos por una forma de presentar la moda donde
                            el producto tenga protagonismo, la navegación sea intuitiva y la
                            experiencia de compra resulte fluida desde cualquier dispositivo.
                        </p>

                        <p>
                            Nuestra plataforma está pensada para mostrar prendas, calzado y
                            complementos de manera ordenada, con información clara sobre cada
                            producto, tallas disponibles, imágenes, precios y disponibilidad.
                            Cada parte del sitio busca transmitir confianza y facilitar la toma
                            de decisiones del usuario.
                        </p>

                        <p>
                            En KÖRA entendemos que una tienda online no solo debe ser visual,
                            sino también práctica. Por eso damos importancia a aspectos como la
                            cesta, el proceso de compra, la adaptación responsive, la
                            organización del catálogo y la coherencia entre diseño y
                            funcionalidad.
                        </p>
                    </div>

                    <div className="flex flex-col gap-6">
                        <p>
                            El proyecto combina moda y tecnología para construir una
                            experiencia e-commerce completa. Desde la estructura visual hasta
                            la gestión de productos, stock, usuario y pago, cada elemento forma
                            parte de una propuesta orientada a crear una plataforma realista,
                            moderna y funcional.
                        </p>

                        <p>
                            KÖRA busca representar una marca cercana, actual y orientada al
                            usuario. Queremos que cada visita a la web sea sencilla, agradable
                            y coherente con la imagen de una marca de moda contemporánea, donde
                            el diseño y la usabilidad tengan el mismo peso.
                        </p>

                        <p>
                            Actualmente, KÖRA es un proyecto académico desarrollado con la
                            finalidad de simular una tienda online real. Aun así, se ha
                            planteado con una estructura profesional, cuidando tanto la parte
                            visual como la experiencia de usuario y el funcionamiento general
                            de la plataforma.
                        </p>

                        <p>
                            Nuestro propósito es seguir evolucionando la plataforma,
                            incorporando nuevas funcionalidades, mejorando la experiencia de
                            compra y manteniendo una identidad visual clara, elegante y
                            reconocible dentro del entorno digital de la moda.
                        </p>
                    </div>
                </div>
            </section>
        </main>
    );
}