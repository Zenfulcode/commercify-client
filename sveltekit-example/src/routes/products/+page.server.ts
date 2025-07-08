import type { PageServerLoad, Actions } from "./$types";
import { fail } from "@sveltejs/kit";
import type { AddToCheckoutRequest } from "commercify-api-client";
import type { Product } from "$lib/types/product.js";

export const load: PageServerLoad = async ({ locals }) => {
  try {
    // Use the API client to fetch products with mapping to application types
    const productsResponse = await locals.api.products.search({});

    console.log("Fetched products:", productsResponse);

    return {
      products: productsResponse.data as Product[],
      success: true,
    };
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return {
      products: [] as Product[],
      success: false,
      error: "Failed to load products",
    };
  }
};

export const actions: Actions = {
  addToCart: async ({ request, locals }) => {
    const data = await request.formData();
    const sku = data.get("sku") as string;
    const quantity = parseInt(data.get("quantity") as string) || 1;

    if (!sku) {
      return fail(400, { error: "Product SKU is required" });
    }

    try {
      const addItemRequest: AddToCheckoutRequest = {
        sku,
        quantity,
        currency: "USD",
      };

      await locals.api.checkout.addItem(addItemRequest);
      return { success: true, message: "Item added to cart successfully!" };
    } catch (error) {
      console.error("Failed to add item to cart:", error);
      return fail(500, { error: "Failed to add item to cart" });
    }
  },
};
