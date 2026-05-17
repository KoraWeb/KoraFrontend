"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type Props = {
    onClose: () => void;
};

export default function LoginModal({ open, onClose }: { open: boolean; onClose: () => void }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        if (!open) return;
        setMounted(true);

        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = ""; }
    }, [open]);

    if (!mounted || !open) return null;

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-end justify-center bg-black/30 p-4 sm:items-center" onClick={onClose}>
            <div className="w-full max-w-md rounded-xl bg-white p-6 text-black shadow-xl" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-2xl font-bold">
                    Inicia sesión
                </h2>
                <p className="mt-2 text-sm text-black/50">
                    Debes iniciar sesión para guardar productos en tu lista de favoritos.
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <Link href="/auth" className="flex-1 rounded-full bg-[#C7A0DD] px-5 py-3 text-center text-sm font-semibold text-white hover:bg-[#b88bd2]">
                        Iniciar Sesión
                    </Link>

                    <button type="button" onClick={onClose} className="flex-1 rounded-full border border-[#C7A0DD] px-5 py-3 text-sm font-semibold text-[#C7A0DD] hover:bg-[#C7A0DD] hover:text-white" >
                        Seguir comprando
                    </button>
                </div>
            </div>
        </div>,
        document.body,
    );
}