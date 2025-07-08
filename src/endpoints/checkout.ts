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

export class CheckoutEndpoints {
  constructor(private client: IApiClient) {}

  async get<R = ResponseDTO<CheckoutDTO>>(
    mapper?: Mapper<ResponseDTO<CheckoutDTO>, R>
  ): Promise<R> {
    return this.client.get<Record<string, never>, R>(
      "/api/checkout",
      undefined,
      mapper
    );
  }

  async addItem<R = ResponseDTO<CheckoutDTO>>(
    item: AddToCheckoutRequest,
    mapper?: Mapper<ResponseDTO<CheckoutDTO>, R>
  ): Promise<R> {
    return this.client.post<AddToCheckoutRequest, ResponseDTO<CheckoutDTO>, R>(
      "/api/checkout/items",
      item,
      mapper
    );
  }

  async updateItem<R = ResponseDTO<CheckoutDTO>>(
    sku: string,
    item: UpdateCheckoutItemRequest,
    mapper?: Mapper<ResponseDTO<CheckoutDTO>, R>
  ): Promise<R> {
    return this.client.put<
      UpdateCheckoutItemRequest,
      ResponseDTO<CheckoutDTO>,
      R
    >(`/api/checkout/items/${sku}`, item, mapper);
  }

  async removeItem<R = ResponseDTO<CheckoutDTO>>(
    sku: string,
    mapper?: Mapper<ResponseDTO<CheckoutDTO>, R>
  ): Promise<R> {
    return this.client.delete<ResponseDTO<CheckoutDTO>, R>(
      `/api/checkout/items/${sku}`,
      mapper
    );
  }

  async clear<R = ResponseDTO<CheckoutDTO>>(
    mapper?: Mapper<ResponseDTO<CheckoutDTO>, R>
  ): Promise<R> {
    return this.client.delete<ResponseDTO<CheckoutDTO>, R>(
      "/api/checkout",
      mapper
    );
  }

  async setShippingAddress<R = ResponseDTO<CheckoutDTO>>(
    address: SetShippingAddressRequest,
    mapper?: Mapper<ResponseDTO<CheckoutDTO>, R>
  ): Promise<R> {
    return this.client.put<
      SetShippingAddressRequest,
      ResponseDTO<CheckoutDTO>,
      R
    >("/api/checkout/shipping-address", address, mapper);
  }

  async setBillingAddress<R = ResponseDTO<CheckoutDTO>>(
    address: SetBillingAddressRequest,
    mapper?: Mapper<ResponseDTO<CheckoutDTO>, R>
  ): Promise<R> {
    return this.client.put<
      SetBillingAddressRequest,
      ResponseDTO<CheckoutDTO>,
      R
    >("/api/checkout/billing-address", address, mapper);
  }

  async setCustomerDetails<R = ResponseDTO<CheckoutDTO>>(
    customer: SetCustomerDetailsRequest,
    mapper?: Mapper<ResponseDTO<CheckoutDTO>, R>
  ): Promise<R> {
    return this.client.put<
      SetCustomerDetailsRequest,
      ResponseDTO<CheckoutDTO>,
      R
    >("/api/checkout/customer-details", customer, mapper);
  }

  async setShippingMethod<R = ResponseDTO<CheckoutDTO>>(
    method: SetShippingMethodRequest,
    mapper?: Mapper<ResponseDTO<CheckoutDTO>, R>
  ): Promise<R> {
    return this.client.put<
      SetShippingMethodRequest,
      ResponseDTO<CheckoutDTO>,
      R
    >("/api/checkout/shipping-method", method, mapper);
  }

  async setCurrency<R = ResponseDTO<CheckoutDTO>>(
    currency: string,
    mapper?: Mapper<ResponseDTO<CheckoutDTO>, R>
  ): Promise<R> {
    return this.client.put<{ currency: string }, ResponseDTO<CheckoutDTO>, R>(
      "/api/checkout/currency",
      { currency },
      mapper
    );
  }

  async applyDiscount<R = ResponseDTO<CheckoutDTO>>(
    discountCode: string,
    mapper?: Mapper<ResponseDTO<CheckoutDTO>, R>
  ): Promise<R> {
    return this.client.post<
      { discount_code: string },
      ResponseDTO<CheckoutDTO>,
      R
    >("/api/checkout/discount", { discount_code: discountCode }, mapper);
  }

  async removeDiscount<R = ResponseDTO<CheckoutDTO>>(
    mapper?: Mapper<ResponseDTO<CheckoutDTO>, R>
  ): Promise<R> {
    return this.client.delete<ResponseDTO<CheckoutDTO>, R>(
      "/api/checkout/discount",
      mapper
    );
  }

  async complete<R = ResponseDTO<CheckoutCompleteResponse>>(
    data: CompleteCheckoutRequest,
    mapper?: Mapper<ResponseDTO<CheckoutCompleteResponse>, R>
  ): Promise<R> {
    return this.client.post<
      CompleteCheckoutRequest,
      ResponseDTO<CheckoutCompleteResponse>,
      R
    >("/api/checkout/complete", data, mapper);
  }
}
