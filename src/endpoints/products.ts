import { ProductDTO } from "../types/dtos";
import { IApiClient, Mapper } from "../client/base";
import { ListResponseDTO } from "../types/contracts";

export interface ProductSearchRequest {
  query?: string;
  category_id?: number;
  min_price?: number;
  max_price?: number;
  currency?: string;
  active_only?: boolean;
  page?: number;
  page_size?: number;
}

export class ProductEndpoints {
  constructor(private client: IApiClient) {}

  async get<R = ProductDTO>(
    productId: number,
    mapper?: Mapper<ProductDTO, R>
  ): Promise<R> {
    return this.client.get<Record<string, never>, R>(
      `/api/products/${productId}`,
      undefined,
      mapper
    );
  }

  async search<R = ListResponseDTO<ProductDTO>>(
    params: ProductSearchRequest,
    mapper?: Mapper<ListResponseDTO<ProductDTO>, R>
  ): Promise<R> {
    return this.client.get<ProductSearchRequest, R>(
      "/api/products/search",
      params,
      mapper
    );
  }
}
