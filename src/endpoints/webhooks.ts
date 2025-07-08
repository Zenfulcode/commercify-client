import { IApiClient } from "../client/base";

export interface StripeWebhookData {
  id: string;
  object: string;
  type: string;
  data: {
    object: any;
  };
  [key: string]: any;
}

export interface MobilePayWebhookData {
  type: string;
  data: {
    paymentId: string;
    orderId?: string;
    status: string;
    [key: string]: any;
  };
  [key: string]: any;
}

export class WebhookEndpoints {
  constructor(private client: IApiClient) {}

  // These endpoints are typically called by external services, not by client code
  // They're included for completeness but would usually be handled server-side

  async handleStripeWebhook(data: StripeWebhookData): Promise<any> {
    return this.client.post<StripeWebhookData, any, any>(
      "/api/webhooks/stripe",
      data
    );
  }

  async handleMobilePayWebhook(data: MobilePayWebhookData): Promise<any> {
    return this.client.post<MobilePayWebhookData, any, any>(
      "/api/webhooks/mobilepay",
      data
    );
  }
}
