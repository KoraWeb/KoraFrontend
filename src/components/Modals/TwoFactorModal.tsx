"use client";

import { useEffect, useRef, useState } from "react";
import styles from "@/styles/buttons.module.css";
import { verify2FA, resend2FA } from "@/api/auth/route";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { UserPayload } from "@/api/types/jwtPayload";
import { useAuth } from "@/app/context/AuthContext";

interface Props {
    email: string;
    rememberMe: boolean;
    onSuccess: (name: string, id: number, verifiedToken: string) => void;
    onClose: () => void;
}

export default function TwoFactorModal({ email, rememberMe, onSuccess, onClose }: Props) {
    const [code, setCode] = useState("");
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resent, setResent] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const { saveToken } = useAuth();

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    useEffect(() => {
        if (countdown <= 0) return;
        const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
        return () => clearTimeout(timer);
    }, [countdown]);

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        if (code.length !== 6) return;

        setError(false);
        setLoading(true);

        try {
            const data = await verify2FA(email, code);

            // Guarda el token verificado de forma segura via API Route (httpOnly)
            await saveToken(data.token, rememberMe);

            // Si marcó "Recuérdame", guarda la cookie vinculada al email del usuario
            // Así si otro usuario inicia sesión en el mismo dispositivo,
            // no hereda el 2fa_trusted de este usuario
            if (rememberMe) {
                Cookies.set("2fa_trusted", email, {
                    expires: 30,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "strict",
                });
            }

            const decoded = jwtDecode<UserPayload>(data.token);
            onSuccess(decoded.name, decoded.id, data.token);

        } catch (err) {
            if (err instanceof Error && err.message === "INVALID_CODE") {
                setError(true);
                setCode("");
                inputRef.current?.focus();
            }
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (countdown > 0) return;
        try {
            await resend2FA(email);
            setResent(true);
            setCountdown(60);
            setTimeout(() => setResent(false), 4000);
        } catch {
            // silencioso
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-2xl p-10 w-full max-w-[460px] flex flex-col font-serif shadow-xl">

                <div className="mb-6 text-center">
                    <h2 className="text-xl font-medium mb-1">Verificación en dos pasos</h2>
                    <p className="text-sm text-gray-500">
                        Hemos enviado un código de 6 dígitos a<br />
                        <span className="font-medium text-black">{email}</span>
                    </p>
                </div>

                <form onSubmit={handleVerify} className="flex flex-col gap-4">
                    <input
                        ref={inputRef}
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        placeholder="000000"
                        value={code}
                        onChange={(e) => {
                            setError(false);
                            setCode(e.target.value.replace(/\D/g, ""));
                        }}
                        className={`${styles.inputBox} h-[59px] px-6 text-center tracking-[0.5em] text-xl`}
                        autoComplete="one-time-code"
                    />

                    {error && (
                        <p className="text-red-500 text-sm text-center">
                            Código incorrecto. Inténtalo de nuevo.
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading || code.length !== 6}
                        className={`${styles.btnBasic} h-[59px] disabled:opacity-40 disabled:cursor-not-allowed`}
                    >
                        {loading ? "Verificando..." : "VERIFICAR"}
                    </button>
                </form>

                <div className="mt-6 flex justify-between items-center text-sm text-gray-400">
                    <button
                        onClick={handleResend}
                        disabled={countdown > 0}
                        className="hover:text-black transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        {resent ? "¡Código reenviado!" : countdown > 0 ? `Reenviar en ${countdown}s` : "Reenviar código"}
                    </button>
                    <button onClick={onClose} className="hover:text-black transition-colors">
                        Cancelar
                    </button>
                </div>

                {rememberMe && (
                    <p className="mt-4 text-xs text-center text-gray-400">
                        No pediremos este código en este dispositivo durante 30 días.
                    </p>
                )}
            </div>
        </div>
    );
}