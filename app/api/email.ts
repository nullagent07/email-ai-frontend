import { EmailThread, AssistantProfile } from '../types/email';

const API_BASE = '/api';

export const emailApi = {
  // Email Threads
  getThreads: async (): Promise<EmailThread[]> => {
    const response = await fetch(`${API_BASE}/email/threads`);
    if (!response.ok) throw new Error('Failed to fetch threads');
    return response.json();
  },

  getThread: async (threadId: string): Promise<EmailThread> => {
    const response = await fetch(`${API_BASE}/email/threads/${threadId}`);
    if (!response.ok) throw new Error('Failed to fetch thread');
    return response.json();
  },

  sendReply: async (threadId: string, content: string, assistantProfileId?: string) => {
    const response = await fetch(`${API_BASE}/email/threads/${threadId}/reply`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content,
        assistantProfileId,
      }),
    });
    if (!response.ok) throw new Error('Failed to send reply');
    return response.json();
  },

  archiveThread: async (threadId: string) => {
    const response = await fetch(`${API_BASE}/email/threads/${threadId}/archive`, {
      method: 'POST',
    });
    if (!response.ok) throw new Error('Failed to archive thread');
    return response.json();
  },

  // Assistant Profiles
  getProfiles: async (): Promise<AssistantProfile[]> => {
    const response = await fetch(`${API_BASE}/assistant/profiles`);
    if (!response.ok) throw new Error('Failed to fetch profiles');
    return response.json();
  },

  createProfile: async (profile: Omit<AssistantProfile, 'id'>): Promise<AssistantProfile> => {
    const response = await fetch(`${API_BASE}/assistant/profiles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profile),
    });
    if (!response.ok) throw new Error('Failed to create profile');
    return response.json();
  },

  updateProfile: async (profile: AssistantProfile): Promise<AssistantProfile> => {
    const response = await fetch(`${API_BASE}/assistant/profiles/${profile.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profile),
    });
    if (!response.ok) throw new Error('Failed to update profile');
    return response.json();
  },

  deleteProfile: async (profileId: string) => {
    const response = await fetch(`${API_BASE}/assistant/profiles/${profileId}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete profile');
    return response.json();
  },

  // AI Suggestions
  getAISuggestion: async (threadId: string, profileId: string): Promise<string> => {
    const response = await fetch(
      `${API_BASE}/email/threads/${threadId}/suggest?profileId=${profileId}`
    );
    if (!response.ok) throw new Error('Failed to get AI suggestion');
    const data = await response.json();
    return data.suggestion;
  },
};
