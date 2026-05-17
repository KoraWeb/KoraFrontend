"use client";

import KoraIcon from "@/components/Icons/KoraIcon";

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-white text-black font-serif transition-all duration-300">
            <section className="mx-auto w-full max-w-[1500px] px-6 py-10 sm:px-10 md:px-16 lg:px-24 xl:px-32 2xl:px-40">
                <div className="mb-10 flex flex-col items-center gap-4 text-center md:mb-14 md:flex-row md:items-start md:text-left">
                    <KoraIcon className="h-12 w-12 shrink-0 sm:h-14 sm:w-14 md:h-[56px] md:w-[56px]" />

                    <h1 className="mt-0 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                        Política de privacidad
                    </h1>
                </div>

                <div className="grid grid-cols-1 gap-8 text-left text-sm leading-7 sm:text-base md:leading-8 lg:grid-cols-2 lg:gap-12 lg:text-justify xl:gap-16 2xl:text-lg">
                    <div className="flex flex-col gap-6">
                        <p>
                            En KÖRA nos comprometemos a proteger la privacidad de nuestros
                            usuarios y a tratar sus datos personales de forma responsable,
                            segura y transparente. Esta política explica qué información
                            podemos recopilar, con qué finalidad la utilizamos y qué derechos
                            tiene el usuario en relación con sus datos.
                        </p>

                        <p>
                            Podemos recopilar datos personales cuando el usuario crea una
                            cuenta, realiza una compra, contacta con nuestro equipo o utiliza
                            determinadas funciones de la plataforma. Estos datos pueden incluir
                            nombre, dirección de correo electrónico, dirección de envío,
                            información de contacto y datos necesarios para gestionar pedidos,
                            entregas, devoluciones o consultas.
                        </p>

                        <p>
                            La información proporcionada se utiliza principalmente para
                            gestionar la cuenta del usuario, tramitar pedidos, procesar pagos,
                            enviar confirmaciones, resolver incidencias, mejorar la experiencia
                            de compra y ofrecer una atención al cliente adecuada. KÖRA no
                            solicitará más datos de los necesarios para prestar correctamente
                            sus servicios.
                        </p>

                        <p>
                            Los pagos realizados en la plataforma se gestionan mediante
                            proveedores de pago seguros. KÖRA no almacena los datos completos
                            de tarjetas bancarias ni información sensible de pago. La gestión
                            de estos datos se realiza directamente a través de plataformas
                            externas especializadas en pagos seguros.
                        </p>
                    </div>

                    <div className="flex flex-col gap-6">
                        <p>
                            KÖRA podrá conservar los datos personales durante el tiempo
                            necesario para cumplir con las finalidades para las que fueron
                            recogidos, así como para atender posibles responsabilidades legales
                            u obligaciones relacionadas con pedidos, facturación, soporte o
                            seguridad de la plataforma.
                        </p>

                        <p>
                            El usuario podrá solicitar el acceso, modificación, eliminación o
                            limitación del tratamiento de sus datos personales cuando
                            corresponda. También podrá solicitar la eliminación de su cuenta o
                            contactar con KÖRA para resolver cualquier duda relacionada con el
                            uso de su información personal.
                        </p>

                        <p>
                            KÖRA aplica medidas técnicas y organizativas para proteger la
                            información de los usuarios frente a accesos no autorizados,
                            pérdida, alteración o uso indebido. No obstante, ningún sistema es
                            completamente infalible, por lo que recomendamos al usuario
                            mantener sus credenciales seguras y no compartir su contraseña con
                            terceros.
                        </p>

                        <p>
                            Esta política de privacidad podrá actualizarse cuando sea necesario
                            para adaptarse a cambios en la plataforma, mejoras del servicio o
                            nuevas obligaciones aplicables. El uso continuado de la web tras la
                            publicación de los cambios supondrá la aceptación de la versión
                            actualizada de esta política.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}