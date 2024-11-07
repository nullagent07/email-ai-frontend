import axios from 'axios';

type ThreadData = {
  email: string;
  name: string;
  assistant_description: string;
};

const BASE_URL = 'http://127.0.0.1:8000';

const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const threadsApi = {
  async createThread(data: ThreadData) {
    try {
      const response = await apiClient.post('/api/email/gmail/threads', data);
      return response.data;
    } catch (error) {
      throw new Error('Ошибка при создании потока');
    }
  },

  async updateThreadStatus(threadId: string, status: 'active' | 'stopped') {
    try {
      const response = await apiClient.put(`/api/gmail/threads/${threadId}/status`, { status });
      return response.data;
    } catch (error) {
      throw new Error('Ошибка при обновлении статуса');
    }
  },

  async deleteThread(threadId: string) {
    try {
      const response = await apiClient.delete(`/api/gmail/threads/${threadId}`);
      return response.data;
    } catch (error) {
      throw new Error('Ошибка при удалении потока');
    }
  }
}; 