import axios, { AxiosError, AxiosResponse } from "axios";

const baseURL = (import.meta.env.VITE_API_BASE_URL as string) || "http://localhost:8080/api/v1";

console.log('🔧 [API] Initializing axios with baseURL:', baseURL);
console.log('🔧 [API] import.meta.env.VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);
console.log('🔧 [API] All env vars:', import.meta.env);

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" }
});

// Request interceptor: attach Authorization header from localStorage token
api.interceptors.request.use((config) => {
  console.log('📤 [API] Request interceptor - URL:', config.url, 'Method:', config.method);
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = config.headers || {};
    (config.headers as Record<string, any>)['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: handle 401 errors
api.interceptors.response.use(
  (res: AxiosResponse) => res,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      clearToken();
    }
    return Promise.reject(error);
  }
);

export function setToken(token: string) {
  localStorage.setItem('token', token);
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export function clearToken() {
  localStorage.removeItem('token');
  delete api.defaults.headers.common['Authorization'];
}

export default api;