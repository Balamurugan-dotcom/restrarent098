import axios from 'axios';

const rawBaseUrl = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');
const isApiInBase = rawBaseUrl.endsWith('/api');

const api = axios.create({
  baseURL: rawBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token from localStorage to every outgoing request and normalize /api prefix
api.interceptors.request.use(
  (config) => {
    if (config.url && !config.url.startsWith('http')) {
      if (isApiInBase) {
        if (config.url.startsWith('/api/')) {
          config.url = config.url.replace(/^\/api/, '');
        } else if (config.url === '/api') {
          config.url = '/';
        }
      } else if (!config.url.startsWith('/api')) {
        config.url = `/api${config.url.startsWith('/') ? '' : '/'}${config.url}`;
      }
    }

    const token = localStorage.getItem('spicegarden_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to format error messages
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);

export default api;
