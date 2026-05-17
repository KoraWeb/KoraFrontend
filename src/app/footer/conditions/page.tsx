"use client";

import KoraIcon from "@/components/Icons/KoraIcon";

export default function Conditions() {
    return (
        <div className="min-h-screen bg-white text-black transition-all duration-300">
            <section className="mx-auto w-full max-w-[1500px] px-6 py-10 sm:px-10 md:px-16 lg:px-24 xl:px-32 2xl:px-40">

                <div className="mb-10 flex flex-col items-center gap-4 text-center md:mb-14 md:flex-row md:items-start md:text-left">
                    <KoraIcon className="h-12 w-12 shrink-0 sm:h-14 sm:w-14 md:h-[56px] md:w-[56px]" />

                    <h1 className="mt-0 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                        Condiciones legales
                    </h1>
                </div>

                <div className="grid grid-cols-1 gap-8 text-left text-sm leading-7 sm:text-base md:leading-8 lg:grid-cols-2 lg:gap-12 lg:text-justify xl:gap-16 2xl:text-lg">
                    <div className="flex flex-col gap-6">
                        <p>
                            Bienvenido a KÖRA. Al acceder, navegar o realizar una compra en
                            nuestra plataforma, aceptas las presentes condiciones de uso. Te
                            recomendamos leer detenidamente este apartado antes de utilizar
                            nuestros servicios, ya que regula el acceso a la web, la compra de
                            productos, el uso de la cuenta de usuario y la relación entre el
                            cliente y KÖRA.
                        </p>

                        <p>
                            Los productos mostrados en esta tienda online están destinados a
                            la venta de artículos de moda, calzado y complementos. KÖRA se
                            reserva el derecho a modificar, actualizar o retirar productos,
                            precios, promociones, imágenes o descripciones sin previo aviso.
                            Aunque intentamos que toda la información sea precisa, pueden
                            existir pequeñas variaciones en colores, tallas o disponibilidad
                            debido a la configuración de la pantalla o a cambios en el stock.
                        </p>

                        <p>
                            Para realizar una compra, el usuario deberá proporcionar los datos
                            necesarios para tramitar correctamente el pedido, incluyendo la
                            información de contacto, dirección de entrega y método de pago.
                            El usuario se compromete a facilitar información veraz, actualizada
                            y completa. KÖRA no se responsabiliza de retrasos o incidencias
                            derivados de datos incorrectos o incompletos introducidos durante
                            el proceso de compra.
                        </p>
                    </div>

                    <div className="flex flex-col gap-6">
                        <p>
                            Los pagos realizados en la plataforma se gestionan mediante
                            proveedores de pago seguros. KÖRA no almacena los datos completos
                            de tarjetas bancarias ni información sensible de pago. Una vez
                            confirmado el pago, el cliente recibirá la confirmación del pedido
                            y se iniciará el proceso de preparación y envío, siempre sujeto a
                            la disponibilidad real del producto adquirido.
                        </p>

                        <p>
                            El usuario podrá solicitar cambios, devoluciones o cancelaciones
                            conforme a la política establecida por KÖRA. Los productos deberán
                            encontrarse en buen estado, sin uso y con su embalaje original
                            cuando sea necesario. No se aceptarán devoluciones de artículos que
                            presenten signos de uso, daños provocados por el cliente o que no
                            cumplan las condiciones indicadas en la política de devoluciones.
                        </p>

                        <p>
                            KÖRA podrá modificar estas condiciones legales cuando lo considere
                            necesario para adaptarlas a cambios en la plataforma, mejoras del
                            servicio o nuevas obligaciones aplicables. El uso continuado de la
                            web tras la publicación de los cambios implica la aceptación de las
                            nuevas condiciones. Para cualquier consulta relacionada con estas
                            condiciones, el usuario podrá contactar con el equipo de atención
                            al cliente de KÖRA.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}