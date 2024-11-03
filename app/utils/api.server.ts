import axios from 'axios';

const API_URL = process.env.API_URL || 'http://127.0.0.1:8000';

if (!process.env.API_URL) {
  console.warn('API_URL не установлен в переменных окружения, используется значение по умолчанию');
}

const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth endpoints
export const authApi = {
  googleLogin: (headers = {}) => apiClient.get('/api/auth/google/login', { headers }),
  googleCallback: (code: string, state: string, headers = {}) => 
    apiClient.get(`/api/auth/google/callback?code=${code}&state=${state}`, { headers })
};

// Users endpoints
export const usersApi = {
  // getAll: () => apiClient.get('/users'),
  getUser: (headers = {}) => apiClient.get('/api/user/me', { headers }),
  toggleStatus: (userId: string) => apiClient.patch(`/users/${userId}/toggle-status`),
  delete: (userId: string) => apiClient.delete(`/users/${userId}`),
};

// Можно добавлять другие группы эндпоинтов по мере необходимости 