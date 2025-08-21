import { UserDTO } from "../types/dtos";
import { IApiClient, Mapper } from "../client/base";
import {
  CreateUserRequest,
  ResponseDTO,
  UserLoginRequest,
  UserLoginResponse,
} from "../types/contracts";

export class AuthEndpoints {
  constructor(private client: IApiClient) {}

  async register<R = ResponseDTO<UserLoginResponse>>(
    data: CreateUserRequest,
    mapper?: Mapper<ResponseDTO<UserLoginResponse>, R>
  ): Promise<R> {
    try {
      return this.client.post<
        CreateUserRequest,
        ResponseDTO<UserLoginResponse>,
        R
      >("/api/auth/register", data, mapper);
    } catch (error) {
      throw error;
    }
  }

  async signin<R = ResponseDTO<UserLoginResponse>>(
    data: UserLoginRequest,
    mapper?: Mapper<ResponseDTO<UserLoginResponse>, R>
  ): Promise<R> {
    try {
      return this.client.post<
        UserLoginRequest,
        ResponseDTO<UserLoginResponse>,
        R
      >("/api/auth/signin", data, mapper);
    } catch (error) {
      throw error;
    }
  }
}
