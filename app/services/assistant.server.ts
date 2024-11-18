import type { AssistantProfile } from "../types/email";

export class AssistantService {
  private profiles: AssistantProfile[] = [
    {
      id: "1",
      name: "Sales Assistant",
      description: "Helps with sales communication",
      tone: "Professional",
      language: "English",
      customInstructions: "Focus on building relationships and understanding customer needs",
    },
    {
      id: "2",
      name: "Support Assistant",
      description: "Handles customer support inquiries",
      tone: "Friendly",
      language: "English",
      customInstructions: "Prioritize customer satisfaction and quick resolution",
    },
  ];

  async listProfiles(): Promise<AssistantProfile[]> {
    return this.profiles;
  }

  async createProfile(profile: Omit<AssistantProfile, "id">): Promise<AssistantProfile> {
    const newProfile = {
      ...profile,
      id: Math.random().toString(36).substring(7),
    };
    this.profiles.push(newProfile);
    return newProfile;
  }

  async updateProfile(profile: AssistantProfile): Promise<AssistantProfile> {
    const index = this.profiles.findIndex((p) => p.id === profile.id);
    if (index === -1) {
      throw new Error("Profile not found");
    }
    this.profiles[index] = profile;
    return profile;
  }

  async deleteProfile(id: string): Promise<void> {
    const index = this.profiles.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error("Profile not found");
    }
    this.profiles.splice(index, 1);
  }
}

let assistantService: AssistantService | null = null;

export async function getAssistantService(): Promise<AssistantService> {
  if (!assistantService) {
    assistantService = new AssistantService();
  }
  return assistantService;
}
