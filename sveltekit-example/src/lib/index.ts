// place files you want to import through the `$lib` alias in this folder.

// Re-export application types
export type { Product, ProductVariant, Price } from "./types/product.js";

// Re-export mappers
export {
  mapProductDTOToProduct,
  mapVariantDTOToVariant,
  createPrice,
} from "./mappers/product.js";
