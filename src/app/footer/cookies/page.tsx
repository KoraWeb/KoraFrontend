"use client";

import KoraIcon from "@/components/Icons/KoraIcon";

export default function CookiePolicy() {
    return (
        <main className="min-h-screen bg-white text-black font-serif transition-all duration-300">
            <section className="mx-auto w-full max-w-[1500px] px-6 py-10 sm:px-10 md:px-16 lg:px-24 xl:px-32 2xl:px-40">
                <div className="mb-10 flex flex-col items-center gap-4 text-center md:mb-14 md:flex-row md:items-start md:text-left">
                    <KoraIcon className="h-12 w-12 shrink-0 sm:h-14 sm:w-14 md:h-[56px] md:w-[56px]" />

                    <h1 className="mt-0 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                        Política de cookies
                    </h1>
                </div>

                <div className="grid grid-cols-1 gap-8 text-left text-sm leading-7 sm:text-base md:leading-8 lg:grid-cols-2 lg:gap-12 lg:text-justify xl:gap-16 2xl:text-lg">
                    <div className="flex flex-col gap-6">
                        <p>
                            En KÖRA utilizamos cookies y tecnologías similares para mejorar la
                            experiencia de navegación de nuestros usuarios, recordar ciertas
                            preferencias y garantizar el correcto funcionamiento de la
                            plataforma. Esta política explica qué son las cookies, para qué las
                            utilizamos y cómo puede gestionarlas el usuario.
                        </p>

                        <p>
                            Las cookies son pequeños archivos que se almacenan en el navegador
                            del usuario cuando visita una página web. Estas permiten reconocer
                            el dispositivo, mantener determinadas funciones activas y facilitar
                            una navegación más rápida, segura y personalizada dentro de la
                            tienda online.
                        </p>

                        <p>
                            KÖRA puede utilizar cookies necesarias para el funcionamiento
                            básico de la web, como mantener la sesión iniciada, recordar
                            productos añadidos a la cesta, gestionar el proceso de compra o
                            proteger la seguridad de la plataforma durante la navegación.
                        </p>

                        <p>
                            También podemos utilizar cookies de análisis para conocer cómo los
                            usuarios interactúan con la web, qué secciones visitan con más
                            frecuencia y qué aspectos pueden mejorarse. Esta información se
                            utiliza de forma general para optimizar el diseño, el rendimiento y
                            la experiencia de usuario.
                        </p>
                    </div>

                    <div className="flex flex-col gap-6">
                        <p>
                            Algunas cookies pueden ser propias de KÖRA y otras pueden proceder
                            de servicios externos utilizados en la plataforma, como herramientas
                            de análisis, servicios de pago o funcionalidades necesarias para el
                            correcto funcionamiento de la tienda. En todo caso, su uso estará
                            relacionado con la prestación y mejora del servicio.
                        </p>

                        <p>
                            El usuario puede configurar, bloquear o eliminar las cookies desde
                            la configuración de su navegador. La mayoría de navegadores
                            permiten gestionar las cookies instaladas, rechazar nuevas cookies
                            o recibir un aviso antes de que sean almacenadas en el dispositivo.
                        </p>

                        <p>
                            La desactivación de determinadas cookies puede afectar al
                            funcionamiento de algunas partes de la plataforma. Por ejemplo,
                            podrían dejar de funcionar correctamente la cesta, el inicio de
                            sesión, las preferencias guardadas o ciertos pasos del proceso de
                            compra.
                        </p>

                        <p>
                            KÖRA podrá actualizar esta política de cookies cuando sea necesario
                            para adaptarla a cambios técnicos, mejoras de la plataforma o
                            nuevas obligaciones aplicables. El uso continuado de la web tras la
                            publicación de los cambios supondrá la aceptación de la versión
                            actualizada de esta política.
                        </p>
                    </div>
                </div>
            </section>
        </main>
    );
}