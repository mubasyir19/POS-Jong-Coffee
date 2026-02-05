import { Unit } from "./unit";

// Variant Product - dapat digunakan untuk create dan fetch
export interface ProductVariant {
  id?: string;
  name: string;
  unitId: string;
  priceOnline: number;
  priceOffline: number;
  productId: string;
  stock: number;
  sku: string;
  unit?: Unit;
  product?: ProductCoffee;
}

export interface InputVariant {
  name: string;
  unitId: string;
  productId: string;
  priceOnline: number;
  priceOffline: number;
  stock: number;
  sku: string;
}

// Product untuk Create/Add (tanpa id)
export interface AddProduct {
  name: string;
  categoryId: string;
  imageUrl?: File | string | null;
  variants: ProductVariant[];
}

// Product untuk Fetch/Edit (dengan id)
export interface ProductCoffee {
  id: string;
  categoryId: string;
  name: string;
  imageUrl?: File | string | null;
  createdAt?: string;
  updatedAt?: string;
  productVariants: ProductVariant[];
  variants?: ProductVariant[]; // alias untuk compatibility
}
