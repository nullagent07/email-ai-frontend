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
  googleLogin: () => apiClient.get('/api/auth/google/login'),
  googleCallback: (code: string, state: string) => 
    apiClient.get(`/auth/google/callback?code=${code}&state=${state}`),
};

// Users endpoints
export const usersApi = {
  getAll: () => apiClient.get('/users'),
  toggleStatus: (userId: string) => apiClient.patch(`/users/${userId}/toggle-status`),
  delete: (userId: string) => apiClient.delete(`/users/${userId}`),
};

// Можно добавлять другие группы эндпоинтов по мере необходимости 