"use client";

import styles from "@/styles/buttons.module.css";
import FacebookIcon from "./Icons/FacebookIcon";
import { signIn } from "next-auth/react";

export default function FacebookButton() {
    return (
        <button
            onClick={() => signIn("facebook", { callbackUrl: "/auth/oauth-callback" })}
            className={`${styles.btnExternal} w-[587px] h-[55px] flex items-center px-4`}
        >
            <FacebookIcon className="w-[24px] h-[24px] text-[#3b5998]" />
            <span className="mx-auto">CONTINUAR CON FACEBOOK</span>
        </button>
    );
}