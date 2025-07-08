import { OrderDTO, OrderSummaryDTO } from "../types/dtos";
import { IApiClient, Mapper } from "../client/base";
import { ListResponseDTO, ResponseDTO } from "../types/contracts";

export interface OrderListRequest {
  page?: number;
  pageSize?: number;
}

export class OrderEndpoints {
  constructor(private client: IApiClient) {}

  async list<R = ListResponseDTO<OrderSummaryDTO>>(
    params: OrderListRequest,
    mapper?: Mapper<ListResponseDTO<OrderSummaryDTO>, R>
  ): Promise<R> {
    return this.client.get<OrderListRequest, R>("/api/orders", params, mapper);
  }

  async get<R = ResponseDTO<OrderDTO>>(
    orderId: string,
    mapper?: Mapper<ResponseDTO<OrderDTO>, R>
  ): Promise<R> {
    return this.client.get<Record<string, never>, R>(
      `/api/orders/${orderId}`,
      undefined,
      mapper
    );
  }
}
