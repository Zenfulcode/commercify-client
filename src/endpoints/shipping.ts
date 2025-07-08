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
  async calculateOptions<R = ResponseDTO<ShippingOptionDTO[]>>(
    data: CalculateShippingOptionsRequest,
    mapper?: Mapper<ResponseDTO<ShippingOptionDTO[]>, R>
  ): Promise<R> {
    return this.client.post<
      CalculateShippingOptionsRequest,
      ResponseDTO<ShippingOptionDTO[]>,
      R
    >("/api/shipping/options", data, mapper);
  }

  // Admin endpoints
  async createMethod<R = ResponseDTO<ShippingMethodDetailDTO>>(
    data: CreateShippingMethodRequest,
    mapper?: Mapper<ResponseDTO<ShippingMethodDetailDTO>, R>
  ): Promise<R> {
    return this.client.post<
      CreateShippingMethodRequest,
      ResponseDTO<ShippingMethodDetailDTO>,
      R
    >("/api/admin/shipping/methods", data, mapper);
  }

  async createZone<R = ResponseDTO<ShippingZoneDTO>>(
    data: CreateShippingZoneRequest,
    mapper?: Mapper<ResponseDTO<ShippingZoneDTO>, R>
  ): Promise<R> {
    return this.client.post<
      CreateShippingZoneRequest,
      ResponseDTO<ShippingZoneDTO>,
      R
    >("/api/admin/shipping/zones", data, mapper);
  }

  async createRate<R = ResponseDTO<ShippingRateDTO>>(
    data: CreateShippingRateRequest,
    mapper?: Mapper<ResponseDTO<ShippingRateDTO>, R>
  ): Promise<R> {
    return this.client.post<
      CreateShippingRateRequest,
      ResponseDTO<ShippingRateDTO>,
      R
    >("/api/admin/shipping/rates", data, mapper);
  }
}
