export type BagItem = {
  id: number;
  quantity: number;
  productId: number;
  productName: string;
  productPrice: number;
  productImage: string;
  sizeId: number;
  size: string;
};
export type BagStatus = "ACTIVE" | "PAID" | "EXPIRED";

export type BagType = {
  id: string;
  status: BagStatus;
  items: BagItem[];
};

export type AddBagItemRequest = {
  productId: number;
  sizeId: number;
  quantity: number;
};
