import {ApiUrl} from '../config/ApiConfig'

/**
 * Configuration class needed in base class.
 * The config is provided to the API client at initialization time.
 * API clients inherit from #AuthorizedApiBase and provide the config.
 */
export class IConfig {
  constructor(token : string){
    this.JwtToken = token
  }
  /**
   * Returns a valid value for the Authorization header.
   * Used to dynamically inject the current auth header.
   */
  JwtToken: string;
}

/**
 * Base class for NSwag API Client
 * has override methods to spread in my Authorization header
 * and for getting the ApiUrl from config
 */
export class AuthorizedApiBase {
  private readonly config: IConfig;

  protected constructor(config: IConfig) {
    this.config = config;
  }

  protected transformOptions = (options: RequestInit): Promise<RequestInit> => {
    options.headers = {
      ...options.headers,
      Authorization: this.config.JwtToken
    };
    return Promise.resolve(options);
  };

  protected getBaseUrl = (defaultUrl: string, baseUrl?: string) => {
    return ApiUrl !== undefined ? ApiUrl : defaultUrl 
  }
}