"use client";

import KoraIcon from "@/components/Icons/KoraIcon";
import { useEffect, useState } from "react";
import styles from "@/styles/buttons.module.css";
import GoogleButton from "@/components/GoogleButton";
import FacebookButton from "@/components/FacebookButton";
import { login, send2FA } from "@/api/auth/route";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import Cookies from 'js-cookie';
import TwoFactorModal from "@/components/Modals/TwoFactorModal";
import { UserPayload } from "@/api/types/jwtPayload";
import { jwtDecode } from "jwt-decode";

export default function LoginPage() {
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [loading, setLoading] = useState(false);
    const [show2FA, setShow2FA] = useState(false);
    const [pendingToken, setPendingToken] = useState("");

    const router = useRouter();
    const { email, setLogged, setName, setId, setUsername, saveToken } = useAuth();

    useEffect(() => {
        setError(false);
        setErrorMsg("");
        if (!email) router.push("/auth");
    }, [email, router]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(false);
        setErrorMsg("");
        setLoading(true);

        try {
            const data = await login(email, password);

            // Verifica que el 2fa_trusted es de ESTE usuario concreto
            const trusted = Cookies.get("2fa_trusted");
            const isTrustedDevice = trusted && trusted === email;

            if (isTrustedDevice) {
                // Dispositivo de confianza para este usuario — entra directamente
                await saveToken(data.token, rememberMe);

                if (rememberMe) {
                    // Renueva la cookie vinculada al email del usuario
                    Cookies.set("2fa_trusted", email, {
                        expires: 30,
                        secure: process.env.NODE_ENV === "production",
                        sameSite: "strict",
                    });
                }

                const decoded = jwtDecode<UserPayload>(data.token);
                setName(decoded.name ?? "");
                setUsername(decoded.username ?? "");
                setId(decoded.id);
                setLogged(true);
                router.push("/profile");
            } else {
                setPendingToken(data.token);
                await send2FA(email);
                setShow2FA(true);
            }

        } catch (err) {
            if (err instanceof Error) {
                if (err.message === "INVALID_CREDENTIALS") {
                    setError(true);
                } else if (err.message === "SEND_2FA_ERROR") {
                    setErrorMsg("No se pudo enviar el código de verificación. Comprueba tu correo o inténtalo de nuevo.");
                } else {
                    setErrorMsg("Error al iniciar sesión. Inténtalo de nuevo.");
                }
            }
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="min-h-screen w-full flex flex-col items-center text-black font-serif ">
            <div className="mb-12">
                <div className="relative w-28 h-28">
                    <KoraIcon className="w-full h-full" />
                </div>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col">
                <label>
                    CONTRASEÑA
                </label>
                <input
                    type="password"
                    value={password}
                    required
                    onChange={(e) => setPassword(e.target.value)}
                    className={`${styles.inputBox} w-[587px] h-[59px] mb-[10px] px-6`}
                />

                {error && (
                    <p className="text-red-500 text-sm text-start mb-[30px]">
                        Contraseña incorrecta, vuelve a intentarlo
                    </p>
                )}

                {errorMsg && (
                    <p className="text-red-500 text-sm text-start mb-[30px]">
                        {errorMsg}
                    </p>
                )}

                <div className="flex justify-start w-[577px] mb-[20px]">
                    <input type="checkbox" id="remember" name="remember" className="mr-2" />
                    <label id="remember" className="text-sm ">
                        Recuérdame
                    </label>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={`${styles.btnBasic} md:w-[587px] w-[85vw] h-[59px] text-[25px] md:text-[36px] disabled:opacity-50`}
                >
                    {loading ? "Verificando..." : "CONTINUAR"}
                </button>
            </form>

            <div className="flex flex-col gap-3 mt-4 w-[587px]">
                <GoogleButton />
                <FacebookButton />
            </div>

            {show2FA && (
                <TwoFactorModal
                    email={email}
                    rememberMe={rememberMe}
                    onSuccess={async (name, id) => {
                        await saveToken(pendingToken, rememberMe);
                        const decoded = jwtDecode<UserPayload>(pendingToken);
                        setName(decoded.name ?? "");
                        setUsername(decoded.username ?? "");
                        setId(decoded.id);
                        setLogged(true);
                        router.push("/profile");
                    }}
                    onClose={() => {
                        setShow2FA(false);
                        setPendingToken("");
                    }}
                />
            )}
        </div>
    );
}