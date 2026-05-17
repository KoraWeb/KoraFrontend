"use client";

import KoraIcon from "@/components/Icons/KoraIcon";

export default function Terms() {
    return (
        <main className="min-h-screen bg-white text-black transition-all duration-300">
            <section className="mx-auto w-full max-w-[1500px] px-6 py-10 sm:px-10 md:px-16 lg:px-24 xl:px-32 2xl:px-40">
                <div className="mb-10 flex flex-col items-center gap-4 text-center md:mb-14 md:flex-row md:items-start md:text-left">
                    <KoraIcon className="h-12 w-12 shrink-0 sm:h-14 sm:w-14 md:h-[56px] md:w-[56px]" />

                    <h1 className="mt-0 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                        Términos y condiciones
                    </h1>
                </div>

                <div className="grid grid-cols-1 gap-8 text-left text-sm leading-7 sm:text-base md:leading-8 lg:grid-cols-2 lg:gap-12 lg:text-justify xl:gap-16 2xl:text-lg">
                    <div className="flex flex-col gap-6">
                        <p>
                            Los presentes términos y condiciones regulan el acceso, navegación
                            y uso de la plataforma KÖRA, así como la compra de productos
                            ofrecidos a través de nuestra tienda online. Al utilizar esta web,
                            el usuario acepta estas condiciones y se compromete a hacer un uso
                            adecuado, responsable y conforme a la finalidad del sitio.
                        </p>

                        <p>
                            KÖRA ofrece productos relacionados con moda, calzado y
                            complementos. Las imágenes, descripciones, precios y tallas
                            mostradas en la web tienen carácter informativo y pueden estar
                            sujetas a cambios. Aunque intentamos mantener la información
                            actualizada, la disponibilidad de los productos dependerá del stock
                            existente en cada momento.
                        </p>

                        <p>
                            Para realizar un pedido, el usuario deberá facilitar los datos
                            necesarios para gestionar la compra, el pago y el envío. El usuario
                            es responsable de que la información introducida sea correcta,
                            completa y actualizada. KÖRA no se hace responsable de incidencias
                            derivadas de datos erróneos, incompletos o desactualizados.
                        </p>

                        <p>
                            El usuario se compromete a no utilizar la plataforma con fines
                            ilícitos, fraudulentos o que puedan perjudicar el funcionamiento de
                            la web, la seguridad del sistema o los derechos de otros usuarios.
                            KÖRA podrá limitar o bloquear el acceso a aquellos usuarios que
                            incumplan estas condiciones.
                        </p>
                    </div>

                    <div className="flex flex-col gap-6">
                        <p>
                            Los precios indicados en la web se muestran en euros e incluyen
                            los impuestos aplicables, salvo que se indique lo contrario. Los
                            gastos de envío, en caso de existir, se mostrarán durante el
                            proceso de compra antes de confirmar el pedido. KÖRA se reserva el
                            derecho a modificar los precios, promociones o condiciones
                            comerciales sin previo aviso.
                        </p>

                        <p>
                            Los pagos se realizan mediante proveedores de pago seguros. KÖRA
                            no almacena los datos completos de tarjetas bancarias ni
                            información sensible relacionada con el pago. Una vez confirmado el
                            pago, el usuario recibirá la confirmación del pedido y se iniciará
                            el proceso de preparación y envío.
                        </p>

                        <p>
                            El usuario podrá solicitar cambios, devoluciones o cancelaciones
                            según la política establecida por KÖRA. Para aceptar una
                            devolución, el producto deberá encontrarse en buen estado, sin uso
                            y, cuando corresponda, con su embalaje original. No se aceptarán
                            devoluciones de productos dañados, usados o que no cumplan las
                            condiciones indicadas.
                        </p>

                        <p>
                            KÖRA podrá actualizar estos términos y condiciones para adaptarlos
                            a cambios en la plataforma, mejoras del servicio o nuevas
                            necesidades operativas. El uso continuado de la web tras la
                            publicación de los cambios supondrá la aceptación de la versión
                            actualizada de los términos.
                        </p>
                    </div>
                </div>
            </section>
        </main>
    );
}