import axios from 'axios';

const API_URL = process.env.API_URL || 'http://localhost:8000';

export const authApi = {
  getGoogleLoginUrl: async () => {
    const response = await axios.get(`${API_URL}/auth/google/login`);
    return response.data.authorization_url;
  },

  logout: async () => {
    await axios.post(`${API_URL}/auth/logout`, {}, {
      withCredentials: true
    });
  },

  // Проверка статуса аутентификации
  checkAuth: async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/status`, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      return null;
    }
  }
};
