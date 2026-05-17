"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { forgotPassword } from "@/api/auth/route";
import KoraIcon from "@/components/Icons/KoraIcon";

type Step = "form" | "sent";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<Step>("form");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await forgotPassword(email);
      setStep("sent");
    } catch {
      setError("Ha ocurrido un error. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-[#f5f5f5] flex items-start justify-center px-4 pt-12"
      style={{ fontFamily: "'Helvetica Neue', 'Helvetica Neue Text Pro', Helvetica, Arial, sans-serif" }}
    >
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 cursor-pointer" onClick={() => router.push("/")}>
            <KoraIcon className="w-full h-full text-black" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          {step === "form" ? (
            <div className="p-8">
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#CDB4DB] mb-2">
                Recuperar acceso
              </p>
              <h1
                className="text-2xl font-black tracking-tight text-black mb-2"
                style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", fontWeight: 900 }}
              >
                ¿Olvidaste tu contraseña?
              </h1>
              <p className="text-sm text-gray-400 mb-8 leading-relaxed">
                Introduce tu correo y te enviaremos un enlace para crear una nueva contraseña.
              </p>

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div>
                    <label className="text-[10px] font-bold tracking-[0.15em] uppercase text-gray-400 block mb-1.5">
                        Correo electrónico
                    </label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => { setError(null); setEmail(e.target.value); }}
                        required
                        placeholder="tucorreo@email.com"
                        className="w-full border border-black border-gray-200 rounded-xl px-4 py-3 text-sm text-black bg-[#fafafa] focus:outline-none focus:border-[#CDB4DB] transition-colors"
                        style={{ fontFamily: "inherit" }}
                    />
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-500">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-[#CDB4DB] text-white text-xs font-black tracking-widest uppercase rounded-xl hover:bg-[#a66fc6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ fontFamily: "inherit" }}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Enviando...
                    </span>
                  ) : (
                    "Enviar enlace"
                  )}
                </button>
              </form>
            </div>
          ) : (
            <div className="p-8 flex flex-col items-center text-center gap-5">
              <div className="w-14 h-14 rounded-full bg-[#f0eaf5] flex items-center justify-center">
                <svg className="w-7 h-7 text-[#CDB4DB]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h2
                  className="text-xl font-black tracking-tight text-black"
                  style={{ fontFamily: "inherit", fontWeight: 900 }}
                >
                  Revisa tu correo
                </h2>
                <p className="text-sm text-gray-400 mt-2 leading-relaxed">
                  Si existe una cuenta con <strong className="text-gray-600">{email}</strong>, recibirás un enlace en los próximos minutos.
                </p>
              </div>
              <p className="text-xs text-gray-300 mt-1">El enlace expira en 30 minutos.</p>
            </div>
          )}
        </div>

        <button
          onClick={() => router.push("/auth")}
          className="mt-4 w-full py-2.5 text-xs text-gray-400 hover:text-gray-600 transition-colors tracking-widest uppercase"
          style={{ fontFamily: "inherit" }}
        >
          ← Volver al inicio de sesión
        </button>
      </div>
    </div>
  );
}