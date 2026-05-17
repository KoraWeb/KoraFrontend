"use client";

import KoraIcon from "@/components/Icons/KoraIcon";
import { useState } from "react";
import styles from "@/styles/buttons.module.css";
import GoogleButton from "@/components/GoogleButton";
import FacebookButton from "@/components/FacebookButton";
import { checkEmail } from "@/api/auth/route";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {
    const { setEmail } = useAuth();
    const [email, setEmailInput] = useState("");
    const router = useRouter();
    
    const handleContinue = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const data = await checkEmail(email);
            setEmail(email);
            // Guardamos el email en sessionStorage por si el usuario recarga
            sessionStorage.setItem("register_email", email);

            if (data.nextStep === "LOGIN") {
                router.push(`/auth/login`);
            } else {
                router.push(`/auth/register`);
            }
            
        } catch (error) {
            
        }
    };

    return (
        <div className="min-h-screen w-full flex flex-col items-center text-black font-serif">
            <div className="mb-12">
                <div className="relative w-[70px] md:w-28 h-[70px] md:h-28">
                    <KoraIcon className="w-[70px] h-[70px] md:w-full md:h-full" />
                </div>
            </div>
            <h2 className="text-[3.0vw] md:text-[18px] font-bold tracking-[0.08em] uppercase mb-14">INICIAR SESIÓN O REGISTRARSE</h2>
            <form onSubmit={handleContinue} className="flex flex-col mb-0 md:mb-[30px]">
                <label id="email" className="text-[3.5vw] md:text-[16px]">
                    CORREO ELECTRÓNICO
                </label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className={`${styles.inputBox} md:w-[587px] w-[85vw] md:h-[59px] h-[12vw] mb-[30px] px-6`}
                    required
                />
                <button
                    type="submit"
                    className={`${styles.btnBasic} md:w-[587px] w-[85vw] h-[59px] text-[25px] md:text-[36px]`}>
                    CONTINUAR
                </button>
                <button
                    type="button"
                    className={`${styles.btnText} w-[587px] h-[59px] mt-4`} style={{ textDecoration: 'underline' }}
                    onClick={() => router.push("/forgot-password")}
                >
                    ¿Olvidaste tu contraseña?
                </button>
            </form>
            <div className="flex items-center gap-2 w-[587px] mb-[30px]">
                <div className="flex-1 h-px bg-[#929292]" />
                <span className="text-black text-[28px] text-center">o</span>
                <div className="flex-1 h-px bg-[#929292]" />
            </div>
            <div className="flex flex-col gap-4">
                <GoogleButton />
                <FacebookButton />
            </div>
        </div>
    );
}