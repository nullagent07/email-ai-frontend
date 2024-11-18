import axios from 'axios';

const API_URL = process.env.API_URL || 'http://localhost:8000';

export const emailApi = {
  // Создание нового email потока
  createThread: async (threadData: {
    recipient_email: string;
    recipient_name: string;
  }) => {
    const response = await axios.post(
      `${API_URL}/email/gmail/threads/`,
      threadData,
      {
        withCredentials: true
      }
    );
    return response.data;
  },

  // Получение списка email потоков
  getThreads: async () => {
    const response = await axios.get(`${API_URL}/email/gmail/threads/`, {
      withCredentials: true
    });
    return response.data;
  },

  // Получение конкретного потока
  getThread: async (threadId: string) => {
    const response = await axios.get(
      `${API_URL}/email/gmail/threads/${threadId}`,
      {
        withCredentials: true
      }
    );
    return response.data;
  },

  // Отправка сообщения в существующий поток
  sendMessage: async (threadId: string, message: string) => {
    const response = await axios.post(
      `${API_URL}/email/gmail/threads/${threadId}/messages`,
      { content: message },
      {
        withCredentials: true
      }
    );
    return response.data;
  }
};
