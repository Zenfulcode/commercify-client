import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params, locals }) => {
  const orderId = params.id;

  try {
    const order = await locals.api.orders.get(orderId);

    return {
      order,
      success: true,
    };
  } catch (error) {
    console.error("Failed to load order:", error);
    return {
      order: null,
      success: false,
      error: "Order not found",
    };
  }
};
