import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios';
import { setupInterceptors } from './interceptors.js';

const baseURL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

export const axiosInstance: AxiosInstance = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

setupInterceptors(axiosInstance);

export const apiClient = {
  get: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const res = await axiosInstance.get(url, config);
    return res as unknown as T;
  },

  post: async <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => {
    const res = await axiosInstance.post(url, data, config);
    return res as unknown as T;
  },

  put: async <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => {
    const res = await axiosInstance.put(url, data, config);
    return res as unknown as T;
  },

  patch: async <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => {
    const res = await axiosInstance.patch(url, data, config);
    return res as unknown as T;
  },

  delete: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const res = await axiosInstance.delete(url, config);
    return res as unknown as T;
  },
};
