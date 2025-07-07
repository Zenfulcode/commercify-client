import type { PageServerLoad, Actions } from "./$types";
import { fail, redirect } from "@sveltejs/kit";
import type {
  AddToCheckoutRequest,
  SetCustomerDetailsRequest,
  SetShippingAddressRequest,
  SetBillingAddressRequest,
  SetShippingMethodRequest,
} from "commercify-api-client";

export const load: PageServerLoad = async ({ locals }) => {
  try {
    // Get current checkout
    const checkout = await locals.api.checkout.get();

    return {
      checkout: checkout.data,
      shippingOptions: [],
    };
  } catch (error) {
    console.error("Failed to load checkout:", error);
    return {
      checkout: null,
      shippingOptions: [],
    };
  }
};

export const actions: Actions = {
  addItem: async ({ request, locals }) => {
    const data = await request.formData();
    const sku = data.get("sku") as string;
    const quantity = parseInt(data.get("quantity") as string) || 1;

    if (!sku) {
      return fail(400, { error: "SKU is required" });
    }

    try {
      const addItemRequest: AddToCheckoutRequest = {
        sku,
        quantity,
        currency: "USD",
      };

      await locals.api.checkout.addItem(addItemRequest);
      return { success: true };
    } catch (error) {
      console.error("Failed to add item:", error);
      return fail(500, { error: "Failed to add item to checkout" });
    }
  },

  updateItem: async ({ request, locals }) => {
    const data = await request.formData();
    const sku = data.get("sku") as string;
    const quantity = parseInt(data.get("quantity") as string);

    if (!sku || quantity < 0) {
      return fail(400, { error: "Invalid item data" });
    }

    try {
      if (quantity === 0) {
        await locals.api.checkout.removeItem(sku);
      } else {
        await locals.api.checkout.updateItem(sku, { quantity });
      }
      return { success: true };
    } catch (error) {
      console.error("Failed to update item:", error);
      return fail(500, { error: "Failed to update item" });
    }
  },

  setCustomerDetails: async ({ request, locals }) => {
    const data = await request.formData();
    const email = data.get("email") as string;
    const phone = data.get("phone") as string;
    const full_name = data.get("full_name") as string;

    if (!email || !phone || !full_name) {
      return fail(400, { error: "All customer details are required" });
    }

    try {
      const customerRequest: SetCustomerDetailsRequest = {
        email,
        phone,
        full_name,
      };

      await locals.api.checkout.setCustomerDetails(customerRequest);
      return { success: true };
    } catch (error) {
      console.error("Failed to set customer details:", error);
      return fail(500, { error: "Failed to set customer details" });
    }
  },

  setShippingAddress: async ({ request, locals }) => {
    const data = await request.formData();
    const address_line1 = data.get("address_line1") as string;
    const address_line2 = (data.get("address_line2") as string) || "";
    const city = data.get("city") as string;
    const state = data.get("state") as string;
    const postal_code = data.get("postal_code") as string;
    const country = data.get("country") as string;

    if (!address_line1 || !city || !state || !postal_code || !country) {
      return fail(400, { error: "All required address fields must be filled" });
    }

    try {
      const addressRequest: SetShippingAddressRequest = {
        address_line1,
        address_line2,
        city,
        state,
        postal_code,
        country,
      };

      await locals.api.checkout.setShippingAddress(addressRequest);
      return { success: true };
    } catch (error) {
      console.error("Failed to set shipping address:", error);
      return fail(500, { error: "Failed to set shipping address" });
    }
  },

  setBillingAddress: async ({ request, locals }) => {
    const data = await request.formData();
    const useShippingAddress = data.get("use_shipping_address") === "on";

    if (useShippingAddress) {
      try {
        const checkout = await locals.api.checkout.get();
        if (checkout.shipping_address) {
          const billingRequest: SetBillingAddressRequest = {
            address_line1: checkout.shipping_address.address_line1,
            address_line2: checkout.shipping_address.address_line2,
            city: checkout.shipping_address.city,
            state: checkout.shipping_address.state,
            postal_code: checkout.shipping_address.postal_code,
            country: checkout.shipping_address.country,
          };
          await locals.api.checkout.setBillingAddress(billingRequest);
        }
      } catch (error) {
        console.error("Failed to copy shipping to billing address:", error);
        return fail(500, { error: "Failed to set billing address" });
      }
    } else {
      const address_line1 = data.get("billing_address_line1") as string;
      const address_line2 = (data.get("billing_address_line2") as string) || "";
      const city = data.get("billing_city") as string;
      const state = data.get("billing_state") as string;
      const postal_code = data.get("billing_postal_code") as string;
      const country = data.get("billing_country") as string;

      if (!address_line1 || !city || !state || !postal_code || !country) {
        return fail(400, {
          error: "All required billing address fields must be filled",
        });
      }

      try {
        const billingRequest: SetBillingAddressRequest = {
          address_line1,
          address_line2,
          city,
          state,
          postal_code,
          country,
        };

        await locals.api.checkout.setBillingAddress(billingRequest);
      } catch (error) {
        console.error("Failed to set billing address:", error);
        return fail(500, { error: "Failed to set billing address" });
      }
    }

    return { success: true };
  },

  setShippingMethod: async ({ request, locals }) => {
    const data = await request.formData();
    const shipping_method_id = parseInt(
      data.get("shipping_method_id") as string
    );

    if (!shipping_method_id) {
      return fail(400, { error: "Shipping method is required" });
    }

    try {
      const shippingRequest: SetShippingMethodRequest = {
        shipping_method_id,
      };

      await locals.api.checkout.setShippingMethod(shippingRequest);
      return { success: true };
    } catch (error) {
      console.error("Failed to set shipping method:", error);
      return fail(500, { error: "Failed to set shipping method" });
    }
  },

  applyDiscount: async ({ request, locals }) => {
    const data = await request.formData();
    const discount_code = data.get("discount_code") as string;

    if (!discount_code) {
      return fail(400, { error: "Discount code is required" });
    }

    try {
      await locals.api.checkout.applyDiscount(discount_code);
      return { success: true, message: "Discount applied successfully" };
    } catch (error) {
      console.error("Failed to apply discount:", error);
      return fail(400, { error: "Invalid discount code" });
    }
  },

  removeDiscount: async ({ locals }) => {
    try {
      await locals.api.checkout.removeDiscount();
      return { success: true };
    } catch (error) {
      console.error("Failed to remove discount:", error);
      return fail(500, { error: "Failed to remove discount" });
    }
  },

  completeCheckout: async ({ request, locals }) => {
    const data = await request.formData();
    const payment_provider = data.get("payment_provider") as string;

    if (!payment_provider) {
      return fail(400, { error: "Payment provider is required" });
    }

    try {
      const payment_data = {
        card_number: data.get("card_number") as string,
        expiry_month: parseInt(data.get("expiry_month") as string),
        expiry_year: parseInt(data.get("expiry_year") as string),
        cvv: data.get("cvv") as string,
        cardholder_name: data.get("cardholder_name") as string,
      };

      const result = await locals.api.checkout.complete(
        payment_provider,
        payment_data
      );

      throw redirect(303, `/orders/${result.order_id}`);
    } catch (error) {
      if (error instanceof Response) {
        throw error;
      }
      console.error("Failed to complete checkout:", error);
      return fail(500, { error: "Failed to complete checkout" });
    }
  },
};
