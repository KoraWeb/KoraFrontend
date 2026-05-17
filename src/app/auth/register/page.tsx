"use client";

import KoraIcon from "@/components/Icons/KoraIcon";
import styles from "@/styles/buttons.module.css";
import GoogleButton from "@/components/GoogleButton";
import FacebookButton from "@/components/FacebookButton";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { login, register, checkUsername } from "@/api/auth/route";
import { jwtDecode } from "jwt-decode";
import { UserPayload } from "@/api/types/jwtPayload";
import HourglassIcon from "@/components/Icons/HourglassIcon";
import CheckIcon from "@/components/Icons/Checkicon";
import CrossIcon from "@/components/Icons/CrossIcon";

export default function RegisterPage() {
    const router = useRouter();
    const { email, setLogged, setName: setContextName, setUsername: setContextUsername, setId, saveToken } = useAuth();
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [username, setUsername] = useState("");

    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [usernameError, setUsernameError] = useState<string | null>(null);
    const [usernameOk, setUsernameOk] = useState(false);
    const [checkingUsername, setCheckingUsername] = useState(false);
    const [generalError, setGeneralError] = useState<string | null>(null);

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/;
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;

    useEffect(() => {
        if (!password) { setPasswordError(null); return; }
        if (!passwordRegex.test(password)) {
            setPasswordError("Debe tener mayúscula, minúscula, número y símbolo (@$!%*?&)");
        } else {
            setPasswordError(null);
        }
    }, [password]);

    useEffect(() => {
        setUsernameOk(false);
        if (!username) { setUsernameError(null); return; }

        if (!usernameRegex.test(username)) {
            setUsernameError("Solo letras, números y _ (3-20 caracteres)");
            return;
        }

        setUsernameError(null);
        setCheckingUsername(true);

        const timer = setTimeout(async () => {
            try {
                const available = await checkUsername(username);
                if (available) {
                    setUsernameOk(true);
                    setUsernameError(null);
                } else {
                    setUsernameOk(false);
                    setUsernameError("Este nombre de usuario ya está en uso");
                }
            } catch {
                setUsernameError("Error comprobando disponibilidad");
            } finally {
                setCheckingUsername(false);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [username]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setGeneralError(null);

        if (!passwordRegex.test(password)) {
            setPasswordError("Contraseña no válida");
            return;
        }
        if (!usernameOk) {
            setUsernameError("Elige un nombre de usuario válido y disponible");
            return;
        }

        try {
            await register(name + " " + surname, username, email, password);
            const data = await login(email, password);
            await saveToken(data.token, false);

            const decoded = jwtDecode<UserPayload>(data.token);
            setContextName(decoded.name ?? "");
            setContextUsername(decoded.username ?? "");
            setId(decoded.id);
            setLogged(true);

            sessionStorage.removeItem("register_email");
            router.push("/profile");
        } catch (error: any) {
            if (error.message?.includes("usuario")) {
                setUsernameError("Este nombre de usuario ya está en uso");
            } else {
                setGeneralError("Error en el registro. Inténtalo de nuevo.");
            }
        }
    };

    return (
        <div className="min-h-screen w-full flex flex-col items-center text-black font-serif mb-[50px]">
            <div className="mb-12">
                <div className="relative w-28 h-28">
                    <KoraIcon className="w-full h-full" />
                </div>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="flex flex-col mb-[5px] gap-[5px]">

                    {/* NOMBRE DE USUARIO */}
                    <label htmlFor="username">NOMBRE DE USUARIO</label>
                    <div className="relative">
                        <input
                            type="text"
                            id="username"
                            placeholder="kora_user123"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className={`${styles.inputBox} w-[587px] h-[59px] px-6 pr-12`}
                            required
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center">
                            {checkingUsername && <HourglassIcon className="w-5 h-5 text-amber-400 animate-pulse" />}
                            {!checkingUsername && usernameOk && <CheckIcon className="w-5 h-5 text-emerald-500" />}
                            {!checkingUsername && username && usernameError && <CrossIcon className="w-5 h-5 text-red-500" />}
                        </span>
                    </div>
                    {usernameError && (
                        <p className="text-red-500 text-sm">{usernameError}</p>
                    )}
                    {usernameOk && !usernameError && (
                        <p className="text-green-600 text-sm">¡Nombre de usuario disponible!</p>
                    )}

                    {/* CONTRASEÑA */}
                    <label htmlFor="password" className="mt-[20px]">CONTRASEÑA</label>
                    <input
                        type="password"
                        id="password"
                        placeholder="Password1234$"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`${styles.inputBox} w-[587px] h-[59px] px-6`}
                        required
                    />
                    {passwordError && (
                        <p className="text-red-500 text-sm">{passwordError}</p>
                    )}

                    {/* NOMBRE REAL */}
                    <label htmlFor="name" className="mt-[20px]">NOMBRE</label>
                    <input
                        type="text"
                        id="name"
                        placeholder="Antonio"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={`${styles.inputBox} w-[587px] h-[59px] px-6`}
                        required
                    />

                    {/* APELLIDOS */}
                    <label htmlFor="surname" className="mt-[20px]">APELLIDOS</label>
                    <input
                        type="text"
                        id="surname"
                        placeholder="Ruiz Garcia"
                        value={surname}
                        onChange={(e) => setSurname(e.target.value)}
                        className={`${styles.inputBox} w-[587px] h-[59px] mb-[30px] px-6`}
                        required
                    />
                </div>

                <div className="flex flex-col justify-start w-[587px] gap-2">
                    <div className="flex">
                        <input type="checkbox" id="newsletter" name="newsletter" className="mr-2" />
                        <label htmlFor="newsletter" className="text-sm">
                            Suscríbete a nuestra Newsletter y mantente actualizado
                        </label>
                    </div>
                    <div className="flex mb-[30px]">
                        <input type="checkbox" id="terms" name="terms" className="mr-2" required />
                        <label htmlFor="terms" className="text-sm">
                            Acepto los <Link href="/terms" className="font-bold">Términos de uso</Link> y{" "}
                            <Link href="/conditions" className="font-bold">Condiciones legales</Link>
                        </label>
                    </div>
                    {generalError && (
                        <p className="text-red-500 text-sm text-center mb-2">{generalError}</p>
                    )}
                    <button
                        type="submit"
                        disabled={!usernameOk || !!passwordError}
                        className={`${styles.btnBasic} w-[587px] h-[59px] disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        CONTINUAR
                    </button>
                </div>
            </form>

            <div className="flex flex-col gap-4 mt-[40px]">
                <GoogleButton />
                <FacebookButton />
            </div>
        </div>
    );
}