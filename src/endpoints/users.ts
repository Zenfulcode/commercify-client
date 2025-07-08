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
    return this.client.get<Record<string, never>, R>(
      "/api/users/me",
      undefined,
      mapper
    );
  }

  async updateProfile<R = ResponseDTO<UserDTO>>(
    data: UpdateUserRequest,
    mapper?: Mapper<ResponseDTO<UserDTO>, R>
  ): Promise<R> {
    return this.client.put<UpdateUserRequest, ResponseDTO<UserDTO>, R>(
      "/api/users/me",
      data,
      mapper
    );
  }

  async changePassword(data: ChangePasswordRequest): Promise<void> {
    return this.client.put<ChangePasswordRequest, void, void>(
      "/api/users/me/password",
      data
    );
  }

  async listUsers<R = ListResponseDTO<UserDTO>>(
    params?: AdminUserListRequest,
    mapper?: Mapper<ListResponseDTO<UserDTO>, R>
  ): Promise<R> {
    return this.client.get<AdminUserListRequest, R>(
      "/api/admin/users",
      params || {},
      mapper
    );
  }
}
