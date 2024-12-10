export interface EmailThread {
  id: string;
  user_id: string;
  creation_date: string;
  description: string | null;
  status: 'active' | 'closed';
  assistant_id: string | null;
  recipient_email: string;
  recipient_name: string | null;
  sender_email: string;
  sender_name: string | null;
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
  description?: string;
}
