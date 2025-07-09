import { ProductDTO, VariantDTO } from "../types/dtos";
import { IApiClient, Mapper } from "../client/base";
import {
  ListResponseDTO,
  ResponseDTO,
  CreateProductRequest,
  UpdateProductRequest,
  CreateVariantRequest,
  UpdateVariantRequest,
} from "../types/contracts";

export interface ProductSearchRequest {
  query?: string;
  category_id?: number;
  min_price?: number;
  max_price?: number;
  currency?: string;
  page?: number;
  page_size?: number;
}

export interface AdminProductListRequest extends ProductSearchRequest {
  active?: boolean;
}

export class ProductEndpoints {
  constructor(private client: IApiClient) {}

  async get<R = ResponseDTO<ProductDTO>>(
    productId: number,
    mapper?: Mapper<ResponseDTO<ProductDTO>, R>
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

  // Admin endpoints
  async listAll<R = ListResponseDTO<ProductDTO>>(
    params?: AdminProductListRequest,
    mapper?: Mapper<ListResponseDTO<ProductDTO>, R>
  ): Promise<R> {
    return this.client.get<AdminProductListRequest, R>(
      "/api/admin/products",
      params || {},
      mapper
    );
  }

  async create<R = ResponseDTO<ProductDTO>>(
    data: CreateProductRequest,
    mapper?: Mapper<ResponseDTO<ProductDTO>, R>
  ): Promise<R> {
    return this.client.post<CreateProductRequest, ResponseDTO<ProductDTO>, R>(
      "/api/admin/products",
      data,
      mapper
    );
  }

  async update<R = ResponseDTO<ProductDTO>>(
    productId: number,
    data: UpdateProductRequest,
    mapper?: Mapper<ResponseDTO<ProductDTO>, R>
  ): Promise<R> {
    return this.client.put<UpdateProductRequest, ResponseDTO<ProductDTO>, R>(
      `/api/admin/products/${productId}`,
      data,
      mapper
    );
  }

  async delete(productId: number): Promise<void> {
    return this.client.delete<void, void>(`/api/admin/products/${productId}`);
  }

  // Product variant management
  async addVariant<R = ResponseDTO<VariantDTO>>(
    productId: number,
    data: CreateVariantRequest,
    mapper?: Mapper<ResponseDTO<VariantDTO>, R>
  ): Promise<R> {
    return this.client.post<CreateVariantRequest, ResponseDTO<VariantDTO>, R>(
      `/api/admin/products/${productId}/variants`,
      data,
      mapper
    );
  }

  async updateVariant<R = ResponseDTO<VariantDTO>>(
    productId: number,
    variantId: number,
    data: UpdateVariantRequest,
    mapper?: Mapper<ResponseDTO<VariantDTO>, R>
  ): Promise<R> {
    return this.client.put<UpdateVariantRequest, ResponseDTO<VariantDTO>, R>(
      `/api/admin/products/${productId}/variants/${variantId}`,
      data,
      mapper
    );
  }

  async deleteVariant(productId: number, variantId: number): Promise<void> {
    return this.client.delete<void, void>(
      `/api/admin/products/${productId}/variants/${variantId}`
    );
  }
}
