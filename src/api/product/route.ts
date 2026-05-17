import { Product, ProductInput } from "@/api/types/product";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/products`;

type Gender = "MEN" | "WOMEN" | "KIDS" | "UNISEX";
type ProductFilters = { gender?: Gender; brand?: string };

export async function getProducts(filters?: ProductFilters): Promise<Product[]> {
  const params = new URLSearchParams();
  if (filters?.gender) params.append("gender", filters.gender);
  if (filters?.brand) params.append("brand", filters.brand);
  const url = params.toString() ? `${API_URL}?${params.toString()}` : API_URL;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Error obteniendo productos");
  return res.json();
}

export async function getProductById(id: number): Promise<Product> {
  const res = await fetch(`${API_URL}/${id}`);
  if (res.status === 404) throw new Error("PRODUCT_NOT_FOUND");
  if (!res.ok) throw new Error("Error obteniendo producto");
  return res.json();
}

export async function createProduct(product: ProductInput): Promise<Product> {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
  if (res.status === 400) throw new Error("INVALID_PRODUCT");
  if (!res.ok) throw new Error("Error creando producto");
  return res.json();
}

export async function updateProduct(id: number, product: Partial<ProductInput>): Promise<Product> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
  if (res.status === 404) throw new Error("PRODUCT_NOT_FOUND");
  if (!res.ok) throw new Error("Error actualizando producto");
  return res.json();
}

export async function deleteProduct(id: number): Promise<boolean> {
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  if (res.status === 404) throw new Error("PRODUCT_NOT_FOUND");
  if (!res.ok) throw new Error("Error eliminando producto");
  return true;
}

export async function getSizesByProductId(id: number) {
  const product = await getProductById(id);
  return product.sizes ?? [];
}
