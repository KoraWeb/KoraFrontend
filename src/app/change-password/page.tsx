"use client";

import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { changePassword } from "@/api/auth/route";
import KoraIcon from "@/components/Icons/KoraIcon";

type Step = "form" | "success";

export default function ChangePasswordPage() {
  const { logged, loading } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState<Step>("form");
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && !logged) router.push("/auth");
  }, [loading, logged, router]);

  const passwordStrength = (pwd: string): number => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };

  const strengthLabel = ["", "Débil", "Regular", "Buena", "Fuerte"];
  const strengthColor = ["", "bg-red-400", "bg-orange-400", "bg-yellow-400", "bg-green-500"];
  const strength = passwordStrength(form.newPassword);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (form.newPassword !== form.confirmPassword) {
      setError("Las contraseñas nuevas no coinciden.");
      return;
    }
    if (form.newPassword.length < 6) {
      setError("La nueva contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (form.newPassword === form.currentPassword) {
      setError("La nueva contraseña no puede ser igual a la actual.");
      return;
    }

    const token = Cookies.get("token");
    if (!token) { router.push("/auth"); return; }

    setSubmitting(true);
    try {
      await changePassword(token, form.currentPassword, form.newPassword);
      setStep("success");
    } catch (err) {
      if (err instanceof Error && err.message === "INVALID_CURRENT_PASSWORD") {
        setError("La contraseña actual no es correcta.");
      } else {
        setError("Ha ocurrido un error. Inténtalo de nuevo.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const EyeOpen = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );

  const EyeOff = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f5f5]">
        <div className="w-8 h-8 border-2 border-[#CDB4DB] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!logged) return null;

  return (
    <div
      className="min-h-screen bg-[#f5f5f5] flex items-center justify-center px-4"
      style={{ fontFamily: "'Helvetica Neue', 'Helvetica Neue Text Pro', Helvetica, Arial, sans-serif" }}
    >
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 cursor-pointer" onClick={() => router.push("/")}>
            <KoraIcon className="w-full h-full" />
          </div>
        </div>

        {step === "success" ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-8 flex flex-col items-center text-center gap-5">
            <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center">
              <svg className="w-7 h-7 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight text-black" style={{ fontWeight: 900 }}>
                Contraseña actualizada
              </h2>
              <p className="text-sm text-gray-400 mt-2 leading-relaxed">
                Tu contraseña ha sido cambiada correctamente.<br />
                Te hemos enviado un correo de confirmación.
              </p>
            </div>
            <button
              onClick={() => router.push("/profile")}
              className="w-full py-3 bg-[#CDB4DB] text-white text-xs font-black tracking-widest uppercase rounded-xl hover:bg-[#a66fc6] transition-colors"
            >
              Volver al perfil
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="h-1.5 w-full bg-gradient-to-r from-[#CDB4DB] to-[#a66fc6]" />
            <div className="p-8">
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#CDB4DB] mb-2">
                Seguridad
              </p>
              <h1 className="text-2xl font-black tracking-tight text-black mb-2" style={{ fontWeight: 900 }}>
                Cambiar<br />contraseña
              </h1>
              <p className="text-sm text-gray-400 mb-8 leading-relaxed">
                Introduce tu contraseña actual y elige una nueva.
              </p>

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {/* Contraseña actual */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[10px] font-bold tracking-[0.15em] uppercase text-gray-400">
                      Contraseña actual
                    </label>
                    <button
                      type="button"
                      onClick={() => router.push("/forgot-password")}
                      className="text-[10px] text-[#CDB4DB] hover:text-[#a66fc6] font-bold tracking-wide transition-colors"
                    >
                      ¿La olvidaste?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showCurrent ? "text" : "password"}
                      name="currentPassword"
                      value={form.currentPassword}
                      onChange={handleChange}
                      required
                      placeholder="••••••••"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-[#fafafa] focus:outline-none focus:border-[#CDB4DB] transition-colors pr-12"
                      style={{ fontFamily: "inherit" }}
                    />
                    <button type="button" onClick={() => setShowCurrent(!showCurrent)} tabIndex={-1}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                      {showCurrent ? <EyeOff /> : <EyeOpen />}
                    </button>
                  </div>
                </div>

                {/* Nueva contraseña */}
                <div>
                  <label className="text-[10px] font-bold tracking-[0.15em] uppercase text-gray-400 block mb-1.5">
                    Nueva contraseña
                  </label>
                  <div className="relative">
                    <input
                      type={showNew ? "text" : "password"}
                      name="newPassword"
                      value={form.newPassword}
                      onChange={handleChange}
                      required
                      placeholder="••••••••"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-[#fafafa] focus:outline-none focus:border-[#CDB4DB] transition-colors pr-12"
                      style={{ fontFamily: "inherit" }}
                    />
                    <button type="button" onClick={() => setShowNew(!showNew)} tabIndex={-1}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                      {showNew ? <EyeOff /> : <EyeOpen />}
                    </button>
                  </div>
                  {form.newPassword.length > 0 && (
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex gap-1 flex-1">
                        {[1, 2, 3, 4].map((i) => (
                          <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= strength ? strengthColor[strength] : "bg-gray-200"}`} />
                        ))}
                      </div>
                      <span className="text-[10px] text-gray-400 font-bold tracking-wide w-14 text-right">
                        {strengthLabel[strength]}
                      </span>
                    </div>
                  )}
                </div>

                {/* Confirmar */}
                <div>
                  <label className="text-[10px] font-bold tracking-[0.15em] uppercase text-gray-400 block mb-1.5">
                    Confirmar contraseña
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirm ? "text" : "password"}
                      name="confirmPassword"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      required
                      placeholder="••••••••"
                      className={`w-full border rounded-xl px-4 py-3 text-sm bg-[#fafafa] focus:outline-none transition-colors pr-12 ${
                        form.confirmPassword && form.newPassword !== form.confirmPassword
                          ? "border-red-300 focus:border-red-400"
                          : "border-gray-200 focus:border-[#CDB4DB]"
                      }`}
                      style={{ fontFamily: "inherit" }}
                    />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} tabIndex={-1}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                      {showConfirm ? <EyeOff /> : <EyeOpen />}
                    </button>
                  </div>
                  {form.confirmPassword && form.newPassword !== form.confirmPassword && (
                    <p className="text-[11px] text-red-400 mt-1">Las contraseñas no coinciden</p>
                  )}
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-500">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 mt-1 bg-[#CDB4DB] text-white text-xs font-black tracking-widest uppercase rounded-xl hover:bg-[#a66fc6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ fontFamily: "inherit" }}
                >
                  {submitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Guardando...
                    </span>
                  ) : "Cambiar contraseña"}
                </button>
              </form>
            </div>
          </div>
        )}

        <button
          onClick={() => router.push("/profile")}
          className="mt-4 w-full py-2.5 text-xs text-gray-400 hover:text-gray-600 transition-colors tracking-widest uppercase"
          style={{ fontFamily: "inherit" }}
        >
          ← Volver al perfil
        </button>
      </div>
    </div>
  );
}