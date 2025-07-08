import { IApiClient } from "../client/base";

export interface TestEmailRequest {
  to: string;
  subject: string;
  template?: string;
  data?: Record<string, any>;
}

export class AdminEndpoints {
  constructor(private client: IApiClient) {}

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
