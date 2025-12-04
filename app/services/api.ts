import type { ApiConfig, ApiError, ApiRequestConfig, ApiResponse, HttpMethod } from "~/types";

export class ApiService {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;
  private timeout: number;

  constructor(config: ApiConfig) {
    this.baseURL = config.baseURL;
    this.timeout = config.timeout || 10000;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...config.headers,
    };
  }

  private async request<T = any>(
    method: HttpMethod,
    endpoint: string,
    config: ApiRequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const {
      params,
      data,
      headers = {},
      timeout = this.timeout,
      ...restConfig
    } = config;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      // Build URL with query parameters
      const url = new URL(endpoint, this.baseURL);
      
      if (params) {
        Object.keys(params).forEach(key => {
          if (params[key] !== undefined && params[key] !== null) {
            url.searchParams.append(key, String(params[key]));
          }
        });
      }

      // Merge headers
      const mergedHeaders = {
        ...this.defaultHeaders,
        ...headers,
      };

      const requestConfig: RequestInit = {
        method,
        headers: mergedHeaders,
        signal: controller.signal,
        ...restConfig,
      };

      // Add body for non-GET methods
      if (data && method !== 'GET') {
        requestConfig.body = JSON.stringify(data);
      }

      const response = await fetch(url.toString(), requestConfig);
      clearTimeout(timeoutId);

      // Handle non-2xx responses
      if (!response.ok) {
        throw await this.handleError(response);
      }

      // Parse response
      let responseData: T;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        responseData = await response.text() as any;
      }

      return {
        data: responseData,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      };
    } catch (error) {
      clearTimeout(timeoutId);
      throw this.normalizeError(error);
    }
  }

  private async handleError(response: Response): Promise<ApiError> {
    const contentType = response.headers.get('content-type');
    let errorData: any;

    try {
      if (contentType && contentType.includes('application/json')) {
        errorData = await response.json();
      } else {
        errorData = await response.text();
      }
    } catch {
      errorData = response.statusText;
    }

    return {
      message: errorData?.message || `Request failed with status ${response.status}`,
      status: response.status,
      code: errorData?.code,
      data: errorData,
    };
  }

  private normalizeError(error: any): ApiError {
    if (error.name === 'AbortError') {
      return {
        message: 'Request timeout',
        code: 'TIMEOUT',
      };
    }

    if (error instanceof Error) {
      return {
        message: error.message,
        code: 'NETWORK_ERROR',
      };
    }

    return {
      message: 'An unknown error occurred',
      code: 'UNKNOWN_ERROR',
    };
  }

  // HTTP Methods
  public get<T = any>(endpoint: string, config?: ApiRequestConfig) {
    return this.request<T>('GET', endpoint, config);
  }

  public post<T = any>(endpoint: string, data?: any, config?: ApiRequestConfig) {
    return this.request<T>('POST', endpoint, { ...config, data });
  }

  public put<T = any>(endpoint: string, data?: any, config?: ApiRequestConfig) {
    return this.request<T>('PUT', endpoint, { ...config, data });
  }

  public patch<T = any>(endpoint: string, data?: any, config?: ApiRequestConfig) {
    return this.request<T>('PATCH', endpoint, { ...config, data });
  }

  public delete<T = any>(endpoint: string, config?: ApiRequestConfig) {
    return this.request<T>('DELETE', endpoint, config);
  }
}

// Singleton instance
let apiInstance: ApiService | null = null;

export const getApiInstance = (config?: ApiConfig): ApiService => {
  if (!apiInstance) {
    if (!config) {
      throw new Error('API configuration required for first initialization');
    }
    apiInstance = new ApiService(config);
  }
  return apiInstance;
};