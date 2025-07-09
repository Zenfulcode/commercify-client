import { UserDTO } from "../types/dtos";
import { IApiClient, Mapper } from "../client/base";
import {
  CreateUserRequest,
  UserLoginRequest,
  UserLoginResponse,
} from "../types/contracts";

export class AuthEndpoints {
  constructor(private client: IApiClient) {}

  async register<R = CreateUserRequest>(
    data: CreateUserRequest,
    mapper?: Mapper<CreateUserRequest, R>
  ): Promise<R> {
    return this.client.post<CreateUserRequest, CreateUserRequest, R>(
      "/api/auth/register",
      data,
      mapper
    );
  }

  async signin<R = UserLoginResponse>(
    data: UserLoginRequest,
    mapper?: Mapper<UserLoginResponse, R>
  ): Promise<R> {
    return this.client.post<UserLoginRequest, UserLoginResponse, R>(
      "/api/auth/signin",
      data,
      mapper
    );
  }
}
