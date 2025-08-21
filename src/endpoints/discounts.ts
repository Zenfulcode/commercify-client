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
    try {
      return this.client.post<
        ValidateDiscountRequest,
        ValidateDiscountResponse,
        R
      >("/api/discounts/validate", data, mapper);
    } catch (error) {
      throw error;
    }
  }

  // Admin endpoints
  async create<R = ResponseDTO<DiscountDTO>>(
    data: CreateDiscountRequest,
    mapper?: Mapper<ResponseDTO<DiscountDTO>, R>
  ): Promise<R> {
    try {
      return this.client.post<
        CreateDiscountRequest,
        ResponseDTO<DiscountDTO>,
        R
      >("/api/admin/discounts", data, mapper);
    } catch (error) {
      throw error;
    }
  }

  async get<R = ResponseDTO<DiscountDTO>>(
    discountId: number,
    mapper?: Mapper<ResponseDTO<DiscountDTO>, R>
  ): Promise<R> {
    try {
      return this.client.get<Record<string, never>, R>(
        `/api/admin/discounts/${discountId}`,
        undefined,
        mapper
      );
    } catch (error) {
      throw error;
    }
  }

  async update<R = ResponseDTO<DiscountDTO>>(
    discountId: number,
    data: UpdateDiscountRequest,
    mapper?: Mapper<ResponseDTO<DiscountDTO>, R>
  ): Promise<R> {
    try {
      return this.client.put<
        UpdateDiscountRequest,
        ResponseDTO<DiscountDTO>,
        R
      >(`/api/admin/discounts/${discountId}`, data, mapper);
    } catch (error) {
      throw error;
    }
  }

  async delete(discountId: number): Promise<void> {
    try {
      return this.client.delete<void, void>(
        `/api/admin/discounts/${discountId}`
      );
    } catch (error) {
      throw error;
    }
  }

  async list<R = ListResponseDTO<DiscountDTO>>(
    mapper?: Mapper<ListResponseDTO<DiscountDTO>, R>
  ): Promise<R> {
    try {
      return this.client.get<Record<string, never>, R>(
        "/api/admin/discounts",
        undefined,
        mapper
      );
    } catch (error) {
      throw error;
    }
  }

  async listActive<R = ListResponseDTO<DiscountDTO>>(
    mapper?: Mapper<ListResponseDTO<DiscountDTO>, R>
  ): Promise<R> {
    try {
      return this.client.get<Record<string, never>, R>(
        "/api/admin/discounts/active",
        undefined,
        mapper
      );
    } catch (error) {
      throw error;
    }
  }

  async applyToOrder(orderId: string): Promise<void> {
    try {
      return this.client.post<Record<string, never>, void, void>(
        `/api/admin/discounts/apply/${orderId}`,
        {}
      );
    } catch (error) {
      throw error;
    }
  }

  async removeFromOrder(orderId: string): Promise<void> {
    try {
      return this.client.delete<void, void>(
        `/api/admin/discounts/remove/${orderId}`
      );
    } catch (error) {
      throw error;
    }
  }
}
