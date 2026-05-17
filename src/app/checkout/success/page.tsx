"use client";
import Link from "next/link";
import { useEffect } from "react";
import Cookies from "js-cookie";

export default function SuccessPage() {

  useEffect(() => {
    const bagId = Cookies.get("bagId");
    const shippingAddress = Cookies.get("shippingAddress") || "";
    if (!bagId) return;

    const createOrder = async () => {
      try {
        await fetch("/api/orders/from-bag", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bagId, shippingAddress }),
        });
      } catch (e) {
        console.error("Error creando pedido:", e);
      } finally {
        Cookies.remove("bagId");
        Cookies.remove("shippingAddress");
      }
    };

    createOrder();
  }, []);

  return (
    <div className="flex min-h-[92vh] w-full flex-col items-center justify-start bg-white px-5 pt-[14vh] text-black sm:px-8 md:pt-[15vh]">
      <div className="mb-10 flex flex-col items-center space-y-4 text-center md:mb-16">
        <h1 className="text-4xl font-medium tracking-tight sm:text-5xl md:text-7xl">
          Gracias por su compra
        </h1>
        <p className="max-w-[320px] text-base font-light leading-relaxed text-gray-500 sm:max-w-md sm:text-sm md:max-w-lg md:text-md">
          La información de tu pedido se ha enviado a tu correo electrónico. Si tienes alguna pregunta, no dudes en contactarnos.
        </p>
      </div>

      <div className="flex flex-col items-center gap-4 w-full max-w-[320px] sm:max-w-[440px] md:max-w-[560px]">
        <div className="group relative w-full">
          <div className="absolute left-0 top-0 z-0 h-full w-full -translate-x-2 -translate-y-2 bg-[#D9C2E6] sm:-translate-x-3 sm:-translate-y-3" />
          <Link href="/profile" className="relative z-10 flex w-full items-center justify-center bg-[#C7A0DD] px-8 py-4 text-white transition-transform active:-translate-x-[2px] active:-translate-y-[2px] sm:px-12 md:px-16">
            <span className="flex items-center gap-3 font-serif text-4xl tracking-wide sm:text-5xl md:gap-4 md:text-6xl">
              MI PEDIDO
            </span>
          </Link>
        </div>
        <div className="group relative w-full">
          <div className="absolute left-0 top-0 z-0 h-full w-full -translate-x-2 -translate-y-2 bg-[#e5e5e5] sm:-translate-x-3 sm:-translate-y-3" />
          <Link href="/" className="relative z-10 flex w-full items-center justify-center bg-[#111] px-8 py-4 text-white transition-transform active:-translate-x-[2px] active:-translate-y-[2px] sm:px-12 md:px-16">
            <span className="flex items-center gap-3 font-serif text-4xl tracking-wide sm:text-5xl md:gap-4 md:text-6xl">
              VOLVER
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}