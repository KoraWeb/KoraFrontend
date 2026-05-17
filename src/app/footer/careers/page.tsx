"use client";

import KoraIcon from "@/components/Icons/KoraIcon";

export default function CareersPage() {
    return (
        <main className="min-h-screen bg-white text-black font-serif transition-all duration-300">
            <section className="mx-auto w-full max-w-[1500px] px-6 py-10 sm:px-10 md:px-16 lg:px-24 xl:px-32 2xl:px-40">
                <div className="mb-12 flex flex-col items-center gap-4 text-center md:mb-16 md:flex-row md:items-start md:text-left">
                    <KoraIcon className="h-12 w-12 shrink-0 sm:h-14 sm:w-14 md:h-[56px] md:w-[56px]" />

                    <div>
                        <h1 className="mt-0 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                            Trabaja con nosotros
                        </h1>

                        <p className="mt-3 max-w-3xl text-sm leading-6 text-neutral-600 sm:text-base">
                            En KÖRA buscamos personas comprometidas, creativas y con interés
                            por formar parte de un proyecto digital vinculado a la moda, el
                            diseño y la experiencia de usuario.
                        </p>
                    </div>
                </div>

                <div className="mb-14 border-y border-black/10 py-8">
                    <p className="mb-3 text-xs uppercase tracking-[0.25em] text-neutral-500">
                        Propuesta de incorporación
                    </p>

                    <h2 className="max-w-5xl text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
                        Formar parte de KÖRA significa participar en el desarrollo de una
                        marca digital moderna, cuidada y orientada al usuario
                    </h2>

                    <p className="mt-5 max-w-4xl text-sm leading-7 text-neutral-700 sm:text-base md:leading-8">
                        Nuestra propuesta se dirige a personas que quieran aportar valor en
                        un entorno relacionado con el comercio electrónico, la moda y la
                        construcción de experiencias digitales. En KÖRA valoramos la
                        responsabilidad, la iniciativa, la atención al detalle y la capacidad
                        de trabajar de forma organizada.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-10 text-left text-sm leading-7 sm:text-base md:leading-8 lg:grid-cols-2 lg:gap-14 lg:text-justify">
                    <div className="flex flex-col gap-6">
                        <p>
                            KÖRA nace como una plataforma de moda online con una identidad
                            visual limpia, actual y funcional. Nuestro objetivo es ofrecer una
                            experiencia de compra clara, intuitiva y coherente, cuidando tanto
                            la presentación de los productos como la navegación, la cesta, el
                            proceso de pago y la comunicación con el usuario.
                        </p>

                        <p>
                            Por este motivo, buscamos perfiles que compartan esta visión y que
                            quieran implicarse en el crecimiento del proyecto. Nos interesan
                            personas con capacidad para proponer mejoras, resolver problemas y
                            trabajar con criterio en cada una de las áreas que forman parte de
                            una tienda online.
                        </p>

                        <p>
                            Las posibles áreas de colaboración pueden estar relacionadas con
                            desarrollo web, diseño de interfaz, experiencia de usuario,
                            gestión de catálogo, comunicación de marca, atención al cliente,
                            marketing digital o análisis de datos vinculados al funcionamiento
                            del e-commerce.
                        </p>
                    </div>

                    <div className="flex flex-col gap-6">
                        <p>
                            En KÖRA damos importancia a la calidad del trabajo, la constancia y
                            la mejora continua. Cada detalle forma parte de la experiencia
                            final: desde una ficha de producto bien estructurada hasta una
                            navegación responsive, una imagen cuidada o un proceso de compra
                            sencillo y seguro.
                        </p>

                        <p>
                            Las personas interesadas en formar parte del proyecto deberán
                            destacar por su actitud profesional, capacidad de aprendizaje,
                            compromiso y sensibilidad por el diseño digital. También se valora
                            la autonomía, la organización y la capacidad de adaptarse a nuevas
                            necesidades del proyecto.
                        </p>

                        <p>
                            Actualmente, KÖRA es un proyecto académico, por lo que esta sección
                            tiene una finalidad representativa dentro de la plataforma. No
                            obstante, está planteada siguiendo el estilo de una página real de
                            incorporación profesional para una marca digital en crecimiento.
                        </p>
                    </div>
                </div>

                <div className="mt-16 border-t border-black/10 pt-8">
                    <p className="mb-3 text-xs uppercase tracking-[0.25em] text-neutral-500">
                        Perfil que buscamos
                    </p>

                    <div className="grid grid-cols-1 gap-8 text-sm leading-7 text-neutral-700 sm:text-base md:grid-cols-3">
                        <div>
                            <h3 className="mb-3 text-lg font-bold text-black">
                                Iniciativa
                            </h3>
                            <p>
                                Personas capaces de aportar ideas, detectar mejoras y participar
                                activamente en la evolución del proyecto.
                            </p>
                        </div>

                        <div>
                            <h3 className="mb-3 text-lg font-bold text-black">
                                Compromiso
                            </h3>
                            <p>
                                Perfiles responsables, organizados y orientados a realizar un
                                trabajo cuidado y coherente con la identidad de la marca.
                            </p>
                        </div>

                        <div>
                            <h3 className="mb-3 text-lg font-bold text-black">
                                Visión digital
                            </h3>
                            <p>
                                Interés por la moda online, la experiencia de usuario, el diseño
                                visual y el funcionamiento de una plataforma e-commerce.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-16 border-t border-black/10 pt-8">
                    <p className="mb-3 text-xs uppercase tracking-[0.25em] text-neutral-500">
                        Contacto
                    </p>

                    <p className="max-w-4xl text-sm leading-7 text-neutral-700 sm:text-base md:leading-8">
                        Si estás interesado en colaborar con KÖRA o formar parte de una
                        futura oportunidad profesional, puedes contactar con nosotros a
                        través de los canales habilitados en la plataforma. Revisaremos cada
                        propuesta con atención y valoraremos aquellos perfiles que encajen
                        con la filosofía, necesidades y evolución del proyecto.
                    </p>
                </div>
            </section>
        </main>
    );
}