"use client";

import styles from "@/styles/buttons.module.css";
import GoogleIcon from "./Icons/GoogleIcon";
import { signIn } from "next-auth/react";

export default function GoogleButton() {
    return (
        <button
            onClick={() => signIn("google", { callbackUrl: "/auth/oauth-callback" })}
            className={`${styles.btnExternal} w-[587px] h-[55px] flex items-center px-4`}
        >
            <GoogleIcon className="w-[24px] h-[24px]" />
            <span className="mx-auto">CONTINUAR CON GOOGLE</span>
        </button>
    );
}