import { OrderDTO, OrderStatus, OrderSummaryDTO } from "../types/dtos";
import { IApiClient, Mapper } from "../client/base";
import { ListResponseDTO, ResponseDTO } from "../types/contracts";

export interface OrderListRequest {
  page?: number;
  pageSize?: number;
}

export interface UpdateOrderStatusRequest {
  status: OrderStatus;
}

export interface AdminOrderListRequest {
  page?: number;
  page_size?: number;
  status?: string;
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

  // Order Management
  async listOrders<R = ListResponseDTO<OrderSummaryDTO>>(
    params?: AdminOrderListRequest,
    mapper?: Mapper<ListResponseDTO<OrderSummaryDTO>, R>
  ): Promise<R> {
    return this.client.get<AdminOrderListRequest, R>(
      "/api/admin/orders",
      params || {},
      mapper
    );
  }

  async updateOrderStatus<R = ResponseDTO<OrderDTO>>(
    orderId: string,
    data: UpdateOrderStatusRequest,
    mapper?: Mapper<ResponseDTO<OrderDTO>, R>
  ): Promise<R> {
    return this.client.put<UpdateOrderStatusRequest, ResponseDTO<OrderDTO>, R>(
      `/api/admin/orders/${orderId}/status`,
      data,
      mapper
    );
  }
}
