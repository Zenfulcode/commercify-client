import {
  UserDTO,
  OrderDTO,
  OrderSummaryDTO,
  CheckoutDTO,
  OrderStatus,
} from "../types/dtos";
import { IApiClient, Mapper } from "../client/base";
import {
  ListResponseDTO,
  PaginationDTO,
  ResponseDTO,
} from "../types/contracts";

export interface AdminOrderListRequest {
  page?: number;
  page_size?: number;
  status?: string;
}

export interface AdminUserListRequest {
  page?: number;
  page_size?: number;
}

export interface AdminCheckoutSearchRequest {
  user_id?: number;
  status?: string;
  page?: number;
  page_size?: number;
}

export interface UpdateOrderStatusRequest {
  status: OrderStatus;
}

export interface TestEmailRequest {
  to: string;
  subject: string;
  template?: string;
  data?: Record<string, any>;
}

export class AdminEndpoints {
  constructor(private client: IApiClient) {}

  // User Management
  async listUsers<R = ListResponseDTO<UserDTO>>(
    params?: AdminUserListRequest,
    mapper?: Mapper<ListResponseDTO<UserDTO>, R>
  ): Promise<R> {
    return this.client.get<AdminUserListRequest, R>(
      "/api/admin/users",
      params || {},
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

  // Checkout Management
  async listCheckouts<R = ListResponseDTO<CheckoutDTO>>(
    params?: AdminCheckoutSearchRequest,
    mapper?: Mapper<ListResponseDTO<CheckoutDTO>, R>
  ): Promise<R> {
    return this.client.get<AdminCheckoutSearchRequest, R>(
      "/api/admin/checkouts",
      params || {},
      mapper
    );
  }

  async getCheckout<R = ResponseDTO<CheckoutDTO>>(
    checkoutId: number,
    mapper?: Mapper<ResponseDTO<CheckoutDTO>, R>
  ): Promise<R> {
    return this.client.get<Record<string, never>, R>(
      `/api/admin/checkouts/${checkoutId}`,
      undefined,
      mapper
    );
  }

  async deleteCheckout(checkoutId: number): Promise<void> {
    return this.client.delete<void, void>(`/api/admin/checkouts/${checkoutId}`);
  }

  // Payment Management
  async capturePayment(paymentId: string): Promise<void> {
    return this.client.post<Record<string, never>, void, void>(
      `/api/admin/payments/${paymentId}/capture`,
      {}
    );
  }

  async cancelPayment(paymentId: string): Promise<void> {
    return this.client.post<Record<string, never>, void, void>(
      `/api/admin/payments/${paymentId}/cancel`,
      {}
    );
  }

  async refundPayment(paymentId: string, amount?: number): Promise<void> {
    return this.client.post<{ amount?: number }, void, void>(
      `/api/admin/payments/${paymentId}/refund`,
      { amount }
    );
  }

  async forceApproveMobilePayPayment(paymentId: string): Promise<void> {
    return this.client.post<Record<string, never>, void, void>(
      `/api/admin/payments/${paymentId}/force-approve`,
      {}
    );
  }

  // Email Testing
  async sendTestEmail(data: TestEmailRequest): Promise<void> {
    return this.client.post<TestEmailRequest, void, void>(
      "/api/admin/test/email",
      data
    );
  }
}
