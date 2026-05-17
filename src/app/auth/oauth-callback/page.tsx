"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { jwtDecode } from "jwt-decode";
import { UserPayload } from "@/api/types/jwtPayload";

export default function OAuthCallbackPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const { setLogged, setName, setId, setUsername, setEmail, saveToken } = useAuth();

    useEffect(() => {
        if (status === "loading") return;

        if (session && (session as any).backendToken) {
            const token = (session as any).backendToken;

            saveToken(token, false).then(() => {
                const decoded = jwtDecode<UserPayload>(token);
                setName(decoded.name ?? "");
                setUsername(decoded.username ?? "");
                setEmail(decoded.sub ?? "");
                setId(decoded.id);
                setLogged(true);
                router.push("/profile");
            });

        } else if (status === "unauthenticated") {
            router.push("/auth");
        }
    }, [session, status]);

    return (
        <div className="min-h-screen flex items-center justify-center font-serif">
            <p className="text-gray-400 text-sm">Iniciando sesión...</p>
        </div>
    );
}