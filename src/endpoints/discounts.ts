import { DiscountDTO } from "../types/dtos";
import { IApiClient, Mapper } from "../client/base";
import {
  CreateDiscountRequest,
  UpdateDiscountRequest,
  ValidateDiscountRequest,
  ValidateDiscountResponse,
  ListResponseDTO,
  ResponseDTO,
} from "../types/contracts";

export class DiscountEndpoints {
  constructor(private client: IApiClient) {}

  // Public endpoints
  async validate<R = ValidateDiscountResponse>(
    data: ValidateDiscountRequest,
    mapper?: Mapper<ValidateDiscountResponse, R>
  ): Promise<R> {
    return this.client.post<
      ValidateDiscountRequest,
      ValidateDiscountResponse,
      R
    >("/api/discounts/validate", data, mapper);
  }

  // Admin endpoints
  async create<R = ResponseDTO<DiscountDTO>>(
    data: CreateDiscountRequest,
    mapper?: Mapper<ResponseDTO<DiscountDTO>, R>
  ): Promise<R> {
    return this.client.post<CreateDiscountRequest, ResponseDTO<DiscountDTO>, R>(
      "/api/admin/discounts",
      data,
      mapper
    );
  }

  async get<R = ResponseDTO<DiscountDTO>>(
    discountId: number,
    mapper?: Mapper<ResponseDTO<DiscountDTO>, R>
  ): Promise<R> {
    return this.client.get<Record<string, never>, R>(
      `/api/admin/discounts/${discountId}`,
      undefined,
      mapper
    );
  }

  async update<R = ResponseDTO<DiscountDTO>>(
    discountId: number,
    data: UpdateDiscountRequest,
    mapper?: Mapper<ResponseDTO<DiscountDTO>, R>
  ): Promise<R> {
    return this.client.put<UpdateDiscountRequest, ResponseDTO<DiscountDTO>, R>(
      `/api/admin/discounts/${discountId}`,
      data,
      mapper
    );
  }

  async delete(discountId: number): Promise<void> {
    return this.client.delete<void, void>(`/api/admin/discounts/${discountId}`);
  }

  async list<R = ListResponseDTO<DiscountDTO>>(
    mapper?: Mapper<ListResponseDTO<DiscountDTO>, R>
  ): Promise<R> {
    return this.client.get<Record<string, never>, R>(
      "/api/admin/discounts",
      undefined,
      mapper
    );
  }

  async listActive<R = ListResponseDTO<DiscountDTO>>(
    mapper?: Mapper<ListResponseDTO<DiscountDTO>, R>
  ): Promise<R> {
    return this.client.get<Record<string, never>, R>(
      "/api/admin/discounts/active",
      undefined,
      mapper
    );
  }

  async applyToOrder(orderId: string): Promise<void> {
    return this.client.post<Record<string, never>, void, void>(
      `/api/admin/discounts/apply/${orderId}`,
      {}
    );
  }

  async removeFromOrder(orderId: string): Promise<void> {
    return this.client.delete<void, void>(
      `/api/admin/discounts/remove/${orderId}`
    );
  }
}
