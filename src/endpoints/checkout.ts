import {
  AddToCheckoutRequest,
  SetBillingAddressRequest,
  SetCustomerDetailsRequest,
  SetShippingAddressRequest,
  SetShippingMethodRequest,
  UpdateCheckoutItemRequest,
  ResponseDTO,
  CheckoutCompleteResponse,
  CompleteCheckoutRequest,
  ListResponseDTO,
} from "../types/contracts";
import { CheckoutDTO } from "../types/dtos";
import { IApiClient, Mapper } from "../client/base";

export interface AdminCheckoutSearchRequest {
  user_id?: number;
  status?: string;
  page?: number;
  page_size?: number;
}

export class CheckoutEndpoints {
  constructor(private client: IApiClient) {}

  async get<R = ResponseDTO<CheckoutDTO>>(
    mapper?: Mapper<ResponseDTO<CheckoutDTO>, R>
  ): Promise<R> {
    try {
      return this.client.get<Record<string, never>, R>(
        "/api/checkout",
        undefined,
        mapper
      );
    } catch (error) {
      throw error;
    }
  }

  async addItem<R = ResponseDTO<CheckoutDTO>>(
    item: AddToCheckoutRequest,
    mapper?: Mapper<ResponseDTO<CheckoutDTO>, R>
  ): Promise<R> {
    try {
      return this.client.post<
        AddToCheckoutRequest,
        ResponseDTO<CheckoutDTO>,
        R
      >("/api/checkout/items", item, mapper);
    } catch (error) {
      throw error;
    }
  }

  async updateItem<R = ResponseDTO<CheckoutDTO>>(
    sku: string,
    item: UpdateCheckoutItemRequest,
    mapper?: Mapper<ResponseDTO<CheckoutDTO>, R>
  ): Promise<R> {
    try {
      return this.client.put<
        UpdateCheckoutItemRequest,
        ResponseDTO<CheckoutDTO>,
        R
      >(`/api/checkout/items/${sku}`, item, mapper);
    } catch (error) {
      throw error;
    }
  }

  async removeItem<R = ResponseDTO<CheckoutDTO>>(
    sku: string,
    mapper?: Mapper<ResponseDTO<CheckoutDTO>, R>
  ): Promise<R> {
    try {
      return this.client.delete<ResponseDTO<CheckoutDTO>, R>(
        `/api/checkout/items/${sku}`,
        mapper
      );
    } catch (error) {
      throw error;
    }
  }

  async clear<R = ResponseDTO<CheckoutDTO>>(
    mapper?: Mapper<ResponseDTO<CheckoutDTO>, R>
  ): Promise<R> {
    try {
      return this.client.delete<ResponseDTO<CheckoutDTO>, R>(
        "/api/checkout",
        mapper
      );
    } catch (error) {
      throw error;
    }
  }

  async setShippingAddress<R = ResponseDTO<CheckoutDTO>>(
    address: SetShippingAddressRequest,
    mapper?: Mapper<ResponseDTO<CheckoutDTO>, R>
  ): Promise<R> {
    try {
      return this.client.put<
        SetShippingAddressRequest,
        ResponseDTO<CheckoutDTO>,
        R
      >("/api/checkout/shipping-address", address, mapper);
    } catch (error) {
      throw error;
    }
  }

  async setBillingAddress<R = ResponseDTO<CheckoutDTO>>(
    address: SetBillingAddressRequest,
    mapper?: Mapper<ResponseDTO<CheckoutDTO>, R>
  ): Promise<R> {
    try {
      return this.client.put<
        SetBillingAddressRequest,
        ResponseDTO<CheckoutDTO>,
        R
      >("/api/checkout/billing-address", address, mapper);
    } catch (error) {
      throw error;
    }
  }

  async setCustomerDetails<R = ResponseDTO<CheckoutDTO>>(
    customer: SetCustomerDetailsRequest,
    mapper?: Mapper<ResponseDTO<CheckoutDTO>, R>
  ): Promise<R> {
    try {
      return this.client.put<
        SetCustomerDetailsRequest,
        ResponseDTO<CheckoutDTO>,
        R
      >("/api/checkout/customer-details", customer, mapper);
    } catch (error) {
      throw error;
    }
  }

  async setShippingMethod<R = ResponseDTO<CheckoutDTO>>(
    method: SetShippingMethodRequest,
    mapper?: Mapper<ResponseDTO<CheckoutDTO>, R>
  ): Promise<R> {
    try {
      return this.client.put<
        SetShippingMethodRequest,
        ResponseDTO<CheckoutDTO>,
        R
      >("/api/checkout/shipping-method", method, mapper);
    } catch (error) {
      throw error;
    }
  }

  async setCurrency<R = ResponseDTO<CheckoutDTO>>(
    currency: string,
    mapper?: Mapper<ResponseDTO<CheckoutDTO>, R>
  ): Promise<R> {
    try {
      return this.client.put<{ currency: string }, ResponseDTO<CheckoutDTO>, R>(
        "/api/checkout/currency",
        { currency },
        mapper
      );
    } catch (error) {
      throw error;
    }
  }

  async applyDiscount<R = ResponseDTO<CheckoutDTO>>(
    discountCode: string,
    mapper?: Mapper<ResponseDTO<CheckoutDTO>, R>
  ): Promise<R> {
    try {
      return this.client.post<
        { discount_code: string },
        ResponseDTO<CheckoutDTO>,
        R
      >("/api/checkout/discount", { discount_code: discountCode }, mapper);
    } catch (error) {
      throw error;
    }
  }

  async removeDiscount<R = ResponseDTO<CheckoutDTO>>(
    mapper?: Mapper<ResponseDTO<CheckoutDTO>, R>
  ): Promise<R> {
    try {
      return this.client.delete<ResponseDTO<CheckoutDTO>, R>(
        "/api/checkout/discount",
        mapper
      );
    } catch (error) {
      throw error;
    }
  }

  async complete<R = ResponseDTO<CheckoutCompleteResponse>>(
    data: CompleteCheckoutRequest,
    mapper?: Mapper<ResponseDTO<CheckoutCompleteResponse>, R>
  ): Promise<R> {
    try {
      return this.client.post<
        CompleteCheckoutRequest,
        ResponseDTO<CheckoutCompleteResponse>,
        R
      >("/api/checkout/complete", data, mapper);
    } catch (error) {
      throw error;
    }
  }

  // Checkout Management
  async listCheckouts<R = ListResponseDTO<CheckoutDTO>>(
    params?: AdminCheckoutSearchRequest,
    mapper?: Mapper<ListResponseDTO<CheckoutDTO>, R>
  ): Promise<R> {
    try {
      return this.client.get<AdminCheckoutSearchRequest, R>(
        "/api/admin/checkouts",
        params || {},
        mapper
      );
    } catch (error) {
      throw error;
    }
  }

  async getCheckout<R = ResponseDTO<CheckoutDTO>>(
    checkoutId: number,
    mapper?: Mapper<ResponseDTO<CheckoutDTO>, R>
  ): Promise<R> {
    try {
      return this.client.get<Record<string, never>, R>(
        `/api/admin/checkouts/${checkoutId}`,
        undefined,
        mapper
      );
    } catch (error) {
      throw error;
    }
  }

  async deleteCheckout(checkoutId: number): Promise<void> {
    try {
      return this.client.delete<void, void>(
        `/api/admin/checkouts/${checkoutId}`
      );
    } catch (error) {
      throw error;
    }
  }
}
