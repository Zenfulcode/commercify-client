import { UserDTO } from "../types/dtos";
import { IApiClient, Mapper } from "../client/base";
import {
  UpdateUserRequest,
  ChangePasswordRequest,
  ResponseDTO,
  ListResponseDTO,
} from "../types/contracts";

export interface AdminUserListRequest {
  page?: number;
  page_size?: number;
}

export class UserEndpoints {
  constructor(private client: IApiClient) {}

  async getProfile<R = ResponseDTO<UserDTO>>(
    mapper?: Mapper<ResponseDTO<UserDTO>, R>
  ): Promise<R> {
    try {
      return this.client.get<Record<string, never>, R>(
        "/api/users/me",
        undefined,
        mapper
      );
    } catch (error) {
      throw error;
    }
  }

  async updateProfile<R = ResponseDTO<UserDTO>>(
    data: UpdateUserRequest,
    mapper?: Mapper<ResponseDTO<UserDTO>, R>
  ): Promise<R> {
    try {
      return this.client.put<UpdateUserRequest, ResponseDTO<UserDTO>, R>(
        "/api/users/me",
        data,
        mapper
      );
    } catch (error) {
      throw error;
    }
  }

  async changePassword(data: ChangePasswordRequest): Promise<void> {
    try {
      return this.client.put<ChangePasswordRequest, void, void>(
        "/api/users/me/password",
        data
      );
    } catch (error) {
      throw error;
    }
  }

  async listUsers<R = ListResponseDTO<UserDTO>>(
    params?: AdminUserListRequest,
    mapper?: Mapper<ListResponseDTO<UserDTO>, R>
  ): Promise<R> {
    try {
      return this.client.get<AdminUserListRequest, R>(
        "/api/admin/users",
        params || {},
        mapper
      );
    } catch (error) {
      throw error;
    }
  }
}
