import type { EmailThread } from "../types/email";

export class GmailService {
  async listThreads(): Promise<EmailThread[]> {
    // TODO: Implement actual Gmail API integration
    return [];
  }

  async sendReply(threadId: string, content: string, assistantProfileId: string): Promise<EmailThread> {
    // TODO: Implement actual reply functionality
    return {
      id: threadId,
      subject: "Re: Thread",
      from: "user@example.com",
      to: "recipient@example.com",
      snippet: content,
      lastMessageDate: new Date().toISOString(),
    };
  }

  async createDraft(threadId: string, content: string, assistantProfileId: string): Promise<EmailThread> {
    // TODO: Implement actual draft creation
    return {
      id: threadId,
      subject: "Draft: Thread",
      from: "user@example.com",
      to: "recipient@example.com",
      snippet: content,
      lastMessageDate: new Date().toISOString(),
    };
  }
}

let gmailService: GmailService | null = null;

export async function getGmailService(): Promise<GmailService> {
  if (!gmailService) {
    gmailService = new GmailService();
  }
  return gmailService;
}
