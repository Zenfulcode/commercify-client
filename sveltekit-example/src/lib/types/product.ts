/**
 * Application-specific types for products
 * These types represent the domain model used throughout the application
 */

export interface Price {
  amount: number;
  currency: string;
  formatted: string;
}

export interface ProductVariant {
  id: number;
  sku: string;
  price: Price;
  stock: number;
  weight?: number;
  attributes: { [key: string]: string };
  images: string[];
  isDefault: boolean;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  sku: string;
  price: Price;
  stock: number;
  weight?: number;
  categoryId: string | null;
  images: string[];
  hasVariants: boolean;
  variants: ProductVariant[];
  isActive: boolean;
  createdAt: string | null;
  updatedAt: string | null;
}
