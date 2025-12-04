
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface ApiConfig {
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
}

export interface ApiRequestConfig extends RequestInit {
  params?: Record<string, any>;
  data?: any;
  timeout?: number;
}

export interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  data?: any;
}

export interface QueryOptions<TData = any, TError = ApiError> {
  enabled?: boolean;
  retry?: number | boolean;
  retryDelay?: number | ((retryAttempt: number) => number);
  staleTime?: number;
  cacheTime?: number;
  refetchOnWindowFocus?: boolean;
  refetchOnMount?: boolean;
  refetchOnReconnect?: boolean;
  refetchInterval?: number | false;
  onSuccess?: (data: TData) => void;
  onError?: (error: TError) => void;
  onSettled?: (data?: TData, error?: TError) => void;
}

export interface MutationOptions<TData = any, TVariables = any, TError = ApiError> {
  [x: string]: any;
  onSuccess?: (data: TData, variables: TVariables) => void;
  onError?: (error: TError, variables: TVariables) => void;
  onSettled?: (data?: TData, error?: TError, variables?: TVariables) => void;
  retry?: number | boolean;
  retryDelay?: number | ((retryAttempt: number) => number);
}