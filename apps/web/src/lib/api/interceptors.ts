import type { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { ApiClientError } from './errors.js';
import type { ApiErrorResponse } from '@portfolio/contracts';

export function setupInterceptors(client: AxiosInstance): void {
  // Request interceptor
  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // Add client timestamp or tracing headers if needed
      config.headers.set('Accept', 'application/json');
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor
  client.interceptors.response.use(
    (response) => {
      // If response body has the standard envelope { success: true, data: ... }
      if (response.data && typeof response.data === 'object' && 'success' in response.data) {
        if (response.data.success === true) {
          return response.data.data;
        }
      }
      return response.data;
    },
    (error: AxiosError) => {
      // Check if server returned a structured ApiErrorResponse
      if (error.response?.data && typeof error.response.data === 'object') {
        const data = error.response.data as Partial<ApiErrorResponse>;
        if (data.success === false && data.error) {
          return Promise.reject(ApiClientError.fromApiResponse(data as ApiErrorResponse));
        }
      }

      // Check for timeout
      if (error.code === 'ECONNABORTED' || error.message.toLowerCase().includes('timeout')) {
        return Promise.reject(ApiClientError.timeoutError());
      }

      // Check for network errors (no response received)
      if (!error.response) {
        return Promise.reject(ApiClientError.networkError());
      }

      // Fallback for unexpected HTTP error responses
      const fallback = new ApiClientError(
        error.message || 'Request failed',
        `HTTP_${error.response.status}`,
        error.response.status
      );
      return Promise.reject(fallback);
    }
  );
}
