import { CurrencyDTO } from "../types/dtos";
import { IApiClient, Mapper } from "../client/base";
import {
  CreateCurrencyRequest,
  UpdateCurrencyRequest,
  ConvertAmountRequest,
  ConvertAmountResponse,
  SetDefaultCurrencyRequest,
  DeleteCurrencyResponse,
  ResponseDTO,
  ListResponseDTO,
} from "../types/contracts";

export class CurrencyEndpoints {
  constructor(private client: IApiClient) {}

  // Public endpoints
  async list<R = ListResponseDTO<CurrencyDTO>>(
    mapper?: Mapper<ListResponseDTO<CurrencyDTO>, R>
  ): Promise<R> {
    return this.client.get<Record<string, never>, R>(
      "/api/currencies",
      undefined,
      mapper
    );
  }

  async getDefault<R = ResponseDTO<CurrencyDTO>>(
    mapper?: Mapper<ResponseDTO<CurrencyDTO>, R>
  ): Promise<R> {
    return this.client.get<Record<string, never>, R>(
      "/api/currencies/default",
      undefined,
      mapper
    );
  }

  async convert<R = ResponseDTO<ConvertAmountResponse>>(
    data: ConvertAmountRequest,
    mapper?: Mapper<ResponseDTO<ConvertAmountResponse>, R>
  ): Promise<R> {
    return this.client.post<
      ConvertAmountRequest,
      ResponseDTO<ConvertAmountResponse>,
      R
    >("/api/currencies/convert", data, mapper);
  }

  // Admin endpoints
  async listAll<R = ListResponseDTO<CurrencyDTO>>(
    mapper?: Mapper<ListResponseDTO<CurrencyDTO>, R>
  ): Promise<R> {
    return this.client.get<Record<string, never>, R>(
      "/api/admin/currencies/all",
      undefined,
      mapper
    );
  }

  async create<R = ResponseDTO<CurrencyDTO>>(
    data: CreateCurrencyRequest,
    mapper?: Mapper<ResponseDTO<CurrencyDTO>, R>
  ): Promise<R> {
    return this.client.post<CreateCurrencyRequest, ResponseDTO<CurrencyDTO>, R>(
      "/api/admin/currencies",
      data,
      mapper
    );
  }

  async update<R = ResponseDTO<CurrencyDTO>>(
    data: UpdateCurrencyRequest,
    mapper?: Mapper<ResponseDTO<CurrencyDTO>, R>
  ): Promise<R> {
    return this.client.put<UpdateCurrencyRequest, ResponseDTO<CurrencyDTO>, R>(
      "/api/admin/currencies",
      data,
      mapper
    );
  }

  async delete<R = DeleteCurrencyResponse>(
    code: string,
    mapper?: Mapper<DeleteCurrencyResponse, R>
  ): Promise<R> {
    return this.client.delete<DeleteCurrencyResponse, R>(
      `/api/admin/currencies?code=${code}`,
      mapper
    );
  }

  async setDefault<R = ResponseDTO<CurrencyDTO>>(
    data: SetDefaultCurrencyRequest,
    mapper?: Mapper<ResponseDTO<CurrencyDTO>, R>
  ): Promise<R> {
    return this.client.put<
      SetDefaultCurrencyRequest,
      ResponseDTO<CurrencyDTO>,
      R
    >("/api/admin/currencies/default", data, mapper);
  }
}
