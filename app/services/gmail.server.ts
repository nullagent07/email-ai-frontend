import type { EmailThread, EmailMessage } from "~/types/email";
import { apiClient } from "~/utils/api.server";

// API endpoints для работы с email
export const emailApiServer = {
  listThreads: (headers = {}) => 
    apiClient.get('http://127.0.0.1:8000/email/gmail/threads', { headers }),
  getThread: (threadId: string, headers = {}) => 
    apiClient.get(`http://127.0.0.1:8000/email/gmail/threads/${threadId}`, { headers }),
  createThread: (threadData: any, headers = {}) => 
    apiClient.post('http://127.0.0.1:8000/email/gmail/threads', threadData, { headers })
};

export async function listThreads(request: Request): Promise<EmailThread[]> {
  const response = await emailApiServer.listThreads({
    Cookie: request.headers.get("Cookie")
  });
  return response.data;
}

export async function getThread(threadId: string, request: Request): Promise<EmailThread> {
  const response = await emailApiServer.getThread(threadId, {
    Cookie: request.headers.get("Cookie")
  });
  return response.data;
}

export async function createThread(
  threadData: any, 
  request: Request
): Promise<EmailThread> {
  const response = await emailApiServer.createThread(
    threadData,
    {
      Cookie: request.headers.get("Cookie")
    }
  );
  return response.data;
}
