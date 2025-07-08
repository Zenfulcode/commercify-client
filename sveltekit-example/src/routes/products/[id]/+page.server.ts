import { error } from "@sveltejs/kit";
import type { Product } from "$lib/types/product.js";

export const load = async ({ params, locals }: any) => {
  const productId = parseInt(params.id);

  if (isNaN(productId)) {
    throw error(400, "Invalid product ID");
  }

  try {
    // Use the API client to fetch a single product with mapping to application types
    const product: Product = await locals.api.products.get(productId);

    return {
      product,
      success: true,
    };
  } catch (err) {
    console.error("Failed to fetch product:", err);
    throw error(404, "Product not found");
  }
};
