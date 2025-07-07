import { ProductDTO } from "../types/dtos";
import { IApiClient } from "../client/base";
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

  async get(productId: number): Promise<ProductDTO> {
    return this.client.get<Record<string, never>, ProductDTO>(
      `/api/products/${productId}`
    );
  }

  async search(
    params: ProductSearchRequest
  ): Promise<ListResponseDTO<ProductDTO>> {
    return this.client.get<ProductSearchRequest, ListResponseDTO<ProductDTO>>(
      "/api/products/search",
      params
    );
  }
}
