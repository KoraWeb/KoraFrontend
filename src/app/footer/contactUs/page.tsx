"use client";

import KoraIcon from "@/components/Icons/KoraIcon";

export default function ContactPage() {
    return (
        <main className="min-h-screen bg-white text-black font-serif transition-all duration-300">
            <section className="mx-auto w-full max-w-[1500px] px-6 py-10 sm:px-10 md:px-16 lg:px-24 xl:px-32 2xl:px-40">
                <div className="mb-10 flex flex-col items-center gap-4 text-center md:mb-14 md:flex-row md:items-start md:text-left">
                    <KoraIcon className="h-12 w-12 shrink-0 sm:h-14 sm:w-14 md:h-[56px] md:w-[56px]" />

                    <div>
                        <h1 className="mt-0 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                            Contacto
                        </h1>

                        <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-600 sm:text-base">
                            Para recibir una respuesta más rápida y precisa, te recomendamos
                            enviar tu consulta con la información necesaria desde el primer
                            mensaje.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8 text-left text-sm leading-7 sm:text-base md:leading-8 lg:grid-cols-2 lg:gap-12 lg:text-justify xl:gap-16 2xl:text-lg">
                    <div className="flex flex-col gap-6">
                        <p>
                            Si necesitas contactar con el equipo de KÖRA, puedes escribirnos a
                            nuestro correo de atención al cliente. Para poder ayudarte de forma
                            eficiente, es importante que el mensaje sea claro, directo y que
                            incluya todos los datos relacionados con tu consulta.
                        </p>

                        <p>
                            Antes de enviar el correo, revisa que el asunto indique brevemente
                            el motivo del mensaje. Por ejemplo, puedes utilizar asuntos como
                            “Consulta sobre pedido”, “Problema con la cesta”, “Duda sobre
                            tallas”, “Solicitud de devolución” o “Error durante el pago”.
                        </p>

                        <p>
                            En el cuerpo del mensaje, explica la situación de forma ordenada.
                            Indica qué ha ocurrido, en qué momento se ha producido la
                            incidencia y qué necesitas que revisemos. Cuanta más información
                            útil nos facilites, más sencillo será entender el caso y darte una
                            respuesta adecuada.
                        </p>

                        <p>
                            Si tu consulta está relacionada con un producto, incluye el nombre
                            del artículo, la talla seleccionada, la categoría o cualquier otro
                            dato que ayude a identificarlo. Si se trata de una incidencia
                            técnica, también puedes indicar desde qué dispositivo o navegador
                            estabas accediendo a la plataforma.
                        </p>
                    </div>

                    <div className="flex flex-col gap-6">
                        <p>
                            Para consultas relacionadas con pedidos, pagos o devoluciones, es
                            recomendable incluir el correo utilizado en la compra, la fecha
                            aproximada del pedido y una breve descripción del problema. No
                            envíes datos sensibles como contraseñas, números completos de
                            tarjeta bancaria o información privada innecesaria.
                        </p>

                        <p>
                            También puedes adjuntar capturas de pantalla si ayudan a entender
                            mejor la incidencia. Por ejemplo, una captura de un error, de un
                            producto concreto o de un paso del proceso de compra puede ser útil
                            para localizar el problema con mayor rapidez.
                        </p>

                        <p>
                            Nuestro correo de contacto es:
                            <br />
                            <a
                                href="mailto:koramailhelp@gmail.com"
                                className="font-bold text-black underline underline-offset-4 hover:text-black/60"
                            >
                                koramailhelp@gmail.com
                            </a>
                        </p>

                        <p>
                            Actualmente, KÖRA es un proyecto académico, por lo que esta página
                            tiene una finalidad representativa dentro de la plataforma. Aun
                            así, está planteada como una sección real de atención al cliente
                            para una tienda online de moda.
                        </p>
                    </div>
                </div>

                <div className="mt-14 rounded-2xl bg-[#f6f0fa] p-6 sm:p-8">
                    <p className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-black/40">
                        Ejemplo de correo recomendado
                    </p>

                    <div className="space-y-4 text-sm leading-7 text-neutral-700 sm:text-base">
                        <p>
                            <span className="font-bold text-black">Asunto:</span> Consulta
                            sobre pedido / Duda sobre talla / Error durante el pago
                        </p>

                        <p>
                            Hola KÖRA,
                            <br />
                            Me pongo en contacto porque he tenido una consulta relacionada con
                            [explicar brevemente el motivo]. El producto/pedido afectado es
                            [indicar nombre del producto o referencia si la tienes].
                        </p>

                        <p>
                            La incidencia ocurrió el día [indicar fecha aproximada] mientras
                            utilizaba la web desde [móvil/ordenador/navegador]. Adjunto una
                            captura para que podáis revisarlo mejor.
                        </p>

                        <p>
                            Muchas gracias.
                            <br />
                            Nombre:
                            <br />
                            Correo de contacto:
                        </p>
                    </div>
                </div>
            </section>
        </main>
    );
}