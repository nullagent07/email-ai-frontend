import { json } from "@remix-run/node";
import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { getAssistantService } from "../services/assistant.server";
import type { AssistantProfile } from "../types/email";

export async function loader({ request }: LoaderFunctionArgs) {
  const assistantService = await getAssistantService();
  const profiles = await assistantService.listProfiles();
  return json(profiles);
}

export async function action({ request }: ActionFunctionArgs) {
  const assistantService = await getAssistantService();

  if (request.method === "POST") {
    const profile = await request.json() as Omit<AssistantProfile, "id">;
    const newProfile = await assistantService.createProfile(profile);
    return json(newProfile);
  }

  if (request.method === "PUT") {
    const profile = await request.json() as AssistantProfile;
    const updatedProfile = await assistantService.updateProfile(profile);
    return json(updatedProfile);
  }

  if (request.method === "DELETE") {
    const { id } = await request.json();
    await assistantService.deleteProfile(id);
    return json({ success: true });
  }

  throw new Error(`Method ${request.method} not allowed`);
}
