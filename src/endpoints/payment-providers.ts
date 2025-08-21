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
    try {
      return this.client.get<Record<string, never>, R>(
        "/api/payment/providers",
        undefined,
        mapper
      );
    } catch (error) {
      throw error;
    }
  }

  // Admin endpoints
  async getAllProviders<R = ResponseDTO<PaymentProviderDTO[]>>(
    mapper?: Mapper<ResponseDTO<PaymentProviderDTO[]>, R>
  ): Promise<R> {
    try {
      return this.client.get<Record<string, never>, R>(
        "/api/admin/payment-providers",
        undefined,
        mapper
      );
    } catch (error) {
      throw error;
    }
  }

  async getEnabledProviders<R = ResponseDTO<PaymentProviderDTO[]>>(
    mapper?: Mapper<ResponseDTO<PaymentProviderDTO[]>, R>
  ): Promise<R> {
    try {
      return this.client.get<Record<string, never>, R>(
        "/api/admin/payment-providers/enabled",
        undefined,
        mapper
      );
    } catch (error) {
      throw error;
    }
  }

  async enableProvider<R = ResponseDTO<PaymentProviderDTO>>(
    providerType: string,
    enabled: boolean,
    mapper?: Mapper<ResponseDTO<PaymentProviderDTO>, R>
  ): Promise<R> {
    try {
      return this.client.put<
        { enabled: boolean },
        ResponseDTO<PaymentProviderDTO>,
        R
      >(
        `/api/admin/payment-providers/${providerType}/enable`,
        { enabled },
        mapper
      );
    } catch (error) {
      throw error;
    }
  }

  async updateConfiguration<R = ResponseDTO<PaymentProviderDTO>>(
    providerType: string,
    configuration: PaymentProviderConfiguration,
    mapper?: Mapper<ResponseDTO<PaymentProviderDTO>, R>
  ): Promise<R> {
    try {
      return this.client.put<
        PaymentProviderConfiguration,
        ResponseDTO<PaymentProviderDTO>,
        R
      >(
        `/api/admin/payment-providers/${providerType}/configuration`,
        configuration,
        mapper
      );
    } catch (error) {
      throw error;
    }
  }

  async registerWebhook<R = ResponseDTO<WebhookInfo>>(
    providerType: string,
    webhookData: WebhookInfo,
    mapper?: Mapper<ResponseDTO<WebhookInfo>, R>
  ): Promise<R> {
    try {
      return this.client.post<WebhookInfo, ResponseDTO<WebhookInfo>, R>(
        `/api/admin/payment-providers/${providerType}/webhook`,
        webhookData,
        mapper
      );
    } catch (error) {
      throw error;
    }
  }

  async deleteWebhook(providerType: string): Promise<void> {
    try {
      return this.client.delete<void, void>(
        `/api/admin/payment-providers/${providerType}/webhook`
      );
    } catch (error) {
      throw error;
    }
  }

  async getWebhookInfo<R = ResponseDTO<WebhookInfo>>(
    providerType: string,
    mapper?: Mapper<ResponseDTO<WebhookInfo>, R>
  ): Promise<R> {
    try {
      return this.client.get<Record<string, never>, R>(
        `/api/admin/payment-providers/${providerType}/webhook`,
        undefined,
        mapper
      );
    } catch (error) {
      throw error;
    }
  }
}
