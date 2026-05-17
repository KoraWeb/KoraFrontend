"use client";

import { useState } from "react";
import KoraIcon from "@/components/Icons/KoraIcon";

type FAQItem = {
    question: string;
    answer: string;
};

const faqs: FAQItem[] = [
    {
        question: "¿Qué es KÖRA?",
        answer:
            "KÖRA es una plataforma online de moda, calzado y complementos desarrollada como proyecto académico. La web está planteada como un e-commerce real, con catálogo de productos, cesta, usuario y proceso de compra.",
    },
    {
        question: "¿Los productos son reales?",
        answer:
            "Actualmente, KÖRA es un proyecto académico, por lo que los productos, precios e información mostrada tienen una finalidad demostrativa. La plataforma simula el funcionamiento de una tienda online real.",
    },
    {
        question: "¿Necesito crear una cuenta para comprar?",
        answer:
            "La plataforma puede permitir navegar y añadir productos a la cesta como invitado. No obstante, algunas funciones como el historial de pedidos, favoritos o datos de usuario pueden requerir iniciar sesión.",
    },
    {
        question: "¿Cómo funciona la cesta?",
        answer:
            "La cesta permite añadir productos, seleccionar talla, modificar cantidades y revisar los artículos antes de continuar con el proceso de compra. En caso de usuarios invitados, la cesta puede tener una duración limitada.",
    },
    {
        question: "¿Qué métodos de pago se aceptan?",
        answer:
            "El proceso de pago está integrado con una pasarela segura. En el contexto del proyecto, se utiliza Stripe para simular pagos de forma segura y profesional, sin almacenar datos completos de tarjetas en KÖRA.",
    },
    {
        question: "¿Puedo devolver un producto?",
        answer:
            "En una tienda real, las devoluciones estarían sujetas a la política de cambios y devoluciones de KÖRA. El producto debería encontrarse en buen estado, sin uso y con su embalaje original cuando corresponda.",
    },
    {
        question: "¿Cómo puedo contactar con KÖRA?",
        answer:
            "Puedes contactar con KÖRA a través de la página de contacto o de los canales habilitados en la plataforma. Al tratarse de un proyecto académico, esta información puede tener una finalidad representativa.",
    },
];

export default function FAQPage() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const toggleFAQ = (index: number) => {
        setOpenIndex((currentIndex) => (currentIndex === index ? null : index));
    };

    return (
        <main className="min-h-screen bg-white text-black font-serif transition-all duration-300">
            <section className="mx-auto w-full max-w-[1200px] px-6 py-10 sm:px-10 md:px-16 lg:px-24 xl:px-28">
                <div className="mb-10 flex flex-col items-center gap-4 text-center md:mb-14 md:flex-row md:items-start md:text-left">
                    <KoraIcon className="h-12 w-12 shrink-0 sm:h-14 sm:w-14 md:h-[56px] md:w-[56px]" />

                    <div>
                        <h1 className="mt-0 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                            Preguntas frecuentes
                        </h1>

                        <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-600 sm:text-base">
                            Resolvemos algunas de las dudas más habituales sobre KÖRA, el
                            funcionamiento de la plataforma, la cesta, los pagos y la
                            experiencia de compra.
                        </p>
                    </div>
                </div>

                <div className="mx-auto flex w-full max-w-[900px] flex-col gap-3">
                    {faqs.map((faq, index) => {
                        const isOpen = openIndex === index;

                        return (
                            <div
                                key={faq.question}
                                className="border-b border-black/10 py-4"
                            >
                                <button
                                    type="button"
                                    onClick={() => toggleFAQ(index)}
                                    className="flex w-full items-center justify-between gap-6 text-left"
                                    aria-expanded={isOpen}
                                >
                                    <span className="text-base font-bold tracking-tight sm:text-lg">
                                        {faq.question}
                                    </span>

                                    <span className="text-2xl leading-none">
                                        {isOpen ? "−" : "+"}
                                    </span>
                                </button>

                                <div
                                    className={`grid transition-all duration-300 ease-in-out ${isOpen
                                        ? "grid-rows-[1fr] opacity-100"
                                        : "grid-rows-[0fr] opacity-0"
                                        }`}
                                >
                                    <div className="overflow-hidden">
                                        <p className="pt-4 text-sm leading-7 text-neutral-700 sm:text-base md:leading-8">
                                            {faq.answer}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>
        </main>
    );
}