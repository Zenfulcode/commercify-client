import { CategoryDTO } from "../types/dtos";
import { IApiClient, Mapper } from "../client/base";
import {
  CreateCategoryRequest,
  UpdateCategoryRequest,
  ResponseDTO,
  ListResponseDTO,
} from "../types/contracts";

export class CategoryEndpoints {
  constructor(private client: IApiClient) {}

  async list<R = ListResponseDTO<CategoryDTO>>(
    mapper?: Mapper<ListResponseDTO<CategoryDTO>, R>
  ): Promise<R> {
    try {
      return this.client.get<Record<string, never>, R>(
        "/api/categories",
        undefined,
        mapper
      );
    } catch (error) {
      throw error;
    }
  }

  async get<R = ResponseDTO<CategoryDTO>>(
    id: number,
    mapper?: Mapper<ResponseDTO<CategoryDTO>, R>
  ): Promise<R> {
    try {
      return this.client.get<Record<string, never>, R>(
        `/api/categories/${id}`,
        undefined,
        mapper
      );
    } catch (error) {
      throw error;
    }
  }

  async getChildren<R = ResponseDTO<CategoryDTO[]>>(
    id: number,
    mapper?: Mapper<ResponseDTO<CategoryDTO[]>, R>
  ): Promise<R> {
    try {
      return this.client.get<Record<string, never>, R>(
        `/api/categories/${id}/children`,
        undefined,
        mapper
      );
    } catch (error) {
      throw error;
    }
  }

  // Admin endpoints
  async create<R = ResponseDTO<CategoryDTO>>(
    data: CreateCategoryRequest,
    mapper?: Mapper<ResponseDTO<CategoryDTO>, R>
  ): Promise<R> {
    try {
      return this.client.post<
        CreateCategoryRequest,
        ResponseDTO<CategoryDTO>,
        R
      >("/api/admin/categories", data, mapper);
    } catch (error) {
      throw error;
    }
  }

  async update<R = ResponseDTO<CategoryDTO>>(
    id: number,
    data: UpdateCategoryRequest,
    mapper?: Mapper<ResponseDTO<CategoryDTO>, R>
  ): Promise<R> {
    try {
      return this.client.put<
        UpdateCategoryRequest,
        ResponseDTO<CategoryDTO>,
        R
      >(`/api/admin/categories/${id}`, data, mapper);
    } catch (error) {
      throw error;
    }
  }

  async delete<R = ResponseDTO<void>>(
    id: number,
    mapper?: Mapper<ResponseDTO<void>, R>
  ): Promise<R> {
    try {
      return this.client.delete<ResponseDTO<void>, R>(
        `/api/admin/categories/${id}`,
        mapper
      );
    } catch (error) {
      throw error;
    }
  }
}
