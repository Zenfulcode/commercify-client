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

export interface AdminOrderListRequest extends OrderListRequest {
  status?: string;
}

export interface OrderParameters {
  includePaymentTransactions?: boolean;
  includeItems?: boolean;
}

export class OrderEndpoints {
  constructor(private client: IApiClient) {}

  async list<R = ListResponseDTO<OrderSummaryDTO>>(
    params: OrderListRequest,
    mapper?: Mapper<ListResponseDTO<OrderSummaryDTO>, R>
  ): Promise<R> {
    try {
      return this.client.get<OrderListRequest, R>("/api/orders", params, mapper);
    } catch (error) {
      throw error;
    }
  }

  async get<R = ResponseDTO<OrderDTO>>(
    orderId: string,
    params: OrderParameters = {},
    mapper?: Mapper<ResponseDTO<OrderDTO>, R>
  ): Promise<R> {
    try {
      return this.client.get<OrderParameters, R>(
        `/api/orders/${orderId}`,
        params,
        mapper
      );
    } catch (error) {
      throw error;
    }
  }

  // Order Management
  async listOrders<R = ListResponseDTO<OrderSummaryDTO>>(
    params?: AdminOrderListRequest,
    mapper?: Mapper<ListResponseDTO<OrderSummaryDTO>, R>
  ): Promise<R> {
    try {
      return this.client.get<AdminOrderListRequest, R>(
        "/api/admin/orders",
        params || {},
        mapper
      );
    } catch (error) {
      throw error;
    }
  }

  async updateOrderStatus<R = ResponseDTO<OrderSummaryDTO>>(
    orderId: string,
    data: UpdateOrderStatusRequest,
    mapper?: Mapper<ResponseDTO<OrderSummaryDTO>, R>
  ): Promise<R> {
    try {
      return this.client.put<
        UpdateOrderStatusRequest,
        ResponseDTO<OrderSummaryDTO>,
        R
      >(`/api/admin/orders/${orderId}/status`, data, mapper);
    } catch (error) {
      throw error;
    }
  }
}
