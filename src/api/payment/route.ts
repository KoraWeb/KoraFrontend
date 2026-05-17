const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/checkout`;

export async function createPaymentIntent(bagId: string) {
  const res = await fetch(`${API_URL}/create-payment-intent/${bagId}`, {
    method: "POST",
  });

  if (!res.ok) {
    throw new Error("Error creating payment intent");
  }

  return res.json();
}
