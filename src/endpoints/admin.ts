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
    try {
      return this.client.post<CapturePaymentRequest, ResponseDTO<string>, R>(
        `/api/admin/payments/${paymentId}/capture`,
        options,
        mapper
      );
    } catch (error) {
      throw error;
    }
  }

  async cancelPayment<R = ResponseDTO<string>>(
    paymentId: string,
    mapper?: Mapper<ResponseDTO<string>, R>
  ): Promise<R> {
    try {
      return this.client.post<Record<string, never>, ResponseDTO<string>, R>(
        `/api/admin/payments/${paymentId}/cancel`,
        {},
        mapper
      );
    } catch (error) {
      throw error;
    }
  }

  async refundPayment<R = ResponseDTO<string>>(
    paymentId: string,
    options: RefundPaymentRequest,
    mapper?: Mapper<ResponseDTO<string>, R>
  ): Promise<R> {
    try {
      return this.client.post<RefundPaymentRequest, ResponseDTO<string>, R>(
        `/api/admin/payments/${paymentId}/refund`,
        options,
        mapper
      );
    } catch (error) {
      throw error;
    }
  }

  async forceApproveMobilePayPayment(paymentId: string): Promise<void> {
    try {
      return this.client.post<Record<string, never>, void, void>(
        `/api/admin/payments/${paymentId}/force-approve`,
        {}
      );
    } catch (error) {
      throw error;
    }
  }

  // Email Testing
  async sendTestEmail<R = ResponseDTO<EmailTestDetails>>(
    data: TestEmailRequest,
    mapper?: Mapper<ResponseDTO<EmailTestDetails>, R>
  ): Promise<R> {
    try {
      return this.client.post<
        TestEmailRequest,
        ResponseDTO<EmailTestDetails>,
        R
      >("/api/admin/test/email", data, mapper);
    } catch (error) {
      throw error;
    }
  }
}
