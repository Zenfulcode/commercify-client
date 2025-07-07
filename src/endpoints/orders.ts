import { OrderDTO, OrderSummaryDTO } from "../types/dtos";
import { IApiClient } from "../client/base";
import { ListResponseDTO } from "../types/contracts";

export interface OrderListRequest {
  page?: number;
  pageSize?: number;
}

export class OrderEndpoints {
  constructor(private client: IApiClient) {}

  async list(
    params: OrderListRequest
  ): Promise<ListResponseDTO<OrderSummaryDTO>> {
    return this.client.get<OrderListRequest, ListResponseDTO<OrderSummaryDTO>>(
      "/api/orders",
      params
    );
  }

  async get(orderId: string): Promise<OrderDTO> {
    return this.client.get<Record<string, never>, OrderDTO>(
      `/api/orders/${orderId}`
    );
  }
}
