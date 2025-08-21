import { IApiClient, Mapper } from "../client/base";

export interface HealthCheckResponse {
  status: string;
  message?: string;
  timestamp: string;
}

export class HealthEndpoints {
  constructor(private client: IApiClient) {}

  async check<R = HealthCheckResponse>(
    mapper?: Mapper<HealthCheckResponse, R>
  ): Promise<R> {
    try {
      return this.client.get<Record<string, never>, R>(
        "/api/health",
        undefined,
        mapper
      );
    } catch (error) {
      throw error;
    }
  }
}
