"use client";

import { cloudinaryUrl } from "@/lib/cloudinary";

import Image from "next/image";
import Link from "next/link";
import styles from "@/styles/buttons.module.css";
import { useEffect, useState } from "react";
import { deleteBagItem, getCurrentBag, updateBagItemQuantity, } from "@/api/bag/route";
import { useRouter } from "next/navigation";
import { BagItem, BagType } from "@/api/types/bag";

export default function BagPage() {
  const [bag, setBag] = useState<BagType | null>(null);
  const router = useRouter();

  //A la hora de finalizar la compra, se redirige a la página de checkout a menos que no se encuentre la bolsa
  const handleCheckout = () => {
    if (!bag || bag.status !== "ACTIVE" || bag.items.length === 0) {
      return;
    }
    router.push("/checkout");
  };

  //Funcion que carga la bolsa, comprobando que este activa, si no hay bolsa la deja null y confirma que ya esta cargado
  const loadBag = async () => {
    try {
      const data = await getCurrentBag();
      if (!data || data.status !== "ACTIVE") {
        setBag(null);
        return;
      }

      setBag(data);
    } catch {
      setBag(null);
    } finally {
    }
  };

  //Si entras a la pagina se carga la bolsa automaticamente
  useEffect(() => {
    loadBag();
  }, []);

  //Funcion para actualizar la cantidad de un producto de la bolsa
  const handleQuantity = async (itemId: number, quantity: number) => {
    if (quantity < 1) return;

    await updateBagItemQuantity(itemId, quantity);
    await loadBag();
  };

  //Funcion para borrar un producto de la bolsa
  const handleDelete = async (itemId: number) => {
    await deleteBagItem(itemId);
    await loadBag();
  };

  //Codigo que se muestra cuando no hay bolsa
  if (!bag || !bag.items || bag.items.length === 0) {
    return (
      <div className="flex min-h-[92vh] w-full flex-col items-center justify-start bg-white px-5 pt-[14vh] text-black sm:px-8 md:pt-[15vh]">        <div className="mb-10 flex flex-col items-center space-y-4 text-center md:mb-16">
        <h1 className="text-4xl font-medium tracking-tight sm:text-5xl md:text-7xl">
          Tu cesta está vacía
        </h1>

        <p className="max-w-[320px] text-base font-light leading-relaxed text-gray-500 sm:max-w-md sm:text-lg md:max-w-lg md:text-2xl">
          Te recomendamos que eches un vistazo a nuestros productos
        </p>
      </div>

        <div className="group relative w-full max-w-[320px] sm:max-w-[440px] md:max-w-[560px]">
          <div className="absolute left-0 top-0 z-0 h-full w-full -translate-x-2 -translate-y-2 bg-[#D9C2E6] sm:-translate-x-3 sm:-translate-y-3" />

          <Link href="/search/" className="relative z-10 flex w-full items-center justify-center bg-[#C7A0DD] px-8 py-4 text-white transition-transform active:-translate-x-[2px] active:-translate-y-[2px] sm:px-12 md:px-16">
            <span className="flex items-center gap-3 font-serif text-4xl tracking-wide sm:text-5xl md:gap-4 md:text-6xl">
              BUSCAR
              <span className="text-4xl font-light sm:text-5xl">
                →
              </span>
            </span>
          </Link>
        </div>
      </div>
    );
  }

  //Calculo del precio total de la bolsa
  const total = bag.items.reduce((costeTotal: number, item: BagItem) => costeTotal + item.productPrice * item.quantity, 0);

  //Bolsa cuando hay algun producto en el carrito
  return (
    <div className="px-4 pb-8 text-black sm:px-6 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">
            Tu bolsa
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Revisa tus productos antes de finalizar la compra.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          <div className="space-y-4">

            {bag.items.map((item: BagItem) => (
              <div key={item.id} className="rounded-2xl bg-white p-4 shadow-md border border-gray-100 sm:p-6">
                <div className="flex gap-4 sm:gap-6">
                  <div className="relative h-32 w-28 shrink-0 overflow-hidden rounded-xl bg-gray-100 sm:h-44 sm:w-40">
                    <Image
                      src={cloudinaryUrl(item.productImage, { width: 300, height: 375 })}
                      alt={item.productName}
                      fill
                      className="object-contain p-2"
                    />
                  </div>

                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h2 className="text-base font-semibold sm:text-xl">
                          {item.productName}
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                          Talla: {item.size}
                        </p>

                        <p className="mt-2 text-sm text-gray-500">
                          Precio unidad:{" "}
                          {item.productPrice.toFixed(2)}€
                        </p>
                      </div>

                      <p className="text-lg font-semibold sm:text-xl">
                        {(item.productPrice * item.quantity).toFixed(2)}€
                      </p>
                    </div>

                    <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex w-fit items-center rounded-full border border-gray-200 bg-white">
                        <button
                          onClick={() => handleQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="flex h-11 w-11 items-center justify-center rounded-full text-xl hover:bg-gray-100 disabled:text-gray-300"
                        >
                          −
                        </button>

                        <span className="w-10 text-center font-semibold">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() => handleQuantity(item.id, item.quantity + 1)}
                          className="flex h-11 w-11 items-center justify-center rounded-full text-xl hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => handleDelete(item.id)}
                        className="w-fit text-sm font-medium text-gray-500 underline underline-offset-4 hover:text-black"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <aside className="h-fit rounded-2xl bg-white p-6 shadow-md border border-gray-100 lg:sticky lg:top-8">
            <h2 className="text-2xl font-semibold">
              Resumen
            </h2>

            <div className="mt-6 space-y-4 border-b border-gray-200 pb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">
                  Subtotal
                </span>

                <span className="font-medium">
                  {total.toFixed(2)}€
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-500">
                  Envío
                </span>

                <span className="font-medium">
                  Gratis
                </span>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <p className="text-lg font-semibold">
                Total
              </p>

              <span className="text-2xl font-bold">
                {total.toFixed(2)}€
              </span>
            </div>

            <button
              onClick={handleCheckout}
              className={`${styles.btnBasic} mt-6 w-full rounded-full px-6 py-4 font-semibold`}
            >
              Finalizar compra
            </button>
          </aside>
        </div>
      </div>
    </div>
  );
}