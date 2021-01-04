import { ApiUrl } from "../config/ApiConfig";

export class IConfig {
  constructor(token: string) {
    this.JwtToken = token;
  }
  /**
   * Returns a valid value for the Authorization header.
   * Used to dynamically inject the current auth header.
   */
  JwtToken: string;
}

export class AuthorizedApiBase {
  private readonly config: IConfig;

  protected constructor(config: IConfig) {
    this.config = config;
  }

  protected transformOptions = (options: RequestInit): Promise<RequestInit> => {
    options.headers = {
      ...options.headers,
      Authorization: this.config.JwtToken,
    };
    return Promise.resolve(options);
  };

  protected getBaseUrl = (defaultUrl: string, baseUrl?: string) => {
    return ApiUrl !== undefined ? ApiUrl : defaultUrl;
  };
}
