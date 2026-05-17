"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { logged, loading, role } = useAuth();
  const router = useRouter();

  const [checking, setChecking] = useState(true);
  const [verified, setVerified] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [blocked, setBlocked] = useState(false);
  const [blockSeconds, setBlockSeconds] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Verificar acceso
  useEffect(() => {
    if (loading) return;

    if (!logged) {
      router.push("/auth");
      return;
    }

    // Esperar a que el role esté cargado
    if (!role) return;

    if (role !== "ADMIN") {
      router.push("/");
      return;
    }

    // Es ADMIN — mostrar pantalla de verificación de contraseña
    setChecking(false);
  }, [loading, logged, role, router]);

  // Limpiar el timer al desmontar
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startBlockTimer = (seconds: number) => {
    setBlocked(true);
    setBlockSeconds(seconds);
    timerRef.current = setInterval(() => {
      setBlockSeconds(prev => {
        if (prev <= 1) {
          setBlocked(false);
          setAttempts(0);
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (blocked || submitting || !password) return;

    setSubmitting(true);
    setError("");

    try {
      // La llamada va a la API Route de Next.js — server-side
      // El token nunca sale al cliente, el servidor lo lee de la cookie httpOnly
      const res = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        setVerified(true);
        setPassword("");
        setAttempts(0);
      } else {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        setPassword("");

        if (newAttempts >= 5) {
          startBlockTimer(60);
          setError("Demasiados intentos. Acceso bloqueado 60 segundos.");
        } else if (newAttempts >= 3) {
          startBlockTimer(15);
          setError(`Contraseña incorrecta. Bloqueado 15 segundos.`);
        } else {
          setError(`Contraseña incorrecta. ${5 - newAttempts} intentos restantes.`);
        }
      }
    } catch {
      setError("Error de conexión.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!verified) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-white"
        style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}
      >
        <div className="w-full max-w-[360px] px-4">

          <div className="mb-10 text-center">
            <p className="text-[10px] tracking-[0.4em] uppercase text-black/40 mb-3">
              Panel de administración
            </p>
            <h1 className="text-4xl font-black tracking-tight text-black">KORA</h1>
          </div>

          <div className="bg-white border border-black/10 rounded-2xl p-8">
            <h2 className="text-sm font-bold tracking-[0.15em] uppercase text-black/40 mb-1">
              Verificación de acceso
            </h2>
            <p className="text-xs text-black/40 mb-6">
              Introduce tu contraseña para continuar
            </p>

            <form onSubmit={handleVerify} className="flex flex-col gap-4" autoComplete="off">
              <div>
                <label className="text-[10px] font-bold tracking-widest uppercase text-black/40 block mb-1.5">
                  Contraseña
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  disabled={blocked || submitting}
                  autoComplete="current-password"
                  autoFocus
                  className="w-full border border-black/20 rounded-xl px-4 py-3 text-sm text-black font-bold tracking-widest focus:outline-none focus:border-black transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                />
              </div>

              {error && (
                <p className="text-xs text-red-500 font-medium">{error}</p>
              )}

              {blocked && (
                <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-center">
                  <p className="text-xs text-red-600 font-semibold tabular-nums">
                    Bloqueado — {blockSeconds}s
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={!password || blocked || submitting}
                className="w-full bg-black text-white text-xs font-bold tracking-widest uppercase py-4 rounded-xl hover:bg-black/80 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {submitting ? "Verificando..." : blocked ? `Bloqueado (${blockSeconds}s)` : "Acceder"}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}