import { IApiClient, Mapper } from "../client/base";
import { ResponseDTO } from "../types/contracts";

export interface PaymentProviderDTO {
  type: string;
  name: string;
  enabled: boolean;
  configuration: Record<string, any>;
}

export interface PaymentProviderConfiguration {
  [key: string]: any;
}

export interface WebhookInfo {
  url: string;
  events: string[];
  secret: string;
}

export class PaymentProviderEndpoints {
  constructor(private client: IApiClient) {}

  // Public endpoints
  async getProviders<R = ResponseDTO<PaymentProviderDTO[]>>(
    mapper?: Mapper<ResponseDTO<PaymentProviderDTO[]>, R>
  ): Promise<R> {
    return this.client.get<Record<string, never>, R>(
      "/api/payment/providers",
      undefined,
      mapper
    );
  }

  // Admin endpoints
  async getAllProviders<R = ResponseDTO<PaymentProviderDTO[]>>(
    mapper?: Mapper<ResponseDTO<PaymentProviderDTO[]>, R>
  ): Promise<R> {
    return this.client.get<Record<string, never>, R>(
      "/api/admin/payment-providers",
      undefined,
      mapper
    );
  }

  async getEnabledProviders<R = ResponseDTO<PaymentProviderDTO[]>>(
    mapper?: Mapper<ResponseDTO<PaymentProviderDTO[]>, R>
  ): Promise<R> {
    return this.client.get<Record<string, never>, R>(
      "/api/admin/payment-providers/enabled",
      undefined,
      mapper
    );
  }

  async enableProvider<R = ResponseDTO<PaymentProviderDTO>>(
    providerType: string,
    enabled: boolean,
    mapper?: Mapper<ResponseDTO<PaymentProviderDTO>, R>
  ): Promise<R> {
    return this.client.put<
      { enabled: boolean },
      ResponseDTO<PaymentProviderDTO>,
      R
    >(
      `/api/admin/payment-providers/${providerType}/enable`,
      { enabled },
      mapper
    );
  }

  async updateConfiguration<R = ResponseDTO<PaymentProviderDTO>>(
    providerType: string,
    configuration: PaymentProviderConfiguration,
    mapper?: Mapper<ResponseDTO<PaymentProviderDTO>, R>
  ): Promise<R> {
    return this.client.put<
      PaymentProviderConfiguration,
      ResponseDTO<PaymentProviderDTO>,
      R
    >(
      `/api/admin/payment-providers/${providerType}/configuration`,
      configuration,
      mapper
    );
  }

  async registerWebhook<R = ResponseDTO<WebhookInfo>>(
    providerType: string,
    webhookData: WebhookInfo,
    mapper?: Mapper<ResponseDTO<WebhookInfo>, R>
  ): Promise<R> {
    return this.client.post<WebhookInfo, ResponseDTO<WebhookInfo>, R>(
      `/api/admin/payment-providers/${providerType}/webhook`,
      webhookData,
      mapper
    );
  }

  async deleteWebhook(providerType: string): Promise<void> {
    return this.client.delete<void, void>(
      `/api/admin/payment-providers/${providerType}/webhook`
    );
  }

  async getWebhookInfo<R = ResponseDTO<WebhookInfo>>(
    providerType: string,
    mapper?: Mapper<ResponseDTO<WebhookInfo>, R>
  ): Promise<R> {
    return this.client.get<Record<string, never>, R>(
      `/api/admin/payment-providers/${providerType}/webhook`,
      undefined,
      mapper
    );
  }
}
