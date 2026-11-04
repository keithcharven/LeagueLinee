import axios from 'axios';

export const TOKEN_KEY = 'leagueline_token';
export const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  timeout: 15000,
});

// Attach the JWT issued by the Spring Boot backend after Google sign-in.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Expired or invalid token: clear it and let AuthContext sign the user out.
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      window.dispatchEvent(new Event('auth:expired'));
    }
    return Promise.reject(error);
  }
);

export default api;
