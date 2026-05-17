"use client";

import { cloudinaryUrl } from "@/lib/cloudinary";

import Image from "next/image";
import Link from "next/link";
import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import { getBag, getBagIdFromCookie } from "@/api/bag/route";
import styles from "@/styles/buttons.module.css";
import SpanishFlagIcon from "./Icons/SpanishFlagIcon";
import { BagType } from "@/api/types/bag";

type AddressEntry = {
  id: string;
  label: string;
  street: string;
  streetNumber: string;
  floor: string;
  door: string;
  postalCode: string;
  city: string;
  province: string;
};

function parseUserAddresses(raw: string | null | undefined): AddressEntry[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed as AddressEntry[];
    return [];
  } catch {
    return [];
  }
}

function serializeAddresses(addresses: AddressEntry[]): string {
  return JSON.stringify(addresses);
}

function formatAddress(a: AddressEntry): string {
  return [a.street, a.streetNumber, a.floor, a.door, a.postalCode, a.city, a.province, "España"]
    .filter(Boolean)
    .join(", ");
}

export default function PaymentForm() {
  const stripe = useStripe();
  const elements = useElements();

  const [bag, setBag] = useState<BagType | null>(null);
  const [loadingBag, setLoadingBag] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [email, setEmail] = useState("");
  const [dni, setDni] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [phone, setPhone] = useState("");

  const [street, setStreet] = useState("");
  const [streetNumber, setStreetNumber] = useState("");
  const [floor, setFloor] = useState("");
  const [door, setDoor] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");

  const [savedAddresses, setSavedAddresses] = useState<AddressEntry[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [saveAddress, setSaveAddress] = useState(false);
  const [addressLabel, setAddressLabel] = useState("");
  const [userProfile, setUserProfile] = useState<{
    name: string;
    username: string;
    email: string;
    address: string;
    photoUrl: string;
  } | null>(null);

  const [promoCode, setPromoCode] = useState("");
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoError, setPromoError] = useState("");
  const [promoResult, setPromoResult] = useState<{
    code: string;
    description: string;
    discountType: string;
    discountValue: number;
    discount: number;
  } | null>(null);

  const country = "España";
  const shipping = 0;
  const inputClass = `${styles.inputBox} w-full px-5 py-5 text-lg`;

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.logged) {
          setIsLoggedIn(true);
          loadUserProfile();
        }
      } catch {}
    };
    checkAuth();
    loadBag();
  }, []);

  useEffect(() => {
    if (!selectedAddressId || selectedAddressId === "new") return;
    const found = savedAddresses.find((a) => a.id === selectedAddressId);
    if (!found) return;
    setStreet(found.street);
    setStreetNumber(found.streetNumber);
    setFloor(found.floor);
    setDoor(found.door);
    setPostalCode(found.postalCode);
    setCity(found.city);
    setProvince(found.province);
  }, [selectedAddressId]);

  const loadBag = async () => {
    try {
      const bagId = getBagIdFromCookie();
      if (!bagId) { setBag(null); return; }
      const data = await getBag(bagId);
      setBag(data);
    } catch {
      setBag(null);
    } finally {
      setLoadingBag(false);
    }
  };

  const loadUserProfile = async () => {
    try {
      const res = await fetch("/api/users/me", { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      setUserProfile(data);
      const addresses = parseUserAddresses(data.address);
      setSavedAddresses(addresses);
      if (addresses.length > 0) setSelectedAddressId(addresses[0].id);
    } catch {}
  };

  const persistAddressToUser = async (newAddress: AddressEntry) => {
    if (!userProfile) return;
    const updated = [
      newAddress,
      ...savedAddresses.filter((a) => a.id !== newAddress.id),
    ].slice(0, 5);
    try {
      await fetch("/api/users/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: userProfile.name,
          username: userProfile.username,
          email: userProfile.email,
          address: serializeAddresses(updated),
          photoURL: userProfile.photoUrl,
        }),
      });
    } catch {}
  };

  const validateDni = (value: string) => {
    const dniRegex = /^[0-9]{8}[A-Za-z]$/;
    if (!dniRegex.test(value)) return false;
    const letters = "TRWAGMYFPDXBNJZSQVHLCKE";
    const numbers = Number(value.substring(0, 8));
    const letter = value.charAt(8).toUpperCase();
    return letters[numbers % 23] === letter;
  };

  const subtotal = bag?.items.reduce((t, item) => t + item.productPrice * item.quantity, 0) ?? 0;
  const discount = promoResult?.discount ?? 0;
  const total = subtotal - discount + shipping;

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;
    setPromoLoading(true);
    setPromoError("");
    setPromoResult(null);
    try {
      const res = await fetch("/api/promociones/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: promoCode.trim(), orderTotal: subtotal }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPromoError(data.error || "Código no válido");
      } else {
        setPromoResult(data);
      }
    } catch {
      setPromoError("Error de conexión");
    } finally {
      setPromoLoading(false);
    }
  };

  const handleRemovePromo = () => {
    setPromoResult(null);
    setPromoCode("");
    setPromoError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    if (!isLoggedIn && !validateDni(dni)) {
      setErrorMessage("El DNI no es válido");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    const fullAddress = [street, streetNumber, floor, door, postalCode, city, province, country]
      .filter(Boolean)
      .join(", ");

    document.cookie = `shippingAddress=${encodeURIComponent(fullAddress)}; max-age=86400; path=/`;

    if (isLoggedIn && saveAddress && street && postalCode && city) {
      const newEntry: AddressEntry = {
        id: selectedAddressId && selectedAddressId !== "new" && savedAddresses.find((a) => a.id === selectedAddressId)
          ? selectedAddressId
          : crypto.randomUUID(),
        label: addressLabel.trim() || city,
        street,
        streetNumber,
        floor,
        door,
        postalCode,
        city,
        province,
      };
      await persistAddressToUser(newEntry);
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/checkout/success`,
      },
    });

    if (error) {
      setLoading(false);
      if (error.type === "card_error" || error.type === "validation_error") return;
      setErrorMessage(error.message || "Error al procesar el pago");
    }
  };

  const showNewAddressForm = !isLoggedIn || savedAddresses.length === 0 || selectedAddressId === "new";
  const addressFormDisabled = isLoggedIn && savedAddresses.length > 0 && selectedAddressId !== "new" && selectedAddressId !== null;

  return (
    <div className="min-h-screen bg-white px-6 py-14 text-black">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-16 lg:grid-cols-[1fr_400px]">
        <form onSubmit={handleSubmit} className="space-y-12">
          <div>
            <h1 className="mb-8 text-3xl font-semibold">Opciones de entrega</h1>

            <div className="mt-8 space-y-6">
              {!isLoggedIn && (
                <>
                  <input
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputClass}
                    placeholder="Correo electrónico*"
                    type="email"
                  />
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <input
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={inputClass}
                      placeholder="Nombre*"
                    />
                    <input
                      required
                      value={surname}
                      onChange={(e) => setSurname(e.target.value)}
                      className={inputClass}
                      placeholder="Apellidos*"
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <input
                      required
                      value={dni}
                      onChange={(e) => setDni(e.target.value.toUpperCase())}
                      className={inputClass}
                      placeholder="DNI*"
                      pattern="[0-9]{8}[A-Za-z]"
                      title="Introduce un DNI válido. Ejemplo: 12345678Z"
                    />
                    <input
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className={inputClass}
                      placeholder="Número de teléfono*"
                      type="tel"
                      pattern="[0-9]{9}"
                      maxLength={9}
                      title="Introduce un teléfono de 9 números"
                    />
                  </div>
                </>
              )}

              {/* Direcciones guardadas */}
              {isLoggedIn && savedAddresses.length > 0 && (
                <div className="space-y-3">
                  <p className="text-base font-medium text-gray-700">Tus direcciones guardadas</p>
                  <div className="space-y-2">
                    {savedAddresses.map((addr) => (
                      <label
                        key={addr.id}
                        className={`flex cursor-pointer items-start gap-3 rounded-xl border px-5 py-4 transition-all ${
                          selectedAddressId === addr.id
                            ? "border-[#C7A0DD] bg-[#f9f4fd]"
                            : "border-gray-200 bg-white hover:border-[#C7A0DD]"
                        }`}
                      >
                        <input
                          type="radio"
                          name="savedAddress"
                          value={addr.id}
                          checked={selectedAddressId === addr.id}
                          onChange={() => setSelectedAddressId(addr.id)}
                          className="mt-1 accent-[#C7A0DD]"
                        />
                        <div className="text-sm leading-relaxed text-gray-700">
                          <span className="font-semibold text-black">{addr.label}</span>
                          <br />
                          {formatAddress(addr)}
                        </div>
                      </label>
                    ))}

                    <label
                      className={`flex cursor-pointer items-center gap-3 rounded-xl border px-5 py-4 transition-all ${
                        selectedAddressId === "new"
                          ? "border-[#C7A0DD] bg-[#f9f4fd]"
                          : "border-gray-200 bg-white hover:border-[#C7A0DD]"
                      }`}
                    >
                      <input
                        type="radio"
                        name="savedAddress"
                        value="new"
                        checked={selectedAddressId === "new"}
                        onChange={() => {
                          setSelectedAddressId("new");
                          setStreet("");
                          setStreetNumber("");
                          setFloor("");
                          setDoor("");
                          setPostalCode("");
                          setCity("");
                          setProvince("");
                          setSaveAddress(false);
                          setAddressLabel("");
                        }}
                        className="accent-[#C7A0DD]"
                      />
                      <span className="text-sm font-medium text-gray-700">Usar otra dirección</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Formulario de dirección */}
              <div
                className={`space-y-4 transition-opacity duration-200 ${
                  addressFormDisabled ? "opacity-50 pointer-events-none select-none" : "opacity-100"
                }`}
              >
                <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_160px]">
                  <input
                    required
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    className={inputClass}
                    placeholder="Calle / Avenida*"
                    readOnly={addressFormDisabled}
                  />
                  <input
                    required
                    value={streetNumber}
                    onChange={(e) => setStreetNumber(e.target.value)}
                    className={inputClass}
                    placeholder="Número*"
                    readOnly={addressFormDisabled}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <input
                    value={floor}
                    onChange={(e) => setFloor(e.target.value)}
                    className={inputClass}
                    placeholder="Piso / Escalera / Casa"
                    readOnly={addressFormDisabled}
                  />
                  <input
                    value={door}
                    onChange={(e) => setDoor(e.target.value)}
                    className={inputClass}
                    placeholder="Puerta / Bloque"
                    readOnly={addressFormDisabled}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-[160px_1fr]">
                  <input
                    required
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className={inputClass}
                    placeholder="Código postal*"
                    pattern="[0-9]{5}"
                    maxLength={5}
                    title="Introduce un código postal de 5 números"
                    readOnly={addressFormDisabled}
                  />
                  <input
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className={inputClass}
                    placeholder="Ciudad*"
                    readOnly={addressFormDisabled}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <input
                    required
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    className={inputClass}
                    placeholder="Provincia*"
                    readOnly={addressFormDisabled}
                  />
                  <div className="relative">
                    <input
                      required
                      value={country}
                      readOnly
                      className={`${inputClass} cursor-default bg-gray-50 pr-16`}
                      placeholder="País*"
                    />
                    <SpanishFlagIcon className="absolute right-4 top-1/2 h-5 w-7 -translate-y-1/2 rounded-sm border border-gray-200 object-cover" />
                  </div>
                </div>
              </div>

              {/* Recuadro guardar dirección */}
              {showNewAddressForm && (
                <div className={`rounded-xl border-2 transition-all ${
                  saveAddress ? "border-[#C7A0DD] bg-[#f9f4fd]" : "border-gray-200 bg-white"
                }`}>
                  <label className="flex cursor-pointer items-start gap-4 px-5 py-4">
                    <div className="relative mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center">
                      <input
                        type="checkbox"
                        checked={saveAddress}
                        onChange={(e) => setSaveAddress(e.target.checked)}
                        className="peer absolute h-5 w-5 cursor-pointer opacity-0"
                      />
                      <div className={`h-5 w-5 rounded border-2 transition-all ${
                        saveAddress ? "border-[#C7A0DD] bg-[#C7A0DD]" : "border-gray-300 bg-white"
                      }`}>
                        {saveAddress && (
                          <svg className="h-full w-full p-0.5 text-white" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="2,6 5,9 10,3" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <div className="flex-1">
                      <span className="text-sm font-semibold text-black">
                        {isLoggedIn
                          ? "Guardar esta dirección para futuras compras"
                          : "Guardar esta dirección (requiere iniciar sesión)"}
                      </span>
                      <p className="mt-0.5 text-xs text-gray-500">
                        {isLoggedIn
                          ? "Podrás seleccionarla rápidamente en tu próximo pedido."
                          : "Inicia sesión para guardar tu dirección y usarla en futuros pedidos."}
                      </p>
                    </div>
                  </label>

                  {saveAddress && isLoggedIn && (
                    <div className="border-t border-[#e8d5f5] px-5 pb-4 pt-3">
                      <label className="mb-1.5 block text-xs font-bold tracking-widest uppercase text-[#9c5fb5]">
                        Nombre para esta dirección
                      </label>
                      <input
                        type="text"
                        value={addressLabel}
                        onChange={(e) => setAddressLabel(e.target.value)}
                        placeholder={city || "Ej: Casa, Trabajo, Casa de la abuela..."}
                        className="w-full rounded-xl border border-[#C7A0DD] bg-white px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#9c5fb5] transition-colors"
                      />
                    </div>
                  )}

                  {saveAddress && !isLoggedIn && (
                    <div className="border-t border-[#e8d5f5] px-5 pb-4 pt-3">
                      <Link href="/auth" className="text-sm font-bold text-[#9c5fb5] hover:underline">
                        Iniciar sesión →
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {errorMessage && (
            <p className="rounded-md text-sm text-red-600 mb-2">{errorMessage}</p>
          )}

          <div>
            <h2 className="mb-8 border-t border-[#CDB4DB] pt-10 text-3xl font-semibold">Pago</h2>
            <div className="rounded-md border border-[#CDB4DB] p-6">
              <PaymentElement
                options={{
                  layout: { type: "accordion", defaultCollapsed: false, spacedAccordionItems: false },
                  paymentMethodOrder: ["card", "amazon_pay"],
                  wallets: { applePay: "auto", googlePay: "auto" },
                }}
              />
            </div>
            <button
              type="submit"
              disabled={!stripe || loading}
              className={`${styles.btnBasic} mt-8 w-full rounded-full bg-black py-5 text-base font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300`}
            >
              {loading ? "Procesando..." : `Pagar ${total.toFixed(2)} €`}
            </button>
          </div>
        </form>

        <aside className="h-fit border border-[#CDB4DB] lg:sticky lg:top-24 py-10 lg:py-12 px-8 rounded-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-semibold">En tu cesta</h2>
            <Link href="/bag" className="border-b border-[#CDB4DB] font-medium text-gray-500 hover:border-black hover:text-black">
              Editar
            </Link>
          </div>

          <div className="mt-8 space-y-3 border-b border-[#CDB4DB] pb-8 text-lg">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{subtotal.toFixed(2)} €</span>
            </div>
            {promoResult && (
              <div className="flex justify-between text-[#9c5fb5] text-base font-medium">
                <span>Descuento ({promoResult.code})</span>
                <span>−{promoResult.discount.toFixed(2)} €</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Envío</span>
              <span>{shipping.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>{total.toFixed(2)} €</span>
            </div>
          </div>

          {/* Código promocional */}
          <div className="mt-6 border-b border-[#CDB4DB] pb-6">
            <p className="text-sm font-semibold mb-3">¿Tienes un código de descuento?</p>
            {promoResult ? (
              <div className="flex items-start justify-between gap-3 rounded-xl bg-[#f9f4fd] border border-[#C7A0DD] px-4 py-3">
                <div>
                  <p className="text-sm font-bold text-[#7c3aed]">{promoResult.code}</p>
                  {promoResult.description && (
                    <p className="text-xs text-[#9c5fb5] mt-0.5">{promoResult.description}</p>
                  )}
                  <p className="text-xs text-[#9c5fb5] mt-0.5">
                    {promoResult.discountType === "PERCENTAGE"
                      ? `−${promoResult.discountValue}%`
                      : `−${promoResult.discountValue} €`}
                    {" · "}Ahorro: {promoResult.discount.toFixed(2)} €
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleRemovePromo}
                  className="text-[#C7A0DD] hover:text-red-500 transition-colors text-lg leading-none font-bold shrink-0"
                >
                  ×
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => { setPromoCode(e.target.value.toUpperCase()); setPromoError(""); }}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleApplyPromo())}
                  placeholder="CÓDIGO"
                  className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-mono font-bold tracking-widest focus:outline-none focus:border-[#CDB4DB] transition-colors uppercase"
                />
                <button
                  type="button"
                  onClick={handleApplyPromo}
                  disabled={promoLoading || !promoCode.trim()}
                  className="px-4 py-2.5 bg-black text-white text-xs font-bold tracking-widest uppercase rounded-xl hover:bg-black/80 transition-colors disabled:opacity-40 shrink-0"
                >
                  {promoLoading ? "..." : "Aplicar"}
                </button>
              </div>
            )}
            {promoError && (
              <p className="mt-2 text-xs text-red-500 font-medium">{promoError}</p>
            )}
          </div>

          <div className="mt-8">
            <p className="mb-6 font-semibold">Llega el lun, 18 may</p>
            {loadingBag && <p>Cargando cesta...</p>}
            <div className="space-y-8">
              {bag?.items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="relative h-24 w-24 shrink-0 bg-gray-100">
                    <Image
                      src={cloudinaryUrl(item.productImage, { width: 200, height: 250 })}
                      alt={item.productName}
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                  <div>
                    <p className="font-medium">{(item.productPrice * item.quantity).toFixed(2)} €</p>
                    <p>{item.productName}</p>
                    <p className="text-gray-500">Cant.: {item.quantity} | Talla: {item.size}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}