import type { EmailThread, EmailMessage } from "~/types/email";
import { apiClient } from "~/utils/api.server";

// API endpoints для работы с email
export const emailApiServer = {
  listThreads: (headers = {}) => 
    apiClient.get('/api/email/threads', { headers }),
  getThread: (threadId: string, headers = {}) => 
    apiClient.get(`/api/email/threads/${threadId}`, { headers }),
  sendReply: (threadId: string, content: string, assistantProfileId: string, headers = {}) => 
    apiClient.post(`/api/email/threads/${threadId}/reply`, 
      { content, assistantProfileId }, 
      { headers }
    ),
  createThread: (threadData: any, headers = {}) => 
    apiClient.post('/api/email/threads', threadData, { headers })
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

export async function sendReply(
  threadId: string, 
  content: string, 
  assistantProfileId: string, 
  request: Request
): Promise<EmailThread> {
  const response = await emailApiServer.sendReply(
    threadId, 
    content, 
    assistantProfileId, 
    {
      Cookie: request.headers.get("Cookie")
    }
  );
  return response.data;
}

export async function createThread(
  threadData: any, 
  request: Request
): Promise<EmailThread> {
  const response = await emailApiServer.createThread(threadData, {
    Cookie: request.headers.get("Cookie")
  });
  return response.data;
}
