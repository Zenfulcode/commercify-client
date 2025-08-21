import { IApiClient, Mapper } from "../client/base";
import { ResponseDTO } from "../types/contracts";
import { DashboardStats, DashboardStatsRequest } from "../types/dtos";

export class DashboardEndpoints {
  constructor(private client: IApiClient) {}

  // Payment Management
  async getStats<R = ResponseDTO<DashboardStats>>(
    input: DashboardStatsRequest,
    mapper?: Mapper<ResponseDTO<DashboardStats>, R>
  ): Promise<R> {
    return this.client.post<
      DashboardStatsRequest,
      ResponseDTO<DashboardStats>,
      R
    >(`/api/admin/dashboard/stats`, input, mapper);
  }
}
