import {
  AddToCheckoutRequest,
  SetBillingAddressRequest,
  SetCustomerDetailsRequest,
  SetShippingAddressRequest,
  SetShippingMethodRequest,
  UpdateCheckoutItemRequest,
} from "../types/contracts";
import { CheckoutDTO } from "../types/dtos";
import { IApiClient } from "../client/base";

export class CheckoutEndpoints {
  constructor(private client: IApiClient) {}

  async get(): Promise<CheckoutDTO> {
    return this.client.get<Record<string, never>, CheckoutDTO>("/api/checkout");
  }

  async addItem(item: AddToCheckoutRequest): Promise<CheckoutDTO> {
    return this.client.post<AddToCheckoutRequest, CheckoutDTO, CheckoutDTO>(
      "/api/checkout/items",
      item
    );
  }

  async updateItem(
    sku: string,
    item: UpdateCheckoutItemRequest
  ): Promise<CheckoutDTO> {
    return this.client.put<UpdateCheckoutItemRequest, CheckoutDTO, CheckoutDTO>(
      `/api/checkout/items/${sku}`,
      item
    );
  }

  async removeItem(sku: string): Promise<CheckoutDTO> {
    return this.client.delete<CheckoutDTO, CheckoutDTO>(
      `/api/checkout/items/${sku}`
    );
  }

  async clear(): Promise<CheckoutDTO> {
    return this.client.delete<CheckoutDTO, CheckoutDTO>("/api/checkout");
  }

  async setShippingAddress(
    address: SetShippingAddressRequest
  ): Promise<CheckoutDTO> {
    return this.client.put<SetShippingAddressRequest, CheckoutDTO, CheckoutDTO>(
      "/api/checkout/shipping-address",
      address
    );
  }

  async setBillingAddress(
    address: SetBillingAddressRequest
  ): Promise<CheckoutDTO> {
    return this.client.put<SetBillingAddressRequest, CheckoutDTO, CheckoutDTO>(
      "/api/checkout/billing-address",
      address
    );
  }

  async setCustomerDetails(
    customer: SetCustomerDetailsRequest
  ): Promise<CheckoutDTO> {
    return this.client.put<SetCustomerDetailsRequest, CheckoutDTO, CheckoutDTO>(
      "/api/checkout/customer-details",
      customer
    );
  }

  async setShippingMethod(
    method: SetShippingMethodRequest
  ): Promise<CheckoutDTO> {
    return this.client.put<SetShippingMethodRequest, CheckoutDTO, CheckoutDTO>(
      "/api/checkout/shipping-method",
      method
    );
  }

  async setCurrency(currency: string): Promise<CheckoutDTO> {
    return this.client.put<{ currency: string }, CheckoutDTO, CheckoutDTO>(
      "/api/checkout/currency",
      { currency }
    );
  }

  async applyDiscount(discountCode: string): Promise<CheckoutDTO> {
    return this.client.post<
      { discount_code: string },
      CheckoutDTO,
      CheckoutDTO
    >("/api/checkout/discount", { discount_code: discountCode });
  }

  async removeDiscount(): Promise<CheckoutDTO> {
    return this.client.delete<CheckoutDTO, CheckoutDTO>(
      "/api/checkout/discount"
    );
  }

  async complete(provider: string, paymentData: any): Promise<any> {
    return this.client.post<
      { payment_provider: string; payment_data: any },
      any,
      any
    >("/api/checkout/complete", {
      payment_provider: provider,
      payment_data: paymentData,
    });
  }
}
