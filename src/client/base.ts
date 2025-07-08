export interface IApiClient {
  get<T extends Record<string, any>, R>(
    path: string,
    params?: T,
    mapper?: Mapper<any, R>
  ): Promise<R>;
  post<T, U, R>(path: string, data: T, mapper?: Mapper<U, R>): Promise<R>;
  put<T, U, R>(path: string, data: T, mapper?: Mapper<U, R>): Promise<R>;
  delete<T, R>(path: string, mapper?: Mapper<T, R>): Promise<R>;
}

export type Mapper<T, U> = (data: T) => U;

export abstract class BaseApiClient implements IApiClient {
  private authToken: string | null = null;
  private cookieHeader: string | null = null;
  private cookieStore: any = null; // SvelteKit cookies object

  constructor(protected readonly baseURL: string) {}

  public setAuthToken(token: string | null) {
    this.authToken = token;
  }

  public setCookieHeader(cookieHeader: string | null) {
    this.cookieHeader = cookieHeader;
  }

  public setCookieStore(cookieStore: any) {
    this.cookieStore = cookieStore;
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    if (this.authToken) {
      headers["Authorization"] = `Bearer ${this.authToken}`;
    }
    if (this.cookieHeader) {
      headers["Cookie"] = this.cookieHeader;
    }
    return headers;
  }

  private async handleResponse<R>(response: Response): Promise<R> {
    // Forward any Set-Cookie headers from the API response back to the browser
    if (this.cookieStore && response.headers.has("set-cookie")) {
      const setCookieHeaders = response.headers.get("set-cookie");
      if (setCookieHeaders) {
        // Parse and set cookies using SvelteKit's cookie store
        this.parseCookiesAndSet(setCookieHeaders);
      }
    }

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { message: response.statusText };
      }
      throw new Error(
        errorData?.message || `Request failed with status ${response.status}`
      );
    }
    // Handle cases with no content
    if (response.status === 204) {
      return null as R;
    }
    return response.json();
  }

  private parseCookiesAndSet(setCookieHeader: string) {
    // Simple cookie parsing - in production you might want a more robust parser
    const cookies = setCookieHeader.split(",").map((cookie) => cookie.trim());

    for (const cookie of cookies) {
      const [nameValue, ...options] = cookie
        .split(";")
        .map((part) => part.trim());
      const [name, value] = nameValue.split("=");

      if (name && value && this.cookieStore) {
        const cookieOptions: any = {
          path: "/",
          httpOnly: true,
          secure: false,
          sameSite: "lax",
        };

        // Parse cookie options
        for (const option of options) {
          const [key, val] = option.split("=");
          switch (key.toLowerCase()) {
            case "path":
              cookieOptions.path = val || "/";
              break;
            case "max-age":
              cookieOptions.maxAge = parseInt(val);
              break;
            case "secure":
              cookieOptions.secure = true;
              break;
            case "httponly":
              cookieOptions.httpOnly = true;
              break;
            case "samesite":
              cookieOptions.sameSite = val?.toLowerCase() || "lax";
              break;
          }
        }

        this.cookieStore.set(name, value, cookieOptions);
      }
    }
  }

  async get<T extends Record<string, any>, R>(
    path: string,
    params?: T,
    mapper?: Mapper<any, R>
  ): Promise<R> {
    const url = new URL(`${this.baseURL}${path}`);
    if (params) {
      Object.keys(params).forEach((key) =>
        url.searchParams.append(key, params[key])
      );
    }

    console.log(`GET request to: ${url.toString()}`);

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: this.getHeaders(),
      credentials: "include",
    });

    const data = await this.handleResponse<any>(response);
    return mapper ? mapper(data) : data;
  }

  async post<T, U, R>(
    path: string,
    data: T,
    mapper?: Mapper<U, R>
  ): Promise<R> {
    const response = await fetch(`${this.baseURL}${path}`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(data),
      credentials: "include",
    });

    const responseData = await this.handleResponse<U>(response);
    return mapper ? mapper(responseData) : (responseData as unknown as R);
  }

  async put<T, U, R>(path: string, data: T, mapper?: Mapper<U, R>): Promise<R> {
    const response = await fetch(`${this.baseURL}${path}`, {
      method: "PUT",
      headers: this.getHeaders(),
      body: JSON.stringify(data),
      credentials: "include",
    });

    const responseData = await this.handleResponse<U>(response);
    return mapper ? mapper(responseData) : (responseData as unknown as R);
  }

  async delete<T, R>(path: string, mapper?: Mapper<T, R>): Promise<R> {
    const response = await fetch(`${this.baseURL}${path}`, {
      method: "DELETE",
      headers: this.getHeaders(),
      credentials: "include",
    });

    const data = await this.handleResponse<T>(response);
    return mapper ? mapper(data) : (data as unknown as R);
  }
}
