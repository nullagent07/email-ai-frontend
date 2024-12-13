export interface EmailThread {
  id: string;
  user_id: string;
  creation_date: string;
  instructions: string;
  status: 'active' | 'stopped';
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
  profile_id: string;
  instruction: string;
  name: string;
  description?: string;
  model?: string;
  capabilities?: string[];
}

export interface CreateAssistantData {
  name: string;
  instruction: string;
  capabilities: string[];
  model?: string;
  description?: string;
}

export interface CreateThreadData {
  recipient_email: string;
  recipient_name?: string;
  instructions: string;
  status: 'active' | 'stopped';
}

export interface EmailThreadResponse {
  id: string;
  user_email: string;
  recipient_email: string;
  recipient_name?: string;
  assistant_profile_id: string;
}
