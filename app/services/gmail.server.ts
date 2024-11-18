import type { EmailThread, EmailMessage } from "../types/email";

export class GmailService {
  private threads: EmailThread[] = [
    {
      id: "1",
      subject: "Project Discussion",
      participants: ["john@example.com", "alice@example.com"],
      lastMessageDate: new Date().toISOString(),
      status: "active",
      aiAssistant: {
        profile: "1",
        lastSuggestion: "Consider scheduling a follow-up meeting",
      },
      messages: [
        {
          id: "msg1",
          threadId: "1",
          from: "john@example.com",
          to: ["alice@example.com"],
          subject: "Project Discussion",
          content: "Let's discuss the project timeline",
          date: new Date().toISOString(),
        },
      ],
    },
  ];

  async listThreads(): Promise<EmailThread[]> {
    return this.threads;
  }

  async sendReply(threadId: string, content: string, assistantProfileId: string): Promise<EmailThread> {
    const thread = this.threads.find(t => t.id === threadId);
    if (!thread) {
      throw new Error("Thread not found");
    }

    const newMessage: EmailMessage = {
      id: Math.random().toString(36).substring(7),
      threadId,
      from: "assistant@example.com",
      to: thread.participants.filter(p => p !== "assistant@example.com"),
      subject: `Re: ${thread.subject}`,
      content,
      date: new Date().toISOString(),
    };

    thread.messages.push(newMessage);
    thread.lastMessageDate = newMessage.date;
    return thread;
  }

  async createDraft(threadId: string, content: string, assistantProfileId: string): Promise<EmailThread> {
    const thread = this.threads.find(t => t.id === threadId);
    if (!thread) {
      throw new Error("Thread not found");
    }

    const newMessage: EmailMessage = {
      id: Math.random().toString(36).substring(7),
      threadId,
      from: "assistant@example.com",
      to: thread.participants.filter(p => p !== "assistant@example.com"),
      subject: `Re: ${thread.subject}`,
      content,
      date: new Date().toISOString(),
    };

    thread.messages.push(newMessage);
    thread.status = "draft";
    return thread;
  }
}

let gmailService: GmailService | null = null;

export async function getGmailService(): Promise<GmailService> {
  if (!gmailService) {
    gmailService = new GmailService();
  }
  return gmailService;
}
