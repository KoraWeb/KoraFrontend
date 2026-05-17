"use client";

import Link from "next/link";

export default function AddedModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 p-4 sm:items-center " onClick={onClose}>
      <div className="w-full max-w-md bg-white p-6 text-black shadow-xl rounded-xl" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-2xl font-bold">Añadido a la bolsa</h2>

        <p className="mt-2 text-sm text-black/50">
          El producto se ha añadido correctamente a tu cesta.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link href="/bag" className="flex-1 rounded-full bg-[#CDB4DB] px-5 py-3 text-center text-sm font-semibold text-white hover:bg-[#b88bd2]">
            Ir a la bolsa
          </Link>

          <button
            onClick={onClose}
            className="flex-1 rounded-full border border-[#C7A0DD] hover:border-[#C7A0DD] px-5 py-3 text-sm font-semibold hover:bg-[#C7A0DD] text-[#C7A0DD] hover:text-white"
          >
            Seguir comprando
          </button>
        </div>
      </div>
    </div>
  );
}