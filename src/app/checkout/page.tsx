"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { createPaymentIntent } from "@/api/payment/route";
import PaymentForm from "@/components/PaymentForm";

//Carga la clave publica de stripe desde el .env
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function CheckoutPage() {
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    async function loadPaymentIntent() {
      const bagId = Cookies.get("bagId");

      if (!bagId) return;
      const data = await createPaymentIntent(bagId);
      setClientSecret(data.clientSecret);
    }

    loadPaymentIntent();
  }, []);

  if (!clientSecret) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="p-10">Cargando pago...</p>
      </div>
    );
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: "flat",
          variables: {
            colorPrimary: "#111111",
            colorBackground: "#ffffff",
            colorText: "#111111",
            colorTextSecondary: "#6b7280",
            colorDanger: "#dc2626",
            fontFamily: "Arial, sans-serif",
            fontSizeBase: "16px",
            spacingUnit: "5px",
            borderRadius: "14px",
          },
          rules: {
            ".Input": {
              border: "1px solid #e5e7eb",
              boxShadow: "none",
              padding: "14px",
            },
            ".Input:focus": {
              border: "1px solid #C7A0DD",
              boxShadow: "none",
            },
            ".Label": {
              color: "#111111",
              fontWeight: "500",
              marginBottom: "8px",
            },
            ".Block": {
              borderColor: "#C7A0DD",
              boxShadow: "none",
            },
            ".AccordionItem": {
              border: "none",
              borderBottom: "1px solid #C7A0DD",
              borderRadius: "0px",
              boxShadow: "none",
            },
            ".AccordionItem:first-child": {
              borderTop: "1px solid #C7A0DD",
            },
            ".AccordionItem--selected": {
              border: "none",
              borderBottom: "1px solid #C7A0DD",
              borderRadius: "0px",
              boxShadow: "none",
            },
            ".Error": {
              color: "#dc2626",
              fontSize: "14px",
            },
          }
        }
      }}
    >
      <PaymentForm />
    </Elements>
  );
}