const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/orders`;

export type OrderItem = {
  id: number;
  productName: string;
  productImage: string;
  sizeName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
};

export type Order = {
  id: number;
  date: string;
  total: number;
  status: "PENDING" | "SHIPPED" | "IN_TRANSIT" | "DELIVERED";
  deliveryDays: number;
  items: OrderItem[];
  userName?: string;
  userEmail?: string;
  userAddress?: string;
  promoCode?: string;
  promoDescription?: string;
  promoDiscountType?: "PERCENTAGE" | "FIXED";
  promoDiscountValue?: number;
  promoSaving?: number; 
};

export async function getUserOrders(token: string, year?: number): Promise<Order[]> {
  const url = year ? `${API_URL}?year=${year}` : API_URL;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Error obteniendo pedidos");
  return res.json();
}

export async function getOrderDetail(token: string, orderId: number): Promise<Order> {
  const res = await fetch(`${API_URL}/${orderId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Error obteniendo pedido");
  return res.json();
}