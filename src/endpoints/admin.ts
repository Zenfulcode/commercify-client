import { IApiClient, Mapper } from "../client/base";
import {
  CapturePaymentRequest,
  RefundPaymentRequest,
  ResponseDTO,
} from "../types/contracts";
import { EmailTestDetails } from "../types/dtos";

export interface TestEmailRequest {
  to: string;
  subject: string;
  template?: string;
  data?: Record<string, any>;
}

export class AdminEndpoints {
  constructor(private client: IApiClient) {}

  // Payment Management
  async capturePayment<R = ResponseDTO<string>>(
    paymentId: string,
    options: CapturePaymentRequest,
    mapper?: Mapper<ResponseDTO<string>, R>
  ): Promise<R> {
    return this.client.post<CapturePaymentRequest, ResponseDTO<string>, R>(
      `/api/admin/payments/${paymentId}/capture`,
      options,
      mapper
    );
  }

  async cancelPayment<R = ResponseDTO<string>>(
    paymentId: string,
    mapper?: Mapper<ResponseDTO<string>, R>
  ): Promise<R> {
    return this.client.post<Record<string, never>, ResponseDTO<string>, R>(
      `/api/admin/payments/${paymentId}/cancel`,
      {},
      mapper
    );
  }

  async refundPayment<R = ResponseDTO<string>>(
    paymentId: string,
    options: RefundPaymentRequest,
    mapper?: Mapper<ResponseDTO<string>, R>
  ): Promise<R> {
    return this.client.post<RefundPaymentRequest, ResponseDTO<string>, R>(
      `/api/admin/payments/${paymentId}/refund`,
      options,
      mapper
    );
  }

  async forceApproveMobilePayPayment(paymentId: string): Promise<void> {
    return this.client.post<Record<string, never>, void, void>(
      `/api/admin/payments/${paymentId}/force-approve`,
      {}
    );
  }

  // Email Testing
  async sendTestEmail<R = ResponseDTO<EmailTestDetails>>(
    data: TestEmailRequest,
    mapper?: Mapper<ResponseDTO<EmailTestDetails>, R>
  ): Promise<R> {
    return this.client.post<TestEmailRequest, ResponseDTO<EmailTestDetails>, R>(
      "/api/admin/test/email",
      data,
      mapper
    );
  }
}
