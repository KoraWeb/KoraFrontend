"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import InstagramIcon from "./Icons/InstagramIcon";
import TwitterIcon from "./Icons/TwitterIcon";
import YoutubeIcon from "./Icons/YoutubeIcon";
import PinIcon from "./Icons/PinIcon";

export default function Footer() {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }

        return () => {
            document.body.style.overflow = "";
        };
    }, [open]);
    return (
        <>
            <footer className="bg-[#C7A0DD] pt-8 md:pt-[41px]">
                <div className="bg-[#D9C2E6] flex min-h-[471px] flex-col justify-between px-6 py-8 md:px-[34px] md:py-[38px]">
                    <div className="flex flex-col gap-10 lg:flex-row lg:justify-between">
                        <div className="order-1 flex justify-center gap-4 lg:order-2 lg:justify-end">
                            <Link
                                href="https://www.instagram.com/"
                                className="flex h-9 w-9 items-center justify-center rounded-full bg-white transition hover:scale-105"
                            >
                                <InstagramIcon className="h-6 w-6 text-black" />
                            </Link>

                            <Link
                                href="https://twitter.com/"
                                className="flex h-9 w-9 items-center justify-center rounded-full bg-white transition hover:scale-105"
                            >
                                <TwitterIcon className="h-6 w-6 text-black" />
                            </Link>

                            <Link
                                href="https://www.youtube.com/"
                                className="flex h-9 w-9 items-center justify-center rounded-full bg-white transition hover:scale-105"
                            >
                                <YoutubeIcon className="h-6 w-6 text-black" />
                            </Link>
                        </div>

                        <div className="order-2 grid gap-8 text-center text-[16px] text-black md:grid-cols-2 md:text-left md:text-[18px] lg:order-1 lg:grid-cols-3 lg:gap-16 xl:gap-[120px]">
                            <div className="hidden md:block">
                                <ul className="space-y-1">
                                    <li className="w-fit hover:underline transition duration-300 ease-in-out">
                                        <Link href="/footer/aboutUs">SOBRE NOSOTROS</Link>
                                    </li>

                                    <li className="w-fit hover:underline transition duration-300 ease-in-out">
                                        <Link href="/footer/contactUs">CONTACTO</Link>
                                    </li>

                                    <li className="w-fit hover:underline transition duration-300 ease-in-out">
                                        <Link href="/footer/faq">PREGUNTAS FRECUENTES</Link>
                                    </li>

                                    <li className="w-fit hover:underline transition duration-300 ease-in-out">
                                        <button type="button" onClick={() => setOpen(true)}>
                                            GUÍA DE TALLAS
                                        </button>
                                    </li>
                                </ul>
                            </div>

                            <div className="mx-auto text-center md:mx-0 md:text-left">
                                <h3 className="mb-2 text-black">SOBRE KÖRA</h3>

                                <ul className="space-y-1 text-white">
                                    <li className="hover:underline transition duration-300 ease-in-out md:w-fit">
                                        <Link href="/footer/news">Notícias</Link>
                                    </li>

                                    <li className="hover:underline transition duration-300 ease-in-out md:w-fit">
                                        <Link href="/footer/careers">Trabaja con nosotros</Link>
                                    </li>

                                    <li className="hover:underline transition duration-300 ease-in-out md:w-fit">
                                        <Link href="/footer/investors">Accionistas</Link>
                                    </li>

                                    <li className="hover:underline transition duration-300 ease-in-out md:w-fit">
                                        <Link href="/footer/sustainability">Sostenibilidad</Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 flex flex-col gap-6 text-center text-[13px] text-white md:flex-row md:items-end md:justify-between md:text-left md:text-[14px]">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-center sm:gap-[10px] md:justify-start">
                            <div className="flex items-center justify-center gap-2 md:justify-start">
                                <PinIcon />
                                <p>Spain</p>
                            </div>

                            <p>© 2025 Köra, Inc. All Rights Reserved</p>
                        </div>

                        <ul className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-4 md:justify-end">
                            <li className="hover:underline transition duration-300 ease-in-out">
                                <Link href="/footer/conditions">Condiciones</Link>
                            </li>

                            <li className="hover:underline transition duration-300 ease-in-out">
                                <Link href="/footer/terms">Términos</Link>
                            </li>

                            <li className="hover:underline transition duration-300 ease-in-out">
                                <Link href="/footer/privacy">Política de privacidad</Link>
                            </li>

                            <li className="hover:underline transition duration-300 ease-in-out">
                                <Link href="/footer/cookies">Política de cookies</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </footer>

            {open && (
                <div
                    onClick={() => setOpen(false)}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="relative max-h-[90vh] w-full max-w-5xl overflow-auto"
                    >


                        <Image
                            src="/size-guide.png"
                            alt="Guía de tallas"
                            width={1280}
                            height={1024}
                            className="h-auto w-full"
                        />
                    </div>
                </div>
            )}
        </>
    );
}