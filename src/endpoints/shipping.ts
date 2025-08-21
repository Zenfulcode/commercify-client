import {
  ShippingOptionDTO,
  ShippingMethodDetailDTO,
  ShippingZoneDTO,
  ShippingRateDTO,
} from "../types/dtos";
import { IApiClient, Mapper } from "../client/base";
import {
  CalculateShippingOptionsRequest,
  CreateShippingMethodRequest,
  CreateShippingZoneRequest,
  CreateShippingRateRequest,
  ResponseDTO,
  ListResponseDTO,
} from "../types/contracts";

export class ShippingEndpoints {
  constructor(private client: IApiClient) {}

  // Public endpoints
  async calculateOptions<R = ListResponseDTO<ShippingOptionDTO>>(
    data: CalculateShippingOptionsRequest,
    mapper?: Mapper<ListResponseDTO<ShippingOptionDTO>, R>
  ): Promise<R> {
    try {
      return this.client.post<
        CalculateShippingOptionsRequest,
        ListResponseDTO<ShippingOptionDTO>,
        R
      >("/api/shipping/options", data, mapper);
    } catch (error) {
      throw error;
    }
  }

  // Admin endpoints
  async createMethod<R = ResponseDTO<ShippingMethodDetailDTO>>(
    data: CreateShippingMethodRequest,
    mapper?: Mapper<ResponseDTO<ShippingMethodDetailDTO>, R>
  ): Promise<R> {
    try {
      return this.client.post<
        CreateShippingMethodRequest,
        ResponseDTO<ShippingMethodDetailDTO>,
        R
      >("/api/admin/shipping/methods", data, mapper);
    } catch (error) {
      throw error;
    }
  }

  async createZone<R = ResponseDTO<ShippingZoneDTO>>(
    data: CreateShippingZoneRequest,
    mapper?: Mapper<ResponseDTO<ShippingZoneDTO>, R>
  ): Promise<R> {
    try {
      return this.client.post<
        CreateShippingZoneRequest,
        ResponseDTO<ShippingZoneDTO>,
        R
      >("/api/admin/shipping/zones", data, mapper);
    } catch (error) {
      throw error;
    }
  }

  async createRate<R = ResponseDTO<ShippingRateDTO>>(
    data: CreateShippingRateRequest,
    mapper?: Mapper<ResponseDTO<ShippingRateDTO>, R>
  ): Promise<R> {
    try {
      return this.client.post<
        CreateShippingRateRequest,
        ResponseDTO<ShippingRateDTO>,
        R
      >("/api/admin/shipping/rates", data, mapper);
    } catch (error) {
      throw error;
    }
  }
}
