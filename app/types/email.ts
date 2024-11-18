export interface EmailThread {
  id: string;
  subject: string;
  participants: string[];
  lastMessageDate: string;
  status: 'active' | 'archived' | 'draft';
  aiAssistant: {
    profile: string;
    lastSuggestion?: string;
  };
  messages: EmailMessage[];
}

export interface EmailMessage {
  id: string;
  threadId: string;
  from: string;
  to: string[];
  subject: string;
  content: string;
  date: string;
  attachments?: Attachment[];
}

export interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
}

export interface AssistantProfile {
  id: string;
  name: string;
  description: string;
  tone: string;
  language: string;
  customInstructions?: string;
}
