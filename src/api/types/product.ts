export type Gender = "MEN" | "WOMEN" | "KIDS" | "UNISEX";

export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  brand: string;
  gender: Gender;
  images: string[];
  sizes: ProductSize[];
};

export type ProductSize = {
  sizeId: number;
  size: string;
  stock: number;
};

export type ProductInput = {
  name: string;
  description: string;
  price: number;
  category: string;
  brand: string;
  gender: Gender;
  images: string[];
  sizes: ProductSize[];
};