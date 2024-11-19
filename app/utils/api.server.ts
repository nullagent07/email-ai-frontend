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
export const authApiServer = {
  googleLogin: (headers = {}) => apiClient.get('/api/auth/google/login', { headers }),
  googleCallback: (code: string, state: string, headers = {}) => 
    apiClient.get(`/api/auth/google/callback?code=${code}&state=${state}`, { headers }),
  logout: (headers = {}) => apiClient.post('/api/auth/logout', {}, { 
    headers,
    withCredentials: true 
  })
};

// Users endpoints
export const usersApiServer = {
  // getAll: () => apiClient.get('/users'),
  getUser: (headers = {}) => apiClient.get('/api/user/me', { headers }),
  toggleStatus: (userId: string) => apiClient.patch(`/users/${userId}/toggle-status`),
  delete: (userId: string) => apiClient.delete(`/users/${userId}`),
};

const emailApiServer = axios.create({
  baseURL: process.env.API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

export const threadsApiServer = {
  createThread: (threadData: any, cookieHeader?: string | null) => 
    apiClient.post('/api/email/gmail/threads/', threadData, {
      headers: cookieHeader ? {
        Cookie: cookieHeader
      } : undefined
    })
}


// Добавляем метод для создания треда с передачей кук
// const createThread = async (threadData: any, cookieHeader?: string | null) => {
//   console.log('cookieHeader', cookieHeader);
//   return emailApiServer.post('/api/email/gmail/threads/', threadData, {
//     headers: cookieHeader ? {
//       Cookie: cookieHeader
//     } : undefined
//   });
// };

// export { createThread };

// Можно добавлять другие группы эндпоинтов по мере необходимости 