"use client";

import KoraIcon from "@/components/Icons/KoraIcon";

export default function InvestorsPage() {
    return (
        <main className="min-h-screen bg-white text-black font-serif transition-all duration-300">
            <section className="mx-auto w-full max-w-[1500px] px-6 py-10 sm:px-10 md:px-16 lg:px-24 xl:px-32 2xl:px-40">
                <div className="mb-10 flex flex-col items-center gap-4 text-center md:mb-14 md:flex-row md:items-start md:text-left">
                    <KoraIcon className="h-12 w-12 shrink-0 sm:h-14 sm:w-14 md:h-[56px] md:w-[56px]" />

                    <h1 className="mt-0 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                        Accionistas
                    </h1>
                </div>

                <div className="grid grid-cols-1 gap-8 text-left text-sm leading-7 sm:text-base md:leading-8 lg:grid-cols-2 lg:gap-12 lg:text-justify xl:gap-16 2xl:text-lg">
                    <div className="flex flex-col gap-6">
                        <p>
                            KÖRA se presenta como una plataforma digital de moda orientada a
                            ofrecer una experiencia de compra moderna, clara y funcional. El
                            proyecto combina una identidad visual cuidada con una estructura
                            técnica pensada para facilitar la navegación, la gestión de
                            productos y el proceso de compra dentro de un entorno online.
                        </p>

                        <p>
                            La propuesta de valor de KÖRA se basa en construir una marca con
                            una estética limpia, minimalista y coherente. Cada elemento de la
                            plataforma, desde la presentación de los productos hasta la cesta y
                            el proceso de pago, está diseñado para transmitir confianza,
                            comodidad y una experiencia de usuario sencilla.
                        </p>

                        <p>
                            Desde una perspectiva corporativa, KÖRA busca representar un modelo
                            de e-commerce escalable, capaz de incorporar nuevas categorías,
                            ampliar su catálogo, gestionar productos por tallas y stock, y
                            evolucionar hacia futuras funcionalidades como pedidos, métricas,
                            historial de compras o paneles de administración.
                        </p>

                        <p>
                            El desarrollo de la plataforma permite analizar aspectos relevantes
                            del funcionamiento de una tienda online, como la gestión de
                            usuarios, el comportamiento de la cesta, la disponibilidad de
                            productos, la integración de pagos y la organización interna de los
                            datos necesarios para operar un comercio digital.
                        </p>
                    </div>

                    <div className="flex flex-col gap-6">
                        <p>
                            La información relacionada con ventas, productos, usuarios o
                            rendimiento tendría una finalidad orientada al análisis interno y a
                            la mejora continua del servicio. Estos datos permitirían valorar la
                            evolución del proyecto, detectar oportunidades de crecimiento y
                            tomar decisiones basadas en el uso real de la plataforma.
                        </p>

                        <p>
                            KÖRA también pone especial atención en la experiencia visual y en
                            la percepción de marca. La coherencia entre diseño, contenido,
                            navegación y funcionalidad resulta fundamental para ofrecer una
                            tienda online profesional, atractiva y adaptada a distintos
                            dispositivos.
                        </p>

                        <p>
                            Esta sección tiene como finalidad ofrecer una visión general del
                            proyecto desde un punto de vista informativo. No constituye una
                            oferta de inversión, participación societaria, asesoramiento
                            financiero ni compromiso comercial de ningún tipo.
                        </p>

                        <p>
                            Actualmente, KÖRA es un proyecto académico, por lo que el contenido
                            incluido en esta página debe entenderse como parte de una
                            simulación realista de una plataforma de comercio electrónico. Su
                            objetivo es mostrar cómo podría presentarse la información
                            corporativa de una marca digital en crecimiento.
                        </p>
                    </div>
                </div>
            </section>
        </main>
    );
}