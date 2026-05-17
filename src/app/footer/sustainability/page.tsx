"use client";

import KoraIcon from "@/components/Icons/KoraIcon";

export default function SustainabilityPage() {
    return (
        <main className="min-h-screen bg-white text-black font-serif transition-all duration-300">
            <section className="mx-auto w-full max-w-[1500px] px-6 py-10 sm:px-10 md:px-16 lg:px-24 xl:px-32 2xl:px-40">
                <div className="mb-10 flex flex-col items-center gap-4 text-center md:mb-14 md:flex-row md:items-start md:text-left">
                    <KoraIcon className="h-12 w-12 shrink-0 sm:h-14 sm:w-14 md:h-[56px] md:w-[56px]" />

                    <h1 className="mt-0 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                        Sostenibilidad
                    </h1>
                </div>

                <div className="grid grid-cols-1 gap-8 text-left text-sm leading-7 sm:text-base md:leading-8 lg:grid-cols-2 lg:gap-12 lg:text-justify xl:gap-16 2xl:text-lg">
                    <div className="flex flex-col gap-6">
                        <p>
                            En KÖRA entendemos la sostenibilidad como una parte fundamental en
                            la evolución de la moda y del comercio electrónico. Nuestro
                            objetivo es representar una marca consciente, capaz de combinar
                            diseño, funcionalidad y responsabilidad en la forma en que presenta
                            sus productos y construye su experiencia digital.
                        </p>

                        <p>
                            La sostenibilidad no solo está relacionada con los materiales o los
                            procesos de producción, sino también con la manera en que una marca
                            comunica, organiza y ofrece sus productos. Por ello, KÖRA apuesta
                            por una experiencia de compra clara, sencilla y orientada a ayudar
                            al usuario a tomar decisiones más informadas.
                        </p>

                        <p>
                            Desde una perspectiva visual, buscamos una identidad limpia,
                            atemporal y coherente, evitando elementos innecesarios y priorizando
                            una presentación ordenada de los productos. Una plataforma más
                            clara y funcional también contribuye a reducir fricciones,
                            mejorar la navegación y ofrecer una relación más directa entre la
                            marca y el usuario.
                        </p>

                        <p>
                            En el desarrollo de KÖRA se tiene en cuenta la importancia de una
                            estructura digital eficiente, responsive y adaptable a distintos
                            dispositivos. Una web bien organizada permite mejorar la
                            experiencia de usuario, optimizar procesos y facilitar el acceso a
                            la información relevante de cada producto.
                        </p>
                    </div>

                    <div className="flex flex-col gap-6">
                        <p>
                            La propuesta de KÖRA se basa en promover una visión de consumo más
                            consciente, donde el usuario pueda valorar mejor sus decisiones de
                            compra. Para ello, resulta importante ofrecer información clara
                            sobre los productos, sus características, tallas disponibles,
                            disponibilidad de stock y condiciones asociadas a la compra.
                        </p>

                        <p>
                            También entendemos la sostenibilidad como una actitud de mejora
                            continua. Esto implica revisar la plataforma, optimizar su
                            funcionamiento, reducir procesos innecesarios y construir una
                            experiencia digital que sea útil, accesible y coherente con los
                            valores de una marca moderna.
                        </p>

                        <p>
                            Actualmente, KÖRA es un proyecto académico, por lo que esta sección
                            tiene una finalidad representativa dentro de la plataforma. No
                            obstante, está planteada como una página real de una marca de moda
                            que desea comunicar su compromiso con una forma de consumo más
                            responsable, clara y equilibrada.
                        </p>

                        <p>
                            En futuras evoluciones del proyecto, esta sección podría ampliarse
                            con información sobre materiales, procesos de fabricación,
                            proveedores, embalajes, logística, iniciativas ambientales o
                            acciones sociales vinculadas a la actividad de la marca.
                        </p>
                    </div>
                </div>
            </section>
        </main>
    );
}