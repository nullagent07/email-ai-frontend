import { json } from "@remix-run/node";
import { useLoaderData, useNavigation } from "@remix-run/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { getAssistantService } from "~/services/assistant.server";
import { AssistantProfiles } from "~/components/AssistantProfiles";
import { cn } from "~/lib/utils";
import type { AssistantProfile } from "~/types/email";

export async function loader() {
  const assistantService = await getAssistantService();
  const assistants = await assistantService.listProfiles();

  return json(
    { assistants },
    {
      headers: {
        "Cache-Control": "private, max-age=5"
      }
    }
  );
}

export default function Settings() {
  const { assistants } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";

  const handleProfileSelect = async (profileId: string) => {
    // Здесь можно добавить логику выбора профиля
    console.log('Selected profile:', profileId);
  };

  const handleProfileCreate = async (profile: Omit<AssistantProfile, 'id'>) => {
    // Здесь можно добавить логику создания профиля
    console.log('Creating profile:', profile);
  };

  const handleProfileEdit = async (profile: AssistantProfile) => {
    // Здесь можно добавить логику редактирования профиля
    console.log('Editing profile:', profile);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your assistant profiles and preferences</p>
      </div>

      <div className={cn("space-y-6", isLoading && "opacity-50 pointer-events-none")}>
        <Card>
          <CardHeader>
            <CardTitle>Assistant Profiles</CardTitle>
            <CardDescription>Configure your AI assistant profiles</CardDescription>
          </CardHeader>
          <CardContent>
            <AssistantProfiles 
              profiles={assistants}
              onProfileSelect={handleProfileSelect}
              onProfileCreate={handleProfileCreate}
              onProfileEdit={handleProfileEdit}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
