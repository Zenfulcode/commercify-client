/**
 * Mappers to transform API DTOs to application domain types
 */

import type { ProductDTO, VariantDTO } from "commercify-api-client";
import type { Product, ProductVariant, Price } from "../types/product.js";

/**
 * Creates a Price object from amount and currency
 */
export function createPrice(amount: number, currency: string): Price {
  return {
    amount,
    currency,
    formatted: formatPrice(amount, currency),
  };
}

/**
 * Formats a price for display
 */
function formatPrice(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: 2,
  }).format(amount);
}

/**
 * Maps a VariantDTO to a ProductVariant
 */
export function mapVariantDTOToVariant(variantDTO: VariantDTO): ProductVariant {
  return {
    id: variantDTO.id,
    sku: variantDTO.sku,
    price: createPrice(variantDTO.price, variantDTO.currency),
    stock: variantDTO.stock,
    weight: variantDTO.weight || undefined,
    attributes: variantDTO.attributes || {},
    images: variantDTO.images || [],
    isDefault: variantDTO.is_default,
  };
}

/**
 * Maps a ProductDTO to a Product
 */
export function mapProductDTOToProduct(productDTO: ProductDTO): Product {
  // Map variants if they exist
  const variants = productDTO.variants
    ? productDTO.variants.map(mapVariantDTOToVariant)
    : [];

  // For weight, use the default variant's weight if available, otherwise undefined
  const defaultVariant = variants.find((v) => v.isDefault);
  const weight = defaultVariant?.weight;

  return {
    id: productDTO.id,
    name: productDTO.name,
    description: productDTO.description,
    sku: productDTO.sku,
    price: createPrice(productDTO.price, productDTO.currency),
    stock: productDTO.total_stock,
    weight,
    categoryId: productDTO.category_id?.toString() || null,
    images: productDTO.images || [],
    hasVariants: productDTO.has_variants,
    variants,
    isActive: productDTO.active,
    createdAt: productDTO.created_at || null,
    updatedAt: productDTO.updated_at || null,
  };
}

/**
 * Maps a ListResponseDTO<ProductDTO> to a ListResponseDTO<Product>
 */
export function mapProductListResponse(response: any): any {
  return {
    ...response,
    data: response.data.map(mapProductDTOToProduct),
  };
}
